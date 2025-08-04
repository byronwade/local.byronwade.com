/**
 * IntegrationsPage Component
 * Clean, focused integrations page using extracted components and hooks
 * Following Next.js best practices for large-scale applications
 * Reference: https://medium.com/@finnkumar6/mastering-next-js-the-ultimate-guide-to-structuring-your-large-scale-project-for-success-ae4877c4f4f2
 */

"use client";

import React, { useState } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Search, CreditCard, Plus, Save, RotateCcw } from "lucide-react";
import { Separator } from "@components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { useMediaQuery } from "@hooks/useMediaQuery";

// Import extracted components
import { MarketplaceCard } from "./MarketplaceCard";
import { IntegrationsFilters } from "./IntegrationsFilters";
import { BillingSection } from "./BillingSection";
import { RequestIntegrationDialog } from "./RequestIntegrationDialog";
import { LearnMoreDialog } from "./LearnMoreDialog";
import { ReportErrorDialog } from "./ReportErrorDialog";

// Import custom hook
import { useIntegrations } from "@lib/hooks/business/useIntegrations";

// Import data
import { featureCategories, industryTypes } from "@lib/data/integrations/available-features";

export default function IntegrationsPage() {
	// Custom hook for integrations management
	const { searchTerm, selectedCategory, selectedIndustry, expandedFeatures, pendingChanges, filteredFeatures, billing, setSearchTerm, setSelectedCategory, setSelectedIndustry, handleFeatureToggle, toggleFeatureExpansion, saveChanges, resetChanges, getFeatureStatus } = useIntegrations();

	// Dialog states
	const [showRequestIntegration, setShowRequestIntegration] = useState(false);
	const [showLearnMore, setShowLearnMore] = useState(false);
	const [showReportError, setShowReportError] = useState(false);
	const [selectedFeature, setSelectedFeature] = useState(null);

	// Responsive design
	const isMobile = useMediaQuery("(max-width: 1024px)");

	// Dialog handlers
	const handleLearnMore = (feature) => {
		setSelectedFeature(feature);
		setShowLearnMore(true);
	};

	const handleReportError = (feature) => {
		setSelectedFeature(feature);
		setShowReportError(true);
	};

	const handleRequestIntegration = () => {
		setShowRequestIntegration(true);
	};

	// Check if there are pending changes
	const hasPendingChanges = Object.keys(pendingChanges).length > 0;

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Page Header */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Integrations & Features</h1>
					<p className="text-gray-600 mt-2">Enhance your business profile with powerful integrations and features</p>
				</div>

				{/* Action Buttons */}
				<div className="flex items-center space-x-2 mt-4 lg:mt-0">
					{hasPendingChanges && (
						<>
							<Button variant="outline" onClick={resetChanges} className="flex items-center space-x-1">
								<RotateCcw className="w-4 h-4" />
								<span>Reset</span>
							</Button>
							<Button onClick={saveChanges} className="flex items-center space-x-1">
								<Save className="w-4 h-4" />
								<span>Save Changes</span>
							</Button>
						</>
					)}
					<Button variant="outline" onClick={handleRequestIntegration} className="flex items-center space-x-1">
						<Plus className="w-4 h-4" />
						<span>Request Feature</span>
					</Button>
				</div>
			</div>

			{/* Billing Overview */}
			<BillingSection billing={billing} />

			{/* Filters and Search */}
			<IntegrationsFilters searchTerm={searchTerm} selectedCategory={selectedCategory} selectedIndustry={selectedIndustry} onSearchChange={setSearchTerm} onCategoryChange={setSelectedCategory} onIndustryChange={setSelectedIndustry} categories={featureCategories} industries={industryTypes} />

			{/* Features Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
				{filteredFeatures.map(([key, feature], index) => {
					const status = getFeatureStatus(key);
					return <MarketplaceCard key={key} feature={{ ...feature, key }} isEnabled={status.enabled} isExpanded={expandedFeatures.has(key)} onToggle={() => handleFeatureToggle(key)} onExpand={() => toggleFeatureExpansion(key)} onLearnMore={handleLearnMore} onReportError={handleReportError} index={index} />;
				})}
			</div>

			{/* Empty State */}
			{filteredFeatures.length === 0 && (
				<Card className="p-12 text-center">
					<div className="space-y-3">
						<Search className="w-12 h-12 mx-auto text-gray-400" />
						<h3 className="text-lg font-medium">No features found</h3>
						<p className="text-gray-500 max-w-md mx-auto">Try adjusting your search terms or filters to find the features you're looking for.</p>
						<Button
							variant="outline"
							onClick={() => {
								setSearchTerm("");
								setSelectedCategory("All");
								setSelectedIndustry("All");
							}}
						>
							Clear Filters
						</Button>
					</div>
				</Card>
			)}

			{/* Dialogs */}
			<RequestIntegrationDialog open={showRequestIntegration} onOpenChange={setShowRequestIntegration} />

			<LearnMoreDialog open={showLearnMore} onOpenChange={setShowLearnMore} feature={selectedFeature} />

			<ReportErrorDialog open={showReportError} onOpenChange={setShowReportError} feature={selectedFeature} />
		</div>
	);
}
