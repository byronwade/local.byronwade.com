import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
	title: "Business Success Stories",
	description: "See how businesses like yours are thriving with our platform.",
};

const successStories = [
	{
		company: "Springfield Bakery",
		owner: "Jane Doe",
		quote: "Claiming our Thorbis page was a game-changer. We saw a 30% increase in customer calls within the first month and our online visibility has never been better.",
		image: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?q=80&w=2070&auto=format&fit=crop",
		link: "#",
	},
	{
		company: "Innovate Auto Repair",
		owner: "John Smith",
		quote: "The advertising tools are incredibly effective. We can target local customers who need our services, and the ROI has been fantastic.",
		image: "https://images.unsplash.com/photo-1548695604-94ab04a5441a?q=80&w=1974&auto=format&fit=crop",
		link: "#",
	},
];

export default function BusinessSuccessStoriesPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: metadata.title,
		description: metadata.description,
		url: "https://local.byronwade.com/business-success-stories",
		isPartOf: {
			"@type": "WebSite",
			name: "Inbox Zero",
			url: "https://local.byronwade.com",
		},
		mainEntity: {
			"@type": "ItemList",
			name: "Success Stories",
			itemListElement: successStories.map((story, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "Article",
					headline: story.company,
					author: {
						"@type": "Person",
						name: story.owner,
					},
					publisher: {
						"@type": "Organization",
						name: "Inbox Zero",
					},
					description: story.quote,
					image: story.image,
					url: `https://local.byronwade.com/business-success-stories${story.link}`,
				},
			})),
		},
	};
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				{/* Hero Section */}
				<div className="bg-muted">
					<div className="py-24 px-4 lg:px-24 max-w-5xl mx-auto text-center">
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Success Stories</h1>
						<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">See how businesses like yours are thriving with Thorbis.</p>
					</div>
				</div>

				{/* Stories Section */}
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-5xl mx-auto space-y-16">
						{successStories.map((story, index) => (
							<Card key={story.company} className="overflow-hidden">
								<div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${index % 2 !== 0 ? "md:grid-flow-col-dense" : ""}`}>
									<div className={`relative h-80 ${index % 2 !== 0 ? "md:order-last" : ""}`}>
										<Image src={story.image} alt={story.company} layout="fill" objectFit="cover" />
									</div>
									<div className="p-8">
										<p className="text-2xl font-serif italic mb-4">&quot;{story.quote}&quot;</p>
										<p className="font-semibold">
											{story.owner}, Owner of {story.company}
										</p>
										<Link href={story.link} className="text-primary hover:underline mt-4 inline-block">
											Read the full story
										</Link>
									</div>
								</div>
							</Card>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
