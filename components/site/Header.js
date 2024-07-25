"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@components/ui/navigation-menu";

const components = [
	{
		title: "Home Services",
		href: "/home-services",
		description: "Find reliable home services for all your needs.",
	},
	{
		title: "Auto Services",
		href: "/auto-services",
		description: "Locate trusted auto service providers.",
	},
	{
		title: "Health & Wellness",
		href: "/health-wellness",
		description: "Discover top-rated health and wellness services.",
	},
	{
		title: "Pet Services",
		href: "/pet-services",
		description: "Best services for your beloved pets.",
	},
	// Add more menu items here if needed
];

export default function PublicHeader() {
	const pathname = usePathname();

	// Check if the current route contains /search
	if (pathname.includes("/search")) {
		return null;
	}

	return (
		<header className="sticky top-0 z-50 flex flex-col">
			<nav className="bg-white border-gray-200 dark:bg-black">
				<div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4 md:px-6 py-2.5">
					<Link href="/" className="flex items-center">
						<img src="https://flowbite.com/docs/images/logo.svg" className="h-6 mr-3 sm:h-9" alt="Thorbis Logo" />
						<span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Thorbis</span>
					</Link>
					<div className="flex items-center">
						<Button variant="link" className="hidden md:inline-block hover:no-underline hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50" asChild>
							<Link href="/business-signup">For Businesses</Link>
						</Button>
						<Button variant="link" className="hidden md:inline-block hover:no-underline hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50" asChild>
							<Link href="/pro-signup">Write a review</Link>
						</Button>
						<Button variant="outline" className="hidden md:inline-block" asChild>
							<Link href="/login">Login</Link>
						</Button>
						<Button variant="brand" className="hidden md:inline-block" asChild>
							<Link href="/signup">Signup</Link>
						</Button>
					</div>
				</div>
			</nav>
			<nav className="border-t bg-gray-50 dark:bg-black">
				<div className="max-w-screen-xl px-4 py-3 mx-auto md:px-6">
					<div className="flex items-center">
						<ul className="flex flex-row mt-0 mr-6 space-x-8 text-sm font-medium">
							<li>
								<Link href="/" className="text-gray-900 dark:text-white hover:underline" aria-current="page">
									Home
								</Link>
							</li>
							<li>
								<Link href="/company" className="text-gray-900 dark:text-white hover:underline">
									Company
								</Link>
							</li>
							<li>
								<Link href="/team" className="text-gray-900 dark:text-white hover:underline">
									Team
								</Link>
							</li>
							<li>
								<Link href="/features" className="text-gray-900 dark:text-white hover:underline">
									Features
								</Link>
							</li>
							<li className="hidden md:inline">
								<Link href="/marketplace" className="text-gray-900 dark:text-white hover:underline">
									Marketplace
								</Link>
							</li>
							<li className="hidden md:inline">
								<Link href="/resources" className="text-gray-900 dark:text-white hover:underline">
									Resources
								</Link>
							</li>
							<li className="hidden md:inline">
								<Link href="/forum" className="text-gray-900 dark:text-white hover:underline">
									Forum
								</Link>
							</li>
							<li className="hidden md:inline">
								<Link href="/support" className="text-gray-900 dark:text-white hover:underline">
									Support
								</Link>
							</li>
						</ul>
						<button id="dropdownDefault" data-dropdown-toggle="dropdown" data-dropdown-placement="bottom" className="text-gray-500 md:hidden dark:hover:bg-gray-600 dark:text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-full text-sm p-1.5">
							<svg className="w-5 h-5 text-gray-700 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
								<path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
							</svg>
						</button>
						<div id="dropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700">
							<ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefault">
								<li>
									<Link href="/marketplace" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
										Marketplace
									</Link>
								</li>
								<li>
									<Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
										Dashboard
									</Link>
								</li>
								<li>
									<Link href="/resources" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
										Resources
									</Link>
								</li>
								<li>
									<Link href="/forum" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
										Forum
									</Link>
								</li>
								<li>
									<Link href="/support" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
										Support
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
}

const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<Link ref={ref} className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`} {...props}>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="text-sm leading-snug line-clamp-2 text-muted-foreground">{children}</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";