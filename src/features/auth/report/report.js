"use client";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";

const reportSchema = z.object({
	subject: z.string().nonempty({ message: "Subject is required" }),
	message: z.string().nonempty({ message: "Message is required" }),
	userName: z.string().nonempty({ message: "Name is required" }),
	userEmail: z.string().email({ message: "Invalid email address" }).nonempty({ message: "Email is required" }),
});

export default function Report() {
	const formMethods = useForm({
		resolver: zodResolver(reportSchema),
		defaultValues: {
			subject: "",
			message: "",
			userName: "",
			userEmail: "",
		},
	});

	const onSubmit = (values) => {
		console.log(values);
	};

	return (
		<>
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left ">Report a Business</h2>
			<p className="text-sm leading-6 text-left text-muted-foreground">Please provide the details of the business you want to report.</p>
			<div className="flex flex-col mt-6">
				<FormProvider {...formMethods}>
					<Form {...formMethods}>
						<form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-10">
							<FormField
								control={formMethods.control}
								name="subject"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Subject</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={formMethods.control}
								name="message"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Message</FormLabel>
										<FormControl>
											<Textarea {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={formMethods.control}
								name="userName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={formMethods.control}
								name="userEmail"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input {...field} type="email" />
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
