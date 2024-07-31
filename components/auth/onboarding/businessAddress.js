import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";

const businessAddressSchema = z.object({
	address: z.object({
		street: z.string().nonempty({ message: "Street is required" }),
		city: z.string().nonempty({ message: "City is required" }),
		state: z.string().nonempty({ message: "State is required" }),
		zip: z.string().regex(/^\d{5}$/, { message: "Invalid ZIP code. Must be 5 digits." }),
	}),
});

export default function BusinessAddress({ onNext, onBack }) {
	const formMethods = useForm({
		resolver: zodResolver(businessAddressSchema),
		defaultValues: {
			address: {
				street: "",
				city: "",
				state: "",
				zip: "",
			},
		},
	});

	const onSubmit = (values) => {
		console.log(values);
		onNext(values); // Call onNext to proceed to the next step
	};

	return (
		<>
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">Business Address</h2>
			<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-400">Complete the form below to provide your business address.</p>
			<div className="flex flex-col mt-6">
				<FormProvider {...formMethods}>
					<Form {...formMethods}>
						<form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-10">
							<FormField
								control={formMethods.control}
								name="address.street"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Street <span className="text-red-500">*</span>
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
								name="address.city"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											City <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input {...field} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex space-x-4">
								<FormField
									control={formMethods.control}
									name="address.state"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>
												State <span className="text-red-500">*</span>
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
									name="address.zip"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>
												ZIP Code <span className="text-red-500">*</span>
											</FormLabel>
											<FormControl>
												<Input {...field} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</form>
					</Form>
				</FormProvider>
			</div>
		</>
	);
}
