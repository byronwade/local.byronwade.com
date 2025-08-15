#!/usr/bin/env node

/**
 * REQUIRED: Command-line database seeding script
 * Provides easy interface for seeding database with different configurations
 */

const { runSeeding, SEEDING_CONFIGS } = require("../src/lib/database/supabase/seeder/index.ts");
const { getConfigByEnvironment, validateConfig } = require("../src/lib/database/supabase/seeder/environments.ts");

// Command line argument parsing
const args = process.argv.slice(2);
const environment = args[0] || "development";
const flags = args.slice(1);

// Available options
const options = {
	help: flags.includes("--help") || flags.includes("-h"),
	force: flags.includes("--force") || flags.includes("-f"),
	clear: flags.includes("--clear") || flags.includes("-c"),
	minimal: flags.includes("--minimal") || flags.includes("-m"),
	verbose: flags.includes("--verbose") || flags.includes("-v"),
	dryRun: flags.includes("--dry-run") || flags.includes("-d"),
};

/**
 * Display help information
 */
function showHelp() {
	console.log(`
🌱 Database Seeding Script

Usage: bun run seed [environment] [options]

Environments:
  development   - Local development (default)
  staging      - Staging environment
  production   - Production environment  
  minimal      - Quick testing (small dataset)
  performance  - Performance testing (large dataset)

Options:
  -h, --help      Show this help message
  -f, --force     Force seeding even in production
  -c, --clear     Clear existing data before seeding
  -m, --minimal   Use minimal dataset regardless of environment
  -v, --verbose   Enable verbose logging
  -d, --dry-run   Show what would be seeded without executing

Examples:
  bun run seed                    # Seed development environment
  bun run seed staging           # Seed staging environment
  bun run seed minimal --clear   # Quick test with data clearing
  bun run seed production --force # Force production seeding
  bun run seed --dry-run         # Preview seeding operation

Environment Variables Required:
  NEXT_PUBLIC_SUPABASE_URL       # Your Supabase project URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY  # Your Supabase anon key
  SUPABASE_SERVICE_ROLE_KEY      # Your Supabase service role key

Note: Service role key is required for seeding operations.
  `);
}

/**
 * Validate environment and requirements
 */
function validateEnvironment() {
	const errors = [];

	// Check required environment variables
	if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
		errors.push("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
	}

	if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
		errors.push("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
	}

	if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
		errors.push("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
	}

	// Check if environment is valid
	const config = getConfigByEnvironment(environment);
	if (!config) {
		errors.push(`Unknown environment: ${environment}`);
		errors.push(`Available environments: ${Object.keys(SEEDING_CONFIGS).join(", ")}`);
	}

	return errors;
}

/**
 * Get final seeding configuration
 */
function getFinalConfig() {
	let config = getConfigByEnvironment(environment);

	if (!config) {
		throw new Error(`Unknown environment: ${environment}`);
	}

	// Apply command line overrides
	if (options.minimal) {
		config = {
			...config,
			totalRecords: {
				users: 50,
				businesses: 200,
				reviews: 500,
				categories: 10,
			},
		};
	}

	if (options.clear) {
		config.clearExistingData = true;
	}

	if (options.verbose) {
		config.enablePerformanceTracking = true;
	}

	return config;
}

/**
 * Production safety check
 */
function checkProductionSafety(config) {
	if (config.environment === "production" && !options.force) {
		console.error(`
❌ Production seeding detected!

You are attempting to seed a production environment.
This operation can:
- Modify or delete existing data
- Impact system performance
- Affect live users

To proceed, use: bun run seed production --force

Or seed a different environment:
- bun run seed development
- bun run seed staging
    `);
		process.exit(1);
	}
}

/**
 * Display dry run information
 */
function showDryRun(config) {
	console.log(`
🔍 DRY RUN - Seeding Preview

Environment: ${config.environment}
Clear existing data: ${config.clearExistingData ? "YES" : "NO"}
Batch size: ${config.batchSize}

Records to be created:
- Users: ${config.totalRecords.users.toLocaleString()}
- Businesses: ${config.totalRecords.businesses.toLocaleString()}
- Reviews: ${config.totalRecords.reviews.toLocaleString()}
- Categories: ${config.totalRecords.categories.toLocaleString()}

Performance tracking: ${config.enablePerformanceTracking ? "Enabled" : "Disabled"}

To execute this seeding operation, run without --dry-run flag.
  `);
}

/**
 * Main execution function
 */
async function main() {
	try {
		// Show help if requested
		if (options.help) {
			showHelp();
			process.exit(0);
		}

		console.log("🌱 Starting database seeding...\n");

		// Validate environment
		const validationErrors = validateEnvironment();
		if (validationErrors.length > 0) {
			console.error("❌ Environment validation failed:");
			validationErrors.forEach((error) => console.error(`   - ${error}`));
			console.error("\nUse --help for more information.");
			process.exit(1);
		}

		// Get configuration
		const config = getFinalConfig();

		// Validate configuration
		const configErrors = validateConfig(config);
		if (configErrors.length > 0) {
			console.error("❌ Configuration validation failed:");
			configErrors.forEach((error) => console.error(`   - ${error}`));
			process.exit(1);
		}

		// Production safety check
		checkProductionSafety(config);

		// Dry run preview
		if (options.dryRun) {
			showDryRun(config);
			process.exit(0);
		}

		// Confirmation for destructive operations
		if (config.clearExistingData && environment !== "development") {
			console.log(`⚠️  WARNING: This will clear existing data in ${environment} environment`);
			console.log("Press Ctrl+C to cancel, or wait 5 seconds to continue...\n");

			await new Promise((resolve) => setTimeout(resolve, 5000));
		}

		// Execute seeding
		console.log(`🚀 Seeding ${environment} environment...\n`);

		const startTime = Date.now();
		await runSeeding(config);
		const duration = (Date.now() - startTime) / 1000;

		console.log(`\n🎉 Seeding completed successfully in ${duration.toFixed(2)}s!`);
		console.log(`\nDatabase is ready with:`);
		console.log(`- ${config.totalRecords.users.toLocaleString()} users`);
		console.log(`- ${config.totalRecords.businesses.toLocaleString()} businesses`);
		console.log(`- ${config.totalRecords.reviews.toLocaleString()} reviews`);
		console.log(`- ${config.totalRecords.categories.toLocaleString()} categories`);
	} catch (error) {
		console.error("\n❌ Seeding failed:", error.message);

		if (options.verbose) {
			console.error("\nFull error details:");
			console.error(error);
		}

		process.exit(1);
	}
}

// Handle uncaught errors
process.on("unhandledRejection", (error) => {
	console.error("\n❌ Unhandled error during seeding:", error);
	process.exit(1);
});

process.on("SIGINT", () => {
	console.log("\n\n🛑 Seeding interrupted by user");
	process.exit(0);
});

// Run the script
main();
