// REQUIRED: Subdomain-Specific Layout Component
// Dynamic layout for LocalHub subdomains with location-specific branding and content

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// UI Components
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Badge } from "@components/ui/badge";
import { Separator } from "@components/ui/separator";
import { Alert, AlertDescription } from "@components/ui/alert";

// Icons
import { Search, MapPin, Phone, Globe, Star, Menu, Home, Building2, Grid3X3, Users, AlertCircle, ExternalLink } from "lucide-react";

// Utils
import { logger } from "@lib/utils/logger";

export default function SubdomainLayout({ children, localHub, pageProps = {} }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const router = useRouter();

	// Apply custom branding if available
	useEffect(() => {
		if (localHub?.primary_color) {
			document.documentElement.style.setProperty("--primary", localHub.primary_color);
		}
		if (localHub?.secondary_color) {
			document.documentElement.style.setProperty("--secondary", localHub.secondary_color);
		}

		// Cleanup on unmount
		return () => {
			document.documentElement.style.removeProperty("--primary");
			document.documentElement.style.removeProperty("--secondary");
		};
	}, [localHub]);

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
		}
	};

	const navigation = [
		{ name: "Home", href: "/", icon: Home },
		{ name: "Businesses", href: "/businesses", icon: Building2 },
		{ name: "Categories", href: "/categories", icon: Grid3X3 },
		{ name: "About", href: "/about", icon: Users },
	];

	if (!localHub) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Alert className="max-w-md">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>This subdomain is not available or is being set up.</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b bg-background/95 backdrop-blur-md sticky top-0 z-50">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between h-16">
						{/* Logo and Hub Name */}
						<Link href="/" className="flex items-center space-x-3">
							{localHub.logo_url ? (
								<img src={localHub.logo_url} alt={`${localHub.name} logo`} className="h-8 w-8 rounded" />
							) : (
								<div className="h-8 w-8 rounded font-bold text-white flex items-center justify-center text-sm" style={{ backgroundColor: localHub.primary_color || "#3b82f6" }}>
									{localHub.name.charAt(0)}
								</div>
							)}
							<div>
								<div className="font-semibold text-lg">{localHub.name}</div>
								<div className="text-xs text-muted-foreground flex items-center">
									<MapPin className="w-3 h-3 mr-1" />
									{localHub.city}, {localHub.state}
								</div>
							</div>
						</Link>

						{/* Desktop Navigation */}
						<nav className="hidden md:flex items-center space-x-6">
							{navigation.map((item) => {
								const IconComponent = item.icon;
								return (
									<Link key={item.name} href={item.href} className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
										<IconComponent className="w-4 h-4" />
										<span>{item.name}</span>
									</Link>
								);
							})}
						</nav>

						{/* Search Bar */}
						<form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2">
							<div className="relative">
								<Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
								<Input type="search" placeholder={`Search in ${localHub.city}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 w-64" />
							</div>
							<Button type="submit" size="sm">
								Search
							</Button>
						</form>

						{/* Mobile Menu Button */}
						<Button variant="outline" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
							<Menu className="h-4 w-4" />
						</Button>
					</div>

					{/* Mobile Menu */}
					{mobileMenuOpen && (
						<div className="md:hidden py-4 border-t">
							<nav className="space-y-2">
								{navigation.map((item) => {
									const IconComponent = item.icon;
									return (
										<Link key={item.name} href={item.href} className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setMobileMenuOpen(false)}>
											<IconComponent className="w-4 h-4" />
											<span>{item.name}</span>
										</Link>
									);
								})}
							</nav>

							{/* Mobile Search */}
							<form onSubmit={handleSearch} className="mt-4 space-y-2">
								<Input type="search" placeholder={`Search in ${localHub.city}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
								<Button type="submit" className="w-full">
									Search
								</Button>
							</form>
						</div>
					)}
				</div>
			</header>

			{/* Hub Banner */}
			{localHub.banner_url && (
				<div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url(${localHub.banner_url})` }}>
					<div className="absolute inset-0 bg-black/40" />
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="text-center text-white">
							<h1 className="text-3xl font-bold mb-2">{localHub.name}</h1>
							{localHub.tagline && <p className="text-lg opacity-90">{localHub.tagline}</p>}
						</div>
					</div>
				</div>
			)}

			{/* Breadcrumb and Hub Info */}
			<div className="border-b bg-muted/30">
				<div className="container mx-auto px-4 py-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4 text-sm text-muted-foreground">
							<Link href="/" className="hover:text-foreground">
								{localHub.name}
							</Link>
							{pageProps.breadcrumbs?.map((crumb, index) => (
								<span key={index} className="flex items-center">
									<span className="mx-2">/</span>
									{crumb.href ? (
										<Link href={crumb.href} className="hover:text-foreground">
											{crumb.name}
										</Link>
									) : (
										<span className="text-foreground">{crumb.name}</span>
									)}
								</span>
							))}
						</div>

						<div className="flex items-center space-x-4">
							{/* Hub Stats */}
							<div className="hidden sm:flex items-center space-x-4 text-sm text-muted-foreground">
								<div className="flex items-center space-x-1">
									<Building2 className="w-4 h-4" />
									<span>{localHub.total_businesses || 0} businesses</span>
								</div>
								<div className="flex items-center space-x-1">
									<Star className="w-4 h-4" />
									<span>{localHub.total_reviews || 0} reviews</span>
								</div>
							</div>

							{/* Hub Status */}
							{localHub.verified && (
								<Badge variant="secondary" className="text-xs">
									<span className="w-2 h-2 bg-green-500 rounded-full mr-1" />
									Verified Hub
								</Badge>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<main className="flex-1">{children}</main>

			{/* Footer */}
			<footer className="border-t bg-muted/30 mt-12">
				<div className="container mx-auto px-4 py-8">
					<div className="grid gap-8 md:grid-cols-4">
						{/* Hub Info */}
						<div className="space-y-3">
							<h3 className="font-semibold">{localHub.name}</h3>
							<div className="text-sm text-muted-foreground space-y-1">
								<div className="flex items-center space-x-2">
									<MapPin className="w-4 h-4" />
									<span>
										{localHub.city}, {localHub.state}
									</span>
								</div>
								<div className="flex items-center space-x-2">
									<Globe className="w-4 h-4" />
									<span>{localHub.full_domain}</span>
								</div>
							</div>
							{localHub.description && <p className="text-sm text-muted-foreground">{localHub.description}</p>}
						</div>

						{/* Quick Links */}
						<div className="space-y-3">
							<h3 className="font-semibold">Directory</h3>
							<div className="space-y-2 text-sm">
								<Link href="/businesses" className="block text-muted-foreground hover:text-foreground">
									All Businesses
								</Link>
								<Link href="/categories" className="block text-muted-foreground hover:text-foreground">
									Categories
								</Link>
								<Link href="/search" className="block text-muted-foreground hover:text-foreground">
									Search
								</Link>
							</div>
						</div>

						{/* Featured Categories */}
						{localHub.featured_categories?.length > 0 && (
							<div className="space-y-3">
								<h3 className="font-semibold">Popular Categories</h3>
								<div className="space-y-2 text-sm">
									{localHub.featured_categories.slice(0, 5).map((categoryId) => (
										<Link key={categoryId} href={`/categories/${categoryId}`} className="block text-muted-foreground hover:text-foreground">
											Category {categoryId}
										</Link>
									))}
								</div>
							</div>
						)}

						{/* Social Links */}
						<div className="space-y-3">
							<h3 className="font-semibold">Connect</h3>
							<div className="space-y-2">
								{localHub.social_links &&
									Object.entries(localHub.social_links).map(([platform, url]) => (
										<Link key={platform} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground">
											<ExternalLink className="w-4 h-4" />
											<span className="capitalize">{platform}</span>
										</Link>
									))}

								{/* Contact Information */}
								<div className="pt-2 text-sm text-muted-foreground">
									<Link href="/contact" className="hover:text-foreground">
										Contact {localHub.name}
									</Link>
								</div>
							</div>
						</div>
					</div>

					<Separator className="my-6" />

					{/* Bottom Footer */}
					<div className="flex items-center justify-between text-sm text-muted-foreground">
						<div>
							© {new Date().getFullYear()} {localHub.name}. Powered by{" "}
							<Link href="https://localhub.com" className="hover:text-foreground">
								LocalHub
							</Link>
							.
						</div>
						<div className="flex items-center space-x-4">
							<Link href="/privacy" className="hover:text-foreground">
								Privacy
							</Link>
							<Link href="/terms" className="hover:text-foreground">
								Terms
							</Link>
							<Link href="/contact" className="hover:text-foreground">
								Contact
							</Link>
						</div>
					</div>
				</div>
			</footer>

			{/* Custom CSS for branding */}
			<style jsx>{`
				:global(:root) {
					--primary: ${localHub.primary_color || "#3b82f6"};
					--secondary: ${localHub.secondary_color || "#1e40af"};
				}
			`}</style>
		</div>
	);
}
