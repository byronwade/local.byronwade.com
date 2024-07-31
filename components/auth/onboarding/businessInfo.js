import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@components/ui/form";
import { Input } from "@components/ui/input";

const businessInfoSchema = z.object({
	businessName: z.string().nonempty({ message: "Business name is required" }),
	businessPhoneNumber: z.string().nonempty({ message: "Business phone number is required" }),
	email: z.string().email({ message: "Invalid email address" }).nonempty({ message: "Email is required" }),
});

export default function BusinessInfo({ onNext }) {
	const formMethods = useForm({
		resolver: zodResolver(businessInfoSchema),
		defaultValues: {
			businessName: "",
			businessPhoneNumber: "",
			email: "",
		},
	});

	const onSubmit = (values) => {
		console.log(values);
		onNext(values); // Call onNext to proceed to the next step
	};

	return (
		<>
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">Business Information</h2>
			<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-400">Complete the form below to provide your business information.</p>
			<div className="flex flex-col mt-6">
				<FormProvider {...formMethods}>
					<Form {...formMethods}>
						<form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-10">
							<FormField
								control={formMethods.control}
								name="businessName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Business Name <span className="text-red-500">*</span>
										</FormLabel>
										<FormDescription>Please provide the company display name not legal entity name.</FormDescription>
										<FormControl>
											<Input {...field} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={formMethods.control}
								name="businessPhoneNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Business Phone Number <span className="text-red-500">*</span>
										</FormLabel>
										<FormDescription>This wiull be the number that users on the website will call</FormDescription>
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
										<FormDescription>We don&apos;t use your email for marketing</FormDescription>
										<FormControl>
											<Input {...field} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
				</FormProvider>
			</div>
		</>
	);
}
