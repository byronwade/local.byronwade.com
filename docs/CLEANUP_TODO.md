# Cleanup TODO (safe, no feature removal)

## Completed (archived)
- Moved `src/components-old/` to `archive/YYYY-MM-DD/src/components-old/`
- Moved `src/lib-old/` to `archive/YYYY-MM-DD/src/lib-old/`
- Moved backup files: 
  - `src/lib/integrations/available-features-backup.js`
  - `src/lib-old/data/integrations/available-features-backup.js`
- Moved design source: `public/logos/ThorbisLogo.psd` → `docs/design/`
- Added to `.gitignore`: `logs/`, `cache/`

## To Verify (search references and then consolidate)
- Duplicate map components:
  - `src/components/site/map/*`
  - `src/components/layout/map/*`
  Action: keep one canonical location; update imports accordingly.

## To Consolidate (docs)
- Merge `docs/ENVIRONMENT_SETUP.md` and `docs/environment-setup.md` → one canonical doc.

## Keep (in use)
- `public/sw.js` (registered in `src/utils/performanceOrchestrator.js` and `src/utils/initPerformanceSystem.js`)

## Next steps (safe automation)
- Run: `bun run cleanup:unused` and review `unused_exports.txt` (do not remove features; only dead exports)
- Run: `bun run cleanup:imports` (auto-fix unused imports)
