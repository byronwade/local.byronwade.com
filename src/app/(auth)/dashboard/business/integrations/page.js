/**
 * Business Integrations Page
 * Dramatically simplified page using extracted components and hooks
 * Reduced from 3000+ lines to clean, focused implementation
 * Following Next.js best practices: https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji
 */

"use client";

import React from "react";
import { IntegrationsPage } from "@components/dashboard/business/integrations";

export default function BusinessIntegrationsPage() {
	// Set page title
	React.useEffect(() => {
		document.title = "Integrations & Features - Business Dashboard - Thorbis";
	}, []);

	return <IntegrationsPage />;
}
