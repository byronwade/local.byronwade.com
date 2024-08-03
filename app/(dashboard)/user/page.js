"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { Bar, BarChart } from "recharts";
import useAuthStore from "@store/useAuthStore";

import { ChartContainer } from "@components/ui/chart";
import { Book, Box, ChevronDown, ChevronRight, CloudLightning, Database, GitHub, Key, Plus } from "react-feather";

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
							<DropdownMenuContent align="end">
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
						<DropdownMenuContent align="start">
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Profile</DropdownMenuItem>
							<DropdownMenuItem>Billing</DropdownMenuItem>
							<DropdownMenuItem>Team</DropdownMenuItem>
							<DropdownMenuItem>Subscription</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<span className="text-xs text-muted-foreground">Statistics for past 24 hours</span>
				</div>
			</div>

			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
					<div className="relative">
						<div className="transition-opacity duration-300">
							<Card className="mb-8">
								<div className="px-6 py-4 space-y-4">
									<a href="/dashboard/project/wuktajjeguysvwyvbrso/editor">
										<div className="flex items-center space-x-3 transition cursor-pointer opacity-80 hover:opacity-100">
											<div>
												<div className="rounded bg-surface-300 p-1.5  text-muted-foreground shadow-sm">
													<Database className="w-4 h-4" />
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
													<h3 className="text-sm text-muted-foregrounder">REST Requests</h3>
													<h5 className="text-2xl font-normal text-foreground">
														33
														<span className="text-lg" />
													</h5>
													<h5 className="text-xs text-muted-foregrounder" />
												</div>
												<ChartContainer config={chartConfig} className="min-h-[160px] w-full mb-10">
													<BarChart accessibilityLayer data={chartData}>
														<Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
														<Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
													</BarChart>
												</ChartContainer>
												<div className="flex items-center justify-between text-xs text-muted-foregrounder -mt-9">
													<span>Jul 31, 9pm</span>
													<span>Aug 1, 9pm</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</Card>
						</div>
					</div>
					<div className="relative">
						<div className="transition-opacity duration-300">
							<Card className="mb-8">
								<div className="px-6 py-4 space-y-4">
									<a href="/dashboard/project/wuktajjeguysvwyvbrso/auth/users">
										<div className="flex items-center space-x-3 transition cursor-pointer opacity-80 hover:text-gray-1200 hover:opacity-100">
											<div>
												<div className="rounded bg-surface-300 p-1.5  text-muted-foreground shadow-sm">
													<Key className="w-4 h-4" />
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
													<h3 className="text-sm text-muted-foregrounder">Auth Requests</h3>
													<h5 className="text-2xl font-normal text-foreground">
														938
														<span className="text-lg" />
													</h5>
													<h5 className="text-xs text-muted-foregrounder" />
												</div>
												<ChartContainer config={chartConfig} className="min-h-[160px] w-full mb-10">
													<BarChart accessibilityLayer data={chartData}>
														<Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
														<Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
													</BarChart>
												</ChartContainer>
												<div className="flex items-center justify-between text-xs text-muted-foregrounder -mt-9">
													<span>Jul 31, 9pm</span>
													<span>Aug 1, 9pm</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</Card>
						</div>
					</div>
					<div className="relative">
						<div className="transition-opacity duration-300">
							<Card className="mb-8">
								<div className="px-6 py-4 space-y-4">
									<a href="/dashboard/project/wuktajjeguysvwyvbrso/storage/buckets">
										<div className="flex items-center space-x-3 transition cursor-pointer opacity-80 hover:text-gray-1200 hover:opacity-100">
											<div>
												<div className="rounded bg-surface-300 p-1.5  text-muted-foreground shadow-sm">
													<Box className="w-4 h-4" />
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
													<h3 className="text-sm text-muted-foregrounder">Storage Requests</h3>
													<h5 className="text-2xl font-normal text-foreground">
														1<span className="text-lg" />
													</h5>
													<h5 className="text-xs text-muted-foregrounder" />
												</div>
												<ChartContainer config={chartConfig} className="min-h-[160px] w-full mb-10">
													<BarChart accessibilityLayer data={chartData}>
														<Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
														<Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
													</BarChart>
												</ChartContainer>
												<div className="flex items-center justify-between text-xs text-muted-foregrounder -mt-9">
													<span>Jul 31, 9pm</span>
													<span>Aug 1, 9pm</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</Card>
						</div>
					</div>
					<div className="relative">
						<div className="transition-opacity duration-300">
							<Card className="mb-8">
								<div className="px-6 py-4 space-y-4">
									<div>
										<div className="flex items-center space-x-3 transition opacity-80 ">
											<div>
												<div className="rounded bg-surface-300 p-1.5  text-muted-foreground shadow-sm">
													<CloudLightning className="w-4 h-4" />
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
													<h3 className="text-sm text-muted-foregrounder">Realtime Requests</h3>
													<h5 className="text-2xl font-normal text-foreground">
														0<span className="text-lg" />
													</h5>
													<h5 className="text-xs text-muted-foregrounder" />
												</div>
												<ChartContainer config={chartConfig} className="min-h-[160px] w-full mb-10">
													<BarChart accessibilityLayer data={chartData}>
														<Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
														<Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
													</BarChart>
												</ChartContainer>
												<div className="flex items-center justify-between text-xs text-muted-foregrounder -mt-9">
													<span>Jul 31, 9pm</span>
													<span>Aug 1, 9pm</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</Card>
						</div>
					</div>
				</div>
			</div>
			<div className="space-y-8">
				<h4 className="text-lg">Client libraries</h4>
				<div className="grid gap-12 mx-6 mb-12 md:grid-cols-3">
					{items2.map((item, index) => (
						<div key={index} className="flex items-start mb-6 space-x-6">
							<Image className="w-[21px] h-[21px]" src={item.src} alt={`${item.title} logo`} width={21} height={21} />
							<div className="space-y-4">
								<div>
									<h5 className="flex items-center gap-2 text-base text-foreground">{item.title}</h5>
								</div>
								<div className="flex gap-2">
									<Link href={item.docsLink}>
										<Button variant="secondary" size="xs">
											<Book className="w-4 h-4 mr-2" />
											<span className="truncate">Docs</span>
										</Button>
									</Link>
									<Link href={item.githubLink}>
										<Button variant="secondary" size="xs">
											<GitHub className="w-4 h-4 mr-2" />
											<span className="truncate">See GitHub</span>
										</Button>
									</Link>
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
						<Link key={index} href={item.href}>
							<Card className="relative flex flex-row h-32 p-4 transition duration-150 ease-in-out rounded-md group">
								<div className="flex flex-col mr-4">
									<Image className="transition-all group-hover:scale-110 w-[26px] h-[26px]" src={item.src} alt={`${item.title} logo`} width={26} height={26} />
								</div>
								<div className="w-4/5 space-y-2">
									<h5 className="text-foreground">{item.title}</h5>
									<p className="text-sm text-muted-foreground">{item.description}</p>
								</div>
								<div className="absolute transition-all duration-200 right-4 top-3 text-muted-foregrounder group-hover:right-3 group-hover:text-foreground">
									<ChevronRight className="w-4 h-4" />
								</div>
							</Card>
						</Link>
					))}
				</div>
			</div>
		</>
	);
}
