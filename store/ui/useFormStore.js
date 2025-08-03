import { create } from "zustand";

const useFormStore = create((set) => ({
	formData: {
		user: {
			username: "",
			first_name: "",
			last_name: "",
			phone_number: "",
			email: "",
			password: "",
			address: { street: "", city: "", state: "", zip: "" },
		},
		business: {
			firstName: "",
			lastName: "",
			businessName: "",
			service: "",
			phoneNumber: "",
			businessPhoneNumber: "",
			email: "",
			address: { street: "", city: "", state: "", zip: "" },
			ein: "",
			serviceArea: 50,
			proofOfOwnership: [],
			insurance: [],
		},
	},
	currentStep: 0,
	setUserFormData: (newData) =>
		set((state) => ({
			formData: {
				...state.formData,
				user: { ...state.formData.user, ...newData },
			},
		})),
	setBusinessFormData: (newData) =>
		set((state) => ({
			formData: {
				...state.formData,
				business: { ...state.formData.business, ...newData },
			},
		})),
	setCurrentStep: (step) => set({ currentStep: step }),
}));

export default useFormStore;
