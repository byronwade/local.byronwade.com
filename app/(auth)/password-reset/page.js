"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const passwordResetSchema = z
	.object({
		password: z.string().min(6, { message: "Password must be at least 6 characters" }),
		confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export default function PasswordReset() {
	const form = useForm({
		resolver: zodResolver(passwordResetSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const handlePasswordReset = async (values) => {
		console.log("Password Reset values:", values);
		// Add your password reset logic here
	};

	const {
		watch,
		trigger,
		formState: { errors, touchedFields },
	} = form;

	const watchFields = watch(["password", "confirmPassword"]);

	const isStepValid = watchFields[0] && watchFields[1] && !errors.password && !errors.confirmPassword;

	const getValidationClass = (fieldName) => {
		if (errors[fieldName]) {
			return "border-red-500";
		}
		if (touchedFields[fieldName] && !errors[fieldName]) {
			return "border-green-500";
		}
		return "";
	};

	return (
		<div className="flex items-center justify-center mt-6 md:mt-10">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h2 className="text-3xl font-bold">Reset Password</h2>
					<p className="text-muted-foreground">Enter your new password</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handlePasswordReset)} className="space-y-4">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<Input {...field} type="password" placeholder="New Password" className={getValidationClass("password")} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<Input {...field} type="password" placeholder="Confirm Password" className={getValidationClass("confirmPassword")} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full" disabled={!isStepValid}>
							Reset Password
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
