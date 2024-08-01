"use client";

import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { useRouter } from "next/navigation";
import useAuthStore from "@store/useAuthStore";
import { useEffect } from "react";

const loginSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
	const formMethods = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const {
		handleSubmit,
		formState: { errors, isValid, touchedFields },
	} = formMethods;

	const login = useAuthStore((state) => state.login);
	const initializeAuth = useAuthStore((state) => state.initializeAuth);
	const user = useAuthStore((state) => state.user);
	const userRoles = useAuthStore((state) => state.userRoles);
	const router = useRouter();

	useEffect(() => {
		initializeAuth();
	}, [initializeAuth]);

	useEffect(() => {
		if (user) {
			if (userRoles.includes("admin")) {
				router.push("/admin");
			} else if (userRoles.includes("business_owner")) {
				router.push("/business");
			} else {
				router.push("/user");
			}
		}
	}, [user, userRoles, router]);

	const onSubmit = async (data) => {
		try {
			await login(data.email, data.password);
			console.log("Login successful");
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	return (
		<>
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">Login</h2>
			<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-400">Enter your email below to login to your account</p>
			<div className="flex flex-col mt-6">
				<FormProvider {...formMethods}>
					<Form {...formMethods}>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={formMethods.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input {...field} id="email" type="email" placeholder="m@example.com" className={`bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand ${errors.email ? "border-red-500" : touchedFields.email ? "border-green-500" : ""}`} required />
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
										<div className="flex items-center justify-between">
											<FormLabel>Password</FormLabel>
											<Link href="/forgot-password" className="inline-block text-sm underline">
												Forgot your password?
											</Link>
										</div>
										<FormControl>
											<Input {...field} id="password" type="password" className={`bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand ${errors.password ? "border-red-500" : touchedFields.password ? "border-green-500" : ""}`} required />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full" disabled={!isValid}>
								Login
							</Button>
							<Button variant="outline" className="w-full">
								Login with Google
							</Button>
						</form>
					</Form>
				</FormProvider>
				<div className="mt-4 text-sm text-center">
					Don&apos;t have an account?{" "}
					<Link href="/signup" className="underline">
						Sign up
					</Link>
				</div>
			</div>
		</>
	);
}
