/**
 * Partnership Utility Functions
 * Helper functions for partnership operations
 */

import { STATUS_CONFIG, VERIFICATION_STATUS, PARTNERSHIP_STATUS } from "./constants";

/**
 * Get status badge configuration
 */
export const getStatusBadge = (status) => {
	return STATUS_CONFIG[status] || STATUS_CONFIG[VERIFICATION_STATUS.NOT_STARTED];
};

/**
 * Get verification status from partnership
 */
export const getVerificationStatus = (verification) => {
	return verification?.status || VERIFICATION_STATUS.NOT_STARTED;
};

/**
 * Get verification progress percentage
 */
export const getVerificationProgress = (verification) => {
	if (!verification?.steps || verification.steps.length === 0) return 0;

	const completedSteps = verification.steps.filter((step) => step.status === VERIFICATION_STATUS.VERIFIED).length;

	return Math.round((completedSteps / verification.steps.length) * 100);
};

/**
 * Check if partnership can be verified
 */
export const canStartVerification = (partnership) => {
	if (!partnership) return false;

	const verification = partnership.verification;
	if (!verification) return false;

	// Check if all required steps are completed
	const requiredSteps = verification.steps.filter((step) => step.required);
	const completedRequiredSteps = requiredSteps.filter((step) => step.status === VERIFICATION_STATUS.VERIFIED);

	return completedRequiredSteps.length === requiredSteps.length;
};

/**
 * Get next verification step
 */
export const getNextVerificationStep = (verification) => {
	if (!verification?.steps) return null;

	const notStartedSteps = verification.steps.filter((step) => step.status === VERIFICATION_STATUS.NOT_STARTED);

	// Prioritize required steps
	const requiredNotStarted = notStartedSteps.filter((step) => step.required);
	if (requiredNotStarted.length > 0) {
		return requiredNotStarted[0];
	}

	return notStartedSteps[0] || null;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Filter partnerships by status
 */
export const filterPartnershipsByStatus = (partnerships, status) => {
	if (!status || status === "all") return partnerships;
	return partnerships.filter((partnership) => partnership.status === status);
};

/**
 * Sort partnerships by criteria
 */
export const sortPartnerships = (partnerships, sortBy = "name") => {
	const sorted = [...partnerships];

	switch (sortBy) {
		case "name":
			return sorted.sort((a, b) => a.name.localeCompare(b.name));
		case "type":
			return sorted.sort((a, b) => a.type.localeCompare(b.type));
		case "status":
			return sorted.sort((a, b) => a.status.localeCompare(b.status));
		case "startDate":
			return sorted.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
		case "verificationStatus":
			return sorted.sort((a, b) => {
				const aStatus = getVerificationStatus(a.verification);
				const bStatus = getVerificationStatus(b.verification);
				return aStatus.localeCompare(bStatus);
			});
		default:
			return sorted;
	}
};

/**
 * Search partnerships
 */
export const searchPartnerships = (partnerships, query) => {
	if (!query || query.length < 2) return partnerships;

	const searchTerm = query.toLowerCase();

	return partnerships.filter((partnership) => {
		return partnership.name.toLowerCase().includes(searchTerm) || partnership.type.toLowerCase().includes(searchTerm) || partnership.description?.toLowerCase().includes(searchTerm) || partnership.email?.toLowerCase().includes(searchTerm);
	});
};

/**
 * Get partnership statistics
 */
export const getPartnershipStats = (partnerships) => {
	const total = partnerships.length;
	const verified = partnerships.filter((p) => p.status === PARTNERSHIP_STATUS.VERIFIED).length;
	const pending = partnerships.filter((p) => p.status === PARTNERSHIP_STATUS.PENDING).length;
	const active = partnerships.filter((p) => p.status === PARTNERSHIP_STATUS.ACTIVE).length;

	const typeDistribution = partnerships.reduce((acc, partnership) => {
		acc[partnership.type] = (acc[partnership.type] || 0) + 1;
		return acc;
	}, {});

	return {
		total,
		verified,
		pending,
		active,
		verificationRate: total > 0 ? Math.round((verified / total) * 100) : 0,
		typeDistribution,
	};
};

/**
 * Validate document before upload
 */
export const validateDocumentUpload = (file, maxSize, allowedTypes) => {
	const errors = [];

	if (file.size > maxSize) {
		errors.push(`File size must be less than ${formatFileSize(maxSize)}`);
	}

	if (!allowedTypes.includes(file.type)) {
		errors.push("Invalid file type. Please upload PDF, Word, or image files only.");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};

/**
 * Generate verification ID
 */
export const generateVerificationId = () => {
	return `PV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if step is completed
 */
export const isStepCompleted = (step) => {
	return step.status === VERIFICATION_STATUS.VERIFIED;
};

/**
 * Check if step is in progress
 */
export const isStepInProgress = (step) => {
	return step.status === VERIFICATION_STATUS.IN_PROGRESS;
};

/**
 * Get step icon class
 */
export const getStepIconClass = (status) => {
	const config = getStatusBadge(status);
	return config.color;
};

/**
 * Calculate overall verification score
 */
export const calculateVerificationScore = (partnerships) => {
	if (partnerships.length === 0) return 0;

	const totalPossibleScore = partnerships.length * 100;
	const actualScore = partnerships.reduce((score, partnership) => {
		return score + getVerificationProgress(partnership.verification);
	}, 0);

	return Math.round((actualScore / totalPossibleScore) * 100);
};
