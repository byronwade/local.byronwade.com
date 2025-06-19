import Link from "next/link";
import { CircleUser, Menu, Package2, Search } from "lucide-react";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@components/ui/card";
import { Checkbox } from "@components/ui/checkbox";
import { Input } from "@components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { ChevronDown } from "react-feather";

const menuItems = [{ label: "Dashboard" }, { label: "Kanban", badge: "Pro" }, { label: "Inbox", badge: "3" }, { label: "Users" }, { label: "Products" }, { label: "Sign In" }, { label: "Sign Up" }];

export default function Support() {
	return (
		<div className="w-full px-4 lg:px-24 py-16 space-y-8">
			<div className="flex items-center justify-between space-x-6">
				<h1 className="text-4xl">Support</h1>
				<div className="flex items-center gap-x-3">
					<Button variant="outline" size="sm">
						Claim a Business
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
			<p className="text-muted-foreground">Get help and support for your account.</p>
			<div className="mx-auto grid w-full items-start gap-4 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
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

				<div className="grid gap-4">
					<Card>
						<CardHeader>
							<CardTitle>Store Name</CardTitle>
							<CardDescription>Used to identify your store in the marketplace.</CardDescription>
						</CardHeader>
						<CardContent>
							<form>
								<Input placeholder="Store Name" />
							</form>
						</CardContent>
						<CardFooter className="px-6 py-4 border-t">
							<Button>Save</Button>
						</CardFooter>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Plugins Directory</CardTitle>
							<CardDescription>The directory within your businessject, in which your plugins are located.</CardDescription>
						</CardHeader>
						<CardContent>
							<form className="flex flex-col gap-4">
								<Input placeholder="businessject Name" defaultValue="/content/plugins" />
								<div className="flex items-center space-x-2">
									<Checkbox id="include" defaultChecked />
									<label htmlFor="include" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
										Allow administrators to change the directory.
									</label>
								</div>
							</form>
						</CardContent>
						<CardFooter className="px-6 py-4 border-t">
							<Button>Save</Button>
						</CardFooter>
					</Card>
					{/* Additional sections styled like the Subscription Plan section */}
					<Card x-chunk="dashboard-04-chunk-3">
						<CardHeader>
							<CardTitle>Billing Address</CardTitle>
							<CardDescription>This will be reflected in every upcoming invoice, past invoices are not affected</CardDescription>
						</CardHeader>
						<CardContent>
							<form className="grid gap-4">
								<Input placeholder="Address line 1" />
								<Input placeholder="Address line 2" />
								<div className="grid grid-cols-2 gap-4">
									<Input placeholder="City" />
									<Input placeholder="State" />
								</div>
								<div className="grid grid-cols-2 gap-4">
									<Input placeholder="Postal code" />
									<Input placeholder="Country" />
								</div>
							</form>
						</CardContent>
						<CardFooter className="px-6 py-4 border-t">
							<Button>Save</Button>
						</CardFooter>
					</Card>
					<Card x-chunk="dashboard-04-chunk-4">
						<CardHeader>
							<CardTitle>Email Recipient</CardTitle>
							<CardDescription>All billing correspondence will go to this email</CardDescription>
						</CardHeader>
						<CardContent>
							<form id="org-billing-email">
								<Input id="billing_email" type="text" defaultValue="bw@wadesinc.io" />
							</form>
						</CardContent>
						<CardFooter className="px-6 py-4 border-t">
							<Button>Save</Button>
						</CardFooter>
					</Card>
					<Card x-chunk="dashboard-04-chunk-5">
						<CardHeader>
							<CardTitle>Tax ID</CardTitle>
							<CardDescription>Add a tax ID to your invoices. Changes only apply to future invoices.</CardDescription>
						</CardHeader>
						<CardContent>
							<form id="tax-id-form" className="grid gap-4">
								<div className="flex items-center space-x-2">
									<select name="tax_id" className="w-full px-3 py-2 border border-gray-300 rounded-md">
										<option value="">Select Tax ID</option>
										<option value="AD NRT">Andorra - AD NRT</option>
										<option value="AR CUIT">Argentina - AR CUIT</option>
										<option value="AU ABN">Australia - AU ABN</option>
										<option value="AU ARN">Australia - AU ARN</option>
										<option value="AT VAT">Austria - AT VAT</option>
										{/* Add more options as needed */}
									</select>
								</div>
								<Input placeholder="Tax ID" />
							</form>
						</CardContent>
						<CardFooter className="px-6 py-4 border-t">
							<Button>Save</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
}

