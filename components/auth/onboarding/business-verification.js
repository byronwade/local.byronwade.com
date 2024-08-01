import React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@components/ui/form";
import { Input } from "@components/ui/input";

export default function BusinessVerification() {
	const { control } = useFormContext();

	return (
		<>
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">Business Verification</h2>
			<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-400">Complete the form below to provide verification documents for your business.</p>
			<div className="flex flex-col mt-6 space-y-6">
				<FormField
					control={control}
					name="businessVerification.ein"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>
								EIN <span className="text-red-500">*</span>
							</FormLabel>
							<FormControl>
								<Input {...field} placeholder="XX-XXXXXXX" className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
							</FormControl>
							<FormMessage>{fieldState.error?.message}</FormMessage>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="businessVerification.registrationDocument"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>
								Business Registration Document <span className="text-red-500">*</span>
							</FormLabel>
							<FormDescription>
								Proof that your business is registered with the state.
								<a href="https://www.nolo.com/legal-encyclopedia/registration-documents.html" target="_blank" rel="noopener noreferrer" className="text-blue-500">
									{" "}
									Example
								</a>
							</FormDescription>
							<FormControl>
								<Input type="file" onChange={(e) => field.onChange(Array.from(e.target.files))} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
							</FormControl>
							<FormMessage>{fieldState.error?.message}</FormMessage>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="businessVerification.businessLicense"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>
								Business License <span className="text-red-500">*</span>
							</FormLabel>
							<FormDescription>
								Permit issued by a government agency allowing you to conduct business.
								<a href="https://www.legalzoom.com/articles/what-is-a-business-license" target="_blank" rel="noopener noreferrer" className="text-blue-500">
									{" "}
									Example
								</a>
							</FormDescription>
							<FormControl>
								<Input type="file" onChange={(e) => field.onChange(Array.from(e.target.files))} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
							</FormControl>
							<FormMessage>{fieldState.error?.message}</FormMessage>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="businessVerification.proofOfOwnership"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>
								Proof of Company Ownership <span className="text-red-500">*</span>
							</FormLabel>
							<FormDescription>
								Documents like stock certificates or articles of incorporation showing ownership.
								<a href="https://www.thebalancesmb.com/what-documents-are-needed-to-sell-your-small-business-4126245" target="_blank" rel="noopener noreferrer" className="text-blue-500">
									{" "}
									Example
								</a>
							</FormDescription>
							<FormControl>
								<Input type="file" onChange={(e) => field.onChange(Array.from(e.target.files))} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus-border-brand dark:focus-within:border-brand" />
							</FormControl>
							<FormMessage>{fieldState.error?.message}</FormMessage>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="businessVerification.ownerID"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>
								Owner&apos;s Government-Issued ID <span className="text-red-500">*</span>
							</FormLabel>
							<FormDescription>
								A government-issued ID for the business owner.
								<a href="https://www.dmv.org/id-cards.php" target="_blank" rel="noopener noreferrer" className="text-blue-500">
									{" "}
									Example
								</a>
							</FormDescription>
							<FormControl>
								<Input type="file" onChange={(e) => field.onChange(Array.from(e.target.files))} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus-border-brand dark:focus-within:border-brand" />
							</FormControl>
							<FormMessage>{fieldState.error?.message}</FormMessage>
						</FormItem>
					)}
				/>
			</div>
		</>
	);
}
