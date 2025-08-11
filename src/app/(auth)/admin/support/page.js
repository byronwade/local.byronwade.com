export const metadata = {
	title: "Support Management - Admin Dashboard - Thorbis",
	description: "Manage support tickets, customer inquiries and handle technical support issues.",
};

import React from "react";
import SupportPage from "@components/shared/support/support-page";

export default function Support() {
	return <SupportPage userType="admin" />;
}
