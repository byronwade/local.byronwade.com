"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { useIntegrations } from "@lib/hooks/business/use-integrations";

export default function EnabledIntegrations() {
	const { profile } = useIntegrations();
	const enabled = Object.entries(profile.features || {}).filter(([, v]) => v?.enabled);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Enabled Integrations</CardTitle>
				<CardDescription>Active modules powering your dashboard</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				{enabled.length === 0 ? (
					<p className="text-sm text-muted-foreground">No integrations enabled yet. Visit Settings → Integrations to get started.</p>
				) : (
					<div className="flex flex-wrap gap-2">
						{enabled.map(([key]) => (
							<Badge key={key} variant="secondary">
								{key}
							</Badge>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
