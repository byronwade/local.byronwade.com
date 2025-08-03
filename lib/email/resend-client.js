// REQUIRED: Resend email client for custom email templates and delivery
// Performance-first implementation with comprehensive logging

import { Resend } from "resend";
import { logger } from "@lib/utils/logger";

// Initialize Resend client with fallback for missing API key
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Check if Resend is properly configured
const isResendConfigured = () => {
	if (!resendApiKey) {
		logger.warn("RESEND_API_KEY not configured - email functionality disabled");
		return false;
	}
	return true;
};

/**
 * Email client with performance monitoring and error handling
 */
export class EmailService {
	/**
	 * Send password reset email with custom template
	 */
	static async sendPasswordResetEmail(email, resetUrl, userName = null) {
		const startTime = performance.now();

		if (!isResendConfigured()) {
			logger.warn("Password reset email skipped - Resend not configured");
			return { success: false, error: "Email service not configured" };
		}

		try {
			const { data, error } = await resend.emails.send({
				from: `${process.env.NEXT_PUBLIC_APP_NAME} <auth@${process.env.RESEND_DOMAIN}>`,
				to: [email],
				subject: "Reset Your Password",
				html: this.getPasswordResetTemplate(resetUrl, userName),
				text: `Reset your password by clicking this link: ${resetUrl}`,
				tags: [
					{ name: "category", value: "password_reset" },
					{ name: "environment", value: process.env.NODE_ENV },
				],
			});

			if (error) {
				throw error;
			}

			const duration = performance.now() - startTime;
			logger.performance(`Password reset email sent in ${duration.toFixed(2)}ms`);
			logger.info(`Password reset email sent to ${email}`, { emailId: data.id });

			return { success: true, emailId: data.id };
		} catch (error) {
			const duration = performance.now() - startTime;
			logger.error(`Password reset email failed in ${duration.toFixed(2)}ms:`, error);
			return { success: false, error: error.message };
		}
	}

	/**
	 * Send email verification with custom template
	 */
	static async sendEmailVerification(email, verificationUrl, userName = null) {
		const startTime = performance.now();

		if (!isResendConfigured()) {
			logger.warn("Email verification skipped - Resend not configured");
			return { success: false, error: "Email service not configured" };
		}

		try {
			const { data, error } = await resend.emails.send({
				from: `${process.env.NEXT_PUBLIC_APP_NAME} <auth@${process.env.RESEND_DOMAIN}>`,
				to: [email],
				subject: "Verify Your Email Address",
				html: this.getEmailVerificationTemplate(verificationUrl, userName),
				text: `Verify your email by clicking this link: ${verificationUrl}`,
				tags: [
					{ name: "category", value: "email_verification" },
					{ name: "environment", value: process.env.NODE_ENV },
				],
			});

			if (error) {
				throw error;
			}

			const duration = performance.now() - startTime;
			logger.performance(`Email verification sent in ${duration.toFixed(2)}ms`);
			logger.info(`Email verification sent to ${email}`, { emailId: data.id });

			return { success: true, emailId: data.id };
		} catch (error) {
			const duration = performance.now() - startTime;
			logger.error(`Email verification failed in ${duration.toFixed(2)}ms:`, error);
			return { success: false, error: error.message };
		}
	}

	/**
	 * Send business claim notification
	 */
	static async sendBusinessClaimNotification(email, businessName, claimUrl, ownerName = null) {
		const startTime = performance.now();

		if (!isResendConfigured()) {
			logger.warn("Business claim notification skipped - Resend not configured");
			return { success: false, error: "Email service not configured" };
		}

		try {
			const { data, error } = await resend.emails.send({
				from: `${process.env.NEXT_PUBLIC_APP_NAME} <business@${process.env.RESEND_DOMAIN}>`,
				to: [email],
				subject: `Business Claim Request: ${businessName}`,
				html: this.getBusinessClaimTemplate(businessName, claimUrl, ownerName),
				text: `Someone has requested to claim ${businessName}. Review the claim: ${claimUrl}`,
				tags: [
					{ name: "category", value: "business_claim" },
					{ name: "environment", value: process.env.NODE_ENV },
				],
			});

			if (error) {
				throw error;
			}

			const duration = performance.now() - startTime;
			logger.performance(`Business claim notification sent in ${duration.toFixed(2)}ms`);
			logger.info(`Business claim notification sent to ${email}`, { emailId: data.id, businessName });

			return { success: true, emailId: data.id };
		} catch (error) {
			const duration = performance.now() - startTime;
			logger.error(`Business claim notification failed in ${duration.toFixed(2)}ms:`, error);
			return { success: false, error: error.message };
		}
	}

	/**
	 * Send business submission confirmation
	 */
	static async sendBusinessSubmissionConfirmation(email, businessName, submissionId, userName = null) {
		const startTime = performance.now();

		if (!isResendConfigured()) {
			logger.warn("Business submission confirmation skipped - Resend not configured");
			return { success: false, error: "Email service not configured" };
		}

		try {
			const { data, error } = await resend.emails.send({
				from: `${process.env.NEXT_PUBLIC_APP_NAME} <business@${process.env.RESEND_DOMAIN}>`,
				to: [email],
				subject: `Business Submission Received: ${businessName}`,
				html: this.getBusinessSubmissionTemplate(businessName, submissionId, userName),
				text: `Your business submission for ${businessName} has been received. Submission ID: ${submissionId}`,
				tags: [
					{ name: "category", value: "business_submission" },
					{ name: "environment", value: process.env.NODE_ENV },
				],
			});

			if (error) {
				throw error;
			}

			const duration = performance.now() - startTime;
			logger.performance(`Business submission confirmation sent in ${duration.toFixed(2)}ms`);
			logger.info(`Business submission confirmation sent to ${email}`, { emailId: data.id, businessName, submissionId });

			return { success: true, emailId: data.id };
		} catch (error) {
			const duration = performance.now() - startTime;
			logger.error(`Business submission confirmation failed in ${duration.toFixed(2)}ms:`, error);
			return { success: false, error: error.message };
		}
	}

	/**
	 * Send welcome email to new users
	 */
	static async sendWelcomeEmail(email, userName, dashboardUrl) {
		const startTime = performance.now();

		if (!isResendConfigured()) {
			logger.warn("Welcome email skipped - Resend not configured");
			return { success: false, error: "Email service not configured" };
		}

		try {
			const { data, error } = await resend.emails.send({
				from: `${process.env.NEXT_PUBLIC_APP_NAME} <welcome@${process.env.RESEND_DOMAIN}>`,
				to: [email],
				subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}!`,
				html: this.getWelcomeTemplate(userName, dashboardUrl),
				text: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}! Visit your dashboard: ${dashboardUrl}`,
				tags: [
					{ name: "category", value: "welcome" },
					{ name: "environment", value: process.env.NODE_ENV },
				],
			});

			if (error) {
				throw error;
			}

			const duration = performance.now() - startTime;
			logger.performance(`Welcome email sent in ${duration.toFixed(2)}ms`);
			logger.info(`Welcome email sent to ${email}`, { emailId: data.id, userName });

			return { success: true, emailId: data.id };
		} catch (error) {
			const duration = performance.now() - startTime;
			logger.error(`Welcome email failed in ${duration.toFixed(2)}ms:`, error);
			return { success: false, error: error.message };
		}
	}

	/**
	 * Password reset email template
	 */
	static getPasswordResetTemplate(resetUrl, userName) {
		return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .content { padding: 30px 0; }
        .button { display: inline-block; padding: 12px 30px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding-top: 30px; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px; }
        .security-note { background-color: #f8f9fa; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">${process.env.NEXT_PUBLIC_APP_NAME}</div>
    </div>
    
    <div class="content">
        <h2>Reset Your Password</h2>
        
        ${userName ? `<p>Hi ${userName},</p>` : "<p>Hello,</p>"}
        
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        
        <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
        </div>
        
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        
        <div class="security-note">
            <strong>Security Note:</strong> This link will expire in 1 hour for your security. If you didn't request this reset, please ignore this email and your password will remain unchanged.
        </div>
        
        <p>If you continue to have problems, please contact our support team.</p>
    </div>
    
    <div class="footer">
        <p>&copy; ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_APP_NAME}. All rights reserved.</p>
        <p>This email was sent to ${resetUrl.includes("email=") ? new URL(resetUrl).searchParams.get("email") : "you"} regarding your account security.</p>
    </div>
</body>
</html>
        `;
	}

	/**
	 * Email verification template
	 */
	static getEmailVerificationTemplate(verificationUrl, userName) {
		return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .content { padding: 30px 0; }
        .button { display: inline-block; padding: 12px 30px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding-top: 30px; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">${process.env.NEXT_PUBLIC_APP_NAME}</div>
    </div>
    
    <div class="content">
        <h2>Verify Your Email Address</h2>
        
        ${userName ? `<p>Hi ${userName},</p>` : "<p>Hello,</p>"}
        
        <p>Thank you for signing up! Please verify your email address to complete your registration:</p>
        
        <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email</a>
        </div>
        
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        
        <p>This verification link will expire in 24 hours for security purposes.</p>
    </div>
    
    <div class="footer">
        <p>&copy; ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_APP_NAME}. All rights reserved.</p>
    </div>
</body>
</html>
        `;
	}

	/**
	 * Business claim notification template
	 */
	static getBusinessClaimTemplate(businessName, claimUrl, ownerName) {
		return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Claim Request</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .content { padding: 30px 0; }
        .button { display: inline-block; padding: 12px 30px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .business-info { background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding-top: 30px; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">${process.env.NEXT_PUBLIC_APP_NAME}</div>
    </div>
    
    <div class="content">
        <h2>Business Claim Request</h2>
        
        ${ownerName ? `<p>Dear ${ownerName},</p>` : "<p>Hello,</p>"}
        
        <p>Someone has requested to claim your business listing on ${process.env.NEXT_PUBLIC_APP_NAME}.</p>
        
        <div class="business-info">
            <h3>Business: ${businessName}</h3>
            <p>A user has submitted a claim request for this business. Please review and approve or deny this request.</p>
        </div>
        
        <div style="text-align: center;">
            <a href="${claimUrl}" class="button">Review Claim Request</a>
        </div>
        
        <p>This request will expire in 7 days if no action is taken.</p>
        
        <p>If you believe this request is fraudulent, please contact our support team immediately.</p>
    </div>
    
    <div class="footer">
        <p>&copy; ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_APP_NAME}. All rights reserved.</p>
    </div>
</body>
</html>
        `;
	}

	/**
	 * Business submission confirmation template
	 */
	static getBusinessSubmissionTemplate(businessName, submissionId, userName) {
		return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Submission Received</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .content { padding: 30px 0; }
        .submission-info { background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a; }
        .footer { text-align: center; padding-top: 30px; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">${process.env.NEXT_PUBLIC_APP_NAME}</div>
    </div>
    
    <div class="content">
        <h2>Business Submission Received</h2>
        
        ${userName ? `<p>Hi ${userName},</p>` : "<p>Hello,</p>"}
        
        <p>Thank you for submitting your business to ${process.env.NEXT_PUBLIC_APP_NAME}!</p>
        
        <div class="submission-info">
            <h3>Submission Details</h3>
            <p><strong>Business Name:</strong> ${businessName}</p>
            <p><strong>Submission ID:</strong> ${submissionId}</p>
            <p><strong>Status:</strong> Under Review</p>
        </div>
        
        <p>Our team will review your submission within 2-3 business days. You'll receive an email notification once your business has been approved and published.</p>
        
        <p>In the meantime, you can track your submission status in your dashboard.</p>
        
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
    </div>
    
    <div class="footer">
        <p>&copy; ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_APP_NAME}. All rights reserved.</p>
    </div>
</body>
</html>
        `;
	}

	/**
	 * Welcome email template
	 */
	static getWelcomeTemplate(userName, dashboardUrl) {
		return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .content { padding: 30px 0; }
        .button { display: inline-block; padding: 12px 30px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .features { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding-top: 30px; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">${process.env.NEXT_PUBLIC_APP_NAME}</div>
    </div>
    
    <div class="content">
        <h2>Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}!</h2>
        
        <p>Hi ${userName},</p>
        
        <p>Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}! We're excited to have you join our community of local businesses and customers.</p>
        
        <div class="features">
            <h3>Get started with these features:</h3>
            <ul>
                <li>🔍 Discover local businesses in your area</li>
                <li>📝 Write and read authentic reviews</li>
                <li>📱 Connect with business owners directly</li>
                <li>🏢 Claim or add your business listing</li>
            </ul>
        </div>
        
        <div style="text-align: center;">
            <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
        </div>
        
        <p>If you have any questions or need help getting started, our support team is here to help.</p>
        
        <p>Thank you for joining us!</p>
    </div>
    
    <div class="footer">
        <p>&copy; ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_APP_NAME}. All rights reserved.</p>
    </div>
</body>
</html>
        `;
	}
}

export default EmailService;
