"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@components/ui/sheet";
import { Bell, ChevronDown, Settings, LogOut, Eye, Building2, DollarSign, Menu, CreditCard, HelpCircle } from "lucide-react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { RiComputerFill } from "react-icons/ri";
import { useTheme } from "next-themes";
import useAuthStore from "@store/useAuthStore";

const navigation = [
	{ name: "Dashboard", href: "/dashboard/localhub" },
	{ name: "Businesses", href: "/dashboard/localhub/businesses" },
	{ name: "Subscriptions", href: "/dashboard/localhub/subscriptions" },
	{ name: "Analytics", href: "/dashboard/localhub/analytics" },
	{ name: "Customization", href: "/dashboard/localhub/customization" },
	{ name: "Domains", href: "/dashboard/localhub/domains" },
];

export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const pathname = usePathname();
	const { user, signOut } = useAuthStore();
	const { setTheme } = useTheme();
	const [primaryColor, setPrimaryColor] = useState("theme-default");

	const handleLogout = async () => {
		try {
			await signOut();
			console.log("Logout successful");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	const handlePrimaryColorChange = (color) => {
		setPrimaryColor(color);
		document.documentElement.className = color;
	};

	return (
		<div className="sticky top-0 z-[60] bg-card/95 backdrop-blur-md border-b border-border/50">
			<div className="flex items-center justify-between w-full gap-6 py-3 mx-auto px-4 lg:px-24">
				{/* Left Section - Logo and LocalHub Info */}
				<div className="flex flex-row items-center w-full space-x-6">
					<Link href="/" className="flex items-center space-x-3 text-xl font-bold group">
						<div className="relative">
							<Image src="/ThorbisLogo.webp" alt="Thorbis LocalHub" width={50} height={50} className="w-12 h-12 transition-transform duration-200 group-hover:scale-105" />
							<div className="absolute inset-0 transition-opacity duration-200 rounded-full opacity-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 group-hover:opacity-100" />
						</div>
						<div className="hidden sm:block">
							<h1 className="text-lg font-bold leading-none text-foreground">LocalHub</h1>
							<p className="text-xs text-muted-foreground">Directory Manager</p>
						</div>
					</Link>

					{/* Current Revenue/Status Dropdown */}
					<div className="hidden lg:flex flex-row space-x-3">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<div className="flex items-center p-2 px-3 space-x-2 transition-colors bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg hover:bg-accent/50 cursor-pointer">
									<div className="text-xs max-w-[200px]">
										<div className="font-medium text-foreground truncate">Monthly Revenue</div>
										<div className="text-muted-foreground truncate">$1,872 (Your 80% share)</div>
									</div>
									<ChevronDown className="w-4 h-4 text-muted-foreground" />
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-64 z-[90] bg-card/95 backdrop-blur-md border border-border/50">
								<DropdownMenuLabel>Revenue Breakdown</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<div className="flex flex-col">
										<span className="font-medium">Total Revenue: $2,340</span>
										<span className="text-xs text-muted-foreground">45 active subscriptions</span>
									</div>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<div className="flex flex-col">
										<span className="font-medium">Your Share: $1,872</span>
										<span className="text-xs text-muted-foreground">80% revenue share</span>
									</div>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link href="/dashboard/localhub/subscriptions">View detailed revenue</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* Right Section - Navigation and User Menu */}
				<div className="hidden space-x-1 lg:flex xl:space-x-2">
					{navigation.map((item) => {
						const isActive = pathname === item.href || (item.href !== "/dashboard/localhub" && pathname.startsWith(item.href));
						return (
							<Link key={item.href} href={item.href} passHref legacyBehavior>
								<Button variant={isActive ? "default" : "ghost"} size="sm" className={`text-sm font-medium transition-colors hover:text-primary ${isActive ? "bg-primary text-primary-foreground" : ""}`}>
									{item.name}
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
							<Button variant="ghost" size="sm" className="relative p-2 h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent">
								<Bell className="w-5 h-5" />
								<span className="absolute top-1 right-1 w-2.5 h-2.5 bg-purple-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-80 z-[80] bg-card/95 backdrop-blur-md border border-border/50">
							<div className="flex items-center justify-between p-3 border-b border-border/50">
								<h3 className="font-semibold text-foreground">LocalHub Notifications</h3>
								<Badge variant="secondary" className="text-xs">
									3 new
								</Badge>
							</div>
							<div className="overflow-y-auto max-h-96">
								<DropdownMenuItem className="flex items-start p-4 space-x-3">
									<div className="flex-shrink-0 w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-foreground">New business subscription</p>
										<p className="mt-1 text-xs text-muted-foreground">Wade&apos;s Plumbing started Pro subscription</p>
										<p className="text-xs text-muted-foreground">2 hours ago</p>
									</div>
								</DropdownMenuItem>
								<DropdownMenuItem className="flex items-start p-4 space-x-3">
									<div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-foreground">Payment received</p>
										<p className="mt-1 text-xs text-muted-foreground">$79 payment from Downtown Coffee</p>
										<p className="text-xs text-muted-foreground">5 hours ago</p>
									</div>
								</DropdownMenuItem>
							</div>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* User Avatar Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="p-0 border rounded-full shadow-sm h-9 w-9 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary">
								<Avatar className="w-8 h-8">
									<AvatarImage src={`https://vercel.com/api/www/avatar?u=${user?.email?.split("@")[0] || "localhub"}&s=64`} />
									<AvatarFallback>{user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || "L"}</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56 z-[80] bg-card/95 backdrop-blur-md border border-border/50">
							<div className="flex items-center p-3 space-x-3 border-b border-border/50">
								<Avatar className="w-8 h-8">
									<AvatarImage src={`https://vercel.com/api/www/avatar?u=${user?.email?.split("@")[0] || "localhub"}&s=64`} />
									<AvatarFallback>{user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || "L"}</AvatarFallback>
								</Avatar>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium truncate text-foreground">{user?.user_metadata?.first_name || user?.email?.split("@")[0] || "LocalHub Owner"}</p>
									<p className="text-xs truncate text-muted-foreground">{user?.email}</p>
								</div>
							</div>
							<DropdownMenuGroup>
								<DropdownMenuItem asChild>
									<Link href="/dashboard/localhub/settings">
										<Settings className="w-4 h-4 mr-2" />
										<span>Settings</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/dashboard/localhub/billing">
										<CreditCard className="w-4 h-4 mr-2" />
										<span>Billing</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/support">
										<HelpCircle className="w-4 h-4 mr-2" />
										<span>Support</span>
									</Link>
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuLabel>Theme</DropdownMenuLabel>
								<DropdownMenuItem onClick={() => setTheme("light")}>
									<SunIcon className="w-4 h-4 mr-2 text-yellow-500" />
									Light
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setTheme("dark")}>
									<MoonIcon className="w-4 h-4 mr-2 text-indigo-500" />
									Dark
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setTheme("system")}>
									<RiComputerFill className="w-4 h-4 mr-2 text-slate-500" />
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
								<Link href="/dashboard/user">
									<Building2 className="w-4 h-4 mr-2" />
									<span>User Dashboard</span>
								</Link>
							</DropdownMenuItem>
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
						<SheetContent className="bg-card/95 backdrop-blur-md">
							<SheetHeader>
								<SheetTitle>LocalHub Menu</SheetTitle>
							</SheetHeader>
							<nav className="mt-6">
								<ul className="space-y-2">
									{navigation.map((item) => {
										const isActive = pathname === item.href || (item.href !== "/dashboard/localhub" && pathname.startsWith(item.href));
										return (
											<li key={item.href}>
												<Link href={item.href} onClick={() => setMobileMenuOpen(false)}>
													<Button variant={isActive ? "default" : "ghost"} className={`w-full justify-start ${isActive ? "bg-primary text-primary-foreground" : ""}`}>
														{item.name}
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
