"use client";

import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@context/auth-context";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { toast } from "sonner";
import { getEnabledProviders } from "@lib/supabase/auth/providers";
import { Eye, EyeOff, Loader2, AlertCircle, Shield, CheckCircle2, Mail, Lock, ArrowRight } from "lucide-react";
import { cn } from "@utils";
import { logger } from "@utils/logger";
import { DeviceFingerprint } from "@lib/security/device-fingerprint";
import RateLimitWarning from "@components/features/auth/shared/rate-limit-warning";
import IntelligentLoginMessage from "@components/features/auth/shared/intelligent-login-message";
import { LoginContextDetector, ContextMessageGenerator } from "@lib/auth/login-context";
import ZodErrorBoundary from "@components/shared/zod-error-boundary";

// Lenient validation schema for real-time typing (allows empty values)
const typingSchema = z.object({
	email: z.string().optional(),
	password: z.string().optional(),
	rememberMe: z.boolean().optional(),
	trustedDevice: z.boolean().optional(),
});

// Strict validation schema for form submission
const submitSchema = z.object({
	email: z
		.string()
		.min(1, { message: "Email is required" })
		.email({ message: "Please enter a valid email address" })
		.toLowerCase()
		.refine(
			(email) => {
				// Basic email security validation
				const domain = email.split("@")[1];
				return domain && !domain.includes("..");
			},
			{ message: "Email format appears suspicious" }
		),
	password: z
		.string()
		.min(1, { message: "Password is required" })
		.min(8, { message: "Password must be at least 8 characters" })
		.max(128, { message: "Password is too long" })
		.refine(
			(password) => {
				// Check for common patterns that indicate weak passwords
				const commonPatterns = ["123456", "password", "qwerty", "abc123"];
				return !commonPatterns.some((pattern) => password.toLowerCase().includes(pattern));
			},
			{ message: "Password contains common patterns - please choose a stronger password" }
		),
	rememberMe: z.boolean().optional(),
	trustedDevice: z.boolean().optional(),
});

// Use the lenient schema for real-time validation
const loginSchema = typingSchema;

// Custom hook for real-time email validation
const useEmailValidation = (email) => {
	const [emailState, setEmailState] = useState({
		isValid: false,
		isChecking: false,
		suggestions: [],
		error: null,
	});

	const debounceTimer = useRef(null);

	useEffect(() => {
		if (!email || email.length < 3) {
			setEmailState({ isValid: false, isChecking: false, suggestions: [], error: null });
			return;
		}

		// Clear previous timer
		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current);
		}

		// Debounced validation
		debounceTimer.current = setTimeout(() => {
			setEmailState((prev) => ({ ...prev, isChecking: true }));

			// Basic email validation
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			const isBasicValid = emailRegex.test(email);

			// Common domain suggestions
			const commonDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
			const [localPart, domain] = email.split("@");
			const suggestions = [];

			if (domain && !commonDomains.includes(domain.toLowerCase())) {
				// Simple domain correction suggestions
				commonDomains.forEach((commonDomain) => {
					if (domain.length > 2 && commonDomain.includes(domain.toLowerCase().slice(0, 3))) {
						suggestions.push(`${localPart}@${commonDomain}`);
					}
				});
			}

			setEmailState({
				isValid: isBasicValid,
				isChecking: false,
				suggestions: suggestions.slice(0, 2), // Limit to 2 suggestions
				error: !isBasicValid && email.includes("@") ? "Please enter a valid email address" : null,
			});
		}, 300);

		return () => {
			if (debounceTimer.current) {
				clearTimeout(debounceTimer.current);
			}
		};
	}, [email]);

	return emailState;
};

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [oauthProviders, setOauthProviders] = useState([]);
	const [deviceFingerprint, setDeviceFingerprint] = useState(null);
	const [loginAttempts, setLoginAttempts] = useState(0);
	const [isRateLimited, setIsRateLimited] = useState(false);
	const [securityFeatures, setSecurityFeatures] = useState({
		captchaEnabled: false,
		mfaRequired: false,
		deviceVerification: false,
	});
	const [loginContext, setLoginContext] = useState(null);
	const [contextualRedirect, setContextualRedirect] = useState(null);
	const [focusedField, setFocusedField] = useState(null);
	const [fieldTouched, setFieldTouched] = useState({ email: false, password: false });

	const formMethods = useForm({
		resolver: (data) => {
			// Always return success during typing to prevent any Zod validation
			return { values: data, errors: {} };
		},
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
			trustedDevice: false,
		},
		mode: "onSubmit", // Only validate on form submission
		reValidateMode: "onSubmit", // Keep validation minimal
		shouldFocusError: false, // Prevent forced reflow on error focus
	});

	const {
		handleSubmit,
		watch,
		formState: { errors, isValid, touchedFields, isValidating },
	} = formMethods;

	const { user, isAuthenticated, userRoles, loading, login, loginWithOAuth, error: authError, clearError, validateEmail, checkBreachedPassword } = useAuth();

	// Watch form values for real-time validation
	const watchedValues = watch();
	const currentEmail = watch("email");
	const currentPassword = watch("password");

	// Custom validation hooks
	const emailValidation = useEmailValidation(currentEmail);

	// Password strength assessment
	const passwordStrength = useMemo(() => {
		if (!currentPassword || currentPassword.length === 0) return { score: 0, level: "none" };

		let score = 0;
		let feedback = [];

		// Length check
		if (currentPassword.length >= 8) score += 25;
		else feedback.push("At least 8 characters");

		// Complexity checks
		if (/[a-z]/.test(currentPassword)) score += 15;
		else feedback.push("Lowercase letter");

		if (/[A-Z]/.test(currentPassword)) score += 15;
		else feedback.push("Uppercase letter");

		if (/\d/.test(currentPassword)) score += 15;
		else feedback.push("Number");

		if (/[^a-zA-Z0-9]/.test(currentPassword)) score += 30;
		else feedback.push("Special character");

		let level = "weak";
		if (score >= 90) level = "excellent";
		else if (score >= 70) level = "strong";
		else if (score >= 50) level = "good";
		else if (score >= 30) level = "fair";

		return { score, level, feedback };
	}, [currentPassword]);

	// Auto-save form data to localStorage (excluding password for security)
	useEffect(() => {
		const savedEmail = localStorage.getItem("thorbis_login_email");
		if (savedEmail && !currentEmail) {
			formMethods.setValue("email", savedEmail);
		}
	}, [currentEmail, formMethods]);

	useEffect(() => {
		if (currentEmail && emailValidation.isValid) {
			localStorage.setItem("thorbis_login_email", currentEmail);
		}
	}, [currentEmail, emailValidation.isValid]);

	// Initialize security features and device fingerprinting
	useEffect(() => {
		const initializeSecurityFeatures = async () => {
			try {
				// Generate device fingerprint for security
				const fingerprint = await DeviceFingerprint.generate();
				setDeviceFingerprint(fingerprint);

				// Load OAuth providers
				const providers = getEnabledProviders();
				setOauthProviders(providers);

				// Check if user has previous failed attempts (stored in sessionStorage)
				const storedAttempts = sessionStorage.getItem("loginAttempts");
				if (storedAttempts) {
					const attempts = parseInt(storedAttempts, 10);
					setLoginAttempts(attempts);

					// Enable additional security after 3 failed attempts
					if (attempts >= 3) {
						setSecurityFeatures((prev) => ({
							...prev,
							captchaEnabled: true,
							deviceVerification: true,
						}));
					}
				}

				// Log security initialization
				logger.security({
					action: "login_page_initialized",
					deviceFingerprint: fingerprint.id,
					userAgent: navigator.userAgent,
					timestamp: Date.now(),
				});
			} catch (error) {
				logger.error("Failed to initialize security features:", error);
			}
		};

		initializeSecurityFeatures();
	}, []);

	// Handle URL parameters for redirects and errors
	useEffect(() => {
		const redirectTo = searchParams.get("redirectTo");
		const urlError = searchParams.get("error");
		const message = searchParams.get("message");

		if (message) {
			if (urlError) {
				toast.error(message);
			} else {
				toast.success(message);
			}
		}
	}, [searchParams]);

	// Handle context detection and smart redirects
	const handleContextDetected = useCallback(
		(detectedContext) => {
			setLoginContext(detectedContext);

			// Generate smart redirect URL
			const smartRedirect = LoginContextDetector.getPostLoginRedirect(detectedContext, searchParams);
			setContextualRedirect(smartRedirect);

			try {
				// Enhanced logger validation with debugging
				if (!logger) {
					console.warn("Logger is null or undefined in login component");
					return;
				}

				if (typeof logger !== "object") {
					console.warn("Logger is not an object in login component, type:", typeof logger);
					return;
				}

				if (typeof logger.interaction !== "function") {
					console.warn("Logger.interaction is not a function in login component, type:", typeof logger.interaction, "Available methods:", Object.keys(logger));
					// Fallback to analytics if available
					if (typeof logger.analytics === "function") {
						logger.analytics({
							type: "login_context_set",
							context: detectedContext.key,
							redirectUrl: smartRedirect,
							timestamp: Date.now(),
						});
					}
					return;
				}

				// Safe to call logger.interaction
				logger.interaction({
					type: "login_context_set",
					context: detectedContext.key,
					redirectUrl: smartRedirect,
					timestamp: Date.now(),
				});
			} catch (error) {
				// Robust error handling - always log the interaction somehow
				console.error("Logger error in LoginPage:", error);
				console.log("👆 INTERACTION (fallback):", {
					type: "login_context_set",
					context: detectedContext.key,
					redirectUrl: smartRedirect,
					timestamp: Date.now(),
					error: error.message,
				});
			}
		},
		[searchParams]
	);

	// Redirect authenticated users to their dashboard with contextual intelligence
	useEffect(() => {
		if (isAuthenticated && user && userRoles.length > 0) {
			// Priority: contextual redirect > URL redirect > role-based dashboard
			let targetPath = contextualRedirect;

			if (!targetPath) {
				const redirectTo = searchParams.get("redirectTo");
				if (redirectTo && redirectTo.startsWith("/")) {
					targetPath = redirectTo;
				} else {
					// Default role-based dashboard
					if (userRoles.includes("admin")) {
						targetPath = "/dashboard/admin";
					} else if (userRoles.includes("business_owner")) {
						targetPath = "/dashboard/business";
					} else {
						targetPath = "/dashboard/user";
					}
				}
			}

			router.push(targetPath);
		}
	}, [isAuthenticated, user, userRoles, router, searchParams, contextualRedirect]);

	// Enhanced submit with security features
	const onSubmit = useCallback(
		async (data) => {
			if (isSubmitting || loading || isRateLimited) return;

			// Clear any previous errors
			clearError();
			setIsSubmitting(true);

			const startTime = performance.now();

			try {
				// Validate with strict schema at submission time
				let validationResult;

				try {
					validationResult = submitSchema.safeParse(data);
				} catch (zodError) {
					// Handle any unexpected Zod errors gracefully
					console.warn("Zod validation error caught:", zodError);
					toast.error("Form validation failed. Please check your inputs.");
					setIsSubmitting(false);
					return;
				}

				if (!validationResult.success) {
					const errors = validationResult.error.errors || [];
					errors.forEach((error) => {
						if (error.message) {
							toast.error(error.message);
						}
					});
					setIsSubmitting(false);
					return;
				}

				// Security validations
				if (loginAttempts >= 5) {
					throw new Error("Too many failed attempts. Please wait before trying again.");
				}

				// Check for breached passwords on client side
				if (checkBreachedPassword) {
					const isBreached = await checkBreachedPassword(data.password);
					if (isBreached) {
						toast.error("This password has been found in data breaches. Please use a different password.");
						setIsSubmitting(false);
						return;
					}
				}

				// Enhanced login with security context
				const loginContext = {
					deviceFingerprint: deviceFingerprint?.id,
					rememberMe: data.rememberMe,
					trustedDevice: data.trustedDevice,
					timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
					screen: {
						width: window.screen.width,
						height: window.screen.height,
					},
					language: navigator.language,
				};

				// Include detected context in login request
				const enhancedLoginContext = {
					...loginContext,
					detectedContext: window.loginContext || null,
					intendedAction: window.loginContext?.actionText,
				};

				const result = await login(data.email, data.password, enhancedLoginContext);

				if (result.success) {
					// Clear failed attempts on success
					sessionStorage.removeItem("loginAttempts");
					setLoginAttempts(0);

					// Contextual success message
					const successMessage = window.loginContext && window.loginContext.key !== "default" ? `Welcome back! Taking you to ${window.loginContext.actionText.toLowerCase()}...` : "Login successful! Redirecting...";

					toast.success(successMessage);

					// Log contextual login success
					logger.security({
						action: "contextual_login_success",
						email: data.email,
						deviceFingerprint: deviceFingerprint?.id,
						duration: performance.now() - startTime,
						context: window.loginContext?.key,
						intendedAction: window.loginContext?.actionText,
						timestamp: Date.now(),
					});
				} else {
					// Handle failed login
					const newAttempts = loginAttempts + 1;
					setLoginAttempts(newAttempts);
					sessionStorage.setItem("loginAttempts", newAttempts.toString());

					// Enable additional security measures
					if (newAttempts >= 3) {
						setSecurityFeatures((prev) => ({
							...prev,
							captchaEnabled: true,
							deviceVerification: true,
						}));
					}

					if (newAttempts >= 5) {
						setIsRateLimited(true);
						// Auto-unlock after 15 minutes
						setTimeout(
							() => {
								setIsRateLimited(false);
								sessionStorage.removeItem("loginAttempts");
								setLoginAttempts(0);
							},
							15 * 60 * 1000
						);
					}

					// Show appropriate error message
					if (result.error?.userMessage) {
						toast.error(result.error.userMessage);
					} else {
						toast.error("Login failed. Please check your credentials.");
					}

					// Log failed attempt
					logger.security({
						action: "login_failed",
						email: data.email,
						deviceFingerprint: deviceFingerprint?.id,
						attemptNumber: newAttempts,
						error: result.error?.message,
						timestamp: Date.now(),
					});
				}
			} catch (error) {
				logger.error("Login failed:", error);
				toast.error(error.message || "Login failed. Please try again.");

				// Increment failed attempts even for exceptions
				const newAttempts = loginAttempts + 1;
				setLoginAttempts(newAttempts);
				sessionStorage.setItem("loginAttempts", newAttempts.toString());
			} finally {
				setIsSubmitting(false);
			}
		},
		[isSubmitting, loading, isRateLimited, loginAttempts, deviceFingerprint, login, clearError, checkBreachedPassword]
	);

	const handleOAuthLogin = async (providerName) => {
		if (isSubmitting || loading) return;

		try {
			const redirectTo = searchParams.get("redirectTo");
			const targetUrl = redirectTo && redirectTo.startsWith("/") ? `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}` : `${window.location.origin}/auth/callback`;

			const result = await loginWithOAuth(providerName, targetUrl);

			if (!result.success && result.error?.userMessage) {
				toast.error(result.error.userMessage);
			}
			// OAuth success will redirect automatically
		} catch (error) {
			console.error(`${providerName} login error:`, error);
			toast.error(`${providerName} login failed. Please try again.`);
		}
	};

	// Smart security level calculation
	const securityLevel = useMemo(() => {
		let level = "standard";
		if (securityFeatures.mfaRequired) level = "high";
		if (securityFeatures.captchaEnabled) level = "enhanced";
		return level;
	}, [securityFeatures]);

	// Smart form state for better UX
	const isFormReady = useMemo(() => {
		return !loading && !isSubmitting && !isRateLimited;
	}, [loading, isSubmitting, isRateLimited]);

	return (
		<ZodErrorBoundary>
			{/* Intelligent Context Message */}
			<IntelligentLoginMessage onContextDetected={handleContextDetected} isSignupMode={false} />

			{/* Dynamic Header Based on Context - Simplified for new layout */}
			{loginContext && loginContext.key !== "default" && (
				<div className="mb-6 text-center">
					<h2 className="text-xl font-semibold text-foreground mb-1">{loginContext.title}</h2>
					<p className="text-sm text-muted-foreground">{loginContext.subtitle}</p>
				</div>
			)}

			{/* Important messages - only show when needed */}
			{isRateLimited && (
				<div className="mt-4">
					<RateLimitWarning
						attempts={loginAttempts}
						onReset={() => {
							setIsRateLimited(false);
							setLoginAttempts(0);
							sessionStorage.removeItem("loginAttempts");
						}}
					/>
				</div>
			)}

			{/* Display auth errors */}
			{authError && (
				<div className="mt-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
					<div className="flex">
						<AlertCircle className="h-5 w-5 text-red-400" />
						<div className="ml-3">
							<p className="text-sm text-red-800 dark:text-red-200">{authError.userMessage}</p>
						</div>
					</div>
				</div>
			)}

			{/* Subtle security notice - only when enhanced */}
			{(securityFeatures.captchaEnabled || securityFeatures.deviceVerification) && (
				<div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
					<div className="flex items-center text-sm">
						<Shield className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
						<span className="text-blue-800 dark:text-blue-200">Extra security is active to protect your account</span>
					</div>
				</div>
			)}

			<div className="w-full">
				<FormProvider {...formMethods}>
					<Form {...formMethods}>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="space-y-5"
							suppressHydrationWarning={true}
							onKeyDown={(e) => {
								// Enhanced keyboard navigation
								if (e.key === "Enter" && !isSubmitting) {
									e.preventDefault();
									handleSubmit(onSubmit)();
								}
								// Escape to clear focused field
								if (e.key === "Escape") {
									setFocusedField(null);
									e.target.blur();
								}
							}}
							role="form"
							aria-label="Sign in to your account"
						>
							{/* Email Field */}
							<FormField
								control={formMethods.control}
								name="email"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
											<Mail className="w-4 h-4 text-muted-foreground" />
											Email Address
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													{...field}
													id="email"
													type="email"
													placeholder="Enter your email address"
													className={cn(
														"h-12 pl-12 pr-4 text-base transition-all duration-200",
														// Error state
														emailValidation.error && fieldTouched.email
															? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20"
															: // Success state
																emailValidation.isValid && fieldTouched.email
																? "border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-500/20 bg-green-50/50 dark:bg-green-950/20"
																: // Default state
																	"border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
													)}
													required
													autoComplete="email"
													autoFocus
													spellCheck={false}
													aria-describedby={emailValidation.error ? "email-error" : emailValidation.suggestions.length > 0 ? "email-suggestions" : undefined}
													onFocus={() => {
														setFocusedField("email");
														setFieldTouched((prev) => ({ ...prev, email: true }));
													}}
													onBlur={() => setFocusedField(null)}
													suppressHydrationWarning={true}
												/>
												<Mail className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", emailValidation.error && fieldTouched.email ? "text-red-500" : emailValidation.isValid && fieldTouched.email ? "text-green-600" : focusedField === "email" ? "text-primary" : "text-muted-foreground")} />
												{emailValidation.isChecking && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />}
												{emailValidation.isValid && fieldTouched.email && !emailValidation.isChecking && (
													<div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
														<CheckCircle2 className="w-3 h-3 text-white" />
													</div>
												)}
											</div>
										</FormControl>

										{/* Email suggestions */}
										{emailValidation.suggestions.length > 0 && fieldTouched.email && (
											<div id="email-suggestions" className="space-y-2">
												<p className="text-xs text-muted-foreground">Did you mean:</p>
												<div className="flex flex-wrap gap-2">
													{emailValidation.suggestions.map((suggestion, index) => (
														<button
															key={index}
															type="button"
															onClick={() => {
																field.onChange(suggestion);
																setFieldTouched((prev) => ({ ...prev, email: true }));
															}}
															className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded-md transition-colors text-primary hover:text-primary/80"
														>
															{suggestion}
														</button>
													))}
												</div>
											</div>
										)}

										{emailValidation.error && fieldTouched.email && (
											<p id="email-error" className="text-xs text-destructive flex items-center gap-1">
												<AlertCircle className="w-3 h-3" />
												{emailValidation.error}
											</p>
										)}
									</FormItem>
								)}
							/>

							{/* Password Field */}
							<FormField
								control={formMethods.control}
								name="password"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<div className="flex items-center justify-between">
											<FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
												<Lock className="w-4 h-4 text-muted-foreground" />
												Password
											</FormLabel>
											<Link href="/password-reset" className="text-xs text-primary hover:text-primary/80 transition-colors">
												Forgot password?
											</Link>
										</div>
										<FormControl>
											<div className="relative">
												<Input
													{...field}
													id="password"
													type={showPassword ? "text" : "password"}
													placeholder="Enter your password"
													className={cn(
														"h-12 pl-12 pr-12 text-base transition-all duration-200",
														// Error state
														errors.password
															? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20"
															: // Strong password state
																fieldTouched.password && currentPassword && passwordStrength.score >= 70
																? "border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-500/20 bg-green-50/50 dark:bg-green-950/20"
																: // Good password state
																	fieldTouched.password && currentPassword && passwordStrength.score >= 50
																	? "border-yellow-500 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-500/20 bg-yellow-50/50 dark:bg-yellow-950/20"
																	: // Default state
																		"border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
													)}
													required
													autoComplete="current-password"
													onFocus={() => {
														setFocusedField("password");
														setFieldTouched((prev) => ({ ...prev, password: true }));
													}}
													onBlur={() => setFocusedField(null)}
													suppressHydrationWarning={true}
												/>
												<Lock className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", errors.password ? "text-red-500" : fieldTouched.password && currentPassword && passwordStrength.score >= 70 ? "text-green-600" : fieldTouched.password && currentPassword && passwordStrength.score >= 50 ? "text-yellow-600" : focusedField === "password" ? "text-primary" : "text-muted-foreground")} />
												<button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setShowPassword(!showPassword)} tabIndex={-1} aria-label={showPassword ? "Hide password" : "Show password"}>
													{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
												</button>
											</div>
										</FormControl>

										{/* Password strength indicator */}
										{currentPassword && fieldTouched.password && (
											<div className="space-y-2">
												<div className="flex items-center justify-between">
													<span className="text-xs text-muted-foreground">Password strength</span>
													<span className={cn("text-xs font-medium", passwordStrength.level === "excellent" ? "text-green-600" : passwordStrength.level === "strong" ? "text-blue-600" : passwordStrength.level === "good" ? "text-yellow-600" : passwordStrength.level === "fair" ? "text-orange-600" : "text-red-600")}>{passwordStrength.level === "none" ? "Too weak" : passwordStrength.level.charAt(0).toUpperCase() + passwordStrength.level.slice(1)}</span>
												</div>
												<div className="w-full bg-muted rounded-full h-1.5">
													<div className={cn("h-1.5 rounded-full transition-all duration-300", passwordStrength.level === "excellent" ? "bg-green-500" : passwordStrength.level === "strong" ? "bg-blue-500" : passwordStrength.level === "good" ? "bg-yellow-500" : passwordStrength.level === "fair" ? "bg-orange-500" : "bg-red-500")} style={{ width: `${passwordStrength.score}%` }} />
												</div>
											</div>
										)}

										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>

							{/* Remember Me */}
							<FormField
								control={formMethods.control}
								name="rememberMe"
								render={({ field }) => (
									<div className="flex items-center space-x-3 py-2">
										<input type="checkbox" id="rememberMe" checked={field.value} onChange={field.onChange} className="w-4 h-4 text-primary focus:ring-primary focus:ring-2 border-border rounded transition-all" />
										<label htmlFor="rememberMe" className="text-sm text-foreground cursor-pointer select-none">
											Keep me signed in for 30 days
										</label>
									</div>
								)}
							/>

							<Button type="submit" className={cn("group w-full h-12 text-base font-semibold transition-all duration-300 relative overflow-hidden", "bg-primary hover:bg-primary/90 focus:ring-4 focus:ring-primary/20", "transform hover:scale-[1.02] active:scale-[0.98]", isSubmitting && "bg-primary/80 cursor-not-allowed")} disabled={isSubmitting || loading || isRateLimited}>
								<div className={cn("flex items-center justify-center transition-all duration-200", isSubmitting && "opacity-0")}>
									{isRateLimited ? (
										<>
											<AlertCircle className="mr-2 h-5 w-5" />
											Please wait before trying again
										</>
									) : loginContext && loginContext.key !== "default" ? (
										<>
											{ContextMessageGenerator.getPersonalizedCTA(loginContext, true)}
											<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
										</>
									) : (
										<>
											Sign In
											<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
										</>
									)}
								</div>

								{/* Loading state */}
								{isSubmitting && (
									<div className="absolute inset-0 flex items-center justify-center">
										<Loader2 className="mr-2 h-5 w-5 animate-spin" />
										<span className="animate-pulse">{loginContext && loginContext.key !== "default" ? `Signing in to ${loginContext.actionText.toLowerCase()}...` : "Signing you in..."}</span>
									</div>
								)}

								{/* Success animation overlay */}
								<div className={cn("absolute inset-0 bg-green-500 flex items-center justify-center transition-all duration-500", "transform translate-y-full group-data-[success=true]:translate-y-0")}>
									<CheckCircle2 className="h-5 w-5 text-white" />
								</div>
							</Button>
						</form>
					</Form>
				</FormProvider>

				{/* OAuth Providers */}
				{oauthProviders.length > 0 && (
					<>
						<div className="relative my-6">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">Or continue with</span>
							</div>
						</div>

						<div className="grid gap-3">
							{oauthProviders.map((provider) => (
								<Button key={provider.name} type="button" variant="outline" className="w-full" onClick={() => handleOAuthLogin(provider.name)} disabled={isSubmitting || loading}>
									{isSubmitting || loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span className="mr-2">{provider.icon}</span>}
									Sign in with {provider.displayName}
								</Button>
							))}
						</div>
					</>
				)}

				<div className="mt-6 text-sm text-center text-muted-foreground">
					Don&apos;t have an account?{" "}
					<Link href="/signup" className="font-medium text-primary hover:text-primary/80 transition-colors">
						Sign up here
					</Link>
				</div>
			</div>
		</ZodErrorBoundary>
	);
}
