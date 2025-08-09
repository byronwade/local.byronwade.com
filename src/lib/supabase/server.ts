// REQUIRED: Supabase Server utilities for Next.js 14 (Server Components only)
// Based on: https://www.supaboost.dev/blog/supabase-server-side-rendering-nextjs

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "./client";
import { logger } from "@utils/logger";

/**
 * Create Supabase client for Server Components (App Router)
 * This runs on the server and has access to cookies for auth
 */
export async function createSupabaseServerClient() {
	const startTime = performance.now();

	try {
		const cookieStore = await cookies();

		const client = createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) => {
							cookieStore.set(name, value, options);
						});
					} catch (error) {
						// Server Components cannot set cookies
						// This can happen during static generation
						logger.debug("Cannot set cookies in Server Component");
					}
				},
			},
		});

		const duration = performance.now() - startTime;
		logger.performance(`Supabase Server Client created in ${duration.toFixed(2)}ms`);

		return client;
	} catch (error) {
		logger.error("Failed to create Supabase server client:", error);
		throw error;
	}
}

/**
 * Get current user session on the server
 * Optimized for performance with caching
 */
export async function getServerSession() {
	const startTime = performance.now();

	try {
		const supabase = await createSupabaseServerClient();
		const {
			data: { session },
			error,
		} = await supabase.auth.getSession();

		if (error) {
			logger.error("Session retrieval error:", error);
			return null;
		}

		const duration = performance.now() - startTime;
		logger.performance(`Server session retrieved in ${duration.toFixed(2)}ms`);

		return session;
	} catch (error) {
		logger.error("Failed to get server session:", error);
		return null;
	}
}

/**
 * Get current user on the server
 * Includes user profile data from our database
 */
export async function getServerUser() {
	const startTime = performance.now();

	try {
		const session = await getServerSession();
		if (!session?.user) return null;

		const supabase = await createSupabaseServerClient();

		// Get user profile from our users table
		const { data: userProfile, error } = await supabase.from("users").select("*").eq("id", session.user.id).single();

		if (error) {
			logger.error("User profile retrieval error:", error);
			// Return basic user info from session if profile fetch fails
			return {
				id: session.user.id,
				email: session.user.email,
				name: session.user.user_metadata?.name || null,
			};
		}

		const duration = performance.now() - startTime;
		logger.performance(`Server user retrieved in ${duration.toFixed(2)}ms`);

		return userProfile;
	} catch (error) {
		logger.error("Failed to get server user:", error);
		return null;
	}
}

/**
 * Optimized data fetching for SSR pages
 * Includes caching and error handling
 */
export async function fetchPageData<T>(
	fetcher: () => Promise<T>,
	cacheKey?: string,
	ttlSeconds: number = 300 // 5 minutes default
): Promise<{ data: T | null; error: string | null }> {
	const startTime = performance.now();

	try {
		// TODO: Add Redis/memory cache integration here if needed
		const data = await fetcher();

		const duration = performance.now() - startTime;
		logger.performance(`Page data fetched in ${duration.toFixed(2)}ms`);

		return { data, error: null };
	} catch (error) {
		const duration = performance.now() - startTime;
		logger.error(`Page data fetch failed in ${duration.toFixed(2)}ms:`, error);

		return {
			data: null,
			error: error instanceof Error ? error.message : "Failed to fetch data",
		};
	}
}

/**
 * Common data fetching patterns for business pages
 */
export const BusinessDataFetchers = {
	/**
	 * Check if a string is in UUID format
	 */
	isValidUUID(str: string): boolean {
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		return uuidRegex.test(str);
	},

	/**
	 * Get business with full details for business profile page
	 * Handles both UUID and slug-based queries
	 */
	async getBusinessProfile(businessId: string) {
		const supabase = await createSupabaseServerClient();

		return fetchPageData(async () => {
			// Determine if businessId is UUID or slug
			const isUUID = this.isValidUUID(businessId);
			const queryField = isUUID ? "id" : "slug";

			logger.debug(`Querying business by ${queryField}: ${businessId}`);

			// First, try the full query with relationships
			try {
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
							user_id
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
					.eq(queryField, businessId)
					.eq("status", "published")
					.single();

				if (error) throw error;
				return business;
			} catch (relationshipError) {
				logger.warn("Full relationship query failed, trying simplified query:", relationshipError.message);

				// Fallback: Try simplified query without complex relationships
				try {
					const { data: business, error: simpleError } = await supabase.from("businesses").select("*").eq(queryField, businessId).eq("status", "published").single();

					if (simpleError) throw simpleError;

					// Manually fetch related data if basic business exists
					const businessWithRelations = await this.enrichBusinessData(supabase, business);
					return businessWithRelations;
				} catch (simpleError) {
					logger.error("Simplified business query also failed:", simpleError.message);

					// Final fallback: Return mock data for development
					if (process.env.NODE_ENV === "development") {
						logger.warn("Returning mock business data for development");
						return this.getMockBusinessData(businessId);
					}

					throw simpleError;
				}
			}
		}, `business_profile_${businessId}`);
	},

	/**
	 * Enrich business data with related information using separate queries
	 */
	async enrichBusinessData(supabase: any, business: any) {
		const enrichedBusiness = { ...business };

		// Try to fetch related data separately
		try {
			// Fetch reviews separately (without user join if it fails)
			const { data: reviews } = await supabase.from("reviews").select("*").eq("business_id", business.id).eq("status", "approved").limit(10);

			enrichedBusiness.reviews = reviews || [];
		} catch (reviewError) {
			logger.warn("Could not fetch reviews:", reviewError.message);
			enrichedBusiness.reviews = [];
		}

		try {
			// Fetch business categories separately
			const { data: businessCategories } = await supabase.from("business_categories").select("*, category:categories(*)").eq("business_id", business.id);

			enrichedBusiness.business_categories = businessCategories || [];
		} catch (categoryError) {
			logger.warn("Could not fetch business categories:", categoryError.message);
			enrichedBusiness.business_categories = [];
		}

		try {
			// Fetch business photos separately
			const { data: photos } = await supabase.from("business_photos").select("*").eq("business_id", business.id).order("order", { ascending: true });

			enrichedBusiness.business_photos = photos || [];
		} catch (photoError) {
			logger.warn("Could not fetch business photos:", photoError.message);
			enrichedBusiness.business_photos = [];
		}

		return enrichedBusiness;
	},

	/**
	 * Return mock business data for development when database is not set up
	 */
	getMockBusinessData(businessId: string) {
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
			price_range: "$$",
			status: "published",
			verified: true,
			featured: true,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			// Additional fields required by BusinessOverview component
			established: "2020",
			employees: "5-10",
			responseTime: "< 1 hour",
			responseRate: 95,
			serviceArea: {
				primary: "San Francisco Bay Area",
				coverage: "50 mile radius",
				cities: ["San Francisco", "Oakland", "San Jose", "Berkeley", "Palo Alto"],
			},
			social_media: {
				facebook: "https://facebook.com/demolocalbusiness",
				instagram: "https://instagram.com/demolocalbusiness",
			},
			amenities: ["WiFi", "Parking", "Wheelchair Accessible"],
			payment_methods: ["Cash", "Credit Cards", "Mobile Payments"],
			businessHighlights: ["Experienced team with 5+ years in the industry", "Fast response times for all customer inquiries", "High-quality service with attention to detail", "Competitive pricing with transparent billing", "Excellent customer satisfaction rating", "Licensed and insured for your peace of mind"],
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
			business_categories: [
				{
					id: "mock-bc-1",
					category: {
						id: "mock-cat-1",
						name: "Restaurant",
						slug: "restaurant",
						icon: "🍽️",
					},
				},
			],
			business_photos: [
				{
					id: "mock-photo-1",
					url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
					alt_text: "Business exterior",
					caption: "Welcome to our business",
					is_primary: true,
					order: 1,
				},
			],
		};
	},

	/**
	 * Get businesses for home page sections
	 */
	async getHomePageBusinesses() {
		const supabase = await createSupabaseServerClient();

		return fetchPageData(async () => {
			const { data: businesses, error } = await supabase
				.from("businesses")
				.select(
					`
          id,
          name,
          slug,
          description,
          city,
          state,
          rating,
          review_count,
          price_range,
          photos,
          business_categories(
            category:categories(name, slug)
          )
        `
				)
				.eq("status", "published")
				.eq("verified", true)
				.order("featured", { ascending: false })
				.order("rating", { ascending: false })
				.limit(200);

			if (error) throw error;
			return businesses;
		}, "home_page_businesses");
	},

	/**
	 * Search businesses with filters (with build-time timeout protection)
	 */
	async searchBusinesses(params: { query?: string; location?: string; category?: string; rating?: number; priceRange?: string; limit?: number; offset?: number; featured?: boolean }) {
		const supabase = await createSupabaseServerClient();

		return fetchPageData(
			async () => {
				// Add timeout protection for build process
				const searchFunction = async () => {
					// When filtering by related table columns we need inner joins
					const needsCategoryJoin = Boolean(params.query) || Boolean(params.category);
					const categoryJoinModifier = needsCategoryJoin ? "!inner" : "";

					let query = supabase
						.from("businesses")
						.select(
							`
                  id,
                  name,
                  slug,
                  description,
                  address,
                  city,
                  state,
                  rating,
                  review_count,
                  price_range,
                  photos,
                  latitude,
                  longitude,
                  business_categories${categoryJoinModifier}(
                    category:categories${categoryJoinModifier}(name, slug, icon)
                  )
                `,
							{ count: "exact" }
						)
						.eq("status", "published");

					// Apply filters - Enhanced search to include categories and descriptions
					if (params.query) {
						// Search in business fields
						const searchTerm = params.query.toLowerCase();
						query = query.or(`name.ilike.*${searchTerm}*,description.ilike.*${searchTerm}*`);

						// Also search related category fields via foreignTable OR
						query = query.or(`name.ilike.*${searchTerm}*`, { foreignTable: "business_categories.category" });
						query = query.or(`slug.ilike.*${searchTerm}*`, { foreignTable: "business_categories.category" });
					}

					if (params.location) {
						query = query.or(`city.ilike.*${params.location}*,state.ilike.*${params.location}*`);
					}

					if (params.category) {
						query = query.eq("business_categories.category.slug", params.category);
					}

					if (params.rating) {
						query = query.gte("rating", params.rating);
					}

					if (params.priceRange) {
						query = query.eq("price_range", params.priceRange);
					}

					if (params.featured !== undefined) {
						query = query.eq("featured", params.featured);
					}

					// Pagination
					const limit = params.limit || 20;
					const offset = params.offset || 0;
					query = query.range(offset, offset + limit - 1);

					const { data: businesses, error, count } = await query;

					if (error) throw error;

					return {
						businesses,
						total: count || 0,
						hasMore: (count || 0) > offset + limit,
					};
				};

				// Apply timeout for build process (8 seconds for database queries)
				if (process.env.NODE_ENV === "production" || process.env.NEXT_BUILD === "1") {
					const timeoutPromise = new Promise((_, reject) => {
						setTimeout(() => reject(new Error("Database query timeout during build")), 8000);
					});

					try {
						return await Promise.race([searchFunction(), timeoutPromise]);
					} catch (error) {
						logger.warn("Database timeout during build, returning empty result:", error.message);
						return { businesses: [], total: 0, hasMore: false };
					}
				}

				return await searchFunction();
			},
			`search_${JSON.stringify(params)}`
		);
	},
};

/**
 * Common data fetching patterns for other content types
 */
export const JobDataFetchers = {
	/**
	 * Get jobs with company information for jobs listing page
	 */
	async getJobs(
		params: {
			search?: string;
			location?: string;
			jobType?: string;
			remote?: boolean;
			salaryMin?: number;
			limit?: number;
			offset?: number;
		} = {}
	) {
		const supabase = await createSupabaseServerClient();

		return fetchPageData(
			async () => {
				let query = supabase
					.from("jobs")
					.select(
						`
					id,
					title,
					description,
					location,
					remote_ok,
					job_type,
					salary_min,
					salary_max,
					skills_required,
					experience_level,
					status,
					created_at,
					application_deadline,
					benefits,
					requirements,
					companies (
						id,
						name,
						logo_url,
						industry,
						company_size,
						website,
						description
					)
				`,
						{ count: "exact" }
					)
					.eq("status", "published")
					.order("featured", { ascending: false })
					.order("created_at", { ascending: false });

				// Apply search filters
				if (params.search) {
					query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%,skills_required.cs.{${params.search}}`);
				}

				if (params.location) {
					query = query.ilike("location", `%${params.location}%`);
				}

				if (params.jobType) {
					query = query.eq("job_type", params.jobType);
				}

				if (params.remote !== undefined) {
					query = query.eq("remote_ok", params.remote);
				}

				if (params.salaryMin) {
					query = query.gte("salary_min", params.salaryMin);
				}

				// Pagination
				const limit = params.limit || 20;
				const offset = params.offset || 0;
				query = query.range(offset, offset + limit - 1);

				const { data: jobs, error, count } = await query;

				if (error) throw error;

				return {
					jobs,
					total: count || 0,
					hasMore: (count || 0) > offset + limit,
				};
			},
			`jobs_${JSON.stringify(params)}`
		);
	},

	/**
	 * Get job details by ID with company information
	 */
	async getJobById(jobId: string) {
		const supabase = await createSupabaseServerClient();

		return fetchPageData(async () => {
			const { data: job, error } = await supabase
				.from("jobs")
				.select(
					`
					*,
					companies (
						id,
						name,
						logo_url,
						industry,
						company_size,
						website,
						description,
						founded_year,
						headquarters
					),
					job_applications (
						id,
						applicant_id,
						created_at
					)
				`
				)
				.eq("id", jobId)
				.eq("status", "published")
				.single();

			if (error) throw error;
			return job;
		}, `job_${jobId}`);
	},

	/**
	 * Get companies for company listings
	 */
	async getCompanies(
		params: {
			search?: string;
			industry?: string;
			size?: string;
			limit?: number;
			offset?: number;
		} = {}
	) {
		const supabase = await createSupabaseServerClient();

		return fetchPageData(
			async () => {
				let query = supabase
					.from("companies")
					.select(
						`
					id,
					name,
					logo_url,
					industry,
					company_size,
					website,
					description,
					founded_year,
					headquarters,
					jobs (
						id,
						title,
						status
					)
				`,
						{ count: "exact" }
					)
					.order("created_at", { ascending: false });

				// Apply filters
				if (params.search) {
					query = query.ilike("name", `%${params.search}%`);
				}

				if (params.industry) {
					query = query.eq("industry", params.industry);
				}

				if (params.size) {
					query = query.eq("company_size", params.size);
				}

				// Pagination
				const limit = params.limit || 20;
				const offset = params.offset || 0;
				query = query.range(offset, offset + limit - 1);

				const { data: companies, error, count } = await query;

				if (error) throw error;

				return {
					companies,
					total: count || 0,
					hasMore: (count || 0) > offset + limit,
				};
			},
			`companies_${JSON.stringify(params)}`
		);
	},
};

export const ContentDataFetchers = {
	/**
	 * Get blog posts for blog pages
	 */
	async getBlogPosts(
		params: {
			category?: string;
			featured?: boolean;
			limit?: number;
			offset?: number;
		} = {}
	) {
		const supabase = await createSupabaseServerClient();

		return fetchPageData(
			async () => {
				let query = supabase
					.from("blog_posts")
					.select(
						`
          id,
          title,
          slug,
          excerpt,
          content,
          featured_image,
          published_at,
          reading_time,
          view_count,
          like_count,
          tags,
          featured,
          author:users(id, name, avatar_url),
          category:blog_categories(id, name, slug)
        `
					)
					.eq("status", "published")
					.order("published_at", { ascending: false });

				if (params.category) {
					query = query.eq("blog_categories.slug", params.category);
				}

				if (params.featured) {
					query = query.eq("featured", true);
				}

				const limit = params.limit || 12;
				const offset = params.offset || 0;
				query = query.range(offset, offset + limit - 1);

				const { data: posts, error, count } = await query;
				if (error) throw error;

				return {
					posts: posts || [],
					total: count || 0,
					hasMore: (count || 0) > offset + limit,
				};
			},
			`blog_posts_${JSON.stringify(params)}`
		);
	},

	/**
	 * Get single blog post by slug
	 */
	async getBlogPostBySlug(slug: string) {
		const supabase = await createSupabaseServerClient();

		return fetchPageData(async () => {
			const { data: post, error } = await supabase
				.from("blog_posts")
				.select(
					`
          id,
          title,
          slug,
          excerpt,
          content,
          featured_image,
          published_at,
          updated_at,
          reading_time,
          view_count,
          like_count,
          tags,
          featured,
          meta_title,
          meta_description,
          author:users(id, name, avatar_url, bio),
          category:blog_categories(id, name, slug, description)
        `
				)
				.eq("slug", slug)
				.eq("status", "published")
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					return null; // Post not found
				}
				throw error;
			}

			// Increment view count
			await supabase
				.from("blog_posts")
				.update({ view_count: (post.view_count || 0) + 1 })
				.eq("id", post.id);

			return post;
		}, `blog_post_${slug}`);
	},

	/**
	 * Get blog categories
	 */
	async getBlogCategories() {
		const supabase = await createSupabaseServerClient();

		return fetchPageData(async () => {
			const { data: categories, error } = await supabase
				.from("blog_categories")
				.select(
					`
          id,
          name,
          slug,
          description,
          post_count
        `
				)
				.order("name");

			if (error) throw error;
			return categories || [];
		}, "blog_categories");
	},

	/**
	 * Get related blog posts
	 */
	async getRelatedBlogPosts(postId: string, categoryId: string, limit: number = 3) {
		const supabase = await createSupabaseServerClient();

		return fetchPageData(async () => {
			const { data: posts, error } = await supabase
				.from("blog_posts")
				.select(
					`
          id,
          title,
          slug,
          excerpt,
          featured_image,
          published_at,
          reading_time,
          author:users(id, name, avatar_url),
          category:blog_categories(id, name, slug)
        `
				)
				.eq("status", "published")
				.eq("category_id", categoryId)
				.neq("id", postId)
				.order("published_at", { ascending: false })
				.limit(limit);

			if (error) throw error;
			return posts || [];
		}, `related_posts_${postId}_${categoryId}`);
	},

	/**
	 * Get events for events pages
	 */
	async getEvents(
		params: {
			status?: "upcoming" | "ongoing" | "completed";
			limit?: number;
			offset?: number;
		} = {}
	) {
		const supabase = await createSupabaseServerClient();

		return fetchPageData(
			async () => {
				let query = supabase
					.from("events")
					.select(
						`
          id,
          title,
          slug,
          description,
          start_date,
          end_date,
          location,
          venue,
          is_virtual,
          virtual_url,
          price,
          currency,
          max_attendees,
          current_attendees,
          featured_image,
          tags,
          organizer:users(id, name, avatar_url),
          business:businesses(id, name, slug)
        `
					)
					.order("start_date", { ascending: true });

				if (params.status) {
					query = query.eq("status", params.status);
				}

				const limit = params.limit || 12;
				const offset = params.offset || 0;
				query = query.range(offset, offset + limit - 1);

				const { data: events, error } = await query;
				if (error) throw error;

				return events;
			},
			`events_${JSON.stringify(params)}`
		);
	},

	/**
	 * Get jobs for jobs pages
	 */
	async getJobs(
		params: {
			remote?: boolean;
			location?: string;
			type?: string;
			limit?: number;
			offset?: number;
		} = {}
	) {
		const supabase = await createSupabaseServerClient();

		return fetchPageData(
			async () => {
				let query = supabase
					.from("jobs")
					.select(
						`
          id,
          title,
          slug,
          description,
          location,
          remote_ok,
          job_type,
          salary_min,
          salary_max,
          salary_currency,
          experience_level,
          skills,
          application_deadline,
          created_at,
          company:companies(
            id,
            name,
            slug,
            logo_url,
            industry,
            company_size
          )
        `
					)
					.eq("status", "published")
					.order("created_at", { ascending: false });

				if (params.remote !== undefined) {
					query = query.eq("remote_ok", params.remote);
				}

				if (params.location) {
					query = query.ilike("location", `%${params.location}%`);
				}

				if (params.type) {
					query = query.eq("job_type", params.type);
				}

				const limit = params.limit || 20;
				const offset = params.offset || 0;
				query = query.range(offset, offset + limit - 1);

				const { data: jobs, error } = await query;
				if (error) throw error;

				return jobs;
			},
			`jobs_${JSON.stringify(params)}`
		);
	},
};

export type { Database } from "./client";
