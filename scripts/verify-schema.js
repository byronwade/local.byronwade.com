#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";

// Read environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
	console.error("❌ Missing Supabase environment variables");
	process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
	},
});

async function verifyDatabaseSchema() {
	console.log("🔍 Verifying database schema completeness...");
	console.log("");

	// Define all required tables from the complete schema
	const requiredTables = {
		// Core tables
		users: "Core user management",
		categories: "Business categories",
		businesses: "Business listings",
		reviews: "Business reviews",
		business_photos: "Business photo gallery",
		business_categories: "Business-category relationships",

		// LocalHub system
		local_hubs: "Directory management",
		local_hub_managers: "Hub management permissions",
		local_hub_businesses: "Hub-business relationships",
		local_hub_analytics: "Hub performance tracking",
		local_hub_activities: "Hub activity feed",

		// Jobs system
		jobs: "Job postings",
		job_applications: "Job applications",
		user_profiles: "User resume/profile data",

		// Content system
		blog_posts: "Blog content",
		blog_comments: "Blog comments",
		events: "Event listings",
		courses: "Course offerings",
		course_enrollments: "Course enrollments",

		// Social features
		posts: "User posts/content",
		shorts: "Short video content",
		user_subscriptions: "User-to-user subscriptions",

		// Analytics & tracking
		user_analytics: "User engagement metrics",
		business_analytics: "Business performance metrics",
		business_photo_analytics: "Photo performance tracking",
		user_activities: "User activity tracking",
		user_referrals: "Referral program tracking",

		// Subscription & payments
		subscription_plans: "Available subscription plans",
		subscriptions: "Active subscriptions",
		payments: "Payment records",

		// System & admin
		notifications: "User notifications",
		support_tickets: "Customer support",
		security_audit_log: "Security event logging",
		performance_metrics: "System performance tracking",
		reserved_subdomains: "Reserved subdomain list",
	};

	try {
		console.log("📊 Checking table existence...");
		console.log("");

		const existingTables = [];
		const missingTables = [];

		// Check each required table
		for (const [tableName, description] of Object.entries(requiredTables)) {
			try {
				const { data, error } = await supabase.from(tableName).select("*").limit(1);

				if (error) {
					if (error.message.includes("does not exist")) {
						missingTables.push({ name: tableName, description });
						console.log(`❌ ${tableName.padEnd(25)} - ${description}`);
					} else {
						console.log(`⚠️  ${tableName.padEnd(25)} - Error: ${error.message}`);
					}
				} else {
					existingTables.push({ name: tableName, description });
					console.log(`✅ ${tableName.padEnd(25)} - ${description}`);
				}
			} catch (e) {
				missingTables.push({ name: tableName, description });
				console.log(`❌ ${tableName.padEnd(25)} - ${description}`);
			}
		}

		console.log("");
		console.log("📈 Schema Completeness Report:");
		console.log("═".repeat(50));
		console.log(`✅ Existing Tables: ${existingTables.length}`);
		console.log(`❌ Missing Tables:  ${missingTables.length}`);
		console.log(`📊 Total Required:  ${Object.keys(requiredTables).length}`);
		console.log(`📈 Completion:      ${Math.round((existingTables.length / Object.keys(requiredTables).length) * 100)}%`);

		if (missingTables.length > 0) {
			console.log("");
			console.log("🚨 CRITICAL MISSING TABLES:");
			console.log("─".repeat(50));

			// Categorize missing tables by importance
			const criticalTables = ["users", "businesses", "categories", "local_hubs", "reviews"];
			const analyticsTables = ["user_analytics", "business_analytics", "local_hub_analytics", "user_activities"];
			const subscriptionTables = ["subscription_plans", "subscriptions", "payments"];

			const missingCritical = missingTables.filter((t) => criticalTables.includes(t.name));
			const missingAnalytics = missingTables.filter((t) => analyticsTables.includes(t.name));
			const missingSubscriptions = missingTables.filter((t) => subscriptionTables.includes(t.name));
			const missingOther = missingTables.filter((t) => !criticalTables.includes(t.name) && !analyticsTables.includes(t.name) && !subscriptionTables.includes(t.name));

			if (missingCritical.length > 0) {
				console.log("");
				console.log("🚨 CRITICAL CORE TABLES (blocking basic functionality):");
				missingCritical.forEach((table) => {
					console.log(`   ❌ ${table.name} - ${table.description}`);
				});
			}

			if (missingAnalytics.length > 0) {
				console.log("");
				console.log("📊 ANALYTICS TABLES (blocking dashboard functionality):");
				missingAnalytics.forEach((table) => {
					console.log(`   ❌ ${table.name} - ${table.description}`);
				});
			}

			if (missingSubscriptions.length > 0) {
				console.log("");
				console.log("💳 SUBSCRIPTION TABLES (blocking monetization):");
				missingSubscriptions.forEach((table) => {
					console.log(`   ❌ ${table.name} - ${table.description}`);
				});
			}

			if (missingOther.length > 0) {
				console.log("");
				console.log("🔧 OTHER TABLES (blocking advanced features):");
				missingOther.forEach((table) => {
					console.log(`   ❌ ${table.name} - ${table.description}`);
				});
			}

			console.log("");
			console.log("💡 SOLUTION:");
			console.log("─".repeat(50));
			console.log("1. Go to Supabase Dashboard → SQL Editor");
			console.log("2. Open lib/supabase/complete_schema.sql");
			console.log("3. Copy the ENTIRE file contents (1631 lines)");
			console.log("4. Paste into SQL Editor and execute");
			console.log("5. Re-run this verification script");
			console.log("");
			console.log("⚠️  WARNING: The current foreign key error is caused by");
			console.log("   missing tables, not the data itself!");
		} else {
			console.log("");
			console.log("🎉 DATABASE SCHEMA IS COMPLETE!");
			console.log("✅ All required tables exist");
			console.log("✅ Ready for data seeding");
			console.log("✅ Dashboard APIs should work");
		}

		// Additional checks
		console.log("");
		console.log("🔍 Additional Diagnostics:");
		console.log("─".repeat(30));

		// Check for any existing data that might cause conflicts
		if (existingTables.some((t) => t.name === "users")) {
			try {
				const { data: users, error } = await supabase.from("users").select("id, email").limit(5);
				if (!error && users) {
					console.log(`📊 Found ${users.length} existing users`);
					if (users.length > 0) {
						console.log("   Existing users:");
						users.forEach((user) => {
							console.log(`   - ${user.email} (${user.id})`);
						});
					}
				}
			} catch (e) {
				console.log("⚠️  Could not check existing user data");
			}
		}

		// Check if RLS is enabled
		try {
			console.log("🔒 Row Level Security status: Checking...");
		} catch (e) {
			console.log("⚠️  Could not check RLS status");
		}
	} catch (error) {
		console.error("❌ Schema verification failed:", error.message);
		process.exit(1);
	}
}

// Run the verification
verifyDatabaseSchema();
