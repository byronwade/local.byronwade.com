import React from "react";
import { useFormContext } from "react-hook-form";
import { FormItem, FormLabel, FormControl, FormMessage, FormDescription, FormField } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";

export default function UserInfo() {
	const { control } = useFormContext();

	return (
		<>
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">User Signup</h2>
			<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-400">Complete the form below to create your user account.</p>
			<div className="flex flex-col mt-6 space-y-6">
				<FormField
					control={control}
					name="userInfo.firstName"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>
								First name <span className="text-red-500">*</span>
							</FormLabel>
							<FormControl>
								<Input {...field} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
							</FormControl>
							<FormMessage>{fieldState.error?.message}</FormMessage>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="userInfo.lastName"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>
								Last name <span className="text-red-500">*</span>
							</FormLabel>
							<FormControl>
								<Input {...field} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
							</FormControl>
							<FormMessage>{fieldState.error?.message}</FormMessage>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="userInfo.phoneNumber"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>
								Phone Number <span className="text-red-500">*</span>
							</FormLabel>
							<FormDescription>We use your phone number for account authentication</FormDescription>
							<FormControl>
								<Input {...field} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
							</FormControl>
							<FormMessage>{fieldState.error?.message}</FormMessage>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="userInfo.email"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>
								Email <span className="text-red-500">*</span>
							</FormLabel>
							<FormDescription>We don&apos;t use your email for marketing</FormDescription>
							<FormControl>
								<Input {...field} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
							</FormControl>
							<FormMessage>{fieldState.error?.message}</FormMessage>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="userInfo.howFound"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>How did you find us?</FormLabel>
							<FormDescription>Select an option that best describes how you found us.</FormDescription>
							<FormControl>
								<Select onValueChange={field.onChange} defaultValue="nosay">
									<SelectTrigger className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
										<SelectValue placeholder="Select an option" />
									</SelectTrigger>
									<SelectContent className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900">
										<SelectItem value="nosay">Prefer not to say</SelectItem>
										<SelectItem value="google">Google</SelectItem>
										<SelectItem value="friend">Friend</SelectItem>
										<SelectItem value="social">Social Media</SelectItem>
										<SelectItem value="advertisement">Advertisement</SelectItem>
										<SelectItem value="other">Other</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage>{fieldState.error?.message}</FormMessage>
						</FormItem>
					)}
				/>
			</div>
		</>
	);
}
