"use client";

import React from "react";
import { TabsTrigger } from "@components/ui/tabs";
import { useIntegrations } from "@lib/hooks/business/use-integrations";

export default function FieldServiceTabTrigger() {
	const { getFeatureStatus } = useIntegrations();
	const enabled = getFeatureStatus("field_management").enabled;
	if (!enabled) return null;
	return <TabsTrigger value="field-service">Field Service</TabsTrigger>;
}
