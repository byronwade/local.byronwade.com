import { z } from "zod";

const phoneNumberSchema = z.string().regex(/^(\+1|1)?\s*\-?\s*(\([2-9][0-9]{2}\)|[2-9][0-9]{2})\s*\-?\s*[2-9][0-9]{2}\s*\-?\s*[0-9]{4}$/, { message: "Invalid phone number" });
const addressSchema = z.object({
	street: z.string().nonempty({ message: "Street is required" }),
	city: z.string().nonempty({ message: "City is required" }),
	state: z.string().nonempty({ message: "State is required" }),
	zip: z.string().regex(/^\d{5}$/, { message: "Invalid ZIP code. Must be 5 digits." }),
});

export const userSignupSchema = z.object({
	username: z.string().nonempty({ message: "Username is required" }),
	first_name: z.string().nonempty({ message: "First name is required" }),
	last_name: z.string().nonempty({ message: "Last name is required" }),
	phone_number: phoneNumberSchema,
	email: z.string().email({ message: "Invalid email address" }),
	password: z.string().min(6, { message: "Password must be at least 6 characters" }),
	address: addressSchema,
});

export const businessSignupSchema = z.object({
	firstName: z.string().nonempty({ message: "First name is required" }),
	lastName: z.string().nonempty({ message: "Last name is required" }),
	businessName: z.string().nonempty({ message: "Business name is required" }),
	service: z.string().nonempty({ message: "Service is required" }),
	phoneNumber: phoneNumberSchema,
	businessPhoneNumber: phoneNumberSchema,
	email: z.string().email({ message: "Invalid email address" }),
	address: addressSchema,
	ein: z.string().regex(/^\d{2}-\d{7}$/, { message: "Invalid EIN format. Must be XX-XXXXXXX." }),
	serviceArea: z.number().min(1, { message: "Service area must be at least 1 mile" }).max(100, { message: "Service area can't exceed 100 miles" }),
	proofOfOwnership: z.array(z.any()).refine((files) => files.length > 0, { message: "Proof of ownership is required" }),
	insurance: z.array(z.any()).refine((files) => files.length > 0, { message: "Company insurance is required" }),
});

export const userFormFields = [
	{ name: "username", label: "Username", type: "text", validation: userSignupSchema.shape.username },
	{ name: "first_name", label: "First Name", type: "text", validation: userSignupSchema.shape.first_name },
	{ name: "last_name", label: "Last Name", type: "text", validation: userSignupSchema.shape.last_name },
	{ name: "phone_number", label: "Mobile Number", type: "text", validation: userSignupSchema.shape.phone_number },
	{ name: "email", label: "Email", type: "email", validation: userSignupSchema.shape.email },
	{ name: "password", label: "Password", type: "password", validation: userSignupSchema.shape.password },
	{ name: "address.street", label: "Street", type: "text", validation: addressSchema.shape.street },
	{ name: "address.city", label: "City", type: "text", validation: addressSchema.shape.city },
	{ name: "address.state", label: "State", type: "text", validation: addressSchema.shape.state },
	{ name: "address.zip", label: "ZIP Code", type: "text", validation: addressSchema.shape.zip },
];

export const businessFormFields = [
	{ name: "firstName", label: "First Name", type: "text", validation: businessSignupSchema.shape.firstName },
	{ name: "lastName", label: "Last Name", type: "text", validation: businessSignupSchema.shape.lastName },
	{ name: "businessName", label: "Business Name", type: "text", validation: businessSignupSchema.shape.businessName },
	{
		name: "service",
		label: "Service Offered",
		type: "select",
		validation: businessSignupSchema.shape.service,
		options: [
			{ value: "plumbing", label: "Plumbing" },
			{ value: "water_heater_installation", label: "Water Heater Installation" },
		],
	},
	{ name: "phoneNumber", label: "Mobile Number", type: "text", validation: businessSignupSchema.shape.phoneNumber },
	{ name: "businessPhoneNumber", label: "Business Phone Number", type: "text", validation: businessSignupSchema.shape.businessPhoneNumber },
	{ name: "email", label: "Email", type: "email", validation: businessSignupSchema.shape.email },
	{ name: "address.street", label: "Street", type: "text", validation: addressSchema.shape.street },
	{ name: "address.city", label: "City", type: "text", validation: addressSchema.shape.city },
	{ name: "address.state", label: "State", type: "text", validation: addressSchema.shape.state },
	{ name: "address.zip", label: "ZIP Code", type: "text", validation: addressSchema.shape.zip },
	{ name: "ein", label: "EIN", type: "text", validation: businessSignupSchema.shape.ein },
	{ name: "serviceArea", label: "Service Area (miles)", type: "slider", validation: businessSignupSchema.shape.serviceArea },
	{ name: "proofOfOwnership", label: "Proof of Company Ownership", type: "file", validation: businessSignupSchema.shape.proofOfOwnership },
	{ name: "insurance", label: "Company Insurance", type: "file", validation: businessSignupSchema.shape.insurance },
];
