#!/usr/bin/env node

/**
 * REQUIRED: Complete development environment setup script
 * One-command setup for new developers joining the project
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log(`
🎯 Development Environment Setup

This script will:
1. Verify environment variables
2. Test database connection
3. Apply database schema
4. Seed with development data
5. Verify everything is working

Starting setup...
`);

async function checkEnvironmentVariables() {
	console.log("📋 Checking environment variables...");

	const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"];

	const missing = required.filter((env) => !process.env[env]);

	if (missing.length > 0) {
		console.error("❌ Missing required environment variables:");
		missing.forEach((env) => console.error(`   - ${env}`));
		console.error("\nPlease add these to your .env.local file");
		process.exit(1);
	}

	console.log("✅ All required environment variables found");
}

async function testDatabaseConnection() {
	console.log("🔌 Testing database connection...");

	try {
		execSync("bun run test:supabase", { stdio: "inherit" });
		console.log("✅ Database connection successful");
	} catch (error) {
		console.error("❌ Database connection failed");
		console.error("Please check your Supabase credentials");
		process.exit(1);
	}
}

async function applySchema() {
	console.log("🗄️ Applying database schema...");

	try {
		execSync("bun run db:push", { stdio: "inherit" });
		console.log("✅ Database schema applied");
	} catch (error) {
		console.error("❌ Schema application failed");
		console.error("Please check your database permissions");
		process.exit(1);
	}
}

async function seedDevelopmentData() {
	console.log("🌱 Seeding development data...");

	try {
		execSync("bun run seed:dev", { stdio: "inherit" });
		console.log("✅ Development data seeded successfully");
	} catch (error) {
		console.error("❌ Data seeding failed");
		console.error("Check the error messages above for details");
		process.exit(1);
	}
}

async function verifySetup() {
	console.log("🔍 Verifying setup...");

	try {
		execSync("bun run seed:verify", { stdio: "inherit" });
		console.log("✅ Setup verification successful");
	} catch (error) {
		console.error("❌ Setup verification failed");
		console.error("Some data may be missing or corrupted");
		process.exit(1);
	}
}

async function showSuccessMessage() {
	console.log(`
🎉 Development Environment Setup Complete!

Your local development environment is now ready with:
- ✅ Database connection verified
- ✅ Schema applied and up-to-date  
- ✅ Development data seeded
- ✅ Data integrity verified

Next steps:
1. Start the development server:
   bun run dev

2. Open your browser to:
   http://localhost:3000

3. Explore the seeded data:
   - Browse businesses
   - Read reviews
   - Test search functionality

Useful commands:
- bun run seed:clear     # Reset development data
- bun run seed:minimal   # Quick minimal dataset
- bun run seed:verify    # Check data integrity
- bun run seed --help    # See all seeding options

Happy coding! 🚀
  `);
}

async function main() {
	try {
		await checkEnvironmentVariables();
		await testDatabaseConnection();
		await applySchema();
		await seedDevelopmentData();
		await verifySetup();
		await showSuccessMessage();
	} catch (error) {
		console.error("\n❌ Setup failed:", error.message);
		process.exit(1);
	}
}

// Handle interruption
process.on("SIGINT", () => {
	console.log("\n\n🛑 Setup interrupted");
	process.exit(0);
});

main();
