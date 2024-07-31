"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Progress } from "@components/ui/progress";
import Link from "next/link";
import useAuthStore from "@store/useAuthStore";
import useFormStore from "@store/useFormStore";

const phoneNumberSchema = z.string().regex(/^(\+1|1)?\s*\-?\s*(\([2-9][0-9]{2}\)|[2-9][0-9]{2})\s*\-?\s*[2-9][0-9]{2}\s*\-?\s*[0-9]{4}$/, { message: "Invalid phone number" });

const addressSchema = z.object({
	street: z.string().nonempty({ message: "Street is required" }),
	city: z.string().nonempty({ message: "City is required" }),
	state: z.string().nonempty({ message: "State is required" }),
	zip: z.string().regex(/^\d{5}$/, { message: "Invalid ZIP code. Must be 5 digits." }),
});

const userSignupSchema = z.object({
	username: z.string().nonempty({ message: "Username is required" }),
	first_name: z.string().nonempty({ message: "First name is required" }),
	last_name: z.string().nonempty({ message: "Last name is required" }),
	phone_number: phoneNumberSchema,
	email: z.string().email({ message: "Invalid email address" }),
	password: z.string().min(6, { message: "Password must be at least 6 characters" }),
	address: addressSchema,
});

export function UserSignupForm() {
	const form = useForm({
		resolver: zodResolver(userSignupSchema),
		defaultValues: {
			username: "",
			first_name: "",
			last_name: "",
			phone_number: "",
			email: "",
			password: "",
			address: { street: "", city: "", state: "", zip: "" },
		},
	});

	const [currentStep, setCurrentStep] = useState(0);
	const [signupError, setSignupError] = useState("");
	const [signupSuccess, setSignupSuccess] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formVisible, setFormVisible] = useState(true);

	const { signup } = useAuthStore((state) => ({
		signup: state.signup,
	}));

	const handleNext = async () => {
		const fieldsToValidate = currentStep === 0 ? ["username", "first_name", "last_name", "phone_number"] : ["email", "password", "address.street", "address.city", "address.state", "address.zip"];

		const valid = await form.trigger(fieldsToValidate);
		if (valid) {
			setCurrentStep((prev) => Math.min(prev + 1, 2));
		}
	};

	const handlePrevious = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 0));
	};

	const handleSignup = async (values) => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			console.log("Submitting signup form with values:", values);

			await signup(values);
			setSignupSuccess("Signup successful! Please check your email for verification.");
			setSignupError("");
			setFormVisible(false);
		} catch (error) {
			console.error("Signup error:", error);
			if (error.message === "User already exists") {
				setSignupError("User already exists. Please try logging in.");
			} else {
				setSignupError("An error occurred during signup. Please try again.");
			}
			setSignupSuccess("");
		} finally {
			setIsSubmitting(false);
		}
	};

	const {
		watch,
		formState: { errors, touchedFields },
	} = form;

	const watchFields = watch(["username", "first_name", "last_name", "phone_number", "email", "password", "address.street", "address.city", "address.state", "address.zip"]);

	const isStep0Valid = watchFields[0] && watchFields[1] && watchFields[2] && watchFields[3];
	const isStep1Valid = watchFields[4] && watchFields[5] && watchFields[6] && watchFields[7] && watchFields[8] && watchFields[9];

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
				{formVisible && (
					<div>
						<div className="text-center">
							<h2 className="text-3xl font-bold">Let's sign you up</h2>
						</div>
						<h3 className="mb-1 text-sm">Form Progress</h3>
						<Progress value={progress} className="w-full h-2 mb-4 text-brand" />
						<Form {...form}>
							<form onSubmit={form.handleSubmit(handleSignup)} className="space-y-4">
								{currentStep === 0 && (
									<div className="space-y-4">
										<div className="flex space-x-4">
											<FormField
												control={form.control}
												name="username"
												render={({ field }) => (
													<FormItem className="flex-1">
														<FormLabel>
															Username <span className="text-red-500">*</span>
														</FormLabel>
														<FormControl>
															<Input {...field} placeholder="Username" className={getValidationClass("username")} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="first_name"
												render={({ field }) => (
													<FormItem className="flex-1">
														<FormLabel>
															First Name <span className="text-red-500">*</span>
														</FormLabel>
														<FormControl>
															<Input {...field} placeholder="First Name" className={getValidationClass("first_name")} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<FormField
											control={form.control}
											name="last_name"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Last Name <span className="text-red-500">*</span>
													</FormLabel>
													<FormControl>
														<Input {...field} placeholder="Last Name" className={getValidationClass("last_name")} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="phone_number"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Mobile Number <span className="text-red-500">*</span>
													</FormLabel>
													<FormControl>
														<Input {...field} placeholder="xxx-xxx-xxxx" className={getValidationClass("phone_number")} />
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
													<FormLabel>
														Email <span className="text-red-500">*</span>
													</FormLabel>
													<FormControl>
														<Input {...field} placeholder="Email" className={getValidationClass("email")} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="password"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Password <span className="text-red-500">*</span>
													</FormLabel>
													<FormControl>
														<Input type="password" {...field} placeholder="Password" className={getValidationClass("password")} />
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
										<h2 className="mb-4 text-lg font-bold">Review Your Information</h2>
										<div className="grid grid-cols-3 gap-4 text-sm">
											<div className="flex items-center col-span-2">
												<div>
													<span className="block font-semibold">Username:</span>
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
													<span className="block font-semibold">First Name:</span>
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
													<span className="block font-semibold">Last Name:</span>
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
													<span className="block font-semibold">Mobile Number:</span>
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
													<span className="block font-semibold">Email:</span>
													<span>{watchFields[4]}</span>
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
													<span>{`${watchFields[6] || ""}, ${watchFields[7] || ""}, ${watchFields[8] || ""} ${watchFields[9] || ""}`}</span>
												</div>
											</div>
											<div className="flex items-center justify-end">
												<Button variant="link" size="sm" onClick={() => setCurrentStep(1)}>
													Edit
												</Button>
											</div>
										</div>
										<Button type="submit" variant="brand" className="w-full mt-4" disabled={isSubmitting}>
											{isSubmitting ? "Submitting..." : "Submit"}
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
										<Button type="button" onClick={handleNext} className="w-full bg-brand" disabled={(currentStep === 0 && !isStep0Valid) || (currentStep === 1 && !isStep1Valid)}>
											Next
										</Button>
									) : null}
								</div>
							</form>
						</Form>
					</div>
				)}
				{signupError && (
					<Alert className="mt-4 text-black bg-red-300">
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{signupError}</AlertDescription>
					</Alert>
				)}
				{signupSuccess && (
					<Alert className="mt-4 text-black bg-green-300">
						<AlertTitle>Success</AlertTitle>
						<AlertDescription>
							{signupSuccess}
							<div className="mt-2">
								<p>Click on one of the links below to open your email provider:</p>
								<ul className="list-disc list-inside">
									<li>
										<a href="https://mail.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
											Gmail
										</a>
									</li>
									<li>
										<a href="https://outlook.live.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
											Outlook
										</a>
									</li>
									<li>
										<a href="https://mail.yahoo.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
											Yahoo Mail
										</a>
									</li>
									<li>
										<a href="https://mail.aol.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
											AOL Mail
										</a>
									</li>
								</ul>
							</div>
						</AlertDescription>
					</Alert>
				)}
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
	);
}

export default UserSignupForm;