export async function generateMetadata() {
	const metadata = {
		title: "Thorbis Certified – Elite Business Certification Program",
		description: "Join the most selective business certification program. 12-stage evaluation, 400+ interviews, performance guarantee, and priority placement.",
		keywords: ["business certification", "elite certification", "thorbis certified", "customer interviews", "performance guarantee"],
		openGraph: {
			title: "Thorbis Certified – Elite Business Certification",
			description: "12-stage evaluation, 400+ customer interviews, and performance guarantee.",
			url: "https://thorbis.com/business-certification",
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: "Thorbis Certified – Elite Business Certification",
			description: "The most selective certification for service excellence.",
		},
		alternates: { canonical: "https://thorbis.com/business-certification" },
	};
	return metadata;
}

import BusinessCertificationContent from "@components/site/certification/BusinessCertificationContent";
import { isEnabled } from "@lib/flags/server";

export default async function BusinessCertificationPage() {
	const on = await isEnabled("businessCertification");
	if (!on) {
		return (
			<div className="container px-4 py-16 mx-auto">
				<h1 className="text-2xl font-semibold">Business Certification is not available</h1>
				<p className="mt-2 text-muted-foreground">Please check back soon.</p>
			</div>
		);
	}
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Thorbis Certified",
		description: "Elite certification program with a rigorous 12-stage evaluation",
		url: "https://thorbis.com/business-certification",
		mainEntity: {
			"@type": "HowTo",
			name: "12-Stage Certification Process",
			step: Array.from({ length: 12 }, (_, i) => ({
				"@type": "HowToStep",
				position: i + 1,
				name: `Stage ${i + 1}`,
			})),
		},
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "Home", item: "https://thorbis.com/" },
				{ "@type": "ListItem", position: 2, name: "Business Certification", item: "https://thorbis.com/business-certification" },
			],
		},
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<BusinessCertificationContent />
		</>
	);
}
