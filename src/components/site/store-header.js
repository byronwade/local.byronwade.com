"use client";

import React, { useEffect, useState, memo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuPortal } from "@components/ui/dropdown-menu";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@components/ui/command";
import { ChevronDown, Menu, Search, Bell, Plus, CheckCircle, Shield, MapPin, User, Settings, X, Home, HelpCircle, Zap, ShoppingCart, Package, CreditCard, Truck, Monitor, Settings as SettingsIcon } from "react-feather";
import { Sparkles, TrendingUp, Star } from "lucide-react";
import { SearchBarUnified as SearchBarHeader } from "@components/shared/searchBox";
import { useAuth } from "@context/auth-context";
import { useUserProfile } from "@hooks/use-user-profile";
import { motion, AnimatePresence } from "framer-motion";

export default function StoreHeader() {
	const [open, setOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [focusedElement, setFocusedElement] = useState(null);
	const [breadcrumbsVisible, setBreadcrumbsVisible] = useState(false);
	const [notificationCount, setNotificationCount] = useState(2);
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [cartItemCount, setCartItemCount] = useState(3); // Mock cart count
	const pathname = usePathname();
	const router = useRouter();
	const { user, userRoles, logout, isAuthenticated, getDisplayName, getAvatarUrl } = useAuth();
	const { profile } = useUserProfile();

	// Helper function to get avatar with Vercel avatar API fallback
	const getAvatarWithFallback = () => {
		const avatarUrl = getAvatarUrl();
		if (avatarUrl) {
			return avatarUrl;
		}

		// Fallback to Vercel avatar API if no avatar is set
		if (user?.email) {
			const username = user.email.split("@")[0] || "user";
			return `https://vercel.com/api/www/avatar?u=${username}&s=200`;
		}

		return "/placeholder-avatar.svg";
	};

	// Store categories for navigation
	const storeCategories = [
		{
			id: "pos-systems",
			name: "POS Systems",
			icon: CreditCard,
			description: "Point-of-sale solutions",
		},
		{
			id: "fleet-management",
			name: "Fleet Management",
			icon: Truck,
			description: "GPS tracking & optimization",
		},
		{
			id: "hardware-devices",
			name: "Hardware Devices",
			icon: Monitor,
			description: "Professional hardware",
		},
		{
			id: "software-solutions",
			name: "Software Solutions",
			icon: SettingsIcon,
			description: "Cloud-based management",
		},
	];

	// Smart header behavior with scroll detection
	useEffect(() => {
		let lastScrollY = window.scrollY;

		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			const isScrollingDown = currentScrollY > lastScrollY;

			// Update scroll state for visual changes
			setIsScrolled(currentScrollY > 20);

			lastScrollY = currentScrollY;
		};

		// Keyboard shortcuts
		const down = (e) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
			// Escape to close mobile menu
			if (e.key === "Escape" && mobileMenuOpen) {
				setMobileMenuOpen(false);
			}
		};

		// Enhanced focus management
		const handleFocusIn = (e) => {
			setFocusedElement(e.target);
		};

		const handleFocusOut = () => {
			setFocusedElement(null);
		};

		// Escape key handler
		const handleEsc = (e) => {
			if (e.key === "Escape") {
				setOpen(false);
				setMobileMenuOpen(false);
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		document.addEventListener("keydown", down);
		document.addEventListener("keydown", handleEsc);
		document.addEventListener("focusin", handleFocusIn);
		document.addEventListener("focusout", handleFocusOut);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			document.removeEventListener("keydown", down);
			document.removeEventListener("keydown", handleEsc);
			document.removeEventListener("focusin", handleFocusIn);
			document.removeEventListener("focusout", handleFocusOut);
		};
	}, [mobileMenuOpen]);

	const handleLogout = async () => {
		try {
			await logout();
			router.push("/");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	const handleMobileSearch = () => {
		setMobileMenuOpen(false);
		setOpen(true);
	};

	// Store-specific page context
	const getPageContext = () => {
		if (pathname.startsWith("/store")) {
			return {
				title: "Thorbis Store",
				subtitle: "Business Solutions",
				gradient: "from-blue-500/20 to-indigo-500/20",
			};
		}
		// Default branding
		return {
			title: "Thorbis",
			subtitle: "Business Solutions",
			gradient: "from-blue-500/20 to-indigo-500/20",
		};
	};

	const pageContext = getPageContext();

	// Check if we're on any search page
	const isSearchMapPage = pathname.startsWith("/search");

	return (
		<>
			<header id="header" className={`sticky top-0 z-[60] transition-all duration-200 ease-out ${isScrolled ? "bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800" : "bg-white dark:bg-black border-b border-gray-100 dark:border-gray-900"}`} role="banner" aria-label="Store navigation">
				<div className={`relative flex items-center justify-between w-full transition-all duration-200 ${isSearchMapPage ? "px-4 py-3" : "px-6 py-3.5"}`}>
					{/* Left Section - Logo and Search */}
					<div className="flex items-center flex-1 min-w-0">
						{/* Store Logo */}
						<Link href="/store" className="flex items-center space-x-3 group mr-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md p-1 -m-1" aria-label={`${pageContext.title} - Return to store`}>
							<div className="flex items-center space-x-3">
								{/* Clean logo container */}
								<div className="flex items-center justify-center w-8 h-8 transition-transform duration-150 group-hover:scale-105">
									<Image src="/logos/ThorbisLogo.webp" alt="" width={32} height={32} className="w-8 h-8" priority />
								</div>

								{/* Store branding text */}
								<div className="hidden sm:block">
									<span className="text-lg font-medium text-gray-900 dark:text-white tracking-tight">{pageContext.title}</span>
								</div>
							</div>
						</Link>

						{/* Store Search */}
						<div className="hidden items-center flex-1 max-w-2xl md:flex">
							<div className="w-full">
								<SearchBarHeader />
							</div>
						</div>
					</div>

					{/* Right Section - Navigation and User */}
					<div className="flex items-center space-x-1">
						{/* Store Navigation */}
						<nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Store navigation">
							{/* Store Categories Dropdown */}
							<DropdownMenu modal={false}>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm" className={`text-sm font-medium transition-colors duration-150 px-3 py-1.5 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${pathname.startsWith("/store/category") ? "text-black dark:text-white bg-gray-100 dark:bg-gray-800" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"}`}>
										Categories
										<ChevronDown className="ml-1 w-3 h-3" aria-hidden="true" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuPortal>
									<DropdownMenuContent className="z-[9999] w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg">
										<div className="p-3 border-b border-slate-200 dark:border-slate-700">
											<h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1">Store Categories</h3>
											<p className="text-xs text-slate-600 dark:text-slate-400">Browse our complete product range</p>
										</div>

										<div className="p-2">
											{storeCategories.map((category) => (
												<DropdownMenuItem key={category.id} asChild className="flex items-center gap-4 py-3 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
													<Link href={`/store/category/${category.id}`}>
														<div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center">
															<category.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
														</div>
														<div className="flex flex-col flex-1">
															<span className="text-sm font-medium text-slate-900 dark:text-slate-200">{category.name}</span>
															<span className="text-xs text-slate-600 dark:text-slate-400">{category.description}</span>
														</div>
													</Link>
												</DropdownMenuItem>
											))}
										</div>

										<div className="border-t border-slate-200 dark:border-slate-700 p-2">
											<DropdownMenuItem asChild className="flex items-center gap-4 py-3 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
												<Link href="/store">
													<div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 flex items-center justify-center">
														<Package className="w-5 h-5 text-green-600 dark:text-green-400" />
													</div>
													<div className="flex flex-col flex-1">
														<span className="text-sm font-medium text-slate-900 dark:text-slate-200">View All Products</span>
														<span className="text-xs text-slate-600 dark:text-slate-400">Complete product catalog</span>
													</div>
												</Link>
											</DropdownMenuItem>
										</div>
									</DropdownMenuContent>
								</DropdownMenuPortal>
							</DropdownMenu>

							{/* Quick Links */}
							<Link href="/store/deals">
								<Button variant="ghost" size="sm" className="text-sm font-medium transition-colors duration-150 px-3 py-1.5 h-8 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
									Deals
								</Button>
							</Link>

							<Link href="/store/support">
								<Button variant="ghost" size="sm" className="text-sm font-medium transition-colors duration-150 px-3 py-1.5 h-8 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
									Support
								</Button>
							</Link>
						</nav>

						{/* Minimal separator */}
						<div className="hidden lg:block w-px h-4 bg-gray-200 dark:bg-gray-700 mx-2" />

						{/* Shopping Cart */}
						<DropdownMenu modal={false}>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="relative text-sm font-medium transition-colors duration-150 px-3 py-1.5 h-8 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
									<ShoppingCart className="w-4 h-4" />
									{cartItemCount > 0 && <Badge className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-full flex items-center justify-center">{cartItemCount}</Badge>}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuPortal>
								<DropdownMenuContent className="z-[9999] w-80 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg rounded-lg">
									<div className="p-4 border-b border-gray-100 dark:border-gray-800">
										<h3 className="text-sm font-medium text-gray-900 dark:text-white">Shopping Cart</h3>
										<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{cartItemCount} items</p>
									</div>

									<div className="py-2 max-h-64 overflow-y-auto">
										{cartItemCount > 0 ? (
											<>
												{/* Mock cart items */}
												<div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
													<div className="flex items-center space-x-3">
														<div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex-shrink-0"></div>
														<div className="flex-1 min-w-0">
															<p className="text-sm text-gray-900 dark:text-white">Thorbis POS Pro</p>
															<p className="text-xs text-gray-500 dark:text-gray-400">$1,299.00</p>
														</div>
														<Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
															<X className="w-4 h-4" />
														</Button>
													</div>
												</div>
												<div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
													<div className="flex items-center space-x-3">
														<div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex-shrink-0"></div>
														<div className="flex-1 min-w-0">
															<p className="text-sm text-gray-900 dark:text-white">Payment Terminal</p>
															<p className="text-xs text-gray-500 dark:text-gray-400">$199.00</p>
														</div>
														<Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
															<X className="w-4 h-4" />
														</Button>
													</div>
												</div>
											</>
										) : (
											<div className="px-4 py-8 text-center">
												<ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
												<p className="text-sm text-gray-500 dark:text-gray-400">Your cart is empty</p>
											</div>
										)}
									</div>

									{cartItemCount > 0 && (
										<div className="p-4 border-t border-gray-100 dark:border-gray-800">
											<div className="flex justify-between items-center mb-3">
												<span className="text-sm font-medium text-gray-900 dark:text-white">Total:</span>
												<span className="text-sm font-bold text-gray-900 dark:text-white">$1,498.00</span>
											</div>
											<Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
												<Link href="/store/cart">
													<ShoppingCart className="mr-2 w-4 h-4" />
													View Cart
												</Link>
											</Button>
										</div>
									)}
								</DropdownMenuContent>
							</DropdownMenuPortal>
						</DropdownMenu>

						{/* Main Site Access */}
						<DropdownMenu modal={false}>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="text-sm font-medium transition-colors duration-150 px-3 py-1.5 h-8 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Main site navigation">
									Main Site
									<ChevronDown className="ml-1 w-3 h-3" aria-hidden="true" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuPortal>
								<DropdownMenuContent className="z-[9999] w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg">
									<div className="p-3 border-b border-slate-200 dark:border-slate-700">
										<h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1">Thorbis Platform</h3>
										<p className="text-xs text-slate-600 dark:text-slate-400">Access main site features</p>
									</div>

									<div className="p-2">
										<DropdownMenuItem asChild className="flex items-center gap-4 py-3 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
											<Link href="/">
												<div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center">
													<Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />
												</div>
												<div className="flex flex-col flex-1">
													<span className="text-sm font-medium text-slate-900 dark:text-slate-200">Home</span>
													<span className="text-xs text-slate-600 dark:text-slate-400">Business directory</span>
												</div>
											</Link>
										</DropdownMenuItem>

										<DropdownMenuItem asChild className="flex items-center gap-4 py-3 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
											<Link href="/search">
												<div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 flex items-center justify-center">
													<Search className="w-5 h-5 text-green-600 dark:text-green-400" />
												</div>
												<div className="flex flex-col flex-1">
													<span className="text-sm font-medium text-slate-900 dark:text-slate-200">Search Businesses</span>
													<span className="text-xs text-slate-600 dark:text-slate-400">Find local services</span>
												</div>
											</Link>
										</DropdownMenuItem>

										<DropdownMenuItem asChild className="flex items-center gap-4 py-3 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
											<Link href="/categories">
												<div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 flex items-center justify-center">
													<MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
												</div>
												<div className="flex flex-col flex-1">
													<span className="text-sm font-medium text-slate-900 dark:text-slate-200">Categories</span>
													<span className="text-xs text-slate-600 dark:text-slate-400">Browse by category</span>
												</div>
											</Link>
										</DropdownMenuItem>
									</div>

									<div className="border-t border-slate-200 dark:border-slate-700 p-2">
										<DropdownMenuItem asChild className="flex items-center gap-4 py-3 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
											<Link href="/dashboard">
												<div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 flex items-center justify-center">
													<Settings className="w-5 h-5 text-orange-600 dark:text-orange-400" />
												</div>
												<div className="flex flex-col flex-1">
													<span className="text-sm font-medium text-slate-900 dark:text-slate-200">Dashboard</span>
													<span className="text-xs text-slate-600 dark:text-slate-400">Manage your account</span>
												</div>
											</Link>
										</DropdownMenuItem>
									</div>
								</DropdownMenuContent>
							</DropdownMenuPortal>
						</DropdownMenu>

						{/* User Section */}
						{user ? (
							<div className="flex items-center space-x-2">
								{/* Notification Indicator */}
								{notificationCount > 0 && (
									<DropdownMenu modal={false}>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="sm" className="relative text-sm font-medium transition-colors duration-150 px-3 py-1.5 h-8 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
												<Bell className="w-4 h-4" />
												<div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuPortal>
											<DropdownMenuContent className="z-[9999] w-72 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg rounded-lg">
												<div className="p-4 border-b border-gray-100 dark:border-gray-800">
													<h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
													<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notificationCount} new notifications</p>
												</div>

												<div className="py-2">
													<div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer">
														<div className="flex items-start space-x-3">
															<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
															<div className="flex-1 min-w-0">
																<p className="text-sm text-gray-900 dark:text-white">Order shipped</p>
																<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your Thorbis POS Pro has been shipped</p>
																<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 min ago</p>
															</div>
														</div>
													</div>
												</div>
											</DropdownMenuContent>
										</DropdownMenuPortal>
									</DropdownMenu>
								)}

								{/* User Menu */}
								<DropdownMenu modal={false}>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="sm" className="flex items-center space-x-2 text-sm font-medium transition-colors duration-150 px-3 py-1.5 h-8 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
											<div className="w-6 h-6 rounded-full overflow-hidden">
												<Image src={getAvatarWithFallback()} alt={getDisplayName()} width={24} height={24} className="w-6 h-6" />
											</div>
											<span className="hidden sm:block">{getDisplayName()}</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuPortal>
										<DropdownMenuContent className="z-[9999] w-56 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg rounded-lg">
											<div className="p-4 border-b border-gray-100 dark:border-gray-800">
												<p className="text-sm font-medium text-gray-900 dark:text-white">{getDisplayName()}</p>
												<p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
											</div>

											<div className="py-2">
												<DropdownMenuItem asChild className="flex items-center gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-900">
													<Link href="/dashboard/user">
														<User className="w-4 h-4" />
														Profile
													</Link>
												</DropdownMenuItem>

												<DropdownMenuItem asChild className="flex items-center gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-900">
													<Link href="/store/orders">
														<Package className="w-4 h-4" />
														My Orders
													</Link>
												</DropdownMenuItem>

												<DropdownMenuItem asChild className="flex items-center gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-900">
													<Link href="/store/support">
														<HelpCircle className="w-4 h-4" />
														Support
													</Link>
												</DropdownMenuItem>
											</div>

											<div className="border-t border-gray-100 dark:border-gray-800 py-2">
												<DropdownMenuItem onClick={handleLogout} className="flex items-center gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-900 text-red-600 hover:text-red-700">
													<X className="w-4 h-4" />
													Sign Out
												</DropdownMenuItem>
											</div>
										</DropdownMenuContent>
									</DropdownMenuPortal>
								</DropdownMenu>
							</div>
						) : (
							<div className="flex items-center space-x-2">
								<Button variant="ghost" size="sm" asChild>
									<Link href="/login">Sign In</Link>
								</Button>
								<Button size="sm" asChild>
									<Link href="/signup">Sign Up</Link>
								</Button>
							</div>
						)}

						{/* Mobile Menu Button */}
						<Button variant="ghost" size="sm" className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle mobile menu">
							<Menu className="w-5 h-5" />
						</Button>
					</div>
				</div>

				{/* Mobile Menu */}
				<AnimatePresence>
					{mobileMenuOpen && (
						<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
							<div className="px-4 py-4 space-y-4">
								{/* Mobile Search */}
								<div className="w-full">
									<SearchBarHeader />
								</div>

								{/* Mobile Navigation */}
								<nav className="space-y-2">
									<Link href="/store" className="block px-3 py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
										All Products
									</Link>
									{storeCategories.map((category) => (
										<Link key={category.id} href={`/store/category/${category.id}`} className="block px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
											{category.name}
										</Link>
									))}
									<Link href="/store/deals" className="block px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
										Deals
									</Link>
									<Link href="/store/support" className="block px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
										Support
									</Link>
								</nav>

								<Separator />

								{/* Mobile Main Site Links */}
								<nav className="space-y-2">
									<Link href="/" className="block px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
										Main Site
									</Link>
									<Link href="/search" className="block px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
										Search Businesses
									</Link>
									<Link href="/categories" className="block px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
										Categories
									</Link>
								</nav>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</header>

			{/* Command Dialog for Search */}
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Search products, categories, or businesses..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Store Products">
						<CommandItem>
							<Package className="mr-2 h-4 w-4" />
							<span>Thorbis POS Pro</span>
						</CommandItem>
						<CommandItem>
							<Truck className="mr-2 h-4 w-4" />
							<span>Fleet Tracker</span>
						</CommandItem>
					</CommandGroup>
					<CommandGroup heading="Categories">
						<CommandItem>
							<CreditCard className="mr-2 h-4 w-4" />
							<span>POS Systems</span>
						</CommandItem>
						<CommandItem>
							<Monitor className="mr-2 h-4 w-4" />
							<span>Hardware Devices</span>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}
