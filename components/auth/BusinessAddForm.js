"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { Progress } from "@components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import Link from "next/link";

const services = [
	{ value: "plumbing", label: "Plumbing" },
	{ value: "water_heater_installation", label: "Water Heater Installation" },
	// Add more services as needed
];

const phoneNumberSchema = z.string().regex(/^(\+1|1)?\s*\-?\s*(\([2-9][0-9]{2}\)|[2-9][0-9]{2})\s*\-?\s*[2-9][0-9]{2}\s*\-?\s*[0-9]{4}$/, { message: "Invalid phone number" });
const websiteSchema = z.string().url({ message: "Invalid URL" }).optional();

const addressSchema = z.object({
	street: z.string().nonempty({ message: "Street is required" }),
	city: z.string().nonempty({ message: "City is required" }),
	state: z.string().nonempty({ message: "State is required" }),
	zip: z.string().regex(/^\d{5}$/, { message: "Invalid ZIP code. Must be 5 digits." }),
});

const submissionSchema = z.object({
	businessName: z.string().nonempty({ message: "Business name is required" }),
	service: z.string().optional(),
	businessPhoneNumber: phoneNumberSchema,
	email: z.string().email({ message: "Invalid email address" }).optional(),
	website: websiteSchema,
	address: addressSchema,
	hoursOfOperation: z.string().optional(),
	socialMediaLinks: z
		.object({
			facebook: websiteSchema,
			twitter: websiteSchema,
			instagram: websiteSchema,
			linkedin: websiteSchema,
		})
		.optional(),
});

const leadsData = { leads: 2416 };

export function BusinessSubmissionForm() {
	const form = useForm({
		resolver: zodResolver(submissionSchema),
		defaultValues: {
			businessName: "",
			service: "",
			businessPhoneNumber: "",
			email: "",
			website: "",
			address: { street: "", city: "", state: "", zip: "" },
			hoursOfOperation: "",
			socialMediaLinks: { facebook: "", twitter: "", instagram: "", linkedin: "" },
		},
	});

	const [currentStep, setCurrentStep] = useState(0);

	const handleNext = async () => {
		const valid = await form.trigger(
			[
				currentStep === 0 ? "businessName" : "",
				currentStep === 0 ? "service" : "",
				currentStep === 0 ? "businessPhoneNumber" : "",
				currentStep === 0 ? "email" : "",
				currentStep === 0 ? "website" : "",
				currentStep === 1 ? "address.street" : "",
				currentStep === 1 ? "address.city" : "",
				currentStep === 1 ? "address.state" : "",
				currentStep === 1 ? "address.zip" : "",
				currentStep === 2 ? "hoursOfOperation" : "",
				currentStep === 2 ? "socialMediaLinks.facebook" : "",
				currentStep === 2 ? "socialMediaLinks.twitter" : "",
				currentStep === 2 ? "socialMediaLinks.instagram" : "",
				currentStep === 2 ? "socialMediaLinks.linkedin" : "",
			].filter(Boolean)
		);
		if (valid) {
			setCurrentStep((prev) => Math.min(prev + 1, 3));
		}
	};

	const handlePrevious = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 0));
	};

	const handleSubmission = async (values) => {
		console.log("Submission values:", values);
		// Add your submission logic here
	};

	const {
		watch,
		trigger,
		formState: { errors, touchedFields },
	} = form;

	const watchFields = watch(["businessName", "service", "businessPhoneNumber", "email", "website", "address.street", "address.city", "address.state", "address.zip", "hoursOfOperation", "socialMediaLinks.facebook", "socialMediaLinks.twitter", "socialMediaLinks.instagram", "socialMediaLinks.linkedin"]);

	const isStep0Valid = watchFields[0] && watchFields[2];
	const isStep1Valid = watchFields[5] && watchFields[6] && watchFields[7] && watchFields[8];

	const progress = ((currentStep + 1) / 3) * 100;

	const getValidationClass = (fieldName) => {
		if (errors[fieldName]) {
			return "border-red-500";
		}
		if (touchedFields[fieldName] && !errors[fieldName]) {
			return "border-green-500";
		}
		return "";
	};

	return (
		<div className="max-w-lg mx-auto mt-6 md:mt-10">
			<div>
				<div className="text-center">
					<h2 className="text-3xl font-bold">Submit Your Business</h2>
					<p className="text-muted-foreground">{leadsData.leads} leads looking for businesses like yours last month.</p>
				</div>
				<div className="mt-4">
					<h3 className="mb-1 text-sm">Form Progress</h3>
					<Progress value={progress} className="w-full h-2 mb-4 text-brand" />
				</div>
				<div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleSubmission)} className="space-y-4">
							{currentStep === 0 && (
								<div className="space-y-4">
									<FormField
										control={form.control}
										name="businessName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Business Name <span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<Input {...field} placeholder="Business Name" className={getValidationClass("businessName")} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="service"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Service Offered</FormLabel>
												<Select onValueChange={field.onChange} defaultValue={field.value}>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Select service..." />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{services.map((service) => (
															<SelectItem key={service.value} value={service.value}>
																{service.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="businessPhoneNumber"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Business Phone Number <span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<Input {...field} placeholder="xxx-xxx-xxxx" className={getValidationClass("businessPhoneNumber")} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input {...field} placeholder="Email" className={getValidationClass("email")} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="website"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Website</FormLabel>
												<FormControl>
													<Input {...field} placeholder="https://yourwebsite.com" className={getValidationClass("website")} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							)}
							{currentStep === 1 && (
								<div className="space-y-4">
									<FormField
										control={form.control}
										name="address.street"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Street <span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<Input {...field} placeholder="Street" className={getValidationClass("address.street")} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="address.city"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													City <span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<Input {...field} placeholder="City" className={getValidationClass("address.city")} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="address.state"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													State <span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<Input {...field} placeholder="State" className={getValidationClass("address.state")} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="address.zip"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													ZIP Code <span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<Input {...field} placeholder="ZIP Code" className={getValidationClass("address.zip")} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							)}
							{currentStep === 2 && (
								<div className="space-y-4">
									<FormField
										control={form.control}
										name="hoursOfOperation"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Hours of Operation</FormLabel>
												<FormControl>
													<Input {...field} placeholder="e.g., Mon-Fri: 9am - 5pm" className={getValidationClass("hoursOfOperation")} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="socialMediaLinks.facebook"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Facebook</FormLabel>
												<FormControl>
													<Input {...field} placeholder="https://facebook.com/yourpage" className={getValidationClass("socialMediaLinks.facebook")} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="socialMediaLinks.twitter"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Twitter</FormLabel>
												<FormControl>
													<Input {...field} placeholder="https://twitter.com/yourhandle" className={getValidationClass("socialMediaLinks.twitter")} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="socialMediaLinks.instagram"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Instagram</FormLabel>
												<FormControl>
													<Input {...field} placeholder="https://instagram.com/yourhandle" className={getValidationClass("socialMediaLinks.instagram")} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="socialMediaLinks.linkedin"
										render={({ field }) => (
											<FormItem>
												<FormLabel>LinkedIn</FormLabel>
												<FormControl>
													<Input {...field} placeholder="https://linkedin.com/company/yourpage" className={getValidationClass("socialMediaLinks.linkedin")} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							)}

							{currentStep === 3 && (
								<div className="space-y-4">
									<h2 className="mb-4 text-lg font-bold">Review Your Information</h2>
									<div className="grid grid-cols-3 gap-4 text-sm">
										<div className="flex items-center col-span-2">
											<div>
												<span className="block font-semibold">Business Name:</span>
												<span>{watchFields[0]}</span>
											</div>
										</div>
										<div className="flex items-center justify-end">
											<Button variant="link" size="sm" onClick={() => setCurrentStep(0)}>
												Edit
											</Button>
										</div>
										<div className="flex items-center col-span-2">
											<div>
												<span className="block font-semibold">Service Offered:</span>
												<span>{services.find((service) => service.value === watchFields[1])?.label}</span>
											</div>
										</div>
										<div className="flex items-center justify-end">
											<Button variant="link" size="sm" onClick={() => setCurrentStep(0)}>
												Edit
											</Button>
										</div>
										<div className="flex items-center col-span-2">
											<div>
												<span className="block font-semibold">Business Phone Number:</span>
												<span>{watchFields[2]}</span>
											</div>
										</div>
										<div className="flex items-center justify-end">
											<Button variant="link" size="sm" onClick={() => setCurrentStep(0)}>
												Edit
											</Button>
										</div>
										<div className="flex items-center col-span-2">
											<div>
												<span className="block font-semibold">Email:</span>
												<span>{watchFields[3]}</span>
											</div>
										</div>
										<div className="flex items-center justify-end">
											<Button variant="link" size="sm" onClick={() => setCurrentStep(0)}>
												Edit
											</Button>
										</div>
										<div className="flex items-center col-span-2">
											<div>
												<span className="block font-semibold">Website:</span>
												<span>{watchFields[4]}</span>
											</div>
										</div>
										<div className="flex items-center justify-end">
											<Button variant="link" size="sm" onClick={() => setCurrentStep(0)}>
												Edit
											</Button>
										</div>
										<div className="flex items-center col-span-2">
											<div>
												<span className="block font-semibold">Address:</span>
												<span>{`${watchFields[5] || ""}, ${watchFields[6] || ""}, ${watchFields[7] || ""} ${watchFields[8] || ""}`}</span>
											</div>
										</div>
										<div className="flex items-center justify-end">
											<Button variant="link" size="sm" onClick={() => setCurrentStep(1)}>
												Edit
											</Button>
										</div>
										<div className="flex items-center col-span-2">
											<div>
												<span className="block font-semibold">Hours of Operation:</span>
												<span>{watchFields[9]}</span>
											</div>
										</div>
										<div className="flex items-center justify-end">
											<Button variant="link" size="sm" onClick={() => setCurrentStep(2)}>
												Edit
											</Button>
										</div>
										<div className="flex items-center col-span-2">
											<div>
												<span className="block font-semibold">Facebook:</span>
												<span>{watchFields[10]}</span>
											</div>
										</div>
										<div className="flex items-center justify-end">
											<Button variant="link" size="sm" onClick={() => setCurrentStep(2)}>
												Edit
											</Button>
										</div>
										<div className="flex items-center col-span-2">
											<div>
												<span className="block font-semibold">Twitter:</span>
												<span>{watchFields[11]}</span>
											</div>
										</div>
										<div className="flex items-center justify-end">
											<Button variant="link" size="sm" onClick={() => setCurrentStep(2)}>
												Edit
											</Button>
										</div>
										<div className="flex items-center col-span-2">
											<div>
												<span className="block font-semibold">Instagram:</span>
												<span>{watchFields[12]}</span>
											</div>
										</div>
										<div className="flex items-center justify-end">
											<Button variant="link" size="sm" onClick={() => setCurrentStep(2)}>
												Edit
											</Button>
										</div>
										<div className="flex items-center col-span-2">
											<div>
												<span className="block font-semibold">LinkedIn:</span>
												<span>{watchFields[13]}</span>
											</div>
										</div>
										<div className="flex items-center justify-end">
											<Button variant="link" size="sm" onClick={() => setCurrentStep(2)}>
												Edit
											</Button>
										</div>
									</div>
									<Button type="submit" variant="brand" className="w-full mt-4">
										Submit
									</Button>
								</div>
							)}
							<div className="flex justify-between">
								{currentStep > 0 && (
									<Button type="button" variant="secondary" onClick={handlePrevious} className="w-full mr-2">
										Back
									</Button>
								)}
								{currentStep < 3 ? (
									<Button
										type="button"
										onClick={async () => {
											const valid = await form.trigger(
												[
													currentStep === 0 ? "businessName" : "",
													currentStep === 0 ? "service" : "",
													currentStep === 0 ? "businessPhoneNumber" : "",
													currentStep === 0 ? "email" : "",
													currentStep === 0 ? "website" : "",
													currentStep === 1 ? "address.street" : "",
													currentStep === 1 ? "address.city" : "",
													currentStep === 1 ? "address.state" : "",
													currentStep === 1 ? "address.zip" : "",
													currentStep === 2 ? "hoursOfOperation" : "",
													currentStep === 2 ? "socialMediaLinks.facebook" : "",
													currentStep === 2 ? "socialMediaLinks.twitter" : "",
													currentStep === 2 ? "socialMediaLinks.instagram" : "",
													currentStep === 2 ? "socialMediaLinks.linkedin" : "",
												].filter(Boolean)
											);
											if (valid) {
												handleNext();
											}
										}}
										className="w-full bg-brand"
										disabled={(currentStep === 0 && !isStep0Valid) || (currentStep === 1 && !isStep1Valid)}
									>
										Next
									</Button>
								) : null}
							</div>
						</form>
					</Form>

					<Alert className="mt-4 text-black bg-orange-300">
						<AlertTitle>Homeowners</AlertTitle>
						<AlertDescription>
							If you are a homeowner looking for a contractor, please go to the{" "}
							<Link href="/signup" className="underline">
								User Signup Form
							</Link>
						</AlertDescription>
					</Alert>
				</div>
			</div>
		</div>
	);
}

export default BusinessSubmissionForm;
