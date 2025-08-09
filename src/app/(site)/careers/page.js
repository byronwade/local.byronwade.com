import { MapPin, Briefcase, BrainCircuit, HeartHandshake, Zap } from "lucide-react";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import Image from "next/image";

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

export const metadata = {
	title: "Careers at Thorbis - Join Our Mission-Driven Team",
	description: "Join Thorbis and shape the future of local business discovery. We're looking for passionate people to help connect communities with great businesses. Competitive benefits and remote work available.",
	keywords: ["careers at thorbis", "jobs", "remote work", "software engineer", "product manager", "ux designer", "startup jobs", "mission-driven work"],
	openGraph: {
		title: "Careers at Thorbis - Join Our Mission-Driven Team",
		description: "Join Thorbis and shape the future of local business discovery. We're looking for passionate people to help connect communities with great businesses. Competitive benefits and remote work available.",
		url: "https://thorbis.com/careers",
		siteName: "Thorbis",
		images: [
			{
				url: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=2071&auto=format&fit=crop",
				width: 1200,
				height: 630,
				alt: "Join Our Team at Thorbis",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Careers at Thorbis - Join Our Team",
		description: "Shape the future of local business discovery with our mission-driven team.",
		images: ["https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=2071&auto=format&fit=crop"],
	},
	alternates: {
		canonical: "https://thorbis.com/careers",
	},
};

export default function CareersPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Careers at Thorbis",
		description: "Join our mission-driven team and shape the future of local business discovery",
		url: "https://thorbis.com/careers",
		mainEntity: [
			{
				"@type": "JobPosting",
				title: "Senior Full-Stack Engineer",
				description: "Join our engineering team to build innovative solutions for local business discovery",
				hiringOrganization: {
					"@type": "Organization",
					name: "Thorbis",
					sameAs: "https://thorbis.com",
				},
				jobLocation: {
					"@type": "Place",
					address: "Remote",
				},
				employmentType: "FULL_TIME",
				workHours: "Full-time",
			},
			{
				"@type": "JobPosting",
				title: "Product Marketing Manager",
				description: "Lead marketing initiatives to grow our local business platform",
				hiringOrganization: {
					"@type": "Organization",
					name: "Thorbis",
					sameAs: "https://thorbis.com",
				},
				jobLocation: {
					"@type": "Place",
					address: {
						"@type": "PostalAddress",
						addressLocality: "Springfield",
						addressRegion: "IL",
					},
				},
				employmentType: "FULL_TIME",
				workHours: "Full-time",
			},
			{
				"@type": "JobPosting",
				title: "UX/UI Designer",
				description: "Design exceptional user experiences for our local business platform",
				hiringOrganization: {
					"@type": "Organization",
					name: "Thorbis",
					sameAs: "https://thorbis.com",
				},
				jobLocation: {
					"@type": "Place",
					address: "Remote",
				},
				employmentType: "CONTRACTOR",
				workHours: "Contract",
			},
		],
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					item: {
						"@id": "https://thorbis.com",
						name: "Thorbis",
					},
				},
				{
					"@type": "ListItem",
					position: 2,
					item: {
						"@id": "https://thorbis.com/careers",
						name: "Careers",
					},
				},
			],
		},
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				{/* Hero Section */}
				<div className="relative h-96">
					<Image src="https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=2071&auto=format&fit=crop" alt="Join Our Team" layout="fill" objectFit="cover" className="opacity-30" />
					<div className="absolute inset-0 bg-gradient-to-t to-transparent from-background" />
					<div className="flex relative flex-col justify-center items-center px-4 h-full text-center">
						<h1 className="text-4xl font-extrabold tracking-tighter md:text-6xl">Shape the Future With Us</h1>
						<p className="mt-4 max-w-3xl text-lg md:text-xl text-muted-foreground">We&apos;re looking for passionate people to join our mission-driven team.</p>
					</div>
				</div>

				{/* Open Positions Section */}
				<div className="px-4 py-24 lg:px-24">
					<div className="mx-auto max-w-5xl">
						<h2 className="mb-12 text-3xl font-bold tracking-tight text-center">Open Positions</h2>
						<div className="space-y-6">
							{openPositions.map((job) => (
								<Card key={job.title} className="transition-shadow hover:shadow-lg">
									<CardContent className="flex flex-col justify-between items-start p-6 md:flex-row md:items-center">
										<div>
											<h3 className="text-xl font-semibold">{job.title}</h3>
											<div className="flex gap-x-4 items-center mt-2 text-muted-foreground">
												<span className="flex gap-x-1.5 items-center">
													<Briefcase className="w-4 h-4" />
													{job.department}
												</span>
												<span className="flex gap-x-1.5 items-center">
													<MapPin className="w-4 h-4" />
													{job.location}
												</span>
											</div>
										</div>
										<div className="flex gap-4 items-center mt-4 md:mt-0">
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
				<div className="px-4 py-24 bg-muted lg:px-24">
					<div className="mx-auto max-w-5xl">
						<h2 className="mb-12 text-3xl font-bold tracking-tight text-center">Perks & Benefits</h2>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
							{benefits.map((benefit) => (
								<div key={benefit.title} className="text-center">
									<div className="flex justify-center mb-4">{benefit.icon}</div>
									<h3 className="text-lg font-semibold">{benefit.title}</h3>
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
