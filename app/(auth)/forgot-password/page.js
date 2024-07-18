"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const forgotPasswordSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
});

export default function ForgotPassword() {
	const form = useForm({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const handleForgotPassword = async (values) => {
		console.log("Forgot Password values:", values);
		// Add your forgot password logic here
	};

	const {
		watch,
		trigger,
		formState: { errors, touchedFields },
	} = form;

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
					<h2 className="text-3xl font-bold">Forgot Password</h2>
					<p className="text-muted-foreground">Enter your email to reset your password</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleForgotPassword)} className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Enter your email" className={getValidationClass("email")} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full">
							Reset Password
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
