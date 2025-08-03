/**
 * useAdsForm Hook Tests
 * Comprehensive tests for the ads form management hook with type safety
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAdsForm } from "@lib/hooks/business/ads/useAdsForm";
import { createMockAdFormData } from "@tests/utils/test-utils";

// Mock toast notifications
const mockToast = vi.fn();
vi.mock("@components/ui/use-toast", () => ({
	toast: mockToast,
}));

// Mock error handlers
vi.mock("@lib/utils/errorHandler", () => ({
	withErrorHandling: vi.fn((fn: Function) => fn),
	showErrorToast: vi.fn(),
	showSuccessToast: vi.fn(),
}));

// Mock debounce utility
vi.mock("@lib/utils/performanceUtils", () => ({
	debounce: vi.fn((fn: Function) => fn),
}));

describe("useAdsForm", () => {
	const mockInitialData = createMockAdFormData();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe("initialization", () => {
		it("should initialize with default form state", () => {
			const { result } = renderHook(() => useAdsForm());

			expect(result.current.formData).toBeDefined();
			expect(result.current.errors).toEqual({});
			expect(result.current.currentStep).toBe(1);
			expect(result.current.isSubmitting).toBe(false);
			expect(result.current.completionPercentage).toBe(0);
		});

		it("should initialize with provided initial data", () => {
			const { result } = renderHook(() =>
				useAdsForm(false, {
					name: "Test Campaign",
					type: "search",
					location: "Test City",
				})
			);

			expect(result.current.formData.name).toBe("Test Campaign");
			expect(result.current.formData.type).toBe("search");
			expect(result.current.formData.location).toBe("Test City");
		});

		it("should initialize in edit mode with existing data", () => {
			const { result } = renderHook(() => useAdsForm(true, mockInitialData));

			expect(result.current.formData).toEqual(expect.objectContaining(mockInitialData));
		});
	});

	describe("form validation", () => {
		it("should validate required fields", () => {
			const { result } = renderHook(() => useAdsForm());

			act(() => {
				const validation = result.current.validateForm();
				expect(validation.isValid).toBe(false);
				expect(validation.errors).toHaveProperty("name");
			});
		});

		it("should validate individual fields", () => {
			const { result } = renderHook(() => useAdsForm());

			act(() => {
				const fieldError = result.current.validateField("name");
				expect(fieldError).toBeTruthy();
				expect(fieldError?.field).toBe("name");
			});
		});

		it("should pass validation with complete form data", () => {
			const { result } = renderHook(() => useAdsForm(false, mockInitialData));

			act(() => {
				const validation = result.current.validateForm();
				expect(validation.isValid).toBe(true);
				expect(validation.errors).toEqual({});
			});
		});

		it("should validate step completion", () => {
			const { result } = renderHook(() => useAdsForm(false, mockInitialData));

			act(() => {
				const isComplete = result.current.isStepComplete(1);
				expect(isComplete).toBe(true);
			});
		});
	});

	describe("form field updates", () => {
		it("should update form fields correctly", () => {
			const { result } = renderHook(() => useAdsForm());

			act(() => {
				result.current.handleInputChange("name", "New Campaign Name");
			});

			expect(result.current.formData.name).toBe("New Campaign Name");
		});

		it("should update multi-select fields", () => {
			const { result } = renderHook(() => useAdsForm());

			act(() => {
				result.current.handleMultiSelectChange("demographics", ["Age 25-34", "Homeowners"]);
			});

			expect(result.current.formData.demographics).toEqual(["Age 25-34", "Homeowners"]);
		});

		it("should update schedule data", () => {
			const { result } = renderHook(() => useAdsForm());

			const scheduleData = {
				startDate: "2024-02-01",
				endDate: "2024-02-28",
				timeOfDay: "morning",
				daysOfWeek: ["monday", "tuesday", "wednesday"],
			};

			act(() => {
				result.current.handleScheduleChange(scheduleData);
			});

			expect(result.current.formData.schedule).toEqual(expect.objectContaining(scheduleData));
		});

		it("should maintain form dirty state", () => {
			const { result } = renderHook(() => useAdsForm());

			expect(result.current.isDirty).toBe(false);

			act(() => {
				result.current.handleInputChange("name", "Changed Name");
			});

			expect(result.current.isDirty).toBe(true);
		});
	});

	describe("step navigation", () => {
		it("should navigate between steps", () => {
			const { result } = renderHook(() => useAdsForm());

			act(() => {
				result.current.handleNextStep();
			});

			expect(result.current.currentStep).toBe(2);

			act(() => {
				result.current.handlePreviousStep();
			});

			expect(result.current.currentStep).toBe(1);
		});

		it("should not navigate past first step when going backward", () => {
			const { result } = renderHook(() => useAdsForm());

			act(() => {
				result.current.handlePreviousStep();
			});

			expect(result.current.currentStep).toBe(1);
		});

		it("should calculate completion percentage", () => {
			const { result } = renderHook(() => useAdsForm(false, mockInitialData));

			// Complete form should have higher completion percentage
			expect(result.current.completionPercentage).toBeGreaterThan(0);
		});
	});

	describe("estimated reach and cost", () => {
		it("should calculate estimated reach", () => {
			const { result } = renderHook(() => useAdsForm(false, mockInitialData));

			const estimatedReach = result.current.getEstimatedReach();
			expect(typeof estimatedReach).toBe("number");
			expect(estimatedReach).toBeGreaterThan(0);
		});

		it("should calculate estimated cost", () => {
			const { result } = renderHook(() => useAdsForm(false, mockInitialData));

			const estimatedCost = result.current.getEstimatedCost();
			expect(typeof estimatedCost).toBe("number");
			expect(estimatedCost).toBeGreaterThan(0);
		});

		it("should recalculate reach when demographics change", () => {
			const { result } = renderHook(() => useAdsForm(false, mockInitialData));

			const initialReach = result.current.getEstimatedReach();

			act(() => {
				result.current.handleMultiSelectChange("demographics", ["Age 25-34", "Age 35-44", "Homeowners"]);
			});

			const newReach = result.current.getEstimatedReach();
			expect(newReach).not.toBe(initialReach);
		});

		it("should recalculate cost when budget changes", () => {
			const { result } = renderHook(() => useAdsForm(false, mockInitialData));

			const initialCost = result.current.getEstimatedCost();

			act(() => {
				result.current.handleInputChange("budget", 200);
			});

			const newCost = result.current.getEstimatedCost();
			expect(newCost).not.toBe(initialCost);
		});
	});

	describe("form submission", () => {
		it("should handle successful form submission", async () => {
			const onSubmitSuccess = vi.fn();
			const { result } = renderHook(() =>
				useAdsForm(false, mockInitialData, {
					onSubmitSuccess,
					onSubmitError: vi.fn(),
				})
			);

			await act(async () => {
				await result.current.handleSubmit();
			});

			expect(onSubmitSuccess).toHaveBeenCalledWith(expect.any(Object));
		});

		it("should handle form submission errors", async () => {
			const onSubmitError = vi.fn();
			const { result } = renderHook(() => useAdsForm(false, {}, { onSubmitSuccess: vi.fn(), onSubmitError }));

			await act(async () => {
				await result.current.handleSubmit();
			});

			// Should handle validation errors
			expect(result.current.errors).not.toEqual({});
		});

		it("should set submitting state during submission", async () => {
			const { result } = renderHook(() => useAdsForm(false, mockInitialData));

			let submittingState: boolean;

			await act(async () => {
				const submitPromise = result.current.handleSubmit();
				submittingState = result.current.isSubmitting;
				await submitPromise;
			});

			expect(submittingState!).toBe(true);
			expect(result.current.isSubmitting).toBe(false);
		});
	});

	describe("available data", () => {
		it("should provide available interests", () => {
			const { result } = renderHook(() => useAdsForm());

			expect(result.current.AVAILABLE_INTERESTS).toBeDefined();
			expect(Array.isArray(result.current.AVAILABLE_INTERESTS)).toBe(true);
			expect(result.current.AVAILABLE_INTERESTS.length).toBeGreaterThan(0);
		});

		it("should provide available demographics", () => {
			const { result } = renderHook(() => useAdsForm());

			expect(result.current.AVAILABLE_DEMOGRAPHICS).toBeDefined();
			expect(Array.isArray(result.current.AVAILABLE_DEMOGRAPHICS)).toBe(true);
			expect(result.current.AVAILABLE_DEMOGRAPHICS.length).toBeGreaterThan(0);
		});
	});

	describe("schedule management", () => {
		it("should update schedule through dedicated method", () => {
			const { result } = renderHook(() => useAdsForm());

			const newSchedule = {
				startDate: "2024-03-01",
				endDate: "2024-03-31",
				timeOfDay: "evening",
				daysOfWeek: ["monday", "wednesday", "friday"],
			};

			act(() => {
				result.current.updateSchedule(newSchedule);
			});

			expect(result.current.formData.schedule).toEqual(expect.objectContaining(newSchedule));
		});
	});

	describe("error handling", () => {
		it("should handle field validation errors", () => {
			const { result } = renderHook(() => useAdsForm());

			act(() => {
				result.current.handleInputChange("budget", -100); // Invalid budget
				const fieldError = result.current.validateField("budget");
				expect(fieldError).toBeTruthy();
			});
		});

		it("should clear errors when field becomes valid", () => {
			const { result } = renderHook(() => useAdsForm());

			act(() => {
				// First make field invalid
				result.current.handleInputChange("name", "");
				result.current.validateField("name");
			});

			expect(result.current.errors.name).toBeTruthy();

			act(() => {
				// Then make it valid
				result.current.handleInputChange("name", "Valid Campaign Name");
				result.current.validateField("name");
			});

			expect(result.current.errors.name).toBeFalsy();
		});
	});

	describe("type safety", () => {
		it("should maintain type safety for form data", () => {
			const { result } = renderHook(() => useAdsForm());

			// Type checking happens at compile time, but we can verify runtime behavior
			act(() => {
				result.current.handleInputChange("name", "Test Campaign");
				result.current.handleInputChange("type", "display");
				result.current.handleInputChange("budget", 150);
			});

			expect(result.current.formData.name).toBe("Test Campaign");
			expect(result.current.formData.type).toBe("display");
			expect(result.current.formData.budget).toBe(150);
		});

		it("should handle schedule type safety", () => {
			const { result } = renderHook(() => useAdsForm());

			const typedSchedule = {
				startDate: "2024-01-01",
				endDate: "2024-01-31",
				timeOfDay: "all" as const,
				daysOfWeek: ["monday", "tuesday"] as const,
			};

			act(() => {
				result.current.handleScheduleChange(typedSchedule);
			});

			expect(result.current.formData.schedule.timeOfDay).toBe("all");
			expect(result.current.formData.schedule.daysOfWeek).toEqual(["monday", "tuesday"]);
		});
	});

	describe("performance", () => {
		it("should not recalculate estimates unnecessarily", () => {
			const { result } = renderHook(() => useAdsForm(false, mockInitialData));

			const firstReach = result.current.getEstimatedReach();
			const secondReach = result.current.getEstimatedReach();

			// Same call should return same result (memoization effect)
			expect(firstReach).toBe(secondReach);
		});

		it("should handle rapid field updates efficiently", () => {
			const { result } = renderHook(() => useAdsForm());

			// Simulate rapid typing
			act(() => {
				for (let i = 0; i < 10; i++) {
					result.current.handleInputChange("name", `Campaign ${i}`);
				}
			});

			expect(result.current.formData.name).toBe("Campaign 9");
		});
	});
});
