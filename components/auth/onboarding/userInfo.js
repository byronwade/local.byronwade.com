import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";

const userSignupSchema = z.object({
	firstName: z.string().nonempty({ message: "First name is required" }),
	lastName: z.string().nonempty({ message: "Last name is required" }),
	phoneNumber: z.string().nonempty({ message: "Phone number is required" }),
	email: z.string().email({ message: "Invalid email address" }).nonempty({ message: "Email is required" }),
	howFound: z.string().nonempty({ message: "Please select an option" }),
});

export default function UserInfo() {
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
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">User Signup</h2>
			<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-400">Complete the form below to create your user account.</p>
			<div className="flex flex-col mt-6">
				<FormProvider {...formMethods}>
					<Form {...formMethods}>
						<form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-10">
							<FormField
								control={formMethods.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											First name <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input {...field} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
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
										<FormLabel>
											Last name <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input {...field} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={formMethods.control}
								name="phoneNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Phone Number <span className="text-red-500">*</span>
										</FormLabel>
										<FormDescription>We use your phone number for account authentication</FormDescription>
										<FormControl>
											<Input {...field} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={formMethods.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Email <span className="text-red-500">*</span>
										</FormLabel>
										<FormDescription>We dont use your email for marketing</FormDescription>
										<FormControl>
											<Input {...field} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={formMethods.control}
								name="howFound"
								render={({ field }) => (
									<FormItem>
										<FormLabel>How did you find us?</FormLabel>
										<FormDescription>Select an option that best describes how you found us.</FormDescription>
										<FormControl>
											<Select {...field}>
												<SelectTrigger className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
													<SelectValue placeholder="Select an option" />
												</SelectTrigger>
												<SelectContent className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900">
													<SelectItem value="google">Google</SelectItem>
													<SelectItem value="friend">Friend</SelectItem>
													<SelectItem value="social">Social Media</SelectItem>
													<SelectItem value="advertisement">Advertisement</SelectItem>
													<SelectItem value="other">Other</SelectItem>
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
				</FormProvider>
				<p className="mt-4 text-sm leading-6 text-left text-gray-600 dark:text-gray-400">After signing up, you will have the option to add a business if you have one.</p>
			</div>
		</>
	);
}
