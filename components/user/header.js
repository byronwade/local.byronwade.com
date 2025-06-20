"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuGroup, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@components/ui/sheet";
import { ChevronDown, Menu, Bell, Settings, Briefcase, CreditCard, HelpCircle, User, Users, Activity, Star } from "react-feather";
import { BarChart3, Zap } from "lucide-react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { RiComputerFill } from "react-icons/ri";
import { useTheme } from "next-themes";
import useAuthStore from "@store/useAuthStore";

export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const pathname = usePathname();
	const { setTheme, theme, resolvedTheme } = useTheme();
	const { user, userRoles, logout } = useAuthStore();
	const [primaryColor, setPrimaryColor] = useState("theme-default");

	const handleLogout = async () => {
		try {
			await logout();
			console.log("Logout successful");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	const handlePrimaryColorChange = (color) => {
		setPrimaryColor(color);
		document.documentElement.className = `${resolvedTheme} ${color}`;
	};

	const userNavItems = [
		{ href: "/dashboard/user", text: "Overview", icon: BarChart3 },
		{ href: "/dashboard/user/jobs", text: "Jobs", icon: Briefcase },
		{ href: "/dashboard/user/activity", text: "Activity", icon: Activity },
		{ href: "/dashboard/user/reviews", text: "Reviews", icon: Star },
		{ href: "/dashboard/user/referral", text: "Referral", icon: Users },
		{ href: "/dashboard/user/settings", text: "Settings", icon: Settings },
	];

	return (
		<div className="sticky top-0 z-[60] bg-card/95 backdrop-blur-md border-b border-border/50">
			<div className="flex gap-6 justify-between items-center px-4 py-3 mx-auto w-full lg:px-24">
				{/* Left Section - Logo and User Info */}
				<div className="flex flex-row items-center space-x-6 w-full">
					<Link href="/" className="flex items-center space-x-3 text-xl font-bold group">
						<div className="relative">
							<Image src="/ThorbisLogo.webp" alt="Thorbis User" width={50} height={50} className="w-12 h-12 transition-transform duration-200 group-hover:scale-105" />
							<div className="absolute inset-0 bg-gradient-to-r rounded-full opacity-0 transition-opacity duration-200 from-blue-500/20 to-purple-500/20 group-hover:opacity-100" />
						</div>
						<div className="hidden sm:block">
							<h1 className="text-lg font-bold leading-none text-foreground">Thorbis</h1>
							<p className="text-xs text-muted-foreground">User Dashboard</p>
						</div>
					</Link>

					{/* Current Job/Project Dropdown */}
					<div className="hidden flex-row space-x-3 lg:flex">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<div className="flex items-center p-2 px-3 space-x-2 rounded-lg border backdrop-blur-sm transition-colors cursor-pointer bg-card/80 border-border/50 hover:bg-accent/50">
									<div className="text-xs max-w-[200px]">
										<div className="font-medium truncate text-foreground">Current Request</div>
										<div className="truncate text-muted-foreground">Looking for a professional webdesigner</div>
									</div>
									<ChevronDown className="w-4 h-4 text-muted-foreground" />
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-64 z-[90] bg-card/95 backdrop-blur-md border border-border/50">
								<DropdownMenuLabel>Recent Requests</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<div className="flex flex-col">
										<span className="font-medium">Looking for a professional webdesigner</span>
										<span className="text-xs text-muted-foreground">Active • 5 applications</span>
									</div>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<div className="flex flex-col">
										<span className="font-medium">Need plumbing repair</span>
										<span className="text-xs text-muted-foreground">Completed</span>
									</div>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link href="/dashboard/user/jobs">View all requests</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* Right Section - Navigation and User Menu */}
				<div className="hidden space-x-1 lg:flex xl:space-x-2">
					{userNavItems.map((item) => {
						const isActive = pathname === item.href || (item.href !== "/dashboard/user" && pathname.startsWith(item.href));
						return (
							<Link key={item.href} href={item.href} passHref>
								<Button variant={isActive ? "default" : "ghost"} size="sm" className={`text-sm font-medium transition-colors hover:text-primary ${isActive ? "bg-primary text-primary-foreground" : ""}`}>
									{item.text}
								</Button>
							</Link>
						);
					})}
				</div>

				{/* User Controls */}
				<div className="flex items-center space-x-2">
					{/* Notifications */}
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
									4 new
								</Badge>
							</div>
							<div className="overflow-y-auto max-h-96">
								<DropdownMenuItem className="flex items-start p-4 space-x-3">
									<div className="flex-shrink-0 mt-2 w-2 h-2 bg-blue-500 rounded-full"></div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-foreground">New application received</p>
										<p className="mt-1 text-xs text-muted-foreground">John D. applied for your web design request</p>
										<p className="text-xs text-muted-foreground">10 minutes ago</p>
									</div>
								</DropdownMenuItem>
								<DropdownMenuItem className="flex items-start p-4 space-x-3">
									<div className="flex-shrink-0 mt-2 w-2 h-2 bg-green-500 rounded-full"></div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-foreground">Job completed</p>
										<p className="mt-1 text-xs text-muted-foreground">Your plumbing repair has been completed</p>
										<p className="text-xs text-muted-foreground">2 hours ago</p>
									</div>
								</DropdownMenuItem>
							</div>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* User Avatar Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="p-0 w-9 h-9 rounded-full border shadow-sm border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary">
								<Avatar className="w-8 h-8">
									<AvatarImage src={`https://vercel.com/api/www/avatar?u=${user?.email?.split("@")[0] || "user"}&s=64`} />
									<AvatarFallback>{user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56 z-[80] bg-card/95 backdrop-blur-md border border-border/50">
							<div className="flex items-center p-3 space-x-3 border-b border-border/50">
								<Avatar className="w-8 h-8">
									<AvatarImage src={`https://vercel.com/api/www/avatar?u=${user?.email?.split("@")[0] || "user"}&s=64`} />
									<AvatarFallback>{user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
								</Avatar>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium truncate text-foreground">{user?.user_metadata?.first_name || user?.email?.split("@")[0] || "User"}</p>
									<p className="text-xs truncate text-muted-foreground">{user?.email}</p>
								</div>
							</div>
							<DropdownMenuGroup>
								<DropdownMenuItem asChild>
									<Link href="/dashboard/user/settings">
										<Settings className="mr-2 w-4 h-4" />
										<span>Settings</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/dashboard/user/billing">
										<CreditCard className="mr-2 w-4 h-4" />
										<span>Billing</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/support">
										<HelpCircle className="mr-2 w-4 h-4" />
										<span>Support</span>
									</Link>
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuLabel>Theme</DropdownMenuLabel>
								<DropdownMenuItem onClick={() => setTheme("light")}>
									<SunIcon className="mr-2 w-4 h-4 text-yellow-500" />
									Light
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setTheme("dark")}>
									<MoonIcon className="mr-2 w-4 h-4 text-indigo-500" />
									Dark
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setTheme("system")}>
									<RiComputerFill className="mr-2 w-4 h-4 text-slate-500" />
									System
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuLabel>Color Scheme</DropdownMenuLabel>
								<DropdownMenuRadioGroup value={primaryColor} onValueChange={handlePrimaryColorChange}>
									<DropdownMenuRadioItem value="theme-default">Default</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="theme-blue">Blue</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="theme-green">Green</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="theme-purple">Purple</DropdownMenuRadioItem>
								</DropdownMenuRadioGroup>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link href="/">
									<span>Back to Main Site</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
								<span>Logout</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Mobile Menu */}
					<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
						<SheetTrigger asChild>
							<Button variant="outline" size="icon" className="flex lg:hidden">
								<Menu className="w-4 h-4" />
							</Button>
						</SheetTrigger>
						<SheetContent className="backdrop-blur-md bg-card/95">
							<SheetHeader>
								<SheetTitle>User Menu</SheetTitle>
							</SheetHeader>
							<nav className="mt-6">
								<ul className="space-y-2">
									{userNavItems.map((item) => {
										const isActive = pathname === item.href || (item.href !== "/dashboard/user" && pathname.startsWith(item.href));
										return (
											<li key={item.href}>
												<Link href={item.href} onClick={() => setMobileMenuOpen(false)}>
													<Button variant={isActive ? "default" : "ghost"} className={`w-full justify-start ${isActive ? "bg-primary text-primary-foreground" : ""}`}>
														{item.text}
													</Button>
												</Link>
											</li>
										);
									})}
								</ul>
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</div>
	);
}

