"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, Plus } from "react-feather";
import { RxSlash } from "react-icons/rx";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "@components/ui/dropdown-menu";
import { LuChevronsUpDown } from "react-icons/lu";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { RiComputerFill } from "react-icons/ri";
import { useTheme } from "next-themes";

export default function Header() {
	const [activeIndex, setActiveIndex] = useState(0);
	const { setTheme } = useTheme();

	const menuItems = [
		{ label: "Overview", href: "/user", segment: "(overview)" },
		{ label: "Jobs", href: "/user/jobs", segment: "/user/jobs" },
		{ label: "Activity", href: "/byron-wade/~/activity", segment: "~/activity" },
		{ label: "Domains", href: "/byron-wade/~/domains", segment: "~/domains" },
		{ label: "Usage", href: "/byron-wade/~/usage", segment: "~/usage" },
		{ label: "Monitoring", href: "/byron-wade/~/monitoring", segment: "~/monitoring" },
		{ label: "Storage", href: "/byron-wade/~/stores", segment: "~/stores" },
		{ label: "AI", href: "/byron-wade/~/ai", segment: "~/ai" },
		{ label: "Support", href: "/byron-wade/~/support/cases", segment: "~/support" },
		{ label: "Settings", href: "/byron-wade/~/settings", segment: "~/settings" },
	];

	useEffect(() => {
		setActiveIndex(0);
	}, []);

	return (
		<header className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900">
			<div className="flex items-center justify-between px-4 py-2">
				<div className="flex items-center">
					<Link href="/" passHref legacyBehavior>
						<Button variant="outline" size="icon" className="hidden md:block hover:!border-primary mr-2">
							<Image src="/ThorbisLogo.webp" alt="Byron Wade" width={24} height={24} className="object-cover w-full h-full p-1" />
						</Button>
					</Link>
					<nav className="flex items-center space-x-6">
						<ul className="flex items-center space-x-2 md:space-x-4">
							<li className="flex items-center space-x-2">
								<RxSlash className="w-6 h-6 text-gray-300" />
								<Button variant="outline" className="flex items-center space-x-2 cursor-default">
									<Avatar className="w-6 h-6">
										<AvatarImage src="https://vercel.com/api/www/avatar?u=bcw1995&s=64" alt="@shadcn" />
										<AvatarFallback>BW</AvatarFallback>
									</Avatar>
									<p className="text-sm font-medium text-gray-900 truncate dark:text-gray-100">Byron Wade</p>
									<Badge className="text-white bg-primary hover:bg-primary-dark">Pro</Badge>
								</Button>
							</li>
							<li className="flex items-center space-x-2">
								<RxSlash className="w-6 h-6 text-gray-300" />
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="outline" className="flex items-center space-x-2 hover:!border-primary">
											<p className="w-24 text-sm font-medium text-gray-900 truncate dark:text-gray-100 overflow-ellipsis">Im looking for a professional webdesigner</p>
											<span>
												<LuChevronsUpDown className="w-4 h-4" />
											</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start" className="w-56 bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900">
										<DropdownMenuLabel>My Account</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuGroup>
											<DropdownMenuItem>Profile</DropdownMenuItem>
											<DropdownMenuItem>Billing</DropdownMenuItem>
											<DropdownMenuItem>Settings</DropdownMenuItem>
											<DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
										</DropdownMenuGroup>
										<DropdownMenuSeparator />
										<DropdownMenuGroup>
											<DropdownMenuItem>Team</DropdownMenuItem>
											<DropdownMenuSub>
												<DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
												<DropdownMenuPortal>
													<DropdownMenuSubContent>
														<DropdownMenuItem>Email</DropdownMenuItem>
														<DropdownMenuItem>Message</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem>More...</DropdownMenuItem>
													</DropdownMenuSubContent>
												</DropdownMenuPortal>
											</DropdownMenuSub>
											<DropdownMenuItem>New Team</DropdownMenuItem>
										</DropdownMenuGroup>
										<DropdownMenuSeparator />
										<DropdownMenuItem>GitHub</DropdownMenuItem>
										<DropdownMenuItem>Support</DropdownMenuItem>
										<DropdownMenuItem disabled>API</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem>Log out</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</li>
						</ul>
					</nav>
				</div>
				<div className="flex items-center space-x-7">
					<ul className="items-center hidden space-x-4 md:flex">
						<li>
							<Button variant="outline" size="sm" className="font-normal hover:!border-primary">
								Feedback
							</Button>
						</li>
						<li>
							<a href="/changelog" className="text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-400">
								Changelog
							</a>
						</li>
						<li>
							<a href="/support" className="text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-400">
								Support
							</a>
						</li>
					</ul>
					<div className="flex items-center space-x-2">
						<Button size="icon" variant="ghost" className="relative p-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-400">
							<Bell className="w-5 h-5" />
							<span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 border-2 border-white dark:border-gray-800 rounded-full" />
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="icon" aria-label="Menu" className="hidden rounded-full md:block hover:!border-primary">
									<Avatar className="w-8 h-8 mx-auto">
										<AvatarImage src="https://vercel.com/api/www/avatar?u=bcw1995&s=64" alt="@shadcn" />
										<AvatarFallback>BW</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56 bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900">
								<DropdownMenuLabel>My Account</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<Link href="/user" passHref legacyBehavior>
										<DropdownMenuItem>Switch to Main Account</DropdownMenuItem>
									</Link>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem>Profile</DropdownMenuItem>
									<DropdownMenuItem>Billing</DropdownMenuItem>
									<DropdownMenuItem>Settings</DropdownMenuItem>
									<DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem>Team</DropdownMenuItem>
									<DropdownMenuSub>
										<DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
										<DropdownMenuPortal>
											<DropdownMenuSubContent>
												<DropdownMenuItem>Email</DropdownMenuItem>
												<DropdownMenuItem>Message</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem>More...</DropdownMenuItem>
											</DropdownMenuSubContent>
										</DropdownMenuPortal>
									</DropdownMenuSub>
									<DropdownMenuItem>New Team</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
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
								<DropdownMenuSeparator />
								<DropdownMenuItem>Log out</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<button aria-label="Open menu" className="p-2 text-gray-500 md:hidden hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400">
							<div className="w-6 h-0.5 bg-current mb-1" />
							<div className="w-6 h-0.5 bg-current" />
						</button>
					</div>
				</div>
			</div>
			<div className="flex items-center">
				<div className="relative flex items-center w-full px-4 py-2">
					{menuItems.map((item, index) => (
						<Link key={item.segment} href={item.href} passHref>
							<Button variant={index === activeIndex ? "link" : "ghost"} size="sm" className={`text-sm font-normal ${index === activeIndex ? "!font-bold !no-underline" : ""}`}>
								{item.label}
							</Button>
						</Link>
					))}
					<div
						className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-in-out"
						style={{
							left: `${activeIndex * 100}%`,
							width: "85px",
							transform: "translateX(16px) scaleX(0.85)",
						}}
					/>
				</div>
			</div>
		</header>
	);
}
