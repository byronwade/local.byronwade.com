"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Bell, Plus } from "react-feather";
import { RxSlash } from "react-icons/rx";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Card } from "@components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@components/ui/dropdown-menu";
import { LuChevronsUpDown } from "react-icons/lu";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { RiComputerFill } from "react-icons/ri";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import useAuthStore from "@store/useAuthStore";

export default function Header() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [underlineStyle, setUnderlineStyle] = useState({});
	const containerRef = useRef(null);
	const { setTheme, theme, resolvedTheme } = useTheme();
	const router = useRouter();
	const { user, userRoles, logout } = useAuthStore();
	const [primaryColor, setPrimaryColor] = useState("theme-default");

	const menuItems = [
		{ label: "Overview", href: "/user", segment: "(overview)" },
		{ label: "Jobs", href: "/user/jobs", segment: "/user/jobs" },
		{ label: "Activity", href: "/user/activity", segment: "/user/activity" },
		{ label: "Boosts", href: "/user/boosts", segment: "/user/boosts" },
		{ label: "Referral", href: "/user/referral", segment: "/user/referral" },
		{ label: "Pro", href: "/user/pro", segment: "/user/pro" },
		{ label: "Settings", href: "/user/settings", segment: "/user/settings" },
	];

	useEffect(() => {
		const path = router.pathname;
		const currentIndex = menuItems.findIndex((item) => item.href === path);
		if (currentIndex !== -1) {
			setActiveIndex(currentIndex);
		}
	}, [router.pathname]);

    useEffect(() => {
		const handleScroll = () => {
			const container = containerRef.current;
			if (container) {
				const activeButton = container.children[activeIndex];
				if (activeButton) {
					const { offsetLeft, offsetWidth } = activeButton;
					setUnderlineStyle({
						left: offsetLeft - container.scrollLeft,
						width: offsetWidth,
					});
				}
			}
		};

		const container = containerRef.current;
		if (container) {
			handleScroll(); // Initial call to set the underline position
			container.addEventListener("scroll", handleScroll);
		}

		return () => {
			if (container) {
				container.removeEventListener("scroll", handleScroll);
			}
		};
	}, [activeIndex]);

	useEffect(() => {
		const handleRouteChange = () => {
			const container = containerRef.current;
			if (container) {
				const activeButton = container.children[activeIndex];
				if (activeButton) {
					const { offsetLeft, offsetWidth } = activeButton;
					setUnderlineStyle({
						left: offsetLeft - container.scrollLeft,
						width: offsetWidth,
					});
				}
			}
		};

		// Trigger handleRouteChange on initial render
		handleRouteChange();

		router.events.on("routeChangeComplete", handleRouteChange);
		return () => {
			router.events.off("routeChangeComplete", handleRouteChange);
		};
	}, [activeIndex, router.events]);

	const handleModeChange = (mode) => {
		setTheme(mode);
		document.documentElement.className = `${mode} ${primaryColor}`;
	};

	const handlePrimaryColorChange = (color) => {
		setPrimaryColor(color);
		document.documentElement.className = `${resolvedTheme} ${color}`;
	};

	return (
		<header className="sticky top-0 z-50 border-b bg-card border-border">
			<div className="flex items-center justify-between px-4 py-2 md:pl-8 sm:px-12 lg:px-24">
				<div className="flex items-center">
					<Link href="/" passHref legacyBehavior>
						<Button variant="outline" size="icon" className="hidden md:block hover:!border-primary mr-2">
							<Image src="/ThorbisLogo.webp" alt="Byron Wade" width={24} height={24} className="object-cover w-full h-full p-1" />
						</Button>
					</Link>
					<nav className="flex items-center space-x-6">
						<ul className="flex items-center space-x-2 md:space-x-4">
							<li className="flex items-center space-x-2">
								<RxSlash className="hidden w-6 h-6 md:block text-muted-foreground" />
								<Card variant="outline" className="flex items-center h-10 p-2 space-x-2 cursor-default">
									<Avatar className="w-6 h-6">
										<AvatarImage src="https://vercel.com/api/www/avatar?u=bcw1995&s=64" alt="@shadcn" />
										<AvatarFallback>BW</AvatarFallback>
									</Avatar>
									<p className="hidden text-sm font-medium truncate md:block">
										{user?.user_metadata.first_name} {user?.user_metadata.last_name}
									</p>
									<Badge className="hidden md:block bg-primary hover:bg-primary-dark">Pro</Badge>
								</Card>
							</li>
							<li className="flex items-center space-x-2">
								<RxSlash className="w-6 h-6 text-muted-foreground" />
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="outline" className="flex items-center space-x-2 hover:!border-primary">
											<p className="w-24 text-sm font-medium truncate overflow-ellipsis">Im looking for a professional webdesigner</p>
											<span>
												<LuChevronsUpDown className="w-4 h-4" />
											</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start" className="w-56">
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
							<Link href="/changelog" className="text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-400">
								Changelog
							</Link>
						</li>
						<li>
							<Link href="/support" className="text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-400">
								Support
							</Link>
						</li>
					</ul>
					<div className="flex items-center space-x-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button size="icon" variant="ghost" className="relative p-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-400">
									<Bell className="w-5 h-5" />
									<span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 border-2 border-white dark:border-gray-800 rounded-full" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="px-4 py-8 w-96">
								<div>
									<div className="flex gap-x-3">
										<div className="w-16 text-end">
											<span className="text-xs text-muted-foreground">12:05PM</span>
										</div>
										<div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
											<div className="relative z-10 flex items-center justify-center size-7">
												<div className="bg-gray-400 rounded-full size-2 dark:bg-neutral-600" />
											</div>
										</div>
										<div className="grow pt-0.5 pb-8">
											<h3 className="flex gap-x-1.5 font-semibold">
												<svg className="mt-1 shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
													<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
													<polyline points="14 2 14 8 20 8" />
													<line x1={16} x2={8} y1={13} y2={13} />
													<line x1={16} x2={8} y1={17} y2={17} />
													<line x1={10} x2={8} y1={9} y2={9} />
												</svg>
												Created &quot;Preline in React&quot; task
											</h3>
											<p className="mt-1 text-sm text-muted-foreground">Find more detailed instructions here.</p>
											<Button variant="secondary" size="xs" className="mt-1 text-muted-foreground">
												<img className="mr-2 rounded-full shrink-0 size-4" src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Avatar" />
												James Collins
											</Button>
										</div>
									</div>
									<div className="flex gap-x-3">
										<div className="w-16 text-end">
											<span className="text-xs text-muted-foreground">12:05PM</span>
										</div>
										<div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
											<div className="relative z-10 flex items-center justify-center size-7">
												<div className="bg-gray-400 rounded-full size-2 dark:bg-neutral-600" />
											</div>
										</div>
										<div className="grow pt-0.5 pb-8">
											<h3 className="flex gap-x-1.5 font-semibold">Release v5.2.0 quick bug fix 🐞</h3>
											<Button variant="secondary" size="xs" className="mt-1 text-muted-foreground">
												<img className="mr-2 rounded-full shrink-0 size-4" src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Avatar" />
												James Collins
											</Button>
										</div>
									</div>
									<div className="flex gap-x-3">
										<div className="w-16 text-end">
											<span className="text-xs text-muted-foreground">12:05PM</span>
										</div>
										<div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
											<div className="relative z-10 flex items-center justify-center size-7">
												<div className="bg-gray-400 rounded-full size-2 dark:bg-neutral-600" />
											</div>
										</div>
										<div className="grow pt-0.5 pb-8">
											<h3 className="flex gap-x-1.5 font-semibold">Marked &quot;Install Charts&quot; completed</h3>
											<p className="mt-1 text-sm text-muted-foreground">Finally! You can check it out here.</p>
											<Button variant="secondary" size="xs" className="mt-1 text-muted-foreground">
												<img className="mr-2 rounded-full shrink-0 size-4" src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fMHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Avatar" />
												James Collins
											</Button>
										</div>
									</div>
									<div className="flex gap-x-3">
										<div className="w-16 text-end">
											<span className="text-xs text-muted-foreground">12:05PM</span>
										</div>
										<div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
											<div className="relative z-10 flex items-center justify-center size-7">
												<div className="bg-gray-400 rounded-full size-2 dark:bg-neutral-600" />
											</div>
										</div>
										<div className="grow pt-0.5 pb-8">
											<h3 className="flex gap-x-1.5 font-semibold">Take a break ⛳️</h3>
											<p className="mt-1 text-sm text-muted-foreground">Just chill for now... 😉</p>
										</div>
									</div>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="icon" aria-label="Menu" className="rounded-full block hover:!border-primary">
									<Avatar className="w-8 h-8 mx-auto">
										<AvatarImage src="https://vercel.com/api/www/avatar?u=bcw1995&s=64" alt="@shadcn" />
										<AvatarFallback>BW</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel>My Account</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<Link href="/business" passHref legacyBehavior>
										<DropdownMenuItem>Switch to Business Account</DropdownMenuItem>
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
								<DropdownMenuItem onClick={() => handleModeChange("light")}>
									<SunIcon className="w-4 h-4 mr-2 text-yellow-500" />
									Light
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleModeChange("dark")}>
									<MoonIcon className="w-4 h-4 mr-2 text-indigo-500" />
									Dark
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleModeChange("system")}>
									<RiComputerFill className="w-4 h-4 mr-2 text-slate-500" />
									System
								</DropdownMenuItem>
								<DropdownMenuSub>
									<DropdownMenuSubTrigger>Theme Colors</DropdownMenuSubTrigger>
									<DropdownMenuPortal>
										<DropdownMenuSubContent>
											<DropdownMenuRadioGroup value={primaryColor} onValueChange={handlePrimaryColorChange}>
												<DropdownMenuRadioItem value="theme-default">Default</DropdownMenuRadioItem>
												<DropdownMenuRadioItem value="theme-green">Green</DropdownMenuRadioItem>
												<DropdownMenuRadioItem value="theme-blue">Blue</DropdownMenuRadioItem>
												<DropdownMenuRadioItem value="theme-red">Red</DropdownMenuRadioItem>
											</DropdownMenuRadioGroup>
										</DropdownMenuSubContent>
									</DropdownMenuPortal>
								</DropdownMenuSub>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
			<nav className="relative flex justify-center">
				<div className="flex overflow-x-scroll no-scrollbar" ref={containerRef}>
					{menuItems.map((item, index) => (
						<button
							key={index}
							className={`relative py-2 px-4 text-sm font-medium ${activeIndex === index ? "text-primary" : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-400"}`}
							onClick={() => {
								setActiveIndex(index);
								router.push(item.href);
							}}
						>
							{item.label}
						</button>
					))}
					<span className="absolute bottom-0 h-[2px] bg-primary transition-all duration-300 ease-in-out" style={underlineStyle} />
				</div>
			</nav>
		</header>
	);
}
