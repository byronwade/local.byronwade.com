"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@components/ui/dropdown-menu";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@components/ui/drawer";
import { ChevronDown, Menu } from "react-feather";

const categories = [
	"Restaurants",
	"Nightlife",
	"Home Services",
	"Auto Repair",
	// ... more categories
];

const cities = [
	"San Francisco",
	"New York",
	"Los Angeles",
	"Chicago",
	// ... more cities
];

const businesses = [
	{ title: "Joe's Pizza", href: "/business/joes-pizza", description: "Best pizza in town." },
	{ title: "Mike's Garage", href: "/business/mikes-garage", description: "Reliable car repair services." },
	// ... more businesses
];

const getBackgroundColor = (element) => {
	if (!element) return null;
	const style = window.getComputedStyle(element);
	return style.backgroundColor;
};

const isLightColor = (color) => {
	const rgb = color.match(/\d+/g);
	if (!rgb) return false;
	const [r, g, b] = rgb.map(Number);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.5;
};

export default function Header() {
	const [isCategoriesOpen, setCategoriesOpen] = React.useState(false);
	const [isCitiesOpen, setCitiesOpen] = React.useState(false);
	const [isBusinessesOpen, setBusinessesOpen] = React.useState(false);
	const [isBlogOpen, setBlogOpen] = React.useState(false);
	const [isSupportOpen, setSupportOpen] = React.useState(false);
	const [isAddBusinessOpen, setAddBusinessOpen] = React.useState(false);
	const [isLightBackground, setIsLightBackground] = React.useState(false);
	const pathname = usePathname();

	useEffect(() => {
		const header = document.querySelector("#header");

		const checkBackgroundColor = () => {
			const rect = header.getBoundingClientRect();
			const elementsBelowHeader = document.elementsFromPoint(rect.left, rect.bottom);
			const backgroundColor = getBackgroundColor(elementsBelowHeader.find((el) => el !== header));
			if (backgroundColor) {
				const isLight = isLightColor(backgroundColor);
				setIsLightBackground(isLight);
			}
		};

		window.addEventListener("scroll", checkBackgroundColor);
		window.addEventListener("resize", checkBackgroundColor);
		checkBackgroundColor();

		return () => {
			window.removeEventListener("scroll", checkBackgroundColor);
			window.removeEventListener("resize", checkBackgroundColor);
		};
	}, []);

	if (pathname.includes("/search")) {
		return <div id="header"></div>;
	}

	return (
		<div id="header" className={`transition-none sticky top-0 z-50 h-16 transition-colors bg-background/60 backdrop-blur-md border-b ${isLightBackground ? "text-black border-gray-300" : "text-white border-foreground/10"}`}>
			<div className="container flex flex-row items-center justify-start w-full gap-6 px-4 mx-auto align-middle size-full">
				<div className="flex flex-row items-center w-full space-x-4">
					<Link href="/" className="flex flex-row items-center h-full space-x-4 text-xl font-bold align-middle">
						<Image src="/ThorbisLogo.webp" alt="Thorbis" width={50} height={50} className="h-full w-[36px]" />
						<h1 className="leading-none">Thorbis</h1>
					</Link>
					<nav className="hidden lg:inline">
						<ul className="flex space-x-4">
							<li className="relative" onMouseEnter={() => setCategoriesOpen(true)} onMouseLeave={() => setCategoriesOpen(false)}>
								<Button variant="link" className={`transition-none hover:no-underline hover:bg-gray-800 ${isLightBackground ? "text-black border-gray-300 hover:bg-gray-100" : "text-white"}`}>
									Home Services <ChevronDown className="w-4 h-4 ml-2" />
								</Button>
								<AnimatePresence>
									{isCategoriesOpen && (
										<motion.div className="absolute left-0 p-4 text-black bg-white border border-gray-300 rounded shadow-lg top-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
											<ul className="grid gap-3 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
												{categories.map((category) => (
													<li key={category}>
														<Link href={`/categories/${category.toLowerCase().replace(/ /g, "-")}`}>{category}</Link>
													</li>
												))}
											</ul>
										</motion.div>
									)}
								</AnimatePresence>
							</li>
							<li className="relative" onMouseEnter={() => setCitiesOpen(true)} onMouseLeave={() => setCitiesOpen(false)}>
								<Button variant="link" className={`transition-none hover:no-underline hover:bg-gray-800 ${isLightBackground ? "text-black border-gray-300 hover:bg-gray-100" : "text-white"}`}>
									Cities <ChevronDown className="w-4 h-4 ml-2" />
								</Button>
								<AnimatePresence>
									{isCitiesOpen && (
										<motion.div className="absolute left-0 p-4 text-black bg-white border border-gray-300 rounded shadow-lg top-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
											<ul className="grid gap-3 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
												{cities.map((city) => (
													<li key={city}>
														<Link href={`/cities/${city.toLowerCase().replace(/ /g, "-")}`}>{city}</Link>
													</li>
												))}
											</ul>
										</motion.div>
									)}
								</AnimatePresence>
							</li>
							<li className="relative" onMouseEnter={() => setBusinessesOpen(true)} onMouseLeave={() => setBusinessesOpen(false)}>
								<Button variant="link" className={`transition-none hover:no-underline hover:bg-gray-800 ${isLightBackground ? "text-black border-gray-300 hover:bg-gray-100" : "text-white"}`}>
									Businesses <ChevronDown className="w-4 h-4 ml-2" />
								</Button>
								<AnimatePresence>
									{isBusinessesOpen && (
										<motion.div className="absolute left-0 p-4 text-black bg-white border border-gray-300 rounded shadow-lg top-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
											<ul className="grid gap-3 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
												{businesses.map((business) => (
													<li key={business.title}>
														<Link href={business.href}>{business.title}</Link>
														<p>{business.description}</p>
													</li>
												))}
											</ul>
										</motion.div>
									)}
								</AnimatePresence>
							</li>
							<li className="relative" onMouseEnter={() => setBlogOpen(true)} onMouseLeave={() => setBlogOpen(false)}>
								<Button variant="link" className={`transition-none hover:no-underline hover:bg-gray-800 ${isLightBackground ? "text-black border-gray-300 hover:bg-gray-100" : "text-white"}`}>
									Blog <ChevronDown className="w-4 h-4 ml-2" />
								</Button>
								<AnimatePresence>
									{isBlogOpen && (
										<motion.div className="absolute left-0 p-4 text-black bg-white border border-gray-300 rounded shadow-lg top-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
											<div className="w-[300px]">
												<h3 className="text-lg font-bold">Sponsored</h3>
												<p>Advertise your business here.</p>
												<Link href="/ads" className="mt-2 btn">
													Learn More
												</Link>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</li>
							<li className="relative" onMouseEnter={() => setSupportOpen(true)} onMouseLeave={() => setSupportOpen(false)}>
								<Button variant="link" className={`transition-none hover:no-underline hover:bg-gray-800 ${isLightBackground ? "text-black border-gray-300 hover:bg-gray-100" : "text-white"}`}>
									Support <ChevronDown className="w-4 h-4 ml-2" />
								</Button>
								<AnimatePresence>
									{isSupportOpen && (
										<motion.div className="absolute left-0 p-4 text-black bg-white border border-gray-300 rounded shadow-lg top-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
											<div className="w-auto">
												<div className="grid px-4 py-5 mx-auto text-sm text-gray-500 dark:text-gray-400 md:grid-cols-3 md:px-6">
													<ul className="hidden mb-4 space-y-4 md:mb-0 md:block" aria-labelledby="mega-menu-full-image-button">
														<li>
															<a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-500">
																Online Stores
															</a>
														</li>
														<li>
															<a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-500">
																Segmentation
															</a>
														</li>
														<li>
															<a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-500">
																Marketing CRM
															</a>
														</li>
														<li>
															<a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-500">
																Online Stores
															</a>
														</li>
													</ul>
													<ul className="mb-4 space-y-4 md:mb-0">
														<li>
															<a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-500">
																Our Blog
															</a>
														</li>
														<li>
															<a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-500">
																Terms &amp; Conditions
															</a>
														</li>
														<li>
															<a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-500">
																License
															</a>
														</li>
														<li>
															<a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-500">
																Resources
															</a>
														</li>
													</ul>
													<a href="#" className="p-8 bg-local bg-gray-500 bg-center bg-no-repeat bg-cover rounded-lg bg-blend-multiply hover:bg-blend-soft-light dark:hover:bg-blend-darken" style={{ backgroundImage: "url(/docs/images/dashboard-overview.png)" }}>
														<p className="max-w-xl mb-5 font-extrabold leading-tight tracking-tight text-white">Preview the new Flowbite dashboard navigation.</p>
														<button type="button" className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-center text-white border border-white rounded-lg hover:bg-white hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-700">
															Get started
															<svg className="w-3 h-3 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
																<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 5h12m0 0L9 1m4 4L9 9" />
															</svg>
														</button>
													</a>
												</div>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</li>
						</ul>
					</nav>
				</div>
				<div className="relative flex-row hidden space-x-4 lg:flex">
					<div className="relative" onMouseEnter={() => setAddBusinessOpen(true)} onMouseLeave={() => setAddBusinessOpen(false)}>
						<Button variant="link" className={`transition-none hover:no-underline hover:bg-gray-800 ${isLightBackground ? "text-black border-gray-300 hover:bg-gray-100" : "text-white"}`}>
							Add a Business <ChevronDown className="w-4 h-4 ml-2" />
						</Button>
						<AnimatePresence>
							{isAddBusinessOpen && (
								<motion.div className="absolute left-0 p-4 text-black bg-white border border-gray-300 rounded shadow-lg top-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
									<div className="w-[300px]">
										<Link href="/add-business">Add a Business</Link>
										<Link href="/claim-business">Claim your business</Link>
										<Link href="/login-business">Log in to Business Account</Link>
										<Link href="/explore-business">Explore Thorbis for Business</Link>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
					<Link href="/login">
						<Button variant="outline" className="transition-none">
							Login
						</Button>
					</Link>
					<Link href="/signup">
						<Button variant="outline" className="transition-none">
							Sign Up
						</Button>
					</Link>
				</div>
				<Drawer>
					<DrawerTrigger asChild>
						<Button variant="outline" size="icon" className="md:hidden">
							<Menu className="w-4 h-4" />
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader>
							<DrawerClose asChild>
								<Button className="float-right">✕</Button>
							</DrawerClose>
							<DrawerTitle>Menu</DrawerTitle>
						</DrawerHeader>
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
									<Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
										Sign Up
									</Link>
								</li>
								<li>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="outline">Add a Business</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent className="w-56">
											<DropdownMenuItem asChild>
												<Link href="/add-business" onClick={() => setMobileMenuOpen(false)}>
													Add a Business
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link href="/claim-business" onClick={() => setMobileMenuOpen(false)}>
													Claim your business
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link href="/login-business" onClick={() => setMobileMenuOpen(false)}>
													Log in to Business Account
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
		</div>
	);
}
