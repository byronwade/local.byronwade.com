/**
 * Validation Schemas
 * Zod schemas for form validation and data validation throughout the application
 */

import { z } from "zod";
import { VALIDATION_PATTERNS, BUSINESS_TYPES, USER_ROLES, PRICE_RANGES } from "@lib/constants";

// Base validation schemas
export const emailSchema = z
	.string()
	.email("Please enter a valid email address")
	.min(1, "Email is required")
	.max(100, "Email must be less than 100 characters");

export const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.regex(
		VALIDATION_PATTERNS.PASSWORD,
		"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
	);

export const phoneSchema = z
	.string()
	.regex(VALIDATION_PATTERNS.PHONE, "Please enter a valid phone number")
	.optional()
	.or(z.literal(""));

export const urlSchema = z
	.string()
	.url("Please enter a valid URL")
	.optional()
	.or(z.literal(""));

export const slugSchema = z
	.string()
	.regex(VALIDATION_PATTERNS.SLUG, "Slug can only contain lowercase letters, numbers, and hyphens")
	.min(1, "Slug is required")
	.max(100, "Slug must be less than 100 characters");

// User validation schemas
export const userRegistrationSchema = z
	.object({
		name: z
			.string()
			.min(1, "Name is required")
			.max(100, "Name must be less than 100 characters")
			.trim(),
		email: emailSchema,
		password: passwordSchema,
		confirmPassword: z.string(),
		termsAccepted: z.boolean().refine((val) => val === true, {
			message: "You must accept the terms and conditions",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const userLoginSchema = z.object({
	email: emailSchema,
	password: z.string().min(1, "Password is required"),
	rememberMe: z.boolean().optional(),
});

export const userProfileSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(100, "Name must be less than 100 characters")
		.trim(),
	email: emailSchema,
	phone: phoneSchema,
	bio: z
		.string()
		.max(500, "Bio must be less than 500 characters")
		.optional()
		.or(z.literal("")),
	website: urlSchema,
	location: z
		.string()
		.max(100, "Location must be less than 100 characters")
		.optional()
		.or(z.literal("")),
	avatar: z
		.string()
		.url("Invalid avatar URL")
		.optional()
		.or(z.literal("")),
});

export const passwordResetSchema = z.object({
	email: emailSchema,
});

export const passwordChangeSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required"),
		newPassword: passwordSchema,
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

// Business validation schemas
export const businessSchema = z.object({
	name: z
		.string()
		.min(1, "Business name is required")
		.max(100, "Business name must be less than 100 characters")
		.trim(),
	slug: slugSchema,
	description: z
		.string()
		.min(10, "Description must be at least 10 characters")
		.max(1000, "Description must be less than 1000 characters")
		.trim(),
	category: z
		.string()
		.min(1, "Category is required"),
	businessType: z
		.enum(Object.values(BUSINESS_TYPES))
		.optional(),
	
	// Contact information
	email: emailSchema.optional().or(z.literal("")),
	phone: phoneSchema,
	website: urlSchema,
	
	// Address information
	address: z
		.string()
		.min(1, "Address is required")
		.max(200, "Address must be less than 200 characters")
		.trim(),
	city: z
		.string()
		.min(1, "City is required")
		.max(100, "City must be less than 100 characters")
		.trim(),
	state: z
		.string()
		.min(2, "State is required")
		.max(2, "State must be 2 characters")
		.trim(),
	zipCode: z
		.string()
		.regex(VALIDATION_PATTERNS.ZIP_CODE, "Please enter a valid ZIP code"),
	latitude: z
		.number()
		.min(-90, "Invalid latitude")
		.max(90, "Invalid latitude")
		.optional(),
	longitude: z
		.number()
		.min(-180, "Invalid longitude")
		.max(180, "Invalid longitude")
		.optional(),
	
	// Business details
	priceRange: z
		.enum(Object.values(PRICE_RANGES))
		.optional(),
	features: z
		.array(z.string())
		.optional(),
	
	// Hours of operation
	hours: z
		.object({
			monday: z.object({
				open: z.string().optional(),
				close: z.string().optional(),
				closed: z.boolean().optional(),
			}).optional(),
			tuesday: z.object({
				open: z.string().optional(),
				close: z.string().optional(),
				closed: z.boolean().optional(),
			}).optional(),
			wednesday: z.object({
				open: z.string().optional(),
				close: z.string().optional(),
				closed: z.boolean().optional(),
			}).optional(),
			thursday: z.object({
				open: z.string().optional(),
				close: z.string().optional(),
				closed: z.boolean().optional(),
			}).optional(),
			friday: z.object({
				open: z.string().optional(),
				close: z.string().optional(),
				closed: z.boolean().optional(),
			}).optional(),
			saturday: z.object({
				open: z.string().optional(),
				close: z.string().optional(),
				closed: z.boolean().optional(),
			}).optional(),
			sunday: z.object({
				open: z.string().optional(),
				close: z.string().optional(),
				closed: z.boolean().optional(),
			}).optional(),
		})
		.optional(),
});

export const businessClaimSchema = z.object({
	businessId: z.string().min(1, "Business ID is required"),
	claimReason: z
		.string()
		.min(10, "Please provide a reason for claiming this business")
		.max(500, "Reason must be less than 500 characters"),
	contactEmail: emailSchema,
	contactPhone: phoneSchema,
	documentation: z
		.string()
		.url("Invalid documentation URL")
		.optional()
		.or(z.literal("")),
});

// Review validation schemas
export const reviewSchema = z.object({
	businessId: z.string().min(1, "Business ID is required"),
	rating: z
		.number()
		.min(1, "Rating must be at least 1")
		.max(5, "Rating cannot be more than 5"),
	title: z
		.string()
		.min(1, "Review title is required")
		.max(100, "Title must be less than 100 characters")
		.trim(),
	text: z
		.string()
		.min(10, "Review must be at least 10 characters")
		.max(1000, "Review must be less than 1000 characters")
		.trim(),
	photos: z
		.array(z.string().url())
		.max(5, "Maximum 5 photos allowed")
		.optional(),
	wouldRecommend: z.boolean().optional(),
});

export const reviewResponseSchema = z.object({
	reviewId: z.string().min(1, "Review ID is required"),
	response: z
		.string()
		.min(1, "Response is required")
		.max(500, "Response must be less than 500 characters")
		.trim(),
});

// Contact form schemas
export const contactFormSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(100, "Name must be less than 100 characters")
		.trim(),
	email: emailSchema,
	subject: z
		.string()
		.min(1, "Subject is required")
		.max(100, "Subject must be less than 100 characters")
		.trim(),
	message: z
		.string()
		.min(10, "Message must be at least 10 characters")
		.max(1000, "Message must be less than 1000 characters")
		.trim(),
	businessId: z.string().optional(),
});

export const reportContentSchema = z.object({
	contentType: z.enum(["business", "review", "user", "other"]),
	contentId: z.string().min(1, "Content ID is required"),
	reason: z.enum([
		"inappropriate_content",
		"spam",
		"harassment",
		"fake_review",
		"copyright",
		"other",
	]),
	description: z
		.string()
		.min(10, "Please provide a detailed description")
		.max(500, "Description must be less than 500 characters")
		.trim(),
	reporterEmail: emailSchema.optional(),
});

// Search and filter schemas
export const searchSchema = z.object({
	query: z
		.string()
		.max(100, "Search query must be less than 100 characters")
		.optional()
		.or(z.literal("")),
	category: z.string().optional(),
	location: z
		.string()
		.max(100, "Location must be less than 100 characters")
		.optional()
		.or(z.literal("")),
	radius: z
		.number()
		.min(1, "Radius must be at least 1 mile")
		.max(50, "Radius cannot be more than 50 miles")
		.optional(),
	priceRange: z
		.enum(Object.values(PRICE_RANGES))
		.optional(),
	rating: z
		.number()
		.min(1, "Rating must be at least 1")
		.max(5, "Rating cannot be more than 5")
		.optional(),
	features: z.array(z.string()).optional(),
	sortBy: z
		.enum(["relevance", "rating", "distance", "name", "newest"])
		.optional(),
	page: z
		.number()
		.min(1, "Page must be at least 1")
		.optional(),
	limit: z
		.number()
		.min(1, "Limit must be at least 1")
		.max(100, "Limit cannot be more than 100")
		.optional(),
});

// Admin schemas
export const userRoleSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
	role: z.enum(Object.values(USER_ROLES)),
});

export const businessModerationSchema = z.object({
	businessId: z.string().min(1, "Business ID is required"),
	action: z.enum(["approve", "reject", "suspend", "feature", "unfeature"]),
	reason: z
		.string()
		.max(500, "Reason must be less than 500 characters")
		.optional()
		.or(z.literal("")),
});

// File upload schema
export const fileUploadSchema = z.object({
	file: z.instanceof(File),
	type: z.enum(["business_photo", "avatar", "document"]),
	businessId: z.string().optional(),
});

// Newsletter subscription schema
export const newsletterSchema = z.object({
	email: emailSchema,
	preferences: z
		.object({
			weekly_digest: z.boolean().optional(),
			business_updates: z.boolean().optional(),
			promotions: z.boolean().optional(),
		})
		.optional(),
});

// API validation helpers
export const paginationSchema = z.object({
	page: z
		.string()
		.transform(Number)
		.pipe(z.number().min(1))
		.optional()
		.default("1"),
	limit: z
		.string()
		.transform(Number)
		.pipe(z.number().min(1).max(100))
		.optional()
		.default("20"),
});

export const idParamSchema = z.object({
	id: z.string().min(1, "ID is required"),
});

export const slugParamSchema = z.object({
	slug: slugSchema,
});

// Export commonly used validation functions
export const validateEmail = (email) => emailSchema.safeParse(email);
export const validatePassword = (password) => passwordSchema.safeParse(password);
export const validatePhone = (phone) => phoneSchema.safeParse(phone);
export const validateUrl = (url) => urlSchema.safeParse(url);

// Export all schemas as default
export default {
	// User schemas
	userRegistrationSchema,
	userLoginSchema,
	userProfileSchema,
	passwordResetSchema,
	passwordChangeSchema,
	
	// Business schemas
	businessSchema,
	businessClaimSchema,
	
	// Review schemas
	reviewSchema,
	reviewResponseSchema,
	
	// Form schemas
	contactFormSchema,
	reportContentSchema,
	newsletterSchema,
	
	// Search schemas
	searchSchema,
	
	// Admin schemas
	userRoleSchema,
	businessModerationSchema,
	
	// File schemas
	fileUploadSchema,
	
	// API schemas
	paginationSchema,
	idParamSchema,
	slugParamSchema,
	
	// Base schemas
	emailSchema,
	passwordSchema,
	phoneSchema,
	urlSchema,
	slugSchema,
};
