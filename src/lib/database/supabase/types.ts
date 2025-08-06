// REQUIRED: Generated TypeScript types for Supabase database schema
// This file matches the complete_schema.sql and should be regenerated when schema changes
// Generate using: supabase gen types typescript --project-id hdiuifrlulzpvasknzqm > lib/supabase/types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			businesses: {
				Row: {
					id: string;
					created_at: string;
					updated_at: string;
					name: string;
					slug: string;
					description: string | null;
					address: string;
					city: string;
					state: string;
					zip_code: string;
					country: string;
					latitude: number | null;
					longitude: number | null;
					phone: string | null;
					email: string | null;
					website: string | null;
					hours: Json | null;
					rating: number | null;
					review_count: number;
					price_range: string | null;
					status: "draft" | "published" | "archived";
					verified: boolean;
					featured: boolean;
					owner_id: string | null;
					claimed_by: string | null;
					claimed_at: string | null;
					photos: string[] | null;
					social_media: Json | null;
					amenities: string[] | null;
					payment_methods: string[] | null;
				};
				Insert: {
					id?: string;
					created_at?: string;
					updated_at?: string;
					name: string;
					slug: string;
					description?: string | null;
					address: string;
					city: string;
					state: string;
					zip_code: string;
					country?: string;
					latitude?: number | null;
					longitude?: number | null;
					phone?: string | null;
					email?: string | null;
					website?: string | null;
					hours?: Json | null;
					rating?: number | null;
					review_count?: number;
					price_range?: string | null;
					status?: "draft" | "published" | "archived";
					verified?: boolean;
					featured?: boolean;
					owner_id?: string | null;
					claimed_by?: string | null;
					claimed_at?: string | null;
					photos?: string[] | null;
					social_media?: Json | null;
					amenities?: string[] | null;
					payment_methods?: string[] | null;
				};
				Update: {
					id?: string;
					created_at?: string;
					updated_at?: string;
					name?: string;
					slug?: string;
					description?: string | null;
					address?: string;
					city?: string;
					state?: string;
					zip_code?: string;
					country?: string;
					latitude?: number | null;
					longitude?: number | null;
					phone?: string | null;
					email?: string | null;
					website?: string | null;
					hours?: Json | null;
					rating?: number | null;
					review_count?: number;
					price_range?: string | null;
					status?: "draft" | "published" | "archived";
					verified?: boolean;
					featured?: boolean;
					owner_id?: string | null;
					claimed_by?: string | null;
					claimed_at?: string | null;
					photos?: string[] | null;
					social_media?: Json | null;
					amenities?: string[] | null;
					payment_methods?: string[] | null;
				};
				Relationships: [
					{
						foreignKeyName: "businesses_claimed_by_fkey";
						columns: ["claimed_by"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "businesses_owner_id_fkey";
						columns: ["owner_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
			users: {
				Row: {
					id: string;
					created_at: string;
					updated_at: string;
					email: string;
					name: string | null;
					avatar_url: string | null;
					phone: string | null;
					location: string | null;
					bio: string | null;
					role: "user" | "business_owner" | "admin" | "moderator";
					status: "active" | "suspended" | "deleted";
					last_login: string | null;
					email_verified: boolean;
					phone_verified: boolean;
					preferences: Json | null;
					metadata: Json | null;
				};
				Insert: {
					id: string;
					created_at?: string;
					updated_at?: string;
					email: string;
					name?: string | null;
					avatar_url?: string | null;
					phone?: string | null;
					location?: string | null;
					bio?: string | null;
					role?: "user" | "business_owner" | "admin" | "moderator";
					status?: "active" | "suspended" | "deleted";
					last_login?: string | null;
					email_verified?: boolean;
					phone_verified?: boolean;
					preferences?: Json | null;
					metadata?: Json | null;
				};
				Update: {
					id?: string;
					created_at?: string;
					updated_at?: string;
					email?: string;
					name?: string | null;
					avatar_url?: string | null;
					phone?: string | null;
					location?: string | null;
					bio?: string | null;
					role?: "user" | "business_owner" | "admin" | "moderator";
					status?: "active" | "suspended" | "deleted";
					last_login?: string | null;
					email_verified?: boolean;
					phone_verified?: boolean;
					preferences?: Json | null;
					metadata?: Json | null;
				};
				Relationships: [];
			};
			reviews: {
				Row: {
					id: string;
					created_at: string;
					updated_at: string;
					business_id: string;
					user_id: string;
					rating: number;
					title: string | null;
					text: string;
					photos: string[] | null;
					helpful_count: number;
					status: "pending" | "approved" | "rejected";
					is_flagged: boolean;
					response: string | null;
					response_date: string | null;
					visit_date: string | null;
					verified_purchase: boolean;
					tags: string[] | null;
				};
				Insert: {
					id?: string;
					created_at?: string;
					updated_at?: string;
					business_id: string;
					user_id: string;
					rating: number;
					title?: string | null;
					text: string;
					photos?: string[] | null;
					helpful_count?: number;
					status?: "pending" | "approved" | "rejected";
					is_flagged?: boolean;
					response?: string | null;
					response_date?: string | null;
					visit_date?: string | null;
					verified_purchase?: boolean;
					tags?: string[] | null;
				};
				Update: {
					id?: string;
					created_at?: string;
					updated_at?: string;
					business_id?: string;
					user_id?: string;
					rating?: number;
					title?: string | null;
					text?: string;
					photos?: string[] | null;
					helpful_count?: number;
					status?: "pending" | "approved" | "rejected";
					is_flagged?: boolean;
					response?: string | null;
					response_date?: string | null;
					visit_date?: string | null;
					verified_purchase?: boolean;
					tags?: string[] | null;
				};
				Relationships: [
					{
						foreignKeyName: "reviews_business_id_fkey";
						columns: ["business_id"];
						isOneToOne: false;
						referencedRelation: "businesses";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "reviews_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
			categories: {
				Row: {
					id: string;
					created_at: string;
					name: string;
					slug: string;
					description: string | null;
					icon: string | null;
					parent_id: string | null;
					order: number;
					is_active: boolean;
				};
				Insert: {
					id?: string;
					created_at?: string;
					name: string;
					slug: string;
					description?: string | null;
					icon?: string | null;
					parent_id?: string | null;
					order?: number;
					is_active?: boolean;
				};
				Update: {
					id?: string;
					created_at?: string;
					name?: string;
					slug?: string;
					description?: string | null;
					icon?: string | null;
					parent_id?: string | null;
					order?: number;
					is_active?: boolean;
				};
				Relationships: [
					{
						foreignKeyName: "categories_parent_id_fkey";
						columns: ["parent_id"];
						isOneToOne: false;
						referencedRelation: "categories";
						referencedColumns: ["id"];
					},
				];
			};
			business_categories: {
				Row: {
					id: string;
					business_id: string;
					category_id: string;
					is_primary: boolean;
					created_at: string;
				};
				Insert: {
					id?: string;
					business_id: string;
					category_id: string;
					is_primary?: boolean;
					created_at?: string;
				};
				Update: {
					id?: string;
					business_id?: string;
					category_id?: string;
					is_primary?: boolean;
					created_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "business_categories_business_id_fkey";
						columns: ["business_id"];
						isOneToOne: false;
						referencedRelation: "businesses";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "business_categories_category_id_fkey";
						columns: ["category_id"];
						isOneToOne: false;
						referencedRelation: "categories";
						referencedColumns: ["id"];
					},
				];
			};
			business_photos: {
				Row: {
					id: string;
					business_id: string;
					url: string;
					alt_text: string | null;
					caption: string | null;
					is_primary: boolean;
					order: number;
					uploaded_by: string | null;
					created_at: string;
				};
				Insert: {
					id?: string;
					business_id: string;
					url: string;
					alt_text?: string | null;
					caption?: string | null;
					is_primary?: boolean;
					order?: number;
					uploaded_by?: string | null;
					created_at?: string;
				};
				Update: {
					id?: string;
					business_id?: string;
					url?: string;
					alt_text?: string | null;
					caption?: string | null;
					is_primary?: boolean;
					order?: number;
					uploaded_by?: string | null;
					created_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "business_photos_business_id_fkey";
						columns: ["business_id"];
						isOneToOne: false;
						referencedRelation: "businesses";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "business_photos_uploaded_by_fkey";
						columns: ["uploaded_by"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
			companies: {
				Row: {
					id: string;
					created_at: string;
					updated_at: string;
					name: string;
					slug: string;
					description: string | null;
					website: string | null;
					logo_url: string | null;
					banner_url: string | null;
					industry: string | null;
					company_size: string | null;
					founded_year: number | null;
					headquarters: string | null;
					culture: Json | null;
					benefits: string[] | null;
					owner_id: string | null;
					verified: boolean;
					status: "draft" | "published" | "archived" | "scheduled";
				};
				Insert: {
					id?: string;
					created_at?: string;
					updated_at?: string;
					name: string;
					slug: string;
					description?: string | null;
					website?: string | null;
					logo_url?: string | null;
					banner_url?: string | null;
					industry?: string | null;
					company_size?: string | null;
					founded_year?: number | null;
					headquarters?: string | null;
					culture?: Json | null;
					benefits?: string[] | null;
					owner_id?: string | null;
					verified?: boolean;
					status?: "draft" | "published" | "archived" | "scheduled";
				};
				Update: {
					id?: string;
					created_at?: string;
					updated_at?: string;
					name?: string;
					slug?: string;
					description?: string | null;
					website?: string | null;
					logo_url?: string | null;
					banner_url?: string | null;
					industry?: string | null;
					company_size?: string | null;
					founded_year?: number | null;
					headquarters?: string | null;
					culture?: Json | null;
					benefits?: string[] | null;
					owner_id?: string | null;
					verified?: boolean;
					status?: "draft" | "published" | "archived" | "scheduled";
				};
				Relationships: [
					{
						foreignKeyName: "companies_owner_id_fkey";
						columns: ["owner_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
			jobs: {
				Row: {
					id: string;
					created_at: string;
					updated_at: string;
					title: string;
					slug: string;
					description: string;
					requirements: string | null;
					responsibilities: string | null;
					company_id: string | null;
					posted_by: string | null;
					location: string | null;
					remote_ok: boolean;
					job_type: "full_time" | "part_time" | "contract" | "freelance" | "internship";
					salary_min: number | null;
					salary_max: number | null;
					salary_currency: string;
					experience_level: string | null;
					skills_required: string[] | null;
					benefits: string[] | null;
					application_deadline: string | null;
					status: "draft" | "published" | "filled" | "closed" | "expired";
					view_count: number;
					application_count: number;
					external_url: string | null;
					apply_instructions: string | null;
				};
				Insert: {
					id?: string;
					created_at?: string;
					updated_at?: string;
					title: string;
					slug: string;
					description: string;
					requirements?: string | null;
					responsibilities?: string | null;
					company_id?: string | null;
					posted_by?: string | null;
					location?: string | null;
					remote_ok?: boolean;
					job_type: "full_time" | "part_time" | "contract" | "freelance" | "internship";
					salary_min?: number | null;
					salary_max?: number | null;
					salary_currency?: string;
					experience_level?: string | null;
					skills_required?: string[] | null;
					benefits?: string[] | null;
					application_deadline?: string | null;
					status?: "draft" | "published" | "filled" | "closed" | "expired";
					view_count?: number;
					application_count?: number;
					external_url?: string | null;
					apply_instructions?: string | null;
				};
				Update: {
					id?: string;
					created_at?: string;
					updated_at?: string;
					title?: string;
					slug?: string;
					description?: string;
					requirements?: string | null;
					responsibilities?: string | null;
					company_id?: string | null;
					posted_by?: string | null;
					location?: string | null;
					remote_ok?: boolean;
					job_type?: "full_time" | "part_time" | "contract" | "freelance" | "internship";
					salary_min?: number | null;
					salary_max?: number | null;
					salary_currency?: string;
					experience_level?: string | null;
					skills_required?: string[] | null;
					benefits?: string[] | null;
					application_deadline?: string | null;
					status?: "draft" | "published" | "filled" | "closed" | "expired";
					view_count?: number;
					application_count?: number;
					external_url?: string | null;
					apply_instructions?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "jobs_company_id_fkey";
						columns: ["company_id"];
						isOneToOne: false;
						referencedRelation: "companies";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "jobs_posted_by_fkey";
						columns: ["posted_by"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
			job_applications: {
				Row: {
					id: string;
					created_at: string;
					updated_at: string;
					job_id: string;
					applicant_id: string;
					cover_letter: string | null;
					resume_url: string | null;
					portfolio_url: string | null;
					status: "pending" | "reviewing" | "interviewed" | "rejected" | "hired";
					notes: string | null;
					interview_date: string | null;
					salary_expectation: number | null;
					additional_info: Json | null;
				};
				Insert: {
					id?: string;
					created_at?: string;
					updated_at?: string;
					job_id: string;
					applicant_id: string;
					cover_letter?: string | null;
					resume_url?: string | null;
					portfolio_url?: string | null;
					status?: "pending" | "reviewing" | "interviewed" | "rejected" | "hired";
					notes?: string | null;
					interview_date?: string | null;
					salary_expectation?: number | null;
					additional_info?: Json | null;
				};
				Update: {
					id?: string;
					created_at?: string;
					updated_at?: string;
					job_id?: string;
					applicant_id?: string;
					cover_letter?: string | null;
					resume_url?: string | null;
					portfolio_url?: string | null;
					status?: "pending" | "reviewing" | "interviewed" | "rejected" | "hired";
					notes?: string | null;
					interview_date?: string | null;
					salary_expectation?: number | null;
					additional_info?: Json | null;
				};
				Relationships: [
					{
						foreignKeyName: "job_applications_job_id_fkey";
						columns: ["job_id"];
						isOneToOne: false;
						referencedRelation: "jobs";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "job_applications_applicant_id_fkey";
						columns: ["applicant_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
			analytics_events: {
				Row: {
					id: string;
					created_at: string;
					updated_at: string;
					user_id: string | null;
					session_id: string | null;
					event_type: string;
					event_data: Json | null;
					page_url: string | null;
					referrer: string | null;
					user_agent: string | null;
					ip_address: string | null;
				};
				Insert: {
					id?: string;
					created_at?: string;
					updated_at?: string;
					user_id?: string | null;
					session_id?: string | null;
					event_type: string;
					event_data?: Json | null;
					page_url?: string | null;
					referrer?: string | null;
					user_agent?: string | null;
					ip_address?: string | null;
				};
				Update: {
					id?: string;
					created_at?: string;
					updated_at?: string;
					user_id?: string | null;
					session_id?: string | null;
					event_type?: string;
					event_data?: Json | null;
					page_url?: string | null;
					referrer?: string | null;
					user_agent?: string | null;
					ip_address?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "analytics_events_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
			form_submissions: {
				Row: {
					id: string;
					created_at: string;
					updated_at: string;
					user_id: string | null;
					form_type: string;
					form_data: Json;
					status: "pending" | "processing" | "completed" | "rejected";
					processed_at: string | null;
					notes: string | null;
				};
				Insert: {
					id?: string;
					created_at?: string;
					updated_at?: string;
					user_id?: string | null;
					form_type: string;
					form_data: Json;
					status?: "pending" | "processing" | "completed" | "rejected";
					processed_at?: string | null;
					notes?: string | null;
				};
				Update: {
					id?: string;
					created_at?: string;
					updated_at?: string;
					user_id?: string | null;
					form_type?: string;
					form_data?: Json;
					status?: "pending" | "processing" | "completed" | "rejected";
					processed_at?: string | null;
					notes?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "form_submissions_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
			newsletter_subscriptions: {
				Row: {
					id: string;
					created_at: string;
					updated_at: string;
					email: string;
					status: "active" | "inactive" | "unsubscribed";
					preferences: Json | null;
					confirmed_at: string | null;
				};
				Insert: {
					id?: string;
					created_at?: string;
					updated_at?: string;
					email: string;
					status?: "active" | "inactive" | "unsubscribed";
					preferences?: Json | null;
					confirmed_at?: string | null;
				};
				Update: {
					id?: string;
					created_at?: string;
					updated_at?: string;
					email?: string;
					status?: "active" | "inactive" | "unsubscribed";
					preferences?: Json | null;
					confirmed_at?: string | null;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			get_nearby_businesses: {
				Args: {
					lat: number;
					lng: number;
					radius_km?: number;
					result_limit?: number;
				};
				Returns: {
					id: string;
					name: string;
					address: string;
					city: string;
					state: string;
					latitude: number;
					longitude: number;
					rating: number;
					review_count: number;
					distance: number;
				}[];
			};
			search_businesses: {
				Args: {
					search_term: string;
					location?: string;
					category?: string;
					max_results?: number;
				};
				Returns: {
					id: string;
					name: string;
					description: string;
					address: string;
					city: string;
					state: string;
					rating: number;
					review_count: number;
					relevance_score: number;
				}[];
			};
			search_jobs: {
				Args: {
					search_term?: string;
					job_type_filter?: "full_time" | "part_time" | "contract" | "freelance" | "internship";
					location_filter?: string;
					remote_filter?: boolean;
					min_salary?: number;
					max_salary?: number;
					company_filter?: string;
					result_limit?: number;
				};
				Returns: {
					id: string;
					title: string;
					company_name: string;
					location: string;
					job_type: "full_time" | "part_time" | "contract" | "freelance" | "internship";
					salary_min: number;
					salary_max: number;
					created_at: string;
					relevance_score: number;
				}[];
			};
			get_user_analytics: {
				Args: {
					user_uuid: string;
				};
				Returns: Json;
			};
		};
		Enums: {
			business_status: "draft" | "published" | "archived";
			user_role: "user" | "business_owner" | "admin" | "moderator";
			user_status: "active" | "suspended" | "deleted";
			review_status: "pending" | "approved" | "rejected";
			job_status: "draft" | "published" | "filled" | "closed" | "expired";
			job_type: "full_time" | "part_time" | "contract" | "freelance" | "internship";
			application_status: "pending" | "reviewing" | "interviewed" | "rejected" | "hired";
			content_status: "draft" | "published" | "archived" | "scheduled";
			event_status: "upcoming" | "ongoing" | "completed" | "cancelled";
			subscription_status: "active" | "cancelled" | "past_due" | "paused";
			payment_status: "pending" | "completed" | "failed" | "refunded";
			support_priority: "low" | "medium" | "high" | "critical";
			support_status: "open" | "in_progress" | "waiting" | "resolved" | "closed";
			ad_status: "draft" | "pending" | "approved" | "rejected" | "active" | "paused" | "expired";
			certification_status: "pending" | "verified" | "expired" | "revoked";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
