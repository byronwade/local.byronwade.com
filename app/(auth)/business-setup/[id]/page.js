"use client";
import React, { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Badge } from "@components/ui/badge";
import { Alert, AlertDescription } from "@components/ui/alert";
import { Building2, MapPin, Phone, Globe, Mail, Clock, Camera, CreditCard, CheckCircle, Star, Info, Upload, Plus, X } from "lucide-react";
import { toast } from "@components/ui/use-toast";

const subscriptionTiers = [
	{
		value: "basic",
		name: "Basic",
		price: 49,
		features: ["Business listing with contact info", "Photo gallery (up to 10 photos)", "Basic business description", "Customer reviews", "Map integration"],
	},
	{
		value: "pro",
		name: "Pro",
		price: 79,
		features: ["Everything in Basic", "Unlimited photos", "Extended business description", "Business hours & services", "Special offers & promotions", "Priority listing placement"],
		popular: true,
	},
	{
		value: "premium",
		name: "Premium",
		price: 129,
		features: ["Everything in Pro", "Online booking integration", "Analytics dashboard", "Social media integration", "Custom branding options", "Featured directory placement"],
	},
];

const businessCategories = ["Restaurants & Food", "Health & Medical", "Home Services", "Retail & Shopping", "Professional Services", "Automotive", "Beauty & Wellness", "Education", "Entertainment", "Technology", "Real Estate", "Finance", "Legal"];

const businessHours = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function BusinessSetup() {
	const params = useParams();
	const searchParams = useSearchParams();
	const businessId = params.id;
	const hubSlug = searchParams.get("hub");

	const [currentStep, setCurrentStep] = useState(1);
	const [selectedTier, setSelectedTier] = useState("pro");
	const [businessData, setBusinessData] = useState({
		name: "",
		category: "",
		description: "",
		address: "",
		city: "",
		state: "",
		zipCode: "",
		phone: "",
		email: "",
		website: "",
		hours: {},
		services: [],
		photos: [],
	});
	const [newService, setNewService] = useState("");

	const handleInputChange = (field, value) => {
		setBusinessData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const addService = () => {
		if (newService.trim()) {
			setBusinessData((prev) => ({
				...prev,
				services: [...prev.services, newService.trim()],
			}));
			setNewService("");
		}
	};

	const removeService = (index) => {
		setBusinessData((prev) => ({
			...prev,
			services: prev.services.filter((_, i) => i !== index),
		}));
	};

	const handleNext = () => {
		if (currentStep < 4) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrevious = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleSubmit = () => {
		toast({
			title: "Setup Complete!",
			description: "Your business profile has been created successfully. Welcome to the directory!",
		});
		// In real implementation, this would submit the data and redirect
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<div className="space-y-6">
						<div className="text-center space-y-2">
							<h2 className="text-2xl font-bold">Welcome to Portland Business Directory!</h2>
							<p className="text-muted-foreground">You&apos;ve been invited to join our local business directory. Let&apos;s get your business set up.</p>
						</div>

						<Alert>
							<Info className="h-4 w-4" />
							<AlertDescription>This directory takes 20% of subscription fees. You keep 80% of what businesses pay.</AlertDescription>
						</Alert>

						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="business-name">Business Name *</Label>
									<Input id="business-name" value={businessData.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="Your Business Name" />
								</div>
								<div>
									<Label htmlFor="category">Category *</Label>
									<Select value={businessData.category} onValueChange={(value) => handleInputChange("category", value)}>
										<SelectTrigger>
											<SelectValue placeholder="Select category" />
										</SelectTrigger>
										<SelectContent>
											{businessCategories.map((category) => (
												<SelectItem key={category} value={category}>
													{category}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div>
								<Label htmlFor="description">Business Description</Label>
								<Textarea id="description" value={businessData.description} onChange={(e) => handleInputChange("description", e.target.value)} placeholder="Describe your business, services, and what makes you special..." rows={4} />
							</div>
						</div>
					</div>
				);

			case 2:
				return (
					<div className="space-y-6">
						<div className="text-center space-y-2">
							<h2 className="text-2xl font-bold">Contact Information</h2>
							<p className="text-muted-foreground">Help customers find and contact your business.</p>
						</div>

						<div className="space-y-4">
							<div>
								<Label htmlFor="address">Street Address *</Label>
								<Input id="address" value={businessData.address} onChange={(e) => handleInputChange("address", e.target.value)} placeholder="123 Main Street" />
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<Label htmlFor="city">City *</Label>
									<Input id="city" value={businessData.city} onChange={(e) => handleInputChange("city", e.target.value)} placeholder="Portland" />
								</div>
								<div>
									<Label htmlFor="state">State</Label>
									<Input id="state" value={businessData.state} onChange={(e) => handleInputChange("state", e.target.value)} placeholder="OR" />
								</div>
								<div>
									<Label htmlFor="zip">ZIP Code</Label>
									<Input id="zip" value={businessData.zipCode} onChange={(e) => handleInputChange("zipCode", e.target.value)} placeholder="97201" />
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="phone">Phone Number *</Label>
									<Input id="phone" value={businessData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="(503) 555-0123" />
								</div>
								<div>
									<Label htmlFor="email">Email Address *</Label>
									<Input id="email" type="email" value={businessData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="info@yourbusiness.com" />
								</div>
							</div>

							<div>
								<Label htmlFor="website">Website</Label>
								<Input id="website" value={businessData.website} onChange={(e) => handleInputChange("website", e.target.value)} placeholder="https://www.yourbusiness.com" />
							</div>
						</div>
					</div>
				);

			case 3:
				return (
					<div className="space-y-6">
						<div className="text-center space-y-2">
							<h2 className="text-2xl font-bold">Choose Your Plan</h2>
							<p className="text-muted-foreground">Select the subscription tier that best fits your business needs.</p>
						</div>

						<div className="grid gap-6 md:grid-cols-3">
							{subscriptionTiers.map((tier) => (
								<Card key={tier.value} className={`cursor-pointer transition-all ${selectedTier === tier.value ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"} ${tier.popular ? "relative" : ""}`} onClick={() => setSelectedTier(tier.value)}>
									{tier.popular && (
										<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
											<Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
										</div>
									)}
									<CardHeader className="text-center">
										<CardTitle className="text-xl">{tier.name}</CardTitle>
										<div className="text-3xl font-bold">
											${tier.price}
											<span className="text-sm font-normal text-muted-foreground">/month</span>
										</div>
									</CardHeader>
									<CardContent>
										<ul className="space-y-2">
											{tier.features.map((feature, index) => (
												<li key={index} className="flex items-center text-sm">
													<CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
													{feature}
												</li>
											))}
										</ul>
									</CardContent>
								</Card>
							))}
						</div>

						<div className="text-center p-4 bg-muted/50 rounded-lg">
							<p className="text-sm text-muted-foreground">
								<strong>Revenue Sharing:</strong> The directory owner keeps 80% of your subscription fee. Platform takes 20% for hosting and maintenance.
							</p>
						</div>
					</div>
				);

			case 4:
				return (
					<div className="space-y-6">
						<div className="text-center space-y-2">
							<h2 className="text-2xl font-bold">Services & Details</h2>
							<p className="text-muted-foreground">Add your services and any additional details about your business.</p>
						</div>

						<div className="space-y-4">
							<div>
								<Label>Services Offered</Label>
								<div className="flex space-x-2 mt-1">
									<Input value={newService} onChange={(e) => setNewService(e.target.value)} placeholder="Add a service..." onKeyPress={(e) => e.key === "Enter" && addService()} />
									<Button type="button" onClick={addService}>
										<Plus className="w-4 h-4" />
									</Button>
								</div>
								{businessData.services.length > 0 && (
									<div className="flex flex-wrap gap-2 mt-2">
										{businessData.services.map((service, index) => (
											<Badge key={index} variant="secondary" className="flex items-center gap-1">
												{service}
												<X className="w-3 h-3 cursor-pointer" onClick={() => removeService(index)} />
											</Badge>
										))}
									</div>
								)}
							</div>

							<div>
								<Label>Business Photos</Label>
								<div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
									<Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
									<p className="text-sm text-muted-foreground">Drag & drop photos here or click to upload</p>
									<Button variant="outline" className="mt-2">
										Choose Files
									</Button>
								</div>
							</div>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-background py-12">
			<div className="container mx-auto px-4 max-w-4xl">
				{/* Progress Bar */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium">Step {currentStep} of 4</span>
						<span className="text-sm text-muted-foreground">{Math.round((currentStep / 4) * 100)}% Complete</span>
					</div>
					<div className="w-full bg-muted rounded-full h-2">
						<div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / 4) * 100}%` }} />
					</div>
				</div>

				{/* Main Content */}
				<Card>
					<CardContent className="p-8">
						{renderStepContent()}

						{/* Navigation Buttons */}
						<div className="flex justify-between pt-8 border-t">
							<Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
								Previous
							</Button>
							{currentStep < 4 ? <Button onClick={handleNext}>Next</Button> : <Button onClick={handleSubmit}>Complete Setup</Button>}
						</div>
					</CardContent>
				</Card>

				{/* Help Section */}
				<Card className="mt-6">
					<CardContent className="p-6">
						<div className="flex items-start space-x-4">
							<Info className="w-5 h-5 text-blue-500 mt-0.5" />
							<div>
								<h4 className="font-medium mb-1">Need Help?</h4>
								<p className="text-sm text-muted-foreground mb-2">If you have questions about setting up your business profile, we&apos;re here to help.</p>
								<Button variant="outline" size="sm">
									Contact Support
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
