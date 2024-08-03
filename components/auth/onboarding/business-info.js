import React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@components/ui/form";
import { Input } from "@components/ui/input";

export default function BusinessInfo() {
	const { control } = useFormContext();

	return (
		<>
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left">Business Information</h2>
			<p className="text-sm leading-6 text-left text-muted-foreground">Complete the form below to provide your business information.</p>
			<div className="flex flex-col mt-6 space-y-6">
				<FormField
					control={control}
					name="businessInfo.businessName"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>
								Business Name <span className="text-red-500">*</span>
							</FormLabel>
							<FormDescription>Please provide the company display name not legal entity name.</FormDescription>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage>{fieldState.error?.message}</FormMessage>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="businessInfo.businessPhoneNumber"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>
								Business Phone Number <span className="text-red-500">*</span>
							</FormLabel>
							<FormDescription>This will be the number that users on the website will call.</FormDescription>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage>{fieldState.error?.message}</FormMessage>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="businessInfo.email"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>
								Email <span className="text-red-500">*</span>
							</FormLabel>
							<FormDescription>We don&apos;t use your email for marketing.</FormDescription>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage>{fieldState.error?.message}</FormMessage>
						</FormItem>
					)}
				/>
			</div>
		</>
	);
}
