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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getEnabledProviders } from "@lib/supabase/auth/providers";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const signupSchema = z
	.object({
		firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
		lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
		email: z.string().email({ message: "Invalid email address" }),
		password: z
			.string()
			.min(8, { message: "Password must be at least 8 characters" })
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
				message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
			}),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export default function SignupPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isConfirmationEmailSent, setIsConfirmationEmailSent] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [oauthProviders, setOauthProviders] = useState([]);
	const [passwordStrength, setPasswordStrength] = useState(null);

	const formMethods = useForm({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const {
		handleSubmit,
		formState: { errors, isValid, touchedFields },
		watch,
	} = formMethods;

	const { user, isAuthenticated, userRoles, loading, signup, loginWithOAuth, error: authError, clearError, validateEmail, validatePasswordStrength } = useAuth();

	// Watch password field for strength validation
	const watchedPassword = watch("password");

	// Load OAuth providers on mount
	useEffect(() => {
		const providers = getEnabledProviders();
		setOauthProviders(providers);
	}, []);

	// Handle URL parameters for redirects and errors
	useEffect(() => {
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

	// Validate password strength in real-time
	useEffect(() => {
		if (watchedPassword && watchedPassword.length > 0) {
			const strength = validatePasswordStrength(watchedPassword);
			setPasswordStrength(strength);
		} else {
			setPasswordStrength(null);
		}
	}, [watchedPassword, validatePasswordStrength]);

	// Redirect authenticated users to their dashboard
	useEffect(() => {
		if (isAuthenticated && user && userRoles.length > 0) {
			const redirectTo = searchParams.get("redirectTo");

			let dashboardPath = "/dashboard/user"; // Default

			if (userRoles.includes("admin")) {
				dashboardPath = "/dashboard/admin";
			} else if (userRoles.includes("business_owner")) {
				dashboardPath = "/dashboard/business";
			}

			// Use custom redirect or default dashboard
			const targetPath = redirectTo && redirectTo.startsWith("/") ? redirectTo : dashboardPath;

			router.push(targetPath);
		}
	}, [isAuthenticated, user, userRoles, router, searchParams]);

	const onSubmit = async (data) => {
		if (isSubmitting || loading) return;

		// Clear any previous errors
		clearError();
		setIsSubmitting(true);

		try {
			const result = await signup(data.email, data.password, {
				firstName: data.firstName,
				lastName: data.lastName,
				fullName: `${data.firstName} ${data.lastName}`,
			});

			if (result.success) {
				if (result.data?.user && !result.data?.session) {
					// User created but needs email confirmation
					setIsConfirmationEmailSent(true);
					toast.success("Account created! Please check your email to confirm your account.");
				} else {
					// User signed up and automatically logged in
					toast.success("Account created successfully! Welcome to Thorbis!");
				}
			} else {
				// Error already handled by the auth hook
				if (result.error?.userMessage) {
					toast.error(result.error.userMessage);
				}
			}
		} catch (error) {
			console.error("Signup failed:", error);
			toast.error("Account creation failed. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleOAuthSignup = async (providerName) => {
		if (isSubmitting || loading) return;

		try {
			const redirectTo = `${window.location.origin}/auth/callback?type=signup`;
			const result = await loginWithOAuth(providerName, redirectTo);

			if (!result.success && result.error?.userMessage) {
				toast.error(result.error.userMessage);
			}
			// OAuth success will redirect automatically
		} catch (error) {
			console.error(`${providerName} signup error:`, error);
			toast.error(`${providerName} signup failed. Please try again.`);
		}
	};

	if (isConfirmationEmailSent) {
		return (
			<div className="flex flex-col items-center justify-center text-center space-y-4">
				<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
					<svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<h2 className="text-2xl font-bold">Check your email</h2>
				<p className="text-muted-foreground max-w-sm">We've sent a confirmation link to your email address. Please click the link to activate your account.</p>
				<div className="flex flex-col space-y-2 mt-6">
					<Button variant="outline" onClick={() => setIsConfirmationEmailSent(false)}>
						Back to signup
					</Button>
					<Link href="/login">
						<Button variant="ghost" className="w-full">
							Already have an account? Sign in
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<>
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left">Create your account</h2>
			<p className="text-sm leading-6 text-left text-muted-foreground">Enter your details below to create your account</p>

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

			<div className="flex flex-col mt-6">
				<FormProvider {...formMethods}>
					<Form {...formMethods}>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={formMethods.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>First name</FormLabel>
											<FormControl>
												<Input {...field} id="firstName" type="text" placeholder="John" className={`${errors.firstName ? "border-red-500" : touchedFields.firstName ? "border-green-500" : ""}`} required autoComplete="given-name" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={formMethods.control}
									name="lastName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Last name</FormLabel>
											<FormControl>
												<Input {...field} id="lastName" type="text" placeholder="Doe" className={`${errors.lastName ? "border-red-500" : touchedFields.lastName ? "border-green-500" : ""}`} required autoComplete="family-name" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={formMethods.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input {...field} id="email" type="email" placeholder="john@example.com" className={`${errors.email ? "border-red-500" : touchedFields.email ? "border-green-500" : ""}`} required autoComplete="email" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={formMethods.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input {...field} id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className={`pr-10 ${errors.password ? "border-red-500" : touchedFields.password ? "border-green-500" : ""}`} required autoComplete="new-password" />
												<button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
													{showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
												</button>
											</div>
										</FormControl>
										<FormMessage />

										{/* Password Strength Indicator */}
										{passwordStrength && watchedPassword && (
											<div className="mt-2 space-y-2">
												<div className="flex items-center space-x-2">
													<div className="flex space-x-1">
														{[...Array(4)].map((_, i) => (
															<div key={i} className={`h-1 w-6 rounded-full ${i < passwordStrength.score ? (passwordStrength.score < 2 ? "bg-red-500" : passwordStrength.score < 3 ? "bg-yellow-500" : "bg-green-500") : "bg-gray-200 dark:bg-gray-600"}`} />
														))}
													</div>
													<span className="text-xs text-muted-foreground">{passwordStrength.score < 2 ? "Weak" : passwordStrength.score < 3 ? "Fair" : passwordStrength.score < 4 ? "Good" : "Strong"}</span>
												</div>
												{passwordStrength.feedback.length > 0 && (
													<ul className="text-xs text-muted-foreground space-y-1">
														{passwordStrength.feedback.map((item, index) => (
															<li key={index} className="flex items-center space-x-1">
																<span className="w-1 h-1 bg-muted-foreground rounded-full" />
																<span>{item}</span>
															</li>
														))}
													</ul>
												)}
											</div>
										)}
									</FormItem>
								)}
							/>

							<FormField
								control={formMethods.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input {...field} id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" className={`pr-10 ${errors.confirmPassword ? "border-red-500" : touchedFields.confirmPassword ? "border-green-500" : ""}`} required autoComplete="new-password" />
												<button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
													{showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
												</button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full" disabled={!isValid || isSubmitting || loading || (passwordStrength && !passwordStrength.isValid)}>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating account...
									</>
								) : (
									"Create account"
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
								<Button key={provider.name} type="button" variant="outline" className="w-full" onClick={() => handleOAuthSignup(provider.name)} disabled={isSubmitting || loading}>
									{isSubmitting || loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span className="mr-2">{provider.icon}</span>}
									Sign up with {provider.displayName}
								</Button>
							))}
						</div>
					</>
				)}

				<div className="mt-6 text-sm text-center">
					Already have an account?{" "}
					<Link href="/login" className="underline">
						Sign in
					</Link>
				</div>

				<div className="mt-4 text-xs text-muted-foreground text-center">
					By creating an account, you agree to our{" "}
					<Link href="/terms" className="underline">
						Terms of Service
					</Link>{" "}
					and{" "}
					<Link href="/privacy" className="underline">
						Privacy Policy
					</Link>
				</div>
			</div>
		</>
	);
}
