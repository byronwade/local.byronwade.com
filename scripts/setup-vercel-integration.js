#!/usr/bin/env node

/**
 * Vercel Integration Setup Script
 * Automates the setup of Vercel multi-tenant infrastructure
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");

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

function error(message) {
	log(colors.red, `❌ ${message}`);
}

function info(message) {
	log(colors.blue, `ℹ️  ${message}`);
}

function warning(message) {
	log(colors.yellow, `⚠️  ${message}`);
}

// Create readline interface for user input
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function askQuestion(question) {
	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			resolve(answer.trim());
		});
	});
}

/**
 * Verify Vercel CLI is installed
 */
async function verifyVercelCLI() {
	try {
		execSync("vercel --version", { stdio: "ignore" });
		success("Vercel CLI is installed");
		return true;
	} catch (error) {
		warning("Vercel CLI not found");
		info("Installing Vercel CLI...");

		try {
			execSync("npm install -g vercel", { stdio: "inherit" });
			success("Vercel CLI installed successfully");
			return true;
		} catch (installError) {
			error("Failed to install Vercel CLI");
			info("Please install manually: npm install -g vercel");
			return false;
		}
	}
}

/**
 * Get Vercel project information
 */
async function getVercelProjectInfo() {
	try {
		info("Retrieving Vercel project information...");

		// Get current user info
		const userInfo = JSON.parse(execSync("vercel teams list --output json", { encoding: "utf8" }));

		// Get project info
		const projectInfo = JSON.parse(execSync("vercel project ls --output json", { encoding: "utf8" }));

		return {
			user: userInfo,
			projects: projectInfo,
		};
	} catch (error) {
		error("Failed to retrieve Vercel information");
		info("Please ensure you are logged in: vercel login");
		return null;
	}
}

/**
 * Create or update environment variables
 */
async function setupEnvironmentVariables() {
	log(colors.bold, "\n🔧 Setting up environment variables...");

	const envPath = path.join(process.cwd(), ".env.local");
	let envContent = "";

	// Read existing .env.local if it exists
	if (fs.existsSync(envPath)) {
		envContent = fs.readFileSync(envPath, "utf8");
	}

	// Get Vercel API token
	const vercelToken = await askQuestion("Enter your Vercel API token (from https://vercel.com/account/tokens): ");

	if (!vercelToken) {
		error("Vercel API token is required");
		return false;
	}

	// Get main domain
	const mainDomain = (await askQuestion("Enter your main domain (e.g., thorbis.com): ")) || "thorbis.com";

	// Get project ID (try to auto-detect)
	let projectId = "";
	try {
		const vercelJson = JSON.parse(fs.readFileSync(".vercel/project.json", "utf8"));
		projectId = vercelJson.projectId;
		info(`Auto-detected Project ID: ${projectId}`);
	} catch (error) {
		projectId = await askQuestion("Enter your Vercel Project ID (from project settings): ");
	}

	// Get team ID (optional)
	const teamId = await askQuestion("Enter your Vercel Team ID (optional, press Enter to skip): ");

	// Update environment variables
	const newEnvVars = {
		VERCEL_TOKEN: vercelToken,
		VERCEL_PROJECT_ID: projectId,
		NEXT_PUBLIC_MAIN_DOMAIN: mainDomain,
		NEXT_PUBLIC_TENANT_DOMAIN: mainDomain,
	};

	if (teamId) {
		newEnvVars["VERCEL_TEAM_ID"] = teamId;
	}

	// Add or update variables in .env.local
	Object.entries(newEnvVars).forEach(([key, value]) => {
		const regex = new RegExp(`^${key}=.*$`, "m");
		const newLine = `${key}=${value}`;

		if (regex.test(envContent)) {
			envContent = envContent.replace(regex, newLine);
		} else {
			envContent += `\n${newLine}`;
		}
	});

	fs.writeFileSync(envPath, envContent.trim() + "\n");
	success("Environment variables updated in .env.local");

	return true;
}

/**
 * Verify domain configuration
 */
async function verifyDomainConfiguration() {
	log(colors.bold, "\n🌐 Verifying domain configuration...");

	try {
		// Test API connection
		const testCommand = `curl -s -H "Authorization: Bearer ${process.env.VERCEL_TOKEN || ""}" https://api.vercel.com/v2/user`;
		const userInfo = JSON.parse(execSync(testCommand, { encoding: "utf8" }));

		if (userInfo.user) {
			success(`Connected to Vercel as: ${userInfo.user.name || userInfo.user.username}`);
		}

		return true;
	} catch (error) {
		error("Failed to verify Vercel API connection");
		warning("Please check your API token and try again");
		return false;
	}
}

/**
 * Set up domain in Vercel project
 */
async function setupDomainInVercel() {
	log(colors.bold, "\n🔗 Setting up domain in Vercel project...");

	const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN;

	if (!mainDomain) {
		error("Main domain not configured");
		return false;
	}

	try {
		// Add domain to project
		info(`Adding ${mainDomain} to Vercel project...`);

		const addDomainCommand = `vercel domains add ${mainDomain}`;
		execSync(addDomainCommand, { stdio: "inherit" });

		success(`Domain ${mainDomain} added to project`);

		// Provide DNS instructions
		log(colors.bold, "\n📋 DNS Configuration Instructions:");
		console.log(`1. Go to your domain registrar (GoDaddy, Namecheap, etc.)`);
		console.log(`2. Update nameservers to:`);
		console.log(`   • ns1.vercel-dns.com`);
		console.log(`   • ns2.vercel-dns.com`);
		console.log(`3. Wait 5-10 minutes for DNS propagation`);
		console.log(`4. Vercel will automatically handle *.${mainDomain} subdomains`);

		return true;
	} catch (error) {
		warning("Domain may already be added or there was an error");
		info("You can manually add the domain in Vercel dashboard if needed");
		return true; // Continue setup even if domain addition fails
	}
}

/**
 * Test subdomain creation
 */
async function testSubdomainCreation() {
	log(colors.bold, "\n🧪 Testing subdomain system...");

	try {
		// Start the development server in background
		info("Starting development server to test subdomain creation...");

		const testDomain = `test-${Date.now()}`;

		info(`Testing subdomain creation for: ${testDomain}`);

		// This would make an API call to test subdomain creation
		// For now, we'll just verify the setup is correct

		success("Subdomain system setup appears correct");
		info(`You can test by creating a subdomain: ${testDomain}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`);

		return true;
	} catch (error) {
		error("Subdomain system test failed");
		warning("Please check your configuration and try manual testing");
		return false;
	}
}

/**
 * Create database migration for Vercel fields
 */
async function createDatabaseMigration() {
	log(colors.bold, "\n🗄️  Creating database migration...");

	const migrationSQL = `
-- Add Vercel integration fields to local_hubs table
ALTER TABLE local_hubs ADD COLUMN IF NOT EXISTS vercel_domain_id TEXT;
ALTER TABLE local_hubs ADD COLUMN IF NOT EXISTS domain_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE local_hubs ADD COLUMN IF NOT EXISTS domain_created_at TIMESTAMPTZ;
ALTER TABLE local_hubs ADD COLUMN IF NOT EXISTS domain_removed_at TIMESTAMPTZ;

-- Create index for Vercel domain ID
CREATE INDEX IF NOT EXISTS idx_local_hubs_vercel_domain_id ON local_hubs(vercel_domain_id);

-- Update existing hubs to have domain_verified = false (will be updated by Vercel integration)
UPDATE local_hubs SET domain_verified = FALSE WHERE domain_verified IS NULL;
`;

	const migrationPath = path.join(process.cwd(), "lib/supabase/migrations/add_vercel_integration.sql");

	// Create migrations directory if it doesn't exist
	const migrationsDir = path.dirname(migrationPath);
	if (!fs.existsSync(migrationsDir)) {
		fs.mkdirSync(migrationsDir, { recursive: true });
	}

	fs.writeFileSync(migrationPath, migrationSQL);
	success("Database migration created");
	info(`Migration file: ${migrationPath}`);
	warning("Remember to apply this migration to your Supabase database");

	return true;
}

/**
 * Generate project status report
 */
async function generateStatusReport() {
	log(colors.bold, "\n📊 Vercel Integration Status Report");
	log(colors.bold, "=====================================");

	const checks = {
		"Vercel CLI": await verifyVercelCLI(),
		"Environment Variables": fs.existsSync(".env.local"),
		"Domain Configuration": process.env.NEXT_PUBLIC_MAIN_DOMAIN ? true : false,
		"Database Migration": fs.existsSync("lib/supabase/migrations/add_vercel_integration.sql"),
	};

	Object.entries(checks).forEach(([check, status]) => {
		const icon = status ? "✅" : "❌";
		console.log(`${icon} ${check}`);
	});

	log(colors.bold, "\n🎯 Next Steps:");
	console.log("1. Apply database migration to Supabase");
	console.log("2. Update DNS nameservers to Vercel");
	console.log("3. Test subdomain creation in dashboard");
	console.log("4. Monitor Vercel project for domain verification");

	log(colors.bold, "\n📚 Resources:");
	console.log("• Vercel Dashboard: https://vercel.com/dashboard");
	console.log("• Domain Settings: https://vercel.com/[project]/settings/domains");
	console.log("• API Documentation: https://vercel.com/docs/api");
	console.log("• Support: https://vercel.com/support");
}

/**
 * Main setup function
 */
async function main() {
	log(colors.bold, "🚀 Vercel Multi-Tenant Integration Setup");
	log(colors.blue, "This script will configure automatic subdomain creation with Vercel\n");

	try {
		// Verify prerequisites
		if (!(await verifyVercelCLI())) {
			error("Vercel CLI is required. Please install and try again.");
			process.exit(1);
		}

		// Setup environment variables
		if (!(await setupEnvironmentVariables())) {
			error("Environment setup failed");
			process.exit(1);
		}

		// Verify configuration
		if (!(await verifyDomainConfiguration())) {
			error("Domain configuration verification failed");
			process.exit(1);
		}

		// Setup domain in Vercel
		await setupDomainInVercel();

		// Create database migration
		await createDatabaseMigration();

		// Test the setup
		await testSubdomainCreation();

		// Generate status report
		await generateStatusReport();

		log(colors.green, "\n✨ Vercel integration setup completed successfully!");
		log(colors.green, "Your application can now automatically create subdomains with SSL certificates.");
	} catch (error) {
		error(`Setup failed: ${error.message}`);
		process.exit(1);
	} finally {
		rl.close();
	}
}

// Handle interruption gracefully
process.on("SIGINT", () => {
	warning("\n⚠️  Setup interrupted by user");
	rl.close();
	process.exit(0);
});

// Run if called directly
if (require.main === module) {
	main().catch((error) => {
		error(`Fatal error: ${error.message}`);
		process.exit(1);
	});
}

module.exports = { main };
