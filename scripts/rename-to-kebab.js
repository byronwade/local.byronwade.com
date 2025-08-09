#!/usr/bin/env node

/**
 * Rename all JS/TS files to kebab-case and update import paths
 * - Processes only within allowed roots (src/, tests/)
 * - Skips archive/, node_modules, .next, logs, cache
 * - Uses git mv when available, falls back to fs.rename
 * - Updates import/require specifiers that reference the old basename
 *
 * IMPORTANT: This is conservative and updates only path segments that end with the old basename.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = process.cwd();
const ROOTS = [path.join(PROJECT_ROOT, 'src'), path.join(PROJECT_ROOT, 'tests')];
const EXCLUDED_DIRS = new Set(['node_modules', '.git', '.next', 'archive', 'logs', 'cache']);
const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

function isDir(p) {
  try { return fs.statSync(p).isDirectory(); } catch { return false; }
}

function listFiles(dir, acc = []) {
  if (!isDir(dir)) return acc;
  for (const entry of fs.readdirSync(dir)) {
    if (EXCLUDED_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      listFiles(full, acc);
    } else {
      const ext = path.extname(full);
      if (EXTS.has(ext)) acc.push(full);
    }
  }
  return acc;
}

function toKebabCase(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
}

function gitAvailable() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function renameFile(oldPath, newPath) {
  const newDir = path.dirname(newPath);
  if (!fs.existsSync(newDir)) fs.mkdirSync(newDir, { recursive: true });
  if (gitAvailable()) {
    try {
      execSync(`git mv -k ${JSON.stringify(oldPath)} ${JSON.stringify(newPath)}`);
      return true;
    } catch {}
  }
  fs.renameSync(oldPath, newPath);
  return true;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function updateImportsForMapping(mapping) {
  const { oldBase, newBase } = mapping;
  const importPattern = new RegExp(
    `((from|require)\\s*['\"]([^'\"]*?)${escapeRegExp(oldBase)}(\\.[jt]sx?)?(?=['\"]))`,
    'g'
  );

  const files = [];
  for (const root of ROOTS) {
    listFiles(root, files);
  }

  let updatedCount = 0;
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    if (!importPattern.test(content)) continue;
    const replaced = content.replace(importPattern, (match) => match.replace(oldBase, newBase));
    if (replaced !== content) {
      fs.writeFileSync(file, replaced);
      updatedCount++;
      console.log(`Updated imports in ${path.relative(PROJECT_ROOT, file)}`);
    }
  }
  return updatedCount;
}

function main() {
  console.log('🔎 Scanning for files to rename to kebab-case...');
  const files = [];
  for (const root of ROOTS) listFiles(root, files);

  const plans = [];
  for (const file of files) {
    const dir = path.dirname(file);
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    const kebab = toKebabCase(base);
    if (base !== kebab) {
      const newPath = path.join(dir, `${kebab}${ext}`);
      plans.push({ oldPath: file, newPath, oldBase: base, newBase: kebab });
    }
  }

  console.log(`Planned renames: ${plans.length}`);
  if (plans.length === 0) {
    console.log('No files require renaming.');
    return;
  }

  for (const p of plans) {
    console.log(`Renaming ${path.relative(PROJECT_ROOT, p.oldPath)} -> ${path.relative(PROJECT_ROOT, p.newPath)}`);
    renameFile(p.oldPath, p.newPath);
  }

  console.log('🔧 Updating import specifiers...');
  let totalUpdated = 0;
  for (const p of plans) {
    totalUpdated += updateImportsForMapping(p);
  }
  console.log(`Import updates applied in ${totalUpdated} files.`);

  console.log('✅ Kebab-case renaming complete. Please run your tests/build.');
}

if (require.main === module) {
  try { main(); } catch (e) { console.error('Fatal error:', e); process.exit(1); }
}

module.exports = { toKebabCase, renameFile };

