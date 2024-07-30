// app/signup/page.js

"use client";

import { useState } from "react";
import UserSignupForm from "@components/auth/UserSignupForm";
import BusinessSignupForm from "@components/auth/BusinessSignupForm";

const SignupPage = () => {
	const [step, setStep] = useState(0);

	const handleNextStep = () => {
		setStep((prevStep) => prevStep + 1);
	};

	const handlePreviousStep = () => {
		setStep((prevStep) => prevStep - 1);
	};

	return (
		<div>
			{step === 0 && <UserSignupForm onNextStep={handleNextStep} />}
			{step === 1 && <BusinessSignupForm onPreviousStep={handlePreviousStep} />}
		</div>
	);
};

export default SignupPage;
