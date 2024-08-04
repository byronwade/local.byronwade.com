"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, redirect } from "next/navigation";
import { Button } from "@components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@components/ui/sheet";
import { Drawer, DrawerContent, DrawerTrigger } from "@components/ui/drawer";
import { ChevronDown, Menu } from "react-feather";
import SearchBarHeader from "@components/shared/searchBox/SearchBarHeader";
import useAuthStore from "@store/useAuthStore";

export default function Header() {
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

	// useEffect(() => {
	// 	if (user) {
	// 		if (userRoles.includes("admin")) {
	// 			redirect("/admin");
	// 		} else if (userRoles.includes("business_owner")) {
	// 			redirect("/business");
	// 		} else {
	// 			redirect("/user");
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

	if (pathname.includes("/search")) {
		return <div id="header"></div>;
	}

	return (
		<div id="header" className="transition-none sticky top-0 z-[60] bg-card">
			<div className="flex items-center justify-between w-full gap-6 p-2 px-4 py-4 pl-8 mx-auto sm:px-12 lg:px-24">
				<div className="flex flex-row items-center w-full space-x-4">
					<Link href="/" className="flex flex-col items-center text-xl font-bold text-center">
						<Image src="/ThorbisLogo.webp" alt="Thorbis" width={50} height={50} className="w-10 h-10" />
						<h1 className="text-sm leading-none text-primary">Thorbis</h1>
					</Link>
					<div className="flex items-center w-full">
						<SearchBarHeader />
					</div>
				</div>
				<div className="hidden space-x-2 lg:flex">
					<Button variant="ghost">Post a job</Button>
					<Button variant="ghost">Write a review</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost">
								Add a Business <ChevronDown className="w-4 h-4 ml-2" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56 z-[80]">
							<DropdownMenuItem asChild>
								<Link href="/add-a-business">Add a Business</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/claim-a-business">Claim your business</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link href="/explore-business">Explore Thorbis for Business</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link href="/buisiness-certification">Get Thorbis Certified</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					{user ? (
						<>
							<Button variant="outline" className="transition-none" onClick={handleLogout}>
								Logout
							</Button>
							<Link href="/user">
								<Button className="transition-none">Dashboard</Button>
							</Link>
						</>
					) : (
						<>
							<Link href="/login">
								<Button variant="outline" className="transition-none">
									Login
								</Button>
							</Link>
							<Link href="/onboarding">
								<Button className="transition-none">Sign Up</Button>
							</Link>
						</>
					)}
				</div>

				<Drawer>
					<DrawerTrigger asChild>
						<Button variant="outline" size="icon" className="md:hidden">
							<Menu className="w-4 h-4" />
						</Button>
					</DrawerTrigger>
					<DrawerContent className="p-4 text-white bg-black h-5/6">
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
											<Link href="/user" onClick={() => setMobileMenuOpen(false)}>
												Dashboard
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
										</DropdownMenuContent>
									</DropdownMenu>
								</li>
							</ul>
						</nav>
					</DrawerContent>
				</Drawer>
			</div>
			<div className="flex px-2 pl-8 overflow-hidden text-xs font-medium text-white bg-primary whitespace-nowrap xl:text-sm sm:px-12 lg:px-24">
				<Sheet key="left">
					<SheetTrigger asChild>
						<Link href="/" className="flex flex-row items-center px-2 py-2 font-bold cursor-pointer hover:text-gray-300">
							<Menu className="w-4 h-4 mr-2" /> All
						</Link>
					</SheetTrigger>
					<SheetContent side="left" className="w-[400px] sm:w-[540px] h-full bg-black z-[70]">
						<SheetHeader>
							<SheetTitle>All Categories</SheetTitle>
							<SheetDescription>Select a category to explore</SheetDescription>
						</SheetHeader>
						{/* Add content here */}
					</SheetContent>
				</Sheet>
				<Link href="/services/home-services" className="px-2 py-2 cursor-pointer hover:text-gray-300">
					Home Services
				</Link>
				<Link href="/services/restaurants" className="px-2 py-2 cursor-pointer hover:text-gray-300">
					Restaurants
				</Link>
				<Link href="/services/construction" className="px-2 py-2 cursor-pointer hover:text-gray-300">
					Construction
				</Link>
				<Link href="/services/automotive" className="px-2 py-2 cursor-pointer hover:text-gray-300">
					Automotive
				</Link>
				<Link href="/services/health-beauty" className="px-2 py-2 cursor-pointer hover:text-gray-300">
					Health & Beauty
				</Link>
				<Link href="/services/technology" className="px-2 py-2 cursor-pointer hover:text-gray-300">
					Technology
				</Link>
				<Link href="/services/education" className="px-2 py-2 cursor-pointer hover:text-gray-300">
					Education
				</Link>
				<Link href="/services/finance" className="px-2 py-2 cursor-pointer hover:text-gray-300">
					Finance
				</Link>
				<Link href="/services/real-estate" className="px-2 py-2 cursor-pointer hover:text-gray-300">
					Real Estate
				</Link>
				<Link href="/services/entertainment" className="px-2 py-2 cursor-pointer hover:text-gray-300">
					Entertainment
				</Link>
				<Link href="/reviews/latest" className="px-2 py-2 cursor-pointer hover:text-gray-300">
					Latest Reviews
				</Link>
				<Link href="/certifications/best-companies" className="px-2 py-2 cursor-pointer hover:text-gray-300">
					Certified Companies
				</Link>
			</div>
		</div>
	);
}
