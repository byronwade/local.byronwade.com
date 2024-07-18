import React from "react";
import NavItem from "@/components/shared/layout/NavItem";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus } from "react-feather";
import { User, Settings, LogOut } from "lucide-react";

export default function Header() {
	return (
		<header className="container flex items-center justify-between p-4 max-w-screen-2xl">
			<div className="flex flex-row space-x-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Card className="flex items-center p-1 px-2 space-x-2 text-black bg-gray-200 rounded-lg cursor-pointer hover:bg-blue-200 dark:bg-gray-800 dark:text-white dark:hover:bg-brand-light">
							<div className="w-6 h-6 bg-gray-400 rounded-md dark:bg-gray-600" />
							<CardContent className="p-0 text-xs">
								<div>Byron</div>
								<div className="text-xs text-gray-500 dark:text-gray-400">Wade</div>
							</CardContent>
						</Card>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56 bg-black">
						<DropdownMenuItem>
							<User className="w-4 h-4 mr-2" />
							<span>Profile</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Settings className="w-4 h-4 mr-2" />
							<span>Settings</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<LogOut className="w-4 h-4 mr-2" />
							<span>Log Out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<nav className="flex items-center space-x-4">
				<NavItem href="/user" text="Dashboard" />
				<NavItem href="/user/jobs" text="Jobs" />
				<NavItem href="/user/billing" text="Billing & Payments" />
				<NavItem href="/user/support" text="Support" />
				<NavItem href="/user/settings" text="Settings" />
				<Button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] bg-black px-3 text-xs text-white hover:bg-black hover:text-white dark:bg-white dark:text-black">
					<Plus className="w-3 h-3" />
					Post a job
				</Button>
			</nav>
		</header>
	);
}
