import React, { useState } from "react";
import Image from "next/image";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";

const userProfileSchema = z.object({
	image: z.any().optional(),
	username: z.string().nonempty({ message: "Username is required" }),
});

export default function UserProfile() {
	const formMethods = useForm({
		resolver: zodResolver(userProfileSchema),
		defaultValues: {
			username: "",
			image: null,
		},
	});

	const [imageUrl, setImageUrl] = useState(null);
	const [loading, setLoading] = useState(false);

	const onSubmit = (values) => {
		console.log(values);
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setLoading(true);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImageUrl(reader.result);
				formMethods.setValue("image", file);
				setLoading(false);
			};
			reader.readAsDataURL(file);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center w-full">
				<Image src="/ThorbisLogo.webp" alt="Thorbis Logo" width={100} height={100} className="w-[60px] h-[60px] animate-breathe" />
			</div>
		);
	}

	return (
		<>
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">User Profile</h2>
			<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-400">Complete the form below to add your profile picture and username.</p>
			<div className="flex flex-col mt-6">
				<FormProvider {...formMethods}>
					<Form {...formMethods}>
						<form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-10">
							<FormField
								control={formMethods.control}
								name="image"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Profile Picture</FormLabel>
										<FormControl>
											<div className="flex items-center space-x-4">
												<Avatar className="w-16 h-16 bg-white border border-gray-300 rounded-md cursor-pointer dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
													{loading ? (
														<div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full">
															<div className="loader"></div>
														</div>
													) : (
														<AvatarImage src={imageUrl || "https://github.com/shadcn.png"} alt="Profile" />
													)}
													<AvatarFallback className="text-2xl rounded-md">CN</AvatarFallback>
												</Avatar>
												<label htmlFor="image-upload" className="p-2 text-sm bg-white border border-gray-300 rounded-md cursor-pointer dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
													<span className="text-blue-500">Click here to add image</span>
													<input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
												</label>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={formMethods.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
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
