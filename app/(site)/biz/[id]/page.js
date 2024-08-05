import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock } from "react-feather";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { ContactCard } from "@components/site/biz/layout/ContactCard";
import { QuickLinks } from "@components/site/biz/layout/QuickLinks";
import { Photos } from "@components/site/biz/layout/Photos";
import { Aside } from "@components/site/biz/layout/Aside";
import { AboutUs } from "@components/site/biz/layout/AboutUs";
import { Services } from "@components/site/biz/layout/Services";
import { Blog } from "@components/site/biz/layout/Blog";
import { FAQs } from "@components/site/biz/layout/FAQs";
import { Careers } from "@components/site/biz/layout/Careers";
import { Partnerships } from "@components/site/biz/layout/Partnerships";
import PostFeed from "@components/site/biz/layout/posts/PostFeed";
import { Badge } from "@components/ui/badge";
import postsData from "./posts.json";
import ReviewsFeed from "@components/site/biz/layout/ReviewsFeed";

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

export default function BizProfile({ params }) {
	console.log(params);
	return (
		<>
			<header className="relative h-[60vh] text-primary-foreground">
				<div className="absolute inset-0 z-10 bg-gradient-to-t from-background to-transparent" />
				<div className="absolute inset-0 z-10 bg-gradient-to-r from-background to-transparent" />
				<Image src="https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/2783f5d2-7982-4b45-a0dd-ad3c8ca2d512.jpg" alt="Background Image" width={1920} height={1020} className="absolute inset-0 object-cover w-full h-full -z-10" />
				<div className="relative z-20 flex flex-row items-center justify-between h-full px-6 space-y-4 sm:px-12 lg:px-24">
					<div className="max-w-lg">
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
			</header>
			<div className="flex flex-1 p-2 px-4 py-24 pl-8 mx-auto sm:px-12 lg:px-24">
				<main className="flex-1">
					<Tabs defaultValue="home" className="w-auto">
						<TabsList className="relative flex gap-2 mb-4 border bg-card border-border">
							<div className="relative">
								<TabsTrigger value="home">Home</TabsTrigger>
								<Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-500 text-white text-[9px] py-[1px] whitespace-nowrap">Beta</Badge>
							</div>
							<div className="relative">
								<TabsTrigger value="about-us">About Us</TabsTrigger>
							</div>
							<div className="relative">
								<TabsTrigger value="services">Services</TabsTrigger>
							</div>
							<div className="relative">
								<TabsTrigger value="reviews">Reviews</TabsTrigger>
								<Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-500 text-white text-[9px] py-[1px] whitespace-nowrap">Beta</Badge>
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
								<Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[9px] py-[1px] whitespace-nowrap">Coming Soon</Badge>
							</div>
							<div className="relative">
								<TabsTrigger value="partnerships">Partnerships</TabsTrigger>
								<Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[9px] py-[1px] whitespace-nowrap">Coming Soon</Badge>
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
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
		</>
	);
}

const jsonLdData = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: "Acme Web Design",
	url: "https://acmewebdesign.com",
	logo: "https://acmewebdesign.com/logo.png",
	contactPoint: {
		"@type": "ContactPoint",
		telephone: "+1-800-123-4567",
		contactType: "Customer Service",
	},
	address: {
		"@type": "PostalAddress",
		streetAddress: "123 Main St",
		addressLocality: "Anytown",
		addressRegion: "USA",
		postalCode: "12345",
	},
	sameAs: ["https://www.facebook.com/acmewebdesign", "https://twitter.com/acmewebdesign", "https://www.instagram.com/acmewebdesign", "https://www.linkedin.com/company/acmewebdesign"],
};
