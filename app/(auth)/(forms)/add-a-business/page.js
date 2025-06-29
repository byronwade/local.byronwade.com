"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import VerifyAccount from "@components/auth/shared/verify-account";
import ActiveUser from "@components/auth/shared/active-user";
import BusinessInfo from "@components/auth/onboarding/business-info";
import BusinessAddress from "@components/auth/onboarding/business-address";
import BusinessProfile from "@components/auth/onboarding/business-profile";
import BusinessSuccess from "@components/auth/onboarding/business-success";
import LoginPage from "@components/auth/login";
import { Button } from "@components/ui/button";
import { Progress } from "@components/ui/progress";
import { Badge } from "@components/ui/badge";
import { ArrowRight, ArrowLeft, CheckCircle } from "react-feather";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useAuth from "@hooks/useAuth";
import { useToast } from "@components/ui/use-toast";
import { Alert, AlertDescription } from "@components/ui/alert";
import { AlertTriangle, CheckCircle as CheckCircleIcon } from "lucide-react";

// Define schema for all business steps combined
const combinedBusinessSchema = z.object({
	businessInfo: z.object({
		businessName: z.string().nonempty({ message: "Business name is required" }),
		businessPhoneNumber: z.string().nonempty({ message: "Business phone number is required" }),
		email: z.string().email({ message: "Invalid email address" }).nonempty({ message: "Email is required" }),
	}),
	businessAddress: z.object({
		street: z.string().nonempty({ message: "Street is required" }),
		city: z.string().nonempty({ message: "City is required" }),
		state: z.string().nonempty({ message: "State is required" }),
		zip: z.string().regex(/^\d{5}$/, { message: "Invalid ZIP code. Must be 5 digits." }),
	}),
	businessProfile: z.object({
		logo: z.any().optional(),
		services: z.string().nonempty({ message: "At least one service is required" }),
		serviceArea: z.number().min(1, { message: "Service area must be at least 1 mile" }).max(100, { message: "Service area can't exceed 100 miles" }),
	}),
});

const steps = [
	{ component: ActiveUser, name: "activeUser", title: "User Info", description: "Verify your account" },
	{ component: BusinessInfo, name: "businessInfo", title: "Business Info", description: "Basic business details" },
	{ component: BusinessAddress, name: "businessAddress", title: "Address", description: "Business location" },
	{ component: BusinessProfile, name: "businessProfile", title: "Profile", description: "Services & branding" },
	{ component: BusinessSuccess, name: "businessSuccess", title: "Complete", description: "Setup finished" },
];

// Progress Indicator Component
const ProgressIndicator = ({ currentStep, totalSteps, steps }) => {
	const progress = ((currentStep + 1) / totalSteps) * 100;

	return (
		<div className="mb-8">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold">Setup Progress</h3>
				<Badge variant="secondary">
					{currentStep + 1} of {totalSteps}
				</Badge>
			</div>

			<Progress value={progress} className="mb-4" />

			<div className="flex items-center justify-between text-sm text-muted-foreground">
				<span>{steps[currentStep]?.title}</span>
				<span>{Math.round(progress)}% complete</span>
			</div>
		</div>
	);
};

const AddBusiness = () => {
	const [currentStep, setCurrentStep] = useState(0);
	const [loading, setLoading] = useState(false);
	const [formErrors, setFormErrors] = useState({});
	const { isInitialized, user, loading: authLoading } = useAuth();
	const { toast } = useToast();

	const formMethods = useForm({
		resolver: zodResolver(combinedBusinessSchema),
		defaultValues: {
			businessInfo: {
				businessName: "",
				businessPhoneNumber: "",
				email: "",
			},
			businessAddress: {
				street: "",
				city: "",
				state: "",
				zip: "",
			},
			businessProfile: {
				logo: null,
				services: "",
				serviceArea: 1,
			},
		},
	});

	useEffect(() => {
		// Reset to the first step when the component mounts
		setCurrentStep(0);
	}, []);

	const nextStep = async () => {
		setLoading(true);
		setFormErrors({});

		try {
			const isStepValid = await formMethods.trigger(steps[currentStep].name);
			console.log("Next Step Triggered:", isStepValid, formMethods.getValues());

			if (!isStepValid) {
				const errors = formMethods.formState.errors;
				console.log("Validation Errors:", errors);

				// Show toast for validation errors
				const errorMessages = Object.values(errors)
					.map((error) => error?.message)
					.filter(Boolean);
				if (errorMessages.length > 0) {
					toast({
						title: "Please fix the following errors:",
						description: errorMessages.join(", "),
						variant: "destructive",
					});
				}

				setFormErrors(errors);
				return;
			}

			if (currentStep < steps.length - 1) {
				setCurrentStep((prev) => prev + 1);
				toast({
					title: "Step completed",
					description: `Moving to ${steps[currentStep + 1].title}`,
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "An unexpected error occurred. Please try again.",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const prevStep = () => {
		if (currentStep > 0) {
			setCurrentStep((prev) => prev - 1);
			setFormErrors({});
		}
	};

	const handleSubmit = async () => {
		setLoading(true);
		setFormErrors({});

		try {
			const isValid = await formMethods.trigger();
			console.log("Form Submission Triggered:", isValid, formMethods.getValues());

			if (!isValid) {
				const errors = formMethods.formState.errors;
				console.log("Validation Errors:", errors);

				const errorMessages = Object.values(errors)
					.map((error) => error?.message)
					.filter(Boolean);
				if (errorMessages.length > 0) {
					toast({
						title: "Please fix the following errors:",
						description: errorMessages.join(", "),
						variant: "destructive",
					});
				}

				setFormErrors(errors);
				return;
			}

			const data = formMethods.getValues();
			console.log("Form Submitted:", data);

			// Simulate an async operation, e.g., saving data to the database
			await new Promise((resolve) => setTimeout(resolve, 1000));

			toast({
				title: "Business Added Successfully!",
				description: "Your business has been added to our directory. You can now manage it from your dashboard.",
				action: (
					<Button variant="outline" size="sm" onClick={() => (window.location.href = "/dashboard/business")}>
						Go to Dashboard
					</Button>
				),
			});

			nextStep();
		} catch (error) {
			toast({
				title: "Error Adding Business",
				description: "There was an error adding your business. Please try again or contact support.",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	// Ensure currentStep is within bounds
	const safeCurrentStep = Math.max(0, Math.min(currentStep, steps.length - 1));
	const CurrentComponent = steps[safeCurrentStep]?.component;

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

	// Add safety check for CurrentComponent
	if (!CurrentComponent) {
		console.error("CurrentComponent is undefined. currentStep:", currentStep, "steps.length:", steps.length);
		return (
			<div className="flex justify-center w-full">
				<div className="text-center">
					<h2 className="text-xl font-bold mb-4">Something went wrong</h2>
					<p className="text-muted-foreground mb-4">There was an issue loading this step.</p>
					<Button onClick={() => setCurrentStep(0)}>Start Over</Button>
				</div>
			</div>
		);
	}

	return (
		<FormProvider {...formMethods}>
			<form>
				{/* Progress Indicator */}
				{currentStep > 0 && currentStep < steps.length - 1 && <ProgressIndicator currentStep={currentStep} totalSteps={steps.length - 1} steps={steps} />}

				<CurrentComponent />
				{currentStep !== steps.findIndex((step) => step.name === "businessSuccess") && (
					<div className="flex justify-between mt-10">
						{currentStep > 0 && currentStep !== steps.findIndex((step) => step.name === "activeUser") && (
							<Button variant="outline" type="button" onClick={prevStep} className="mt-2 border-neutral-700 dark:border-neutral-800">
								<ArrowLeft className="w-4 h-4 mr-2" /> Back
							</Button>
						)}
						{currentStep < steps.length - 1 && currentStep !== steps.findIndex((step) => step.name === "businessProfile") && (
							<Button type="button" onClick={nextStep} className="mt-2" disabled={loading}>
								{loading ? "Validating..." : `Next: ${steps[currentStep + 1]?.title}`} <ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						)}
						{currentStep === steps.findIndex((step) => step.name === "businessProfile") && (
							<Button type="button" onClick={handleSubmit} className="mt-2" disabled={loading}>
								{loading ? "Adding Business..." : "Add Business"} <CheckCircleIcon className="w-4 h-4 ml-2" />
							</Button>
						)}
					</div>
				)}
			</form>
		</FormProvider>
	);
};

export default AddBusiness;

