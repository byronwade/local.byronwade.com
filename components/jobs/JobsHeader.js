"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const navItems = [
	{ href: "/jobs", text: "Find Jobs" },
	{ href: "/reviews", text: "Company Reviews" },
	{ href: "/salary", text: "Salary Guide" },
];

export function JobsHeader() {
	const pathname = usePathname();

	return (
		<div className="sticky top-0 z-[60] bg-card/95 backdrop-blur-md border-b border-border/50">
			<div className="flex items-center justify-between w-full gap-6 py-3 mx-auto px-4 lg:px-24">
				{/* Left Section - Logo and Nav */}
				<div className="flex items-center gap-x-8">
					<Link href="/" className="flex items-center space-x-3 text-xl font-bold group">
						<div className="relative">
							<Image src="/ThorbisLogo.webp" alt="Thorbis Jobs" width={50} height={50} className="w-12 h-12 transition-transform duration-200 group-hover:scale-105" />
							<div className="absolute inset-0 transition-opacity duration-200 rounded-full opacity-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 group-hover:opacity-100" />
						</div>
						<div className="hidden sm:block">
							<h1 className="text-lg font-bold leading-none text-foreground">Jobs</h1>
							<p className="text-xs text-muted-foreground">Powered by Thorbis</p>
						</div>
					</Link>
					<nav className="hidden lg:flex items-center gap-x-2">
						{navItems.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link key={item.text} href={item.href} passHref>
									<Button variant={isActive ? "default" : "ghost"} size="sm" className={`text-sm font-medium transition-colors ${isActive ? "bg-primary/5 text-primary border border-primary/20 hover:text-white" : "hover:text-white hover:bg-muted"}`}>
										{item.text}
									</Button>
								</Link>
							);
						})}
					</nav>
				</div>

				{/* Right Section - Auth and Post Job */}
				<div className="flex items-center gap-x-2">
					<Button variant="ghost">Sign In</Button>
					<div className="h-6 border-l border-border/50 mx-2" />
					<Button asChild>
						<Link href="/jobs/post">Post Job</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
