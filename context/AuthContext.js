// Enhanced AuthContext with comprehensive security and performance features
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useEnhancedAuth } from "@hooks/useEnhancedAuth";
import { getEnabledProviders } from "@lib/supabase/auth/providers";
import { logger } from "@lib/utils/logger";

const AuthContext = createContext();

/**
 * Enhanced Auth Provider with security and performance features
 */
export const AuthProvider = ({ children }) => {
	const enhancedAuth = useEnhancedAuth();
	const [oauthProviders, setOauthProviders] = useState([]);
	const [isInitialized, setIsInitialized] = useState(false);

	// Initialize OAuth providers
	useEffect(() => {
		const initializeProviders = async () => {
			try {
				const providers = await getEnabledProviders();
				setOauthProviders(providers);
				logger.debug(
					"OAuth providers initialized:",
					providers.map((p) => p.name)
				);
			} catch (error) {
				logger.error("Failed to initialize OAuth providers:", error);
			}
		};

		initializeProviders();
	}, []);

	// Mark as initialized when auth is ready
	useEffect(() => {
		if (!enhancedAuth.loading) {
			setIsInitialized(true);
		}
	}, [enhancedAuth.loading]);

	// Enhanced context value with all security features
	const contextValue = {
		// Core auth state
		user: enhancedAuth.user,
		session: enhancedAuth.session,
		profile: enhancedAuth.profile,
		isAuthenticated: enhancedAuth.isAuthenticated,
		isEmailVerified: enhancedAuth.isEmailVerified,
		userRoles: enhancedAuth.userRoles,
		loading: enhancedAuth.loading,
		error: enhancedAuth.error,
		isInitialized,

		// Security features
		deviceInfo: enhancedAuth.deviceInfo,
		securityMetrics: enhancedAuth.securityMetrics,

		// Authentication actions
		login: enhancedAuth.login,
		logout: enhancedAuth.logout,
		loginWithOAuth: enhancedAuth.loginWithOAuth,
		resetPassword: enhancedAuth.resetPassword,
		updatePassword: enhancedAuth.updatePassword,

		// Validation and security
		validateEmail: enhancedAuth.validateEmail,
		validatePasswordStrength: enhancedAuth.validatePasswordStrength,
		checkBreachedPassword: enhancedAuth.checkBreachedPassword,

		// Role management
		hasRole: enhancedAuth.hasRole,
		hasAnyRole: enhancedAuth.hasAnyRole,

		// OAuth providers
		getOAuthProviders: () => oauthProviders,
		oauthProviders,

		// Error handling
		clearError: enhancedAuth.clearError,
		showErrorToast: enhancedAuth.showErrorToast,
		showSuccessToast: enhancedAuth.showSuccessToast,

		// Computed helpers
		getDisplayName: () => {
			return enhancedAuth.profile?.name || enhancedAuth.user?.user_metadata?.name || enhancedAuth.user?.email || "Anonymous";
		},
		getAvatarUrl: () => {
			return enhancedAuth.profile?.avatar_url || enhancedAuth.user?.user_metadata?.avatar_url || null;
		},
		getSecurityLevel: () => {
			const metrics = enhancedAuth.securityMetrics;
			let score = 0;

			if (metrics.mfaEnabled) score += 40;
			if (metrics.deviceTrusted) score += 20;
			if (enhancedAuth.isEmailVerified) score += 20;
			if (metrics.loginAttempts === 0) score += 20;

			if (score >= 80) return "high";
			if (score >= 60) return "medium";
			return "standard";
		},
	};

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

/**
 * Enhanced useAuth hook with type safety and error handling
 */
export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider. " + "Wrap your app with <AuthProvider> to use authentication features.");
	}

	return context;
};

export default AuthContext;
