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
		const claimData = {
			businessId: formData.get("businessId"),
			businessName: formData.get("businessName"),
			userId: formData.get("userId"),
			claimantName: formData.get("claimantName"),
			claimantEmail: formData.get("claimantEmail"),
			claimantPhone: formData.get("claimantPhone"),
			relationship: formData.get("relationship"),
			businessRole: formData.get("businessRole"),
			yearsAssociated: formData.get("yearsAssociated"),
			verificationDetails: formData.get("verificationDetails"),
			proposedChanges: formData.get("proposedChanges") || null,
			legalConfirmation: formData.get("legalConfirmation") === "true",
			claimDate: formData.get("claimDate"),
			userAgent: formData.get("userAgent"),
		};

		// Validation
		if (!claimData.businessId || !claimData.userId || !claimData.claimantEmail) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		// Verify user matches session
		if (claimData.userId !== session.user.id) {
			return NextResponse.json({ error: "User mismatch" }, { status: 403 });
		}

		// Check if user has already claimed this business
		const { data: existingClaim } = await supabase.from("business_claims").select("id, status").eq("business_id", claimData.businessId).eq("user_id", claimData.userId).single();

		if (existingClaim) {
			return NextResponse.json(
				{
					error: "You have already submitted a claim for this business",
					claimId: existingClaim.id,
					status: existingClaim.status,
				},
				{ status: 409 }
			);
		}

		// Get business information
		const { data: business, error: businessError } = await supabase.from("businesses").select("*").eq("id", claimData.businessId).single();

		if (businessError || !business) {
			return NextResponse.json({ error: "Business not found" }, { status: 404 });
		}

		// Handle file uploads (verification documents)
		const uploadedFiles = [];
		for (let i = 0; i < 3; i++) {
			const file = formData.get(`verification_document_${i}`);
			if (file && file.size > 0) {
				try {
					// Upload to Supabase Storage
					const fileName = `claim_${claimData.businessId}_${claimData.userId}_${i}_${Date.now()}.${file.name.split(".").pop()}`;
					const { data: uploadData, error: uploadError } = await supabase.storage.from("business_claim_documents").upload(fileName, file);

					if (uploadError) {
						logger.error("File upload error:", uploadError);
					} else {
						uploadedFiles.push({
							fileName: file.name,
							storagePath: uploadData.path,
							size: file.size,
							type: file.type,
						});
					}
				} catch (uploadError) {
					logger.error("File upload failed:", uploadError);
				}
			}
		}

		// Create business claim record
		const { data: claimRecord, error: claimError } = await supabase
			.from("business_claims")
			.insert({
				business_id: claimData.businessId,
				user_id: claimData.userId,
				claimant_name: claimData.claimantName,
				claimant_email: claimData.claimantEmail,
				claimant_phone: claimData.claimantPhone,
				relationship: claimData.relationship,
				business_role: claimData.businessRole,
				years_associated: claimData.yearsAssociated,
				verification_details: claimData.verificationDetails,
				proposed_changes: claimData.proposedChanges,
				verification_documents: uploadedFiles,
				status: "pending",
				submitted_at: new Date().toISOString(),
				user_agent: claimData.userAgent,
			})
			.select()
			.single();

		if (claimError) {
			logger.error("Failed to create business claim:", claimError);
			return NextResponse.json({ error: "Failed to submit claim" }, { status: 500 });
		}

		// Send confirmation email to claimant
		try {
			await EmailService.sendBusinessClaimNotification(claimData.claimantEmail, business.name, `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/business/claims/${claimRecord.id}`, claimData.claimantName);
		} catch (emailError) {
			logger.error("Failed to send claim confirmation email:", emailError);
			// Don't fail the entire request if email fails
		}

		// Send notification to business owner (if email exists)
		if (business.email) {
			try {
				await EmailService.sendBusinessClaimNotification(business.email, business.name, `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/business/claims/${claimRecord.id}`, business.owner_name);
			} catch (emailError) {
				logger.error("Failed to send owner notification email:", emailError);
			}
		}

		// Log successful claim submission
		logger.info("Business claim submitted successfully", {
			claimId: claimRecord.id,
			businessId: claimData.businessId,
			businessName: business.name,
			userId: claimData.userId,
			claimantEmail: claimData.claimantEmail,
			documentsUploaded: uploadedFiles.length,
		});

		const duration = performance.now() - startTime;
		logger.performance(`Business claim API completed in ${duration.toFixed(2)}ms`);

		return NextResponse.json(
			{
				success: true,
				claimId: claimRecord.id,
				status: "pending",
				message: "Business claim submitted successfully",
			},
			{ status: 201 }
		);
	} catch (error) {
		const duration = performance.now() - startTime;
		logger.error(`Business claim API failed in ${duration.toFixed(2)}ms:`, error);

		return NextResponse.json(
			{
				error: "Internal server error",
				message: "Failed to process business claim",
			},
			{ status: 500 }
		);
	}
}

// Get claim status
export async function GET(request) {
	const startTime = performance.now();

	try {
		const { searchParams } = new URL(request.url);
		const businessId = searchParams.get("businessId");
		const userId = searchParams.get("userId");

		if (!businessId || !userId) {
			return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
		}

		const supabase = createSupabaseRouteHandlerClient(request, NextResponse.next());

		// Verify user authentication
		const {
			data: { session },
			error: sessionError,
		} = await supabase.auth.getSession();

		if (sessionError || !session?.user || session.user.id !== userId) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		// Get claim status
		const { data: claim, error: claimError } = await supabase.from("business_claims").select("id, status, submitted_at, reviewed_at, reviewer_notes").eq("business_id", businessId).eq("user_id", userId).single();

		if (claimError) {
			if (claimError.code === "PGRST116") {
				// No claim found
				return NextResponse.json({ status: null, hasClaim: false });
			}
			throw claimError;
		}

		const duration = performance.now() - startTime;
		logger.performance(`Claim status check completed in ${duration.toFixed(2)}ms`);

		return NextResponse.json({
			status: claim.status,
			hasClaim: true,
			claimId: claim.id,
			submittedAt: claim.submitted_at,
			reviewedAt: claim.reviewed_at,
			reviewerNotes: claim.reviewer_notes,
		});
	} catch (error) {
		const duration = performance.now() - startTime;
		logger.error(`Claim status check failed in ${duration.toFixed(2)}ms:`, error);

		return NextResponse.json(
			{
				error: "Failed to check claim status",
			},
			{ status: 500 }
		);
	}
}
