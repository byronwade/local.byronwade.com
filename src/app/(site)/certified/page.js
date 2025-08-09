import React from "react";
import Link from "next/link";
import BusinessCard from "@components/site/home/business-card";
import ScrollSection from "@components/site/home/scroll-section";
import { Card } from "@components/ui/card";

export const metadata = {
	title: "Thorbis Certified Businesses – Elite Directory | Thorbis",
	description: "Discover Thorbis Certified businesses recognized for verified excellence. Explore the elite directory of trusted providers across industries.",
	keywords: ["thorbis certified", "certified businesses", "elite directory", "verified excellence", "trusted providers"],
	openGraph: {
		title: "Thorbis Certified Businesses – Elite Directory",
		description: "Explore the elite directory of Thorbis Certified businesses with verified excellence.",
		url: "https://thorbis.com/certified",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Thorbis Certified Businesses – Elite Directory",
		description: "Explore trusted providers recognized for verified excellence.",
	},
	alternates: { canonical: "https://thorbis.com/certified" },
};

const businesses = [
	{
		id: "business-1",
		name: "Kautzer - Bergstrom",
		logo: "https://avatars.githubusercontent.com/u/40980938",
		image: "https://images.unsplash.com/photo-1649959738550-ad6254b9bb7e?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		tags: ["Movies", "Home"],
		description: "Thesis audio ter amaritudo cogito coadunatio comminor votum depereo.",
		status: "Closed",
		price: "$$$",
		rating: 4.9,
		additionalInfo: "Viriliter triumphus ars usque neque vir accusamus non.",
	},
	{
		id: "business-2",
		name: "Kautzer - Bergstrom",
		logo: "https://avatars.githubusercontent.com/u/40980938",
		image: "https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/2783f5d2-7982-4b45-a0dd-ad3c8ca2d512.jpg",
		tags: ["Movies", "Home"],
		description: "Thesis audio ter amaritudo cogito coadunatio comminor votum depereo.",
		status: "Closed",
		price: "$$$",
		rating: 4.9,
		additionalInfo: "Viriliter triumphus ars usque neque vir accusamus non.",
	},
	{
		id: "business-3",
		name: "Kautzer - Bergstrom",
		logo: "https://avatars.githubusercontent.com/u/40980938",
		image: "https://images.unsplash.com/photo-1466779561253-0a08336ba2ab?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		tags: ["Movies", "Home"],
		description: "Thesis audio ter amaritudo cogito coadunatio comminor votum depereo.",
		status: "Closed",
		price: "$$$",
		rating: 4.9,
		additionalInfo: "Viriliter triumphus ars usque neque vir accusamus non.",
	},
	{
		id: "business-4",
		name: "Kautzer - Bergstrom",
		logo: "https://avatars.githubusercontent.com/u/40980938",
		image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=3320&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		tags: ["Movies", "Home"],
		description: "Thesis audio ter amaritudo cogito coadunatio comminor votum depereo.",
		status: "Closed",
		price: "$$$",
		rating: 4.9,
		additionalInfo: "Viriliter triumphus ars usque neque vir accusamus non.",
	},
	{
		id: "business-5",
		name: "Kautzer - Bergstrom",
		logo: "https://avatars.githubusercontent.com/u/40980938",
		image: "https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/8375fd42-5936-430c-96bd-e31f2778593b.jpg",
		tags: ["Movies", "Home"],
		description: "Thesis audio ter amaritudo cogito coadunatio comminor votum depereo.",
		status: "Closed",
		price: "$$$",
		rating: 4.9,
		additionalInfo: "Viriliter triumphus ars usque neque vir accusamus non.",
	},
	{
		id: "business-6",
		name: "Kautzer - Bergstrom",
		logo: "https://avatars.githubusercontent.com/u/40980938",
		image: "https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/8375fd42-5936-430c-96bd-e31f2778593b.jpg",
		tags: ["Movies", "Home"],
		description: "Thesis audio ter amaritudo cogito coadunatio comminor votum depereo.",
		status: "Closed",
		price: "$$$",
		rating: 4.9,
		additionalInfo: "Viriliter triumphus ars usque neque vir accusamus non.",
	},
	{
		id: "business-7",
		name: "Kautzer - Bergstrom",
		logo: "https://avatars.githubusercontent.com/u/40980938",
		image: "https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/8375fd42-5936-430c-96bd-e31f2778593b.jpg",
		tags: ["Movies", "Home"],
		description: "Thesis audio ter amaritudo cogito coadunatio comminor votum depereo.",
		status: "Closed",
		price: "$$$",
		rating: 4.9,
		additionalInfo: "Viriliter triumphus ars usque neque vir accusamus non.",
	},
	{
		id: "business-8",
		name: "Kautzer - Bergstrom",
		logo: "https://avatars.githubusercontent.com/u/40980938",
		image: "https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/8375fd42-5936-430c-96bd-e31f2778593b.jpg",
		tags: ["Movies", "Home"],
		description: "Thesis audio ter amaritudo cogito coadunatio comminor votum depereo.",
		status: "Closed",
		price: "$$$",
		rating: 4.9,
		additionalInfo: "Viriliter triumphus ars usque neque vir accusamus non.",
	},
	{
		id: "business-8",
		name: "Kautzer - Bergstrom",
		logo: "https://avatars.githubusercontent.com/u/40980938",
		image: "https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/8375fd42-5936-430c-96bd-e31f2778593b.jpg",
		tags: ["Movies", "Home"],
		description: "Thesis audio ter amaritudo cogito coadunatio comminor votum depereo.",
		status: "Closed",
		price: "$$$",
		rating: 4.9,
		additionalInfo: "Viriliter triumphus ars usque neque vir accusamus non.",
	},
	{
		id: "business-8",
		name: "Kautzer - Bergstrom",
		logo: "https://avatars.githubusercontent.com/u/40980938",
		image: "https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/8375fd42-5936-430c-96bd-e31f2778593b.jpg",
		tags: ["Movies", "Home"],
		description: "Thesis audio ter amaritudo cogito coadunatio comminor votum depereo.",
		status: "Closed",
		price: "$$$",
		rating: 4.9,
		additionalInfo: "Viriliter triumphus ars usque neque vir accusamus non.",
	},
	{
		id: "business-8",
		name: "Kautzer - Bergstrom",
		logo: "https://avatars.githubusercontent.com/u/40980938",
		image: "https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/8375fd42-5936-430c-96bd-e31f2778593b.jpg",
		tags: ["Movies", "Home"],
		description: "Thesis audio ter amaritudo cogito coadunatio comminor votum depereo.",
		status: "Closed",
		price: "$$$",
		rating: 4.9,
		additionalInfo: "Viriliter triumphus ars usque neque vir accusamus non.",
	},
	{
		id: "business-8",
		name: "Kautzer - Bergstrom",
		logo: "https://avatars.githubusercontent.com/u/40980938",
		image: "https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/8375fd42-5936-430c-96bd-e31f2778593b.jpg",
		tags: ["Movies", "Home"],
		description: "Thesis audio ter amaritudo cogito coadunatio comminor votum depereo.",
		status: "Closed",
		price: "$$$",
		rating: 4.9,
		additionalInfo: "Viriliter triumphus ars usque neque vir accusamus non.",
	},
	{
		id: "business-8",
		name: "Kautzer - Bergstrom",
		logo: "https://avatars.githubusercontent.com/u/40980938",
		image: "https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/8375fd42-5936-430c-96bd-e31f2778593b.jpg",
		tags: ["Movies", "Home"],
		description: "Thesis audio ter amaritudo cogito coadunatio comminor votum depereo.",
		status: "Closed",
		price: "$$$",
		rating: 4.9,
		additionalInfo: "Viriliter triumphus ars usque neque vir accusamus non.",
	},
];

export default function Categories() {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "CollectionPage",
						name: "Thorbis Certified Businesses",
						description: "Elite directory of Thorbis Certified businesses recognized for verified excellence.",
						url: "https://thorbis.com/certified",
						breadcrumb: {
							"@type": "BreadcrumbList",
							itemListElement: [
								{ "@type": "ListItem", position: 1, name: "Home", item: "https://thorbis.com/" },
								{ "@type": "ListItem", position: 2, name: "Certified", item: "https://thorbis.com/certified" },
							],
						},
					}),
				}}
			/>
			<div className="my-12">
				<ScrollSection>
					<Link href="/">
						<Card variant="primary" className="flex items-center justify-center h-full text-2xl font-bold align-middle transition-transform duration-300 hover:scale-110 hover:z-10 hover:outline hover:outline-4 hover:outline-primary">
							Construction
						</Card>
					</Link>
					<Link href="/">
						<Card className="flex items-center justify-center h-full text-2xl font-bold align-middle transition-transform duration-300 hover:scale-110 hover:z-10 hover:outline hover:outline-4 hover:outline-primary">Welding</Card>
					</Link>
					<Link href="/">
						<Card className="flex items-center justify-center h-full text-2xl font-bold align-middle transition-transform duration-300 hover:scale-110 hover:z-10 hover:outline hover:outline-4 hover:outline-primary">Resturants</Card>
					</Link>
					<Link href="/">
						<Card className="flex items-center justify-center h-full text-2xl font-bold align-middle transition-transform duration-300 hover:scale-110 hover:z-10 hover:outline hover:outline-4 hover:outline-primary">Hair Salons</Card>
					</Link>
				</ScrollSection>
			</div>
			<div className="relative space-y-12">
				<ScrollSection title="Plumbers in San Francisco, CA" link="/">
					{businesses.map((business) => (
						<BusinessCard key={business.id} business={business} />
					))}
				</ScrollSection>

				<ScrollSection title="Plumbers in San Francisco, CA" link="/">
					{businesses.map((business) => (
						<BusinessCard key={business.id} business={business} />
					))}
				</ScrollSection>
				<ScrollSection title="Plumbers in San Francisco, CA" link="/">
					{businesses.map((business) => (
						<BusinessCard key={business.id} business={business} />
					))}
				</ScrollSection>
				<ScrollSection title="Plumbers in San Francisco, CA" link="/">
					{businesses.map((business) => (
						<BusinessCard key={business.id} business={business} />
					))}
				</ScrollSection>
				<ScrollSection title="Plumbers in San Francisco, CA" link="/">
					{businesses.map((business) => (
						<BusinessCard key={business.id} business={business} />
					))}
				</ScrollSection>
			</div>
		</>
	);
}

