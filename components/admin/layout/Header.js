// components/Header.js
import NavItem from "@/components/shared/layout/NavItem";
import { Card, CardContent } from "@/components/ui/card";

export default function Header() {
	return (
		<header className="flex items-center justify-between p-4">
			<div className="flex flex-row space-x-2">
				<Card className="flex items-center p-1 px-2 space-x-2 text-black bg-gray-200 rounded-lg cursor-pointer hover:bg-blue-200 dark:bg-gray-800 dark:text-white dark:hover:bg-brand-light">
					<div className="w-6 h-6 bg-gray-400 rounded-md dark:bg-gray-600" />
					<CardContent className="p-0 text-xs">
						<div>Wade&apos;s Inc</div>
						<div className="text-xs text-gray-500 dark:text-gray-400">Wade&apos;s Plumbing & Septic</div>
					</CardContent>
				</Card>
				<Card className="flex items-center p-1 px-2 space-x-2 text-black bg-gray-200 rounded-lg cursor-pointer hover:bg-blue-200 dark:bg-gray-800 dark:text-white dark:hover:bg-brand-light">
					<div className="w-6 h-6 bg-gray-400 rounded-md dark:bg-gray-600" />
					<CardContent className="p-0 text-xs">
						<div>Byron</div>
						<div className="text-xs text-gray-500 dark:text-gray-400">Wade</div>
					</CardContent>
				</Card>
			</div>
			<nav className="flex items-center space-x-4">
				<NavItem href="/admin" text="Dashboard" />
				{/* <NavItem href="/admin/phone" text="Phone" /> */}
				<NavItem href="/admin/users" text="Users" />
				<NavItem href="/admin/pro-accounts" text="Pro Accounts" />
				<NavItem href="/admin/support" text="Support" />
				<NavItem href="/admin/billing" text="Billing" />
				<NavItem href="/admin/settings" text="Settings" />
			</nav>
		</header>
	);
}
