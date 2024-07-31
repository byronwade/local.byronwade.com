"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ActiveUser from "@components/auth/onboarding/ActiveUser";
import ActiveBusiness from "@components/auth/shared/activeBusiness";
import BuissnessSearch from "@components/auth/shared/buissness-search";
import Report from "@components/auth/report/report";
import { Button } from "@components/ui/button";
import { ArrowRight, ArrowLeft } from "react-feather";
import useFormStore from "@store/useFormStore";
import useAuthStore from "@store/useAuthStore";
import { supabase } from "@lib/supabaseClient"; // Adjust the import as necessary
import WhatAreYouReporting from "@components/auth/report/what-are-you-reporting";

const steps = [
	{ component: ActiveUser, name: "Active User" },
	{ component: WhatAreYouReporting, name: "What Are You Reporting" },
	{ component: ActiveBusiness, name: "Active Business" },
	{ component: BuissnessSearch, name: "Business Search" },
	{ component: Report, name: "Report" },
];

const AddBusiness = () => {
	const { currentStep, setCurrentStep } = useFormStore();
	const { user, loading, setUser, setLoading, setUserRoles, initializeAuth } = useAuthStore();
	const router = useRouter();

	useEffect(() => {
		const initialize = async () => {
			setLoading(true);
			await initializeAuth();

			const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
				if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
					if (session) {
						setUser(session.user);
						await useAuthStore.getState().fetchUserRoles(session.user.id);

						// Check if the account is active
						const { data: userData, error } = await supabase.from("users").select("active").eq("id", session.user.id).single();

						if (error || !userData.active) {
							router.push("/email-verified");
						}
					} else {
						setUser(null);
					}
				} else if (event === "SIGNED_OUT") {
					setUser(null);
					setUserRoles([]);
				}
				setLoading(false);
			});

			return () => {
				data.subscription.unsubscribe();
			};
		};

		initialize();
	}, [initializeAuth, setLoading, setUser, setUserRoles, router]);

	useEffect(() => {
		if (!loading && !user) {
			router.push("/onboarding");
		}
	}, [user, loading, router]);

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

	if (loading) {
		return (
			<div className="flex justify-center w-full">
				<Image src="/ThorbisLogo.webp" alt="Thorbis Logo" width={200} height={100} className="w-[60px] h-[60px] animate-breathe" />
			</div>
		);
	}

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
						<Button variant="brand" type="button" onClick={nextStep} className="mt-2">
							Next <ArrowRight className="w-4 h-4 ml-2" />
						</Button>
					)}
					{currentStep === steps.findIndex((step) => step.name === "Active User") && (
						<div className="flex flex-row justify-between w-full mt-4">
							<Button variant="brand" type="submit" onClick={nextStep}>
								Continue <ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default AddBusiness;
