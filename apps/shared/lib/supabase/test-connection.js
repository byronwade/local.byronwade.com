// REQUIRED: Supabase connection test utility
// Run this to verify your Supabase configuration is working correctly

// Load environment variables from .env.local
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnvFile() {
	try {
		const envPath = resolve(".env.local");
		const envFile = readFileSync(envPath, "utf8");

		envFile.split("\n").forEach((line) => {
			const [key, ...valueParts] = line.split("=");
			if (key && !key.startsWith("#")) {
				const value = valueParts.join("=").trim();
				process.env[key.trim()] = value;
			}
		});

		console.log("✅ Loaded environment variables from .env.local\n");
	} catch (error) {
		console.log("⚠️  Could not load .env.local file");
		console.log("   Make sure .env.local exists in the project root\n");
	}
}

async function testSupabaseConnection() {
	console.log("🧪 Testing Supabase Configuration...\n");

	// Load environment variables
	loadEnvFile();

	try {
		// Load environment variables
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
		const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

		console.log("📋 Environment Variables:");
		console.log(`  • Supabase URL: ${supabaseUrl ? "✅ Loaded" : "❌ Missing"}`);
		console.log(`  • Anon Key: ${supabaseAnonKey ? "✅ Loaded" : "❌ Missing"}`);
		console.log(`  • Service Role Key: ${serviceRoleKey ? "✅ Loaded" : "❌ Missing"}\n`);

		if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
			throw new Error("Missing required environment variables. Please check your .env.local file.");
		}

		// Test basic connection
		const { createClient } = await import("@supabase/supabase-js");

		console.log("🔌 Testing Client Connection...");
		const client = createClient(supabaseUrl, supabaseAnonKey);

		// Test basic connectivity
		const { data, error } = await client.from("businesses").select("count").limit(1);

		if (error && error.code !== "42P01") {
			// 42P01 = relation does not exist (table not created yet)
			console.error("❌ Connection failed:", error.message);
			return false;
		}

		console.log("✅ Client connection successful!\n");

		// Test service role connection
		console.log("🔐 Testing Service Role Connection...");
		const adminClient = createClient(supabaseUrl, serviceRoleKey);

		const { data: adminData, error: adminError } = await adminClient.from("businesses").select("count").limit(1);

		if (adminError && adminError.code !== "42P01") {
			console.error("❌ Service role connection failed:", adminError.message);
			return false;
		}

		console.log("✅ Service role connection successful!\n");

		// Test database schema (check if tables exist)
		console.log("🗄️  Checking Database Schema...");
		const { data: tables, error: schemaError } = await adminClient.rpc("pg_tables", {
			schemaname: "public",
		});

		if (schemaError) {
			console.log("⚠️  Could not check schema - database may need migration");
			console.log("   Run: bun run supabase db push");
		} else {
			console.log("✅ Database schema accessible");
		}

		console.log("\n🎉 Supabase Configuration Test Complete!");
		console.log("📚 Next steps:");
		console.log("   1. Run database migrations: bun run supabase db push");
		console.log("   2. Configure Row Level Security policies");
		console.log("   3. Start using the Supabase client in your app");

		return true;
	} catch (error) {
		console.error("❌ Configuration test failed:", error.message);
		console.log("\n🔧 Troubleshooting:");
		console.log("   1. Check your .env.local file exists and has correct values");
		console.log("   2. Verify your Supabase project is active");
		console.log("   3. Ensure API keys are not expired");
		console.log("   4. Check network connectivity");
		return false;
	}
}

// Export for use in other files
export { testSupabaseConnection };

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	testSupabaseConnection().then((success) => {
		process.exit(success ? 0 : 1);
	});
}
