"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import UserInfo from "@components/auth/onboarding/userInfo";
import UserAddress from "@components/auth/onboarding/userAddress";
import UserProfile from "@components/auth/onboarding/userProfile";
import UserSuccess from "@components/auth/onboarding/userSuccess";
import BusinessInfo from "@components/auth/onboarding/businessInfo";
import BusinessAddress from "@components/auth/onboarding/businessAddress";
import BusinessProfile from "@components/auth/onboarding/businessProfile";
import BusinessSkipVerify from "@components/auth/onboarding/businessSkipVerify";
import BusinessVerification from "@components/auth/onboarding/businessVerification";
import BusinessSuccess from "@components/auth/onboarding/businessSuccess";
import { Button } from "@components/ui/button";
import { ArrowRight, ArrowLeft } from "react-feather";
import useFormStore from "@store/useFormStore"; // adjust this path accordingly

const steps = [
	{ component: UserInfo, name: "User Information" },
	{ component: UserAddress, name: "User Address" },
	{ component: UserProfile, name: "User Profile" },
	{ component: UserSuccess, name: "User Success" },
	{ component: BusinessInfo, name: "Business Information" },
	{ component: BusinessAddress, name: "Business Address" },
	{ component: BusinessProfile, name: "Business Profile" },
	{ component: BusinessSkipVerify, name: "Business Skip Verify" },
	{ component: BusinessVerification, name: "Business Verification" },
	{ component: BusinessSuccess, name: "Business Submitted" },
];

const OnboardingComponent = () => {
	const { currentStep, setCurrentStep } = useFormStore();
	const [loading, setLoading] = useState(false);

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

	const handleSuccessNext = () => {
		if (currentStep === steps.findIndex((step) => step.name === "User Success")) {
			nextStep();
		}
	};

	const handleBusinessSkipVerify = () => {
		nextStep();
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
			<CurrentComponent />
			{currentStep !== steps.findIndex((step) => step.name === "Business Submitted") && (
				<div className="flex justify-between mt-10">
					{currentStep !== steps.findIndex((step) => step.name === "User Success") && currentStep !== steps.findIndex((step) => step.name === "Business Skip Verify") && currentStep !== steps.findIndex((step) => step.name === "Business Verification") && (
						<Button variant="outline" type="button" onClick={prevStep} className="mt-2">
							<ArrowLeft className="w-4 h-4 mr-2" /> Back
						</Button>
					)}
					{currentStep !== steps.findIndex((step) => step.name === "User Success") && currentStep !== steps.findIndex((step) => step.name === "Business Skip Verify") && currentStep !== steps.findIndex((step) => step.name === "Business Verification") && (
						<Button variant="brand" type="button" onClick={nextStep} className="mt-2">
							Next <ArrowRight className="w-4 h-4 ml-2" />
						</Button>
					)}
					{currentStep === steps.findIndex((step) => step.name === "User Success") && (
						<div className="flex flex-col w-full">
							<div className="w-full my-20 border rounded-full dark:border-dark-800 border-dark-300"></div>
							<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">Now add a business</h2>
							<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-300">
								If you own a company you can alternitivly add it here, please note that you will have to <b>prove ownership</b> to claim otherwise you can add one anonymously.
							</p>
							<div className="flex flex-col mt-4 space-y-4">
								<Link href="/claim-a-business" passHref legacyBehavior>
									<Button variant="brand" className="w-full">
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
					{currentStep === steps.findIndex((step) => step.name === "Business Skip Verify") && (
						<div className="flex flex-col w-full">
							<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-300">If you do not own the company but want to claim it, please proceed with the verification process. Otherwise, you can skip this step.</p>
							<div className="flex flex-col mt-4 space-y-4">
								<Button variant="brand" className="w-full" onClick={handleBusinessSkipVerify}>
									Verify Ownership <ArrowRight className="w-4 h-4 ml-2" />
								</Button>
								<Link href="/add-a-business" passHref legacyBehavior>
									<Button variant="outline" className="w-full">
										Submit Business Anonymously <ArrowRight className="w-4 h-4 ml-2" />
									</Button>
								</Link>
							</div>
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

export default OnboardingComponent;
