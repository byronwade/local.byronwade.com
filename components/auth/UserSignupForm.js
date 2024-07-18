"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

const phoneNumberSchema = z.string().regex(/^(\+1|1)?\s*\-?\s*(\([2-9][0-9]{2}\)|[2-9][0-9]{2})\s*\-?\s*[2-9][0-9]{2}\s*\-?\s*[0-9]{4}$/, { message: "Invalid phone number" });

const addressSchema = z.object({
	street: z.string().nonempty({ message: "Street is required" }),
	city: z.string().nonempty({ message: "City is required" }),
	state: z.string().nonempty({ message: "State is required" }),
	zip: z.string().regex(/^\d{5}$/, { message: "Invalid ZIP code. Must be 5 digits." }),
});

const userSignupSchema = z.object({
	firstName: z.string().nonempty({ message: "First name is required" }),
	lastName: z.string().nonempty({ message: "Last name is required" }),
	phoneNumber: phoneNumberSchema,
	email: z.string().email({ message: "Invalid email address" }),
	address: addressSchema,
});

export function UserSignupForm() {
	const form = useForm({
		resolver: zodResolver(userSignupSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			phoneNumber: "",
			email: "",
			address: { street: "", city: "", state: "", zip: "" },
		},
	});

	const [currentStep, setCurrentStep] = useState(0);

	const handleNext = async () => {
		const valid = await form.trigger([currentStep === 0 ? "firstName" : "", currentStep === 0 ? "lastName" : "", currentStep === 0 ? "phoneNumber" : "", currentStep === 1 ? "email" : "", currentStep === 1 ? "address.street" : "", currentStep === 1 ? "address.city" : "", currentStep === 1 ? "address.state" : "", currentStep === 1 ? "address.zip" : ""].filter(Boolean));
		if (valid) {
			setCurrentStep((prev) => Math.min(prev + 1, 2));
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

	const watchFields = watch(["firstName", "lastName", "phoneNumber", "email", "address.street", "address.city", "address.state", "address.zip"]);

	const isStep0Valid = watchFields[0] && watchFields[1] && watchFields[2];
	const isStep1Valid = watchFields[3] && watchFields[4] && watchFields[5] && watchFields[6] && watchFields[7];

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
				<div>
					<div className="text-center">
						<h2 className="text-3xl font-bold">Let&apos;s sign you up</h2>
					</div>
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
								</div>
							)}

							{currentStep === 2 && (
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
											<Button variant="link" size="sm" onClick={() => setCurrentStep(1)}>
												Edit
											</Button>
										</div>
										<div className="flex items-center col-span-2">
											<div>
												<span className="block font-semibold">Address:</span>
												<span>{`${watchFields[4] || ""}, ${watchFields[5] || ""}, ${watchFields[6] || ""} ${watchFields[7] || ""}`}</span>
											</div>
										</div>
										<div className="flex items-center justify-end">
											<Button variant="link" size="sm" onClick={() => setCurrentStep(1)}>
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
								{currentStep < 2 ? (
									<Button
										type="button"
										onClick={async () => {
											const valid = await form.trigger([currentStep === 0 ? "firstName" : "", currentStep === 0 ? "lastName" : "", currentStep === 0 ? "phoneNumber" : "", currentStep === 1 ? "email" : "", currentStep === 1 ? "address.street" : "", currentStep === 1 ? "address.city" : "", currentStep === 1 ? "address.state" : "", currentStep === 1 ? "address.zip" : ""].filter(Boolean));
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
						<AlertTitle>Contractors/Service Providers</AlertTitle>
						<AlertDescription>
							If you are a contractor looking for work, please go to the{" "}
							<Link href="/pro-signup" className="underline">
								Pro Signup Form
							</Link>
						</AlertDescription>
					</Alert>
				</div>
			</div>
		</div>
	);
}

export default UserSignupForm;
