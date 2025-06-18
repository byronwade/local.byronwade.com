"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuGroup } from "@components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@components/ui/sheet";
import { ChevronDown, Menu, Bell, Settings, Users, CreditCard, HelpCircle } from "react-feather";
import { BarChart3, Shield } from "lucide-react";
import useAuthStore from "@store/useAuthStore";

export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const pathname = usePathname();
	const { user, userRoles, logout } = useAuthStore((state) => ({
		user: state.user,
		userRoles: state.userRoles,
		logout: state.logout,
	}));

	const handleLogout = async () => {
		try {
			await logout();
			console.log("Logout successful");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	const adminNavItems = [
		{ href: "/admin", text: "Dashboard", icon: BarChart3 },
		{ href: "/admin/users", text: "Users", icon: Users },
		{ href: "/admin/pro-accounts", text: "Pro Accounts", icon: Shield },
		{ href: "/admin/customers", text: "Customers", icon: Users },
		{ href: "/admin/support", text: "Support", icon: HelpCircle },
		{ href: "/admin/billing", text: "Billing", icon: CreditCard },
		{ href: "/admin/settings", text: "Settings", icon: Settings },
	];

	return (
		<div className="sticky top-0 z-[60] bg-card/95 backdrop-blur-md border-b border-border/50">
			<div className="flex items-center justify-between w-full gap-6 py-3 mx-auto px-4 lg:px-24">
				{/* Left Section - Logo and Business Info */}
				<div className="flex flex-row items-center w-full space-x-6">
					<Link href="/" className="flex items-center space-x-3 text-xl font-bold group">
						<div className="relative">
							<Image src="/ThorbisLogo.webp" alt="Thorbis Admin" width={50} height={50} className="w-12 h-12 transition-transform duration-200 group-hover:scale-105" />
							<div className="absolute inset-0 transition-opacity duration-200 rounded-full opacity-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 group-hover:opacity-100" />
						</div>
						<div className="hidden sm:block">
							<h1 className="text-lg font-bold leading-none text-foreground">Thorbis Admin</h1>
							<p className="text-xs text-muted-foreground">Administrative Dashboard</p>
						</div>
					</Link>
				</div>

				{/* Right Section - Navigation and User Menu */}
				<div className="hidden space-x-1 lg:flex xl:space-x-2">
					{adminNavItems.map((item) => {
						const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
						return (
							<Link key={item.href} href={item.href} passHref legacyBehavior>
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
							<Button variant="ghost" size="sm" className="relative p-2 h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent">
								<Bell className="w-5 h-5" />
								<span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-80 z-[80] bg-card/95 backdrop-blur-md border border-border/50">
							<div className="flex items-center justify-between p-3 border-b border-border/50">
								<h3 className="font-semibold text-foreground">Admin Notifications</h3>
								<Badge variant="destructive" className="text-xs">
									5 new
								</Badge>
							</div>
							<div className="overflow-y-auto max-h-96">
								<DropdownMenuItem className="flex items-start p-4 space-x-3">
									<div className="flex-shrink-0 w-2 h-2 mt-2 bg-red-500 rounded-full"></div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-foreground">System Alert</p>
										<p className="mt-1 text-xs text-muted-foreground">High server load detected</p>
										<p className="text-xs text-muted-foreground">2 minutes ago</p>
									</div>
								</DropdownMenuItem>
								<DropdownMenuItem className="flex items-start p-4 space-x-3">
									<div className="flex-shrink-0 w-2 h-2 mt-2 bg-orange-500 rounded-full"></div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-foreground">New user registration</p>
										<p className="mt-1 text-xs text-muted-foreground">User requires approval</p>
										<p className="text-xs text-muted-foreground">15 minutes ago</p>
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
									<AvatarImage src={`https://vercel.com/api/www/avatar?u=${user?.email?.split("@")[0] || "admin"}&s=64`} />
									<AvatarFallback>{user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || "A"}</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56 z-[80] bg-card/95 backdrop-blur-md border border-border/50">
							<div className="flex items-center p-3 space-x-3 border-b border-border/50">
								<Avatar className="w-8 h-8">
									<AvatarImage src={`https://vercel.com/api/www/avatar?u=${user?.email?.split("@")[0] || "admin"}&s=64`} />
									<AvatarFallback>{user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || "A"}</AvatarFallback>
								</Avatar>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium truncate text-foreground">{user?.user_metadata?.first_name || user?.email?.split("@")[0] || "Admin"}</p>
									<p className="text-xs truncate text-muted-foreground">{user?.email}</p>
								</div>
							</div>
							<DropdownMenuGroup>
								<DropdownMenuItem asChild>
									<Link href="/admin/settings">
										<Settings className="w-4 h-4 mr-2" />
										<span>Settings</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/">
										<span>Back to Main Site</span>
									</Link>
								</DropdownMenuItem>
							</DropdownMenuGroup>
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
								<SheetTitle>Admin Menu</SheetTitle>
							</SheetHeader>
							<nav className="mt-6">
								<ul className="space-y-2">
									{adminNavItems.map((item) => {
										const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
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
