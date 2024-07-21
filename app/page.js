import Image from "next/image";
import { Button } from "@/components/ui/button";
import Header from "@/components/site/Header";
import SearchBarOnly from "@/components/shared/searchBox/SearchBarOnly";

const testimonials = [
	{
		name: "Cyrus Shepard",
		handle: "@cyrusshepard",
		image: "/placeholder.svg",
		tweet: `Using GA4 + simultaneously testing several "simpler" alternatives. 100% favorite so far is Plausible.
	  Not free/not a ton of bells and whistles, but SOOOO easy to use (for clients too) and the data is near real-time. Good solution for ~70% of websites that have trouble with GA4.`,
		link: "https://twitter.com/cyrusshepard/status/1714380470862131344",
	},
	{
		name: "Prezly",
		handle: "@Prezly",
		image: "/placeholder.svg",
		tweet: `We are super excited to announce that Prezly now has analytics! Thanks to Plausible, our users can access simple, privacy-minded, and lightweight data right from the dashboard.`,
		link: "https://twitter.com/Prezly/status/1566772185712267266",
	},
	{
		name: "Rob Hope",
		handle: "@robhope",
		image: "/placeholder.svg",
		tweet: `Just replaced my full network's Google Analytics with Plausible - I can't remember when last I was this impressed by a SaaS UX + design 💯
	  Became a paying customer within 1hr of the 30-day trial.`,
		link: "https://twitter.com/robhope/status/1351465826109558784",
	},
	{
		name: "DHH",
		handle: "@dhh",
		image: "/placeholder.svg",
		tweet: `Been a very happy customer of Plausible at Basecamp. Wonderful to see domains like web stats that were once a wasteland due to monopoly weight spring new, better options ❤️`,
		link: "https://twitter.com/dhh/status/1438785402576506884",
	},
	{
		name: "Laura Roeder",
		handle: "@lkr",
		image: "/placeholder.svg",
		tweet: `I've been super happy with Plausible. All the conversion tracking we need, it has every report we use.`,
		link: "https://x.com/lkr/status/1792637010567385355",
	},
	{
		name: "John O'Nolan",
		handle: "@JohnONolan",
		image: "/placeholder.svg",
		tweet: `Check out Plausible if you haven't yet — fantastic product, $190/mo for 5M views, or less when paid annually. We switched over everything from GA.`,
		link: "https://twitter.com/JohnONolan/status/1488921946062569480",
	},
];

const stats = [
	{ title: "Paying subscribers", value: "12k" },
	{ title: "Active websites", value: "229k" },
	{ title: "Tracked pageviews", value: "73B" },
];

export const metadata = {
	title: "Thorbis - Discover and Review Local Services",
	description: "Thorbis connects customers with local professional services effortlessly. Post your job and get connected with the right professionals. Read reviews and find the best local businesses.",
	keywords: ["Thorbis", "professional services", "find professionals", "contractors", "home improvement", "local businesses", "reviews"],
	openGraph: {
		title: "Thorbis - Discover and Review Local Services",
		description: "Thorbis connects customers with local professional services effortlessly. Post your job and get connected with the right professionals. Read reviews and find the best local businesses.",
		url: "https://www.thorbis.com",
		siteName: "Thorbis",
		images: [
			{
				url: "https://www.thorbis.com/og-image.jpg",
				width: 800,
				height: 600,
				alt: "Thorbis Logo",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Thorbis - Discover and Review Local Services",
		description: "Thorbis connects customers with local professional services effortlessly. Post your job and get connected with the right professionals. Read reviews and find the best local businesses.",
		images: ["https://www.thorbis.com/twitter-image.jpg"],
		creator: "@thorbis",
	},
	alternates: {
		canonical: "https://www.thorbis.com",
		languages: {
			"en-US": "https://www.thorbis.com/en-US",
			"es-ES": "https://www.thorbis.com/es-ES",
		},
	},
	robots: "index, follow",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	category: "directory",
	bookmarks: ["https://www.thorbis.com/"],
	generator: "Next.js",
	applicationName: "Thorbis",
	authors: [{ name: "Byron Wade", url: "https://www.thorbis.com/" }],
	creator: "Byron Wade",
	publisher: "Byron Wade",
	ogLocale: "en_US",
};

export default function Home() {
	return (
		<>
			<Header />
			<main>
				<div className="h-screen">
					<div className="relative mb-4 flex items-center justify-center py-[26vh] pt-[18vh] text-gray-900 dark:text-gray-200 sm:pt-[26vh]">
						<div className="relative flex flex-col items-center w-full gap-6 px-6 text-center">
							<div className="flex w-full flex-col items-center gap-1.5">
								<h2 className="mb-4 text-4xl font-semibold tracking-tighter sm:text-5xl [@media(max-width:480px)]:text-[2rem]">Caring for your home, made easy.</h2>
								<p>
									Discover local professional services with Thorbis. <br className="sm:hidden" /> Read reviews and find the best local businesses.
								</p>
							</div>
							<div className="w-full m-auto sm:max-w-xl">
								<SearchBarOnly showLocationButton={true} showAiButton={true} />
							</div>
							<div className="absolute flex flex-wrap items-center justify-center max-w-full gap-2 px-4 mx-auto mt-6 text-sm top-full whitespace-nowrap">
								<Button variant="outline">
									Plumbing
									<svg className="ml-2" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
									</svg>
								</Button>
								<Button variant="outline">
									Web Design
									<svg className="ml-2" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
									</svg>
								</Button>
								<Button variant="outline">
									Home Cleaning
									<svg className="ml-2" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
									</svg>
								</Button>
								<Button variant="outline">
									Google
									<svg className="ml-2" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
									</svg>
								</Button>
							</div>
						</div>
					</div>
				</div>
				<div className="py-24 text-black bg-white">
					<div className="container mx-auto">
						<h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl">People ❤️ Thorbis</h2>
						<p className="max-w-3xl mx-auto mt-3 text-xl text-center text-gray-500 sm:mt-4">Thorbis is built for scale and can serve sites with hundreds of millions of monthly visitors. Thousands of sites, startups, and some of the world&apos;s leading brands have already made the switch from other services.</p>
						<div className="pb-12 mt-10 bg-white sm:pb-16">
							<div className="relative w-full">
								<div className="mx-auto">
									<dl className="bg-white rounded-lg sm:grid sm:grid-cols-3">
										{stats.map((stat, index) => (
											<div key={index} className={`flex flex-col p-6 text-center ${index !== stats.length - 1 ? "border-b border-gray-100 sm:border-0 sm:border-r" : ""}`}>
												<dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">{stat.title}</dt>
												<dd className="order-1 text-5xl font-extrabold text-indigo-600">{stat.value}</dd>
											</div>
										))}
									</dl>
								</div>
							</div>
						</div>
						<div className="grid-cols-3 gap-4 md:grid">
							{testimonials.map((testimonial, index) => (
								<div key={index} className="my-4 md:m-0">
									<div className="p-4 border border-gray-100 rounded-lg">
										<div className="flex items-center">
											<a className="flex items-center group" href={testimonial.link} target="_blank" rel="noopener noreferrer">
												<Image className="w-10 rounded-full" src={testimonial.image} alt={testimonial.name} width={40} height={40} />
												<div className="ml-2 leading-tight">
													<div className="font-bold group-hover:text-blue-500">{testimonial.name}</div>
													<div className="text-xs text-gray-500">{testimonial.handle}</div>
												</div>
											</a>
											<a className="ml-auto twitter-icon" href={testimonial.link} target="_blank" rel="noopener noreferrer" />
										</div>
										<div className="mt-2 text-sm whitespace-pre-wrap cursor-text tweet-text">{testimonial.tweet}</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
			</main>
		</>
	);
}

const jsonLdData = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	url: "https://www.thorbis.com",
	name: "Thorbis",
	description: "Thorbis connects customers with local professional services effortlessly. Post your job and get connected with the right professionals. Read reviews and find the best local businesses.",
	publisher: {
		"@type": "Organization",
		name: "Thorbis",
		logo: {
			"@type": "ImageObject",
			url: "https://www.thorbis.com/logo.png",
		},
	},
	potentialAction: {
		"@type": "SearchAction",
		target: "https://www.thorbis.com/search?q={search_term_string}",
		"query-input": "required name=search_term_string",
	},
	sameAs: ["https://www.facebook.com/thorbis", "https://www.instagram.com/thorbis/?hl=en"],
	logo: "https://www.thorbis.com/logo.png",
	image: "https://www.thorbis.com/og-image.jpg",
};
