import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Gauge } from "@components/ui/gauge";
import { Button } from "@components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { ArrowRight, GitHub, Grid, List } from "react-feather";

const menuItems = [{ label: "Dashboard" }, { label: "Kanban", badge: "Pro" }, { label: "Inbox", badge: "3" }, { label: "Users" }, { label: "Products" }, { label: "Sign In" }, { label: "Sign Up" }];

export default function Jobs() {
	return (
		<Tabs defaultValue="grid">
			<div className="flex flex-col min-h-screen m-auto max-w-screen-2xl">
				<div className="flex flex-row justify-between py-16">
					<h1 className="text-4xl">Jobs</h1>
					<div className="flex items-center gap-x-3">
						<Button variant="outline" size="sm">
							Visit
						</Button>
						<Button variant="outline" size="sm">
							Domains
						</Button>
						<Button variant="outline" size="sm">
							Usage
						</Button>
						<Button variant="outline" size="sm">
							Connect Git
						</Button>
					</div>
				</div>

				<div className="flex flex-row justify-between py-4">
					<div className="mr-4 min-w-60"></div>
					<div className="flex items-center gap-x-3">
						<TabsList className="p-0 bg-transparent h-9">
							<TabsTrigger value="grid" className="h-9 data-[state=active]:bg-gray-200 !border-r-0 !rounded-e-[0px] rounded-md data-[state=active]:dark:bg-dark-800 bg-transperant border border-gray-300 dark:border-neutral-800">
								<Grid className="w-4 h-4 text-black dark:text-white" />
							</TabsTrigger>
							<TabsTrigger value="list" className="h-9 data-[state=active]:bg-gray-200 !rounded-s-[0px] !border-l-0 rounded-md data-[state=active]:dark:bg-dark-800 bg-transperant border border-gray-300 dark:border-neutral-800">
								<List className="w-4 h-4 text-black dark:text-white" />
							</TabsTrigger>
						</TabsList>
					</div>
				</div>

				<div className="flex flex-row w-full">
					<aside className="mr-4 min-w-60">
						<div className="h-full p-2 overflow-y-auto bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900">
							<ul className="space-y-2">
								{menuItems.map((item, index) => (
									<li key={index}>
										<Link href="/" className="flex items-center p-2 text-gray-900 rounded-md dark:text-white hover:bg-gray-100 dark:hover:bg-dark-800 group">
											<span className="flex-1 text-sm whitespace-nowrap">{item.label}</span>
											{item.badge && <span className={`inline-flex items-center justify-center px-2 text-sm font-medium rounded-full ms-3 ${item.badge === "Pro" ? "text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-300" : "text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-300"}`}>{item.badge}</span>}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</aside>

					<div className="w-full">
						<div className="flex flex-col space-y-6">
							<TabsContent value="grid" className="grid grid-cols-2 gap-4 mt-0">
								<div className="flex flex-row bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900">
									<div className="flex flex-col justify-between w-full gap-3 p-4 space-y-4">
										<div className="flex flex-row w-full">
											<div className="w-32 rounded-md">
												<picture className="block object-cover w-full h-auto max-w-full max-h-full p-0 m-0 align-middle aspect-screenshot">
													<img src="https://app.netlify.com/.netlify/images?url=https://d33wubrfki0l68.cloudfront.net/6688bc09c5b9b400084b4f47/screenshot_2024-07-06-03-40-27-0000.webp&fit=cover&h=500&w=800" alt="" width="400" height="250" loading="lazy" className="w-full h-full align-top" />
												</picture>
											</div>
											<div className="ml-4">
												<div className="font-bold">
													<h3 className="flex items-center leading-7 fit-content">
														<a className="truncate block-link" href="/sites/neon-lily-46eb6f/">
															neon-lily-46eb6f
														</a>
													</h3>
												</div>
												<div className="optional meta">
													<p className="flex flex-wrap flex-auto text-sm">
														<span className="break-normal">
															Deploys from
															<a className="font-semibold break-words text-inherit" target="_blank" rel="noopener noreferrer" aria-describedby="open-in-new-tab" href="https://github.com/byronwade/wadesplumbingandseptic.com">
																GitHub
															</a>
															with
															<span className="whitespace-nowrap">
																<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" className="w-4 inline fill-current align-baseline relative -bottom-0.5 ml-[0.4em] mr-0.5" style={{ "--icon-width": "1em", "--icon-height": "1em" }}>
																	<path fillRule="evenodd" d="M8 15a6.96 6.96 0 0 0 3.875-1.17L6.078 6.342v4.553h-.975v-5.79h1.219l6.318 8.138A7 7 0 1 0 8 15m2.011-6.774.966 1.243V5.104h-.966z" />
																</svg>
																Next.js
															</span>
														</span>
													</p>
												</div>
											</div>
										</div>

										<div className="text-sm leading-6">
											<p className="meta">Owned by Wades Inc.</p>
											<p className="meta">
												<time dateTime="2024-07-06T03:40:27.638Z" className="text-gray-darker/85 dark:text-gray-lighter/85">
													Published on Jul 5<span className="hidden md:inline"> (a month ago)</span>
												</time>
											</p>
										</div>
									</div>
									<div className="flex flex-row items-center p-4">
										<div className="flex flex-col items-center gap-2 mr-4">
											<Gauge value={75} className="size-24" />
											<Gauge value={75} className="size-24" />
										</div>

										<ArrowRight className="w-4 h-4 place-self-center" />
									</div>
								</div>
								<div className="flex flex-row bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900">
									<div className="flex flex-col justify-between w-full gap-3 p-4 space-y-4">
										<div className="flex flex-row w-full">
											<div className="w-32 rounded-md">
												<picture className="block object-cover w-full h-auto max-w-full max-h-full p-0 m-0 align-middle aspect-screenshot">
													<img src="https://app.netlify.com/.netlify/images?url=https://d33wubrfki0l68.cloudfront.net/6688bc09c5b9b400084b4f47/screenshot_2024-07-06-03-40-27-0000.webp&fit=cover&h=500&w=800" alt="" width="400" height="250" loading="lazy" className="w-full h-full align-top" />
												</picture>
											</div>
											<div className="ml-4">
												<div className="font-bold">
													<h3 className="flex items-center leading-7 fit-content">
														<a className="truncate block-link" href="/sites/neon-lily-46eb6f/">
															neon-lily-46eb6f
														</a>
													</h3>
												</div>
												<div className="optional meta">
													<p className="flex flex-wrap flex-auto text-sm">
														<span className="break-normal">
															Deploys from
															<a className="font-semibold break-words text-inherit" target="_blank" rel="noopener noreferrer" aria-describedby="open-in-new-tab" href="https://github.com/byronwade/wadesplumbingandseptic.com">
																GitHub
															</a>
															with
															<span className="whitespace-nowrap">
																<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" className="w-4 inline fill-current align-baseline relative -bottom-0.5 ml-[0.4em] mr-0.5" style={{ "--icon-width": "1em", "--icon-height": "1em" }}>
																	<path fillRule="evenodd" d="M8 15a6.96 6.96 0 0 0 3.875-1.17L6.078 6.342v4.553h-.975v-5.79h1.219l6.318 8.138A7 7 0 1 0 8 15m2.011-6.774.966 1.243V5.104h-.966z" />
																</svg>
																Next.js
															</span>
														</span>
													</p>
												</div>
											</div>
										</div>

										<div className="text-sm leading-6">
											<p className="meta">Owned by Wades Inc.</p>
											<p className="meta">
												<time dateTime="2024-07-06T03:40:27.638Z" className="text-gray-darker/85 dark:text-gray-lighter/85">
													Published on Jul 5<span className="hidden md:inline"> (a month ago)</span>
												</time>
											</p>
										</div>
									</div>
									<div className="flex flex-row items-center p-4">
										<div className="flex flex-col items-center gap-2 mr-4">
											<Gauge value={75} className="size-24" />
											<Gauge value={75} className="size-24" />
										</div>

										<ArrowRight className="w-4 h-4 place-self-center" />
									</div>
								</div>
							</TabsContent>
							<TabsContent value="list" className="grid grid-cols-1 gap-4 mt-0">
								<div className="p-4 bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900">
									<div className="flex flex-row items-center">
										<div className="w-32 rounded-md">
											<picture className="block object-cover w-full h-auto max-w-full max-h-full p-0 m-0 align-middle aspect-screenshot">
												<img src="https://app.netlify.com/.netlify/images?url=https://d33wubrfki0l68.cloudfront.net/6688bc09c5b9b400084b4f47/screenshot_2024-07-06-03-40-27-0000.webp&fit=cover&h=500&w=800" alt="" width="400" height="250" loading="lazy" className="w-full h-full align-top" />
											</picture>
										</div>
										<div className="flex flex-row items-center justify-between w-full ml-4">
											<div className="w-1/2">
												<div className="font-bold">
													<h3 className="flex items-center leading-7 fit-content">
														<a className="truncate block-link" href="/sites/neon-lily-46eb6f/">
															neon-lily-46eb6f
														</a>
													</h3>
												</div>
												<div className="optional meta">
													<p className="flex flex-wrap flex-auto text-sm">
														<span className="break-normal">
															Deploys from
															<a className="font-semibold break-words text-inherit" target="_blank" rel="noopener noreferrer" aria-describedby="open-in-new-tab" href="https://github.com/byronwade/wadesplumbingandseptic.com">
																GitHub
															</a>
															with
															<span className="whitespace-nowrap">
																<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" className="w-4 inline fill-current align-baseline relative -bottom-0.5 ml-[0.4em] mr-0.5" style={{ "--icon-width": "1em", "--icon-height": "1em" }}>
																	<path fillRule="evenodd" d="M8 15a6.96 6.96 0 0 0 3.875-1.17L6.078 6.342v4.553h-.975v-5.79h1.219l6.318 8.138A7 7 0 1 0 8 15m2.011-6.774.966 1.243V5.104h-.966z" />
																</svg>
																Next.js
															</span>
														</span>
													</p>
												</div>
											</div>
											<div className="w-1/2 text-sm leading-6">
												<p className="meta">Owned by Wades Inc.</p>
												<p className="meta">
													<time dateTime="2024-07-06T03:40:27.638Z" className="text-gray-darker/85 dark:text-gray-lighter/85">
														Published on Jul 5<span className="hidden md:inline"> (a month ago)</span>
													</time>
												</p>
											</div>
										</div>
										<div className="flex flex-row items-center ml-2 space-x-4">
											<Gauge value={75} className="size-24" />
											<ArrowRight className="w-4 h-4" />
										</div>
									</div>
								</div>
							</TabsContent>
						</div>
					</div>
				</div>
			</div>
		</Tabs>
	);
}
