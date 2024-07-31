import React, { useState } from "react";
import Image from "next/image";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@components/ui/form";
import { Slider } from "@components/ui/slider";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@components/ui/select";

const businessProfileSchema = z.object({
	logo: z.any().optional(),
	services: z.string().nonempty({ message: "At least one service is required" }),
	serviceArea: z.number().min(1, { message: "Service area must be at least 1 mile" }).max(100, { message: "Service area can't exceed 100 miles" }),
});

const servicesOptions = [
	{ value: "plumbing", label: "Plumbing" },
	{ value: "electrical", label: "Electrical" },
	{ value: "hvac", label: "HVAC" },
	{ value: "landscaping", label: "Landscaping" },
	{ value: "cleaning", label: "Cleaning" },
	{ value: "pestControl", label: "Pest Control" },
];

export default function BusinessProfile() {
	const formMethods = useForm({
		resolver: zodResolver(businessProfileSchema),
		defaultValues: {
			logo: null,
			services: "",
			serviceArea: 1,
		},
	});

	const [logoUrl, setLogoUrl] = useState(null);
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
				setLogoUrl(reader.result);
				formMethods.setValue("logo", file);
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
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">Business Profile</h2>
			<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-400">Complete the form below to provide your business information.</p>
			<div className="flex flex-col mt-6">
				<FormProvider {...formMethods}>
					<Form {...formMethods}>
						<form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-10">
							<FormField
								control={formMethods.control}
								name="logo"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Business Logo <span className="text-xs font-normal">(Optional)</span>
										</FormLabel>
										<FormControl>
											<div className="flex items-center space-x-4">
												<Avatar className="w-16 h-16 bg-white border border-gray-300 rounded-md cursor-pointer dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
													{loading ? (
														<div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full">
															<div className="loader"></div>
														</div>
													) : (
														<AvatarImage src={logoUrl || "https://github.com/shadcn.png"} alt="Business Logo" />
													)}
													<AvatarFallback className="rounded-md">Logo</AvatarFallback>
												</Avatar>
												<label htmlFor="logo-upload" className="p-2 text-sm bg-white border border-gray-300 rounded-md cursor-pointer dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
													<span className="text-blue-500">Click here to add image</span>
													<input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
												</label>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={formMethods.control}
								name="services"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Services <span className="text-red-500">*</span>
										</FormLabel>
										<FormDescription>Select the services your business offers.</FormDescription>
										<FormControl>
											<Select onValueChange={field.onChange}>
												<SelectTrigger className="w-full bg-white border border-gray-300 rounded-md cursor-pointer dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
													<SelectValue placeholder="Select service..." />
												</SelectTrigger>
												<SelectContent className="bg-white border border-gray-300 rounded-md cursor-pointer dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
													<SelectGroup>
														<SelectLabel>Services</SelectLabel>
														{servicesOptions.map((service) => (
															<SelectItem key={service.value} value={service.value}>
																{service.label}
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={formMethods.control}
								name="serviceArea"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Service Area (miles) <span className="text-red-500">*</span>
										</FormLabel>
										<FormDescription>Specify the radius within which your business operates.</FormDescription>
										<FormControl>
											<Slider defaultValue={[50]} min={5} max={100} step={1} className="w-full bg-white border border-gray-300 rounded-md cursor-pointer dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" onValueChange={(val) => formMethods.setValue("serviceArea", val[0])} />
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
