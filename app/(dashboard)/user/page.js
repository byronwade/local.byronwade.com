"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { Bar, BarChart } from "recharts";
import useAuthStore from "@store/useAuthStore";

import { ChartContainer } from "@components/ui/chart";
import { ChevronDown, Plus } from "react-feather";

const chartData = [
	{ month: "January", desktop: 186, mobile: 80 },
	{ month: "February", desktop: 305, mobile: 200 },
	{ month: "March", desktop: 237, mobile: 120 },
	{ month: "April", desktop: 73, mobile: 190 },
	{ month: "May", desktop: 209, mobile: 130 },
	{ month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
	desktop: {
		label: "Desktop",
		color: "#2563eb",
	},
	mobile: {
		label: "Mobile",
		color: "#60a5fa",
	},
};

const items = [
	{
		href: "https://github.com/supabase/supabase/tree/master/examples/todo-list/sveltejs-todo-list",
		src: "/ThorbisLogo.webp",
		title: "Svelte todo list app",
		description: "Sveltejs todo with TailwindCSS and Snowpack",
	},
	{
		href: "https://github.com/supabase/supabase/tree/master/examples/todo-list/react-todo-list",
		src: "/ThorbisLogo.webp",
		title: "React todo list app",
		description: "React todo with TailwindCSS and Vite",
	},
	{
		href: "https://github.com/supabase/supabase/tree/master/examples/todo-list/vue-todo-list",
		src: "/ThorbisLogo.webp",
		title: "Vue todo list app",
		description: "Vuejs todo with TailwindCSS and Vite",
	},
	{
		href: "https://github.com/supabase/supabase/tree/master/examples/todo-list/angular-todo-list",
		src: "/ThorbisLogo.webp",
		title: "Angular todo list app",
		description: "Angular todo with TailwindCSS",
	},
	{
		href: "https://github.com/supabase/supabase/tree/master/examples/todo-list/nextjs-todo-list",
		src: "/ThorbisLogo.webp",
		title: "Next.js todo list app",
		description: "Next.js todo with TailwindCSS and Vercel",
	},
	{
		href: "https://github.com/supabase/supabase/tree/master/examples/todo-list/nuxtjs-todo-list",
		src: "/ThorbisLogo.webp",
		title: "Nuxt.js todo list app",
		description: "Nuxt.js todo with TailwindCSS",
	},
	{
		href: "https://github.com/supabase/supabase/tree/master/examples/todo-list/gatsby-todo-list",
		src: "/ThorbisLogo.webp",
		title: "Gatsby todo list app",
		description: "Gatsby todo with TailwindCSS",
	},
	{
		href: "https://github.com/supabase/supabase/tree/master/examples/todo-list/ember-todo-list",
		src: "/ThorbisLogo.webp",
		title: "Ember todo list app",
		description: "Ember todo with TailwindCSS",
	},
	{
		href: "https://github.com/supabase/supabase/tree/master/examples/todo-list/sapper-todo-list",
		src: "/ThorbisLogo.webp",
		title: "Sapper todo list app",
		description: "Sapper todo with TailwindCSS and Snowpack",
	},
];

const items2 = [
	{
		src: "/ThorbisLogo.webp",
		title: "Flutter",
		docsLink: "https://supabase.com/docs/reference/dart/installing",
		githubLink: "https://github.com/supabase/supabase-flutter",
	},
	{
		src: "/ThorbisLogo.webp",
		title: "React",
		docsLink: "https://reactjs.org/docs/getting-started.html",
		githubLink: "https://github.com/facebook/react",
	},
	{
		src: "/ThorbisLogo.webp",
		title: "Vue",
		docsLink: "https://vuejs.org/v2/guide/",
		githubLink: "https://github.com/vuejs/vue",
	},
	{
		src: "/ThorbisLogo.webp",
		title: "Angular",
		docsLink: "https://angular.io/docs",
		githubLink: "https://github.com/angular/angular",
	},
	{
		src: "/ThorbisLogo.webp",
		title: "Next.js",
		docsLink: "https://nextjs.org/docs",
		githubLink: "https://github.com/vercel/next.js",
	},
	{
		src: "/ThorbisLogo.webp",
		title: "Nuxt.js",
		docsLink: "https://nuxtjs.org/docs",
		githubLink: "https://github.com/nuxt/nuxt.js",
	},
];

export default function Dashboard() {
	const { user, userRoles } = useAuthStore();
	return (
		<>
			<div className="w-full mx-auto my-16 space-y-16">
				<div className="flex items-center justify-between space-x-6">
					<h1 className="text-4xl">Hi {user?.user_metadata.first_name}</h1>
					<div className="flex items-center gap-x-3">
						<Link href="/add-a-business" passHref legacyBehavior>
							<Button variant="outline" size="sm">
								Claim a Buissness
							</Button>
						</Link>
						<DropdownMenu>
							<DropdownMenuTrigger>
								<Button variant="outline" size="sm">
									Add new... <ChevronDown className="w-4 h-4 ml-2" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900">
								<DropdownMenuItem>Job</DropdownMenuItem>
								<DropdownMenuItem>Buisiness</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>

			<div className="flex flex-row justify-between py-4">
				<div className="flex items-center gap-x-3">
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button variant="outline" size="sm">
								24 hours <ChevronDown className="w-4 h-4 ml-2" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900">
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Profile</DropdownMenuItem>
							<DropdownMenuItem>Billing</DropdownMenuItem>
							<DropdownMenuItem>Team</DropdownMenuItem>
							<DropdownMenuItem>Subscription</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<span className="text-xs text-foreground-light">Statistics for past 24 hours</span>
				</div>
			</div>

			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
					<div className="relative">
						<div className="transition-opacity duration-300">
							<div className="mb-8 bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900">
								<div className="px-6 py-4 space-y-4">
									<a href="/dashboard/project/wuktajjeguysvwyvbrso/editor">
										<div className="flex items-center space-x-3 transition cursor-pointer opacity-80 hover:text-gray-1200 hover:opacity-100">
											<div>
												<div className="rounded bg-surface-300 p-1.5 text-foreground-light shadow-sm">
													<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-database ">
														<ellipse cx={12} cy={5} rx={9} ry={3} />
														<path d="M3 5V19A9 3 0 0 0 21 19V5" />
														<path d="M3 12A9 3 0 0 0 21 12" />
													</svg>
												</div>
											</div>
											<span className="flex items-center space-x-1">
												<h4 className="mb-0 text-lg">Database</h4>
											</span>
										</div>
									</a>
									<div className="relative">
										<div className="transition-opacity duration-300">
											<div className="flex flex-col gap-y-3 ">
												<div className="h-16">
													<h3 className="text-sm text-foreground-lighter">REST Requests</h3>
													<h5 className="text-xl text-2xl font-normal text-foreground">
														33
														<span className="text-lg" />
													</h5>
													<h5 className="text-xs text-foreground-lighter" />
												</div>
												<ChartContainer config={chartConfig} className="min-h-[160px] w-full mb-10">
													<BarChart accessibilityLayer data={chartData}>
														<Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
														<Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
													</BarChart>
												</ChartContainer>
												<div className="flex items-center justify-between text-xs text-foreground-lighter -mt-9">
													<span>Jul 31, 9pm</span>
													<span>Aug 1, 9pm</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="relative">
						<div className="transition-opacity duration-300">
							<div className="mb-8 bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900">
								<div className="px-6 py-4 space-y-4">
									<a href="/dashboard/project/wuktajjeguysvwyvbrso/auth/users">
										<div className="flex items-center space-x-3 transition cursor-pointer opacity-80 hover:text-gray-1200 hover:opacity-100">
											<div>
												<div className="rounded bg-surface-300 p-1.5 text-foreground-light shadow-sm">
													<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-key ">
														<circle cx="7.5" cy="15.5" r="5.5" />
														<path d="m21 2-9.6 9.6" />
														<path d="m15.5 7.5 3 3L22 7l-3-3" />
													</svg>
												</div>
											</div>
											<span className="flex items-center space-x-1">
												<h4 className="mb-0 text-lg">Auth</h4>
											</span>
										</div>
									</a>
									<div className="relative">
										<div className="transition-opacity duration-300">
											<div className="flex flex-col gap-y-3 ">
												<div className="h-16">
													<h3 className="text-sm text-foreground-lighter">Auth Requests</h3>
													<h5 className="text-xl text-2xl font-normal text-foreground">
														938
														<span className="text-lg" />
													</h5>
													<h5 className="text-xs text-foreground-lighter" />
												</div>
												<ChartContainer config={chartConfig} className="min-h-[160px] w-full mb-10">
													<BarChart accessibilityLayer data={chartData}>
														<Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
														<Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
													</BarChart>
												</ChartContainer>
												<div className="flex items-center justify-between text-xs text-foreground-lighter -mt-9">
													<span>Jul 31, 9pm</span>
													<span>Aug 1, 9pm</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="relative">
						<div className="transition-opacity duration-300">
							<div className="mb-8 bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900">
								<div className="px-6 py-4 space-y-4">
									<a href="/dashboard/project/wuktajjeguysvwyvbrso/storage/buckets">
										<div className="flex items-center space-x-3 transition cursor-pointer opacity-80 hover:text-gray-1200 hover:opacity-100">
											<div>
												<div className="rounded bg-surface-300 p-1.5 text-foreground-light shadow-sm">
													<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive ">
														<rect width={20} height={5} x={2} y={3} rx={1} />
														<path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
														<path d="M10 12h4" />
													</svg>
												</div>
											</div>
											<span className="flex items-center space-x-1">
												<h4 className="mb-0 text-lg">Storage</h4>
											</span>
										</div>
									</a>
									<div className="relative">
										<div className="transition-opacity duration-300">
											<div className="flex flex-col gap-y-3 ">
												<div className="h-16">
													<h3 className="text-sm text-foreground-lighter">Storage Requests</h3>
													<h5 className="text-xl text-2xl font-normal text-foreground">
														1<span className="text-lg" />
													</h5>
													<h5 className="text-xs text-foreground-lighter" />
												</div>
												<ChartContainer config={chartConfig} className="min-h-[160px] w-full mb-10">
													<BarChart accessibilityLayer data={chartData}>
														<Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
														<Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
													</BarChart>
												</ChartContainer>
												<div className="flex items-center justify-between text-xs text-foreground-lighter -mt-9">
													<span>Jul 31, 9pm</span>
													<span>Aug 1, 9pm</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="relative">
						<div className="transition-opacity duration-300">
							<div className="mb-8 bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900">
								<div className="px-6 py-4 space-y-4">
									<div>
										<div className="flex items-center space-x-3 transition opacity-80 ">
											<div>
												<div className="rounded bg-surface-300 p-1.5 text-foreground-light shadow-sm">
													<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap ">
														<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
													</svg>
												</div>
											</div>
											<span className="flex items-center space-x-1">
												<h4 className="mb-0 text-lg">Realtime</h4>
											</span>
										</div>
									</div>
									<div className="relative">
										<div className="transition-opacity duration-300">
											<div className="flex flex-col gap-y-3 ">
												<div className="h-16">
													<h3 className="text-sm text-foreground-lighter">Realtime Requests</h3>
													<h5 className="text-xl text-2xl font-normal text-foreground">
														0<span className="text-lg" />
													</h5>
													<h5 className="text-xs text-foreground-lighter" />
												</div>
												<ChartContainer config={chartConfig} className="min-h-[160px] w-full mb-10">
													<BarChart accessibilityLayer data={chartData}>
														<Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
														<Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
													</BarChart>
												</ChartContainer>
												<div className="flex items-center justify-between text-xs text-foreground-lighter -mt-9">
													<span>Jul 31, 9pm</span>
													<span>Aug 1, 9pm</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="space-y-8">
				<h4 className="text-lg">Client libraries</h4>
				<div className="grid gap-12 mx-6 mb-12 md:grid-cols-3">
					{items2.map((item, index) => (
						<div key={index} className="flex items-start mb-6 space-x-6">
							<img src={item.src} alt={`${item.title} logo`} width={21} />
							<div className="space-y-4">
								<div>
									<h5 className="flex items-center gap-2 text-base text-foreground">{item.title}</h5>
								</div>
								<div className="flex gap-2">
									<a href={item.docsLink} target="_blank" rel="noreferrer">
										<button
											data-size="tiny"
											type="button"
											className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-foreground bg-alternative dark:bg-muted hover:bg-selection border-strong hover:border-stronger focus-visible:outline-brand-600 data-[state=open]:bg-selection data-[state=open]:outline-brand-600 data-[state=open]:border-button-hover text-xs px-2.5 py-1 h-[26px]"
										>
											<div className="[&_svg]:h-[14px] [&_svg]:w-[14px] text-foreground-muted">
												<svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="sbui-icon">
													<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
													<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
												</svg>
											</div>{" "}
											<span className="truncate">Docs</span>{" "}
										</button>
									</a>
									<a href={item.githubLink} target="_blank" rel="noreferrer">
										<button
											data-size="tiny"
											type="button"
											className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-foreground bg-alternative dark:bg-muted hover:bg-selection border-strong hover:border-stronger focus-visible:outline-brand-600 data-[state=open]:bg-selection data-[state=open]:outline-brand-600 data-[state=open]:border-button-hover text-xs px-2.5 py-1 h-[26px]"
										>
											<div className="[&_svg]:h-[14px] [&_svg]:w-[14px] text-foreground-muted">
												<svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="sbui-icon">
													<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
												</svg>
											</div>{" "}
											<span className="truncate">See GitHub</span>{" "}
										</button>
									</a>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="space-y-8">
				<h4 className="text-lg">Example projects</h4>
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{items.map((item, index) => (
						<a key={index} href={item.href}>
							<div className="relative flex flex-row h-32 p-4 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md group dark:border-neutral-800 dark:bg-neutral-900">
								<div className="flex flex-col mr-4">
									<img className="transition-all group-hover:scale-110" src={item.src} alt={`${item.title} logo`} width={26} height={26} />
								</div>
								<div className="w-4/5 space-y-2">
									<h5 className="text-foreground">{item.title}</h5>
									<p className="text-sm text-foreground-light">{item.description}</p>
								</div>
								<div className="absolute transition-all duration-200 right-4 top-3 text-foreground-lighter group-hover:right-3 group-hover:text-foreground">
									<svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="sbui-icon">
										<polyline points="9 18 15 12 9 6" />
									</svg>
								</div>
							</div>
						</a>
					))}
				</div>
			</div>
		</>
	);
}
