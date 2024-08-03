"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, ArrowLeft } from "react-feather";
import { Button } from "@components/ui/button";

import UserInfo from "@components/auth/onboarding/user-info";
import UserAddress from "@components/auth/onboarding/user-address";
import UserProfile from "@components/auth/onboarding/user-profile";
import UserSuccess from "@components/auth/onboarding/user-success";

// Define schema for user steps only
const userSchema = z.object({
	userInfo: z.object({
		firstName: z.string().nonempty({ message: "First name is required" }),
		lastName: z.string().nonempty({ message: "Last name is required" }),
		phoneNumber: z.string().nonempty({ message: "Phone number is required" }),
		email: z.string().email({ message: "Invalid email address" }).nonempty({ message: "Email is required" }),
		howFound: z.string().nonempty({ message: "Please select an option" }),
	}),
	userAddress: z.object({
		street: z.string().nonempty({ message: "Street is required" }),
		city: z.string().nonempty({ message: "City is required" }),
		state: z.string().nonempty({ message: "State is required" }),
		zip: z.string().regex(/^\d{5}$/, { message: "Invalid ZIP code. Must be 5 digits." }),
		poBox: z.string().optional(),
		additionalAddresses: z
			.array(
				z.object({
					street: z.string().nonempty({ message: "Street is required" }),
					city: z.string().nonempty({ message: "City is required" }),
					state: z.string().nonempty({ message: "State is required" }),
					zip: z.string().regex(/^\d{5}$/, { message: "Invalid ZIP code. Must be 5 digits." }),
				})
			)
			.max(1, "You can only add 1 additional address")
			.optional(),
	}),
	userProfile: z.object({
		image: z.any().optional(),
		username: z.string().nonempty({ message: "Username is required" }),
	}),
});

const steps = [
	{ component: UserInfo, name: "userInfo" },
	{ component: UserAddress, name: "userAddress" },
	{ component: UserProfile, name: "userProfile" },
	{ component: UserSuccess, name: "userSuccess" },
];

const OnboardingComponent = () => {
	const [currentStep, setCurrentStep] = useState(0);
	const [loading, setLoading] = useState(false);

	const formMethods = useForm({
		resolver: zodResolver(userSchema),
		defaultValues: {
			userInfo: {
				firstName: "",
				lastName: "",
				phoneNumber: "",
				email: "",
				howFound: "",
			},
			userAddress: {
				street: "",
				city: "",
				state: "",
				zip: "",
				poBox: "",
				additionalAddresses: [],
			},
			userProfile: {
				username: "",
				image: null,
			},
		},
	});

	const nextStep = async () => {
		setLoading(true);
		const isStepValid = await formMethods.trigger(steps[currentStep].name);
		console.log("Next Step Triggered:", isStepValid, formMethods.getValues());
		if (!isStepValid) {
			console.log("Validation Errors:", formMethods.formState.errors);
		}
		setLoading(false);
		if (isStepValid) {
			setCurrentStep((prev) => prev + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 0) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	const onSubmitUser = async (data) => {
		console.log("User Data:", data);
		setLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setLoading(false);
		nextStep();
	};

	const handleSubmit = async () => {
		const isValid = await formMethods.trigger();
		console.log("Form Submission Triggered:", isValid, formMethods.getValues());
		if (!isValid) {
			console.log("Validation Errors:", formMethods.formState.errors);
		}
		if (isValid) {
			const data = formMethods.getValues();
			console.log("Form Submitted:", data);
			await onSubmitUser(data);
		} else {
			console.log("Validation failed");
		}
	};

	const CurrentComponent = steps[currentStep].component;

	return (
		<>
			<FormProvider {...formMethods}>
				<form>
					<CurrentComponent />
					{currentStep !== steps.findIndex((step) => step.name === "userSuccess") && (
						<div className="flex justify-between mt-10">
							{currentStep > 0 && (
								<Button variant="outline" type="button" onClick={prevStep} className="mt-2">
									<ArrowLeft className="w-4 h-4 mr-2" /> Back
								</Button>
							)}
							{currentStep < steps.length - 1 && currentStep !== steps.findIndex((step) => step.name === "userProfile") && (
								<Button type="button" onClick={nextStep} className="mt-2">
									Next <ArrowRight className="w-4 h-4 ml-2" />
								</Button>
							)}
							{currentStep === steps.findIndex((step) => step.name === "userProfile") && (
								<Button type="button" onClick={handleSubmit} className="mt-2">
									Submit
								</Button>
							)}
						</div>
					)}
					{currentStep === steps.findIndex((step) => step.name === "userSuccess") && (
						<div className="flex flex-col w-full">
							<div className="w-full my-20 border rounded-full dark:border-dark-800 border-dark-300"></div>
							<h2 className="mb-1 text-2xl font-bold leading-9 text-left">Now add a business</h2>
							<p className="text-sm leading-6 text-left text-muted-foreground">
								If you own a company you can alternatively add it here, please note that you will have to <b>prove ownership</b> to claim otherwise you can add one anonymously.
							</p>
							<div className="flex flex-col mt-4 space-y-4">
								<Link href="/claim-a-business" passHref legacyBehavior>
									<Button className="w-full">
										Claim a business <ArrowRight className="w-4 h-4 ml-2" />
									</Button>
								</Link>
								<Link href="/add-a-business" passHref legacyBehavior>
									<Button variant="outline" className="w-full">
										Submit Business Anonymously <ArrowRight className="w-4 h-4 ml-2" />
									</Button>
								</Link>
							</div>
						</div>
					)}
				</form>
			</FormProvider>
		</>
	);
};

export default OnboardingComponent;
