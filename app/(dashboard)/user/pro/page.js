import React from "react";
import { Button } from "@components/ui/button";
import { ChevronDown } from "react-feather";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";

export default function Pro() {
	return (
		<>
			<div className="w-full mx-auto my-16 space-y-16">
				<div className="flex items-center justify-between space-x-6">
					<h1 className="text-4xl">Hi</h1>
					<div className="flex items-center gap-x-3">
						<Button variant="outline" size="sm">
							Claim a Buissness
						</Button>
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
			<div className="flex flex-row justify-between w-full py-16 mt-6 rounded-md bg-brand">
				<div className="px-4">
					<h1 className="text-4xl font-bold">$5/month</h1>
				</div>
				<div className="px-4">
					<Button size="sm">Signup</Button>
				</div>
			</div>
		</>
	);
}
