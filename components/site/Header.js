"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
// import SearchBar from "@/components/site/SearchBar";
import Link from "next/link";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

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
];

export default function PublicHeader() {
	const pathname = usePathname();

	// Check if the current route is /search
	if (pathname === "/search") {
		return null;
	}

	return (
		<header className="sticky top-0 z-50 flex items-center justify-between h-16 px-4 mx-auto bg-black">
			<div className="flex items-center space-x-4">
				<Link href="/" className="flex items-center mr-4 space-x-2 lg:mr-6">
					<span className="text-lg font-extrabold lg:inline-block">Thorbis</span>
				</Link>
				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuTrigger>Businesses</NavigationMenuTrigger>
							<NavigationMenuContent className="bg-black">
								<ul className="grid gap-3 p-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
									{components.map((component) => (
										<ListItem key={component.title} title={component.title} href={component.href}>
											{component.description}
										</ListItem>
									))}
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<Link href="/how-it-works" legacyBehavior passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>How It Works</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<Link href="/blog" legacyBehavior passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>Blog</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<Link href="/support" legacyBehavior passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>Support</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>
			{/* <SearchBar className="flex-1 mx-4" /> */}
			<div className="flex items-center space-x-2">
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
		</header>
	);
}

const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a ref={ref} className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`} {...props}>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="text-sm leading-snug line-clamp-2 text-muted-foreground">{children}</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";
