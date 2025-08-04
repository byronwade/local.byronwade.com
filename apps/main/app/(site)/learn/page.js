import { Suspense } from "react";
import LearnClient from "./LearnClient";

export const metadata = {
	title: "Business Learning Academy - Online Courses & Training | Thorbis",
	description: "Learn business skills with expert-led online courses. From marketing to operations, develop the knowledge you need to grow your business successfully.",
	keywords: ["business courses", "online training", "business skills", "marketing courses", "entrepreneurship", "business education"],
	openGraph: {
		title: "Business Learning Academy - Online Courses & Training | Thorbis",
		description: "Learn business skills with expert-led online courses. From marketing to operations, develop the knowledge you need to grow your business successfully.",
		url: "https://local.byronwade.com/learn",
		siteName: "Thorbis",
		images: [
			{
				url: "https://local.byronwade.com/og-learn.jpg",
				width: 1200,
				height: 630,
				alt: "Business Learning Academy",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Business Learning Academy - Online Courses & Training | Thorbis",
		description: "Learn business skills with expert-led online courses. From marketing to operations, develop the knowledge you need to grow your business successfully.",
		images: ["https://local.byronwade.com/og-learn.jpg"],
		creator: "@thorbis",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	alternates: {
		canonical: "https://local.byronwade.com/learn",
	},
};

// JSON-LD structured data
const jsonLd = {
	"@context": "https://schema.org",
	"@type": "WebPage",
	name: "Business Learning Academy",
	description: "Online business courses and training platform",
	url: "https://local.byronwade.com/learn",
	mainEntity: {
		"@type": "EducationalOrganization",
		name: "Thorbis Business Academy",
		description: "Expert-led courses for business growth and development",
		offers: {
			"@type": "Course",
			name: "Business Development Courses",
			description: "Comprehensive business training programs",
		},
	},
	breadcrumb: {
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: "https://local.byronwade.com",
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Learn",
				item: "https://local.byronwade.com/learn",
			},
		],
	},
};

function LearnLoadingSkeleton() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<div className="animate-pulse">
				<div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
				<div className="container px-4 py-8 mx-auto">
					<div className="flex flex-col gap-8 lg:flex-row">
						<div className="w-full lg:w-1/4">
							<div className="space-y-4">
								{[...Array(6)].map((_, i) => (
									<div key={i} className="h-10 bg-gray-200 rounded dark:bg-gray-700"></div>
								))}
							</div>
						</div>
						<div className="flex-1">
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
								{[...Array(6)].map((_, i) => (
									<div key={i} className="h-64 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function LearnPage() {
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<Suspense fallback={<LearnLoadingSkeleton />}>
				<LearnClient />
			</Suspense>
		</>
	);
}
