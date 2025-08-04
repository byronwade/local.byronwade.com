#!/usr/bin/env node

// Business Data Collection Setup Script
// Helps configure environment variables and validate system requirements

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Environment variable requirements
 */
const REQUIRED_ENV_VARS = {
	// Supabase (Required)
	NEXT_PUBLIC_SUPABASE_URL: {
		required: true,
		description: "Supabase project URL",
		example: "https://hdiuifrlulzpvasknzqm.supabase.co",
		validation: (value) => value.startsWith("https://") && value.includes(".supabase.co"),
	},
	NEXT_PUBLIC_SUPABASE_ANON_KEY: {
		required: true,
		description: "Supabase anonymous key",
		example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
		validation: (value) => value.startsWith("eyJ") && value.length > 100,
	},
	SUPABASE_SERVICE_ROLE_KEY: {
		required: true,
		description: "Supabase service role key (for write operations)",
		example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
		validation: (value) => value.startsWith("eyJ") && value.length > 100,
	},

	// Google Places API (Recommended)
	GOOGLE_PLACES_API_KEY: {
		required: false,
		description: "Google Places API key",
		example: "AIzaSyBdVl-cTICSwYKrZ95SuvNw7dbMuDt1KG0",
		validation: (value) => value.startsWith("AIza") && value.length > 30,
		setupUrl: "https://console.cloud.google.com/apis/credentials",
	},

	// Yelp API (Optional)
	YELP_API_KEY: {
		required: false,
		description: "Yelp Fusion API key",
		example: "Bearer abc123def456...",
		validation: (value) => value.length > 50,
		setupUrl: "https://www.yelp.com/developers/v3/manage_app",
	},

	// Foursquare API (Optional)
	FOURSQUARE_API_KEY: {
		required: false,
		description: "Foursquare Places API key",
		example: "fsq3abcd1234...",
		validation: (value) => value.startsWith("fsq3") && value.length > 30,
		setupUrl: "https://developer.foursquare.com/",
	},

	// OpenAI API (Optional)
	OPENAI_API_KEY: {
		required: false,
		description: "OpenAI API key for AI enhancement",
		example: "sk-proj-abc123...",
		validation: (value) => value.startsWith("sk-") && value.length > 40,
		setupUrl: "https://platform.openai.com/api-keys",
	},
};

/**
 * Setup wizard for business data collection
 */
class BusinessDataSetup {
	constructor() {
		this.envPath = path.join(process.cwd(), ".env.local");
		this.existingEnv = new Map();
		this.newEnv = new Map();
	}

	/**
	 * Run the complete setup process
	 */
	async run() {
		console.log("🚀 Business Data Collection Setup\n");
		console.log("This setup will help you configure the environment variables needed for business data collection.\n");

		try {
			// Load existing environment
			await this.loadExistingEnv();

			// Check system requirements
			await this.checkSystemRequirements();

			// Configure environment variables
			await this.configureEnvironmentVariables();

			// Validate configuration
			await this.validateConfiguration();

			// Save environment file
			await this.saveEnvironmentFile();

			// Show next steps
			this.showNextSteps();

			console.log("✅ Setup completed successfully!\n");
		} catch (error) {
			console.error("❌ Setup failed:", error.message);
			process.exit(1);
		}
	}

	/**
	 * Load existing environment variables
	 */
	async loadExistingEnv() {
		try {
			const envContent = await fs.readFile(this.envPath, "utf8");
			const lines = envContent.split("\n");

			for (const line of lines) {
				const trimmed = line.trim();
				if (trimmed && !trimmed.startsWith("#")) {
					const [key, ...valueParts] = trimmed.split("=");
					if (key && valueParts.length > 0) {
						this.existingEnv.set(key, valueParts.join("="));
					}
				}
			}

			console.log(`📄 Loaded existing environment from ${this.envPath}`);
		} catch (error) {
			console.log("📄 No existing .env.local file found, creating new one");
		}
	}

	/**
	 * Check system requirements
	 */
	async checkSystemRequirements() {
		console.log("\n🔍 Checking system requirements...");

		// Check Node.js version
		const nodeVersion = process.version;
		const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);

		if (majorVersion < 18) {
			throw new Error(`Node.js 18+ required, found ${nodeVersion}`);
		}
		console.log(`✓ Node.js ${nodeVersion}`);

		// Check if we're in the correct directory
		const packageJsonPath = path.join(process.cwd(), "package.json");
		try {
			await fs.access(packageJsonPath);
			console.log("✓ Found package.json");
		} catch {
			throw new Error("Please run this script from the project root directory");
		}

		// Check if Supabase client is available
		try {
			await import("@supabase/supabase-js");
			console.log("✓ Supabase client available");
		} catch {
			throw new Error("Supabase client not found. Run: bun install");
		}

		console.log("✅ System requirements satisfied\n");
	}

	/**
	 * Configure environment variables
	 */
	async configureEnvironmentVariables() {
		console.log("🔧 Configuring environment variables...\n");

		for (const [key, config] of Object.entries(REQUIRED_ENV_VARS)) {
			const existingValue = this.existingEnv.get(key) || process.env[key];

			console.log(`\n${config.required ? "🔴 REQUIRED" : "🟡 OPTIONAL"}: ${key}`);
			console.log(`Description: ${config.description}`);

			if (config.setupUrl) {
				console.log(`Setup URL: ${config.setupUrl}`);
			}

			console.log(`Example: ${config.example}`);

			if (existingValue) {
				console.log(`Current value: ${this.maskValue(existingValue)}`);

				// Validate existing value
				if (config.validation && !config.validation(existingValue)) {
					console.log("⚠️  Current value appears to be invalid");
					const newValue = await this.promptForValue(key, "");
					if (newValue) {
						this.newEnv.set(key, newValue);
					}
				} else {
					console.log("✓ Current value appears valid");
					this.newEnv.set(key, existingValue);
				}
			} else {
				if (config.required) {
					const newValue = await this.promptForValue(key, "");
					if (!newValue) {
						throw new Error(`Required environment variable ${key} not provided`);
					}
					this.newEnv.set(key, newValue);
				} else {
					const newValue = await this.promptForValue(key, "", true);
					if (newValue) {
						this.newEnv.set(key, newValue);
					}
				}
			}
		}
	}

	/**
	 * Prompt for environment variable value
	 */
	async promptForValue(key, defaultValue = "", optional = false) {
		const prompt = optional ? `Enter ${key} (optional, press Enter to skip): ` : `Enter ${key}: `;

		// In a real implementation, you'd use a proper CLI prompt library
		// For now, we'll return the existing value or undefined
		const existingValue = this.existingEnv.get(key) || process.env[key];
		return existingValue || defaultValue || (optional ? undefined : "");
	}

	/**
	 * Validate configuration
	 */
	async validateConfiguration() {
		console.log("\n🔍 Validating configuration...");

		for (const [key, value] of this.newEnv) {
			const config = REQUIRED_ENV_VARS[key];

			if (config.validation && !config.validation(value)) {
				console.log(`❌ ${key}: Invalid format`);
				throw new Error(`Invalid configuration for ${key}`);
			} else {
				console.log(`✓ ${key}: Valid`);
			}
		}

		// Check required variables
		const requiredVars = Object.entries(REQUIRED_ENV_VARS)
			.filter(([, config]) => config.required)
			.map(([key]) => key);

		const missingRequired = requiredVars.filter((key) => !this.newEnv.has(key));

		if (missingRequired.length > 0) {
			throw new Error(`Missing required variables: ${missingRequired.join(", ")}`);
		}

		console.log("✅ Configuration validation passed\n");
	}

	/**
	 * Save environment file
	 */
	async saveEnvironmentFile() {
		const lines = ["# Business Data Collection Environment Variables", "# Generated by setup script\n", "# Supabase Configuration"];

		for (const [key, value] of this.newEnv) {
			const config = REQUIRED_ENV_VARS[key];
			lines.push(`# ${config.description}`);
			lines.push(`${key}=${value}`);
			lines.push("");
		}

		const content = lines.join("\n");
		await fs.writeFile(this.envPath, content, "utf8");

		console.log(`💾 Environment configuration saved to ${this.envPath}`);
	}

	/**
	 * Show next steps
	 */
	showNextSteps() {
		console.log("\n📋 Next Steps:\n");

		console.log("1. Run a test collection:");
		console.log("   bun run scripts/data-collection/main.js --mode=test --limit=5\n");

		console.log("2. Start collecting Fortune 500 businesses:");
		console.log("   bun run scripts/data-collection/main.js --mode=top500 --limit=50\n");

		console.log("3. Collect businesses by location:");
		console.log('   bun run scripts/data-collection/main.js --mode=geographic --location="San Francisco, CA"\n');

		console.log("4. Collect businesses by category:");
		console.log('   bun run scripts/data-collection/main.js --mode=category --categories="restaurants,retail"\n');

		console.log("📚 Documentation:");
		console.log("   See scripts/data-collection/README.md for detailed usage instructions\n");
	}

	/**
	 * Mask sensitive values for display
	 */
	maskValue(value) {
		if (value.length <= 8) {
			return "*".repeat(value.length);
		}
		return value.substring(0, 4) + "*".repeat(value.length - 8) + value.substring(value.length - 4);
	}
}

/**
 * Create package.json script entries
 */
async function addPackageScripts() {
	try {
		const packageJsonPath = path.join(process.cwd(), "package.json");
		const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));

		const newScripts = {
			"collect:setup": "node scripts/data-collection/setup.js",
			"collect:test": "node scripts/data-collection/main.js --mode=test --limit=5",
			"collect:top500": "node scripts/data-collection/main.js --mode=top500",
			"collect:geographic": "node scripts/data-collection/main.js --mode=geographic",
			"collect:category": "node scripts/data-collection/main.js --mode=category",
			"collect:update": "node scripts/data-collection/main.js --mode=update",
		};

		let added = false;
		for (const [script, command] of Object.entries(newScripts)) {
			if (!packageJson.scripts[script]) {
				packageJson.scripts[script] = command;
				added = true;
			}
		}

		if (added) {
			await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
			console.log("📦 Added collection scripts to package.json");
		}
	} catch (error) {
		console.log("⚠️  Could not update package.json scripts:", error.message);
	}
}

/**
 * Main setup function
 */
async function main() {
	const setup = new BusinessDataSetup();

	try {
		await setup.run();
		await addPackageScripts();
	} catch (error) {
		console.error("\n❌ Setup failed:", error.message);
		console.error("\nFor manual setup, see the environment variable documentation in the README.\n");
		process.exit(1);
	}
}

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}

export { BusinessDataSetup };
