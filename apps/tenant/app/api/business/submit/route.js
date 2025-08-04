import { NextResponse } from "next/server";
import { createSupabaseRouteHandlerClient } from "@lib/supabase/ssr";
import { EmailService } from "@lib/email/resend-client";
import { logger } from "@lib/utils/logger";

export async function POST(request) {
	const startTime = performance.now();

	try {
		// Create Supabase client for server-side operations
		const supabase = createSupabaseRouteHandlerClient(request, NextResponse.next());

		// Verify user authentication
		const {
			data: { session },
			error: sessionError,
		} = await supabase.auth.getSession();

		if (sessionError || !session?.user) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		// Parse form data
		const formData = await request.formData();

		// Extract form fields
		const businessData = {
			// Basic Information
			businessName: formData.get("businessName"),
			description: formData.get("description"),
			category: formData.get("category"),
			subcategory: formData.get("subcategory") || null,

			// Contact Information
			address: formData.get("address"),
			city: formData.get("city"),
			state: formData.get("state"),
			zipCode: formData.get("zipCode"),
			phone: formData.get("phone"),
			email: formData.get("email"),
			website: formData.get("website") || null,

			// Business Details
			yearEstablished: formData.get("yearEstablished") || null,
			employeeCount: formData.get("employeeCount") || null,
			priceRange: formData.get("priceRange"),

			// Additional Information
			specialties: JSON.parse(formData.get("specialties") || "[]"),
			amenities: JSON.parse(formData.get("amenities") || "[]"),
			paymentMethods: JSON.parse(formData.get("paymentMethods") || "[]"),
			hours: JSON.parse(formData.get("hours") || "[]"),

			// Owner Information
			ownerName: formData.get("ownerName"),
			ownerEmail: formData.get("ownerEmail"),
			ownerPhone: formData.get("ownerPhone"),
			businessLicenseNumber: formData.get("businessLicenseNumber") || null,
			taxId: formData.get("taxId") || null,

			// Submission metadata
			submitterId: formData.get("submitterId"),
			submitterName: formData.get("submitterName"),
			submissionDate: formData.get("submissionDate"),
			userAgent: formData.get("userAgent"),
		};

		// Validation
		if (!businessData.businessName || !businessData.description || !businessData.category) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		// Verify user matches session
		if (businessData.submitterId !== session.user.id) {
			return NextResponse.json({ error: "User mismatch" }, { status: 403 });
		}

		// Check for duplicate business submissions (same name and address)
		const { data: existingBusiness } = await supabase.from("business_submissions").select("id, status").eq("business_name", businessData.businessName).eq("address", businessData.address).eq("city", businessData.city).single();

		if (existingBusiness) {
			return NextResponse.json(
				{
					error: "A business with this name and address has already been submitted",
					existingSubmissionId: existingBusiness.id,
					status: existingBusiness.status,
				},
				{ status: 409 }
			);
		}

		// Handle image uploads
		const uploadedImages = [];
		for (let i = 0; i < 10; i++) {
			const image = formData.get(`business_image_${i}`);
			if (image && image.size > 0) {
				try {
					// Upload to Supabase Storage
					const fileName = `submission_${businessData.submitterId}_${Date.now()}_${i}.${image.name.split(".").pop()}`;
					const { data: uploadData, error: uploadError } = await supabase.storage.from("business_submission_images").upload(fileName, image);

					if (uploadError) {
						logger.error("Image upload error:", uploadError);
					} else {
						uploadedImages.push({
							fileName: image.name,
							storagePath: uploadData.path,
							size: image.size,
							type: image.type,
							order: i,
						});
					}
				} catch (uploadError) {
					logger.error("Image upload failed:", uploadError);
				}
			}
		}

		// Generate approximate coordinates from address (you might want to use a geocoding service)
		const approximateCoordinates = await geocodeAddress(`${businessData.address}, ${businessData.city}, ${businessData.state}`);

		// Create business submission record
		const { data: submissionRecord, error: submissionError } = await supabase
			.from("business_submissions")
			.insert({
				// Basic Information
				business_name: businessData.businessName,
				description: businessData.description,
				category: businessData.category,
				subcategory: businessData.subcategory,

				// Contact Information
				address: businessData.address,
				city: businessData.city,
				state: businessData.state,
				zip_code: businessData.zipCode,
				phone: businessData.phone,
				email: businessData.email,
				website: businessData.website,

				// Business Details
				year_established: businessData.yearEstablished ? parseInt(businessData.yearEstablished) : null,
				employee_count: businessData.employeeCount,
				price_range: businessData.priceRange,

				// Location data
				latitude: approximateCoordinates?.lat || null,
				longitude: approximateCoordinates?.lng || null,

				// Additional Information
				specialties: businessData.specialties,
				amenities: businessData.amenities,
				payment_methods: businessData.paymentMethods,
				operating_hours: businessData.hours,

				// Owner Information
				owner_name: businessData.ownerName,
				owner_email: businessData.ownerEmail,
				owner_phone: businessData.ownerPhone,
				business_license_number: businessData.businessLicenseNumber,
				tax_id: businessData.taxId,

				// Images
				images: uploadedImages,

				// Submission metadata
				submitter_id: businessData.submitterId,
				submitter_name: businessData.submitterName,
				status: "pending",
				submitted_at: new Date().toISOString(),
				user_agent: businessData.userAgent,
			})
			.select()
			.single();

		if (submissionError) {
			logger.error("Failed to create business submission:", submissionError);
			return NextResponse.json({ error: "Failed to submit business" }, { status: 500 });
		}

		// Send confirmation email to submitter
		try {
			await EmailService.sendBusinessSubmissionConfirmation(businessData.ownerEmail, businessData.businessName, submissionRecord.id, businessData.ownerName);
		} catch (emailError) {
			logger.error("Failed to send submission confirmation email:", emailError);
			// Don't fail the entire request if email fails
		}

		// Send notification to admin team
		try {
			if (process.env.ADMIN_EMAIL) {
				await EmailService.sendBusinessSubmissionConfirmation(process.env.ADMIN_EMAIL, businessData.businessName, submissionRecord.id, "Admin Team");
			}
		} catch (emailError) {
			logger.error("Failed to send admin notification email:", emailError);
		}

		// Log successful submission
		logger.info("Business submission completed successfully", {
			submissionId: submissionRecord.id,
			businessName: businessData.businessName,
			submitterId: businessData.submitterId,
			category: businessData.category,
			city: businessData.city,
			state: businessData.state,
			imagesUploaded: uploadedImages.length,
		});

		const duration = performance.now() - startTime;
		logger.performance(`Business submission API completed in ${duration.toFixed(2)}ms`);

		return NextResponse.json(
			{
				success: true,
				submissionId: submissionRecord.id,
				status: "pending",
				message: "Business submitted successfully for review",
			},
			{ status: 201 }
		);
	} catch (error) {
		const duration = performance.now() - startTime;
		logger.error(`Business submission API failed in ${duration.toFixed(2)}ms:`, error);

		return NextResponse.json(
			{
				error: "Internal server error",
				message: "Failed to process business submission",
			},
			{ status: 500 }
		);
	}
}

// Simple geocoding function (you might want to use Google Maps API or similar)
async function geocodeAddress(address) {
	try {
		// This is a simple approximation - in production, use a proper geocoding service
		// For now, return null coordinates
		return null;
	} catch (error) {
		logger.error("Geocoding failed:", error);
		return null;
	}
}
