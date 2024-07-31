"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { ArrowRight } from "react-feather";
import useAuthStore from "@store/useAuthStore";
import { supabase } from "@lib/supabaseClient";

const resendSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
});

const EmailVerified = () => {
	const [loading, setLoading] = useState(true);
	const params = useParams();

	console.log("params", params);

	const { user, isEmailVerified, initializeAuth, resendLoading, resendSuccess, resendError, handleResendVerificationEmail, fetchUserRoles } = useAuthStore((state) => ({
		user: state.user,
		isEmailVerified: state.isEmailVerified,
		initializeAuth: state.initializeAuth,
		resendLoading: state.resendLoading,
		resendSuccess: state.resendSuccess,
		resendError: state.resendError,
		handleResendVerificationEmail: state.handleResendVerificationEmail,
		fetchUserRoles: state.fetchUserRoles,
	}));

	const formMethods = useForm({
		resolver: zodResolver(resendSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = (data) => {
		handleResendVerificationEmail(data.email);
	};

	useEffect(() => {
		const verifyEmailAndLogin = async () => {
			if (token && type === "email") {
				const { error } = await supabase.auth.verifyOtp({
					type: "email",
					token,
				});

				if (error) {
					console.error("Error verifying token:", error);
				} else {
					// After successful verification, fetch the session and user details
					const { data: sessionError } = await supabase.auth.getSession();
					const user = sessionError?.session?.user;
					if (user) {
						await fetchUserRoles(user.id);
					}
				}
			}
			setLoading(false);
		};

		if (token && type) {
			verifyEmailAndLogin();
		} else {
			setLoading(false);
		}
	}, [token, type, fetchUserRoles]);

	if (loading) {
		return (
			<div className="flex justify-center w-full">
				<Image src="/ThorbisLogo.webp" alt="Thorbis Logo" width={100} height={100} className="w-[60px] h-[60px] animate-breathe" />
			</div>
		);
	}

	if (!user) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-200">You are not logged in</h2>
					<Link href="/login">
						<Button variant="brand" className="w-full mb-4">
							Login
						</Button>
					</Link>
					<Link href="/signup">
						<Button variant="outline" className="w-full">
							Sign Up
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<>
			{isEmailVerified() ? (
				<>
					<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-green-700 dark:text-green-500">Email has been Verified</h2>
					<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-300">Your email has been verified and you now have access to your account.</p>
					<div className="flex flex-col mt-6">
						<div className="flex flex-col w-full space-y-4">
							<div className="flex flex-row w-full space-x-4">
								<Link href="/">
									<Button variant="outline" className="w-full">
										Write a review
									</Button>
								</Link>
								<Link href="/" className="w-full">
									<Button className="w-full">
										Post a job <ArrowRight className="w-4 h-4 ml-2" />
									</Button>
								</Link>
							</div>
							<Button variant="outline" className="w-full">
								Search for a company <ArrowRight className="w-4 h-4 ml-2" />
							</Button>
							{user?.userRoles?.includes("business_user") && (
								<Button variant="brand" className="w-full">
									Go to business dashboard <ArrowRight className="w-4 h-4 ml-2" />
								</Button>
							)}
						</div>
					</div>
					{!user?.userRoles?.includes("business_user") && (
						<div className="flex flex-col mt-10">
							<div className="w-full my-20 border rounded-full dark:border-dark-800 border-dark-300"></div>
							<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">Now add a business</h2>
							<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-300">
								If you own a company you can alternatively add it here, please note that you will have to <b>prove ownership</b> to claim otherwise you can add one anonymously.
							</p>
							<div className="flex flex-col mt-4 space-y-4">
								<Button variant="brand" className="w-full">
									Claim a business <ArrowRight className="w-4 h-4 ml-2" />
								</Button>
								<Button variant="outline" className="w-full">
									Submit Business Anonymously <ArrowRight className="w-4 h-4 ml-2" />
								</Button>
							</div>
						</div>
					)}
				</>
			) : (
				<>
					<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-red-500">Unable to Verify</h2>
					<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-300">We were unable to verify your account</p>
					<div className="flex flex-col mt-6">
						<FormProvider {...formMethods}>
							<Form {...formMethods}>
								<form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-4">
									<FormField
										control={formMethods.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input {...field} type="email" placeholder="m@example.com" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button variant="outline" type="submit" disabled={resendLoading}>
										{resendLoading ? "Resending..." : "Resend Verification Email"}
									</Button>
								</form>
							</Form>
						</FormProvider>
					</div>
					{resendSuccess && <p className="mt-2 text-sm leading-6 text-left text-green-500">Verification email resent successfully.</p>}
					{resendError && <p className="mt-2 text-sm leading-6 text-left text-red-500">{resendError}</p>}

					<div className="flex flex-col mt-10">
						<div className="w-full my-20 border rounded-full dark:border-dark-800 border-dark-300"></div>
						<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">Now add a business</h2>
						<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-300">You can still add a company anonymously if you wish.</p>
						<div className="flex flex-col mt-4 space-y-4">
							<Button variant="outline" className="w-full">
								Submit Business Anonymously <ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default EmailVerified;
