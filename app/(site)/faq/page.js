import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
	{
		question: "What is Thorbis?",
		answer: "Thorbis is a platform that connects people with great local businesses. You can use it to find everything from plumbers to restaurants, read reviews from your community, and share your own experiences.",
	},
	{
		question: "Is Thorbis free to use?",
		answer: "Yes, Thorbis is completely free for consumers. You can search for businesses, read reviews, and write your own reviews without any cost.",
	},
	{
		question: "How do I write a review?",
		answer: "To write a review, simply find the business page for the company you want to review and click the 'Write a Review' button. You'll need to be logged in to your Thorbis account.",
	},
	{
		question: "Can businesses pay to remove bad reviews?",
		answer: "No. Businesses cannot pay to have reviews removed or altered. We believe in transparency and authenticity, which is why all reviews—both positive and negative—are published. However, reviews that violate our content guidelines may be removed.",
	},
	{
		question: "How do I claim my business page?",
		answer: "If you're a business owner, you can claim your page by finding it on Thorbis and clicking the 'Claim This Business' button. You'll need to verify your ownership, which gives you access to tools to respond to reviews and update your business information.",
	},
];

export const metadata = {
	title: "Frequently Asked Questions (FAQ) - Get Help with Thorbis",
	description: "Find answers to common questions about Thorbis. Learn how to write reviews, claim your business, use our platform, and more. Get help quickly.",
	keywords: ["FAQ", "frequently asked questions", "help", "thorbis questions", "how to use thorbis", "business reviews"],
	openGraph: {
		title: "Frequently Asked Questions (FAQ) - Get Help with Thorbis",
		description: "Find answers to common questions about Thorbis. Learn how to write reviews, claim your business, use our platform, and more. Get help quickly.",
		url: "https://local.byronwade.com/faq",
		siteName: "Thorbis",
		images: [
			{
				url: "https://local.byronwade.com/og-faq.jpg",
				width: 1200,
				height: 630,
				alt: "Thorbis FAQ",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "FAQ - Thorbis Help",
		description: "Find answers to common questions about using Thorbis platform.",
		images: ["https://local.byronwade.com/og-faq.jpg"],
	},
	alternates: {
		canonical: "https://local.byronwade.com/faq",
	},
};

export default function FaqPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		name: "Frequently Asked Questions",
		description: "Common questions and answers about using Thorbis platform",
		url: "https://local.byronwade.com/faq",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer,
			},
		})),
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					item: {
						"@id": "https://local.byronwade.com",
						name: "Thorbis",
					},
				},
				{
					"@type": "ListItem",
					position: 2,
					item: {
						"@id": "https://local.byronwade.com/faq",
						name: "FAQ",
					},
				},
			],
		},
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-4xl mx-auto">
						<div className="text-center mb-16">
							<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Frequently Asked Questions</h1>
							<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">Have questions? We have answers.</p>
						</div>

						<Accordion type="single" collapsible className="w-full">
							{faqs.map((faq, index) => (
								<AccordionItem key={index} value={`item-${index}`}>
									<AccordionTrigger className="text-lg font-semibold">{faq.question}</AccordionTrigger>
									<AccordionContent className="text-base text-muted-foreground">{faq.answer}</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				</div>
			</div>
		</>
	);
}
