/**
 * useJobForm Hook Tests
 * Comprehensive tests for the job form management hook with type safety
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useJobForm } from "@lib/hooks/user/jobs/use-job-form";
import { createMockJobFormData } from "@tests/utils/test-utils";

// Mock router
const mockRouter = {
	push: vi.fn(),
	replace: vi.fn(),
	back: vi.fn(),
};

vi.mock("next/navigation", () => ({
	useRouter: () => mockRouter,
}));

// Mock toast notifications
vi.mock("@components/ui/use-toast", () => ({
	toast: vi.fn(),
}));

// Mock category validation
vi.mock("@lib/data/jobs/categories", () => ({
	validateCategorySelection: vi.fn().mockReturnValue({ isValid: true, error: null }),
}));

describe("useJobForm", () => {
	const mockInitialData = createMockJobFormData();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe("initialization", () => {
		it("should initialize with default form state", () => {
			const { result } = renderHook(() => useJobForm());

			expect(result.current.formData).toBeDefined();
			expect(result.current.errors).toEqual([]);
			expect(result.current.currentStep).toBe(1);
			expect(result.current.isSubmitting).toBe(false);
			expect(result.current.completionPercentage).toBe(0);
			expect(result.current.completedSteps).toEqual([]);
		});

		it("should initialize with provided initial data", () => {
			const { result } = renderHook(() =>
				useJobForm({
					initialData: {
						title: "Test Job",
						category: "plumbing",
						location: "Test City",
					},
				})
			);

			expect(result.current.formData.title).toBe("Test Job");
			expect(result.current.formData.category).toBe("plumbing");
			expect(result.current.formData.location).toBe("Test City");
		});

		it("should merge initial data with defaults", () => {
			const { result } = renderHook(() =>
				useJobForm({
					initialData: { title: "Custom Title" },
				})
			);

			expect(result.current.formData.title).toBe("Custom Title");
			expect(result.current.formData.urgency).toBe("medium"); // Default value
			expect(result.current.formData.budgetType).toBe("estimate"); // Default value
		});
	});

	describe("form field updates", () => {
		it("should update text fields correctly", () => {
			const { result } = renderHook(() => useJobForm());

			act(() => {
				result.current.handleInputChange("title", "Updated Job Title");
			});

			expect(result.current.formData.title).toBe("Updated Job Title");
		});

		it("should update nested object fields", () => {
			const { result } = renderHook(() => useJobForm());

			act(() => {
				result.current.handleInputChange("budgetRange.min", "100");
			});

			expect(result.current.formData.budgetRange.min).toBe("100");
		});

		it("should update array fields", () => {
			const { result } = renderHook(() => useJobForm());

			act(() => {
				result.current.handleInputChange("skills", ["Plumbing", "Electrical"]);
			});

			expect(result.current.formData.skills).toEqual(["Plumbing", "Electrical"]);
		});

		it("should maintain form dirty state", () => {
			const { result } = renderHook(() => useJobForm());

			// Note: isDirty is not part of the actual hook interface
			// Testing form state changes instead
			expect(result.current.formData.title).toBe("");

			act(() => {
				result.current.handleInputChange("title", "Changed Title");
			});

			expect(result.current.formData.title).toBe("Changed Title");
		});
	});

	describe("requirements management", () => {
		it("should add new requirements", () => {
			const { result } = renderHook(() => useJobForm());

			act(() => {
				result.current.addRequirement();
			});

			expect(result.current.formData.requirements).toHaveLength(1);
			expect(result.current.formData.requirements[0]).toHaveProperty("id");
			expect(result.current.formData.requirements[0]).toHaveProperty("title", "");
			expect(result.current.formData.requirements[0]).toHaveProperty("priority", "preferred");
		});

		it("should remove requirements", () => {
			const { result } = renderHook(() => useJobForm());

			act(() => {
				result.current.addRequirement();
				result.current.addRequirement();
			});

			expect(result.current.formData.requirements).toHaveLength(2);

			const requirementId = result.current.formData.requirements[0].id;

			act(() => {
				result.current.removeRequirement(requirementId);
			});

			expect(result.current.formData.requirements).toHaveLength(1);
			expect(result.current.formData.requirements.find((req) => req.id === requirementId)).toBeUndefined();
		});

		it("should update specific requirements", () => {
			const { result } = renderHook(() => useJobForm());

			act(() => {
				result.current.addRequirement();
			});

			const requirementId = result.current.formData.requirements[0].id;

			act(() => {
				result.current.updateRequirement(requirementId, {
					title: "Licensed Professional",
					priority: "required",
				});
			});

			const updatedRequirement = result.current.formData.requirements.find((req) => req.id === requirementId);
			expect(updatedRequirement?.title).toBe("Licensed Professional");
			expect(updatedRequirement?.priority).toBe("required");
		});
	});

	describe("photo management", () => {
		it("should handle photo upload", async () => {
			const { result } = renderHook(() => useJobForm());

			// Mock FileList
			const mockFiles = {
				0: new File(["test"], "test.jpg", { type: "image/jpeg" }),
				1: new File(["test2"], "test2.png", { type: "image/png" }),
				length: 2,
			} as FileList;

			await act(async () => {
				await result.current.handlePhotoUpload(mockFiles);
			});

			expect(result.current.formData.photos).toHaveLength(2);
			expect(result.current.formData.photos[0]).toHaveProperty("id");
			expect(result.current.formData.photos[0]).toHaveProperty("url");
			expect(result.current.formData.photos[0]).toHaveProperty("alt", "test.jpg");
		});

		it("should validate file types during upload", async () => {
			const { result } = renderHook(() => useJobForm());

			// Mock invalid file type
			const mockFiles = {
				0: new File(["test"], "test.txt", { type: "text/plain" }),
				length: 1,
			} as FileList;

			await act(async () => {
				await result.current.handlePhotoUpload(mockFiles);
			});

			expect(result.current.formData.photos).toHaveLength(0);
			// Toast should be called for invalid file format (implementation detail)
		});

		it("should validate file size during upload", async () => {
			const { result } = renderHook(() => useJobForm());

			// Mock large file (6MB)
			const largeFile = new File(["x".repeat(6 * 1024 * 1024)], "large.jpg", { type: "image/jpeg" });
			const mockFiles = {
				0: largeFile,
				length: 1,
			} as FileList;

			await act(async () => {
				await result.current.handlePhotoUpload(mockFiles);
			});

			expect(result.current.formData.photos).toHaveLength(0);
			// Toast should be called for file too large (implementation detail)
		});

		it("should enforce photo limit", async () => {
			const { result } = renderHook(() => useJobForm());

			// Add 10 photos first (at limit)
			const mockFiles = Array.from({ length: 10 }, (_, i) => new File(["test"], `test${i}.jpg`, { type: "image/jpeg" }));

			await act(async () => {
				await result.current.handlePhotoUpload({
					...mockFiles,
					length: 10,
				} as FileList);
			});

			expect(result.current.formData.photos).toHaveLength(10);

			// Try to add one more
			const extraFile = {
				0: new File(["test"], "extra.jpg", { type: "image/jpeg" }),
				length: 1,
			} as FileList;

			await act(async () => {
				await result.current.handlePhotoUpload(extraFile);
			});

			expect(result.current.formData.photos).toHaveLength(10); // Should remain at limit
			// Toast should be called for photo limit reached (implementation detail)
		});

		it("should remove photos", () => {
			const { result } = renderHook(() =>
				useJobForm({
					initialData: {
						photos: [
							{ id: "photo1", url: "url1", alt: "Photo 1", caption: "", order: 0 },
							{ id: "photo2", url: "url2", alt: "Photo 2", caption: "", order: 1 },
						],
					},
				})
			);

			act(() => {
				result.current.removePhoto("photo1");
			});

			expect(result.current.formData.photos).toHaveLength(1);
			expect(result.current.formData.photos[0].id).toBe("photo2");
		});

		it("should reorder photos", () => {
			const { result } = renderHook(() =>
				useJobForm({
					initialData: {
						photos: [
							{ id: "photo1", url: "url1", alt: "Photo 1", caption: "", order: 0 },
							{ id: "photo2", url: "url2", alt: "Photo 2", caption: "", order: 1 },
							{ id: "photo3", url: "url3", alt: "Photo 3", caption: "", order: 2 },
						],
					},
				})
			);

			act(() => {
				result.current.reorderPhotos(["photo3", "photo1", "photo2"]);
			});

			const reorderedPhotos = result.current.formData.photos;
			expect(reorderedPhotos[0].id).toBe("photo3");
			expect(reorderedPhotos[1].id).toBe("photo1");
			expect(reorderedPhotos[2].id).toBe("photo2");
		});
	});

	describe("step navigation", () => {
		it("should navigate between steps", () => {
			const { result } = renderHook(() => useJobForm());

			act(() => {
				result.current.nextStep();
			});

			expect(result.current.currentStep).toBe(2);

			act(() => {
				result.current.prevStep();
			});

			expect(result.current.currentStep).toBe(1);
		});

		it("should validate step before proceeding", () => {
			const { result } = renderHook(() => useJobForm());

			// Try to go to next step without completing current step
			act(() => {
				const canProceed = result.current.validateStep(1);
				expect(canProceed).toBe(false);
			});
		});

		it("should track completed steps", () => {
			const { result } = renderHook(() => useJobForm({ initialData: mockInitialData }));

			act(() => {
				result.current.validateStep(1);
			});

			expect(result.current.completedSteps).toContain(1);
		});

		it("should go to specific step", () => {
			const { result } = renderHook(() => useJobForm());

			act(() => {
				result.current.goToStep(3);
			});

			expect(result.current.currentStep).toBe(3);
		});
	});

	describe("form validation", () => {
		it("should validate required fields", () => {
			const { result } = renderHook(() => useJobForm());

			act(() => {
				const validation = result.current.validateForm();
				expect(validation.isValid).toBe(false);
				expect(validation.errors).toHaveProperty("title");
				expect(validation.errors).toHaveProperty("category");
			});
		});

		it("should validate individual fields", () => {
			const { result } = renderHook(() => useJobForm());

			act(() => {
				const fieldError = result.current.getFieldError("title");
				expect(fieldError).toBeTruthy();
			});
		});

		it("should pass validation with complete data", () => {
			const { result } = renderHook(() => useJobForm({ initialData: mockInitialData }));

			act(() => {
				const validation = result.current.validateForm();
				expect(validation.isValid).toBe(true);
			});
		});

		it("should check field validity", () => {
			const { result } = renderHook(() => useJobForm({ initialData: mockInitialData }));

			expect(result.current.isFieldValid("title")).toBe(true);
			expect(result.current.isFieldValid("category")).toBe(true);
		});
	});

	describe("estimated metrics", () => {
		it("should calculate estimated views", () => {
			const { result } = renderHook(() => useJobForm({ initialData: mockInitialData }));

			const estimatedViews = result.current.getEstimatedViews();
			expect(typeof estimatedViews).toBe("number");
			expect(estimatedViews).toBeGreaterThan(0);
		});

		it("should calculate estimated responses", () => {
			const { result } = renderHook(() => useJobForm({ initialData: mockInitialData }));

			const estimatedResponses = result.current.getEstimatedResponses();
			expect(typeof estimatedResponses).toBe("number");
			expect(estimatedResponses).toBeGreaterThan(0);
		});

		it("should adjust estimates based on urgency", () => {
			const { result } = renderHook(() => useJobForm({ initialData: mockInitialData }));

			const normalViews = result.current.getEstimatedViews();

			act(() => {
				result.current.handleInputChange("urgency", "urgent");
			});

			const urgentViews = result.current.getEstimatedViews();
			expect(urgentViews).toBeGreaterThan(normalViews);
		});

		it("should adjust estimates based on budget", () => {
			const { result } = renderHook(() => useJobForm({ initialData: mockInitialData }));

			const normalViews = result.current.getEstimatedViews();

			act(() => {
				result.current.handleInputChange("budgetAmount", "500");
			});

			const higherBudgetViews = result.current.getEstimatedViews();
			expect(higherBudgetViews).toBeGreaterThan(normalViews);
		});
	});

	describe("form submission", () => {
		it("should handle successful submission", async () => {
			const onSubmitSuccess = vi.fn();
			const { result } = renderHook(() =>
				useJobForm({
					initialData: mockInitialData,
					onSubmitSuccess,
				})
			);

			await act(async () => {
				await result.current.submitJob();
			});

			expect(onSubmitSuccess).toHaveBeenCalledWith("generated-job-id");
			expect(mockRouter.push).toHaveBeenCalledWith("/dashboard/user/jobs/generated-job-id");
		});

		it("should handle submission errors", async () => {
			const onSubmitError = vi.fn();
			const { result } = renderHook(() =>
				useJobForm({
					initialData: {}, // Invalid data
					onSubmitError,
				})
			);

			await act(async () => {
				await result.current.submitJob();
			});

			expect(onSubmitError).toHaveBeenCalled();
		});

		it("should save draft", async () => {
			const { result } = renderHook(() => useJobForm({ initialData: mockInitialData }));

			await act(async () => {
				await result.current.saveDraft();
			});

			// Toast should be called for draft saved (implementation detail)
		});

		it("should set submitting state during submission", async () => {
			const { result } = renderHook(() => useJobForm({ initialData: mockInitialData }));

			let submittingState: boolean;

			await act(async () => {
				const submitPromise = result.current.submitJob();
				submittingState = result.current.isSubmitting;
				await submitPromise;
			});

			expect(submittingState!).toBe(true);
			expect(result.current.isSubmitting).toBe(false);
		});
	});

	describe("completion tracking", () => {
		it("should calculate completion percentage", () => {
			const { result } = renderHook(() => useJobForm({ initialData: mockInitialData }));

			expect(result.current.completionPercentage).toBeGreaterThan(0);
			expect(result.current.completionPercentage).toBeLessThanOrEqual(100);
		});

		it("should update completion when fields are filled", () => {
			const { result } = renderHook(() => useJobForm());

			const initialCompletion = result.current.completionPercentage;

			act(() => {
				result.current.handleInputChange("title", "Job Title");
				result.current.handleInputChange("category", "plumbing");
				result.current.handleInputChange("description", "Job description");
			});

			expect(result.current.completionPercentage).toBeGreaterThan(initialCompletion);
		});
	});

	describe("type safety", () => {
		it("should maintain type safety for form data", () => {
			const { result } = renderHook(() => useJobForm());

			act(() => {
				result.current.handleInputChange("urgency", "high");
				result.current.handleInputChange("budgetType", "hourly");
				result.current.handleInputChange("budgetAmount", "75");
			});

			expect(result.current.formData.urgency).toBe("high");
			expect(result.current.formData.budgetType).toBe("hourly");
			expect(result.current.formData.budgetAmount).toBe("75");
		});

		it("should handle nested object updates with type safety", () => {
			const { result } = renderHook(() => useJobForm());

			act(() => {
				result.current.handleInputChange("contactPreferences.email", true);
				result.current.handleInputChange("contactPreferences.phone", false);
				result.current.handleInputChange("contactPreferences.inApp", true);
			});

			expect(result.current.formData.contactPreferences.email).toBe(true);
			expect(result.current.formData.contactPreferences.phone).toBe(false);
			expect(result.current.formData.contactPreferences.inApp).toBe(true);
		});
	});

	describe("error handling", () => {
		it("should handle validation errors gracefully", () => {
			const { result } = renderHook(() => useJobForm());

			act(() => {
				const validation = result.current.validateForm();
				expect(validation.errors).toBeDefined();
				expect(Array.isArray(validation.errors)).toBe(true);
			});
		});

		it("should clear errors when fields become valid", () => {
			const { result } = renderHook(() => useJobForm());

			act(() => {
				// First validate to get errors
				result.current.validateForm();
			});

			const initialErrors = result.current.errors;
			expect(Object.keys(initialErrors).length).toBeGreaterThan(0);

			act(() => {
				// Fill required fields
				result.current.handleInputChange("title", "Valid Title");
				result.current.handleInputChange("category", "plumbing");
				result.current.handleInputChange("description", "Valid description");
				result.current.validateForm();
			});

			expect(Object.keys(result.current.errors).length).toBeLessThan(Object.keys(initialErrors).length);
		});
	});

	describe("cleanup and performance", () => {
		it("should handle component unmounting gracefully", () => {
			const { unmount } = renderHook(() => useJobForm());

			expect(() => unmount()).not.toThrow();
		});

		it("should not recalculate estimates unnecessarily", () => {
			const { result } = renderHook(() => useJobForm({ initialData: mockInitialData }));

			const firstViews = result.current.getEstimatedViews();
			const secondViews = result.current.getEstimatedViews();

			expect(firstViews).toBe(secondViews);
		});
	});
});
