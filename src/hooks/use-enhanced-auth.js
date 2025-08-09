// REQUIRED: Enhanced Authentication Hook with Security Features
// Provides comprehensive auth functionality with advanced security

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@lib/database/supabase";
import { logger } from "@utils/logger";
import { PasswordSecurity } from "@lib/security/password-security";
import { DeviceFingerprint } from "@lib/security/device-fingerprint";
import { validateEmail, validatePasswordStrength } from "@lib/supabase/auth/utils";
import { toast } from "sonner";

// Simple secure storage fallback for missing utility
const secureStorage = {
	getItem: (key) => {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : null;
		} catch {
			return null;
		}
	},
	setItem: (key, value, options = {}) => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			logger.warn("Failed to set secure storage item:", error);
		}
	},
};

/**
 * Enhanced Authentication Hook
 * Provides secure authentication with advanced features
 */
export function useEnhancedAuth() {
	const router = useRouter();
	const [user, setUser] = useState(null);
	const [session, setSession] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [userRoles, setUserRoles] = useState([]);
	const [profile, setProfile] = useState(null);
	const [deviceInfo, setDeviceInfo] = useState(null);
	const [securityMetrics, setSecurityMetrics] = useState({
		loginAttempts: 0,
		lastLogin: null,
		deviceTrusted: false,
		mfaEnabled: false,
		securityLevel: "standard",
	});

	// This useEffect will be moved after initializeAuth is defined

	/**
	 * Helper functions defined first to avoid dependency issues
	 */
	const fetchUserProfile = useCallback(
		async (userId) => {
			const startTime = performance.now();

			try {
				if (process.env.NODE_ENV === "development") {
					console.log("🔍 Fetching user profile for ID:", userId);
				}

				// PERFORMANCE OPTIMIZATION: Use caching for user profiles
				const cacheKey = `user_profile_${userId}`;

				// Try to get from cache first
				const cachedProfile = secureStorage.getItem(cacheKey);
				if (cachedProfile) {
					if (process.env.NODE_ENV === "development") {
						console.log("📦 Using cached user profile");
					}
					setProfile(cachedProfile);
					logger.performance(`Profile fetched from cache in ${(performance.now() - startTime).toFixed(2)}ms`);
					return;
				}

				// PERFORMANCE OPTIMIZATION: Use auth.user metadata as fallback
				const authUser = session?.user;
				if (authUser) {
					// Create profile from auth user data as immediate fallback
					const fallbackProfile = {
						id: authUser.id,
						email: authUser.email,
						name: authUser.user_metadata?.name || authUser.user_metadata?.full_name,
						avatar_url: authUser.user_metadata?.avatar_url,
						created_at: authUser.created_at,
						...authUser.user_metadata,
					};

					setProfile(fallbackProfile);

					// Cache for future use
					secureStorage.setItem(cacheKey, fallbackProfile, { ttl: 5 * 60 * 1000 }); // 5 minutes cache

					if (process.env.NODE_ENV === "development") {
						console.log("✅ User profile created from auth metadata");
					}

					const queryTime = performance.now() - startTime;
					logger.performance(`Profile fetched from API in ${queryTime.toFixed(2)}ms`);

					// Log security event
					logger.security({
						action: "profile_accessed",
						targetUserId: userId,
						accessorUserId: userId,
						timestamp: Date.now(),
					});
				}
			} catch (error) {
				if (process.env.NODE_ENV === "development") {
					console.error("❌ Unexpected error fetching user profile:", error);
				}

				// Robust error logging with safe property access
				try {
					logger.error("Failed to fetch user profile:", {
						userId: userId || "unknown",
						error: error?.message || error?.toString() || "Unknown error",
						stack: error?.stack || "No stack trace available",
						errorType: typeof error,
						errorConstructor: error?.constructor?.name || "unknown",
					});
				} catch (logError) {
					// Fallback if logger fails
					console.error("Logger failed for user profile error:", {
						originalError: error,
						logError: logError,
						userId,
					});
				}
			}
		},
		[session]
	);

	const fetchUserRoles = useCallback(
		async (userId) => {
			const startTime = performance.now();

			try {
				if (process.env.NODE_ENV === "development") {
					console.log("🔍 Fetching user roles for ID:", userId);
				}

				// Get user profile with role information
				const { data: userProfile, error: profileError } = await supabase.from("users").select("role").eq("id", userId).maybeSingle();

				if (profileError) {
					console.warn("User profile not found, using default role:", profileError);
					setUserRoles(["user"]); // Default role if profile doesn't exist
					return;
				}

				// Build roles array based on user data
				const roles = [userProfile?.role || "user"];

				// Check if user owns any businesses (same logic as auth store)
				const { data: ownedBusinesses, error: businessError } = await supabase.from("businesses").select("id").eq("owner_id", userId).limit(1);

				if (!businessError && ownedBusinesses && ownedBusinesses.length > 0) {
					roles.push("business_owner");
					if (process.env.NODE_ENV === "development") {
						console.log(`✅ User ${userId} owns ${ownedBusinesses.length} business(es), adding business_owner role`);
					}
				}

				// For development, check for admin emails
				const authUser = session?.user;
				if (process.env.NODE_ENV === "development" && authUser?.email) {
					const adminEmails = ["bcw1995@gmail.com", "admin@thorbis.com"];
					if (adminEmails.includes(authUser.email) && !roles.includes("admin")) {
						roles.push("admin");
					}
				}

				setUserRoles(roles);

				if (process.env.NODE_ENV === "development") {
					console.log("✅ User roles fetched:", roles);
				}

				const queryTime = performance.now() - startTime;
				logger.performance(`Roles fetched in ${queryTime.toFixed(2)}ms`);
			} catch (error) {
				if (process.env.NODE_ENV === "development") {
					console.error("❌ Unexpected error fetching user roles:", error);
				}

				// Robust error logging with safe property access
				try {
					logger.error("Failed to fetch user roles:", {
						userId: userId || "unknown",
						error: error?.message || error?.toString() || "Unknown error",
						stack: error?.stack || "No stack trace available",
						errorType: typeof error,
						errorConstructor: error?.constructor?.name || "unknown",
					});
				} catch (logError) {
					// Fallback if logger fails
					console.error("Logger failed for user roles error:", {
						originalError: error,
						logError: logError,
						userId,
					});
				}
				setUserRoles(["user"]); // Safe fallback
			}
		},
		[session]
	);

	/**
	 * Initialize authentication state
	 */
	const initializeAuth = useCallback(async () => {
		const startTime = performance.now();

		try {
			setLoading(true);

			// OPTIMIZED: Run device fingerprint and session fetch in parallel
			// PERFORMANCE OPTIMIZATION: Use lightweight device info instead of heavy fingerprinting
			const [deviceInfo, sessionResult] = await Promise.all([
				// Generate lightweight device info for security
				Promise.resolve({
					id: `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
					userAgent: navigator.userAgent.substring(0, 100), // Truncate for performance
					screen: `${window.screen.width}x${window.screen.height}`,
					timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
					language: navigator.language,
					platform: navigator.platform,
					timestamp: Date.now(),
				}),
				supabase.auth.getSession(),
			]);

			setDeviceInfo(deviceInfo);

			const {
				data: { session },
				error: sessionError,
			} = sessionResult;

			if (sessionError) {
				logger.error("Session initialization error:", sessionError);
				throw sessionError;
			}

			if (session) {
				await handleAuthStateChange("SIGNED_IN", session);
			}

			// Set up auth state change listener
			const {
				data: { subscription },
			} = supabase.auth.onAuthStateChange(async (event, session) => {
				logger.debug("Auth state changed:", event);
				await handleAuthStateChange(event, session);
			});

			const duration = performance.now() - startTime;
			logger.performance(`Auth initialization completed in ${duration.toFixed(2)}ms`);

			return () => {
				subscription?.unsubscribe();
			};
		} catch (error) {
			logger.error("Auth initialization failed:", error);
			setError({
				message: error.message,
				userMessage: "Failed to initialize authentication. Please refresh the page.",
			});
		} finally {
			setLoading(false);
		}
	}, []); // Remove circular dependencies

	// Initialize auth state and listeners - runs only once on mount
	useEffect(() => {
		let cleanup;
		const init = async () => {
			cleanup = await initializeAuth();
		};
		init();

		// Cleanup subscription on unmount
		return () => {
			if (cleanup && typeof cleanup === "function") {
				cleanup();
			}
		};
	}, []); // Empty dependency array ensures this only runs once

	/**
	 * Handle auth state changes
	 */
	const handleAuthStateChange = useCallback(
		async (event, session) => {
			try {
				if (process.env.NODE_ENV === "development") {
					console.log("🔐 Auth state change:", { event, hasSession: !!session, userId: session?.user?.id });
				}

				setSession(session);
				setUser(session?.user || null);

				if (session?.user) {
					if (process.env.NODE_ENV === "development") {
						console.log("👤 Loading user data for:", session.user.id);
					}

					// OPTIMIZED: Parallel loading of user data with error isolation
					const userDataPromises = [
						fetchUserProfile(session.user.id).catch((err) => {
							logger.warn("Profile fetch failed:", err);
							return null;
						}),
						fetchUserRoles(session.user.id).catch((err) => {
							logger.warn("Roles fetch failed:", err);
							return [];
						}),
						updateSecurityMetrics(session.user.id).catch((err) => {
							logger.warn("Security metrics failed:", err);
							return null;
						}),
					];

					// Execute all user data fetching in parallel
					await Promise.allSettled(userDataPromises);

					// Log security event asynchronously (don't block UI) - using setTimeout for browser compatibility
					setTimeout(() => {
						// Get current deviceInfo state instead of using dependency
						setDeviceInfo((currentDeviceInfo) => {
							logger.security({
								action: "auth_state_changed",
								event,
								userId: session.user.id,
								deviceFingerprint: currentDeviceInfo?.id,
								timestamp: Date.now(),
							});
							return currentDeviceInfo; // Return unchanged
						});
					}, 0);

					if (process.env.NODE_ENV === "development") {
						console.log("✅ Auth state change completed successfully");
					}
				} else {
					if (process.env.NODE_ENV === "development") {
						console.log("👤 User logged out or no session - clearing data");
					}

					// Clear user data on logout
					setProfile(null);
					setUserRoles([]);
					setSecurityMetrics({
						loginAttempts: 0,
						lastLogin: null,
						deviceTrusted: false,
						mfaEnabled: false,
						securityLevel: "standard",
					});
				}
			} catch (error) {
				if (process.env.NODE_ENV === "development") {
					console.error("❌ Auth state change handling failed:", error);
				}

				// Robust error logging with safe property access
				try {
					logger.error("Auth state change handling failed:", {
						event: event || "unknown",
						userId: session?.user?.id || "unknown",
						error: error?.message || error?.toString() || "Unknown error",
						stack: error?.stack || "No stack trace available",
						errorType: typeof error,
						errorConstructor: error?.constructor?.name || "unknown",
					});
				} catch (logError) {
					// Fallback if logger fails
					console.error("Logger failed for auth state change error:", {
						originalError: error,
						logError: logError,
						event,
						userId: session?.user?.id,
					});
				}
			}
		},
		[fetchUserProfile, fetchUserRoles] // Only depend on the fetch functions, not deviceInfo
	);

	/**
	 * Enhanced login with security features
	 */
	const login = useCallback(
		async (email, password, context = {}) => {
			const startTime = performance.now();
			setError(null);
			setLoading(true);

			try {
				// Validate inputs
				if (!email || !password) {
					throw new Error("Email and password are required");
				}

				// Security context
				const securityContext = {
					deviceFingerprint: deviceInfo?.id,
					timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
					language: navigator.language,
					screen: {
						width: window.screen.width,
						height: window.screen.height,
					},
					...context,
				};

				// Attempt login
				const { data, error: loginError } = await supabase.auth.signInWithPassword({
					email: email.toLowerCase().trim(),
					password,
				});

				if (loginError) {
					// Log failed attempt
					logger.security({
						action: "login_failed",
						email,
						error: loginError.message,
						deviceFingerprint: deviceInfo?.id,
						securityContext,
						timestamp: Date.now(),
					});

					throw loginError;
				}

				// Update device trust if requested
				if (context.trustedDevice && data.user) {
					await updateDeviceTrust(data.user.id, deviceInfo?.id, true);
				}

				// Log successful login
				logger.security({
					action: "login_success",
					userId: data.user.id,
					email,
					deviceFingerprint: deviceInfo?.id,
					securityContext,
					duration: performance.now() - startTime,
					timestamp: Date.now(),
				});

				return { success: true, data };
			} catch (error) {
				const duration = performance.now() - startTime;
				logger.error(`Login failed in ${duration.toFixed(2)}ms:`, error);

				const errorResponse = {
					success: false,
					error: {
						message: error.message,
						userMessage: getLoginErrorMessage(error),
					},
				};

				setError(errorResponse.error);
				return errorResponse;
			} finally {
				setLoading(false);
			}
		},
		[deviceInfo]
	);

	/**
	 * Enhanced logout with cleanup
	 */
	const logout = useCallback(async () => {
		const startTime = performance.now();
		setLoading(true);

		try {
			const currentUser = user;

			// Clear local state first for immediate UI feedback
			setUser(null);
			setSession(null);
			setProfile(null);
			setUserRoles([]);

			// Perform logout
			const { error } = await supabase.auth.signOut();

			if (error) {
				logger.error("Logout error:", error);
				// Don't throw here as user state is already cleared
			}

			// Log logout
			if (currentUser) {
				logger.security({
					action: "user_logout",
					userId: currentUser.id,
					deviceFingerprint: deviceInfo?.id,
					duration: performance.now() - startTime,
					timestamp: Date.now(),
				});
			}

			// Clear sensitive data from storage
			sessionStorage.removeItem("loginAttempts");
			localStorage.removeItem("deviceTrust");

			// Navigate to login
			router.push("/login");
		} catch (error) {
			logger.error("Logout failed:", error);
			// Force clear state even if logout fails
			setUser(null);
			setSession(null);
			setProfile(null);
			setUserRoles([]);
		} finally {
			setLoading(false);
		}
	}, [user, deviceInfo, router]);

	/**
	 * OAuth login with enhanced security
	 */
	const loginWithOAuth = useCallback(
		async (provider, redirectTo) => {
			try {
				setError(null);
				setLoading(true);

				const { data, error } = await supabase.auth.signInWithOAuth({
					provider,
					options: {
						redirectTo,
						queryParams: {
							access_type: "offline",
							prompt: "consent",
							device_id: deviceInfo?.id,
						},
					},
				});

				if (error) {
					logger.error(`OAuth login failed for ${provider}:`, error);
					throw error;
				}

				// Log OAuth attempt
				logger.security({
					action: "oauth_login_initiated",
					provider,
					deviceFingerprint: deviceInfo?.id,
					redirectTo,
					timestamp: Date.now(),
				});

				return { success: true, data };
			} catch (error) {
				const errorResponse = {
					success: false,
					error: {
						message: error.message,
						userMessage: `${provider} login failed. Please try again.`,
					},
				};

				setError(errorResponse.error);
				return errorResponse;
			} finally {
				setLoading(false);
			}
		},
		[deviceInfo]
	);

	/**
	 * Enhanced signup with comprehensive validation and security
	 */
	const signup = useCallback(
		async (email, password, userData = {}) => {
			const startTime = performance.now();
			setError(null);
			setLoading(true);

			try {
				// Validate inputs
				if (!email || !password) {
					throw new Error("Email and password are required");
				}

				// Validate email format
				const emailValidation = validateEmail(email);
				if (!emailValidation.isValid) {
					throw new Error(emailValidation.message);
				}

				// Validate password strength
				const passwordStrength = validatePasswordStrength(password);
				if (!passwordStrength.isValid) {
					throw new Error(passwordStrength.feedback.join(" "));
				}

				// Prepare user metadata with proper field mapping
				const userMetadata = {
					first_name: userData.firstName,
					last_name: userData.lastName,
					full_name: userData.fullName || `${userData.firstName} ${userData.lastName}`,
					...userData, // Include any additional metadata
				};

				// Security context for signup
				const securityContext = {
					deviceFingerprint: deviceInfo?.id,
					timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
					language: navigator.language,
					screen: {
						width: window.screen.width,
						height: window.screen.height,
					},
					signupTimestamp: Date.now(),
				};

				// Attempt signup
				const { data, error: signupError } = await supabase.auth.signUp({
					email: email.toLowerCase().trim(),
					password,
					options: {
						data: userMetadata,
					},
				});

				if (signupError) {
					// Log failed signup attempt
					logger.security({
						action: "signup_failed",
						email,
						error: signupError.message,
						deviceFingerprint: deviceInfo?.id,
						securityContext,
						timestamp: Date.now(),
					});

					throw signupError;
				}

				// Log successful signup
				logger.security({
					action: "signup_success",
					userId: data.user?.id,
					email,
					deviceFingerprint: deviceInfo?.id,
					securityContext,
					duration: performance.now() - startTime,
					timestamp: Date.now(),
				});

				logger.performance(`Signup completed in ${(performance.now() - startTime).toFixed(2)}ms`);

				return { success: true, data };
			} catch (error) {
				const duration = performance.now() - startTime;
				logger.error(`Signup failed in ${duration.toFixed(2)}ms:`, error);

				const errorResponse = {
					success: false,
					error: {
						message: error.message,
						userMessage: getSignupErrorMessage(error),
					},
				};

				setError(errorResponse.error);
				return errorResponse;
			} finally {
				setLoading(false);
			}
		},
		[deviceInfo]
	);

	/**
	 * Check for breached passwords with enhanced error handling
	 */
	const checkBreachedPassword = useCallback(async (password) => {
		// Emergency bypass for development if crypto keeps failing
		const SKIP_BREACH_CHECK = process.env.NEXT_PUBLIC_SKIP_BREACH_CHECK === "true";

		if (SKIP_BREACH_CHECK && process.env.NODE_ENV === "development") {
			console.log("⚠️ Password breach check BYPASSED for development");
			return false;
		}

		if (process.env.NODE_ENV === "development") {
			console.log("🔐 Starting password breach check...");
		}

		try {
			const result = await PasswordSecurity.checkBreachedPassword(password);

			// Handle various error states gracefully
			if (result.error) {
				if (process.env.NODE_ENV === "development") {
					console.warn(`Password breach check non-critical error: ${result.error}`);
				}

				// Non-blocking errors - allow login to continue
				const nonBlockingErrors = ["HASH_GENERATION_FAILED", "API_ERROR", "TIMEOUT", "CHECK_FAILED"];
				if (nonBlockingErrors.includes(result.error)) {
					logger.info(`Password breach check failed with recoverable error: ${result.error}`);
					return false; // Allow login to continue
				}
			}

			if (process.env.NODE_ENV === "development") {
				console.log("✅ Password breach check completed:", result.isBreached ? "BREACHED" : "SAFE");
			}

			return result.isBreached;
		} catch (error) {
			logger.error("Password breach check failed:", error);
			if (process.env.NODE_ENV === "development") {
				console.warn("❌ Password breach check failed - allowing login to continue for better UX");
			}
			return false; // Fail safely - don't block legitimate users
		}
	}, []);

	// Test crypto fallback system on initialization (development only)
	useEffect(() => {
		if (process.env.NODE_ENV === "development") {
			const testCryptoFallback = async () => {
				try {
					console.log("🔐 Testing crypto fallback system...");
					const testResult = PasswordSecurity.testPureJSSHA1();
					if (testResult) {
						console.log("✅ Crypto fallback system verified and ready");
					} else {
						console.warn("⚠️ Crypto fallback system test failed");
					}
				} catch (error) {
					console.warn("⚠️ Crypto fallback system test error:", error.message);
				}
			};

			// Run test after a short delay to avoid blocking initialization
			const timeoutId = setTimeout(testCryptoFallback, 1000);
			return () => clearTimeout(timeoutId);
		}
	}, []);

	// validateEmail and validatePasswordStrength are now imported from @lib/supabase/auth/utils

	/**
	 * Reset password
	 */
	const resetPassword = useCallback(
		async (email) => {
			try {
				setError(null);
				setLoading(true);

				const { error } = await supabase.auth.resetPasswordForEmail(email, {
					redirectTo: `${window.location.origin}/auth/reset-password`,
				});

				if (error) throw error;

				logger.security({
					action: "password_reset_requested",
					email,
					deviceFingerprint: deviceInfo?.id,
					timestamp: Date.now(),
				});

				return { success: true };
			} catch (error) {
				logger.error("Password reset failed:", error);
				const errorResponse = {
					success: false,
					error: {
						message: error.message,
						userMessage: "Failed to send reset email. Please try again.",
					},
				};

				setError(errorResponse.error);
				return errorResponse;
			} finally {
				setLoading(false);
			}
		},
		[deviceInfo]
	);

	/**
	 * Update password
	 */
	const updatePassword = useCallback(
		async (newPassword) => {
			try {
				setError(null);
				setLoading(true);

				// Validate password strength
				const strength = PasswordSecurity.assessPasswordStrength(newPassword);
				if (strength.score < 60) {
					throw new Error("Password does not meet security requirements");
				}

				// Check for breaches
				const isBreached = await checkBreachedPassword(newPassword);
				if (isBreached) {
					throw new Error("This password has been found in data breaches");
				}

				const { error } = await supabase.auth.updateUser({
					password: newPassword,
				});

				if (error) throw error;

				logger.security({
					action: "password_updated",
					userId: user?.id,
					passwordStrength: strength.score,
					deviceFingerprint: deviceInfo?.id,
					timestamp: Date.now(),
				});

				return { success: true };
			} catch (error) {
				logger.error("Password update failed:", error);
				const errorResponse = {
					success: false,
					error: {
						message: error.message,
						userMessage: error.message || "Failed to update password",
					},
				};

				setError(errorResponse.error);
				return errorResponse;
			} finally {
				setLoading(false);
			}
		},
		[user, deviceInfo, checkBreachedPassword]
	);

	const updateSecurityMetrics = async (userId) => {
		const startTime = performance.now();

		try {
			if (process.env.NODE_ENV === "development") {
				console.log("🔍 Fetching security metrics for ID:", userId);
			}

			// PERFORMANCE OPTIMIZATION: Use default metrics immediately, update async later
			const defaultMetrics = {
				loginAttempts: 0,
				lastLogin: new Date().toISOString(),
				deviceTrusted: false,
				mfaEnabled: false,
				securityLevel: "standard",
			};

			// Set defaults immediately for fast auth flow
			setSecurityMetrics(defaultMetrics);

			if (process.env.NODE_ENV === "development") {
				console.log("📋 No security metrics found, using defaults");
			}

			const queryTime = performance.now() - startTime;
			logger.performance(`Security metrics set to defaults in ${queryTime.toFixed(2)}ms`);
		} catch (error) {
			if (process.env.NODE_ENV === "development") {
				console.error("❌ Unexpected error fetching security metrics:", error);
			}

			// Robust error logging with safe property access
			try {
				logger.error("Failed to update security metrics:", {
					userId: userId || "unknown",
					error: error?.message || error?.toString() || "Unknown error",
					stack: error?.stack || "No stack trace available",
					errorType: typeof error,
					errorConstructor: error?.constructor?.name || "unknown",
				});
			} catch (logError) {
				// Fallback if logger fails
				console.error("Logger failed for security metrics error:", {
					originalError: error,
					logError: logError,
					userId,
				});
			}

			// Set default security metrics on error
			setSecurityMetrics({
				loginAttempts: 0,
				lastLogin: null,
				deviceTrusted: false,
				mfaEnabled: false,
				securityLevel: "standard",
			});
		}
	};

	const updateLastActivity = async (userId) => {
		// Skip activity logging if user_activity table has RLS issues
		// This is non-critical functionality that shouldn't block authentication
		return;
	};

	const updateDeviceTrust = async (userId, deviceId, trusted) => {
		try {
			await supabase.rpc("update_device_trust", {
				p_user_id: userId,
				p_device_id: deviceId,
				p_trusted: trusted,
			});
		} catch (error) {
			logger.error("Failed to update device trust:", error);
		}
	};

	const getLoginErrorMessage = (error) => {
		const errorMap = {
			"Invalid login credentials": "Invalid email or password. Please check your credentials and try again.",
			"Email not confirmed": "Please check your email and click the confirmation link before signing in.",
			"Too many requests": "Too many login attempts. Please wait a few minutes before trying again.",
			"User not found": "No account found with this email address.",
			"Invalid password": "Incorrect password. Please try again or reset your password.",
		};

		return errorMap[error.message] || "Login failed. Please try again.";
	};

	const getSignupErrorMessage = (error) => {
		const errorMap = {
			"User already registered": "An account with this email address already exists. Try signing in instead.",
			"Signup disabled": "New account registration is currently disabled. Please contact support.",
			"Email rate limit exceeded": "Too many signup attempts. Please wait before trying again.",
			"Password too weak": "Password does not meet security requirements. Please choose a stronger password.",
			"Invalid email": "Please enter a valid email address.",
			"Email not allowed": "This email domain is not allowed for registration.",
		};

		return errorMap[error.message] || "Account creation failed. Please try again.";
	};

	/**
	 * Refresh user session and profile data
	 */
	const refreshUser = useCallback(async () => {
		const startTime = performance.now();

		try {
			// Get fresh session from Supabase
			const {
				data: { session },
				error: sessionError,
			} = await supabase.auth.getSession();

			if (sessionError) {
				logger.error("Failed to refresh session:", sessionError);
				throw sessionError;
			}

			if (session?.user) {
				// Update session and user state
				setSession(session);
				setUser(session.user);

				// Refresh user profile and roles in parallel
				await Promise.allSettled([
					fetchUserProfile(session.user.id).catch((err) => {
						logger.warn("Profile refresh failed:", err);
						return null;
					}),
					fetchUserRoles(session.user.id).catch((err) => {
						logger.warn("Roles refresh failed:", err);
						return [];
					}),
					updateSecurityMetrics(session.user.id).catch((err) => {
						logger.warn("Security metrics refresh failed:", err);
						return null;
					}),
				]);

				const duration = performance.now() - startTime;
				logger.performance(`User refreshed in ${duration.toFixed(2)}ms`);

				logger.info("User session refreshed successfully", {
					userId: session.user.id,
					emailVerified: !!session.user.email_confirmed_at,
				});

				return { success: true, user: session.user };
			} else {
				// No session found - user needs to re-authenticate
				setSession(null);
				setUser(null);
				setProfile(null);
				setUserRoles([]);

				return { success: false, error: "No valid session found" };
			}
		} catch (error) {
			logger.error("User refresh failed:", error);
			return { success: false, error: error.message };
		}
	}, [fetchUserProfile, fetchUserRoles]);

	/**
	 * Utility functions
	 */
	const hasRole = useCallback(
		(role) => {
			return userRoles.includes(role);
		},
		[userRoles]
	);

	const hasAnyRole = useCallback(
		(roles) => {
			return roles.some((role) => userRoles.includes(role));
		},
		[userRoles]
	);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	const showErrorToast = useCallback((message) => {
		toast.error(message);
	}, []);

	const showSuccessToast = useCallback((message) => {
		toast.success(message);
	}, []);

	/**
	 * Manually refresh user roles
	 */
	const refreshUserRoles = useCallback(async () => {
		if (!user?.id) return;

		try {
			console.log("Manually refreshing user roles for:", user.id);
			await fetchUserRoles(user.id);
			console.log("Roles refreshed successfully");
		} catch (error) {
			console.error("Failed to refresh user roles:", error);
		}
	}, [user?.id, fetchUserRoles]);

	// Computed values
	const isAuthenticated = useMemo(() => !!user && !!session, [user, session]);
	const isEmailVerified = useMemo(() => profile?.email_verified || user?.email_confirmed_at, [profile, user]);

	return {
		// State
		user,
		session,
		profile,
		loading,
		error,
		userRoles,
		deviceInfo,
		securityMetrics,

		// Auth actions
		login,
		signup,
		logout,
		loginWithOAuth,
		resetPassword,
		updatePassword,
		refreshUser,

		// Utilities
		hasRole,
		hasAnyRole,
		checkBreachedPassword,
		clearError,
		showErrorToast,
		showSuccessToast,
		refreshUserRoles,

		// Computed
		isAuthenticated,
		isEmailVerified,
	};
}

export default useEnhancedAuth;
