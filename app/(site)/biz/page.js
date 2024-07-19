import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock } from "react-feather";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactCard } from "@/components/site/biz/layout/ContactCard";
import { QuickLinks } from "@/components/site/biz/layout/QuickLinks";
import { Photos } from "@/components/site/biz/layout/Photos";
import { Aside } from "@/components/site/biz/layout/Aside";
import { AboutUs } from "@/components/site/biz/layout/AboutUs";
import { Services } from "@/components/site/biz/layout/Services";
import { Blog } from "@/components/site/biz/layout/Blog";
import { FAQs } from "@/components/site/biz/layout/FAQs";
import { Careers } from "@/components/site/biz/layout/Careers";
import { Partnerships } from "@/components/site/biz/layout/Partnerships";
import PostFeed from "@/components/site/biz/layout/posts/PostFeed";
import { Badge } from "@/components/ui/badge";
import postsData from "./posts.json";
import ReviewsFeed from "@/components/site/biz/layout/ReviewsFeed";

// SEO metadata for the page
export const metadata = {
	title: "Acme Web Design - Professional Web Design Services",
	description: "Acme Web Design offers top-notch web design services. Explore our portfolio, learn about our services, and get in touch with us to transform your online presence.",
	keywords: ["web design", "professional web design", "Acme Web Design", "web development", "digital marketing"],
	openGraph: {
		title: "Acme Web Design - Professional Web Design Services",
		description: "Acme Web Design offers top-notch web design services. Explore our portfolio, learn about our services, and get in touch with us to transform your online presence.",
		url: "https://acmewebdesign.com",
		siteName: "Acme Web Design",
		images: [
			{
				url: "https://acmewebdesign.com/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Acme Web Design Logo",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Acme Web Design - Professional Web Design Services",
		description: "Acme Web Design offers top-notch web design services. Explore our portfolio, learn about our services, and get in touch with us to transform your online presence.",
		images: ["https://acmewebdesign.com/twitter-image.jpg"],
	},
	alternates: {
		canonical: "https://acmewebdesign.com",
		languages: {
			"en-US": "https://acmewebdesign.com/en-US",
			"es-ES": "https://acmewebdesign.com/es-ES",
		},
	},
};

export default function BizProfile() {
	return (
		<>
			<div className="flex flex-col min-h-[100dvh]">
				<header className="relative py-8 text-primary-foreground md:py-20">
					<Image src="/placeholder.svg" alt="Background Image" width={1920} height={1020} className="absolute inset-0 object-cover w-full h-full -z-10" />
					<div className="container relative z-10 px-4 md:px-6">
						<div className="grid gap-4 md:grid-cols-[1fr_300px] md:gap-8">
							<div>
								<h1 className="text-3xl font-bold md:text-4xl">Acme Web Design</h1>
								<div className="flex items-center gap-2 text-sm md:text-base">
									<MapPin className="w-5 h-5" />
									<span>123 Main St, Anytown USA</span>
								</div>
								<div className="flex items-center gap-2 text-sm md:text-base">
									<Clock className="w-5 h-5" />
									<span>Mon-Fri: 9am - 5pm, Sat-Sun: Closed</span>
								</div>
								<div className="flex items-center gap-4">
									<Link href="#" className="text-muted-background hover:text-background" prefetch={false}>
										Facebook
									</Link>
									<Link href="#" className="text-muted-background hover:text-background" prefetch={false}>
										Twitter
									</Link>
									<Link href="#" className="text-muted-background hover:text-background" prefetch={false}>
										Instagram
									</Link>
									<Link href="#" className="text-muted-background hover:text-background" prefetch={false}>
										LinkedIn
									</Link>
								</div>
								<QuickLinks />
							</div>
							<ContactCard />
						</div>
					</div>
				</header>
				<div className="container flex flex-1 px-4 py-8 md:px-6 md:py-12">
					<main className="flex-1">
						<Tabs defaultValue="home" className="w-auto">
							<TabsList className="relative flex gap-2">
								<div className="relative">
									<TabsTrigger value="home">Home</TabsTrigger>
									<Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand text-white text-[9px] py-[1px] whitespace-nowrap">Beta</Badge>
								</div>
								<div className="relative">
									<TabsTrigger value="about-us">About Us</TabsTrigger>
								</div>
								<div className="relative">
									<TabsTrigger value="services">Services</TabsTrigger>
								</div>
								<div className="relative">
									<TabsTrigger value="reviews">Reviews</TabsTrigger>
									<Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand text-white text-[9px] py-[1px] whitespace-nowrap">Beta</Badge>
								</div>
								<div className="relative">
									<TabsTrigger value="photos">Photos</TabsTrigger>
								</div>
								<div className="relative">
									<TabsTrigger value="blog">Blog</TabsTrigger>
								</div>
								<div className="relative">
									<TabsTrigger value="faqs">FAQs</TabsTrigger>
								</div>
								<div className="relative">
									<TabsTrigger value="careers">Careers</TabsTrigger>
									<Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand text-white text-[9px] py-[1px] whitespace-nowrap">Coming Soon</Badge>
								</div>
								<div className="relative">
									<TabsTrigger value="partnerships">Partnerships</TabsTrigger>
									<Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand text-white text-[9px] py-[1px] whitespace-nowrap">Coming Soon</Badge>
								</div>
							</TabsList>
							<TabsContent value="home">
								<PostFeed posts={postsData} />
							</TabsContent>
							<TabsContent value="about-us">
								<AboutUs />
							</TabsContent>
							<TabsContent value="services">
								<Services />
							</TabsContent>
							<TabsContent value="reviews">
								<ReviewsFeed posts={postsData} />
							</TabsContent>
							<TabsContent value="photos">
								<Photos />
							</TabsContent>
							<TabsContent value="blog">
								<Blog />
							</TabsContent>
							<TabsContent value="faqs">
								<FAQs />
							</TabsContent>
							<TabsContent value="careers">
								<Careers />
							</TabsContent>
							<TabsContent value="partnerships">
								<Partnerships />
							</TabsContent>
						</Tabs>
					</main>
					<Aside />
				</div>
				<footer className="py-6 bg-muted md:py-8">
					<div className="container flex items-center justify-between px-4 md:px-6">
						<div className="text-sm text-muted-foreground">&copy; 2024 Acme Web Design. All rights reserved.</div>
						<nav className="flex items-center gap-4 md:gap-6">
							<Link href="#" className="text-sm hover:underline" prefetch={false}>
								Terms of Service
							</Link>
							<Link href="#" className="text-sm hover:underline" prefetch={false}>
								Privacy Policy
							</Link>
						</nav>
					</div>
				</footer>
			</div>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
		</>
	);
}

const jsonLdData = {
	"@context": "http://schema.org",
	"@type": "WebSite",
	url: "https://acmewebdesign.com",
	name: "Acme Web Design",
	description: "Acme Web Design offers top-notch web design services. Explore our portfolio, learn about our services, and get in touch with us to transform your online presence.",
	sameAs: ["https://www.facebook.com/AcmeWebDesign", "https://twitter.com/AcmeWebDesign", "https://www.instagram.com/AcmeWebDesign", "https://www.linkedin.com/company/acme-web-design"],
};
