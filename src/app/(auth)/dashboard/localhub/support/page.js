export const metadata = {
	title: "LocalHub Support - Dashboard - Thorbis",
	description: "Get help and support for your LocalHub directory, billing and technical issues.",
};

import React from "react";
import SupportPage from "@components/shared/support/support-page";

export default function Support() {
	return <SupportPage userType="localhub" />;
}
