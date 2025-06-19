"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@components/ui/sidebar";
import { cn } from "@lib/utils";

const sidebarLinks = {
	"/dashboard/admin": [
		{
			section: "Dashboard",
			links: [
				{ href: "/dashboard/admin", text: "Overview" },
				{ href: "/dashboard/admin/analytics", text: "Analytics" },
				{ href: "/dashboard/admin/activity-log", text: "Activity Log" },
				{ href: "/dashboard/admin/notifications", text: "Notifications" },
			],
		},
	],
	"/dashboard/admin/users": [
		{
			section: "User Management",
			links: [
				{ href: "/dashboard/admin/users", text: "Customer List" },
				{ href: "/dashboard/admin/users/add", text: "Add Customer" },
				{ href: "/dashboard/admin/users/account-details", text: "Account Details" },
				{ href: "/dashboard/admin/users/support", text: "Customer Support" },
				{ href: "/dashboard/admin/users/feedback", text: "Feedback" },
				{ href: "/dashboard/admin/users/settings", text: "Settings" },
			],
		},
	],
	"/dashboard/admin/customers": [
		{
			section: "Customers",
			links: [
				{ href: "/dashboard/admin/customers", text: "All Customers" },
				{ href: "/dashboard/admin/customers/active", text: "Active Customers" },
				{ href: "/dashboard/admin/customers/inactive", text: "Inactive Customers" },
				{ href: "/dashboard/admin/customers/new", text: "New Customers" },
			],
		},
		{
			section: "Customer Management",
			links: [
				{ href: "/dashboard/admin/customers/profiles", text: "Customer Profiles" },
				{ href: "/dashboard/admin/customers/communications", text: "Communications" },
				{ href: "/dashboard/admin/customers/analytics", text: "Customer Analytics" },
				{ href: "/dashboard/admin/customers/segments", text: "Customer Segments" },
			],
		},
		{
			section: "Customer Support",
			links: [
				{ href: "/dashboard/admin/customers/tickets", text: "Support Tickets" },
				{ href: "/dashboard/admin/customers/feedback", text: "Customer Feedback" },
				{ href: "/dashboard/admin/customers/reports", text: "Customer Reports" },
			],
		},
	],
	"/dashboard/admin/pro-accounts": [
		{
			section: "Pro Account Management",
			links: [
				{ href: "/dashboard/admin/pro-accounts", text: "Transactions" },
				{ href: "/dashboard/admin/pro-accounts/invoices", text: "Invoices" },
				{ href: "/dashboard/admin/pro-accounts/refunds", text: "Refunds" },
				{ href: "/dashboard/admin/pro-accounts/payment-methods", text: "Payment Methods" },
				{ href: "/dashboard/admin/pro-accounts/settings", text: "Settings" },
			],
		},
	],
	"/dashboard/admin/reports": [
		{
			section: "Reporting",
			links: [
				{ href: "/dashboard/admin/reports", text: "Sales Reports" },
				{ href: "/dashboard/admin/reports/customers", text: "Customer Reports" },
				{ href: "/dashboard/admin/reports/employees", text: "Employee Reports" },
				{ href: "/dashboard/admin/reports/financial", text: "Financial Reports" },
				{ href: "/dashboard/admin/reports/custom", text: "Custom Reports" },
			],
		},
	],
	"/dashboard/admin/support": [
		{
			section: "Support Center",
			links: [
				{ href: "/dashboard/admin/support", text: "Tickets" },
				{ href: "/dashboard/admin/support/live-chat", text: "Live Chat" },
				{ href: "/dashboard/admin/support/faqs", text: "FAQs" },
				{ href: "/dashboard/admin/support/help-articles", text: "Help Articles" },
				{ href: "/dashboard/admin/support/settings", text: "Settings" },
			],
		},
	],
	"/dashboard/admin/billing": [
		{
			section: "Billing Management",
			links: [
				{ href: "/dashboard/admin/billing", text: "Overview" },
				{ href: "/dashboard/admin/billing/pending", text: "Pending Bills" },
				{ href: "/dashboard/admin/billing/paid", text: "Paid Bills" },
			],
		},
		{
			section: "Payment Settings",
			links: [
				{ href: "/dashboard/admin/billing/payment-methods", text: "Payment Methods" },
				{ href: "/dashboard/admin/billing/settings", text: "Settings" },
			],
		},
	],
	"/dashboard/admin/settings": [
		{
			section: "System Settings",
			links: [
				{ href: "/dashboard/admin/settings", text: "General Settings" },
				{ href: "/dashboard/admin/settings/profile", text: "Profile Settings" },
				{ href: "/dashboard/admin/settings/security", text: "Security" },
				{ href: "/dashboard/admin/settings/notifications", text: "Notifications" },
				{ href: "/dashboard/admin/settings/preferences", text: "Preferences" },
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

