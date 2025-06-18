import Link from "next/link";
import { CircleUser, Menu, Package2, Search } from "lucide-react";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@components/ui/card";
import { Checkbox } from "@components/ui/checkbox";
import { Input } from "@components/ui/input";

export default function Support() {
	return (
		<div className="w-full px-4 lg:px-24 py-16 space-y-8">
			<div className="grid w-full gap-2">
				<h1 className="text-4xl">Support</h1>
				<p className="text-muted-foreground">Get help and support for your business account.</p>
			</div>
			<div className="mx-auto grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
				<nav className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0">
					<Link href="#" className="font-semibold text-primary">
						General
					</Link>
					<Link href="#">Security</Link>
					<Link href="#">Integrations</Link>
					<Link href="#">Support</Link>
					<Link href="#">Organizations</Link>
					<Link href="#">Advanced</Link>
				</nav>
				<div className="grid gap-6">
					<Card x-chunk="dashboard-04-chunk-1">
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
					<Card x-chunk="dashboard-04-chunk-2">
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
