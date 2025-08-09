/**
 * useBusinessServices Hook
 * Custom hook for managing business services state and operations
 * Extracted from large profile component for better organization
 */

"use client";

import { useState, useCallback } from "react";
import { toast } from "@components/ui/use-toast";
import { createServiceTemplate, validateService, getServiceStatus } from "@lib/business/service-suggestions";

export const useBusinessServices = (initialServices = [], maxServices = 30) => {
	const [services, setServices] = useState(initialServices);
	const [quickAddForm, setQuickAddForm] = useState({
		name: "",
		price: "",
		category: "",
	});

	// Add a new service
	const addService = useCallback(() => {
		if (services.length >= maxServices) {
			toast({
				title: "Service Limit Reached",
				description: `You can only have up to ${maxServices} services.`,
				variant: "destructive",
			});
			return;
		}

		const serviceName = quickAddForm.name.trim();
		if (!serviceName) {
			toast({
				title: "Service Name Required",
				description: "Please enter a name for the service.",
				variant: "destructive",
			});
			return;
		}

		const newService = createServiceTemplate(serviceName, quickAddForm.category || "General");

		// Add price if provided
		if (quickAddForm.price) {
			newService.price = quickAddForm.price;
		}

		setServices((prev) => [...prev, newService]);

		// Reset quick add form
		setQuickAddForm({
			name: "",
			price: "",
			category: "",
		});

		toast({
			title: "Service Added",
			description: `${serviceName} has been added to your services.`,
		});
	}, [services.length, maxServices, quickAddForm]);

	// Add service from suggestion
	const addServiceFromSuggestion = useCallback(
		(suggestionName) => {
			if (services.length >= maxServices) {
				toast({
					title: "Service Limit Reached",
					description: `You can only have up to ${maxServices} services.`,
					variant: "destructive",
				});
				return;
			}

			const newService = createServiceTemplate(suggestionName, "General");
			setServices((prev) => [...prev, newService]);

			toast({
				title: "Service Added",
				description: `${suggestionName} has been added to your services.`,
			});
		},
		[services.length, maxServices]
	);

	// Remove a service
	const removeService = useCallback((serviceId) => {
		setServices((prev) => prev.filter((service) => service.id !== serviceId));

		toast({
			title: "Service Removed",
			description: "The service has been removed from your profile.",
		});
	}, []);

	// Update a service field
	const updateService = useCallback((serviceId, field, value) => {
		setServices((prev) => prev.map((service) => (service.id === serviceId ? { ...service, [field]: value } : service)));
	}, []);

	// Bulk update services
	const updateServices = useCallback((newServices) => {
		setServices(newServices);
	}, []);

	// Validate all services
	const validateAllServices = useCallback(() => {
		const validationResults = services.map((service) => ({
			service,
			...validateService(service),
		}));

		const invalidServices = validationResults.filter((result) => !result.isValid);

		if (invalidServices.length > 0) {
			const firstError = invalidServices[0];
			toast({
				title: "Service Validation Error",
				description: `${firstError.service.name}: ${firstError.errors[0]}`,
				variant: "destructive",
			});
			return false;
		}

		return true;
	}, [services]);

	// Get services statistics
	const getServicesStats = useCallback(() => {
		const totalServices = services.length;
		const completeServices = services.filter((service) => getServiceStatus(service).isComplete).length;
		const completionRate = totalServices > 0 ? Math.round((completeServices / totalServices) * 100) : 0;

		return {
			total: totalServices,
			complete: completeServices,
			incomplete: totalServices - completeServices,
			completionRate,
			canAddMore: totalServices < maxServices,
			remaining: maxServices - totalServices,
		};
	}, [services, maxServices]);

	// Reorder services (for drag and drop)
	const reorderServices = useCallback((startIndex, endIndex) => {
		setServices((prev) => {
			const result = Array.from(prev);
			const [removed] = result.splice(startIndex, 1);
			result.splice(endIndex, 0, removed);
			return result;
		});
	}, []);

	// Duplicate a service
	const duplicateService = useCallback(
		(serviceId) => {
			const serviceToClone = services.find((s) => s.id === serviceId);
			if (!serviceToClone) return;

			if (services.length >= maxServices) {
				toast({
					title: "Service Limit Reached",
					description: `You can only have up to ${maxServices} services.`,
					variant: "destructive",
				});
				return;
			}

			const duplicatedService = {
				...serviceToClone,
				id: Date.now() + Math.random(),
				name: `${serviceToClone.name} (Copy)`,
				createdAt: new Date().toISOString(),
			};

			setServices((prev) => [...prev, duplicatedService]);

			toast({
				title: "Service Duplicated",
				description: `${serviceToClone.name} has been duplicated.`,
			});
		},
		[services, maxServices]
	);

	// Get services by category
	const getServicesByCategory = useCallback(() => {
		const servicesByCategory = services.reduce((acc, service) => {
			const category = service.category || "Uncategorized";
			if (!acc[category]) {
				acc[category] = [];
			}
			acc[category].push(service);
			return acc;
		}, {});

		return servicesByCategory;
	}, [services]);

	// Export services data
	const exportServices = useCallback(() => {
		const exportData = {
			services,
			exportedAt: new Date().toISOString(),
			totalServices: services.length,
		};

		return JSON.stringify(exportData, null, 2);
	}, [services]);

	// Import services data
	const importServices = useCallback(
		(importData) => {
			try {
				const data = typeof importData === "string" ? JSON.parse(importData) : importData;

				if (!data.services || !Array.isArray(data.services)) {
					throw new Error("Invalid import data format");
				}

				// Validate imported services
				const validServices = data.services.filter((service) => {
					const validation = validateService(service);
					return validation.isValid;
				});

				if (validServices.length !== data.services.length) {
					toast({
						title: "Import Warning",
						description: `${data.services.length - validServices.length} invalid services were skipped.`,
						variant: "destructive",
					});
				}

				setServices(validServices.slice(0, maxServices)); // Respect max services limit

				toast({
					title: "Services Imported",
					description: `${validServices.length} services imported successfully.`,
				});

				return true;
			} catch (error) {
				toast({
					title: "Import Failed",
					description: "Unable to import services. Please check the file format.",
					variant: "destructive",
				});
				return false;
			}
		},
		[maxServices]
	);

	return {
		// State
		services,
		quickAddForm,

		// Quick Add Form Actions
		setQuickAddForm,

		// Service Actions
		addService,
		addServiceFromSuggestion,
		removeService,
		updateService,
		updateServices,
		duplicateService,
		reorderServices,

		// Validation & Stats
		validateAllServices,
		getServicesStats,
		getServicesByCategory,

		// Import/Export
		exportServices,
		importServices,

		// Computed Values
		stats: getServicesStats(),
		servicesByCategory: getServicesByCategory(),
		canAddService: services.length < maxServices,
		isAtLimit: services.length >= maxServices,
	};
};
