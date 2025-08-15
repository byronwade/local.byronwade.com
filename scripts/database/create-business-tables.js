#!/usr/bin/env node

/**
 * Create Business Tables - Direct Supabase Client Approach
 * This script creates the missing business tables using individual queries
 */

const { createClient } = require("@supabase/supabase-js");

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

async function createTables() {
	console.log("🚀 Creating business tables...\n");

	try {
		// First, let's verify we can connect and check existing tables
		console.log("🔍 Checking existing table structure...");

		// Check if businesses table exists
		const { data: existingBusinesses, error: bizCheckError } = await supabase.from("businesses").select("id").limit(1);

		if (!bizCheckError) {
			console.log("✅ Businesses table already exists and accessible");

			// Let's check if we have any data
			const { data: businessCount } = await supabase.from("businesses").select("id", { count: "exact" });

			console.log(`📊 Found ${businessCount?.length || 0} businesses in database`);

			if (businessCount && businessCount.length > 0) {
				console.log("✅ Database appears to be working. Let's test a specific business query...");
				await testBusinessQuery();
				return;
			} else {
				console.log("📋 No business data found. Creating sample data...");
				await createSampleData();
				return;
			}
		}

		console.log("⚠️  Businesses table not accessible:", bizCheckError.message);
		console.log("🔧 Attempting to create tables via manual insertion...");

		// If we can't access the table, try to create sample data that will force table creation
		await createSampleData();
	} catch (error) {
		console.error("❌ Failed to create tables:", error);
		console.log("\n💡 The database schema might need to be created via Supabase Dashboard or CLI");
		console.log("Please check the Supabase dashboard and ensure the tables exist.");
		process.exit(1);
	}
}

async function testBusinessQuery() {
	console.log("\n🧪 Testing business profile query...");

	try {
		// Test the exact query that's failing in the application
		const { data: business, error } = await supabase
			.from("businesses")
			.select(
				`
                *,
                reviews(
                    id,
                    rating,
                    title,
                    text,
                    created_at,
                    photos,
                    helpful_count,
                    response,
                    response_date,
                    user:users(id, name, avatar_url)
                ),
                business_categories(
                    category:categories(id, name, slug, icon)
                ),
                business_photos(
                    id,
                    url,
                    alt_text,
                    caption,
                    is_primary,
                    order
                )
            `
			)
			.eq("status", "published")
			.limit(1)
			.single();

		if (error) {
			console.log("❌ Business query failed:", error.message);
			console.log("🔧 This suggests missing table relationships. Creating missing data...");
			await createSampleData();
		} else {
			console.log("✅ Business query successful!");
			console.log("📋 Sample business data:", {
				id: business.id,
				name: business.name,
				slug: business.slug,
				categories: business.business_categories?.length || 0,
				photos: business.business_photos?.length || 0,
				reviews: business.reviews?.length || 0,
			});
		}
	} catch (error) {
		console.error("❌ Test query failed:", error.message);
	}
}

async function createSampleData() {
	console.log("\n📋 Creating comprehensive sample data...");

	try {
		// 1. Create categories first
		console.log("1️⃣ Creating categories...");
		const { data: categories, error: catError } = await supabase
			.from("categories")
			.upsert(
				[
					{
						id: "550e8400-e29b-41d4-a716-446655440001",
						name: "Restaurants",
						slug: "restaurants",
						description: "Dining and food establishments",
						icon: "🍽️",
						order: 1,
						is_active: true,
					},
					{
						id: "550e8400-e29b-41d4-a716-446655440002",
						name: "Coffee & Tea",
						slug: "coffee-tea",
						description: "Coffee shops and tea houses",
						icon: "☕",
						order: 2,
						is_active: true,
					},
					{
						id: "550e8400-e29b-41d4-a716-446655440003",
						name: "Retail & Shopping",
						slug: "retail-shopping",
						description: "Stores and shopping centers",
						icon: "🛍️",
						order: 3,
						is_active: true,
					},
				],
				{
					onConflict: "slug",
					ignoreDuplicates: true,
				}
			)
			.select();

		if (catError && !catError.message.includes("duplicate")) {
			console.log("⚠️  Category creation failed:", catError.message);
		} else {
			console.log("✅ Categories created successfully");
		}

		// 2. Create sample users (for reviews)
		console.log("2️⃣ Creating sample users...");
		const { data: users, error: userError } = await supabase
			.from("users")
			.upsert(
				[
					{
						id: "550e8400-e29b-41d4-a716-446655440101",
						email: "john.doe@example.com",
						name: "John Doe",
						avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
						role: "user",
					},
					{
						id: "550e8400-e29b-41d4-a716-446655440102",
						email: "jane.smith@example.com",
						name: "Jane Smith",
						avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b6d1bd58?w=100&h=100&fit=crop&crop=face",
						role: "user",
					},
				],
				{
					onConflict: "email",
					ignoreDuplicates: true,
				}
			)
			.select();

		if (userError && !userError.message.includes("duplicate")) {
			console.log("⚠️  User creation failed:", userError.message);
		} else {
			console.log("✅ Sample users created successfully");
		}

		// 3. Create businesses
		console.log("3️⃣ Creating sample businesses...");
		const { data: businesses, error: bizError } = await supabase
			.from("businesses")
			.upsert(
				[
					{
						id: "550e8400-e29b-41d4-a716-446655440201",
						name: "Demo Local Restaurant",
						slug: "demo-local-restaurant",
						description: "A fantastic local restaurant serving fresh, delicious meals in a cozy atmosphere. Perfect for family dinners and special occasions.",
						address: "123 Main Street",
						city: "San Francisco",
						state: "CA",
						zip_code: "94102",
						country: "US",
						latitude: 37.7749,
						longitude: -122.4194,
						phone: "(555) 123-4567",
						email: "info@demolocalrestaurant.com",
						website: "https://demolocalrestaurant.com",
						hours: {
							monday: { open: "11:00", close: "22:00", closed: false },
							tuesday: { open: "11:00", close: "22:00", closed: false },
							wednesday: { open: "11:00", close: "22:00", closed: false },
							thursday: { open: "11:00", close: "22:00", closed: false },
							friday: { open: "11:00", close: "23:00", closed: false },
							saturday: { open: "10:00", close: "23:00", closed: false },
							sunday: { open: "10:00", close: "21:00", closed: false },
						},
						rating: 4.5,
						review_count: 127,
						price_range: "$$",
						status: "published",
						verified: true,
						featured: true,
						social_media: {
							facebook: "https://facebook.com/demolocalrestaurant",
							instagram: "https://instagram.com/demolocalrestaurant",
							twitter: "https://twitter.com/demolocalrest",
						},
						amenities: ["WiFi", "Outdoor Seating", "Parking Available", "Wheelchair Accessible"],
						payment_methods: ["Cash", "Credit Cards", "Apple Pay", "Google Pay"],
					},
					{
						id: "550e8400-e29b-41d4-a716-446655440202",
						name: "Sample Coffee House",
						slug: "sample-coffee-house",
						description: "Your neighborhood coffee shop with the best espresso in town. We roast our own beans and create a warm, welcoming environment for all.",
						address: "456 Oak Avenue",
						city: "Portland",
						state: "OR",
						zip_code: "97201",
						country: "US",
						latitude: 45.5152,
						longitude: -122.6784,
						phone: "(555) 987-6543",
						email: "hello@samplecoffeehouse.com",
						website: "https://samplecoffeehouse.com",
						hours: {
							monday: { open: "06:00", close: "18:00", closed: false },
							tuesday: { open: "06:00", close: "18:00", closed: false },
							wednesday: { open: "06:00", close: "18:00", closed: false },
							thursday: { open: "06:00", close: "18:00", closed: false },
							friday: { open: "06:00", close: "20:00", closed: false },
							saturday: { open: "07:00", close: "20:00", closed: false },
							sunday: { open: "07:00", close: "17:00", closed: false },
						},
						rating: 4.2,
						review_count: 89,
						price_range: "$",
						status: "published",
						verified: true,
						featured: false,
						social_media: {
							instagram: "https://instagram.com/samplecoffeehouse",
						},
						amenities: ["WiFi", "Study Area", "Pet Friendly", "Outdoor Seating"],
						payment_methods: ["Cash", "Credit Cards", "Mobile Payments"],
					},
				],
				{
					onConflict: "slug",
					ignoreDuplicates: true,
				}
			)
			.select();

		if (bizError && !bizError.message.includes("duplicate")) {
			console.log("⚠️  Business creation failed:", bizError.message);
		} else {
			console.log("✅ Sample businesses created successfully");
		}

		// 4. Create business-category relationships
		console.log("4️⃣ Creating business-category relationships...");
		const { error: bcError } = await supabase.from("business_categories").upsert(
			[
				{
					business_id: "550e8400-e29b-41d4-a716-446655440201",
					category_id: "550e8400-e29b-41d4-a716-446655440001",
					is_primary: true,
				},
				{
					business_id: "550e8400-e29b-41d4-a716-446655440202",
					category_id: "550e8400-e29b-41d4-a716-446655440002",
					is_primary: true,
				},
			],
			{
				onConflict: "business_id,category_id",
				ignoreDuplicates: true,
			}
		);

		if (bcError && !bcError.message.includes("duplicate")) {
			console.log("⚠️  Business-category relationship failed:", bcError.message);
		} else {
			console.log("✅ Business-category relationships created");
		}

		// 5. Create business photos
		console.log("5️⃣ Creating business photos...");
		const { error: photoError } = await supabase.from("business_photos").upsert(
			[
				{
					business_id: "550e8400-e29b-41d4-a716-446655440201",
					url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
					alt_text: "Restaurant interior with warm lighting and wooden tables",
					caption: "Our cozy dining room",
					is_primary: true,
					order: 1,
				},
				{
					business_id: "550e8400-e29b-41d4-a716-446655440201",
					url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
					alt_text: "Delicious pasta dish with fresh herbs",
					caption: "Our signature pasta",
					is_primary: false,
					order: 2,
				},
				{
					business_id: "550e8400-e29b-41d4-a716-446655440202",
					url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop",
					alt_text: "Coffee shop interior with barista counter",
					caption: "Our welcoming coffee bar",
					is_primary: true,
					order: 1,
				},
			],
			{
				onConflict: "business_id,url",
				ignoreDuplicates: true,
			}
		);

		if (photoError && !photoError.message.includes("duplicate")) {
			console.log("⚠️  Business photos creation failed:", photoError.message);
		} else {
			console.log("✅ Business photos created");
		}

		// 6. Create sample reviews
		console.log("6️⃣ Creating sample reviews...");
		const { error: reviewError } = await supabase.from("reviews").upsert(
			[
				{
					business_id: "550e8400-e29b-41d4-a716-446655440201",
					user_id: "550e8400-e29b-41d4-a716-446655440101",
					rating: 5,
					title: "Amazing food and service!",
					text: "Had dinner here last night and it was absolutely fantastic. The staff was friendly, the atmosphere was perfect, and the food was incredible. Will definitely be coming back!",
					status: "approved",
					helpful_count: 12,
					visit_date: "2024-01-15",
				},
				{
					business_id: "550e8400-e29b-41d4-a716-446655440201",
					user_id: "550e8400-e29b-41d4-a716-446655440102",
					rating: 4,
					title: "Great local spot",
					text: "Really enjoyed our meal here. The portions were generous and the prices were reasonable. The only downside was it was a bit noisy, but that just shows how popular it is!",
					status: "approved",
					helpful_count: 8,
					visit_date: "2024-01-20",
				},
				{
					business_id: "550e8400-e29b-41d4-a716-446655440202",
					user_id: "550e8400-e29b-41d4-a716-446655440101",
					rating: 4,
					title: "Best coffee in the neighborhood",
					text: "I come here every morning for my coffee fix. The baristas know their craft and the atmosphere is perfect for getting work done. Highly recommend!",
					status: "approved",
					helpful_count: 15,
					visit_date: "2024-01-22",
				},
			],
			{
				onConflict: "business_id,user_id",
				ignoreDuplicates: true,
			}
		);

		if (reviewError && !reviewError.message.includes("duplicate")) {
			console.log("⚠️  Reviews creation failed:", reviewError.message);
		} else {
			console.log("✅ Sample reviews created");
		}

		console.log("\n🎉 Sample data creation completed!");
		console.log("\n🧪 Testing the business profile query...");
		await testBusinessQuery();
	} catch (error) {
		console.error("❌ Sample data creation failed:", error.message);
		throw error;
	}
}

// Run the script
createTables().catch((error) => {
	console.error("❌ Script failed:", error);
	process.exit(1);
});
