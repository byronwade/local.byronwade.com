"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, redirect } from "next/navigation";
import { Button } from "@components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@components/ui/sheet";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@components/ui/drawer";
import { ChevronDown, Menu, Search } from "react-feather";
import SearchBarHeader from "@components/shared/searchBox/SearchBarHeader";
import useAuthStore from "@store/useAuthStore";

export default function Header() {
	const [open, setOpen] = useState(false);
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
		return <div id="header" />;
	}

	return (
		<div id="header" className="transition-none sticky top-0 z-[60] bg-card">
			<div className="flex items-center justify-between w-full gap-6 p-2 mx-auto shadow-md lg:px-24">
				<div className="flex flex-row items-center w-full space-x-4">
					<Link href="/" className="flex flex-col items-center text-xl font-bold text-center">
						<Image src="/ThorbisLogo.webp" alt="Thorbis" width={50} height={50} className="w-10 h-10" />
						{/* <h1 className="hidden text-sm leading-none text-primary md:block">Thorbis</h1> */}
					</Link>
					<div className="items-center hidden w-full md:flex">
						<SearchBarHeader />
					</div>
				</div>
				<div className="hidden space-x-2 lg:flex">
					<Link href="/user" passHref legacyBehavior>
						<Button variant="ghost">Post a job</Button>
					</Link>
					<Link href="/user" passHref legacyBehavior>
						<Button variant="ghost">Write a review</Button>
					</Link>
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

				<div className="flex md:hidden">
					<Button variant="outline" size="icon">
						<Search className="w-4 h-4" />
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

				<Drawer>
					<DrawerTrigger asChild>
						<Button variant="outline" size="icon" className="flex md:hidden">
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
		</div>
	);
}
