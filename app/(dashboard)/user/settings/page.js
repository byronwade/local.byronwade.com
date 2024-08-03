import React from "react";
import { Button } from "@components/ui/button";
import { AlertCircle, AlertOctagon, BarChart, ChevronDown, Copy, Pause, Truck } from "react-feather";
import { Card } from "@components/ui/card";
import { Input } from "@components/ui/input";

export default function Settings() {
	return (
		<>
			<div className="w-full mx-auto my-16 space-y-16">
				<div className="flex items-center justify-between space-x-6">
					<h1 className="text-4xl">Settings</h1>
				</div>
			</div>

			<div className="space-y-10">
				<div>
					<div className="flex items-center justify-between mb-6 undefined">
						<div className="space-y-1">
							<h3 className="text-xl text-foreground">Transfer Project</h3>
							<div className="max-w-full text-sm prose text-muted-foreground">
								<p>Transfer your project to a different organization.</p>
							</div>
						</div>
					</div>
					<Card>
						<form method="POST">
							<div className="flex flex-col gap-0 divide-y divide-border">
								<div className="grid grid-cols-12 gap-6 px-8 py-8 opacity-100 undefined">
									<label className="col-span-12 text-sm text-foreground lg:col-span-5">General settings</label>
									<div className="relative flex flex-col col-span-12 gap-6 lg:col-span-7 undefined">
										<div className="grid gap-2 text-sm leading-4 md:grid md:grid-cols-12">
											<div className="flex flex-row justify-between col-span-12 space-x-2">
												<label className="block text-sm leading-4 text-muted-foreground" htmlFor="name">
													Project name
												</label>
											</div>
											<div className="col-span-12">
												<div className="relative">
													<Input defaultValue="Thorbis" />
												</div>
												<p data-state="hide" className="text-sm leading-4 text-red-900 transition-all data-show:mt-2 data-show:animate-slide-down-normal data-hide:animate-slide-up-normal" />
											</div>
										</div>
										<div className="grid gap-2 text-sm leading-4 md:grid md:grid-cols-12">
											<div className="flex flex-row justify-between col-span-12 space-x-2">
												<label className="block text-sm leading-4 text-muted-foreground" htmlFor="ref">
													Reference ID
												</label>
											</div>
											<div className="col-span-12">
												<div className="relative">
													<Input defaultValue="wuktajjeguysvwyvbrso" />
													<div className="absolute inset-y-0 right-0 flex items-center pl-3 pr-1 space-x-1">
														<Button variant="secondary" size="xs">
															<Copy className="w-4 h-4 mr-2 text-muted-foreground" />
															<span className="truncate text-muted-foreground">Copy</span>
														</Button>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="border-t">
								<div className="flex px-8 py-4">
									<div className="flex items-center justify-end w-full gap-2">
										<div className="flex items-center gap-2">
											<Button variant="outline" size="xs">
												<span className="truncate">Cancel</span>
											</Button>
											<Button size="xs">
												<span className="truncate">Save</span>
											</Button>
										</div>
									</div>
								</div>
							</div>
						</form>
					</Card>
				</div>

				<div>
					<div className="flex items-center justify-between mb-6 undefined">
						<div className="space-y-1">
							<h3 className="text-xl text-foreground">Transfer Project</h3>
							<div className="max-w-full text-sm prose text-muted-foreground">
								<p>Transfer your project to a different organization.</p>
							</div>
						</div>
					</div>
					<Card className="border-b-0 rounded-b-none">
						<div className="flex justify-between px-8 py-4">
							<div>
								<p className="text-sm">Restart project</p>
								<div className="max-w-[420px]">
									<p className="text-sm text-muted-foreground">Your project will not be available for a few minutes.</p>
								</div>
							</div>
							<div className="flex items-center" data-state="closed">
								<Button variant="secondary" size="xs">
									Rester Project <ChevronDown className="w-4 h-4 ml-2" />
								</Button>
							</div>
						</div>
					</Card>
					<Card className="rounded-t-none">
						<div className="flex items-center justify-between w-full px-8 py-4">
							<div>
								<p className="text-sm">Pause project</p>
								<div className="max-w-[420px]">
									<p className="text-sm text-muted-foreground">Your project will not be accessible while it is paused.</p>
								</div>
							</div>
							<Button variant="secondary" size="xs">
								<Pause className="w-4 h-4" />
								<span className="truncate">Pause project</span>
							</Button>
						</div>
					</Card>
					<Card className="mt-4">
						<div className="flex justify-between w-full px-8 py-4">
							<div className="flex space-x-4">
								<BarChart className="w-6 h-6" />
								<div>
									<p className="text-sm">Project usage statistics has been moved</p>
									<p className="text-sm text-muted-foreground">You may view your project&APOS;s usage under your organization&APOS;s settings</p>
								</div>
							</div>
							<div>
								<Button variant="secondary" size="xs">
									View project usage
								</Button>
							</div>
						</div>
					</Card>
				</div>

				<div>
					<div className="flex items-center justify-between mb-6">
						<div className="space-y-1">
							<h3 className="text-xl text-foreground">Transfer Project</h3>
							<div className="max-w-full text-sm prose text-muted-foreground">
								<p>Transfer your project to a different organization.</p>
							</div>
						</div>
					</div>
					<Card>
						<div className="flex px-6 py-4 gap-x-3 ">
							<div className="mt-1">
								<AlertCircle className="w-6 h-6" />
							</div>
							<div className="flex items-center justify-between w-full gap-x-32">
								<div className="space-y-1">
									<p className="text-sm">Custom domains are a Pro Plan add-on</p>
									<div>
										<p className="text-sm text-muted-foreground">To configure a custom domain for your project, please upgrade to the Pro Plan with the custom domains add-on selected</p>
									</div>
								</div>
								<Button size="xs">
									<span className="truncate">Upgrade to Pro</span>
								</Button>
							</div>
						</div>
					</Card>
				</div>

				<div>
					<div className="flex items-center justify-between mb-6 undefined">
						<div className="space-y-1">
							<h3 className="text-xl text-foreground">Transfer Project</h3>
							<div className="max-w-full text-sm prose text-muted-foreground">
								<p>Transfer your project to a different organization.</p>
							</div>
						</div>
					</div>
					<Card className="mb-8 overflow-hidden">
						<div className="px-6 py-4">
							<div className="flex items-center justify-between gap-8">
								<div className="flex space-x-4">
									<Truck className="w-6 h-6" />
									<div className="space-y-1 xl:max-w-lg">
										<p className="text-sm">Transfer project to another organization</p>
										<p className="text-sm text-muted-foreground">To transfer projects, the owner must be a member of both the source and target organizations.</p>
									</div>
								</div>
								<div>
									<Button variant="secondary" size="xs">
										<span className="truncate">Transfer project</span>
									</Button>
								</div>
							</div>
						</div>
					</Card>
				</div>

				<div>
					<div className="flex items-center justify-between mb-6 undefined">
						<div className="space-y-1">
							<h3 className="text-xl text-foreground">Transfer Project</h3>
							<div className="max-w-full text-sm prose text-muted-foreground">
								<p>Transfer your project to a different organization.</p>
							</div>
						</div>
					</div>

					<Card variant="destructive">
						<div className="relative flex items-start px-6 py-4 space-x-4">
							<div className="text-red-300">
								<AlertOctagon className="w-6 h-6" />
							</div>
							<div className="flex items-center justify-between flex-1">
								<div>
									<h3 className="block mb-1 text-sm font-normal text-red-1200">Deleting this project will also remove your database.</h3>
									<div>
										<p className="block mb-4 text-sm">Make sure you have made a backup if you want to keep your data.</p>
										<Button variant="secondary" size="xs">
											<span className="truncate">Delete project</span>
										</Button>
									</div>
								</div>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</>
	);
}
