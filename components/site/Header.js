"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, redirect } from "next/navigation";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@components/ui/sheet";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@components/ui/drawer";
import { ChevronDown, Menu, Search, Bell } from "react-feather";
import { Bot } from "lucide-react";
import SearchBarHeader from "@components/shared/searchBox/SearchBarHeader";
import useAuthStore from "@store/useAuthStore";

export default function Header() {
	const [open, setOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const pathname = usePathname();
	const { user, userRoles, logout, setUser, setUserRoles, initializeAuth } = useAuthStore((state) => ({
		user: state.user,
		userRoles: state.userRoles,
		logout: state.logout,
		setUser: state.setUser,
		setUserRoles: state.setUserRoles,
		initializeAuth: state.initializeAuth,
	}));

	console.log(userRoles);

	useEffect(() => {
		initializeAuth();
	}, [setUser, setUserRoles, initializeAuth]);

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

	// Check if we're on any search page
	const isSearchMapPage = pathname.startsWith("/search");

	return (
		<div id="header" className="transition-none sticky top-0 z-[60] bg-card/95 backdrop-blur-md border-b border-border/50">
			<div className={`flex items-center justify-between w-full gap-6 py-3 mx-auto ${isSearchMapPage ? "px-4 max-w-none" : "px-4 lg:px-24"}`}>
				<div className="flex flex-row items-center space-x-6 w-full">
					<Link href="/" className="flex items-center space-x-3 text-xl font-bold group">
						<div className="relative">
							<Image src="/ThorbisLogo.webp" alt="Thorbis" width={50} height={50} className="w-12 h-12 transition-transform duration-200 group-hover:scale-105" />
							<div className="absolute inset-0 bg-gradient-to-r rounded-full opacity-0 transition-opacity duration-200 from-blue-500/20 to-green-500/20 group-hover:opacity-100" />
						</div>
						<div className="hidden sm:block">
							<h1 className="text-lg font-bold leading-none text-foreground">Thorbis</h1>
							<p className="text-xs text-muted-foreground">Local Business Directory</p>
						</div>
					</Link>
					<div className="hidden items-center w-full max-w-2xl md:flex">
						{/* Show search bar on all pages */}
						<div className="flex items-center w-full max-w-2xl">
							<SearchBarHeader />
						</div>
					</div>
				</div>
				<div className="hidden space-x-1 lg:flex xl:space-x-2">
					<Link href="/categories" passHref>
						<Button variant="ghost" size="sm" className="text-sm font-medium transition-colors hover:text-primary">
							Categories
						</Button>
					</Link>
					<Link href="/dashboard/user/jobs/create" passHref>
						<Button variant="ghost" size="sm" className="text-sm font-medium transition-colors hover:text-primary">
							Post a Job
						</Button>
					</Link>
					<Link href="/dashboard/user/reviews/create" passHref>
						<Button variant="ghost" size="sm" className="text-sm font-medium transition-colors hover:text-primary">
							Write Review
						</Button>
					</Link>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="sm" className="text-sm font-medium transition-colors hover:text-primary">
								For Business <ChevronDown className="ml-1 w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-64 z-[80] bg-card/95 backdrop-blur-md border border-border/50">
							<DropdownMenuItem asChild className="text-sm">
								<Link href="/add-a-business">
									<div className="flex flex-col">
										<span className="font-medium">Add a Business</span>
										<span className="text-xs text-muted-foreground">List your business for free</span>
									</div>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild className="text-sm">
								<Link href="/claim-a-business">
									<div className="flex flex-col">
										<span className="font-medium">Claim Your Business</span>
										<span className="text-xs text-muted-foreground">Already listed? Claim ownership</span>
									</div>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild className="text-sm">
								<Link href="/explore-business">
									<div className="flex flex-col">
										<span className="font-medium">Business Solutions</span>
										<span className="text-xs text-muted-foreground">Grow your business with Thorbis</span>
									</div>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild className="text-sm">
								<Link href="/business-certification">
									<div className="flex items-center">
										<span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">Get Thorbis Certified</span>
										<span className="px-1.5 py-0.5 ml-2 text-xs text-white bg-gradient-to-r from-blue-500 to-green-500 rounded-full">Elite</span>
									</div>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild className="text-sm">
								<Link href="/localhub">
									<div className="flex flex-col">
										<div className="flex items-center">
											<span className="font-medium">Build Your Local Directory</span>
											<span className="px-1.5 py-0.5 ml-2 text-xs text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">New</span>
										</div>
										<span className="text-xs text-muted-foreground">Create & monetize your neighborhood hub</span>
									</div>
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					{user ? (
						<div className="flex items-center space-x-2">
							{/* Notification Bell */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm" className="relative p-2 w-9 h-9 text-muted-foreground hover:text-foreground hover:bg-accent">
										<Bell className="w-5 h-5" />
										<span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"></span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-80 z-[80] bg-card/95 backdrop-blur-md border border-border/50">
									<div className="flex justify-between items-center p-3 border-b border-border/50">
										<h3 className="font-semibold text-foreground">Notifications</h3>
										<Badge variant="secondary" className="text-xs">
											3 new
										</Badge>
									</div>
									<div className="overflow-y-auto max-h-96">
										<DropdownMenuItem className="flex items-start p-4 space-x-3">
											<div className="flex-shrink-0 mt-2 w-2 h-2 bg-blue-500 rounded-full"></div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-foreground">New review received</p>
												<p className="mt-1 text-xs text-muted-foreground">Someone reviewed your business listing</p>
												<p className="text-xs text-muted-foreground">2 minutes ago</p>
											</div>
										</DropdownMenuItem>
										<DropdownMenuItem className="flex items-start p-4 space-x-3">
											<div className="flex-shrink-0 mt-2 w-2 h-2 bg-green-500 rounded-full"></div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-foreground">Job application received</p>
												<p className="mt-1 text-xs text-muted-foreground">New application for your job posting</p>
												<p className="text-xs text-muted-foreground">1 hour ago</p>
											</div>
										</DropdownMenuItem>
										<DropdownMenuItem className="flex items-start p-4 space-x-3">
											<div className="flex-shrink-0 mt-2 w-2 h-2 bg-orange-500 rounded-full"></div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-foreground">Subscription reminder</p>
												<p className="mt-1 text-xs text-muted-foreground">Your premium plan expires in 3 days</p>
												<p className="text-xs text-muted-foreground">3 hours ago</p>
											</div>
										</DropdownMenuItem>
									</div>
									<div className="p-3 border-t border-border/50">
										<Button variant="ghost" size="sm" className="justify-center w-full text-xs">
											View all notifications
										</Button>
									</div>
								</DropdownMenuContent>
							</DropdownMenu>

							{/* User Avatar Menu */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="sm" className="p-0 w-9 h-9 rounded-full border shadow-sm border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary" aria-label="User menu">
										<div className="flex overflow-hidden relative mx-auto w-8 h-8 rounded-full shrink-0">
											<img className="object-cover w-full h-full aspect-square" alt={user?.user_metadata?.first_name || user?.email?.split("@")[0] || "User"} src={`https://vercel.com/api/www/avatar?u=${user?.email?.split("@")[0] || "user"}&s=64`} />
										</div>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56 z-[80] bg-card/95 backdrop-blur-md border border-border/50">
									<div className="flex items-center p-3 space-x-3 border-b border-border/50">
										<div className="flex overflow-hidden relative w-8 h-8 rounded-full shrink-0">
											<img className="object-cover w-full h-full aspect-square" alt={user?.user_metadata?.first_name || user?.email?.split("@")[0] || "User"} src={`https://vercel.com/api/www/avatar?u=${user?.email?.split("@")[0] || "user"}&s=64`} />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium truncate text-foreground">{user?.user_metadata?.first_name || user?.email?.split("@")[0] || "User"}</p>
											<p className="text-xs truncate text-muted-foreground">{user?.email}</p>
										</div>
									</div>
									<DropdownMenuItem asChild>
										<Link href="/dashboard/user" className="flex items-center">
											<span>Dashboard</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/dashboard/user/settings" className="flex items-center">
											<span>Settings</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/dashboard/user/support" className="flex items-center">
											<span>Support</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
										Logout
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					) : (
						<>
							<Link href="/login">
								<Button variant="ghost" size="sm" className="text-sm font-medium transition-colors hover:text-primary">
									Log In
								</Button>
							</Link>
							<Link href="/onboarding">
								<Button size="sm" className="transition-colors bg-primary hover:bg-primary/90 text-primary-foreground">
									Sign Up
								</Button>
							</Link>
						</>
					)}
				</div>

				<div className="flex items-center space-x-2 md:hidden">
					<Button variant="ghost" size="icon" onClick={handleMobileSearch} className="text-muted-foreground hover:text-foreground">
						<Search className="w-5 h-5" />
					</Button>
				</div>

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

				<Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
					<DrawerTrigger asChild>
						<Button variant="outline" size="icon" className="flex md:hidden">
							<Menu className="w-4 h-4" />
						</Button>
					</DrawerTrigger>
					<DrawerContent className="p-4 h-5/6 text-white bg-black">
						{/* Mobile Search Bar */}
						<div className="mb-6">
							<div className="flex gap-2 items-center p-3 bg-gray-800 rounded-lg">
								<Search className="w-4 h-4 text-gray-400" />
								<input
									type="text"
									placeholder="Search for businesses..."
									className="flex-1 placeholder-gray-400 text-white bg-transparent border-none outline-none"
									onKeyDown={(e) => {
										if (e.key === "Enter" && e.target.value.trim()) {
											window.location.href = `/search?query=${encodeURIComponent(e.target.value.trim())}`;
										}
									}}
								/>
							</div>
						</div>

						<nav>
							<ul className="space-y-4">
								<li>
									<Link href="/" onClick={() => setMobileMenuOpen(false)}>
										Home
									</Link>
								</li>
								<li>
									<Link href="/categories" onClick={() => setMobileMenuOpen(false)}>
										Categories
									</Link>
								</li>
								<li>
									<Link href="/cities" onClick={() => setMobileMenuOpen(false)}>
										Cities
									</Link>
								</li>
								<li>
									<Link href="/businesses" onClick={() => setMobileMenuOpen(false)}>
										Businesses
									</Link>
								</li>
								<li>
									<Link href="/ads" onClick={() => setMobileMenuOpen(false)}>
										Ads
									</Link>
								</li>
								{user ? (
									<>
										<li>
											<Link href="/dashboard/user" onClick={() => setMobileMenuOpen(false)}>
												Dashboard
											</Link>
										</li>
										<li>
											<Link href="/dashboard/user/jobs/create" onClick={() => setMobileMenuOpen(false)}>
												Post a Job
											</Link>
										</li>
										<li>
											<Link href="/dashboard/user/reviews/create" onClick={() => setMobileMenuOpen(false)}>
												Write Review
											</Link>
										</li>
										<li>
											<Button variant="outline" onClick={handleLogout}>
												Logout
											</Button>
										</li>
									</>
								) : (
									<>
										<li>
											<Link href="/login" onClick={() => setMobileMenuOpen(false)}>
												Login
											</Link>
										</li>
										<li>
											<Link href="/onboarding" onClick={() => setMobileMenuOpen(false)}>
												Sign Up
											</Link>
										</li>
									</>
								)}
								<li>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="outline">Add a Business</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent className="w-56 bg-white">
											<DropdownMenuItem asChild>
												<Link href="/add-a-business" onClick={() => setMobileMenuOpen(false)}>
													Add a Business
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link href="/claim-a-business" onClick={() => setMobileMenuOpen(false)}>
													Claim your business
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link href="/explore-business" onClick={() => setMobileMenuOpen(false)}>
													Explore Thorbis for Business
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link href="/localhub" onClick={() => setMobileMenuOpen(false)}>
													Build Your Local Directory
												</Link>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</li>
							</ul>
						</nav>
					</DrawerContent>
				</Drawer>
			</div>
		</div>
	);
}
