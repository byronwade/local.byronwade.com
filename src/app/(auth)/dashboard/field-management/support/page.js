export const metadata = {
	title: "Business Support - Dashboard - Thorbis",
	description: "Get help and support for your business account, billing and technical issues.",
};

import React from "react";
import SupportPage from "@components/shared/support/support-page";

export default function Support() {
	return <SupportPage userType="business" />;
}
