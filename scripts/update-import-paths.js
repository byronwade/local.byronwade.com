#!/usr/bin/env node

/**
 * Update Import Paths for Professional Architecture
 * Automatically updates import paths to use the new shared structure
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Configuration
const PROJECT_ROOT = process.cwd();
const APPS_DIR = path.join(PROJECT_ROOT, "apps");

// Import path replacements
const importReplacements = [
	{
		from: /from ['"]@components\//g,
		to: "from '@shared/components/",
		description: "Updated component imports",
	},
	{
		from: /from ['"]@lib\//g,
		to: "from '@shared/lib/",
		description: "Updated lib imports",
	},
	{
		from: /from ['"]@utils\//g,
		to: "from '@shared/utils/",
		description: "Updated utils imports",
	},
	{
		from: /from ['"]@\/components\//g,
		to: "from '@shared/components/",
		description: "Updated relative component imports",
	},
	{
		from: /from ['"]@\/lib\//g,
		to: "from '@shared/lib/",
		description: "Updated relative lib imports",
	},
	{
		from: /from ['"]components\//g,
		to: "from '@shared/components/",
		description: "Updated relative component imports",
	},
	{
		from: /from ['"]lib\//g,
		to: "from '@shared/lib/",
		description: "Updated relative lib imports",
	},
];

// Colors for console output
const colors = {
	green: "\x1b[32m",
	red: "\x1b[31m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	reset: "\x1b[0m",
	bold: "\x1b[1m",
};

function log(color, message) {
	console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
	log(colors.green, `✅ ${message}`);
}

function info(message) {
	log(colors.blue, `ℹ️  ${message}`);
}

function warning(message) {
	log(colors.yellow, `⚠️  ${message}`);
}

/**
 * Update import paths in a single file
 */
function updateFileImports(filePath) {
	if (!fs.existsSync(filePath)) {
		return { updated: false, reason: "File not found" };
	}

	const ext = path.extname(filePath);
	if (![".js", ".jsx", ".ts", ".tsx"].includes(ext)) {
		return { updated: false, reason: "Not a JS/TS file" };
	}

	try {
		let content = fs.readFileSync(filePath, "utf8");
		let updated = false;
		const appliedReplacements = [];

		importReplacements.forEach((replacement) => {
			if (replacement.from.test(content)) {
				content = content.replace(replacement.from, replacement.to);
				updated = true;
				appliedReplacements.push(replacement.description);
			}
		});

		if (updated) {
			fs.writeFileSync(filePath, content);
			return {
				updated: true,
				replacements: appliedReplacements,
				file: path.relative(PROJECT_ROOT, filePath),
			};
		}

		return { updated: false, reason: "No imports to update" };
	} catch (error) {
		return { updated: false, reason: error.message };
	}
}

/**
 * Recursively update all files in a directory
 */
function updateDirectoryImports(dir) {
	if (!fs.existsSync(dir)) {
		warning(`Directory not found: ${dir}`);
		return { totalFiles: 0, updatedFiles: 0 };
	}

	let totalFiles = 0;
	let updatedFiles = 0;
	const updateResults = [];

	function walkDirectory(currentDir) {
		const files = fs.readdirSync(currentDir);

		files.forEach((file) => {
			const filePath = path.join(currentDir, file);
			const stat = fs.statSync(filePath);

			if (stat.isDirectory()) {
				// Skip node_modules and .git
				if (!["node_modules", ".git", ".next"].includes(file)) {
					walkDirectory(filePath);
				}
			} else {
				totalFiles++;
				const result = updateFileImports(filePath);

				if (result.updated) {
					updatedFiles++;
					updateResults.push(result);
					info(`Updated: ${result.file}`);
					result.replacements.forEach((replacement) => {
						console.log(`  • ${replacement}`);
					});
				}
			}
		});
	}

	walkDirectory(dir);

	return { totalFiles, updatedFiles, updateResults };
}

/**
 * Main update function
 */
async function main() {
	log(colors.bold, "🔧 Starting Import Path Updates for Professional Architecture...");

	const results = {
		apps: updateDirectoryImports(APPS_DIR),
		total: { files: 0, updated: 0 },
	};

	// Calculate totals
	results.total.files = results.apps.totalFiles;
	results.total.updated = results.apps.updatedFiles;

	// Generate report
	log(colors.bold, "\n📊 Import Path Update Report");
	log(colors.bold, "==============================");

	console.log(`Total files processed: ${results.total.files}`);
	console.log(`Files updated: ${results.total.updated}`);

	if (results.total.updated > 0) {
		success(`Successfully updated import paths in ${results.total.updated} files`);

		log(colors.bold, "\n✨ Import path updates completed!");
		log(colors.green, "Your apps now use the professional shared architecture.");
	} else {
		info("No import paths needed updating - they may already be correct.");
	}

	log(colors.bold, "\n📋 Next Steps:");
	console.log("1. Test your apps to ensure imports work correctly");
	console.log("2. Update your IDE/editor path mappings if needed");
	console.log("3. Run the build process to verify everything compiles");
}

// Handle interruption gracefully
process.on("SIGINT", () => {
	warning("\n⚠️  Import path update interrupted by user");
	process.exit(0);
});

// Run if called directly
if (require.main === module) {
	main().catch((error) => {
		log(colors.red, `Fatal error: ${error.message}`);
		process.exit(1);
	});
}

module.exports = { main, updateFileImports, updateDirectoryImports };
