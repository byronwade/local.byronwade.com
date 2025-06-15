"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import VerifyAccount from "@components/auth/shared/verify-account";
import ActiveUser from "@components/auth/shared/active-user";
import ActiveBusiness from "@components/auth/shared/active-business";
import BusinessSearch from "@components/auth/shared/business-search";
import Report from "@components/auth/report/report";
import LoginPage from "@components/auth/login";
import { Button } from "@components/ui/button";
import { ArrowRight, ArrowLeft } from "react-feather";
import useFormStore from "@store/useFormStore";
import useAuth from "@hooks/useAuth";
import WhatAreYouReporting from "@components/auth/report/what-are-you-reporting";

const steps = [
	{ component: ActiveUser, name: "Active User" },
	{ component: WhatAreYouReporting, name: "What Are You Reporting" },
	{ component: ActiveBusiness, name: "Active Business" },
	{ component: BusinessSearch, name: "Business Search" },
	{ component: Report, name: "Report" },
];

const ReportPage = () => {
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

	if (user.email_confirmed_at === "") {
		return <VerifyAccount />;
	}

	console.log(user);

	return (
		<>
			<CurrentComponent />
			{currentStep !== steps.findIndex((step) => step.name === "Report") && (
				<div className="flex justify-between mt-10">
					{currentStep !== steps.findIndex((step) => step.name === "Active User") && (
						<Button variant="outline" type="button" onClick={prevStep} className="mt-2 border-gray-300 dark:border-neutral-800">
							<ArrowLeft className="w-4 h-4 mr-2" /> Back
						</Button>
					)}
					{currentStep !== steps.findIndex((step) => step.name === "Active User") && (
						<Button type="button" onClick={nextStep} className="mt-2">
							Next <ArrowRight className="w-4 h-4 ml-2" />
						</Button>
					)}
					{currentStep === steps.findIndex((step) => step.name === "Active User") && (
						<div className="flex flex-row justify-between w-full mt-4">
							<Button type="submit" onClick={nextStep}>
								Continue <ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default ReportPage;
