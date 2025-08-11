"use client";

import React, { useEffect, useState, memo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuPortal } from "@components/ui/dropdown-menu";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@components/ui/command";
import { ChevronDown, Menu, Search, Bell, Plus, CheckCircle, Shield, MapPin, User, Settings, X, Home, HelpCircle, Zap } from "react-feather";
import { Sparkles, TrendingUp, Star } from "lucide-react";
import { SearchBarUnified as SearchBarHeader } from "@components/shared/searchBox";
import { useAuth } from "@context/auth-context";
import { useUserProfile } from "@hooks/use-user-profile";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
	const [open, setOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [focusedElement, setFocusedElement] = useState(null);
	const [breadcrumbsVisible, setBreadcrumbsVisible] = useState(false);
	const [notificationCount, setNotificationCount] = useState(2);
	const [isSearchFocused, setIsSearchFocused] = useState(false);
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

		// Fallback to Vercel avatar API if no avatar is set (consistent with other components)
		if (user?.email) {
			const username = user.email.split("@")[0] || "user";
			return `https://vercel.com/api/www/avatar?u=${username}&s=200`;
		}

		return "/placeholder-avatar.svg";
	};

	// Vercel-style contextual breadcrumb generation
	const generateSmartBreadcrumbs = useCallback(() => {
		if (pathname === "/") return [];

		const segments = pathname.split("/").filter(Boolean);
		const breadcrumbs = [];

		let currentPath = "";
		segments.forEach((segment, index) => {
			currentPath += `/${segment}`;
			const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
			breadcrumbs.push({
				label,
				href: currentPath,
				isActive: index === segments.length - 1,
			});
		});

		return breadcrumbs.slice(0, 3); // Limit to 3 for minimalism
	}, [pathname]);

	// Smart notification management (Vercel-style minimal)
	const getNotificationSummary = useCallback(() => {
		if (notificationCount === 0) return null;
		if (notificationCount === 1) return "1 update";
		return `${notificationCount} updates`;
	}, [notificationCount]);

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

		window.addEventListener("scroll", handleScroll, { passive: true });
		document.addEventListener("keydown", down);
		document.addEventListener("focusin", handleFocusIn);
		document.addEventListener("focusout", handleFocusOut);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			document.removeEventListener("keydown", down);
			document.removeEventListener("focusin", handleFocusIn);
			document.removeEventListener("focusout", handleFocusOut);
		};
	}, [mobileMenuOpen]);

	// Vercel-style smart breadcrumb visibility
	useEffect(() => {
		const shouldShowBreadcrumbs = pathname !== "/" && !pathname.startsWith("/search") && !pathname.startsWith("/login") && !pathname.startsWith("/signup") && generateSmartBreadcrumbs().length > 0;
		setBreadcrumbsVisible(shouldShowBreadcrumbs);
	}, [pathname, generateSmartBreadcrumbs]);

	// Mock notification updates (in real app, this would be WebSocket/SSE)
	useEffect(() => {
		const timer = setTimeout(() => {
			if (Math.random() > 0.8) {
				setNotificationCount((prev) => prev + 1);
			}
		}, 30000);
		return () => clearTimeout(timer);
	}, [notificationCount]);

	// Close mobile menu on Escape for accessibility
	useEffect(() => {
		if (!mobileMenuOpen) return;
		const handleEsc = (e) => {
			if (e.key === "Escape") {
				setMobileMenuOpen(false);
			}
		};
		document.addEventListener("keydown", handleEsc);
		return () => document.removeEventListener("keydown", handleEsc);
	}, [mobileMenuOpen]);

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
			router.push("/"); // Redirect after logout
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
		<>
			<header id="header" className={`sticky top-0 z-[60] transition-all duration-200 ease-out ${isScrolled ? "bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800" : "bg-white dark:bg-black border-b border-gray-100 dark:border-gray-900"}`} role="banner" aria-label="Main navigation">
				<div className={`relative flex items-center justify-between w-full transition-all duration-200 ${isSearchMapPage ? "px-4 py-3" : "px-6 py-3.5"}`}>
					{/* Vercel-style Left Section - Logo and Search */}
					<div className="flex items-center flex-1 min-w-0">
						{/* Minimal Vercel-style Logo */}
						<Link href="/" className="flex items-center space-x-3 group mr-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md p-1 -m-1" aria-label={`${pageContext.title} - Return to homepage`}>
							<div className="flex items-center space-x-3">
								{/* Clean logo container (Vercel-style) */}
								<div className="flex items-center justify-center w-8 h-8 transition-transform duration-150 group-hover:scale-105">
									<Image src="/logos/ThorbisLogo.webp" alt="" width={32} height={32} className="w-8 h-8" priority />
								</div>

								{/* Minimal branding text (Vercel-style typography) */}
								<div className="hidden sm:block">
									<span className="text-lg font-medium text-gray-900 dark:text-white tracking-tight">{pageContext.title}</span>
								</div>
							</div>
						</Link>

						{/* Clean Search */}
						<div className="hidden items-center flex-1 max-w-2xl md:flex">
							<div className="w-full">
								<SearchBarHeader />
							</div>
						</div>
					</div>

					{/* Vercel-style Right Section - Navigation and User */}
					<div className="flex items-center space-x-1">
						{/* Clean Navigation */}
						<nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Primary navigation">
							<Link href="/categories">
								<Button variant="ghost" size="sm" className={`text-sm font-medium transition-colors duration-150 px-3 py-1.5 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${pathname === "/categories" ? "text-black dark:text-white bg-gray-100 dark:bg-gray-800" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"}`}>
									Categories
								</Button>
							</Link>

							<Link href="/dashboard/user/jobs/create">
								<Button variant="ghost" size="sm" className="text-sm font-medium transition-colors duration-150 px-3 py-1.5 h-8 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
									Post Job
								</Button>
							</Link>

							<Link href="/dashboard/user/reviews/create">
								<Button variant="ghost" size="sm" className="text-sm font-medium transition-colors duration-150 px-3 py-1.5 h-8 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
									Write Review
								</Button>
							</Link>
						</nav>

						{/* Minimal separator */}
						<div className="hidden lg:block w-px h-4 bg-gray-200 dark:bg-gray-700 mx-2" />

						{/* Business Solutions */}
						<DropdownMenu modal={false}>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="text-sm font-medium transition-colors duration-150 px-3 py-1.5 h-8 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Business solutions">
									For Business
									<ChevronDown className="ml-1 w-3 h-3" aria-hidden="true" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuPortal>
								<DropdownMenuContent className="z-[9999] w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg">
									<div className="p-3 border-b border-slate-200 dark:border-slate-700">
										<h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1">Business Solutions</h3>
										<p className="text-xs text-slate-600 dark:text-slate-400">Grow your business with Thorbis</p>
									</div>

									<div className="p-2">
										<DropdownMenuItem asChild className="flex items-center gap-4 py-3 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
											<Link href="/add-a-business">
												<div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 flex items-center justify-center">
													<Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
												</div>
												<div className="flex flex-col flex-1">
													<span className="text-sm font-medium text-slate-900 dark:text-slate-200">Add a Business</span>
													<span className="text-xs text-slate-600 dark:text-slate-400">List your business for free</span>
												</div>
												<div className="px-2 py-1 bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded text-xs text-green-700 dark:text-green-400 font-medium">Free</div>
											</Link>
										</DropdownMenuItem>

										<DropdownMenuItem asChild className="flex items-center gap-4 py-3 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
											<Link href="/claim-a-business">
												<div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center">
													<CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
												</div>
												<div className="flex flex-col flex-1">
													<span className="text-sm font-medium text-slate-900 dark:text-slate-200">Claim Your Business</span>
													<span className="text-xs text-slate-600 dark:text-slate-400">Already listed? Claim ownership</span>
												</div>
											</Link>
										</DropdownMenuItem>
									</div>

									<div className="border-t border-slate-200 dark:border-slate-700 p-2">
										<DropdownMenuItem asChild className="flex items-center gap-4 py-3 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
											<Link href="/explore-business">
												<div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 flex items-center justify-center">
													<TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
												</div>
												<div className="flex flex-col flex-1">
													<span className="text-sm font-medium text-slate-900 dark:text-slate-200">Advanced Analytics</span>
													<span className="text-xs text-slate-600 dark:text-slate-400">Detailed insights & reporting</span>
												</div>
												<div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-800 rounded text-xs text-purple-700 dark:text-purple-400 font-medium">Pro</div>
											</Link>
										</DropdownMenuItem>
									</div>

									<div className="border-t border-slate-200 dark:border-slate-700 p-2">
										<DropdownMenuItem asChild className="flex items-center gap-4 py-3 px-3 rounded-lg hover:bg-slate-800/50 transition-all duration-200">
											<Link href="/business-certification">
												<div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 flex items-center justify-center">
													<Shield className="w-5 h-5 text-yellow-400" />
												</div>
												<div className="flex flex-col flex-1">
													<div className="flex items-center gap-2 mb-1">
														<span className="text-sm font-medium text-slate-200">Get Thorbis Certified</span>
														<div className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-xs text-white font-medium">Elite</div>
													</div>
													<span className="text-xs text-slate-400">Premium verification badge</span>
												</div>
											</Link>
										</DropdownMenuItem>

										<DropdownMenuItem asChild className="flex items-center gap-4 py-3 px-3 rounded-lg hover:bg-slate-800/50 transition-all duration-200">
											<Link href="/localhub">
												<div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
													<MapPin className="w-5 h-5 text-indigo-400" />
												</div>
												<div className="flex flex-col flex-1">
													<div className="flex items-center gap-2 mb-1">
														<span className="text-sm font-medium text-slate-200">Local Directory Hub</span>
														<div className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs text-white font-medium">New</div>
													</div>
													<span className="text-xs text-slate-400">Create & monetize your neighborhood</span>
												</div>
											</Link>
										</DropdownMenuItem>
									</div>
								</DropdownMenuContent>
							</DropdownMenuPortal>
						</DropdownMenu>

						{/* Vercel-style User Section */}
						{user ? (
							<div className="flex items-center space-x-2">
								{/* Minimal Notification Indicator */}
								{notificationCount > 0 && (
									<DropdownMenu modal={false}>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="sm" className="relative text-sm font-medium transition-colors duration-150 px-3 py-1.5 h-8 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
												{getNotificationSummary()}
												<div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuPortal>
											<DropdownMenuContent className="z-[9999] w-72 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg rounded-lg">
												<div className="p-4 border-b border-gray-100 dark:border-gray-800">
													<h3 className="text-sm font-medium text-gray-900 dark:text-white">Updates</h3>
													<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notificationCount} new notifications</p>
												</div>

												<div className="py-2">
													<div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer">
														<div className="flex items-start space-x-3">
															<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
															<div className="flex-1 min-w-0">
																<p className="text-sm text-gray-900 dark:text-white">New business inquiry</p>
																<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Someone requested more information</p>
																<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 min ago</p>
															</div>
														</div>
													</div>

													<div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer">
														<div className="flex items-start space-x-3">
															<div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
															<div className="flex-1 min-w-0">
																<p className="text-sm text-gray-900 dark:text-white">Review published</p>
																<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your review is now live</p>
																<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">1 hour ago</p>
															</div>
														</div>
													</div>
												</div>

												<div className="p-3 border-t border-gray-100 dark:border-gray-800">
													<Button variant="ghost" size="sm" className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" onClick={() => setNotificationCount(0)}>
														Mark all as read
													</Button>
												</div>
											</DropdownMenuContent>
										</DropdownMenuPortal>
									</DropdownMenu>
								)}

								{/* Vercel-style User Avatar */}
								<DropdownMenu modal={false}>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="sm" className="relative w-8 h-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="User menu">
											<Image src={getAvatarWithFallback()} alt={getDisplayName()} width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuPortal>
										<DropdownMenuContent className="z-[9999] w-64 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg rounded-lg">
											{/* Enhanced User Info Header */}
											<div className="p-4 border-b border-slate-700/50">
												<div className="flex items-center space-x-4">
													<div className="relative">
														<div className="flex overflow-hidden w-12 h-12 rounded-xl shrink-0 border-2 border-slate-700/50">
															<Image src={getAvatarWithFallback()} alt={getDisplayName()} fill sizes="48px" className="object-cover" />
														</div>
														<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full" />
													</div>
													<div className="flex-1 min-w-0">
														<h4 className="text-sm font-semibold text-slate-200 truncate">{getDisplayName()}</h4>
														<p className="text-xs text-slate-400 truncate">{user?.email || "guest@example.com"}</p>
														<div className="flex items-center mt-1">
															<div className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded-md text-xs text-blue-400 font-medium">Pro Member</div>
														</div>
													</div>
												</div>
											</div>

											{/* Enhanced Quick Stats */}
											<div className="p-4 border-b border-slate-700/50">
												<div className="grid grid-cols-3 gap-4">
													<div className="text-center">
														<div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg mx-auto mb-2 flex items-center justify-center">
															<Star className="w-4 h-4 text-blue-400" />
														</div>
														<p className="text-sm font-semibold text-slate-200">12</p>
														<p className="text-xs text-slate-400">Reviews</p>
													</div>
													<div className="text-center">
														<div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg mx-auto mb-2 flex items-center justify-center">
															<Plus className="w-4 h-4 text-purple-400" />
														</div>
														<p className="text-sm font-semibold text-slate-200">5</p>
														<p className="text-xs text-slate-400">Saved</p>
													</div>
													<div className="text-center">
														<div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg mx-auto mb-2 flex items-center justify-center">
															<TrendingUp className="w-4 h-4 text-green-400" />
														</div>
														<p className="text-sm font-semibold text-slate-200">3</p>
														<p className="text-xs text-slate-400">Jobs</p>
													</div>
												</div>
											</div>

											{/* Enhanced Navigation */}
											<div className="p-2">
												<DropdownMenuItem asChild className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-slate-800/50 transition-all duration-200">
													<Link href="/dashboard/user">
														<div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
															<User className="w-4 h-4 text-blue-400" />
														</div>
														<span className="text-sm font-medium text-slate-200">Dashboard</span>
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem asChild className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-slate-800/50 transition-all duration-200">
													<Link href="/dashboard/user/settings">
														<div className="w-8 h-8 bg-gradient-to-r from-slate-500/20 to-gray-500/20 border border-slate-500/30 rounded-lg flex items-center justify-center">
															<Settings className="w-4 h-4 text-slate-400" />
														</div>
														<span className="text-sm font-medium text-slate-200">Settings</span>
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem asChild className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-slate-800/50 transition-all duration-200">
													<Link href="/dashboard/user/support">
														<div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg flex items-center justify-center">
															<HelpCircle className="w-4 h-4 text-green-400" />
														</div>
														<span className="text-sm font-medium text-slate-200">Support</span>
													</Link>
												</DropdownMenuItem>
											</div>

											<div className="border-t border-slate-700/50 p-2">
												<DropdownMenuItem onClick={handleLogout} className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-red-900/20 text-red-400 hover:text-red-300 transition-all duration-200 cursor-pointer">
													<div className="w-8 h-8 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-lg flex items-center justify-center">
														<X className="w-4 h-4 text-red-400" />
													</div>
													<span className="text-sm font-medium">Logout</span>
												</DropdownMenuItem>
											</div>
										</DropdownMenuContent>
									</DropdownMenuPortal>
								</DropdownMenu>
							</div>
						) : (
							<div className="flex items-center space-x-3">
								<Link href="/login">
									<Button variant="ghost" size="sm" className="text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50 transition-all duration-200 px-4 py-2 h-9">
										Log In
									</Button>
								</Link>
								<Link href="/onboarding">
									<Button size="sm" className="text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 px-5 py-2 h-9">
										<Sparkles className="w-4 h-4 mr-2" />
										Sign Up
									</Button>
								</Link>
							</div>
						)}
					</div>

					{/* Mobile Section */}
					<div className="flex items-center space-x-2 lg:hidden">
						{/* Mobile Search Button */}
						<Button
							variant="ghost"
							size="icon"
							onClick={handleMobileSearch}
							className={`w-10 h-10 transition-all duration-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-1 border border-transparent active:scale-95 ${
								isScrolled ? "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700/50 hover:shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/30"
							}`}
							aria-label="Open search"
						>
							<Search className="w-5 h-5 transition-transform duration-200 hover:scale-105" />
						</Button>

						{/* Native-style Mobile Menu Button with Enhanced Visual Feedback */}
						<Button
							variant="outline"
							size="icon"
							onClick={() => setMobileMenuOpen(true)}
							className={`w-10 h-10 transition-all duration-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-1 active:scale-95 ${
								isScrolled ? "border-slate-300/70 dark:border-slate-700/70 hover:border-slate-400/70 dark:hover:border-slate-600/70 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:shadow-sm" : "border-slate-300 dark:border-slate-700/50 hover:border-slate-400 dark:hover:border-slate-600/70 hover:bg-slate-50 dark:hover:bg-slate-800/30"
							} text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white`}
							aria-label="Open navigation menu"
							aria-expanded={mobileMenuOpen}
							aria-controls="mobile-menu"
						>
							<Menu className="w-5 h-5 transition-transform duration-200 hover:scale-105" />
						</Button>
					</div>

					<AnimatePresence>
						{mobileMenuOpen && (
							<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60" onClick={() => setMobileMenuOpen(false)}>
								<motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.3 }} className="fixed top-0 right-0 h-screen w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Mobile menu">
									<div className="flex flex-col h-full bg-white dark:bg-neutral-950 border-l border-gray-200 dark:border-neutral-800">
										{/* Menu Header */}
										<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-800">
											<Link href="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
												<Image src="/logos/ThorbisLogo.webp" alt="Thorbis" width={32} height={32} />
												<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Thorbis</h2>
											</Link>
											<Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)}>
												<X className="w-5 h-5" />
											</Button>
										</div>

										{/* User Profile / Auth */}
										<div className="p-6 border-b border-gray-200 dark:border-neutral-800">
											{user ? (
												<div className="flex items-center gap-4">
													<Image src={getAvatarWithFallback()} alt={getDisplayName()} width={48} height={48} className="rounded-full object-cover border-2 border-gray-200 dark:border-neutral-700" />
													<div className="flex-grow min-w-0">
														<p className="font-semibold text-lg truncate text-gray-900 dark:text-white">{getDisplayName()}</p>
														<p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
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

											{/* Quick Search */}
											<div className="mt-4">
												<div className="md:hidden">
													<SearchBarHeader />
												</div>
											</div>
										</div>

										{/* Navigation */}
										<nav className="flex-grow p-4 space-y-4 overflow-y-auto">
											{/* Quick Actions */}
											<div>
												<p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Quick actions</p>
												<div className="grid grid-cols-2 gap-3">
													<Link href="/" onClick={() => setMobileMenuOpen(false)} className="group flex items-center gap-2 rounded-lg border border-gray-300 dark:border-neutral-800 px-3 py-3 hover:bg-gray-50 dark:hover:bg-neutral-900">
														<Home className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
														<span className="text-sm">Home</span>
													</Link>
													<Link href="/search" onClick={() => setMobileMenuOpen(false)} className="group flex items-center gap-2 rounded-lg border border-gray-300 dark:border-neutral-800 px-3 py-3 hover:bg-gray-50 dark:hover:bg-neutral-900">
														<Search className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
														<span className="text-sm">Search</span>
													</Link>
													<Link href="/categories" onClick={() => setMobileMenuOpen(false)} className="group flex items-center gap-2 rounded-lg border border-gray-300 dark:border-neutral-800 px-3 py-3 hover:bg-gray-50 dark:hover:bg-neutral-900">
														<MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
														<span className="text-sm">Categories</span>
													</Link>
													<Link href="/add-a-business" onClick={() => setMobileMenuOpen(false)} className="group flex items-center gap-2 rounded-lg border border-gray-300 dark:border-neutral-800 px-3 py-3 hover:bg-gray-50 dark:hover:bg-neutral-900">
														<Plus className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
														<span className="text-sm">Add Business</span>
													</Link>
												</div>
											</div>

											{/* Main Navigation */}
											<div className="space-y-1">
												<p className="px-1 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Navigation</p>
												<Link href="/dashboard/user/jobs/create" className="flex items-center gap-3 px-3 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors" onClick={() => setMobileMenuOpen(false)}>
													<Plus className="w-5 h-5 text-gray-500 dark:text-gray-400" />
													<span>Post a Job</span>
												</Link>
												<Link href="/dashboard/user/reviews/create" className="flex items-center gap-3 px-3 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors" onClick={() => setMobileMenuOpen(false)}>
													<Star className="w-5 h-5 text-gray-500 dark:text-gray-400" />
													<span>Write a Review</span>
												</Link>
											</div>

											<div className="pt-2 pb-1">
												<div className="h-px bg-gray-200 dark:bg-neutral-800" />
											</div>

											{/* For Business Section */}
											<div className="space-y-1">
												<p className="px-1 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400">For Business</p>
												<Link href="/claim-a-business" className="flex items-center gap-3 px-3 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors" onClick={() => setMobileMenuOpen(false)}>
													<CheckCircle className="w-5 h-5 text-blue-500" />
													<span>Claim Your Business</span>
												</Link>
												<Link href="/explore-business" className="flex items-center gap-3 px-3 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors" onClick={() => setMobileMenuOpen(false)}>
													<Sparkles className="w-5 h-5 text-purple-500" />
													<span>Business Solutions</span>
												</Link>
												<Link href="/business-certification" className="flex items-center gap-3 px-3 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors" onClick={() => setMobileMenuOpen(false)}>
													<Shield className="w-5 h-5 text-yellow-500" />
													<span>Get Certified</span>
												</Link>
												<Link href="/localhub" className="flex items-center gap-3 px-3 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors" onClick={() => setMobileMenuOpen(false)}>
													<MapPin className="w-5 h-5 text-indigo-500" />
													<span>Build Your Local Directory</span>
												</Link>
											</div>

											<div className="pt-2 pb-1">
												<div className="h-px bg-gray-200 dark:bg-neutral-800" />
											</div>

											{/* Discover Section */}
											<div className="space-y-1">
												<p className="px-1 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Discover</p>
												<Link href="/events" className="flex items-center gap-3 px-3 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors" onClick={() => setMobileMenuOpen(false)}>
													<span>Events</span>
												</Link>
												<Link href="/neighborhoods" className="flex items-center gap-3 px-3 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors" onClick={() => setMobileMenuOpen(false)}>
													<span>Neighborhoods</span>
												</Link>
												<Link href="/shorts" className="flex items-center gap-3 px-3 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors" onClick={() => setMobileMenuOpen(false)}>
													<span>Shorts</span>
												</Link>
											</div>
										</nav>

										{/* Footer Actions */}
										<div className="p-4 border-t border-gray-200 dark:border-neutral-800">
											<div className="flex items-center gap-2">
												<Link href={user ? "/dashboard/user/settings" : "/login"} onClick={() => setMobileMenuOpen(false)} className="flex-1">
													<Button variant="outline" className="w-full justify-center">
														<Settings className="w-4 h-4 mr-2" />
														{user ? "Settings" : "Login"}
													</Button>
												</Link>
												<Link href="/support" onClick={() => setMobileMenuOpen(false)} className="flex-1">
													<Button className="w-full justify-center" variant="default">
														<HelpCircle className="w-4 h-4 mr-2" /> Support
													</Button>
												</Link>
											</div>

											{user && (
												<div className="mt-3">
													<button
														onClick={() => {
															handleLogout();
															setMobileMenuOpen(false);
														}}
														className="w-full text-left flex items-center justify-center gap-2 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900/30"
													>
														<X className="w-4 h-4" /> Logout
													</button>
												</div>
											)}
										</div>
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
			</header>

			{/* Vercel-style Contextual Breadcrumbs */}
			{breadcrumbsVisible && (
				<div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-900 py-2 px-6">
					<nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
						<Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-150">
							Home
						</Link>
						{generateSmartBreadcrumbs().map((crumb, index) => (
							<React.Fragment key={crumb.href}>
								<ChevronDown className="w-3 h-3 rotate-[-90deg] text-gray-300 dark:text-gray-700" />
								{crumb.isActive ? (
									<span className="text-gray-900 dark:text-gray-100 font-medium">{crumb.label}</span>
								) : (
									<Link href={crumb.href} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-150">
										{crumb.label}
									</Link>
								)}
							</React.Fragment>
						))}
					</nav>
				</div>
			)}
		</>
	);
}
