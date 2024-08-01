import React from "react";
import { useFormContext } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";

export default function UserProfile() {
	const { control } = useFormContext();

	return (
		<>
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">User Profile</h2>
			<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-400">Complete the form below to add your profile picture and username.</p>
			<div className="flex flex-col mt-6 space-y-6">
				<FormField
					control={control}
					name="userProfile.image"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Profile Picture</FormLabel>
							<FormControl>
								<div className="flex items-center space-x-4">
									<Avatar className="w-16 h-16 bg-white border border-gray-300 rounded-md cursor-pointer dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
										<AvatarImage src={field.value ? URL.createObjectURL(field.value) : "https://github.com/shadcn.png"} alt="Profile" />
										<AvatarFallback className="text-2xl rounded-md">CN</AvatarFallback>
									</Avatar>
									<label htmlFor="image-upload" className="p-2 text-sm bg-white border border-gray-300 rounded-md cursor-pointer dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
										<span className="text-blue-500">Click here to add image</span>
										<input id="image-upload" type="file" accept="image/*" className="hidden" onChange={(e) => field.onChange(e.target.files[0])} />
									</label>
								</div>
							</FormControl>
							<FormMessage>{field.error?.message}</FormMessage>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="userProfile.username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Username <span className="text-red-500">*</span>
							</FormLabel>
							<FormControl>
								<Input {...field} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
							</FormControl>
							<FormMessage>{field.error?.message}</FormMessage>
						</FormItem>
					)}
				/>
			</div>
		</>
	);
}
