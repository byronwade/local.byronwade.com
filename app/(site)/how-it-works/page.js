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
		<section className="py-10 bg-white sm:py-16 lg:py-24">
			<div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="max-w-2xl mx-auto text-center">
					<h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">How does it work?</h2>
					<p className="max-w-lg mx-auto mt-4 text-base leading-relaxed text-gray-600">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis.</p>
				</div>

				<div className="relative mt-12 lg:mt-20">
					<div className="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
						<img className="w-full" src="https://cdn.rareblocks.xyz/collection/celebration/images/steps/2/curved-dotted-line.svg" alt="" />
					</div>

					<div className="relative grid grid-cols-1 text-center gap-y-12 md:grid-cols-3 gap-x-12">
						<div>
							<div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
								<span className="text-xl font-semibold text-gray-700"> 1 </span>
							</div>
							<h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">Create a free account</h3>
							<p className="mt-4 text-base text-gray-600">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</p>
						</div>

						<div>
							<div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
								<span className="text-xl font-semibold text-gray-700"> 2 </span>
							</div>
							<h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">Build your website</h3>
							<p className="mt-4 text-base text-gray-600">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</p>
						</div>

						<div>
							<div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
								<span className="text-xl font-semibold text-gray-700"> 3 </span>
							</div>
							<h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">Release & Launch</h3>
							<p className="mt-4 text-base text-gray-600">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HowItWorks;
