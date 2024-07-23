import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { MapPin, Mail, Edit, PlusCircle, Users, MessageCircle, HelpCircle, Phone } from "lucide-react";
import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";

const features = [
	{
		name: "Hello, Byron!",
		description: "Thursday, 18 Jul 1:21am",
		className: "col-span-2 row-span-1",
		content: (
			<div className="p-4 text-white">
				<p>Welcome to your new dashboard. Show</p>
				<p>You&apos;re not receiving requests for Nationwide as there are no services added for it</p>
				<Button variant="outline" className="mt-2">
					<Edit className="w-4 h-4 mr-2" />
					Edit location
				</Button>
			</div>
		),
	},
	{
		name: "businessfile",
		description: "Byron Wade",
		className: "col-span-1 row-span-1",
		content: (
			<div className="p-4 text-white">
				<Button size="sm">
					<Edit className="w-4 h-4 mr-2" />
					Edit
				</Button>
				<p className="mt-2">
					Completing your businessfile is a great way to appeal to customers · <Button variant="link">Edit businessfile</Button>
				</p>
			</div>
		),
	},
	{
		name: "20% OFF STARTER PACK OFFER",
		description: "Starter pack offer",
		className: "col-span-1 row-span-1",
		content: (
			<div className="p-4 text-white">
				<p>Respond to up to 10 customers</p>
				<p>20% OFF and a get hired guarantee.</p>
				<Button variant="link" className="mt-2">
					More info
				</Button>
			</div>
		),
	},
	{
		name: "Lead Settings",
		description: "Services",
		className: "col-span-2 row-span-1",
		content: (
			<div className="p-4 text-white">
				<p>You&apos;ll receive leads in these categories</p>
				<ul className="list-disc list-inside">
					<li>Web Design</li>
				</ul>
				<Button variant="outline" className="mt-2">
					<PlusCircle className="w-4 h-4 mr-2" />
					Add service
				</Button>
			</div>
		),
	},
	{
		name: "Locations",
		description: "You&apos;re receiving customers within",
		className: "col-span-1 row-span-1",
		content: (
			<div className="p-4 text-white">
				<p>Nationwide</p>
				<p>30 Minutes Drive From 95005</p>
				<p>Estimated 94 leads per day</p>
				<p>Sending new leads to</p>
				<p>
					<Mail className="inline w-4 h-4 mr-2" /> bcw1995@gmail.com
				</p>
				<Button variant="link" className="mt-2">
					Change
				</Button>
			</div>
		),
	},
	{
		name: "Leads",
		description: "View",
		className: "col-span-1 row-span-1",
		content: (
			<div className="p-4 text-white">
				<p>876 Leads</p>
				<p>872 Unread leads</p>
				<Button variant="link" className="mt-2">
					View
				</Button>
			</div>
		),
	},
	{
		name: "Responses",
		description: "View",
		className: "col-span-1 row-span-1",
		content: (
			<div className="p-4 text-white">
				<p>You haven’t responded to any leads yet.</p>
				<Button variant="link" className="mt-2">
					View
				</Button>
			</div>
		),
	},
	{
		name: "Help",
		description: "Visit help center for tips & advice.",
		className: "col-span-1 row-span-1",
		content: (
			<div className="p-4 text-white">
				<p>
					Email <Mail className="inline w-4 h-4 mr-2" /> team@thorbis
				</p>
				<p>
					Call <Phone className="inline w-4 h-4 mr-2" /> (424) 227-5323
				</p>
				<p>Open 24 hours a day, 7 days a week</p>
			</div>
		),
	},
	{
		name: "Customer Reviews",
		description: "Recent feedback",
		className: "col-span-2 row-span-1",
		content: (
			<div className="p-4 text-white">
				<p>John Doe: Great service!</p>
				<p>Jane Smith: Very businessfessional.</p>
				<Button variant="link" className="mt-2">
					View all reviews
				</Button>
			</div>
		),
	},
	{
		name: "Statistics",
		description: "Monthly overview",
		className: "col-span-2 row-span-1",
		content: (
			<div className="p-4 text-white">
				<p>Leads received: 100</p>
				<p>Jobs completed: 80</p>
				<Button variant="link" className="mt-2">
					View detailed stats
				</Button>
			</div>
		),
	},
	{
		name: "Notifications",
		description: "Latest updates",
		className: "col-span-1 row-span-1",
		content: (
			<div className="p-4 text-white">
				<p>You have 3 new notifications</p>
				<Button variant="link" className="mt-2">
					View notifications
				</Button>
			</div>
		),
	},
];

export default function Dashboard() {
	return (
		<div className="p-4 space-y-4">
			<div className="mb-4">
				<h1 className="mb-2 text-4xl font-extrabold tracking-tight text-white lg:text-5xl">Hi, Byron Wade.</h1>
				<p className="text-sm text-gray-400">Thursday, 18 Jul 1:21am</p>
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				{features.map((feature, idx) => (
					<div key={idx} className={`${feature.className} bg-gray-800 rounded-lg shadow-md`}>
						<Card className="h-full text-white bg-gray-800">
							<CardHeader>
								<CardTitle>{feature.name}</CardTitle>
								<CardDescription>{feature.description}</CardDescription>
							</CardHeader>
							<CardContent className="h-full">{feature.content}</CardContent>
						</Card>
					</div>
				))}
			</div>
		</div>
	);
}