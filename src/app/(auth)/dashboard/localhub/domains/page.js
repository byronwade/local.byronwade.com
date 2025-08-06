"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Badge } from "@components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Alert, AlertDescription } from "@components/ui/alert";
import { Globe, Plus, Check, X, Clock, AlertTriangle, Copy, ExternalLink, Shield, Zap, Settings, Info, MapPin, Loader2, Eye } from "lucide-react";
import { toast } from "@components/ui/use-toast";
import CreateSubdomainForm from "@components/dashboard/subdomains/CreateSubdomainForm";

const mockDomains = [
	{
		id: 1,
		domain: "portland.localhub.com",
		type: "subdomain",
		status: "active",
		isPrimary: true,
		sslEnabled: true,
		setupDate: "2024-01-15",
	},
	{
		id: 2,
		domain: "portlandbusiness.com",
		type: "custom",
		status: "pending",
		isPrimary: false,
		sslEnabled: false,
		setupDate: "2024-03-10",
	},
];

export default function DomainsManagement() {
	const [domains, setDomains] = useState(mockDomains);
	const [newDomain, setNewDomain] = useState("");
	const [isAddingDomain, setIsAddingDomain] = useState(false);
	const [subdomains, setSubdomains] = useState([]);
	const [isCreatingSubdomain, setIsCreatingSubdomain] = useState(false);

	useEffect(() => {
		document.title = "Domains & URLs - LocalHub - Thorbis";
		fetchSubdomains();
	}, []);

	const fetchSubdomains = async () => {
		try {
			const response = await fetch("/api/v2/subdomains", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
				},
			});
			const result = await response.json();
			if (result.success) {
				setSubdomains(result.data.subdomains || []);
			}
		} catch (error) {
			console.error("Failed to fetch subdomains:", error);
		}
	};

	const handleSubdomainCreated = (newSubdomain) => {
		setSubdomains((prev) => [...prev, newSubdomain]);
		setIsCreatingSubdomain(false);
		toast({
			title: "Subdomain Created",
			description: `${newSubdomain.subdomain}.localhub.com has been created successfully.`,
		});
	};

	const getStatusBadge = (status) => {
		const statusConfig = {
			active: { color: "bg-green-100 text-green-800 border-green-200", icon: Check, label: "Active" },
			pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock, label: "Pending Setup" },
			failed: { color: "bg-red-100 text-red-800 border-red-200", icon: X, label: "Setup Failed" },
		};

		const config = statusConfig[status] || statusConfig.pending;
		const IconComponent = config.icon;

		return (
			<Badge className={`${config.color} text-xs font-medium`}>
				<IconComponent className="w-3 h-3 mr-1" />
				{config.label}
			</Badge>
		);
	};

	const handleAddDomain = () => {
		if (!newDomain) {
			toast({
				title: "Domain Required",
				description: "Please enter a domain name.",
				variant: "destructive",
			});
			return;
		}

		const domain = {
			id: domains.length + 1,
			domain: newDomain,
			type: "custom",
			status: "pending",
			isPrimary: false,
			sslEnabled: false,
			setupDate: new Date().toISOString().split("T")[0],
		};

		setDomains([...domains, domain]);
		setNewDomain("");
		setIsAddingDomain(false);

		toast({
			title: "Domain Added",
			description: `${newDomain} has been added. Please configure DNS settings to complete setup.`,
		});
	};

	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text);
		toast({
			title: "Copied",
			description: "Text copied to clipboard.",
		});
	};

	const setPrimaryDomain = (domainId) => {
		setDomains(
			domains.map((domain) => ({
				...domain,
				isPrimary: domain.id === domainId,
			}))
		);

		toast({
			title: "Primary Domain Updated",
			description: "Primary domain has been changed successfully.",
		});
	};

	return (
		<div className="w-full px-4 py-16 space-y-8 lg:px-24">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-bold">Domains & URLs</h1>
					<p className="mt-2 text-muted-foreground">Manage your directory domains and URL settings.</p>
				</div>
			</div>

			{/* Domains and Subdomains */}
			<Tabs defaultValue="subdomains" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="subdomains">Free Subdomains</TabsTrigger>
					<TabsTrigger value="custom">Custom Domains</TabsTrigger>
				</TabsList>

				{/* Subdomains Tab */}
				<TabsContent value="subdomains">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center">
									<Globe className="w-5 h-5 mr-2" />
									Your Subdomains
								</CardTitle>
								<Button onClick={() => setIsCreatingSubdomain(true)}>
									<Plus className="w-4 h-4 mr-2" />
									Create Subdomain
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							{isCreatingSubdomain ? (
								<div className="space-y-4">
									<CreateSubdomainForm onSuccess={handleSubdomainCreated} onCancel={() => setIsCreatingSubdomain(false)} />
								</div>
							) : (
								<div className="space-y-4">
									{subdomains.length > 0 ? (
										subdomains.map((subdomain) => (
											<div key={subdomain.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
												<div className="flex-1 space-y-1">
													<div className="flex items-center space-x-3">
														<h3 className="font-semibold">{subdomain.subdomain}.localhub.com</h3>
														{getStatusBadge(subdomain.status)}
														<Badge variant="outline" className="text-xs">
															Free Subdomain
														</Badge>
													</div>
													<div className="flex items-center gap-2 text-sm text-muted-foreground">
														<MapPin className="w-4 h-4" />
														<span>
															{subdomain.city}, {subdomain.state}
														</span>
													</div>
													<p className="text-sm text-muted-foreground">{subdomain.description || subdomain.name}</p>
												</div>
												<div className="flex items-center space-x-2">
													<Button variant="ghost" size="sm" onClick={() => copyToClipboard(`${subdomain.subdomain}.localhub.com`)}>
														<Copy className="w-4 h-4" />
													</Button>
													<Button variant="ghost" size="sm" onClick={() => window.open(`https://${subdomain.subdomain}.localhub.com`, "_blank")}>
														<ExternalLink className="w-4 h-4" />
													</Button>
													<Button variant="ghost" size="sm">
														<Eye className="w-4 h-4" />
													</Button>
													<Button variant="ghost" size="sm">
														<Settings className="w-4 h-4" />
													</Button>
												</div>
											</div>
										))
									) : (
										<div className="text-center py-8">
											<Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
											<h3 className="text-lg font-semibold mb-2">No subdomains yet</h3>
											<p className="text-muted-foreground mb-4">Create your first free subdomain to get started with your local business directory.</p>
											<Button onClick={() => setIsCreatingSubdomain(true)}>
												<Plus className="w-4 h-4 mr-2" />
												Create Your First Subdomain
											</Button>
										</div>
									)}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Custom Domains Tab */}
				<TabsContent value="custom">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center">
									<Globe className="w-5 h-5 mr-2" />
									Custom Domains
								</CardTitle>
								<Button onClick={() => setIsAddingDomain(true)}>
									<Plus className="w-4 h-4 mr-2" />
									Add Custom Domain
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{domains.filter((d) => d.type === "custom").length > 0 ? (
									domains
										.filter((d) => d.type === "custom")
										.map((domain) => (
											<div key={domain.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
												<div className="flex-1 space-y-1">
													<div className="flex items-center space-x-3">
														<h3 className="font-semibold">{domain.domain}</h3>
														{getStatusBadge(domain.status)}
														{domain.isPrimary && <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">Primary</Badge>}
														{domain.sslEnabled && (
															<Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
																<Shield className="w-3 h-3 mr-1" />
																SSL
															</Badge>
														)}
													</div>
													<div className="flex items-center space-x-4 text-sm text-muted-foreground">
														<span>Setup: {new Date(domain.setupDate).toLocaleDateString()}</span>
														{domain.status === "active" && (
															<Button variant="ghost" size="sm" className="h-auto p-0 text-xs" onClick={() => window.open(`https://${domain.domain}`, "_blank")}>
																<ExternalLink className="w-3 h-3 mr-1" />
																Visit
															</Button>
														)}
													</div>
												</div>
												<div className="flex items-center space-x-2">
													{domain.status === "active" && !domain.isPrimary && (
														<Button variant="outline" size="sm" onClick={() => setPrimaryDomain(domain.id)}>
															Set as Primary
														</Button>
													)}
													{domain.status === "pending" && (
														<Button variant="outline" size="sm">
															Configure DNS
														</Button>
													)}
												</div>
											</div>
										))
								) : (
									<div className="text-center py-8">
										<Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
										<h3 className="text-lg font-semibold mb-2">No custom domains</h3>
										<p className="text-muted-foreground mb-4">Add your own domain to use with your LocalHub directory.</p>
										<Button onClick={() => setIsAddingDomain(true)}>
											<Plus className="w-4 h-4 mr-2" />
											Add Custom Domain
										</Button>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Add Domain Form */}
			{isAddingDomain && (
				<Card>
					<CardHeader>
						<CardTitle>Add Custom Domain</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label htmlFor="domain">Domain Name</Label>
							<Input id="domain" value={newDomain} onChange={(e) => setNewDomain(e.target.value)} placeholder="yourdomain.com" />
							<p className="text-xs text-muted-foreground mt-1">Enter your domain without www or https://</p>
						</div>
						<div className="flex space-x-2">
							<Button onClick={handleAddDomain}>Add Domain</Button>
							<Button variant="outline" onClick={() => setIsAddingDomain(false)}>
								Cancel
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{/* DNS Configuration */}
			<Tabs defaultValue="setup" className="space-y-6">
				<TabsList>
					<TabsTrigger value="setup">DNS Setup</TabsTrigger>
					<TabsTrigger value="ssl">SSL Certificate</TabsTrigger>
					<TabsTrigger value="redirects">Redirects</TabsTrigger>
				</TabsList>

				<TabsContent value="setup" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>DNS Configuration</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<Alert>
								<Info className="h-4 w-4" />
								<AlertDescription>To connect your custom domain, add these DNS records at your domain registrar.</AlertDescription>
							</Alert>

							<div className="space-y-4">
								<div className="p-4 bg-muted/50 rounded-lg">
									<div className="flex items-center justify-between mb-2">
										<h4 className="font-medium">A Record</h4>
										<Button variant="ghost" size="sm" onClick={() => copyToClipboard("76.76.19.123")}>
											<Copy className="w-4 h-4 mr-1" />
											Copy
										</Button>
									</div>
									<div className="grid grid-cols-3 gap-4 text-sm">
										<div>
											<span className="text-muted-foreground">Name:</span>
											<div className="font-mono">@</div>
										</div>
										<div>
											<span className="text-muted-foreground">Value:</span>
											<div className="font-mono">76.76.19.123</div>
										</div>
										<div>
											<span className="text-muted-foreground">TTL:</span>
											<div className="font-mono">3600</div>
										</div>
									</div>
								</div>

								<div className="p-4 bg-muted/50 rounded-lg">
									<div className="flex items-center justify-between mb-2">
										<h4 className="font-medium">CNAME Record (www)</h4>
										<Button variant="ghost" size="sm" onClick={() => copyToClipboard("cname.localhub.com")}>
											<Copy className="w-4 h-4 mr-1" />
											Copy
										</Button>
									</div>
									<div className="grid grid-cols-3 gap-4 text-sm">
										<div>
											<span className="text-muted-foreground">Name:</span>
											<div className="font-mono">www</div>
										</div>
										<div>
											<span className="text-muted-foreground">Value:</span>
											<div className="font-mono">cname.localhub.com</div>
										</div>
										<div>
											<span className="text-muted-foreground">TTL:</span>
											<div className="font-mono">3600</div>
										</div>
									</div>
								</div>
							</div>

							<Alert>
								<AlertTriangle className="h-4 w-4" />
								<AlertDescription>DNS changes can take up to 48 hours to propagate worldwide. We&apos;ll automatically verify your domain once DNS is configured.</AlertDescription>
							</Alert>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="ssl" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>SSL Certificate</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<Alert>
								<Shield className="h-4 w-4" />
								<AlertDescription>We automatically provision and renew SSL certificates for all custom domains at no additional cost.</AlertDescription>
							</Alert>

							<div className="space-y-4">
								{domains.map((domain) => (
									<div key={domain.id} className="flex items-center justify-between p-4 border rounded-lg">
										<div>
											<h4 className="font-medium">{domain.domain}</h4>
											<p className="text-sm text-muted-foreground">{domain.sslEnabled ? "SSL certificate active" : "SSL certificate pending"}</p>
										</div>
										<div className="flex items-center space-x-2">
											{domain.sslEnabled ? (
												<Badge className="bg-green-100 text-green-800 border-green-200">
													<Shield className="w-3 h-3 mr-1" />
													Active
												</Badge>
											) : (
												<Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
													<Clock className="w-3 h-3 mr-1" />
													Pending
												</Badge>
											)}
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="redirects" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>URL Redirects</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between p-4 border rounded-lg">
								<div>
									<h4 className="font-medium">HTTPS Redirect</h4>
									<p className="text-sm text-muted-foreground">Automatically redirect HTTP traffic to HTTPS</p>
								</div>
								<Badge className="bg-green-100 text-green-800 border-green-200">
									<Check className="w-3 h-3 mr-1" />
									Enabled
								</Badge>
							</div>

							<div className="flex items-center justify-between p-4 border rounded-lg">
								<div>
									<h4 className="font-medium">WWW Redirect</h4>
									<p className="text-sm text-muted-foreground">Redirect www version to non-www (or vice versa)</p>
								</div>
								<Button variant="outline" size="sm">
									<Settings className="w-4 h-4 mr-2" />
									Configure
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Subdomain Info */}
			<Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
				<CardHeader>
					<CardTitle className="flex items-center">
						<Zap className="w-5 h-5 mr-2 text-blue-600" />
						Free Subdomain Included
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground mb-4">Every LocalHub directory comes with a free subdomain. You can upgrade to a custom domain anytime to enhance your brand.</p>
					<div className="flex items-center space-x-4">
						<div className="text-center">
							<div className="text-lg font-bold text-blue-600">Free</div>
							<p className="text-xs text-muted-foreground">Subdomain</p>
						</div>
						<div className="text-center">
							<div className="text-lg font-bold text-green-600">$0</div>
							<p className="text-xs text-muted-foreground">Setup Fee</p>
						</div>
						<div className="text-center">
							<div className="text-lg font-bold text-purple-600">Auto</div>
							<p className="text-xs text-muted-foreground">SSL Certificate</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
