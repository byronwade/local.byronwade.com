"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { Switch } from "@components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Badge } from "@components/ui/badge";
import { Palette, Upload, Eye, Save, RotateCcw, Settings, Type, Image as ImageIcon, Layout, Smartphone, Monitor, Tablet, Globe, Crown, Zap, Check } from "lucide-react";
import { toast } from "@components/ui/use-toast";

const colorSchemes = [
	{ name: "Ocean Blue", primary: "#0ea5e9", secondary: "#06b6d4", accent: "#3b82f6" },
	{ name: "Forest Green", primary: "#10b981", secondary: "#059669", accent: "#34d399" },
	{ name: "Sunset Orange", primary: "#f97316", secondary: "#ea580c", accent: "#fb923c" },
	{ name: "Royal Purple", primary: "#8b5cf6", secondary: "#7c3aed", accent: "#a78bfa" },
	{ name: "Rose Pink", primary: "#ec4899", secondary: "#db2777", accent: "#f472b6" },
	{ name: "Custom", primary: "#6366f1", secondary: "#4f46e5", accent: "#818cf8" },
];

const layoutTemplates = [
	{
		id: "modern",
		name: "Modern Grid",
		description: "Clean grid layout with large business cards",
		preview: "/api/placeholder/300/200",
	},
	{
		id: "classic",
		name: "Classic List",
		description: "Traditional list view with detailed information",
		preview: "/api/placeholder/300/200",
	},
	{
		id: "compact",
		name: "Compact Tiles",
		description: "Space-efficient tile layout",
		preview: "/api/placeholder/300/200",
	},
];

const fontOptions = [
	{ name: "Inter", family: "Inter, sans-serif", weight: "300,400,500,600,700" },
	{ name: "Roboto", family: "Roboto, sans-serif", weight: "300,400,500,700" },
	{ name: "Open Sans", family: "Open Sans, sans-serif", weight: "300,400,600,700" },
	{ name: "Poppins", family: "Poppins, sans-serif", weight: "300,400,500,600,700" },
	{ name: "Lato", family: "Lato, sans-serif", weight: "300,400,700" },
];

export default function Customization() {
	const [selectedColorScheme, setSelectedColorScheme] = useState("Ocean Blue");
	const [selectedLayout, setSelectedLayout] = useState("modern");
	const [selectedFont, setSelectedFont] = useState("Inter");
	const [settings, setSettings] = useState({
		siteName: "Portland LocalHub",
		tagline: "Discover Local Businesses",
		enableReviews: true,
		enableBookings: true,
		enablePhotos: true,
		showBusinessHours: true,
		allowBusinessClaims: true,
	});

	const handleSaveSettings = () => {
		toast({
			title: "Settings Saved",
			description: "Your customization settings have been updated successfully.",
		});
	};

	return (
		<div className="w-full px-4 py-16 space-y-8 lg:px-24">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-bold">Directory Customization</h1>
					<p className="mt-2 text-muted-foreground">Customize your directory&apos;s appearance, branding, and functionality to match your vision.</p>
				</div>
				<div className="flex items-center gap-3">
					<Button variant="outline" size="sm">
						<Eye className="w-4 h-4 mr-2" />
						Preview Changes
					</Button>
					<Button size="sm" onClick={handleSaveSettings}>
						<Save className="w-4 h-4 mr-2" />
						Save Changes
					</Button>
				</div>
			</div>

			{/* Appearance Settings */}
			<div className="space-y-6">
				{/* Color Schemes */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<Palette className="w-5 h-5 mr-2" />
							Color Scheme
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 md:grid-cols-3">
							{colorSchemes.map((scheme) => (
								<div key={scheme.name} className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedColorScheme === scheme.name ? "border-primary" : "border-border"}`} onClick={() => setSelectedColorScheme(scheme.name)}>
									<div className="flex items-center space-x-3 mb-3">
										<div className="flex space-x-1">
											<div className="w-4 h-4 rounded-full" style={{ backgroundColor: scheme.primary }}></div>
											<div className="w-4 h-4 rounded-full" style={{ backgroundColor: scheme.secondary }}></div>
											<div className="w-4 h-4 rounded-full" style={{ backgroundColor: scheme.accent }}></div>
										</div>
										{selectedColorScheme === scheme.name && <Check className="w-4 h-4 text-primary" />}
									</div>
									<h3 className="font-medium">{scheme.name}</h3>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Layout Templates */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<Layout className="w-5 h-5 mr-2" />
							Layout Template
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 md:grid-cols-3">
							{layoutTemplates.map((template) => (
								<div key={template.id} className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedLayout === template.id ? "border-primary" : "border-border"}`} onClick={() => setSelectedLayout(template.id)}>
									<div className="aspect-video bg-muted rounded mb-3"></div>
									<div className="flex items-center justify-between">
										<div>
											<h3 className="font-medium">{template.name}</h3>
											<p className="text-sm text-muted-foreground">{template.description}</p>
										</div>
										{selectedLayout === template.id && <Check className="w-4 h-4 text-primary" />}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Typography */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<Type className="w-5 h-5 mr-2" />
							Typography
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<Label>Font Family</Label>
								<Select value={selectedFont} onValueChange={setSelectedFont}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{fontOptions.map((font) => (
											<SelectItem key={font.name} value={font.name}>
												<span style={{ fontFamily: font.family }}>{font.name}</span>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Branding Settings */}
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Site Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label htmlFor="siteName">Site Name</Label>
							<Input id="siteName" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
						</div>
						<div>
							<Label htmlFor="tagline">Tagline</Label>
							<Input id="tagline" value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} />
						</div>
						<div>
							<Label htmlFor="description">Site Description</Label>
							<Textarea id="description" placeholder="Describe your local directory..." />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<ImageIcon className="w-5 h-5 mr-2" />
							Logo & Images
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label>Site Logo</Label>
							<div className="flex items-center space-x-4 mt-2">
								<div className="w-16 h-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
									<Upload className="w-6 h-6 text-muted-foreground" />
								</div>
								<Button variant="outline" size="sm">
									<Upload className="w-4 h-4 mr-2" />
									Upload Logo
								</Button>
							</div>
						</div>
						<div>
							<Label>Favicon</Label>
							<div className="flex items-center space-x-4 mt-2">
								<div className="w-8 h-8 border-2 border-dashed border-border rounded flex items-center justify-center">
									<Upload className="w-4 h-4 text-muted-foreground" />
								</div>
								<Button variant="outline" size="sm">
									<Upload className="w-4 h-4 mr-2" />
									Upload Favicon
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Feature Settings */}
			<Card>
				<CardHeader>
					<CardTitle>Directory Features</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<Label className="text-base font-medium">Customer Reviews</Label>
							<p className="text-sm text-muted-foreground">Allow customers to leave reviews for businesses</p>
						</div>
						<Switch checked={settings.enableReviews} onCheckedChange={(checked) => setSettings({ ...settings, enableReviews: checked })} />
					</div>
					<div className="flex items-center justify-between">
						<div>
							<Label className="text-base font-medium">Online Bookings</Label>
							<p className="text-sm text-muted-foreground">Enable appointment booking functionality</p>
						</div>
						<Switch checked={settings.enableBookings} onCheckedChange={(checked) => setSettings({ ...settings, enableBookings: checked })} />
					</div>
					<div className="flex items-center justify-between">
						<div>
							<Label className="text-base font-medium">Photo Galleries</Label>
							<p className="text-sm text-muted-foreground">Allow businesses to upload photo galleries</p>
						</div>
						<Switch checked={settings.enablePhotos} onCheckedChange={(checked) => setSettings({ ...settings, enablePhotos: checked })} />
					</div>
					<div className="flex items-center justify-between">
						<div>
							<Label className="text-base font-medium">Business Hours</Label>
							<p className="text-sm text-muted-foreground">Display business operating hours</p>
						</div>
						<Switch checked={settings.showBusinessHours} onCheckedChange={(checked) => setSettings({ ...settings, showBusinessHours: checked })} />
					</div>
					<div className="flex items-center justify-between">
						<div>
							<Label className="text-base font-medium">Business Claims</Label>
							<p className="text-sm text-muted-foreground">Allow business owners to claim their listings</p>
						</div>
						<Switch checked={settings.allowBusinessClaims} onCheckedChange={(checked) => setSettings({ ...settings, allowBusinessClaims: checked })} />
					</div>
				</CardContent>
			</Card>

			{/* SEO Settings */}
			<Card>
				<CardHeader>
					<CardTitle>SEO Settings</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<Label htmlFor="metaTitle">Meta Title</Label>
						<Input id="metaTitle" placeholder="Portland Local Business Directory" />
					</div>
					<div>
						<Label htmlFor="metaDescription">Meta Description</Label>
						<Textarea id="metaDescription" placeholder="Find the best local businesses in Portland. Discover restaurants, services, and more." />
					</div>
					<div>
						<Label htmlFor="keywords">Keywords</Label>
						<Input id="keywords" placeholder="portland, local business, directory, restaurants" />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
