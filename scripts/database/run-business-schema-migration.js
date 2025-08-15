#!/usr/bin/env node

/**
 * Database Migration Script - Fix Business Schema
 * This script creates the missing business tables in the public schema
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
	console.error("❌ Missing Supabase credentials");
	console.error("Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local");
	process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function runMigration() {
	console.log("🚀 Starting business schema migration...\n");

	try {
		// Read the SQL migration file
		const sqlFile = path.join(__dirname, "fix-business-schema.sql");
		const sqlContent = fs.readFileSync(sqlFile, "utf8");

		// Split SQL into individual statements
		const statements = sqlContent
			.split(";")
			.map((stmt) => stmt.trim())
			.filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

		console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

		let successCount = 0;
		let errorCount = 0;

		for (let i = 0; i < statements.length; i++) {
			const statement = statements[i];

			// Skip comments and empty statements
			if (statement.startsWith("--") || statement.length < 5) continue;

			try {
				console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);

				const { data, error } = await supabase.rpc("exec_sql", {
					sql: statement + ";",
				});

				if (error) {
					// Some errors are expected (like table already exists)
					if (error.message.includes("already exists") || (error.message.includes("relation") && error.message.includes("already exists"))) {
						console.log(`⚠️  Table/relation already exists (skipping): ${error.message}`);
						successCount++;
					} else {
						console.error(`❌ Error in statement ${i + 1}:`, error.message);
						errorCount++;
					}
				} else {
					console.log(`✅ Statement ${i + 1} executed successfully`);
					successCount++;
				}

				// Add small delay to avoid rate limiting
				await new Promise((resolve) => setTimeout(resolve, 100));
			} catch (err) {
				console.error(`❌ Error executing statement ${i + 1}:`, err.message);
				errorCount++;
			}
		}

		console.log("\n📊 Migration Summary:");
		console.log(`✅ Successful statements: ${successCount}`);
		console.log(`❌ Failed statements: ${errorCount}`);

		// Verify the tables were created
		console.log("\n🔍 Verifying table creation...");
		await verifyTables();

		// Insert sample data
		console.log("\n📋 Creating sample business data...");
		await createSampleData();

		console.log("\n🎉 Migration completed successfully!");
	} catch (error) {
		console.error("❌ Migration failed:", error);
		process.exit(1);
	}
}

async function verifyTables() {
	const requiredTables = ["businesses", "categories", "business_categories", "business_photos", "reviews", "business_hours", "business_certifications"];

	for (const table of requiredTables) {
		try {
			const { data, error } = await supabase.from(table).select("*").limit(1);

			if (error) {
				console.log(`❌ Table '${table}' not accessible: ${error.message}`);
			} else {
				console.log(`✅ Table '${table}' exists and accessible`);
			}
		} catch (err) {
			console.log(`❌ Table '${table}' verification failed: ${err.message}`);
		}
	}
}

async function createSampleData() {
	try {
		// Check if sample data already exists
		const { data: existingBusinesses } = await supabase.from("businesses").select("id").limit(1);

		if (existingBusinesses && existingBusinesses.length > 0) {
			console.log("📋 Sample data already exists, skipping creation");
			return;
		}

		// Create sample categories
		const { data: categories, error: catError } = await supabase
			.from("categories")
			.insert([
				{
					name: "Restaurants",
					slug: "restaurants",
					description: "Dining and food establishments",
					icon: "🍽️",
					order: 1,
				},
				{
					name: "Coffee & Tea",
					slug: "coffee-tea",
					description: "Coffee shops and tea houses",
					icon: "☕",
					order: 2,
				},
			])
			.select();

		if (catError) {
			console.log("⚠️  Categories might already exist:", catError.message);
		} else {
			console.log("✅ Sample categories created");
		}

		// Create sample business
		const { data: business, error: bizError } = await supabase
			.from("businesses")
			.insert([
				{
					name: "Demo Local Business",
					slug: "demo-local-business",
					description: "A sample local business for testing the application functionality.",
					address: "123 Main Street",
					city: "San Francisco",
					state: "CA",
					zip_code: "94102",
					latitude: 37.7749,
					longitude: -122.4194,
					phone: "(555) 123-4567",
					email: "info@demolocalbusiness.com",
					website: "https://demolocalbusiness.com",
					rating: 4.5,
					review_count: 42,
					price_range: "$$",
					status: "published",
					verified: true,
					featured: true,
				},
			])
			.select();

		if (bizError) {
			console.log("⚠️  Sample business creation failed:", bizError.message);
		} else {
			console.log("✅ Sample business created");

			if (business && business[0] && categories && categories[0]) {
				// Link business to category
				const { error: linkError } = await supabase.from("business_categories").insert([
					{
						business_id: business[0].id,
						category_id: categories[0].id,
						is_primary: true,
					},
				]);

				if (linkError) {
					console.log("⚠️  Business-category link failed:", linkError.message);
				} else {
					console.log("✅ Business linked to category");
				}
			}
		}
	} catch (error) {
		console.log("⚠️  Sample data creation failed:", error.message);
	}
}

// Run the migration
runMigration().catch((error) => {
	console.error("❌ Migration script failed:", error);
	process.exit(1);
});
