/**
 * BasicInformationSection Component
 * Handles basic business information input (name, description, category)
 * Extracted from BusinessSubmissionForm for better modularity
 */

"use client";

import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Building } from "lucide-react";
import { BUSINESS_CATEGORIES } from "@lib/data/business/submission/constants";

const BasicInformationSection = ({ form }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Building className="h-5 w-5" />
					Basic Information
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Business Name */}
				<FormField
					control={form.control}
					name="businessName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Business Name *</FormLabel>
							<FormControl>
								<Input {...field} placeholder="Enter your business name" className="w-full" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Business Description */}
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Business Description *</FormLabel>
							<FormControl>
								<Textarea {...field} placeholder="Describe your business, services, and what makes you unique..." rows={4} className="w-full resize-none" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Category Selection */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="category"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Business Category *</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a category" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{BUSINESS_CATEGORIES.map((category) => (
											<SelectItem key={category} value={category}>
												{category}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Subcategory (optional) */}
					<FormField
						control={form.control}
						name="subcategory"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Subcategory (Optional)</FormLabel>
								<FormControl>
									<Input {...field} placeholder="e.g., Italian Restaurant, Hair Salon" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</CardContent>
		</Card>
	);
};

export default BasicInformationSection;
