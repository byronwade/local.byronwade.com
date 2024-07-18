"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const verificationSchema = z.object({
	code: z.string().nonempty({ message: "Verification code is required" }),
});

const VerificationCodePage = () => {
	const form = useForm({
		resolver: zodResolver(verificationSchema),
		defaultValues: {
			code: "",
		},
	});

	const handleVerification = async (values) => {
		console.log("Verification code:", values.code);
		// Add your verification logic here
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
					<h2 className="text-3xl font-bold">Verify Your Account</h2>
					<p className="text-muted-foreground">Enter the code sent to your email to verify your account</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleVerification)} className="space-y-4">
						<FormField
							control={form.control}
							name="code"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Verification Code</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Enter your code" className={getValidationClass("code")} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full">
							Verify
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default VerificationCodePage;
