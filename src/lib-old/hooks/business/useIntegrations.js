/**
 * useIntegrations Hook
 * Custom hook for managing business integrations state
 * Extracted from large page component following React best practices
 * Reference: https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "@components/ui/use-toast";
import { availableFeatures } from "@lib/data/integrations/available-features";

export const useIntegrations = (initialProfile = {}) => {
	// State management
	const [profile, setProfile] = useState({
		features: {},
		...initialProfile,
	});

	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedIndustry, setSelectedIndustry] = useState("All");
	const [expandedFeatures, setExpandedFeatures] = useState(new Set());
	const [pendingChanges, setPendingChanges] = useState({});

	// Calculate billing for enabled paid features
	const calculateBilling = useCallback(() => {
		let totalMonthly = 0;
		let paidFeatures = [];

		Object.entries(profile.features).forEach(([key, feature]) => {
			if (feature.enabled && availableFeatures[key]?.isPaid) {
				const featureData = availableFeatures[key];
				totalMonthly += featureData.monthlyPrice || 0;
				paidFeatures.push({
					key,
					name: featureData.title,
					price: featureData.monthlyPrice,
					transactionFee: featureData.transactionFee,
				});
			}
		});

		return { totalMonthly, paidFeatures };
	}, [profile.features]);

	// Filter features based on search and category
	const filteredFeatures = useMemo(() => {
		return Object.entries(availableFeatures).filter(([key, feature]) => {
			const matchesSearch = !searchTerm || feature.title.toLowerCase().includes(searchTerm.toLowerCase()) || feature.description.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesCategory = selectedCategory === "All" || feature.category === selectedCategory;
			const matchesIndustry = selectedIndustry === "All" || feature.industry === selectedIndustry;

			return matchesSearch && matchesCategory && matchesIndustry;
		});
	}, [searchTerm, selectedCategory, selectedIndustry]);

	// Toggle feature on/off
	const handleFeatureToggle = useCallback(
		(featureKey) => {
			const feature = availableFeatures[featureKey];
			if (!feature) return;

			const isCurrentlyEnabled = profile.features[featureKey]?.enabled || false;
			const newState = !isCurrentlyEnabled;

			// Update profile state
			setProfile((prev) => ({
				...prev,
				features: {
					...prev.features,
					[featureKey]: {
						...prev.features[featureKey],
						enabled: newState,
						settings: feature.settings || {},
					},
				},
			}));

			// Track pending changes
			setPendingChanges((prev) => ({
				...prev,
				[featureKey]: newState,
			}));

			// Show toast notification
			toast({
				title: newState ? "Feature Enabled" : "Feature Disabled",
				description: `${feature.title} has been ${newState ? "enabled" : "disabled"}.`,
				duration: 3000,
			});
		},
		[profile.features]
	);

	// Toggle feature expansion
	const toggleFeatureExpansion = useCallback((featureKey) => {
		setExpandedFeatures((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(featureKey)) {
				newSet.delete(featureKey);
			} else {
				newSet.add(featureKey);
			}
			return newSet;
		});
	}, []);

	// Update feature settings
	const updateFeatureSetting = useCallback((featureKey, settingKey, value) => {
		setProfile((prev) => ({
			...prev,
			features: {
				...prev.features,
				[featureKey]: {
					...prev.features[featureKey],
					settings: {
						...prev.features[featureKey]?.settings,
						[settingKey]: value,
					},
				},
			},
		}));

		// Track pending changes
		setPendingChanges((prev) => ({
			...prev,
			[`${featureKey}.${settingKey}`]: value,
		}));
	}, []);

	// Save all pending changes
	const saveChanges = useCallback(async () => {
		try {
			// Here you would make API calls to save the changes
			// For now, we'll just clear pending changes
			setPendingChanges({});

			toast({
				title: "Changes Saved",
				description: "Your integration settings have been updated successfully.",
				duration: 3000,
			});

			return true;
		} catch (error) {
			toast({
				title: "Save Failed",
				description: "There was an error saving your changes. Please try again.",
				variant: "destructive",
				duration: 5000,
			});

			return false;
		}
	}, []);

	// Reset to original state
	const resetChanges = useCallback(() => {
		setPendingChanges({});
		toast({
			title: "Changes Reset",
			description: "All unsaved changes have been discarded.",
			duration: 3000,
		});
	}, []);

	// Get feature status
	const getFeatureStatus = useCallback(
		(featureKey) => {
			return {
				enabled: profile.features[featureKey]?.enabled || false,
				settings: profile.features[featureKey]?.settings || {},
				hasChanges: Object.keys(pendingChanges).some((key) => key.startsWith(featureKey)),
			};
		},
		[profile.features, pendingChanges]
	);

	return {
		// State
		profile,
		searchTerm,
		selectedCategory,
		selectedIndustry,
		expandedFeatures,
		pendingChanges,

		// Computed values
		filteredFeatures,
		billing: calculateBilling(),

		// Actions
		setSearchTerm,
		setSelectedCategory,
		setSelectedIndustry,
		handleFeatureToggle,
		toggleFeatureExpansion,
		updateFeatureSetting,
		saveChanges,
		resetChanges,
		getFeatureStatus,
	};
};
