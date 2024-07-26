"use client";

import * as React from "react";
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
	{ title: "Joe&apos;s Pizza", href: "/business/joes-pizza", description: "Best pizza in town." },
	{ title: "Mike&apos;s Garage", href: "/business/mikes-garage", description: "Reliable car repair services." },
	// ... more businesses
];

export default function Header() {
	const [isCategoriesOpen, setCategoriesOpen] = React.useState(false);
	const [isCitiesOpen, setCitiesOpen] = React.useState(false);
	const [isBusinessesOpen, setBusinessesOpen] = React.useState(false);
	const [isBlogOpen, setBlogOpen] = React.useState(false);
	const [isSupportOpen, setSupportOpen] = React.useState(false);
	const pathname = usePathname();

	if (pathname.includes("/search")) {
		return null;
	}

	return (
		<div className="sticky top-0 z-50 w-full p-2 px-4 space-x-4 text-white bg-black">
			<div className="flex items-center justify-start w-full align-middle lg:px-11 mx-auto max-w-[1440px] md:px-[34px] md:px-unset">
				<div className="flex flex-row items-center w-full space-x-4">
					<Link href="/" className="flex flex-row items-center h-full space-x-4 text-xl font-bold align-middle">
						<Image src="/ThorbisLogo.webp" alt="Thorbis" width={50} height={50} className="h-full w-[36px]" />
						<h1 className="leading-none">Thorbis</h1>
					</Link>
					<nav className="hidden lg:inline">
						<ul className="flex space-x-4">
							<li className="relative" onMouseEnter={() => setCategoriesOpen(true)} onMouseLeave={() => setCategoriesOpen(false)}>
								<Button variant="link" className="hover:no-underline hover:bg-gray-800">
									Home Services <ChevronDown className="w-4 h-4 ml-2" />
								</Button>
								<AnimatePresence>
									{isCategoriesOpen && (
										<motion.div className="absolute left-0 p-4 text-black bg-white rounded shadow-lg top-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
								<Button variant="link" className="hover:no-underline hover:bg-gray-800">
									Cities <ChevronDown className="w-4 h-4 ml-2" />
								</Button>
								<AnimatePresence>
									{isCitiesOpen && (
										<motion.div className="absolute left-0 p-4 text-black bg-white rounded shadow-lg top-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
								<Button variant="link" className="hover:no-underline hover:bg-gray-800">
									Businesses <ChevronDown className="w-4 h-4 ml-2" />
								</Button>
								<AnimatePresence>
									{isBusinessesOpen && (
										<motion.div className="absolute left-0 p-4 text-black bg-white rounded shadow-lg top-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
								<Button variant="link" className="hover:no-underline hover:bg-gray-800">
									Blog <ChevronDown className="w-4 h-4 ml-2" />
								</Button>
								<AnimatePresence>
									{isBlogOpen && (
										<motion.div className="absolute left-0 p-4 text-black bg-white rounded shadow-lg top-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
								<Button variant="link" className="hover:no-underline hover:bg-gray-800">
									Support <ChevronDown className="w-4 h-4 ml-2" />
								</Button>
								<AnimatePresence>
									{isSupportOpen && (
										<motion.div className="absolute left-0 p-4 text-black bg-white rounded shadow-lg top-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
						</ul>
					</nav>
				</div>
				<div className="relative flex-row hidden space-x-4 lg:flex">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="link" className="hover:no-underline hover:bg-gray-800">
								Add a Business <ChevronDown className="w-4 h-4 ml-2" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56 bg-black">
							<DropdownMenuItem asChild>
								<Link href="/add-business">Add a Business</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/claim-business">Claim your business</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/login-business">Log in to Business Account</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link href="/explore-business">Explore Thorbis for Business</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Link href="/login">
						<Button variant="outline">Login</Button>
					</Link>
					<Link href="/signup">
						<Button variant="outline">Sign Up</Button>
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
