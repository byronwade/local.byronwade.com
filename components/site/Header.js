"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, redirect } from "next/navigation";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuPortal } from "@components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@components/ui/sheet";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@components/ui/drawer";
import { ChevronDown, Menu, Search, Bell, Plus, CheckCircle, Shield, MapPin, User, Settings, X } from "react-feather";
import { Bot, Sparkles } from "lucide-react";
import SearchBarHeader from "@components/shared/searchBox/SearchBarHeader";
import { useAuth } from "@context/AuthContext";
import { useUserProfile } from "@hooks/useUserProfile";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
	const [open, setOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const pathname = usePathname();
	const { user, userRoles, logout, isAuthenticated, getDisplayName, getAvatarUrl } = useAuth();
	const { profile } = useUserProfile();

	// Helper function to get avatar with Vercel avatar API fallback
	const getAvatarWithFallback = () => {
		const avatarUrl = getAvatarUrl();
		if (avatarUrl) {
			return avatarUrl;
		}

		// Fallback to Vercel avatar API if no avatar is set (consistent with other components)
		if (user?.email) {
			const username = user.email.split("@")[0] || "user";
			return `https://vercel.com/api/www/avatar?u=${username}&s=200`;
		}

		return "/placeholder-avatar.svg";
	};

	// Avatar fallback system ready

	useEffect(() => {
		const down = (e) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	// useEffect(() => {
	// 	if (user) {
	// 		if (userRoles.includes("admin")) {
	// 			redirect("/dashboard/admin");
	// 		} else if (userRoles.includes("business_owner")) {
	// 			redirect("/dashboard/business");
	// 		} else {
	// 			redirect("/dashboard/user");
	// 		}
	// 	}
	// }, [user, userRoles]);

	const handleLogout = async () => {
		try {
			await logout();
			console.log("Logout successful");
			redirect("/"); // Redirect after logout
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	const handleMobileSearch = () => {
		window.location.href = "/search";
	};

	// Function to determine page context and branding
	const getPageContext = () => {
		if (pathname.startsWith("/search")) {
			return {
				title: "Thorbis",
				subtitle: "Business Search",
				gradient: "from-blue-500/20 to-green-500/20",
			};
		}
		if (pathname.startsWith("/shorts")) {
			return {
				title: "Thorbis",
				subtitle: "Business Shorts",
				gradient: "from-blue-500/20 to-green-500/20",
			};
		}
		if (pathname.startsWith("/networking")) {
			return {
				title: "Networking",
				subtitle: "Connect & Grow",
				gradient: "from-purple-500/20 to-pink-500/20",
			};
		}
		if (pathname.startsWith("/events")) {
			return {
				title: "Thorbis",
				subtitle: "Local Events",
				gradient: "from-orange-500/20 to-red-500/20",
			};
		}
		if (pathname.startsWith("/neighborhoods")) {
			return {
				title: "Thorbis",
				subtitle: "Neighborhoods",
				gradient: "from-green-500/20 to-blue-500/20",
			};
		}
		// Default branding
		return {
			title: "Thorbis",
			subtitle: "Local Business Directory",
			gradient: "from-blue-500/20 to-green-500/20",
		};
	};

	const pageContext = getPageContext();

	// Check if we're on any search page
	const isSearchMapPage = pathname.startsWith("/search");

	return (
		<div id="header" className="sticky top-0 z-[60] bg-neutral-950/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-900 dark:border-neutral-900 transition-all duration-300">
			<div className={`flex items-center justify-between w-full gap-6 py-3 mx-auto ${isSearchMapPage ? "px-4 max-w-none" : "px-4 lg:px-24"}`}>
				<div className="flex flex-row items-center space-x-6 w-full">
					<Link href="/" className="flex items-center space-x-3 text-xl font-bold group">
						<div className="relative">
							<Image src="/logos/ThorbisLogo.webp" alt={pageContext.title} width={50} height={50} className="w-12 h-12 transition-transform duration-200 group-hover:scale-105" priority />
							<div className={`absolute inset-0 rounded-full opacity-0 transition-opacity duration-200 ${pageContext.gradient} group-hover:opacity-100`} />
						</div>
						<div className="hidden sm:block">
							<h1 className="text-lg font-bold leading-none text-foreground">{pageContext.title}</h1>
							<p className="text-xs text-muted-foreground">{pageContext.subtitle}</p>
						</div>
					</Link>
					<div className="hidden items-center w-full max-w-2xl md:flex">
						{/* Show search bar on all pages */}
						<div className="flex items-center w-full max-w-2xl">
							<SearchBarHeader />
						</div>
					</div>
				</div>

				{/* Desktop Navigation */}
				<div className="hidden space-x-1 lg:flex xl:space-x-2">
					<Link href="/categories" passHref>
						<Button variant="ghost" size="sm" className="text-sm font-medium transition-colors hover:text-primary hover:bg-accent">
							Categories
						</Button>
					</Link>
					<Link href="/dashboard/user/jobs/create" passHref>
						<Button variant="ghost" size="sm" className="text-sm font-medium transition-colors hover:text-primary hover:bg-accent">
							Post a Job
						</Button>
					</Link>
					<Link href="/dashboard/user/reviews/create" passHref>
						<Button variant="ghost" size="sm" className="text-sm font-medium transition-colors hover:text-primary hover:bg-accent">
							Write Review
						</Button>
					</Link>

					{/* Business Dropdown */}
					<DropdownMenu modal={false}>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="sm" className="text-sm font-medium transition-colors hover:text-primary hover:bg-accent">
								For Business <ChevronDown className="ml-1 w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuPortal>
							<DropdownMenuContent className="z-[999] w-72 bg-neutral-900/90 dark:bg-neutral-900/90 backdrop-blur-md border-neutral-800 dark:border-neutral-800">
								<DropdownMenuLabel>Business Solutions</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild className="flex items-center gap-3 py-2.5">
									<Link href="/add-a-business">
										<div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
											<Plus className="w-4 h-4 text-green-600 dark:text-green-400" />
										</div>
										<div className="flex flex-col">
											<span className="text-sm font-medium">Add a Business</span>
											<span className="text-xs text-muted-foreground">List your business for free</span>
										</div>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild className="flex items-center gap-3 py-2.5">
									<Link href="/claim-a-business">
										<div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
											<CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
										</div>
										<div className="flex flex-col">
											<span className="text-sm font-medium">Claim Your Business</span>
											<span className="text-xs text-muted-foreground">Already listed? Claim ownership</span>
										</div>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild className="flex items-center gap-3 py-2.5">
									<Link href="/explore-business">
										<div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
											<Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
										</div>
										<div className="flex flex-col">
											<span className="text-sm font-medium">Business Solutions</span>
											<span className="text-xs text-muted-foreground">Grow your business with Thorbis</span>
										</div>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild className="flex items-center gap-3 py-2.5">
									<Link href="/business-certification">
										<div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
											<Shield className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
										</div>
										<div className="flex flex-col">
											<div className="flex items-center gap-2">
												<span className="text-sm font-medium text-blue-600 dark:text-blue-400">Get Thorbis Certified</span>
												<span className="px-1.5 py-0.5 text-xs text-white bg-blue-600 rounded-full">Elite</span>
											</div>
											<span className="text-xs text-muted-foreground">Premium verification badge</span>
										</div>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild className="flex items-center gap-3 py-2.5">
									<Link href="/localhub">
										<div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
											<MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
										</div>
										<div className="flex flex-col">
											<div className="flex items-center gap-2">
												<span className="text-sm font-medium">Build Your Local Directory</span>
												<span className="px-1.5 py-0.5 text-xs text-white bg-purple-600 rounded-full">New</span>
											</div>
											<span className="text-xs text-muted-foreground">Create & monetize your neighborhood hub</span>
										</div>
									</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenuPortal>
					</DropdownMenu>

					{/* User Section */}
					{user ? (
						<div className="flex items-center space-x-2">
							{/* Enhanced Notification Bell */}
							<DropdownMenu modal={false}>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm" className="relative p-2 w-9 h-9 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
										<Bell className="w-4 h-4" />
										<span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full border border-white dark:border-neutral-900"></span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuPortal>
									<DropdownMenuContent className="z-[999] w-80 bg-neutral-900/90 dark:bg-neutral-900/90 backdrop-blur-md border-neutral-800 dark:border-neutral-800">
										<div className="flex justify-between items-center p-3 border-b border-neutral-800/50 dark:border-neutral-700/50">
											<span className="text-sm font-medium">Notifications</span>
											<Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground">
												Mark all as read
											</Button>
										</div>

										{/* Notification Items */}
										<div className="max-h-96 overflow-y-auto">
											{/* Sample notifications */}
											<div className="p-3 hover:bg-accent/50 transition-colors cursor-pointer">
												<div className="flex items-start space-x-3">
													<div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
														<Bell className="w-4 h-4 text-white" />
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-sm font-medium text-foreground">New message from LocalHub</p>
														<p className="text-xs text-muted-foreground mt-1">You have a new message in your LocalHub dashboard.</p>
														<p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
													</div>
												</div>
											</div>
										</div>

										<div className="p-3 border-t border-neutral-800/50 dark:border-neutral-700/50">
											<Button variant="outline" size="sm" className="w-full">
												View all notifications
											</Button>
										</div>
									</DropdownMenuContent>
								</DropdownMenuPortal>
							</DropdownMenu>

							{/* Enhanced User Avatar Menu */}
							<DropdownMenu modal={false}>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm" className="relative flex items-center justify-center h-10 w-10 rounded-full border border-neutral-900 bg-neutral-900 dark:bg-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-900" aria-label="User menu">
										<div className="flex overflow-hidden relative mx-auto w-8 h-8 rounded-full shrink-0">
											<Image src={getAvatarWithFallback()} alt={getDisplayName()} fill sizes="32px" className="object-cover" />
										</div>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuPortal>
									<DropdownMenuContent className="z-[999] w-64 bg-neutral-900/90 dark:bg-neutral-900/90 backdrop-blur-md border-neutral-800 dark:border-neutral-800">
										{/* User Info Header */}
										<div className="flex items-center p-3 space-x-3 border-b border-neutral-800/50 dark:border-neutral-700/50">
											<div className="flex overflow-hidden relative w-10 h-10 rounded-full shrink-0 border border-neutral-700 dark:border-neutral-700">
												<Image src={getAvatarWithFallback()} alt={getDisplayName()} fill sizes="40px" className="object-cover" />
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-foreground truncate">{getDisplayName()}</p>
												<p className="text-xs text-muted-foreground truncate">{user?.email || "guest@example.com"}</p>
											</div>
										</div>

										{/* Quick Stats */}
										<div className="p-3 border-b border-neutral-800/50 dark:border-neutral-700/50">
											<div className="grid grid-cols-3 gap-3 text-center">
												<div>
													<p className="text-sm font-semibold text-foreground">12</p>
													<p className="text-xs text-muted-foreground">Reviews</p>
												</div>
												<div>
													<p className="text-sm font-semibold text-foreground">5</p>
													<p className="text-xs text-muted-foreground">Bookmarks</p>
												</div>
												<div>
													<p className="text-sm font-semibold text-foreground">3</p>
													<p className="text-xs text-muted-foreground">Jobs Posted</p>
												</div>
											</div>
										</div>

										{/* Navigation */}
										<div className="p-1">
											<DropdownMenuItem asChild>
												<Link href="/dashboard/user" className="flex items-center space-x-2 w-full">
													<User className="w-4 h-4" />
													<span>Dashboard</span>
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link href="/dashboard/user/settings" className="flex items-center space-x-2 w-full">
													<Settings className="w-4 h-4" />
													<span>Settings</span>
												</Link>
											</DropdownMenuItem>
										</div>
										<DropdownMenuItem asChild>
											<Link href="/dashboard/user/support" className="flex items-center p-3">
												<span>Support</span>
											</Link>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-3">
											Logout
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenuPortal>
							</DropdownMenu>
						</div>
					) : (
						<div className="flex items-center space-x-2">
							<Link href="/login">
								<Button variant="ghost" size="sm" className="text-sm font-medium transition-colors hover:text-primary hover:bg-accent">
									Log In
								</Button>
							</Link>
							<Link href="/onboarding">
								<Button size="sm" className="transition-colors bg-primary hover:bg-primary/90 text-primary-foreground border-0">
									Sign Up
								</Button>
							</Link>
						</div>
					)}
				</div>

				{/* Mobile Section */}
				<div className="flex items-center space-x-2 lg:hidden">
					<Button variant="ghost" size="icon" onClick={handleMobileSearch} className="text-muted-foreground hover:text-foreground hover:bg-accent">
						<Search className="w-5 h-5" />
					</Button>
					<Button variant="outline" size="icon" onClick={() => setMobileMenuOpen(true)} className="border-neutral-700 dark:border-neutral-700 hover:border-neutral-600 dark:hover:border-neutral-600 hover:bg-neutral-800 dark:hover:bg-neutral-800">
						<Menu className="w-4 h-4" />
					</Button>
				</div>

				<AnimatePresence>
					{mobileMenuOpen && (
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
							<motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.3 }} className="fixed top-0 right-0 h-screen w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
								<div className="flex flex-col h-full bg-neutral-950 border-l border-neutral-800">
									{/* Menu Header */}
									<div className="flex items-center justify-between p-4 border-b border-neutral-800">
										<Link href="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
											<Image src="/logos/ThorbisLogo.webp" alt="Thorbis" width={32} height={32} />
											<h2 className="text-lg font-semibold">Thorbis</h2>
										</Link>
										<Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
											<X className="w-5 h-5" />
										</Button>
									</div>

									{/* User Profile / Auth */}
									<div className="p-6 border-b border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950">
										{user ? (
											<div className="flex items-center gap-4">
												<Image src={getAvatarWithFallback()} alt={getDisplayName()} width={48} height={48} className="rounded-full object-cover border-2 border-neutral-700" />
												<div className="flex-grow">
													<p className="font-semibold text-lg">{getDisplayName()}</p>
													<p className="text-sm text-muted-foreground">{user.email}</p>
												</div>
											</div>
										) : (
											<div className="grid grid-cols-2 gap-4">
												<Button asChild variant="outline" className="w-full py-3">
													<Link href="/login" onClick={() => setMobileMenuOpen(false)}>
														Log In
													</Link>
												</Button>
												<Button asChild className="w-full py-3">
													<Link href="/onboarding" onClick={() => setMobileMenuOpen(false)}>
														Sign Up
													</Link>
												</Button>
											</div>
										)}
									</div>

									{/* Navigation */}
									<nav className="flex-grow p-4 space-y-2 overflow-y-auto">
										{/* Main Navigation */}
										<div className="space-y-1">
											<p className="px-4 py-2 text-sm font-semibold text-muted-foreground">Navigation</p>
											<Link href="/categories" className="flex items-center gap-4 px-4 py-3 text-base rounded-lg hover:bg-neutral-800 transition-colors" onClick={() => setMobileMenuOpen(false)}>
												Categories
											</Link>
											<Link href="/dashboard/user/jobs/create" className="flex items-center gap-4 px-4 py-3 text-base rounded-lg hover:bg-neutral-800 transition-colors" onClick={() => setMobileMenuOpen(false)}>
												Post a Job
											</Link>
											<Link href="/dashboard/user/reviews/create" className="flex items-center gap-4 px-4 py-3 text-base rounded-lg hover:bg-neutral-800 transition-colors" onClick={() => setMobileMenuOpen(false)}>
												Write a Review
											</Link>
										</div>

										<div className="px-4 pt-2 pb-2">
											<DropdownMenuSeparator className="bg-neutral-800" />
										</div>

										{/* For Business Section */}
										<div className="space-y-1">
											<p className="px-4 py-2 text-sm font-semibold text-muted-foreground">For Business</p>
											<Link href="/add-a-business" className="flex items-center gap-4 px-4 py-3 text-base rounded-lg hover:bg-neutral-800 transition-colors" onClick={() => setMobileMenuOpen(false)}>
												<Plus className="w-5 h-5 text-green-400" /> Add a Business
											</Link>
											<Link href="/claim-a-business" className="flex items-center gap-4 px-4 py-3 text-base rounded-lg hover:bg-neutral-800 transition-colors" onClick={() => setMobileMenuOpen(false)}>
												<CheckCircle className="w-5 h-5 text-blue-400" /> Claim Your Business
											</Link>
											<Link href="/explore-business" className="flex items-center gap-4 px-4 py-3 text-base rounded-lg hover:bg-neutral-800 transition-colors" onClick={() => setMobileMenuOpen(false)}>
												<Sparkles className="w-5 h-5 text-purple-400" /> Business Solutions
											</Link>
											<Link href="/business-certification" className="flex items-center gap-4 px-4 py-3 text-base rounded-lg hover:bg-neutral-800 transition-colors" onClick={() => setMobileMenuOpen(false)}>
												<Shield className="w-5 h-5 text-yellow-400" /> Get Certified
											</Link>
											<Link href="/localhub" className="flex items-center gap-4 px-4 py-3 text-base rounded-lg hover:bg-neutral-800 transition-colors" onClick={() => setMobileMenuOpen(false)}>
												<MapPin className="w-5 h-5 text-indigo-400" /> Build Your Local Directory
											</Link>
										</div>

										<div className="px-4 pt-2 pb-2">
											<DropdownMenuSeparator className="bg-neutral-800" />
										</div>

										{/* Discover Section */}
										<div className="space-y-1">
											<p className="px-4 py-2 text-sm font-semibold text-muted-foreground">Discover</p>
											<Link href="/events" className="flex items-center gap-4 px-4 py-3 text-base rounded-lg hover:bg-neutral-800 transition-colors" onClick={() => setMobileMenuOpen(false)}>
												Events
											</Link>
											<Link href="/neighborhoods" className="flex items-center gap-4 px-4 py-3 text-base rounded-lg hover:bg-neutral-800 transition-colors" onClick={() => setMobileMenuOpen(false)}>
												Neighborhoods
											</Link>
											<Link href="/shorts" className="flex items-center gap-4 px-4 py-3 text-base rounded-lg hover:bg-neutral-800 transition-colors" onClick={() => setMobileMenuOpen(false)}>
												Shorts
											</Link>
										</div>

										<div className="px-4 pt-2 pb-2">
											<DropdownMenuSeparator className="bg-neutral-800" />
										</div>

										{/* About Section */}
										<div className="space-y-1">
											<p className="px-4 py-2 text-sm font-semibold text-muted-foreground">About Thorbis</p>
											<Link href="/about-us" className="flex items-center gap-4 px-4 py-3 text-base rounded-lg hover:bg-neutral-800 transition-colors" onClick={() => setMobileMenuOpen(false)}>
												About Us
											</Link>
											<Link href="/careers" className="flex items-center gap-4 px-4 py-3 text-base rounded-lg hover:bg-neutral-800 transition-colors" onClick={() => setMobileMenuOpen(false)}>
												Careers
											</Link>
											<Link href="/press" className="flex items-center gap-4 px-4 py-3 text-base rounded-lg hover:bg-neutral-800 transition-colors" onClick={() => setMobileMenuOpen(false)}>
												Press
											</Link>
											<Link href="/blog" className="flex items-center gap-4 px-4 py-3 text-base rounded-lg hover:bg-neutral-800 transition-colors" onClick={() => setMobileMenuOpen(false)}>
												Blog
											</Link>
										</div>

										<div className="px-4 pt-2 pb-2">
											<DropdownMenuSeparator className="bg-neutral-800" />
										</div>

										{/* Support Section */}
										<div className="space-y-1">
											<p className="px-4 py-2 text-sm font-semibold text-muted-foreground">Support & Legal</p>
											<Link href="/help-center" className="flex items-center gap-4 px-4 py-3 text-base rounded-lg hover:bg-neutral-800 transition-colors" onClick={() => setMobileMenuOpen(false)}>
												Help Center
											</Link>
											<Link href="/privacy" className="flex items-center gap-4 px-4 py-3 text-base rounded-lg hover:bg-neutral-800 transition-colors" onClick={() => setMobileMenuOpen(false)}>
												Privacy Policy
											</Link>
											<Link href="/terms" className="flex items-center gap-4 px-4 py-3 text-base rounded-lg hover:bg-neutral-800 transition-colors" onClick={() => setMobileMenuOpen(false)}>
												Terms of Service
											</Link>
										</div>
									</nav>

									{/* Footer / Logout */}
									{user && (
										<div className="p-4 border-t border-neutral-800">
											<button
												onClick={() => {
													handleLogout();
													setMobileMenuOpen(false);
												}}
												className="w-full text-left flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-red-900/20 text-red-400 transition-colors"
											>
												Logout
											</button>
										</div>
									)}
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Command Dialog */}
				<CommandDialog open={open} onOpenChange={setOpen}>
					<CommandInput placeholder="Type a command or search..." />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup heading="Suggestions">
							<CommandItem>Calendar</CommandItem>
							<CommandItem>Search Emoji</CommandItem>
							<CommandItem>Calculator</CommandItem>
						</CommandGroup>
					</CommandList>
				</CommandDialog>
			</div>
		</div>
	);
}
