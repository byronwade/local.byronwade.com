/**
 * Partnership Schema and Validation
 * Zod schemas for partnership data validation
 */

import { z } from "zod";
import { PARTNERSHIP_TYPES, PARTNERSHIP_STATUS, VERIFICATION_STATUS, DOCUMENT_UPLOAD_CONFIG } from "./constants";

export const partnershipSchema = z.object({
	id: z.union([z.string(), z.number()]),
	name: z.string().min(2, "Partnership name must be at least 2 characters"),
	type: z.enum(PARTNERSHIP_TYPES, {
		errorMap: () => ({ message: "Please select a valid partnership type" }),
	}),
	description: z.string().min(10, "Description must be at least 10 characters"),
	logo: z.string().url().optional().or(z.literal("")),
	website: z.string().url("Invalid website URL").optional().or(z.literal("")),
	email: z.string().email("Invalid email address").optional().or(z.literal("")),
	phone: z.string().optional(),
	address: z.string().optional(),
	startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
		message: "Invalid date format",
	}),
	status: z.enum(Object.values(PARTNERSHIP_STATUS)),
	benefits: z.string().optional(),
	notes: z.string().optional(),
	verification: z.object({
		status: z.enum(Object.values(VERIFICATION_STATUS)),
		submittedDate: z.string().nullable(),
		verifiedDate: z.string().nullable(),
		verificationId: z.string().nullable(),
		steps: z.array(
			z.object({
				id: z.string(),
				title: z.string(),
				description: z.string(),
				status: z.enum(Object.values(VERIFICATION_STATUS)),
				required: z.boolean(),
			})
		),
		documents: z.array(
			z.object({
				id: z.union([z.string(), z.number()]),
				name: z.string(),
				size: z.number(),
				type: z.string(),
				uploadDate: z.string(),
				status: z.string(),
			})
		),
		communications: z.array(z.any()).optional(),
	}),
});

export const documentUploadSchema = z.object({
	file: z
		.instanceof(File)
		.refine((file) => file.size <= DOCUMENT_UPLOAD_CONFIG.MAX_FILE_SIZE, {
			message: `File size must be less than ${DOCUMENT_UPLOAD_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`,
		})
		.refine((file) => DOCUMENT_UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type), {
			message: "Invalid file type. Please upload PDF, Word, or image files only.",
		}),
});

export const businessSearchSchema = z.object({
	query: z.string().min(2, "Search query must be at least 2 characters"),
});

export const verificationStepSchema = z.object({
	stepId: z.string(),
	status: z.enum(Object.values(VERIFICATION_STATUS)),
	notes: z.string().optional(),
	completedDate: z.string().optional(),
});

// Helper function to create a new partnership
export const createPartnership = (businessData) => {
	return {
		id: Date.now(),
		name: businessData.name,
		type: "Supplier", // Default type
		description: businessData.description || `Partnership with ${businessData.name}`,
		logo: businessData.logo || "/placeholder.svg",
		website: businessData.website || "",
		email: businessData.email || "",
		phone: businessData.phone || "",
		address: businessData.address || "",
		startDate: new Date().toISOString().split("T")[0],
		status: PARTNERSHIP_STATUS.PENDING,
		benefits: "",
		notes: "",
		verification: {
			status: VERIFICATION_STATUS.NOT_STARTED,
			submittedDate: null,
			verifiedDate: null,
			verificationId: null,
			steps: [
				{
					id: "contact_verification",
					title: "Contact Verification",
					description: "Verify partner contact information",
					status: VERIFICATION_STATUS.NOT_STARTED,
					required: true,
				},
				{
					id: "document_verification",
					title: "Document Verification",
					description: "Upload partnership agreement or contract",
					status: VERIFICATION_STATUS.NOT_STARTED,
					required: true,
				},
				{
					id: "reference_check",
					title: "Reference Check",
					description: "Verify partnership references",
					status: VERIFICATION_STATUS.NOT_STARTED,
					required: false,
				},
			],
			documents: [],
			communications: [],
		},
	};
};

// Helper function to validate partnership data
export const validatePartnership = (data) => {
	try {
		return partnershipSchema.parse(data);
	} catch (error) {
		throw new Error(`Partnership validation failed: ${error.message}`);
	}
};
