"use client";
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Badge } from "@components/ui/badge";
import { Alert, AlertDescription } from "@components/ui/alert";
import { Building2, MapPin, Phone, Globe, Mail, Clock, Camera, CreditCard, CheckCircle, Star, Info, Upload, Plus, X, Save, AlertTriangle } from "lucide-react";
import { toast } from "@components/ui/use-toast";
import { BusinessForm } from "@/components/auth/forms/BusinessForm";

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

export default function FormPage() {
	const params = useParams();
	// The formType can be 'add-a-business', 'claim-a-business', etc.
	const formType = params.formId;

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
			<BusinessForm formType={formType} />
		</div>
	);
}
