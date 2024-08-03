import React from "react";
import { useFormContext } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";

export default function BusinessAddress() {
	const { control } = useFormContext();

	return (
		<>
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left">Business Address</h2>
			<p className="text-sm leading-6 text-left text-muted-foreground">Complete the form below to provide your business address.</p>
			<div className="flex flex-col mt-6 space-y-6">
				<FormField
					control={control}
					name="businessAddress.street"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>
								Street <span className="text-red-500">*</span>
							</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage>{fieldState.error?.message}</FormMessage>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="businessAddress.city"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>
								City <span className="text-red-500">*</span>
							</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage>{fieldState.error?.message}</FormMessage>
						</FormItem>
					)}
				/>
				<div className="flex space-x-4">
					<FormField
						control={control}
						name="businessAddress.state"
						render={({ field, fieldState }) => (
							<FormItem className="flex-1">
								<FormLabel>
									State <span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage>{fieldState.error?.message}</FormMessage>
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="businessAddress.zip"
						render={({ field, fieldState }) => (
							<FormItem className="flex-1">
								<FormLabel>
									ZIP Code <span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage>{fieldState.error?.message}</FormMessage>
							</FormItem>
						)}
					/>
				</div>
			</div>
		</>
	);
}
