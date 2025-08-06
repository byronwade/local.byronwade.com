/**
 * ContactInformationSection Component
 * Handles business contact information (address, phone, email, website)
 * Extracted from BusinessSubmissionForm for better modularity
 */

"use client";

import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { MapPin } from "lucide-react";

const ContactInformationSection = ({ form }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<MapPin className="h-5 w-5" />
					Contact Information
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Street Address */}
				<FormField
					control={form.control}
					name="address"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Street Address *</FormLabel>
							<FormControl>
								<Input {...field} placeholder="123 Main Street" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* City, State, ZIP */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<FormField
						control={form.control}
						name="city"
						render={({ field }) => (
							<FormItem>
								<FormLabel>City *</FormLabel>
								<FormControl>
									<Input {...field} placeholder="City" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="state"
						render={({ field }) => (
							<FormItem>
								<FormLabel>State *</FormLabel>
								<FormControl>
									<Input {...field} placeholder="State" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="zipCode"
						render={({ field }) => (
							<FormItem>
								<FormLabel>ZIP Code *</FormLabel>
								<FormControl>
									<Input {...field} placeholder="12345" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Phone and Email */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone Number *</FormLabel>
								<FormControl>
									<Input {...field} type="tel" placeholder="(555) 123-4567" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Business Email *</FormLabel>
								<FormControl>
									<Input {...field} type="email" placeholder="business@example.com" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Website */}
				<FormField
					control={form.control}
					name="website"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Website (Optional)</FormLabel>
							<FormControl>
								<Input {...field} type="url" placeholder="https://www.yourbusiness.com" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</CardContent>
		</Card>
	);
};

export default ContactInformationSection;
