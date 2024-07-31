import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@components/ui/form";
import { Input } from "@components/ui/input";

const businessVerificationSchema = z.object({
	ein: z.string().regex(/^\d{2}-\d{7}$/, { message: "Invalid EIN format. Must be XX-XXXXXXX." }),
	registrationDocument: z.array(z.any()).refine((files) => files.length > 0, { message: "Business registration document is required" }),
	businessLicense: z.array(z.any()).refine((files) => files.length > 0, { message: "Business license is required" }),
	proofOfOwnership: z.array(z.any()).refine((files) => files.length > 0, { message: "Proof of company ownership is required" }),
	ownerID: z.array(z.any()).refine((files) => files.length > 0, { message: "Owner's government-issued ID is required" }),
});

export default function BusinessVerification({ onNext, onBack }) {
	const formMethods = useForm({
		resolver: zodResolver(businessVerificationSchema),
		defaultValues: {
			ein: "",
			registrationDocument: [],
			businessLicense: [],
			proofOfOwnership: [],
			ownerID: [],
		},
	});

	const onSubmit = (values) => {
		console.log(values);
		onNext(values); // Call onNext to proceed to the next step
	};

	return (
		<>
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">Business Verification</h2>
			<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-400">Complete the form below to provide verification documents for your business.</p>
			<div className="flex flex-col mt-6">
				<FormProvider {...formMethods}>
					<Form {...formMethods}>
						<form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-10">
							<FormField
								control={formMethods.control}
								name="ein"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											EIN <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input {...field} placeholder="XX-XXXXXXX" className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={formMethods.control}
								name="registrationDocument"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Business Registration Document <span className="text-red-500">*</span>
										</FormLabel>
										<FormDescription>
											Proof that your business is registered with the state.
											<a href="https://www.nolo.com/legal-encyclopedia/registration-documents.html" target="_blank" rel="noopener noreferrer" className="text-blue-500">
												{" "}
												Example
											</a>
										</FormDescription>
										<FormControl>
											<Input type="file" onChange={(e) => formMethods.setValue("registrationDocument", Array.from(e.target.files))} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={formMethods.control}
								name="businessLicense"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Business License <span className="text-red-500">*</span>
										</FormLabel>
										<FormDescription>
											Permit issued by a government agency allowing you to conduct business.
											<a href="https://www.legalzoom.com/articles/what-is-a-business-license" target="_blank" rel="noopener noreferrer" className="text-blue-500">
												{" "}
												Example
											</a>
										</FormDescription>
										<FormControl>
											<Input type="file" onChange={(e) => formMethods.setValue("businessLicense", Array.from(e.target.files))} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={formMethods.control}
								name="proofOfOwnership"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Proof of Company Ownership <span className="text-red-500">*</span>
										</FormLabel>
										<FormDescription>
											Documents like stock certificates or articles of incorporation showing ownership.
											<a href="https://www.thebalancesmb.com/what-documents-are-needed-to-sell-your-small-business-4126245" target="_blank" rel="noopener noreferrer" className="text-blue-500">
												{" "}
												Example
											</a>
										</FormDescription>
										<FormControl>
											<Input type="file" onChange={(e) => formMethods.setValue("proofOfOwnership", Array.from(e.target.files))} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={formMethods.control}
								name="ownerID"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Owner&apos;s Government-Issued ID <span className="text-red-500">*</span>
										</FormLabel>
										<FormDescription>
											A government-issued ID for the business owner.
											<a href="https://www.dmv.org/id-cards.php" target="_blank" rel="noopener noreferrer" className="text-blue-500">
												{" "}
												Example
											</a>
										</FormDescription>
										<FormControl>
											<Input type="file" onChange={(e) => formMethods.setValue("ownerID", Array.from(e.target.files))} className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
				</FormProvider>
			</div>
		</>
	);
}
