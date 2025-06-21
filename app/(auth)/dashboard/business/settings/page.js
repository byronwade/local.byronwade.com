"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CircleUser, Menu, Package2, Search, Building2, Shield, Bell, CreditCard, HelpCircle, Settings as SettingsIcon, Users, Globe, Database } from "lucide-react";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@components/ui/card";
import { Checkbox } from "@components/ui/checkbox";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Switch } from "@components/ui/switch";
import { Badge } from "@components/ui/badge";

export default function Settings() {
	const [activeSection, setActiveSection] = useState("general");

	const settingsSections = [
		{ id: "general", label: "General", icon: Building2 },
		{ id: "security", label: "Security", icon: Shield },
		{ id: "notifications", label: "Notifications", icon: Bell },
		{ id: "billing", label: "Billing", icon: CreditCard },
		{ id: "team", label: "Team", icon: Users },
		{ id: "integrations", label: "Integrations", icon: Globe },
		{ id: "advanced", label: "Advanced", icon: Database },
		{ id: "support", label: "Support", icon: HelpCircle },
	];

	const renderSection = () => {
		switch (activeSection) {
			case "general":
				return (
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Business Information</CardTitle>
								<CardDescription>Update your business details and contact information.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="businessName">Business Name</Label>
									<Input id="businessName" placeholder="Your Business Name" defaultValue="Wade's Plumbing" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="businessEmail">Business Email</Label>
									<Input id="businessEmail" type="email" placeholder="contact@yourbusiness.com" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="businessPhone">Business Phone</Label>
									<Input id="businessPhone" placeholder="+1 (555) 123-4567" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="businessWebsite">Website</Label>
									<Input id="businessWebsite" placeholder="https://yourbusiness.com" />
								</div>
							</CardContent>
							<CardFooter className="border-t pt-6">
								<Button>Save Changes</Button>
							</CardFooter>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Business Address</CardTitle>
								<CardDescription>Your business location and service areas.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="address">Street Address</Label>
									<Input id="address" placeholder="123 Main Street" />
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="city">City</Label>
										<Input id="city" placeholder="New York" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="state">State</Label>
										<Input id="state" placeholder="NY" />
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="zipCode">ZIP Code</Label>
										<Input id="zipCode" placeholder="10001" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="country">Country</Label>
										<Input id="country" placeholder="United States" />
									</div>
								</div>
							</CardContent>
							<CardFooter className="border-t pt-6">
								<Button>Update Address</Button>
							</CardFooter>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Business Hours</CardTitle>
								<CardDescription>Set your business operating hours.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="openTime">Opening Time</Label>
										<Input id="openTime" type="time" defaultValue="09:00" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="closeTime">Closing Time</Label>
										<Input id="closeTime" type="time" defaultValue="17:00" />
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox id="monday" defaultChecked />
									<Label htmlFor="monday">Monday</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox id="tuesday" defaultChecked />
									<Label htmlFor="tuesday">Tuesday</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox id="wednesday" defaultChecked />
									<Label htmlFor="wednesday">Wednesday</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox id="thursday" defaultChecked />
									<Label htmlFor="thursday">Thursday</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox id="friday" defaultChecked />
									<Label htmlFor="friday">Friday</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox id="saturday" />
									<Label htmlFor="saturday">Saturday</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox id="sunday" />
									<Label htmlFor="sunday">Sunday</Label>
								</div>
							</CardContent>
							<CardFooter className="border-t pt-6">
								<Button>Save Hours</Button>
							</CardFooter>
						</Card>
					</div>
				);

			case "security":
				return (
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Password Security</CardTitle>
								<CardDescription>Update your password to keep your account secure.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="currentPassword">Current Password</Label>
									<Input id="currentPassword" type="password" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="newPassword">New Password</Label>
									<Input id="newPassword" type="password" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="confirmPassword">Confirm New Password</Label>
									<Input id="confirmPassword" type="password" />
								</div>
							</CardContent>
							<CardFooter className="border-t pt-6">
								<Button>Update Password</Button>
							</CardFooter>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Two-Factor Authentication</CardTitle>
								<CardDescription>Add an extra layer of security to your account.</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Enable 2FA</Label>
										<p className="text-sm text-muted-foreground">Use an authenticator app to generate codes.</p>
									</div>
									<Button variant="outline">Setup 2FA</Button>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Active Sessions</CardTitle>
								<CardDescription>Manage your active login sessions.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between p-4 border rounded-lg">
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 bg-green-500 rounded-full"></div>
										<div>
											<p className="text-sm font-medium">Current Session</p>
											<p className="text-xs text-muted-foreground">Chrome on Mac • Active now</p>
										</div>
									</div>
									<Badge variant="secondary">Current</Badge>
								</div>
								<div className="flex items-center justify-between p-4 border rounded-lg">
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 bg-gray-300 rounded-full"></div>
										<div>
											<p className="text-sm font-medium">Mobile Session</p>
											<p className="text-xs text-muted-foreground">Safari on iPhone • 2 hours ago</p>
										</div>
									</div>
									<Button variant="outline" size="sm">
										Revoke
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				);

			case "notifications":
				return (
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Email Notifications</CardTitle>
								<CardDescription>Choose which emails you want to receive.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>New Reviews</Label>
										<p className="text-sm text-muted-foreground">Get notified when customers leave reviews.</p>
									</div>
									<Switch defaultChecked />
								</div>
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Job Applications</Label>
										<p className="text-sm text-muted-foreground">Receive notifications for new job applications.</p>
									</div>
									<Switch defaultChecked />
								</div>
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Partnership Requests</Label>
										<p className="text-sm text-muted-foreground">Get notified about partnership opportunities.</p>
									</div>
									<Switch defaultChecked />
								</div>
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Platform Updates</Label>
										<p className="text-sm text-muted-foreground">Receive updates about new features.</p>
									</div>
									<Switch />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Push Notifications</CardTitle>
								<CardDescription>Manage your browser and mobile notifications.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Browser Notifications</Label>
										<p className="text-sm text-muted-foreground">Show notifications in your browser.</p>
									</div>
									<Switch defaultChecked />
								</div>
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Sound Alerts</Label>
										<p className="text-sm text-muted-foreground">Play sounds for new notifications.</p>
									</div>
									<Switch />
								</div>
							</CardContent>
						</Card>
					</div>
				);

			case "billing":
				return (
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Billing Information</CardTitle>
								<CardDescription>Manage your billing address and payment methods.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="billingAddress">Billing Address</Label>
									<Input id="billingAddress" placeholder="123 Main St" />
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="billingCity">City</Label>
										<Input id="billingCity" placeholder="New York" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="billingState">State</Label>
										<Input id="billingState" placeholder="NY" />
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="billingZip">ZIP Code</Label>
										<Input id="billingZip" placeholder="10001" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="billingCountry">Country</Label>
										<Input id="billingCountry" placeholder="United States" />
									</div>
								</div>
							</CardContent>
							<CardFooter className="border-t pt-6">
								<Button>Update Billing Info</Button>
							</CardFooter>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Payment Methods</CardTitle>
								<CardDescription>Manage your saved payment methods.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between p-4 border rounded-lg">
									<div className="flex items-center space-x-3">
										<CreditCard className="w-5 h-5" />
										<div>
											<p className="text-sm font-medium">•••• •••• •••• 4242</p>
											<p className="text-xs text-muted-foreground">Expires 12/25</p>
										</div>
									</div>
									<Badge variant="secondary">Default</Badge>
								</div>
								<Button variant="outline">Add Payment Method</Button>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Subscription Plan</CardTitle>
								<CardDescription>Manage your current subscription and billing cycle.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between p-4 border rounded-lg">
									<div>
										<p className="text-sm font-medium">Pro Plan</p>
										<p className="text-xs text-muted-foreground">$79/month • Next billing: Jan 25, 2024</p>
									</div>
									<Button variant="outline" size="sm">
										Change Plan
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				);

			case "team":
				return (
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Team Members</CardTitle>
								<CardDescription>Manage who has access to your business account.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between p-4 border rounded-lg">
									<div className="flex items-center space-x-3">
										<div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
											<span className="text-xs text-primary-foreground">JD</span>
										</div>
										<div>
											<p className="text-sm font-medium">John Doe</p>
											<p className="text-xs text-muted-foreground">Owner • john@example.com</p>
										</div>
									</div>
									<Badge variant="secondary">Owner</Badge>
								</div>
								<Button variant="outline">Invite Team Member</Button>
							</CardContent>
						</Card>
					</div>
				);

			case "integrations":
				return (
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Connected Apps</CardTitle>
								<CardDescription>Manage your third-party integrations.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between p-4 border rounded-lg">
									<div className="flex items-center space-x-3">
										<Globe className="w-5 h-5" />
										<div>
											<p className="text-sm font-medium">Google My Business</p>
											<p className="text-xs text-muted-foreground">Connected • Last synced 2 hours ago</p>
										</div>
									</div>
									<Button variant="outline" size="sm">
										Disconnect
									</Button>
								</div>
								<Button variant="outline">Connect New App</Button>
							</CardContent>
						</Card>
					</div>
				);

			case "advanced":
				return (
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>API Settings</CardTitle>
								<CardDescription>Manage your API keys and webhooks.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="apiKey">API Key</Label>
									<div className="flex space-x-2">
										<Input id="apiKey" defaultValue="sk_live_1234567890abcdef" readOnly />
										<Button variant="outline" size="sm">
											Copy
										</Button>
									</div>
								</div>
								<Button variant="outline">Generate New Key</Button>
							</CardContent>
						</Card>
					</div>
				);

			case "support":
				return (
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Help & Support</CardTitle>
								<CardDescription>Get help with your business account.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid gap-4">
									<Button variant="outline" className="justify-start">
										<HelpCircle className="w-4 h-4 mr-2" />
										View Help Center
									</Button>
									<Button variant="outline" className="justify-start">
										<HelpCircle className="w-4 h-4 mr-2" />
										Contact Support
									</Button>
									<Button variant="outline" className="justify-start">
										<HelpCircle className="w-4 h-4 mr-2" />
										Report a Bug
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="w-full px-4 lg:px-24 py-16 space-y-8">
			<div className="grid w-full gap-2">
				<h1 className="text-4xl">Settings</h1>
				<p className="text-muted-foreground">Manage your business settings and preferences.</p>
			</div>

			<div className="mx-auto grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
				<nav className="grid gap-4 text-sm text-muted-foreground">
					{settingsSections.map((section) => {
						const Icon = section.icon;
						return (
							<button key={section.id} onClick={() => setActiveSection(section.id)} className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${activeSection === section.id ? "font-semibold text-primary bg-primary/5 border border-primary/20" : "hover:text-foreground hover:bg-muted"}`}>
								<Icon className="w-4 h-4" />
								<span>{section.label}</span>
							</button>
						);
					})}
				</nav>

				<div className="grid gap-6">{renderSection()}</div>
			</div>
		</div>
	);
}
