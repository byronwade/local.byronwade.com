"use client";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";

const passwordResetSchema = z
	.object({
		newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
		confirmPassword: z.string().min(8, { message: "Confirm password must be at least 8 characters" }),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export default function PasswordReset() {
	const formMethods = useForm({
		resolver: zodResolver(passwordResetSchema),
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
		},
	});

	const onSubmit = (values) => {
		console.log(values);
	};
	return (
		<>
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left ">Password Reset</h2>
			<p className="text-sm leading-6 text-left text-muted-foreground">Enter your new password and confirm it.</p>
			<div className="flex flex-col mt-6">
				<FormProvider {...formMethods}>
					<Form {...formMethods}>
						<form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-10">
							<FormField
								control={formMethods.control}
								name="newPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>New Password</FormLabel>
										<FormControl>
											<Input {...field} type="password" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={formMethods.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm New Password</FormLabel>
										<FormControl>
											<Input {...field} type="password" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit">Reset Password</Button>
						</form>
					</Form>
				</FormProvider>
			</div>
		</>
	);
}
