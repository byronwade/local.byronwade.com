import React from "react";
import { useFormContext } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";

export default function BusinessAddress() {
	const { control } = useFormContext();

	return (
		<>
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">Business Address</h2>
			<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-400">Complete the form below to provide your business address.</p>
			<div className="flex flex-col mt-6 space-y-6">
				<FormField
					control={control}
					name="businessAddress.street"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>
								Street <span className="text-red-500">*</span>
							</FormLabel>
							<FormControl>
								<Input {...field} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus-border-brand dark:focus-within:border-brand" />
							</FormControl>
							<FormMessage>{fieldState.error?.message}</FormMessage>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="businessAddress.city"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>
								City <span className="text-red-500">*</span>
							</FormLabel>
							<FormControl>
								<Input {...field} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus-border-brand dark:focus-within:border-brand" />
							</FormControl>
							<FormMessage>{fieldState.error?.message}</FormMessage>
						</FormItem>
					)}
				/>
				<div className="flex space-x-4">
					<FormField
						control={control}
						name="businessAddress.state"
						render={({ field, fieldState }) => (
							<FormItem className="flex-1">
								<FormLabel>
									State <span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input {...field} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus-border-brand dark:focus-within:border-brand" />
								</FormControl>
								<FormMessage>{fieldState.error?.message}</FormMessage>
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="businessAddress.zip"
						render={({ field, fieldState }) => (
							<FormItem className="flex-1">
								<FormLabel>
									ZIP Code <span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input {...field} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus-border-brand dark:focus-within:border-brand" />
								</FormControl>
								<FormMessage>{fieldState.error?.message}</FormMessage>
							</FormItem>
						)}
					/>
				</div>
			</div>
		</>
	);
}
