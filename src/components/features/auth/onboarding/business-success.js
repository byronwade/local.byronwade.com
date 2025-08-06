"use client";

import React from "react";

import { Button } from "@components/ui/button";
import { ArrowRight } from "react-feather";

const UserSuccess = () => {
	return (
		<>
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left">Under Review</h2>
			<p className="text-sm leading-6 text-left text-muted-foreground">Our company will review all provided information and send a conformation email once all data has been verified, please give 24 hours for the request to be approved.</p>
			<Button className="mt-4">
				Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
			</Button>
		</>
	);
};

export default UserSuccess;
