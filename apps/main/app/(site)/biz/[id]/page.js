import BizProfileClient from "./BizProfileClient";
import { BusinessDataFetchers } from "@lib/supabase/server";
import { notFound } from "next/navigation";
import { generateAdvancedServerSEO } from "@lib/utils/advancedServerSEO";

// Generate metadata for SEO
export async function generateMetadata({ params }) {
	const resolvedParams = await params;
	const startTime = performance.now();

	try {
		const { data, error } = await BusinessDataFetchers.getBusinessProfile(resolvedParams.id);
		const business = data;

		const duration = performance.now() - startTime;
		console.log(`Metadata generation completed in ${duration.toFixed(2)}ms for ID: ${resolvedParams.id}`);

		// If database query fails, use mock data for metadata
		if (error || !business) {
			console.warn("Metadata generation using fallback data:", error?.message || "No business data");

			// Return basic metadata for mock business
			return {
				title: `Demo Local Business - San Francisco, CA | Thorbis`,
				description: "This is a sample business used for testing the application. The database is not fully configured yet.",
				keywords: ["Demo Local Business", "Restaurant", "San Francisco, CA", "reviews", "local business", "San Francisco", "CA"],
				openGraph: {
					title: `Demo Local Business - San Francisco, CA`,
					description: "This is a sample business used for testing the application. The database is not fully configured yet.",
					url: `https://www.thorbis.com/biz/demo-local-business`,
					siteName: "Thorbis",
					images: [
						{
							url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
							width: 800,
							height: 600,
							alt: "Demo Local Business - Business exterior",
						},
					],
					locale: "en_US",
					type: "website",
				},
				twitter: {
					card: "summary_large_image",
					title: `Demo Local Business - San Francisco, CA`,
					description: "This is a sample business used for testing the application. The database is not fully configured yet.",
					images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"],
				},
				alternates: {
					canonical: `https://www.thorbis.com/biz/demo-local-business`,
				},
				robots: "index, follow",
				other: {
					"business:contact_data:street_address": "123 Main Street",
					"business:contact_data:locality": "San Francisco",
					"business:contact_data:region": "CA",
					"business:contact_data:postal_code": "94102",
					"business:contact_data:country_name": "US",
					"business:contact_data:phone_number": "(555) 123-4567",
					"business:contact_data:website": "https://demolocalbusiness.com",
				},
			};
		}

		// Use advanced SEO system for comprehensive metadata generation
		try {
			const advancedMetadata = await generateAdvancedServerSEO(
				{
					type: "business",
					data: {
						...business,
						id: business.id,
						city: business.city,
						state: business.state,
					},
					path: `/biz/${business.slug || business.id}`,
					breadcrumbs: [
						{ name: "Home", url: "https://www.thorbis.com" },
						{ name: "Businesses", url: "https://www.thorbis.com/business" },
						{ name: business.name, url: `https://www.thorbis.com/biz/${business.slug || business.id}` },
					],
				},
				{
					enableAdvancedOptimization: true,
					enableAIOptimization: true,
					enableCommunityStrategy: true,
					enableTopicalAuthority: true,
					enableGrowthStrategy: true,
				}
			);

			if (advancedMetadata) {
				const duration = performance.now() - startTime;
				console.log(`Advanced metadata generation completed in ${duration.toFixed(2)}ms for ID: ${resolvedParams.id}`);
				return advancedMetadata;
			}
		} catch (advancedError) {
			console.warn("Advanced SEO generation failed, falling back to basic metadata:", advancedError.message);
		}

		// Fallback to basic metadata if advanced fails
		const businessName = business.name;
		const businessDescription = business.description || `Find ${businessName} in ${business.city}, ${business.state}. Read reviews, view photos, and get contact information.`;
		const businessLocation = `${business.city}, ${business.state}`;

		return {
			title: `${businessName} - ${businessLocation} | Thorbis`,
			description: businessDescription.length > 160 ? businessDescription.substring(0, 157) + "..." : businessDescription,
			keywords: [businessName, business.business_categories?.[0]?.category?.name || "business", businessLocation, "reviews", "local business", business.city, business.state],
			openGraph: {
				title: `${businessName} - ${businessLocation}`,
				description: businessDescription,
				url: `https://www.thorbis.com/biz/${business.slug || business.id}`,
				siteName: "Thorbis",
				images: business.business_photos?.filter((photo) => photo.is_primary)?.[0]?.url
					? [
							{
								url: business.business_photos.filter((photo) => photo.is_primary)[0].url,
								width: 800,
								height: 600,
								alt: `${businessName} - ${business.business_photos.filter((photo) => photo.is_primary)[0].alt_text || "Business photo"}`,
							},
						]
					: business.photos?.[0]
						? [
								{
									url: business.photos[0],
									width: 800,
									height: 600,
									alt: `${businessName} - Business photo`,
								},
							]
						: [],
				locale: "en_US",
				type: "website",
			},
			twitter: {
				card: "summary_large_image",
				title: `${businessName} - ${businessLocation}`,
				description: businessDescription,
				images: business.business_photos?.filter((photo) => photo.is_primary)?.[0]?.url ? [business.business_photos.filter((photo) => photo.is_primary)[0].url] : business.photos?.[0] ? [business.photos[0]] : [],
			},
			alternates: {
				canonical: `https://www.thorbis.com/biz/${business.slug || business.id}`,
			},
			robots: "index, follow",
			other: {
				"business:contact_data:street_address": business.address,
				"business:contact_data:locality": business.city,
				"business:contact_data:region": business.state,
				"business:contact_data:postal_code": business.zip_code,
				"business:contact_data:country_name": business.country,
				"business:contact_data:phone_number": business.phone,
				"business:contact_data:website": business.website,
			},
		};
	} catch (unexpectedError) {
		const duration = performance.now() - startTime;
		console.error("Metadata generation failed:", {
			businessId: resolvedParams.id,
			error: unexpectedError.message,
			stack: unexpectedError.stack,
			duration: `${duration.toFixed(2)}ms`,
			timestamp: new Date().toISOString(),
		});

		// Return fallback metadata
		return {
			title: "Business Profile | Thorbis",
			description: "Local business directory and reviews.",
		};
	}
}

// Server-side data fetching
async function getBusinessData(businessId) {
	const startTime = performance.now();

	try {
		const { data, error } = await BusinessDataFetchers.getBusinessProfile(businessId);
		const business = data;

		const duration = performance.now() - startTime;
		console.log(`Business profile fetch completed in ${duration.toFixed(2)}ms for ID: ${businessId}`);

		if (error || !business) {
			console.warn("Database query failed, using fallback mock data:", {
				businessId,
				error: error?.message || "No business data",
				duration: `${duration.toFixed(2)}ms`,
				timestamp: new Date().toISOString(),
			});

			// Return mock business data for development
			const mockBusiness = {
				id: businessId,
				name: "Demo Local Business",
				slug: "demo-local-business",
				description: "This is a sample business used for testing the application. The database is not fully configured yet.",
				address: "123 Main Street",
				city: "San Francisco",
				state: "CA",
				zip_code: "94102",
				country: "US",
				latitude: 37.7749,
				longitude: -122.4194,
				phone: "(555) 123-4567",
				email: "info@demolocalbusiness.com",
				website: "https://demolocalbusiness.com",
				hours: {
					monday: { open: "09:00", close: "17:00", closed: false },
					tuesday: { open: "09:00", close: "17:00", closed: false },
					wednesday: { open: "09:00", close: "17:00", closed: false },
					thursday: { open: "09:00", close: "17:00", closed: false },
					friday: { open: "09:00", close: "17:00", closed: false },
					saturday: { open: "10:00", close: "16:00", closed: false },
					sunday: { closed: true },
				},
				rating: 4.5,
				review_count: 42,
				price_range: "$$$",
				status: "published",
				verified: true,
				featured: true,
				// Add service area data
				serviceArea: {
					primary: "San Francisco, CA",
					coverage: "Bay Area",
					cities: ["San Francisco", "Oakland", "San Jose", "Berkeley"],
				},
				// Add business performance metrics
				established: "2018",
				employees: "10-25",
				responseTime: "< 2 hours",
				responseRate: 98,
				// Add services and community data
				detailedServices: ["General Contracting", "Home Renovations", "Kitchen Remodeling", "Bathroom Upgrades", "Electrical Work", "Plumbing Services", "Emergency Repairs", "Project Management"],
				businessUpdates: [
					{
						id: "update-1",
						title: "New Kitchen Renovation Completed",
						content: "Just finished an amazing kitchen transformation in Pacific Heights. Check out the before and after photos!",
						date: "2 days ago",
						image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
					},
					{
						id: "update-2",
						title: "Spring Promotion: 15% Off Bathroom Remodels",
						content: "Limited time offer for all bathroom renovation projects. Professional installation included.",
						date: "1 week ago",
						image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=400&h=300&fit=crop",
					},
				],
				communityInvolvement: [{ activity: "Local Habitat for Humanity volunteer" }, { activity: "Sponsor of neighborhood Little League team" }, { activity: "Free home safety inspections for seniors" }, { activity: "Participant in annual city cleanup day" }],
				photos: [
					{
						id: "mock-photo-1",
						url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
						alt_text: "Business exterior",
						caption: "Welcome to our business",
						is_primary: true,
						order: 1,
					},
				],
				categories: [
					{
						id: "mock-cat-1",
						name: "Restaurant",
						slug: "restaurant",
						icon: "🍽️",
					},
				],
				reviews: [
					{
						id: "mock-review-1",
						rating: 5,
						title: "Great place!",
						text: "Really enjoyed the service and atmosphere.",
						created_at: new Date().toISOString(),
						photos: [],
						helpful_count: 5,
						response: null,
						response_date: null,
						user: {
							id: "mock-user-1",
							name: "John Doe",
							avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
						},
					},
				],
				social_media: {
					facebook: "https://facebook.com/demolocalbusiness",
					instagram: "https://instagram.com/demolocalbusiness",
				},
				amenities: ["WiFi", "Parking", "Wheelchair Accessible"],
				payment_methods: ["Cash", "Credit Cards", "Mobile Payments"],
				businessHighlights: ["Experienced team with 5+ years in the industry", "Fast response times for all customer inquiries", "High-quality service with attention to detail", "Competitive pricing with transparent billing", "Excellent customer satisfaction rating", "Licensed and insured for your peace of mind"],
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};

			console.log("Using mock business data:", {
				businessId,
				businessName: mockBusiness.name,
				duration: `${duration.toFixed(2)}ms`,
			});

			return mockBusiness;
		}

		console.log("Business profile fetched successfully:", {
			businessId,
			businessName: business.name,
			hasReviews: business.reviews?.length > 0,
			hasPhotos: business.business_photos?.length > 0,
			hasCategories: business.business_categories?.length > 0,
			duration: `${duration.toFixed(2)}ms`,
		});

		return business;
	} catch (unexpectedError) {
		const duration = performance.now() - startTime;
		console.error("Unexpected error in getBusinessData, using fallback data:", {
			businessId,
			error: unexpectedError.message,
			stack: unexpectedError.stack,
			duration: `${duration.toFixed(2)}ms`,
			timestamp: new Date().toISOString(),
		});

		// Return mock business data even for unexpected errors
		return {
			id: businessId,
			name: "Demo Local Business",
			slug: "demo-local-business",
			description: "This is a sample business used for testing the application. The database is not fully configured yet.",
			address: "123 Main Street",
			city: "San Francisco",
			state: "CA",
			zip_code: "94102",
			country: "US",
			latitude: 37.7749,
			longitude: -122.4194,
			phone: "(555) 123-4567",
			email: "info@demolocalbusiness.com",
			website: "https://demolocalbusiness.com",
			hours: {
				monday: { open: "09:00", close: "17:00", closed: false },
				tuesday: { open: "09:00", close: "17:00", closed: false },
				wednesday: { open: "09:00", close: "17:00", closed: false },
				thursday: { open: "09:00", close: "17:00", closed: false },
				friday: { open: "09:00", close: "17:00", closed: false },
				saturday: { open: "10:00", close: "16:00", closed: false },
				sunday: { closed: true },
			},
			rating: 4.5,
			review_count: 42,
			price_range: "$$$",
			status: "published",
			verified: true,
			featured: true,
			// Add service area data
			serviceArea: {
				primary: "San Francisco, CA",
				coverage: "Bay Area",
				cities: ["San Francisco", "Oakland", "San Jose", "Berkeley"],
			},
			// Add business performance metrics
			established: "2018",
			employees: "10-25",
			responseTime: "< 2 hours",
			responseRate: 98,
			// Add services and community data
			detailedServices: ["General Contracting", "Home Renovations", "Kitchen Remodeling", "Bathroom Upgrades", "Electrical Work", "Plumbing Services", "Emergency Repairs", "Project Management"],
			businessUpdates: [
				{
					id: "update-1",
					title: "New Kitchen Renovation Completed",
					content: "Just finished an amazing kitchen transformation in Pacific Heights. Check out the before and after photos!",
					date: "2 days ago",
					image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
				},
				{
					id: "update-2",
					title: "Spring Promotion: 15% Off Bathroom Remodels",
					content: "Limited time offer for all bathroom renovation projects. Professional installation included.",
					date: "1 week ago",
					image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=400&h=300&fit=crop",
				},
			],
			communityInvolvement: [{ activity: "Local Habitat for Humanity volunteer" }, { activity: "Sponsor of neighborhood Little League team" }, { activity: "Free home safety inspections for seniors" }, { activity: "Participant in annual city cleanup day" }],
			photos: [
				{
					id: "mock-photo-1",
					url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
					alt_text: "Business exterior",
					caption: "Welcome to our business",
					is_primary: true,
					order: 1,
				},
			],
			categories: [
				{
					id: "mock-cat-1",
					name: "Restaurant",
					slug: "restaurant",
					icon: "🍽️",
				},
			],
			reviews: [
				{
					id: "mock-review-1",
					rating: 5,
					title: "Great place!",
					text: "Really enjoyed the service and atmosphere.",
					created_at: new Date().toISOString(),
					photos: [],
					helpful_count: 5,
					response: null,
					response_date: null,
					user: {
						id: "mock-user-1",
						name: "John Doe",
						avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
					},
				},
			],
			social_media: {
				facebook: "https://facebook.com/demolocalbusiness",
				instagram: "https://instagram.com/demolocalbusiness",
			},
			amenities: ["WiFi", "Parking", "Wheelchair Accessible"],
			payment_methods: ["Cash", "Credit Cards", "Mobile Payments"],
			businessHighlights: ["Experienced team with 5+ years in the industry", "Fast response times for all customer inquiries", "High-quality service with attention to detail", "Competitive pricing with transparent billing", "Excellent customer satisfaction rating", "Licensed and insured for your peace of mind"],
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};
	}
}

export default async function BizProfilePage({ params }) {
	// Await params in the server component
	const resolvedParams = await params;

	// Fetch business data on the server
	const business = await getBusinessData(resolvedParams.id);

	// Handle business not found
	if (!business) {
		notFound();
	}

	// Transform data to match client component expectations
	const transformedBusiness = {
		id: business.id,
		name: business.name,
		slug: business.slug,
		description: business.description,
		address: business.address,
		city: business.city,
		state: business.state,
		zip_code: business.zip_code,
		country: business.country,
		latitude: business.latitude,
		longitude: business.longitude,
		phone: business.phone,
		email: business.email,
		website: business.website,
		hours: business.hours,
		rating: business.rating,
		review_count: business.review_count,
		price_range: business.price_range,
		status: business.status,
		verified: business.verified,
		featured: business.featured,
		// Add serviceArea with safe defaults
		serviceArea: business.serviceArea || {
			primary: business.city && business.state ? `${business.city}, ${business.state}` : null,
			coverage: business.address || null,
			cities: business.city ? [business.city] : [],
		},
		// Add businessHighlights with safe defaults
		businessHighlights: business.businessHighlights || [],
		// Add additional business details for overview
		established: business.established || null,
		employees: business.employees || null,
		responseTime: business.responseTime || business.response_time || null,
		responseRate: business.responseRate || business.response_rate || null,
		// Add services and community data with safe defaults
		detailedServices: business.detailedServices || business.services || [],
		businessUpdates: business.businessUpdates || [],
		communityInvolvement: business.communityInvolvement || [],
		photos:
			business.business_photos?.map((photo) => ({
				id: photo.id,
				url: photo.url,
				alt_text: photo.alt_text,
				caption: photo.caption,
				is_primary: photo.is_primary,
				order: photo.order,
			})) ||
			business.photos ||
			[],
		categories:
			business.business_categories?.map((bc) => ({
				id: bc.category.id,
				name: bc.category.name,
				slug: bc.category.slug,
				icon: bc.category.icon,
			})) || [],
		reviews:
			business.reviews?.map((review) => ({
				id: review.id,
				rating: review.rating,
				title: review.title,
				text: review.text,
				created_at: review.created_at,
				photos: review.photos || [],
				helpful_count: review.helpful_count,
				response: review.response,
				response_date: review.response_date,
				user: {
					id: review.user?.id,
					name: review.user?.name,
					avatar_url: review.user?.avatar_url,
				},
			})) || [],
		social_media: business.social_media,
		amenities: business.amenities || [],
		payment_methods: business.payment_methods || [],
		created_at: business.created_at,
		updated_at: business.updated_at,
	};

	// Pass the fetched data to the client component
	return (
		<BizProfileClient
			resolvedParams={resolvedParams}
			initialBusiness={transformedBusiness}
			seoData={{
				title: `${business.name} - ${business.city}, ${business.state}`,
				description: business.description,
				rating: business.rating,
				reviewCount: business.review_count,
				location: `${business.city}, ${business.state}`,
				categories: business.business_categories?.map((bc) => bc.category.name) || [],
			}}
		/>
	);
}
