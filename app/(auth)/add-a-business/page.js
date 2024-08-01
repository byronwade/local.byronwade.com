"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import ActiveUser from "@components/auth/shared/ActiveUser";
import BusinessInfo from "@components/auth/onboarding/businessInfo";
import BusinessAddress from "@components/auth/onboarding/businessAddress";
import BusinessSuccess from "@components/auth/onboarding/businessSuccess";
import LoginPage from "@components/auth/login";
import { Button } from "@components/ui/button";
import { ArrowRight, ArrowLeft } from "react-feather";
import useFormStore from "@store/useFormStore";
import useAuth from "@hooks/useAuth";

const steps = [
	{ component: ActiveUser, name: "Active User" },
	{ component: BusinessInfo, name: "Business Information" },
	{ component: BusinessAddress, name: "Business Address" },
	{ component: BusinessSuccess, name: "Business Submitted" },
];

const AddBusiness = () => {
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
					{currentStep !== steps.findIndex((step) => step.name === "Active User") && (
						<Button variant="outline" type="button" onClick={prevStep} className="mt-2 border-gray-300 dark:border-neutral-800">
							<ArrowLeft className="w-4 h-4 mr-2" /> Back
						</Button>
					)}
					{currentStep !== steps.findIndex((step) => step.name === "Active User") && (
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
				</div>
			)}
		</>
	);
};

export default AddBusiness;
