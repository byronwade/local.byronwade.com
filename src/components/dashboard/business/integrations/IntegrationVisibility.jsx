"use client";

import { useIntegrations } from "@lib/hooks/business/use-integrations";

export function IntegrationVisibility({ featureKey, children }) {
	const { getFeatureStatus } = useIntegrations();
	const enabled = getFeatureStatus(featureKey).enabled;
	if (!enabled) return null;
	return children;
}
