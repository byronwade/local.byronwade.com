import React from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";

const addressSchema = z.object({
	street: z.string().nonempty({ message: "Street is required" }),
	city: z.string().nonempty({ message: "City is required" }),
	state: z.string().nonempty({ message: "State is required" }),
	zip: z.string().regex(/^\d{5}$/, { message: "Invalid ZIP code. Must be 5 digits." }),
	poBox: z.string().optional(),
	additionalAddresses: z
		.array(
			z.object({
				street: z.string().nonempty({ message: "Street is required" }),
				city: z.string().nonempty({ message: "City is required" }),
				state: z.string().nonempty({ message: "State is required" }),
				zip: z.string().regex(/^\d{5}$/, { message: "Invalid ZIP code. Must be 5 digits." }),
			})
		)
		.max(1, "You can only add 1 additional address")
		.optional(),
});

export default function UserAddress() {
	const formMethods = useForm({
		resolver: zodResolver(addressSchema),
		defaultValues: {
			street: "",
			city: "",
			state: "",
			zip: "",
			poBox: "",
			additionalAddresses: [],
		},
	});

	const { control, handleSubmit } = formMethods;
	const { fields, append, remove } = useFieldArray({
		control,
		name: "additionalAddresses",
	});

	const onSubmit = (values) => {
		console.log(values);
	};

	return (
		<>
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">User Address Information</h2>
			<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-400">Complete the form below to provide your address information.</p>
			<div className="flex flex-col mt-6">
				<FormProvider {...formMethods}>
					<Form {...formMethods}>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
							<FormField
								control={control}
								name="street"
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
								control={control}
								name="city"
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
									control={control}
									name="state"
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
									control={control}
									name="zip"
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
							<FormField
								control={control}
								name="poBox"
								render={({ field }) => (
									<FormItem>
										<FormLabel>PO Box</FormLabel>
										<FormControl>
											<Input {...field} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{fields.map((item, index) => (
								<div key={item.id} className="space-y-6">
									<h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">Additional Address {index + 1}</h3>
									<FormField
										control={control}
										name={`additionalAddresses.${index}.street`}
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
										control={control}
										name={`additionalAddresses.${index}.city`}
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
											control={control}
											name={`additionalAddresses.${index}.state`}
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
											control={control}
											name={`additionalAddresses.${index}.zip`}
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
									<div className="flex justify-between space-x-4">
										<Button variant="destructive" type="button" onClick={() => remove(index)} className="mt-2 ml-auto">
											Remove Address
										</Button>
									</div>
								</div>
							))}
							{fields.length < 1 && (
								<Button type="button" variant="outline" onClick={() => append({ street: "", city: "", state: "", zip: "" })} className="mt-2">
									Add Additional Address
								</Button>
							)}
						</form>
					</Form>
				</FormProvider>
			</div>
		</>
	);
}
