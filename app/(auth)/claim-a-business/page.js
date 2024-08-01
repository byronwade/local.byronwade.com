"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import ActiveUser from "@components/auth/shared/ActiveUser";
import BusinessInfo from "@components/auth/onboarding/businessInfo";
import BusinessAddress from "@components/auth/onboarding/businessAddress";
import BusinessProfile from "@components/auth/onboarding/businessProfile";
import BusinessVerification from "@components/auth/onboarding/businessVerification";
import BusinessSuccess from "@components/auth/onboarding/businessSuccess";
import { Button } from "@components/ui/button";
import { ArrowRight, ArrowLeft } from "react-feather";
import useFormStore from "@store/useFormStore";
import useAuth from "@hooks/useAuth";
import LoginPage from "@components/auth/login";

const steps = [
	{ component: ActiveUser, name: "Active User" },
	{ component: BusinessInfo, name: "Business Information" },
	{ component: BusinessAddress, name: "Business Address" },
	{ component: BusinessProfile, name: "Business Profile" },
	{ component: BusinessVerification, name: "Business Verification" },
	{ component: BusinessSuccess, name: "Business Submitted" },
];

const ClaimBusiness = () => {
	const [currentStep, setCurrentStep] = useState(0);
	const { isInitialized, user, loading } = useAuth();

	useEffect(() => {
		// Reset to the first step when the component mounts
		setCurrentStep(0);
	}, []);

	const nextStep = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const CurrentComponent = steps[currentStep].component;

	if (loading || !isInitialized) {
		return (
			<div className="flex justify-center w-full">
				<Image src="/ThorbisLogo.webp" alt="Thorbis Logo" width={200} height={100} className="w-[60px] h-[60px] animate-breathe" />
			</div>
		);
	}

	if (!user) {
		return <LoginPage />;
	}

	console.log(user);

	return (
		<>
			<CurrentComponent />
			{currentStep !== steps.findIndex((step) => step.name === "Business Submitted") && (
				<div className="flex justify-between mt-10">
					{currentStep !== steps.findIndex((step) => step.name === "Active User") && currentStep !== steps.findIndex((step) => step.name === "Business Verification") && (
						<Button variant="outline" type="button" onClick={prevStep} className="mt-2 border-gray-300 dark:border-neutral-800">
							<ArrowLeft className="w-4 h-4 mr-2" /> Back
						</Button>
					)}
					{currentStep !== steps.findIndex((step) => step.name === "Active User") && currentStep !== steps.findIndex((step) => step.name === "Business Verification") && (
						<Button variant="brand" type="button" onClick={nextStep} className="mt-2">
							Next <ArrowRight className="w-4 h-4 ml-2" />
						</Button>
					)}
					{currentStep === steps.findIndex((step) => step.name === "Active User") && (
						<div className="flex flex-row justify-between w-full mt-4">
							<Button variant="brand" type="submit" onClick={nextStep}>
								Confirm & Add Business <ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						</div>
					)}
					{currentStep === steps.findIndex((step) => step.name === "Business Verification") && (
						<div className="flex justify-between w-full space-x-4">
							<Button variant="outline" type="button" onClick={prevStep} className="mt-2">
								<ArrowLeft className="w-4 h-4 mr-2" /> Back
							</Button>
							<Button variant="brand" type="button" onClick={nextStep} className="mt-2">
								Next <ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default ClaimBusiness;
