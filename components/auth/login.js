"use client";

import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@context/AuthContext";
import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { getEnabledProviders } from "@lib/supabase/auth/providers";
import { Eye, EyeOff, Loader2, AlertCircle, Shield, Fingerprint, CheckCircle2 } from "lucide-react";
import { cn } from "@lib/utils";
import { logger } from "@lib/utils/logger";
import { DeviceFingerprint } from "@lib/security/deviceFingerprint";
import { PasswordStrengthIndicator } from "@components/auth/shared/PasswordStrengthIndicator";
import { RateLimitWarning } from "@components/auth/shared/RateLimitWarning";
import IntelligentLoginMessage from "@components/auth/shared/IntelligentLoginMessage";
import { LoginContextDetector, ContextMessageGenerator } from "@lib/auth/loginContext";

// Enhanced validation schema with security features
const loginSchema = z.object({
	email: z
		.string()
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

	const formMethods = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
			trustedDevice: false,
		},
		mode: "onChange", // Enable real-time validation
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
		<>
			{/* Intelligent Context Message */}
			<IntelligentLoginMessage onContextDetected={handleContextDetected} />

			{/* Dynamic Header Based on Context */}
			<div className="mt-6">
				<h2 className="mb-1 text-2xl font-bold leading-9 text-left">{loginContext && loginContext.key !== "default" ? loginContext.title : "Welcome Back"}</h2>
				<p className="text-sm leading-6 text-left text-muted-foreground">{loginContext && loginContext.key !== "default" ? loginContext.subtitle : "Sign in to your account"}</p>
			</div>

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

			<div className="flex flex-col mt-6">
				<FormProvider {...formMethods}>
					<Form {...formMethods}>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6" suppressHydrationWarning={true}>
							{/* Email Field */}
							<FormField
								control={formMethods.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input {...field} id="email" type="email" placeholder="Enter your email address" className={`${errors.email ? "border-red-500" : touchedFields.email ? "border-green-500" : ""}`} required autoComplete="email" autoFocus spellCheck={false} suppressHydrationWarning={true} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Password Field */}
							<FormField
								control={formMethods.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<div className="flex items-center justify-between">
											<FormLabel>Password</FormLabel>
											<Link href="/password-reset" className="text-sm text-primary hover:text-primary/80 transition-colors">
												Forgot password?
											</Link>
										</div>
										<FormControl>
											<div className="relative">
												<Input {...field} id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className={`pr-10 ${errors.password ? "border-red-500" : touchedFields.password ? "border-green-500" : ""}`} required autoComplete="current-password" suppressHydrationWarning={true} />
												<button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
													{showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
												</button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Remember Me */}
							<FormField
								control={formMethods.control}
								name="rememberMe"
								render={({ field }) => (
									<div className="flex items-start space-x-3">
										<input type="checkbox" id="rememberMe" checked={field.value} onChange={field.onChange} className="w-5 h-5 mt-0.5 text-primary focus:ring-primary focus:ring-2 border-gray-300 rounded" />
										<div>
											<label htmlFor="rememberMe" className="text-sm font-medium text-foreground cursor-pointer">
												Keep me signed in
											</label>
											<p className="text-xs text-muted-foreground mt-1">Stay signed in for 30 days on this device</p>
										</div>
									</div>
								)}
							/>

							<Button type="submit" className="w-full" disabled={!isValid || isSubmitting || loading || isRateLimited}>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										{loginContext && loginContext.key !== "default" ? `Signing in to ${loginContext.actionText.toLowerCase()}...` : "Signing you in..."}
									</>
								) : isRateLimited ? (
									"Please wait before trying again"
								) : loginContext && loginContext.key !== "default" ? (
									ContextMessageGenerator.getPersonalizedCTA(loginContext, true)
								) : (
									"Sign In"
								)}
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

				<div className="mt-6 text-sm text-center">
					Don't have an account?{" "}
					<Link href="/signup" className="underline">
						Sign up
					</Link>
				</div>
			</div>
		</>
	);
}
