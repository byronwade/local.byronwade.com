"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@components/ui/drawer";
import { ChevronDown, Menu } from "react-feather";
import SearchBarHeader from "@components/shared/searchBox/SearchBarHeader";
import useAuthStore from "@store/useAuthStore";

// Utility function to get background color of an element
const getBackgroundColor = (element) => {
	if (!element) return null;
	const style = window.getComputedStyle(element);
	return style.backgroundColor;
};

// Utility function to determine if a color is light
const isLightColor = (color) => {
	const rgb = color.match(/\d+/g);
	if (!rgb) return false;
	const [r, g, b] = rgb.map(Number);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.5;
};

// Calculate luminosity percentage of elements
const calculateLuminosityPercentage = (elements) => {
	let lightArea = 0;
	let totalArea = 0;

	elements.forEach((element) => {
		const rect = element.getBoundingClientRect();
		const area = rect.width * rect.height;
		if (area === 0) return;

		const backgroundColor = getBackgroundColor(element);
		if (backgroundColor && backgroundColor !== "rgba(0, 0, 0, 0)") {
			const isLight = isLightColor(backgroundColor);
			if (isLight) lightArea += area;
			totalArea += area;
		}
	});

	if (totalArea === 0) return 0;
	return (lightArea / totalArea) * 100;
};

export default function Header() {
	const [isLightBackground, setIsLightBackground] = useState(false);
	const pathname = usePathname();
	const { user, userRoles, logout } = useAuthStore((state) => ({
		user: state.user,
		userRoles: state.userRoles,
		logout: state.logout,
	}));

	console.log(userRoles);

	// Check background color on scroll and resize
	useEffect(() => {
		const header = document.querySelector("#header");

		const checkBackgroundColor = () => {
			const rect = header.getBoundingClientRect();
			const elementsBelowHeader = document.elementsFromPoint(rect.left, rect.bottom).filter((el) => el !== header);
			const luminosityPercentage = calculateLuminosityPercentage(elementsBelowHeader);
			setIsLightBackground(luminosityPercentage > 85);
		};

		window.addEventListener("scroll", checkBackgroundColor);
		window.addEventListener("resize", checkBackgroundColor);
		checkBackgroundColor();

		return () => {
			window.removeEventListener("scroll", checkBackgroundColor);
			window.removeEventListener("resize", checkBackgroundColor);
		};
	}, []);

	const handleLogout = async () => {
		try {
			await logout();
			console.log("Logout successful");
			// Redirect or perform other actions upon successful logout
		} catch (error) {
			console.error("Logout failed:", error);
			// Show error message to the user
		}
	};

	if (pathname.includes("/search")) {
		return <div id="header"></div>;
	}

	return (
		<div id="header" className={`transition-none sticky top-0 z-[60] transition-colors ${isLightBackground ? "text-black bg-white" : " text-white bg-black"}`}>
			<div className="flex items-center justify-between w-full gap-6 p-2 px-4 mx-auto">
				<div className="flex flex-row items-center w-full space-x-4">
					<Link href="/" className="flex flex-col items-center text-xl font-bold text-center">
						<Image src="/ThorbisLogo.webp" alt="Thorbis" width={50} height={50} className="w-10 h-10" />
						<h1 className="text-sm leading-none text-brand">Thorbis</h1>
					</Link>
					<div className="flex items-center w-full">
						<SearchBarHeader />
					</div>
				</div>
				<div className="hidden space-x-2 lg:flex">
					<Button variant="link" className={`transition-none hover:no-underline hover:bg-gray-800 ${isLightBackground ? "text-black border-gray-300 hover:bg-gray-100" : "text-white"}`}>
						Post a job
					</Button>
					<Button variant="link" className={`transition-none hover:no-underline hover:bg-gray-800 ${isLightBackground ? "text-black border-gray-300 hover:bg-gray-100" : "text-white"}`}>
						Write a review
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="link" className={`transition-none hover:no-underline hover:bg-gray-800 ${isLightBackground ? "text-black border-gray-300 hover:bg-gray-100" : "text-white"}`}>
								Add a Business <ChevronDown className="w-4 h-4 ml-2" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56 bg-black z-[80]">
							<DropdownMenuItem asChild>
								<Link href="/add-a-business">Add a Business</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/claim-business">Claim your business</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link href="/explore-business">Explore Thorbis for Business</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link href="/explore-business">Get Thorbis Certified</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					{user ? (
						<>
							<Button variant="outline" className="transition-none" onClick={handleLogout}>
								Logout
							</Button>
							<Link href="/user">
								<Button variant="brand" className="transition-none">
									Dashboard
								</Button>
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
								<Button variant="brand" className="transition-none">
									Sign Up
								</Button>
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
			<div className="flex px-2 overflow-hidden text-xs font-medium text-white bg-brand whitespace-nowrap xl:text-sm">
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