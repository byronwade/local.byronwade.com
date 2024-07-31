"use client";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@components/ui/input-otp";

const userSignupSchema = z.object({
	firstName: z.string().nonempty({ message: "First name is required" }),
	lastName: z.string().nonempty({ message: "Last name is required" }),
	phoneNumber: z.string().nonempty({ message: "Phone number is required" }),
	email: z.string().email({ message: "Invalid email address" }).nonempty({ message: "Email is required" }),
	howFound: z.string().nonempty({ message: "Please select an option" }),
});

export default function AccountOTP() {
	const formMethods = useForm({
		resolver: zodResolver(userSignupSchema),
		defaultValues: {
			firstName: "Byron",
			lastName: "Wade",
			phoneNumber: "",
			email: "",
			howFound: "",
		},
	});

	const onSubmit = (values) => {
		console.log(values);
	};
	return (
		<>
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">Verify your code</h2>
			<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-400">Please input your code from your email or text message.</p>
			<div className="flex flex-col mt-6">
				<FormProvider {...formMethods}>
					<Form {...formMethods}>
						<form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-10">
							<FormField
								control={formMethods.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<InputOTP maxLength={6}>
												<InputOTPGroup>
													<InputOTPSlot index={0} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
													<InputOTPSlot index={1} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
													<InputOTPSlot index={2} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
												</InputOTPGroup>
												<InputOTPSeparator />
												<InputOTPGroup>
													<InputOTPSlot index={3} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
													<InputOTPSlot index={4} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
													<InputOTPSlot index={5} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
												</InputOTPGroup>
											</InputOTP>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button variant="brand" type="submit">
								Confirm
							</Button>
						</form>
					</Form>
				</FormProvider>
			</div>
		</>
	);
}
