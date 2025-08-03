// REQUIRED: Email automation system for business workflows
// Implements event-driven email notifications with comprehensive logging

import { EmailService } from "./resend-client";
import { logger } from "@lib/utils/logger";
import { supabase } from "@lib/supabase/client";

/**
 * Email automation engine for business-related workflows
 * Handles all automated email notifications throughout the user journey
 */
export class EmailAutomation {
	/**
	 * Send welcome email sequence for new users
	 */
	static async triggerWelcomeSequence(user, context = {}) {
		const startTime = performance.now();

		try {
			// Send immediate welcome email
			const welcomeResult = await EmailService.sendWelcomeEmail(user.email, user.name || user.first_name, `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);

			if (!welcomeResult.success) {
				throw new Error(`Welcome email failed: ${welcomeResult.error}`);
			}

			// Schedule follow-up emails (you might want to use a job queue for this)
			await this.scheduleFollowUpEmails(user, "welcome_sequence");

			const duration = performance.now() - startTime;
			logger.performance(`Welcome sequence triggered in ${duration.toFixed(2)}ms`);

			// Log automation event
			logger.info("Welcome email sequence triggered", {
				userId: user.id,
				email: user.email,
				context,
				emailId: welcomeResult.emailId,
			});

			return { success: true, emailId: welcomeResult.emailId };
		} catch (error) {
			const duration = performance.now() - startTime;
			logger.error(`Welcome sequence failed in ${duration.toFixed(2)}ms:`, error);
			return { success: false, error: error.message };
		}
	}

	/**
	 * Handle business claim workflow emails
	 */
	static async triggerBusinessClaimWorkflow(claimData) {
		const startTime = performance.now();
		const results = [];

		try {
			// 1. Send confirmation to claimant
			const claimantResult = await EmailService.sendBusinessClaimNotification(claimData.claimantEmail, claimData.businessName, `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/business/claims/${claimData.claimId}`, claimData.claimantName);

			results.push({ type: "claimant_confirmation", ...claimantResult });

			// 2. Notify business owner if email exists
			if (claimData.businessOwnerEmail) {
				const ownerResult = await EmailService.sendBusinessClaimNotification(claimData.businessOwnerEmail, claimData.businessName, `${process.env.NEXT_PUBLIC_APP_URL}/business/claim-review/${claimData.claimId}`, claimData.businessOwnerName);

				results.push({ type: "owner_notification", ...ownerResult });
			}

			// 3. Notify admin team
			if (process.env.ADMIN_EMAIL) {
				const adminResult = await EmailService.sendBusinessClaimNotification(process.env.ADMIN_EMAIL, claimData.businessName, `${process.env.NEXT_PUBLIC_APP_URL}/admin/claims/${claimData.claimId}`, "Admin Team");

				results.push({ type: "admin_notification", ...adminResult });
			}

			// 4. Schedule follow-up reminders
			await this.scheduleBusinessClaimReminders(claimData);

			const duration = performance.now() - startTime;
			logger.performance(`Business claim workflow completed in ${duration.toFixed(2)}ms`);

			logger.info("Business claim email workflow triggered", {
				claimId: claimData.claimId,
				businessId: claimData.businessId,
				businessName: claimData.businessName,
				emailsSent: results.filter((r) => r.success).length,
				emailsFailed: results.filter((r) => !r.success).length,
			});

			return { success: true, results };
		} catch (error) {
			const duration = performance.now() - startTime;
			logger.error(`Business claim workflow failed in ${duration.toFixed(2)}ms:`, error);
			return { success: false, error: error.message, results };
		}
	}

	/**
	 * Handle business submission workflow emails
	 */
	static async triggerBusinessSubmissionWorkflow(submissionData) {
		const startTime = performance.now();
		const results = [];

		try {
			// 1. Send confirmation to submitter
			const submitterResult = await EmailService.sendBusinessSubmissionConfirmation(submissionData.ownerEmail, submissionData.businessName, submissionData.submissionId, submissionData.ownerName);

			results.push({ type: "submitter_confirmation", ...submitterResult });

			// 2. Notify admin team for review
			if (process.env.ADMIN_EMAIL) {
				const adminResult = await this.sendAdminSubmissionNotification(submissionData);

				results.push({ type: "admin_notification", ...adminResult });
			}

			// 3. Schedule review reminders
			await this.scheduleSubmissionReviewReminders(submissionData);

			const duration = performance.now() - startTime;
			logger.performance(`Business submission workflow completed in ${duration.toFixed(2)}ms`);

			logger.info("Business submission email workflow triggered", {
				submissionId: submissionData.submissionId,
				businessName: submissionData.businessName,
				category: submissionData.category,
				city: submissionData.city,
				state: submissionData.state,
				emailsSent: results.filter((r) => r.success).length,
			});

			return { success: true, results };
		} catch (error) {
			const duration = performance.now() - startTime;
			logger.error(`Business submission workflow failed in ${duration.toFixed(2)}ms:`, error);
			return { success: false, error: error.message, results };
		}
	}

	/**
	 * Send password reset with custom tracking
	 */
	static async triggerPasswordResetWorkflow(email, resetUrl, userName = null) {
		const startTime = performance.now();

		try {
			const result = await EmailService.sendPasswordResetEmail(email, resetUrl, userName);

			if (result.success) {
				// Log password reset for security monitoring
				logger.security({
					action: "password_reset_email_sent",
					email: email,
					resetUrl: resetUrl, // Be careful about logging URLs in production
					timestamp: Date.now(),
				});
			}

			const duration = performance.now() - startTime;
			logger.performance(`Password reset workflow completed in ${duration.toFixed(2)}ms`);

			return result;
		} catch (error) {
			const duration = performance.now() - startTime;
			logger.error(`Password reset workflow failed in ${duration.toFixed(2)}ms:`, error);
			return { success: false, error: error.message };
		}
	}

	/**
	 * Handle email verification workflow
	 */
	static async triggerEmailVerificationWorkflow(email, verificationUrl, userName = null) {
		const startTime = performance.now();

		try {
			const result = await EmailService.sendEmailVerification(email, verificationUrl, userName);

			if (result.success) {
				// Schedule reminder emails if not verified within 24 hours
				await this.scheduleEmailVerificationReminders(email, userName);
			}

			const duration = performance.now() - startTime;
			logger.performance(`Email verification workflow completed in ${duration.toFixed(2)}ms`);

			return result;
		} catch (error) {
			const duration = performance.now() - startTime;
			logger.error(`Email verification workflow failed in ${duration.toFixed(2)}ms:`, error);
			return { success: false, error: error.message };
		}
	}

	/**
	 * Schedule follow-up emails (simplified - in production use a job queue)
	 */
	static async scheduleFollowUpEmails(user, sequenceType) {
		try {
			// Store scheduled emails in database for processing
			const scheduledEmails = [
				{
					user_id: user.id,
					email: user.email,
					sequence_type: sequenceType,
					email_type: "onboarding_tip_1",
					scheduled_for: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
					status: "scheduled",
				},
				{
					user_id: user.id,
					email: user.email,
					sequence_type: sequenceType,
					email_type: "feature_discovery",
					scheduled_for: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
					status: "scheduled",
				},
				{
					user_id: user.id,
					email: user.email,
					sequence_type: sequenceType,
					email_type: "engagement_check",
					scheduled_for: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
					status: "scheduled",
				},
			];

			// Insert scheduled emails
			const { error } = await supabase.from("scheduled_emails").insert(scheduledEmails);

			if (error) {
				throw error;
			}

			logger.info("Follow-up emails scheduled", {
				userId: user.id,
				sequenceType,
				emailsScheduled: scheduledEmails.length,
			});
		} catch (error) {
			logger.error("Failed to schedule follow-up emails:", error);
		}
	}

	/**
	 * Schedule business claim reminders
	 */
	static async scheduleBusinessClaimReminders(claimData) {
		try {
			const reminders = [
				{
					claim_id: claimData.claimId,
					email: claimData.businessOwnerEmail || process.env.ADMIN_EMAIL,
					reminder_type: "claim_review_reminder",
					scheduled_for: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
					status: "scheduled",
				},
				{
					claim_id: claimData.claimId,
					email: claimData.claimantEmail,
					reminder_type: "claim_status_update",
					scheduled_for: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
					status: "scheduled",
				},
			];

			const { error } = await supabase.from("scheduled_emails").insert(reminders);

			if (error) {
				throw error;
			}

			logger.info("Business claim reminders scheduled", {
				claimId: claimData.claimId,
				remindersScheduled: reminders.length,
			});
		} catch (error) {
			logger.error("Failed to schedule claim reminders:", error);
		}
	}

	/**
	 * Schedule submission review reminders
	 */
	static async scheduleSubmissionReviewReminders(submissionData) {
		try {
			const reminders = [
				{
					submission_id: submissionData.submissionId,
					email: process.env.ADMIN_EMAIL,
					reminder_type: "submission_review_reminder",
					scheduled_for: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
					status: "scheduled",
				},
				{
					submission_id: submissionData.submissionId,
					email: submissionData.ownerEmail,
					reminder_type: "submission_status_update",
					scheduled_for: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
					status: "scheduled",
				},
			];

			const { error } = await supabase.from("scheduled_emails").insert(reminders);

			if (error) {
				throw error;
			}

			logger.info("Submission review reminders scheduled", {
				submissionId: submissionData.submissionId,
				remindersScheduled: reminders.length,
			});
		} catch (error) {
			logger.error("Failed to schedule submission reminders:", error);
		}
	}

	/**
	 * Schedule email verification reminders
	 */
	static async scheduleEmailVerificationReminders(email, userName) {
		try {
			const reminders = [
				{
					email: email,
					reminder_type: "email_verification_reminder",
					scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
					status: "scheduled",
					metadata: JSON.stringify({ userName }),
				},
				{
					email: email,
					reminder_type: "email_verification_final",
					scheduled_for: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours
					status: "scheduled",
					metadata: JSON.stringify({ userName }),
				},
			];

			const { error } = await supabase.from("scheduled_emails").insert(reminders);

			if (error) {
				throw error;
			}

			logger.info("Email verification reminders scheduled", {
				email: email,
				remindersScheduled: reminders.length,
			});
		} catch (error) {
			logger.error("Failed to schedule verification reminders:", error);
		}
	}

	/**
	 * Send admin notification for business submissions
	 */
	static async sendAdminSubmissionNotification(submissionData) {
		try {
			const adminEmailContent = `
				<h2>New Business Submission Pending Review</h2>
				<p><strong>Business Name:</strong> ${submissionData.businessName}</p>
				<p><strong>Category:</strong> ${submissionData.category}</p>
				<p><strong>Location:</strong> ${submissionData.city}, ${submissionData.state}</p>
				<p><strong>Submitted by:</strong> ${submissionData.ownerName} (${submissionData.ownerEmail})</p>
				<p><strong>Submission ID:</strong> ${submissionData.submissionId}</p>
				
				<h3>Business Details:</h3>
				<p>${submissionData.description}</p>
				
				<p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/submissions/${submissionData.submissionId}">Review Submission</a></p>
			`;

			const result = await EmailService.sendBusinessSubmissionConfirmation(process.env.ADMIN_EMAIL, submissionData.businessName, submissionData.submissionId, "Admin Team");

			return result;
		} catch (error) {
			logger.error("Failed to send admin submission notification:", error);
			return { success: false, error: error.message };
		}
	}

	/**
	 * Process scheduled emails (this would typically run as a cron job)
	 */
	static async processScheduledEmails() {
		const startTime = performance.now();

		try {
			// Get emails scheduled for now or earlier
			const { data: scheduledEmails, error } = await supabase.from("scheduled_emails").select("*").eq("status", "scheduled").lte("scheduled_for", new Date().toISOString()).limit(100); // Process in batches

			if (error) {
				throw error;
			}

			const results = [];

			for (const emailRecord of scheduledEmails) {
				try {
					let emailResult;

					// Route to appropriate email handler based on type
					switch (emailRecord.reminder_type || emailRecord.email_type) {
						case "email_verification_reminder":
						case "email_verification_final":
							emailResult = await this.sendVerificationReminder(emailRecord);
							break;
						case "claim_review_reminder":
							emailResult = await this.sendClaimReviewReminder(emailRecord);
							break;
						case "submission_review_reminder":
							emailResult = await this.sendSubmissionReviewReminder(emailRecord);
							break;
						case "onboarding_tip_1":
						case "feature_discovery":
						case "engagement_check":
							emailResult = await this.sendOnboardingEmail(emailRecord);
							break;
						default:
							logger.warn(`Unknown email type: ${emailRecord.email_type || emailRecord.reminder_type}`);
							continue;
					}

					// Update record status
					await supabase
						.from("scheduled_emails")
						.update({
							status: emailResult.success ? "sent" : "failed",
							sent_at: new Date().toISOString(),
							error_message: emailResult.error || null,
						})
						.eq("id", emailRecord.id);

					results.push({
						id: emailRecord.id,
						success: emailResult.success,
						type: emailRecord.email_type || emailRecord.reminder_type,
					});
				} catch (processingError) {
					logger.error(`Failed to process scheduled email ${emailRecord.id}:`, processingError);

					await supabase
						.from("scheduled_emails")
						.update({
							status: "failed",
							error_message: processingError.message,
						})
						.eq("id", emailRecord.id);

					results.push({
						id: emailRecord.id,
						success: false,
						error: processingError.message,
					});
				}
			}

			const duration = performance.now() - startTime;
			logger.performance(`Processed ${scheduledEmails.length} scheduled emails in ${duration.toFixed(2)}ms`);

			logger.info("Scheduled emails processed", {
				totalProcessed: scheduledEmails.length,
				successful: results.filter((r) => r.success).length,
				failed: results.filter((r) => !r.success).length,
			});

			return { success: true, results };
		} catch (error) {
			const duration = performance.now() - startTime;
			logger.error(`Scheduled email processing failed in ${duration.toFixed(2)}ms:`, error);
			return { success: false, error: error.message };
		}
	}

	/**
	 * Send verification reminder email
	 */
	static async sendVerificationReminder(emailRecord) {
		const metadata = JSON.parse(emailRecord.metadata || "{}");
		const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?email=${encodeURIComponent(emailRecord.email)}`;

		return EmailService.sendEmailVerification(emailRecord.email, verificationUrl, metadata.userName);
	}

	/**
	 * Send claim review reminder
	 */
	static async sendClaimReviewReminder(emailRecord) {
		// Implement claim review reminder logic
		return { success: true, emailId: `reminder_${emailRecord.id}` };
	}

	/**
	 * Send submission review reminder
	 */
	static async sendSubmissionReviewReminder(emailRecord) {
		// Implement submission review reminder logic
		return { success: true, emailId: `reminder_${emailRecord.id}` };
	}

	/**
	 * Send onboarding emails
	 */
	static async sendOnboardingEmail(emailRecord) {
		// Implement onboarding email logic
		return { success: true, emailId: `onboarding_${emailRecord.id}` };
	}
}

export default EmailAutomation;
