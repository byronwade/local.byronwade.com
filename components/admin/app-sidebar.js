"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@components/ui/sidebar";
import { cn } from "@lib/utils";

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

export function AppSidebar({ className, ...props }) {
	const pathname = usePathname();
	const currentPath = pathname.split("/").slice(0, 3).join("/");
	const currentSections = sidebarLinks[currentPath];

	return (
		<Sidebar variant="sidebar" collapsible="offcanvas" className={cn("border-0 transition-transform duration-200 ease-linear", className)} {...props}>
			<SidebarContent>
				{currentSections?.map((section, index) => (
					<div key={index}>
						<SidebarGroup>
							<SidebarGroupLabel>{section.section}</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{section.links.map((link) => {
										const isActive = pathname === link.href;
										return (
											<SidebarMenuItem key={link.href}>
												<SidebarMenuButton asChild isActive={isActive}>
													<Link href={link.href}>{link.text}</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										);
									})}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
						{index < currentSections.length - 1 && <SidebarSeparator />}
					</div>
				))}
			</SidebarContent>
		</Sidebar>
	);
}
