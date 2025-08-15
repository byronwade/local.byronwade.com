#!/usr/bin/env node

/**
 * REQUIRED: Specific table seeding script
 * Allows seeding individual tables or data types for targeted testing
 */

const { createServiceRoleClient } = require("../src/lib/database/supabase/client.ts");
const { generateBusinesses } = require("../lib/businessDataGenerator.js");
const { faker } = require("@faker-js/faker");

// Command line argument parsing
const args = process.argv.slice(2);
const operation = args[0];
const count = parseInt(args[1]) || 100;
const flags = args.slice(2);

// Available operations
const operations = {
	users: seedUsers,
	businesses: seedBusinesses,
	reviews: seedReviews,
	clear: clearData,
	"clear-all": clearAllData,
	"reset-sequences": resetSequences,
	verify: verifyData,
};

/**
 * Display help information
 */
function showHelp() {
	console.log(`
🎯 Specific Table Seeding Script

Usage: bun run seed:specific [operation] [count] [options]

Operations:
  users [count]           - Seed specific number of users
  businesses [count]      - Seed specific number of businesses  
  reviews [count]         - Seed specific number of reviews
  clear [table]          - Clear specific table
  clear-all              - Clear all tables (DANGEROUS)
  reset-sequences        - Reset database sequences
  verify                 - Verify data integrity

Options:
  --force                - Force dangerous operations
  --verbose              - Enable verbose logging
  --batch-size [size]    - Override batch size (default: 100)

Examples:
  bun run seed:specific users 500
  bun run seed:specific businesses 1000 --batch-size 50
  bun run seed:specific clear businesses --force
  bun run seed:specific verify
  `);
}

/**
 * Seed specific number of users
 */
async function seedUsers(count) {
	console.log(`👤 Seeding ${count} users...`);

	const supabase = createServiceRoleClient();
	const batchSize = getBatchSize();
	let processed = 0;

	try {
		for (let i = 0; i < count; i += batchSize) {
			const currentBatch = Math.min(batchSize, count - i);

			const userBatch = Array.from({ length: currentBatch }, () => ({
				id: faker.string.uuid(),
				username: faker.internet.username(),
				email: faker.internet.email(),
				created_at: faker.date.past({ years: 2 }).toISOString(),
				updated_at: new Date().toISOString(),
			}));

			const { error } = await supabase.from("users_schema.users").insert(userBatch);

			if (error) {
				console.error(`Batch ${i}-${i + currentBatch} failed:`, error.message);
				continue;
			}

			processed += currentBatch;
			console.log(`Progress: ${processed}/${count} (${((processed / count) * 100).toFixed(1)}%)`);
		}

		console.log(`✅ Successfully seeded ${processed} users`);
	} catch (error) {
		console.error("❌ User seeding failed:", error);
		throw error;
	}
}

/**
 * Seed specific number of businesses
 */
async function seedBusinesses(count) {
	console.log(`🏪 Seeding ${count} businesses...`);

	const supabase = createServiceRoleClient();
	const batchSize = getBatchSize();
	let processed = 0;

	try {
		// Generate business data
		const businessData = generateBusinesses(count);

		// Get company types for mapping
		const { data: companyTypes } = await supabase.from("business_schema.company_types").select("id, name");

		for (let i = 0; i < businessData.length; i += batchSize) {
			const batch = businessData.slice(i, i + batchSize);

			// Transform for database format
			const businessBatch = batch.map((business) => {
				const companyType = companyTypes?.find((ct) => business.categories[0]?.toLowerCase().includes(ct.name.toLowerCase())) || companyTypes?.[0];

				return {
					id: business.id,
					name: business.name,
					alias: business.slug,
					url: `https://example.com/${business.slug}`,
					latitude: business.coordinates.lat,
					longitude: business.coordinates.lng,
					phone: business.phone,
					display_phone: business.phone,
					email: business.email,
					website: business.website,
					rating: business.ratings.overall,
					review_count: business.reviewCount,
					price: business.price,
					transactions: ["pickup", "delivery"],
					is_claimed: business.claimedByOwner,
					is_closed: !business.isOpenNow,
					company_type_id: companyType?.id,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				};
			});

			const { error } = await supabase.from("business_schema.businesses").insert(businessBatch);

			if (error) {
				console.error(`Batch ${i}-${i + batch.length} failed:`, error.message);
				continue;
			}

			processed += batch.length;
			console.log(`Progress: ${processed}/${count} (${((processed / count) * 100).toFixed(1)}%)`);
		}

		console.log(`✅ Successfully seeded ${processed} businesses`);
	} catch (error) {
		console.error("❌ Business seeding failed:", error);
		throw error;
	}
}

/**
 * Seed specific number of reviews
 */
async function seedReviews(count) {
	console.log(`⭐ Seeding ${count} reviews...`);

	const supabase = createServiceRoleClient();
	const batchSize = getBatchSize();
	let processed = 0;

	try {
		// Get businesses and users for relationships
		const [{ data: businesses }, { data: users }] = await Promise.all([supabase.from("business_schema.businesses").select("id").limit(1000), supabase.from("users_schema.users").select("id").limit(1000)]);

		if (!businesses?.length || !users?.length) {
			throw new Error("No businesses or users found. Seed those first.");
		}

		for (let i = 0; i < count; i += batchSize) {
			const currentBatch = Math.min(batchSize, count - i);

			const reviewBatch = Array.from({ length: currentBatch }, () => ({
				business_id: faker.helpers.arrayElement(businesses).id,
				url: `https://example.com/review/${faker.string.uuid()}`,
				text: faker.lorem.paragraph(),
				rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
				time_created: faker.date.past({ years: 1 }).toISOString(),
				user: {
					id: faker.helpers.arrayElement(users).id,
					name: faker.person.fullName(),
					image_url: faker.image.avatar(),
				},
			}));

			const { error } = await supabase.from("business_schema.reviews").insert(reviewBatch);

			if (error) {
				console.error(`Batch ${i}-${i + currentBatch} failed:`, error.message);
				continue;
			}

			processed += currentBatch;
			console.log(`Progress: ${processed}/${count} (${((processed / count) * 100).toFixed(1)}%)`);
		}

		console.log(`✅ Successfully seeded ${processed} reviews`);
	} catch (error) {
		console.error("❌ Review seeding failed:", error);
		throw error;
	}
}

/**
 * Clear specific table
 */
async function clearData(tableName) {
	if (!tableName) {
		console.error("❌ Table name required for clear operation");
		console.log("Usage: bun run seed:specific clear [table_name] --force");
		return;
	}

	if (!flags.includes("--force")) {
		console.error(`❌ Clearing ${tableName} requires --force flag for safety`);
		return;
	}

	console.log(`🧹 Clearing table: ${tableName}...`);

	const supabase = createServiceRoleClient();

	try {
		const { error } = await supabase.from(tableName).delete().neq("id", "00000000-0000-0000-0000-000000000000");

		if (error) {
			throw error;
		}

		console.log(`✅ Successfully cleared ${tableName}`);
	} catch (error) {
		console.error(`❌ Failed to clear ${tableName}:`, error.message);
		throw error;
	}
}

/**
 * Clear all tables (DANGEROUS)
 */
async function clearAllData() {
	if (!flags.includes("--force")) {
		console.error("❌ Clearing all data requires --force flag for safety");
		console.error("This will DELETE ALL DATA in the database!");
		return;
	}

	console.log("🚨 CLEARING ALL DATA - This will delete everything!");
	console.log("Waiting 10 seconds... Press Ctrl+C to cancel");

	await new Promise((resolve) => setTimeout(resolve, 10000));

	const supabase = createServiceRoleClient();

	const tables = ["review_comments", "reviews", "post_comments", "posts", "blog_comments", "blogs", "events", "deals", "services", "products", "certifications", "menu_items", "menu_sections", "menus", "media", "social_media", "payment_types", "attributes", "special_hours", "hours", "locations", "categories", "restaurants", "construction_companies", "business_claims", "businesses", "company_types", "user_roles", "users"];

	try {
		for (const table of tables) {
			console.log(`Clearing ${table}...`);

			const { error } = await supabase.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");

			if (error && !error.message.includes("does not exist")) {
				console.warn(`Warning clearing ${table}: ${error.message}`);
			}
		}

		console.log("✅ All data cleared successfully");
	} catch (error) {
		console.error("❌ Failed to clear all data:", error);
		throw error;
	}
}

/**
 * Reset database sequences
 */
async function resetSequences() {
	console.log("🔄 Resetting database sequences...");

	// Note: This would require direct SQL execution
	// Implementation depends on your specific needs

	console.log("✅ Sequences reset (implementation needed)");
}

/**
 * Verify data integrity
 */
async function verifyData() {
	console.log("🔍 Verifying data integrity...");

	const supabase = createServiceRoleClient();

	try {
		// Count records in main tables
		const [{ count: userCount }, { count: businessCount }, { count: reviewCount }, { count: categoryCount }] = await Promise.all([supabase.from("users_schema.users").select("*", { count: "exact", head: true }), supabase.from("business_schema.businesses").select("*", { count: "exact", head: true }), supabase.from("business_schema.reviews").select("*", { count: "exact", head: true }), supabase.from("business_schema.categories").select("*", { count: "exact", head: true })]);

		console.log("📊 Record counts:");
		console.log(`   Users: ${userCount?.toLocaleString() || 0}`);
		console.log(`   Businesses: ${businessCount?.toLocaleString() || 0}`);
		console.log(`   Reviews: ${reviewCount?.toLocaleString() || 0}`);
		console.log(`   Categories: ${categoryCount?.toLocaleString() || 0}`);

		// Check for orphaned records
		const { data: orphanedReviews } = await supabase
			.from("business_schema.reviews")
			.select(
				`
        id,
        business_id,
        businesses!inner(id)
      `
			)
			.is("businesses.id", null);

		if (orphanedReviews?.length) {
			console.log(`⚠️ Found ${orphanedReviews.length} orphaned reviews`);
		} else {
			console.log("✅ No orphaned reviews found");
		}

		console.log("✅ Data integrity verification complete");
	} catch (error) {
		console.error("❌ Data verification failed:", error);
		throw error;
	}
}

/**
 * Get batch size from flags or default
 */
function getBatchSize() {
	const batchIndex = flags.findIndex((flag) => flag === "--batch-size");
	if (batchIndex !== -1 && flags[batchIndex + 1]) {
		return parseInt(flags[batchIndex + 1]) || 100;
	}
	return 100;
}

/**
 * Main execution function
 */
async function main() {
	if (!operation || operation === "--help" || operation === "-h") {
		showHelp();
		return;
	}

	if (!operations[operation]) {
		console.error(`❌ Unknown operation: ${operation}`);
		console.log(`Available operations: ${Object.keys(operations).join(", ")}`);
		showHelp();
		process.exit(1);
	}

	console.log(`🎯 Running operation: ${operation}\n`);

	try {
		await operations[operation](count);
		console.log("\n🎉 Operation completed successfully!");
	} catch (error) {
		console.error("\n❌ Operation failed:", error.message);

		if (flags.includes("--verbose")) {
			console.error("Full error:", error);
		}

		process.exit(1);
	}
}

// Run the script
main();
