// components/Sidebar.js
import { usePathname } from "next/navigation";
import SidebarSection from "./SidebarSection";
import SidebarItem from "./SidebarItem";

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
		<aside className="p-2 bg-gray-100 w-44">
			<nav className="mt-10 space-y-4">
				{sidebarLinks[currentPath]?.map((section, index) => (
					<div key={index}>
						<SidebarSection title={section.section} />
						{section.links.map((link) => (
							<SidebarItem key={link.href} href={link.href} text={link.text} className={section.section} />
						))}
					</div>
				))}
			</nav>
		</aside>
	);
}
