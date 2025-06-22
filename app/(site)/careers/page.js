import { MapPin, Briefcase, BrainCircuit, HeartHandshake, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export const metadata = {
	title: "Careers",
	description: "Join our mission-driven team and shape the future with us.",
};

const openPositions = [
	{
		title: "Senior Full-Stack Engineer",
		department: "Engineering",
		location: "Remote",
		type: "Full-time",
	},
	{
		title: "Product Marketing Manager",
		department: "Marketing",
		location: "Springfield, IL",
		type: "Full-time",
	},
	{
		title: "UX/UI Designer",
		department: "Design",
		location: "Remote",
		type: "Contract",
	},
];

const benefits = [
	{
		icon: <HeartHandshake className="w-8 h-8 text-primary" />,
		title: "Comprehensive Health",
		description: "Full medical, dental, and vision coverage for you and your family.",
	},
	{
		icon: <BrainCircuit className="w-8 h-8 text-primary" />,
		title: "Continuous Learning",
		description: "A generous budget for books, courses, and conferences.",
	},
	{
		icon: <Zap className="w-8 h-8 text-primary" />,
		title: "Flexible Work",
		description: "Work from where you're most productive, whether it's our office or your home.",
	},
];

export default function CareersPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: metadata.title,
		description: metadata.description,
		url: "https://local.byronwade.com/careers",
		isPartOf: {
			"@type": "WebSite",
			name: "Inbox Zero",
			url: "https://local.byronwade.com",
		},
		mainEntity: {
			"@type": "ItemList",
			name: "Open Positions",
			itemListElement: openPositions.map((job, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "JobPosting",
					title: job.title,
					description: `We are looking for a ${job.title} to join our ${job.department} team.`,
					hiringOrganization: {
						"@type": "Organization",
						name: "Inbox Zero",
					},
					employmentType: job.type.toUpperCase(),
					jobLocation: {
						"@type": "Place",
						address: {
							"@type": "PostalAddress",
							addressLocality: job.location,
						},
					},
				},
			})),
		},
	};
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				{/* Hero Section */}
				<div className="relative h-96">
					<Image src="https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=2071&auto=format&fit=crop" alt="Join Our Team" layout="fill" objectFit="cover" className="opacity-30" />
					<div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
					<div className="relative h-full flex flex-col items-center justify-center text-center px-4">
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Shape the Future With Us</h1>
						<p className="mt-4 text-lg md:text-xl max-w-3xl text-muted-foreground">We&apos;re looking for passionate people to join our mission-driven team.</p>
					</div>
				</div>

				{/* Open Positions Section */}
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-5xl mx-auto">
						<h2 className="text-3xl font-bold tracking-tight text-center mb-12">Open Positions</h2>
						<div className="space-y-6">
							{openPositions.map((job) => (
								<Card key={job.title} className="hover:shadow-lg transition-shadow">
									<CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
										<div>
											<h3 className="text-xl font-semibold">{job.title}</h3>
											<div className="flex items-center gap-x-4 text-muted-foreground mt-2">
												<span className="flex items-center gap-x-1.5">
													<Briefcase className="w-4 h-4" />
													{job.department}
												</span>
												<span className="flex items-center gap-x-1.5">
													<MapPin className="w-4 h-4" />
													{job.location}
												</span>
											</div>
										</div>
										<div className="mt-4 md:mt-0 flex items-center gap-4">
											<Badge variant="secondary">{job.type}</Badge>
											<Button>Apply Now</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</div>

				{/* Benefits Section */}
				<div className="bg-muted py-24 px-4 lg:px-24">
					<div className="max-w-5xl mx-auto">
						<h2 className="text-3xl font-bold tracking-tight text-center mb-12">Perks & Benefits</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{benefits.map((benefit) => (
								<div key={benefit.title} className="text-center">
									<div className="flex justify-center mb-4">{benefit.icon}</div>
									<h3 className="font-semibold text-lg">{benefit.title}</h3>
									<p className="text-muted-foreground">{benefit.description}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
