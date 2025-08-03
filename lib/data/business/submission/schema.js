/**
 * Business Submission Schema
 * Zod validation schema for business submission form
 * Extracted from BusinessSubmissionForm for better organization
 */

import { z } from "zod";
import { DAYS_OF_WEEK, VALIDATION_CONSTANTS } from "./constants";

// Business submission validation schema
export const businessSubmissionSchema = z.object({
	// Basic Information
	businessName: z.string().min(VALIDATION_CONSTANTS.MIN_BUSINESS_NAME_LENGTH, {
		message: `Business name must be at least ${VALIDATION_CONSTANTS.MIN_BUSINESS_NAME_LENGTH} characters`,
	}),
	description: z.string().min(VALIDATION_CONSTANTS.MIN_DESCRIPTION_LENGTH, {
		message: `Description must be at least ${VALIDATION_CONSTANTS.MIN_DESCRIPTION_LENGTH} characters`,
	}),
	category: z.string().min(1, { message: "Please select a category" }),
	subcategory: z.string().optional(),

	// Contact Information
	address: z.string().min(VALIDATION_CONSTANTS.MIN_ADDRESS_LENGTH, {
		message: "Please provide a complete address",
	}),
	city: z.string().min(VALIDATION_CONSTANTS.MIN_CITY_LENGTH, {
		message: "City is required",
	}),
	state: z.string().min(VALIDATION_CONSTANTS.MIN_STATE_LENGTH, {
		message: "State is required",
	}),
	zipCode: z.string().min(VALIDATION_CONSTANTS.MIN_ZIP_LENGTH, {
		message: `ZIP code must be at least ${VALIDATION_CONSTANTS.MIN_ZIP_LENGTH} characters`,
	}),
	phone: z.string().min(VALIDATION_CONSTANTS.MIN_PHONE_LENGTH, {
		message: `Phone number must be at least ${VALIDATION_CONSTANTS.MIN_PHONE_LENGTH} digits`,
	}),
	email: z.string().email({ message: "Invalid email address" }),
	website: z.string().url({ message: "Invalid website URL" }).optional().or(z.literal("")),

	// Business Details
	yearEstablished: z.string().optional(),
	employeeCount: z.string().optional(),
	priceRange: z.enum(["$", "$$", "$$$", "$$$$"], {
		errorMap: () => ({ message: "Please select a price range" }),
	}),

	// Operating Hours
	hours: z.array(
		z.object({
			day: z.enum(DAYS_OF_WEEK),
			open: z.string(),
			close: z.string(),
			closed: z.boolean(),
		})
	),

	// Services and Amenities
	specialties: z
		.array(
			z.object({
				name: z.string().min(1, { message: "Specialty name is required" }),
				description: z.string().optional(),
			})
		)
		.optional(),
	amenities: z.array(z.string()).optional(),
	paymentMethods: z.array(z.string()).optional(),

	// Owner Information
	ownerName: z.string().min(1, { message: "Owner name is required" }),
	ownerEmail: z.string().email({ message: "Invalid email address" }),
	ownerPhone: z.string().optional(),
	businessLicenseNumber: z.string().optional(),
	taxId: z.string().optional(),

	// Legal
	legalConfirmation: z.boolean().refine((val) => val === true, {
		message: "You must confirm the accuracy of the information",
	}),
});

// Individual section schemas for step-by-step validation
export const basicInfoSchema = businessSubmissionSchema.pick({
	businessName: true,
	description: true,
	category: true,
	subcategory: true,
});

export const contactInfoSchema = businessSubmissionSchema.pick({
	address: true,
	city: true,
	state: true,
	zipCode: true,
	phone: true,
	email: true,
	website: true,
});

export const businessDetailsSchema = businessSubmissionSchema.pick({
	yearEstablished: true,
	employeeCount: true,
	priceRange: true,
	hours: true,
	specialties: true,
	amenities: true,
	paymentMethods: true,
});

export const ownerInfoSchema = businessSubmissionSchema.pick({
	ownerName: true,
	ownerEmail: true,
	ownerPhone: true,
	businessLicenseNumber: true,
	taxId: true,
	legalConfirmation: true,
});
