export const metadata = {
	title: "User Support - Dashboard - Thorbis",
	description: "Get help and support for your user account, billing and technical issues.",
};

import React from "react";
import SupportPage from "@components/shared/support/SupportPage";

export default function Support() {
	return <SupportPage userType="user" />;
}
