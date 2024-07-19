"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

const services = [
	{ value: "plumbing", label: "Plumbing" },
	{ value: "water_heater_installation", label: "Water Heater Installation" },
];

const phoneNumberSchema = z.string().regex(/^(\+1|1)?\s*\-?\s*(\([2-9][0-9]{2}\)|[2-9][0-9]{2})\s*\-?\s*[2-9][0-9]{2}\s*\-?\s*[0-9]{4}$/, { message: "Invalid phone number" });
const einSchema = z.string().regex(/^\d{2}-\d{7}$/, { message: "Invalid EIN format. Must be XX-XXXXXXX." });

const addressSchema = z.object({
	street: z.string().nonempty({ message: "Street is required" }),
	city: z.string().nonempty({ message: "City is required" }),
	state: z.string().nonempty({ message: "State is required" }),
	zip: z.string().regex(/^\d{5}$/, { message: "Invalid ZIP code. Must be 5 digits." }),
});

const signupSchema = z.object({
	firstName: z.string().nonempty({ message: "First name is required" }),
	lastName: z.string().nonempty({ message: "Last name is required" }),
	businessName: z.string().nonempty({ message: "Business name is required" }),
	service: z.string().nonempty({ message: "Service is required" }),
	phoneNumber: phoneNumberSchema,
	businessPhoneNumber: phoneNumberSchema,
	email: z.string().email({ message: "Invalid email address" }),
	address: addressSchema,
	ein: einSchema,
	serviceArea: z.number().min(1, { message: "Service area must be at least 1 mile" }).max(100, { message: "Service area can't exceed 100 miles" }),
	proofOfOwnership: z.array(z.any()).refine((files) => files.length > 0, { message: "Proof of ownership is required" }),
	insurance: z.array(z.any()).refine((files) => files.length > 0, { message: "Company insurance is required" }),
});

const leadsData = { leads: 2416 };

export function BusinessSignupForm() {
	const form = useForm({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			businessName: "",
			service: "",
			phoneNumber: "",
			businessPhoneNumber: "",
			email: "",
			address: { street: "", city: "", state: "", zip: "" },
			ein: "",
			serviceArea: 50,
			proofOfOwnership: [],
			insurance: [],
		},
	});

	const [currentStep, setCurrentStep] = useState(0);

	const handleNext = async () => {
		const valid = await form.trigger(
			[
				currentStep === 0 ? "firstName" : "",
				currentStep === 0 ? "lastName" : "",
				currentStep === 0 ? "phoneNumber" : "",
				currentStep === 1 ? "businessName" : "",
				currentStep === 1 ? "service" : "",
				currentStep === 1 ? "businessPhoneNumber" : "",
				currentStep === 1 ? "email" : "",
				currentStep === 1 ? "address.street" : "",
				currentStep === 1 ? "address.city" : "",
				currentStep === 1 ? "address.state" : "",
				currentStep === 1 ? "address.zip" : "",
				currentStep === 1 ? "ein" : "",
				currentStep === 1 ? "serviceArea" : "",
				currentStep === 2 ? "proofOfOwnership" : "",
				currentStep === 2 ? "insurance" : "",
			].filter(Boolean)
		);
		if (valid) {
			setCurrentStep((prev) => Math.min(prev + 1, 3));
		}
	};

	const handlePrevious = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 0));
	};

	const handleSignup = async (values) => {
		console.log("Signup values:", values);
		// Add your signup logic here
	};

	const {
		watch,
		trigger,
		formState: { errors, touchedFields },
	} = form;

	const watchFields = watch(["firstName", "lastName", "businessName", "service", "phoneNumber", "businessPhoneNumber", "email", "address.street", "address.city", "address.state", "address.zip", "ein", "serviceArea", "proofOfOwnership", "insurance"]);

	const isStep0Valid = watchFields[0] && watchFields[1] && watchFields[4];
	const isStep1Valid = watchFields[2] && watchFields[3] && watchFields[5] && watchFields[6] && watchFields[7] && watchFields[8] && watchFields[9] && watchFields[10] && watchFields[11];
	const isStep2Valid = watchFields[12] && watchFields[13];

	const progress = ((currentStep + 1) / 4) * 100;

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
					<h2 className="text-3xl font-bold">Let&apos;s sign you up</h2>
					<p className="text-muted-foreground">{leadsData.leads} leads looking for business like you last month.</p>
				</div>
				<div className="mt-4">
					<h3 className="mb-1 text-sm">Form Progress</h3>
					<Progress value={progress} className="w-full h-2 mb-4 text-brand" />
				</div>
				<div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleSignup)} className="space-y-4">
							{currentStep === 0 && (
								<div className="space-y-4">
									<div className="flex space-x-4">
										<FormField
											control={form.control}
											name="firstName"
											render={({ field }) => (
												<FormItem className="flex-1">
													<FormLabel>First Name</FormLabel>
													<FormControl>
														<Input {...field} placeholder="First Name" className={getValidationClass("firstName")} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="lastName"
											render={({ field }) => (
												<FormItem className="flex-1">
													<FormLabel>Last Name</FormLabel>
													<FormControl>
														<Input {...field} placeholder="Last Name" className={getValidationClass("lastName")} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormField
										control={form.control}
										name="phoneNumber"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Mobile Number</FormLabel>
												<FormControl>
													<Input {...field} placeholder="xxx-xxx-xxxx" className={getValidationClass("phoneNumber")} />
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
										name="businessName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Business Name</FormLabel>
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
												<FormLabel>Business Phone Number</FormLabel>
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
										name="address.street"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Street</FormLabel>
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
												<FormLabel>City</FormLabel>
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
												<FormLabel>State</FormLabel>
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
												<FormLabel>ZIP Code</FormLabel>
												<FormControl>
													<Input {...field} placeholder="ZIP Code" className={getValidationClass("address.zip")} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="ein"
										render={({ field }) => (
											<FormItem>
												<FormLabel>EIN</FormLabel>
												<FormControl>
													<Input {...field} placeholder="XX-XXXXXXX" className={getValidationClass("ein")} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="serviceArea"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Service Area (miles)</FormLabel>
												<FormControl>
													<Slider defaultValue={[50]} max={100} step={1} value={[field.value]} onValueChange={(val) => field.onChange(val[0])} className="w-full" />
												</FormControl>
												<FormMessage />
												<div className="mt-2 text-center">Service area from your business location: {field.value} miles</div>
											</FormItem>
										)}
									/>
								</div>
							)}
							{currentStep === 2 && (
								<div className="space-y-4">
									<FormField
										control={form.control}
										name="proofOfOwnership"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Proof of Company Ownership</FormLabel>
												<FormControl>
													<Input type="file" onChange={(e) => form.setValue("proofOfOwnership", Array.from(e.target.files))} className={getValidationClass("proofOfOwnership")} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="insurance"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Company Insurance</FormLabel>
												<FormControl>
													<Input type="file" onChange={(e) => form.setValue("insurance", Array.from(e.target.files))} className={getValidationClass("insurance")} />
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
												<span className="block font-semibold">First Name:</span>
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
												<span className="block font-semibold">Last Name:</span>
												<span>{watchFields[1]}</span>
											</div>
										</div>
										<div className="flex items-center justify-end">
											<Button variant="link" size="sm" onClick={() => setCurrentStep(0)}>
												Edit
											</Button>
										</div>
										<div className="flex items-center col-span-2">
											<div>
												<span className="block font-semibold">Mobile Number:</span>
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
												<span className="block font-semibold">Business Name:</span>
												<span>{watchFields[2]}</span>
											</div>
										</div>
										<div className="flex items-center justify-end">
											<Button variant="link" size="sm" onClick={() => setCurrentStep(1)}>
												Edit
											</Button>
										</div>
										<div className="flex items-center col-span-2">
											<div>
												<span className="block font-semibold">Service Offered:</span>
												<span>{services.find((service) => service.value === watchFields[3])?.label}</span>
											</div>
										</div>
										<div className="flex items-center justify-end">
											<Button variant="link" size="sm" onClick={() => setCurrentStep(1)}>
												Edit
											</Button>
										</div>
										<div className="flex items-center col-span-2">
											<div>
												<span className="block font-semibold">Business Phone Number:</span>
												<span>{watchFields[5]}</span>
											</div>
										</div>
										<div className="flex items-center justify-end">
											<Button variant="link" size="sm" onClick={() => setCurrentStep(1)}>
												Edit
											</Button>
										</div>
										<div className="flex items-center col-span-2">
											<div>
												<span className="block font-semibold">Email:</span>
												<span>{watchFields[6]}</span>
											</div>
										</div>
										<div className="flex items-center justify-end">
											<Button variant="link" size="sm" onClick={() => setCurrentStep(1)}>
												Edit
											</Button>
										</div>
										<div className="flex items-center col-span-2">
											<div>
												<span className="block font-semibold">Address:</span>
												<span>{`${watchFields[7] || ""}, ${watchFields[8] || ""}, ${watchFields[9] || ""} ${watchFields[10] || ""}`}</span>
											</div>
										</div>
										<div className="flex items-center justify-end">
											<Button variant="link" size="sm" onClick={() => setCurrentStep(1)}>
												Edit
											</Button>
										</div>
										<div className="flex items-center col-span-2">
											<div>
												<span className="block font-semibold">EIN:</span>
												<span>{watchFields[11]}</span>
											</div>
										</div>
										<div className="flex items-center justify-end">
											<Button variant="link" size="sm" onClick={() => setCurrentStep(1)}>
												Edit
											</Button>
										</div>
										<div className="flex items-center col-span-2">
											<div>
												<span className="block font-semibold">Service Area:</span>
												<span>{watchFields[12]} miles</span>
											</div>
										</div>
										<div className="flex items-center justify-end">
											<Button variant="link" size="sm" onClick={() => setCurrentStep(1)}>
												Edit
											</Button>
										</div>
										<div className="flex items-center col-span-2">
											<div>
												<span className="block font-semibold">Proof of Company Ownership:</span>
												<span>{watchFields[13]?.[0]?.name}</span>
											</div>
										</div>
										<div className="flex items-center justify-end">
											<Button variant="link" size="sm" onClick={() => setCurrentStep(2)}>
												Edit
											</Button>
										</div>
										<div className="flex items-center col-span-2">
											<div>
												<span className="block font-semibold">Company Insurance:</span>
												<span>{watchFields[14]?.[0]?.name}</span>
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
													currentStep === 0 ? "firstName" : "",
													currentStep === 0 ? "lastName" : "",
													currentStep === 0 ? "phoneNumber" : "",
													currentStep === 1 ? "businessName" : "",
													currentStep === 1 ? "service" : "",
													currentStep === 1 ? "businessPhoneNumber" : "",
													currentStep === 1 ? "email" : "",
													currentStep === 1 ? "address.street" : "",
													currentStep === 1 ? "address.city" : "",
													currentStep === 1 ? "address.state" : "",
													currentStep === 1 ? "address.zip" : "",
													currentStep === 1 ? "ein" : "",
													currentStep === 1 ? "serviceArea" : "",
													currentStep === 2 ? "proofOfOwnership" : "",
													currentStep === 2 ? "insurance" : "",
												].filter(Boolean)
											);
											if (valid) {
												handleNext();
											}
										}}
										className="w-full bg-brand"
										disabled={(currentStep === 0 && !isStep0Valid) || (currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid)}
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

export default BusinessSignupForm;
