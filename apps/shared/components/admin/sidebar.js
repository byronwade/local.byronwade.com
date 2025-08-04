// components/Sidebar.js
import { usePathname } from "next/navigation";
import { Card } from "@components/ui/card";
import { ScrollArea } from "@components/ui/scroll-area";
import { Separator } from "@components/ui/separator";
import SidebarSection from "./sidebar-section";
import SidebarItem from "./sidebar-item";

const sidebarLinks = {
	"/admin": [
		{
			section: "Dashboard",
			links: [
				{ href: "/admin", text: "Overview" },
				{ href: "/admin/analytics", text: "Analytics" },
				{ href: "/admin/activity-log", text: "Activity Log" },
				{ href: "/admin/notifications", text: "Notifications" },
			],
		},
	],
	"/admin/users": [
		{
			section: "Customer Management",
			links: [
				{ href: "/admin/users", text: "Customer List" },
				{ href: "/admin/users/add", text: "Add Customer" },
				{ href: "/admin/users/account-details", text: "Account Details" },
				{ href: "/admin/users/support", text: "Customer Support" },
				{ href: "/admin/users/feedback", text: "Feedback" },
				{ href: "/admin/users/settings", text: "Settings" },
			],
		},
	],
	"/admin/customers": [
		{
			section: "Customer Overview",
			links: [
				{ href: "/admin/customers", text: "All Customers" },
				{ href: "/admin/customers/active", text: "Active Customers" },
				{ href: "/admin/customers/inactive", text: "Inactive Customers" },
				{ href: "/admin/customers/new", text: "New Customers" },
			],
		},
		{
			section: "Customer Management",
			links: [
				{ href: "/admin/customers/profiles", text: "Customer Profiles" },
				{ href: "/admin/customers/communications", text: "Communications" },
				{ href: "/admin/customers/analytics", text: "Customer Analytics" },
				{ href: "/admin/customers/segments", text: "Customer Segments" },
			],
		},
		{
			section: "Support & Services",
			links: [
				{ href: "/admin/customers/tickets", text: "Support Tickets" },
				{ href: "/admin/customers/feedback", text: "Customer Feedback" },
				{ href: "/admin/customers/reports", text: "Customer Reports" },
			],
		},
	],
	"/admin/pro-accounts": [
		{
			section: "Pro Account Management",
			links: [
				{ href: "/admin/pro-accounts", text: "Transactions" },
				{ href: "/admin/pro-accounts/invoices", text: "Invoices" },
				{ href: "/admin/pro-accounts/refunds", text: "Refunds" },
				{ href: "/admin/pro-accounts/payment-methods", text: "Payment Methods" },
				{ href: "/admin/pro-accounts/settings", text: "Settings" },
			],
		},
	],
	"/admin/reports": [
		{
			section: "Reports",
			links: [
				{ href: "/admin/reports", text: "Sales Reports" },
				{ href: "/admin/reports/customers", text: "Customer Reports" },
				{ href: "/admin/reports/employees", text: "Employee Reports" },
				{ href: "/admin/reports/financial", text: "Financial Reports" },
				{ href: "/admin/reports/custom", text: "Custom Reports" },
			],
		},
	],
	"/admin/support": [
		{
			section: "Support",
			links: [
				{ href: "/admin/support", text: "Tickets" },
				{ href: "/admin/support/live-chat", text: "Live Chat" },
				{ href: "/admin/support/faqs", text: "FAQs" },
				{ href: "/admin/support/help-articles", text: "Help Articles" },
				{ href: "/admin/support/settings", text: "Settings" },
			],
		},
	],
	"/admin/billing": [
		{
			section: "Billing Overview",
			links: [
				{ href: "/admin/billing", text: "Overview" },
				{ href: "/admin/billing/pending", text: "Pending Bills" },
				{ href: "/admin/billing/paid", text: "Paid Bills" },
			],
		},
		{
			section: "Payment Methods",
			links: [
				{ href: "/admin/billing/payment-methods", text: "Payment Methods" },
				{ href: "/admin/billing/settings", text: "Settings" },
			],
		},
	],
	"/admin/settings": [
		{
			section: "Settings",
			links: [
				{ href: "/admin/settings", text: "General Settings" },
				{ href: "/admin/settings/profile", text: "Profile Settings" },
				{ href: "/admin/settings/security", text: "Security" },
				{ href: "/admin/settings/notifications", text: "Notifications" },
				{ href: "/admin/settings/preferences", text: "Preferences" },
			],
		},
	],
};

export default function Sidebar() {
	const pathname = usePathname();
	const currentPath = pathname.split("/").slice(0, 3).join("/");

	return (
		<aside className="w-56">
			<Card className="h-full border-r border-l-0 border-t-0 border-b-0 rounded-none bg-card/50 backdrop-blur-sm">
				<ScrollArea className="h-full p-4">
					<nav className="space-y-6">
						{sidebarLinks[currentPath]?.map((section, index) => (
							<div key={index}>
								<SidebarSection title={section.section} />
								<div className="space-y-1">
									{section.links.map((link) => (
										<SidebarItem key={link.href} href={link.href} text={link.text} className={section.section} />
									))}
								</div>
								{index < sidebarLinks[currentPath].length - 1 && <Separator className="mt-4 mb-2" />}
							</div>
						))}
					</nav>
				</ScrollArea>
			</Card>
		</aside>
	);
}
