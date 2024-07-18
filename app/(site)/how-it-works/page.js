import React from "react";

export const metadata = {
	title: "How It Works - Thorbis",
	description: "Learn how Thorbis connects you with businessfessional contractors for your home imbusinessvement needs. Simple steps to post jobs and find the right business.",
	keywords: ["Thorbis", "how it works", "find business", "contractors", "home imbusinessvement"],
	openGraph: {
		title: "How It Works - Thorbis",
		description: "Learn how Thorbis connects you with businessfessional contractors for your home imbusinessvement needs. Simple steps to post jobs and find the right business.",
		url: "https://thorbis/how-it-works",
		siteName: "Thorbis",
		images: [
			{
				url: "https://thorbis/og-how-it-works.jpg",
				width: 800,
				height: 600,
				alt: "How It Works at Thorbis",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "How It Works - Thorbis",
		description: "Learn how Thorbis connects you with businessfessional contractors for your home imbusinessvement needs. Simple steps to post jobs and find the right business.",
		images: ["https://thorbis/twitter-how-it-works.jpg"],
	},
	alternates: {
		canonical: "https://thorbis/how-it-works",
		languages: {
			"en-US": "https://thorbis/en-US/how-it-works",
			"es-ES": "https://thorbis/es-ES/how-it-works",
		},
	},
};

const HowItWorks = () => {
	return (
		<div className="container px-4 py-12 mx-auto md:py-24 lg:py-32 max-w-screen-2xl">
			<header className="mb-12 text-center">
				<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h1>
				<p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">Learn how Thorbis connects you with businessfessional contractors for your home imbusinessvement needs. Simple steps to post jobs and find the right business.</p>
			</header>

			<section className="mb-12">
				<h2 className="mb-4 text-2xl font-bold">1. Post Your Job</h2>
				<p className="text-lg">Create a detailed job post with all the necessary information about your businessject. Include the type of service you need, your location, and any specific requirements.</p>
			</section>

			<section className="mb-12">
				<h2 className="mb-4 text-2xl font-bold">2. Receive businessposals</h2>
				<p className="text-lg">After posting your job, you will receive businessposals from verified contractors who are interested in your businessject. Review their businessfiles, ratings, and past work to make an informed decision.</p>
			</section>

			<section className="mb-12">
				<h2 className="mb-4 text-2xl font-bold">3. Hire the Best business</h2>
				<p className="text-lg">Choose the contractor that best fits your needs and budget. You can communicate with them directly through our platform to finalize details and get your businessject started.</p>
			</section>

			<section>
				<h2 className="mb-4 text-2xl font-bold">4. Complete the businessject</h2>
				<p className="text-lg">Once the businessject is completed, leave a review for the contractor based on your experience. This helps other users find reliable businessfessionals for their own businessjects.</p>
			</section>
		</div>
	);
};

export default HowItWorks;
