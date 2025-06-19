"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import VerifyAccount from "@components/auth/shared/verify-account";
import ActiveUser from "@components/auth/shared/active-user";
import BusinessSearch from "@components/auth/shared/business-search";
import BusinessVerification from "@components/auth/onboarding/business-verification";
import BusinessSuccess from "@components/auth/onboarding/business-success";
import { Button } from "@components/ui/button";
import { ArrowRight, ArrowLeft } from "react-feather";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useAuth from "@hooks/useAuth";
import LoginPage from "@components/auth/login";

// Define schema for business verification step
const businessVerificationSchema = z.object({
	ein: z.string().regex(/^\d{2}-\d{7}$/, { message: "Invalid EIN format. Must be XX-XXXXXXX." }),
	registrationDocument: z.array(z.any()).refine((files) => files.length > 0, { message: "Business registration document is required" }),
	businessLicense: z.array(z.any()).refine((files) => files.length > 0, { message: "Business license is required" }),
	proofOfOwnership: z.array(z.any()).refine((files) => files.length > 0, { message: "Proof of company ownership is required" }),
	ownerID: z.array(z.any()).refine((files) => files.length > 0, { message: "Owner's government-issued ID is required" }),
});

const steps = [
	{ component: ActiveUser, name: "activeUser" },
	{ component: BusinessSearch, name: "businessSearch" },
	{ component: BusinessVerification, name: "businessVerification" },
	{ component: BusinessSuccess, name: "businessSuccess" },
];

const ClaimBusiness = () => {
	const [currentStep, setCurrentStep] = useState(0);
	const [loading, setLoading] = useState(false);
	const { isInitialized, user, loading: authLoading } = useAuth();

	const formMethods = useForm({
		resolver: zodResolver(businessVerificationSchema),
		defaultValues: {
			ein: "",
			registrationDocument: [],
			businessLicense: [],
			proofOfOwnership: [],
			ownerID: [],
		},
	});

	useEffect(() => {
		// Reset to the first step when the component mounts
		setCurrentStep(0);
	}, []);

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

	const handleSubmit = async () => {
		const isValid = await formMethods.trigger();
		console.log("Form Submission Triggered:", isValid, formMethods.getValues());
		if (!isValid) {
			console.log("Validation Errors:", formMethods.formState.errors);
		}
		if (isValid) {
			const data = formMethods.getValues();
			console.log("Form Submitted:", data);
			setLoading(true);
			// Simulate an async operation, e.g., saving data to the database
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setLoading(false);
			nextStep();
		} else {
			console.log("Validation failed");
		}
	};

	const CurrentComponent = steps[currentStep].component;

	if (authLoading || !isInitialized) {
		return (
			<div className="flex justify-center w-full">
				<Image src="/ThorbisLogo.webp" alt="Thorbis Logo" width={200} height={100} className="w-[60px] h-[60px] animate-breathe" />
			</div>
		);
	}

	if (!user) {
		return <LoginPage />;
	}

	if (user.email_confirmed_at === "") {
		return <VerifyAccount />;
	}

	return (
		<FormProvider {...formMethods}>
			<form>
				<CurrentComponent />
				{currentStep !== steps.findIndex((step) => step.name === "businessSuccess") && (
					<div className="flex justify-between mt-10">
						{currentStep > 0 && currentStep !== steps.findIndex((step) => step.name === "activeUser") && (
							<Button variant="outline" type="button" onClick={prevStep} className="mt-2 border-gray-300 dark:border-neutral-800">
								<ArrowLeft className="w-4 h-4 mr-2" /> Back
							</Button>
						)}
						{currentStep < steps.length - 1 && currentStep !== steps.findIndex((step) => step.name === "businessVerification") && (
							<Button type="button" onClick={nextStep} className="mt-2">
								Next <ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						)}
						{currentStep === steps.findIndex((step) => step.name === "businessVerification") && (
							<Button type="button" onClick={handleSubmit} className="mt-2">
								Submit <ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						)}
					</div>
				)}
				{currentStep === steps.findIndex((step) => step.name === "businessSuccess") && (
					<div className="flex flex-row justify-between w-full mt-4">
						<Link href="/claim-a-business" passHref>
							<Button variant="outline" type="submit">
								Continue to verify ownership <ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						</Link>
					</div>
				)}
			</form>
		</FormProvider>
	);
};

export default ClaimBusiness;

