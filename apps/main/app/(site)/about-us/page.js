import { Briefcase, Heart, Users, Zap, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";

const leaders = [
	{
		name: "Byron Wade",
		role: "Founder & Visionary",
		image: "https://media.licdn.com/dms/image/D4E03AQGg7YAtEIX2NA/profile-displayphoto-shrink_800_800/0/1698622176214?e=1726704000&v=beta&t=M-Tf1s_9wNe2a_xGj4erJ1Gz29iX35naPcsgCzxHvyA",
		bio: "Byron is the driving force behind Thorbis, passionate about creating platforms that empower local economies and foster community growth.",
		linkedin: "https://www.linkedin.com/in/byron-wade-8b5b5a1b3/",
	},
	{
		name: "AI Assistant",
		role: "Chief Technology Officer",
		image: "/placeholder.svg",
		bio: "The AI assistant architecting our advanced systems, ensuring a seamless and intelligent experience for all our users.",
		linkedin: "#",
	},
];

const stats = [
	{ value: "10,000+", label: "Businesses Empowered" },
	{ value: "50+", label: "Communities Served" },
	{ value: "1M+", label: "Happy Users" },
	{ value: "99%", label: "Satisfaction Rate" },
];

export const metadata = {
	title: "About Thorbis - Local Business Platform & Community Partner",
	description: "Learn about Thorbis's mission to empower local businesses and connect communities. Discover our story, values, and commitment to supporting small businesses.",
	keywords: ["about thorbis", "local business platform", "community support", "small business empowerment", "local commerce"],
	authors: [{ name: "Byron Wade" }],
	openGraph: {
		title: "About Thorbis - Local Business Platform & Community Partner",
		description: "Learn about Thorbis's mission to empower local businesses and connect communities. Discover our story, values, and commitment to supporting small businesses.",
		url: "https://local.byronwade.com/about-us",
		siteName: "Thorbis",
		images: [
			{
				url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2832&auto=format&fit=crop",
				width: 1200,
				height: 630,
				alt: "Thorbis team collaboration",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "About Thorbis - Local Business Platform & Community Partner",
		description: "Learn about Thorbis's mission to empower local businesses and connect communities.",
		images: ["https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2832&auto=format&fit=crop"],
	},
	alternates: {
		canonical: "https://local.byronwade.com/about-us",
	},
};

export default function AboutPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Thorbis",
		description: "Thorbis is a local business platform that empowers small businesses and connects communities through innovative technology and community-first approach.",
		url: "https://local.byronwade.com",
		logo: "https://local.byronwade.com/logos/ThorbisLogo.webp",
		foundingDate: "2024",
		founder: {
			"@type": "Person",
			name: "Byron Wade",
			jobTitle: "Founder & Visionary",
			url: "https://www.linkedin.com/in/byron-wade-8b5b5a1b3/",
		},
		address: {
			"@type": "PostalAddress",
			addressLocality: "United States",
			addressCountry: "US",
		},
		sameAs: ["https://www.linkedin.com/in/byron-wade-8b5b5a1b3/"],
		knowsAbout: ["Local Business Directory", "Community Support", "Small Business Empowerment", "Local Commerce"],
		mission: "Empowering local businesses and fostering community connections through innovative technology.",
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				{/* Hero Section */}
				<section className="text-center py-20 md:py-32">
					<div className="container mx-auto px-4">
						<p className="text-primary font-semibold">Our Story</p>
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mt-2">We&apos;re Changing How You Connect with Your Community</h1>
						<p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">Thorbis started with a simple idea: what if finding and supporting local businesses was easier, more transparent, and more rewarding for everyone involved?</p>
					</div>
				</section>

				{/* Image collage */}
				<section className="container mx-auto px-4 mb-20 md:mb-32">
					<div className="grid grid-cols-12 grid-rows-2 gap-4 h-96">
						<div className="col-span-12 md:col-span-5 row-span-2 rounded-xl overflow-hidden">
							<Image src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2832&auto=format&fit=crop" alt="Team collaboration" width={800} height={1200} className="w-full h-full object-cover" />
						</div>
						<div className="col-span-12 md:col-span-7 rounded-xl overflow-hidden">
							<Image src="https://images.unsplash.com/photo-1581093450021-4a7360aa9a2f?q=80&w=2670&auto=format&fit=crop" alt="Innovation" width={1200} height={800} className="w-full h-full object-cover" />
						</div>
						<div className="col-span-12 md:col-span-7 rounded-xl overflow-hidden">
							<Image src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2574&auto=format&fit=crop" alt="Community meeting" width={1200} height={800} className="w-full h-full object-cover" />
						</div>
					</div>
				</section>

				{/* Our Philosophy Section */}
				<section className="py-20 md:py-32 bg-muted">
					<div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
						<div>
							<h2 className="text-3xl font-bold tracking-tight">Our Philosophy is Simple: Community First.</h2>
							<p className="mt-4 text-lg text-muted-foreground">We believe that thriving local businesses are the backbone of strong communities. Our mission is to provide business owners with the tools they need to succeed while creating a trusted resource for consumers. It&apos;s not just about transactions; it&apos;s about building relationships and fostering local pride.</p>
							<ul className="mt-6 space-y-4">
								<li className="flex items-center gap-3">
									<Heart className="w-6 h-6 text-primary" />
									<span className="font-medium">Empowering small businesses to flourish.</span>
								</li>
								<li className="flex items-center gap-3">
									<Users className="w-6 h-6 text-primary" />
									<span className="font-medium">Connecting consumers with trusted local services.</span>
								</li>
								<li className="flex items-center gap-3">
									<Zap className="w-6 h-6 text-primary" />
									<span className="font-medium">Innovating to make local commerce seamless.</span>
								</li>
							</ul>
						</div>
						<div className="rounded-xl overflow-hidden">
							<Image src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=2574&auto=format&fit=crop" alt="Community hands" width={800} height={800} className="w-full h-full object-cover" />
						</div>
					</div>
				</section>

				{/* By the Numbers Section */}
				<section className="py-20 md:py-32">
					<div className="container mx-auto px-4 text-center">
						<h2 className="text-3xl font-bold tracking-tight">Our Impact in Numbers</h2>
						<p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">We&apos;re proud of the progress we&apos;ve made, but we&apos;re just getting started.</p>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
							{stats.map((stat) => (
								<div key={stat.label} className="p-6 rounded-xl bg-card border">
									<p className="text-4xl font-extrabold text-primary">{stat.value}</p>
									<p className="mt-2 font-medium text-muted-foreground">{stat.label}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Meet Our Leaders Section */}
				<section className="py-20 md:py-32 bg-muted">
					<div className="container mx-auto px-4">
						<h2 className="text-3xl font-bold tracking-tight text-center">Meet Our Leaders</h2>
						<p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-center">The minds behind the mission, dedicated to our shared vision.</p>
						<div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 max-w-4xl mx-auto">
							{leaders.map((leader) => (
								<div key={leader.name} className="flex flex-col sm:flex-row items-start gap-6">
									<Avatar className="w-24 h-24">
										<AvatarImage src={leader.image} alt={leader.name} />
										<AvatarFallback>
											{leader.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<h3 className="text-xl font-semibold">{leader.name}</h3>
										<p className="text-primary font-medium">{leader.role}</p>
										<p className="mt-2 text-muted-foreground">{leader.bio}</p>
										<Link href={leader.linkedin} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block">
											<Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
										</Link>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-20 md:py-32">
					<div className="container mx-auto px-4 text-center">
						<Briefcase className="w-12 h-12 mx-auto text-primary" />
						<h2 className="text-3xl font-bold tracking-tight mt-6">Want to Join Us?</h2>
						<p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">We&apos;re always looking for passionate people to help us build the future of local commerce. Explore our open roles.</p>
						<Button asChild size="lg" className="mt-8">
							<Link href="/careers">View Open Positions</Link>
						</Button>
					</div>
				</section>
			</div>
		</>
	);
}
