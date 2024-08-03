import Image from "next/image";
import { Button } from "@components/ui/button";
import Header from "@components/site/Header";
import Footer from "@components/site/Footer";
import SearchBarOnly from "@components/shared/searchBox/SearchBarOnly";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { ArrowRight, ChevronRight } from "react-feather";

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
];

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
		tweet: `Just replaced my full network&apos;s Google Analytics with Plausible - I can&apos;t remember when last I was this impressed by a SaaS UX + design 💯
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
		tweet: `I&apos;ve been super happy with Plausible. All the conversion tracking we need, it has every report we use.`,
		link: "https://x.com/lkr/status/1792637010567385355",
	},
	{
		name: "John O&apos;Nolan",
		handle: "@JohnONolan",
		image: "/placeholder.svg",
		tweet: `Check out Plausible if you haven&apos;t yet — fantastic product, $190/mo for 5M views, or less when paid annually. We switched over everything from GA.`,
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

export default function Home({ itemsPerPage = 4 }) {
	const gutter = 16;
	const itemWidth = `calc((100% - ${gutter}px * (${itemsPerPage} - 1)) / ${itemsPerPage})`;

	return (
		<>
			<Header />
			<main>
				<div className="relative w-full h-screen">
					<div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-black via-black/80 to-transparent" />
					{/* <img className="object-cover object-center w-full h-full" src="https://images.unsplash.com/photo-1466779561253-0a08336ba2ab?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Descendants: The Rise of Red" /> */}
					<video autoPlay muted loop className="object-cover object-center w-full h-full">
						<source src="/welding.mp4" type="video/mp4" />
					</video>
					<div className="absolute top-[20%] w-full">
						<div className="px-8">
							<h1 className="mb-4 text-3xl font-bold md:text-5xl">Find a welder</h1>
							<div className="space-x-4">
								<Button>Search</Button>
								<Button variant="outline">Post a company</Button>
							</div>
							<p className="mt-6 text-sm text-gray-400">Search for a welder out of 3000 companies</p>
							<p className="w-full text-gray-200 md:max-w-[70%] lg:max-w-[50%] xl:max-w-[35%] mt-1">After the Queen of Hearts incites a coup on Auradon, her rebellious daughter Red and Cinderella&apos;s perfectionist daughter Chloe join forces and travel ...</p>
						</div>
						<div className="w-full py-24 pl-8">
							<ScrollArea className="relative w-full group">
								<div className="flex flex-row space-x-8" style={{ "--itemsPerPage": itemsPerPage, "--gutter": `${gutter}px`, "--itemWidth": itemWidth }}>
									{businesses.map((business) => (
										<div key={business.id} id={business.id} className="relative flex items-center justify-center w-[var(--itemWidth)] flex-none">
											<div className="relative w-full overflow-hidden bg-black border rounded-md shadow">
												<img className="absolute top-0 left-0 z-0 object-cover object-center w-full h-full" src={business.image} alt={business.name} />
												<div className="absolute top-0 left-0 z-0 w-full h-full bg-gradient-to-r from-black via-black/80 to-transparent" />
												<div className="relative z-20 flex flex-row items-start gap-4 p-4">
													<div className="flex flex-col space-y-2">
														<img src={business.logo} alt={`${business.name} logo`} className="object-cover w-16 h-16 rounded-md" />
													</div>
													<div className="flex-1">
														<h3 className="mb-1 text-lg font-semibold leading-none tracking-tight">{business.name}</h3>
														<div className="flex flex-wrap items-center gap-2">
															{business.tags.map((tag, index) => (
																<div key={index} className="inline-flex items-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground border shadow px-[2px] py-0 text-[10px] font-bold">
																	{tag}
																</div>
															))}
														</div>
														<p className="mt-2 text-sm text-muted-foreground">{business.description}</p>
													</div>
													<div className="flex flex-col space-y-2">
														<Button className="inline-flex ring-offset-background focus-visible:ring-offset-2 bg-primary text-white hover:bg-primary-light w-10 items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
															<a target="_blank" type="button" href={`/biz/${business.id}`}>
																<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
																	<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
																	<polyline points="15 3 21 3 21 9" />
																	<line x1={10} y1={14} x2={21} y2={3} />
																</svg>
															</a>
														</Button>
														<Button variant="secondary" className="inline-flex ring-offset-background focus-visible:ring-offset-2 border border-input w-10 items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
															<a target="_blank" type="button" href={`/biz/${business.id}`}>
																<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
																	<circle cx={18} cy={5} r={3} />
																	<circle cx={6} cy={12} r={3} />
																	<circle cx={18} cy={19} r={3} />
																	<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
																	<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
																</svg>
															</a>
														</Button>
														<Button variant="secondary" className="inline-flex ring-offset-background focus-visible:ring-offset-2 border border-input w-10 items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
															<a target="_blank" type="button" href={`/biz/${business.id}`}>
																<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
																	<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
																</svg>
															</a>
														</Button>
													</div>
												</div>
												<div className="relative z-20 p-6 pt-0">
													<div className="flex flex-wrap text-sm text-muted-foreground">
														<div className="flex items-center mb-1 ml-1">
															<Button variant="secondary" className="ring-offset-background focus-visible:ring-offset-2 border border-input inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
																<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1 text-gray-400 fill-gray-400">
																	<circle cx={12} cy={12} r={10} />
																</svg>
																{business.status}
															</Button>
														</div>
														<div className="flex items-center mb-1 ml-1">
															<Button variant="secondary" className="ring-offset-background focus-visible:ring-offset-2 border border-input w-10 inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
																<p className="text-sm text-green-600">{business.price}</p>
															</Button>
														</div>
														<div className="flex items-center mb-1 ml-1">
															<Button variant="secondary" className="ring-offset-background focus-visible:ring-offset-2 border border-input inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
																<svg width={15} height={15} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1 text-yellow-500">
																	<path
																		d="M7.22303 0.665992C7.32551 0.419604 7.67454 0.419604 7.77702 0.665992L9.41343 4.60039C9.45663 4.70426 9.55432 4.77523 9.66645 4.78422L13.914 5.12475C14.18 5.14607 14.2878 5.47802 14.0852 5.65162L10.849 8.42374C10.7636 8.49692 10.7263 8.61176 10.7524 8.72118L11.7411 12.866C11.803 13.1256 11.5206 13.3308 11.2929 13.1917L7.6564 10.9705C7.5604 10.9119 7.43965 10.9119 7.34365 10.9705L3.70718 13.1917C3.47945 13.3308 3.19708 13.1256 3.25899 12.866L4.24769 8.72118C4.2738 8.61176 4.23648 8.49692 4.15105 8.42374L0.914889 5.65162C0.712228 5.47802 0.820086 5.14607 1.08608 5.12475L5.3336 4.78422C5.44573 4.77523 5.54342 4.70426 5.58662 4.60039L7.22303 0.665992Z"
																		fill="currentColor"
																	/>
																</svg>
																{business.rating}
															</Button>
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
								<div className="z-[60] absolute right-0 top-0 h-full w-1/6 pointer-events-none duration-300 opacity-0 group-hover:opacity-100">
									<ChevronRight className="absolute w-10 h-10 text-white transform -translate-y-1/2 right-4 top-1/2" size={32} />
								</div>
								<ScrollBar className="hidden" orientation="horizontal" />
							</ScrollArea>
						</div>
					</div>
				</div>

				<div className="w-full py-24 pl-8 space-y-10 bg-black">
					{["Plumbers in San Francisco, CA", "Home Services in Atlanta, GA"].map((sectionTitle, index) => (
						<div key={index} className="overflow-hidden">
							<div className="pb-4 md:flex md:items-center md:justify-between">
								<div className="flex flex-row flex-1 min-w-0">
									<h2 className="mr-8 text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">{sectionTitle}</h2>
									<Button variant="link" size="sm">
										View more <ArrowRight className="w-4 h-4 ml-2" />
									</Button>
								</div>
							</div>

							<ScrollArea className="relative w-full group">
								<div className="flex flex-row space-x-8" style={{ "--itemsPerPage": itemsPerPage, "--gutter": `${gutter}px`, "--itemWidth": itemWidth }}>
									{businesses.map((business) => (
										<div key={business.id} id={business.id} className="relative flex items-center justify-center w-[var(--itemWidth)] flex-none">
											<div className="relative w-full overflow-hidden bg-black border rounded-md shadow">
												<img className="absolute top-0 left-0 z-0 object-cover object-center w-full h-full" src={business.image} alt={business.name} />
												<div className="absolute top-0 left-0 z-0 w-full h-full bg-gradient-to-r from-black via-black/80 to-transparent" />
												<div className="relative z-20 flex flex-row items-start gap-4 p-4">
													<div className="flex flex-col space-y-2">
														<img src={business.logo} alt={`${business.name} logo`} className="object-cover w-16 h-16 rounded-md" />
													</div>
													<div className="flex-1">
														<h3 className="mb-1 text-lg font-semibold leading-none tracking-tight">{business.name}</h3>
														<div className="flex flex-wrap items-center gap-2">
															{business.tags.map((tag, index) => (
																<div key={index} className="inline-flex items-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground border shadow px-[2px] py-0 text-[10px] font-bold">
																	{tag}
																</div>
															))}
														</div>
														<p className="mt-2 text-sm text-muted-foreground">{business.description}</p>
													</div>
													<div className="flex flex-col space-y-2">
														<Button className="inline-flex ring-offset-background focus-visible:ring-offset-2 bg-primary text-white hover:bg-primary-light w-10 items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
															<a target="_blank" type="button" href={`/biz/${business.id}`}>
																<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
																	<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
																	<polyline points="15 3 21 3 21 9" />
																	<line x1={10} y1={14} x2={21} y2={3} />
																</svg>
															</a>
														</Button>
														<Button variant="secondary" className="inline-flex ring-offset-background focus-visible:ring-offset-2 border border-input w-10 items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
															<a target="_blank" type="button" href={`/biz/${business.id}`}>
																<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
																	<circle cx={18} cy={5} r={3} />
																	<circle cx={6} cy={12} r={3} />
																	<circle cx={18} cy={19} r={3} />
																	<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
																	<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
																</svg>
															</a>
														</Button>
														<Button variant="secondary" className="inline-flex ring-offset-background focus-visible:ring-offset-2 border border-input w-10 items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
															<a target="_blank" type="button" href={`/biz/${business.id}`}>
																<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
																	<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
																</svg>
															</a>
														</Button>
													</div>
												</div>
												<div className="relative z-20 p-6 pt-0">
													<div className="flex flex-wrap text-sm text-muted-foreground">
														<div className="flex items-center mb-1 ml-1">
															<Button variant="secondary" className="ring-offset-background focus-visible:ring-offset-2 border border-input inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
																<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1 text-gray-400 fill-gray-400">
																	<circle cx={12} cy={12} r={10} />
																</svg>
																{business.status}
															</Button>
														</div>
														<div className="flex items-center mb-1 ml-1">
															<Button variant="secondary" className="ring-offset-background focus-visible:ring-offset-2 border border-input w-10 inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
																<p className="text-sm text-green-600">{business.price}</p>
															</Button>
														</div>
														<div className="flex items-center mb-1 ml-1">
															<Button variant="secondary" className="ring-offset-background focus-visible:ring-offset-2 border border-input inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
																<svg width={15} height={15} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1 text-yellow-500">
																	<path
																		d="M7.22303 0.665992C7.32551 0.419604 7.67454 0.419604 7.77702 0.665992L9.41343 4.60039C9.45663 4.70426 9.55432 4.77523 9.66645 4.78422L13.914 5.12475C14.18 5.14607 14.2878 5.47802 14.0852 5.65162L10.849 8.42374C10.7636 8.49692 10.7263 8.61176 10.7524 8.72118L11.7411 12.866C11.803 13.1256 11.5206 13.3308 11.2929 13.1917L7.6564 10.9705C7.5604 10.9119 7.43965 10.9119 7.34365 10.9705L3.70718 13.1917C3.47945 13.3308 3.19708 13.1256 3.25899 12.866L4.24769 8.72118C4.2738 8.61176 4.23648 8.49692 4.15105 8.42374L0.914889 5.65162C0.712228 5.47802 0.820086 5.14607 1.08608 5.12475L5.3336 4.78422C5.44573 4.77523 5.54342 4.70426 5.58662 4.60039L7.22303 0.665992Z"
																		fill="currentColor"
																	/>
																</svg>
																{business.rating}
															</Button>
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
								<div className="z-[60] absolute right-0 top-0 h-full w-1/6 pointer-events-none group-hover:from-black group-hover:via-black/80 group-hover:to-transparent bg-gradient-to-l transition-opacity duration-300 opacity-0 group-hover:opacity-100">
									<ChevronRight className="absolute w-10 h-10 text-white transform -translate-y-1/2 right-4 top-1/2" size={32} />
								</div>
								<ScrollBar className="hidden" orientation="horizontal" />
							</ScrollArea>
						</div>
					))}
				</div>

				<div className="relative w-full h-dvh">
					<div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-black via-black/80 to-transparent" />
					<img className="object-cover object-center w-full h-full" src="https://images.unsplash.com/photo-1629945011567-5f5f7c2dfdb1?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Descendants: The Rise of Red" />
					<div className="absolute top-[20%] w-full">
						<div className="px-8">
							<h1 className="mb-4 text-3xl font-bold md:text-5xl">Find a welder</h1>
							<div className="space-x-4">
								<Button>Search</Button>
								<Button variant="outline">Post a company</Button>
							</div>
							<p className="mt-6 text-sm text-gray-400">Search for a welder out of 3000 companies</p>
							<p className="w-full text-gray-200 md:max-w-[70%] lg:max-w-[50%] xl:max-w-[35%] mt-1">After the Queen of Hearts incites a coup on Auradon, her rebellious daughter Red and Cinderella&apos;s perfectionist daughter Chloe join forces and travel ...</p>
						</div>
						<div className="w-full py-24 pl-8">
							<ScrollArea className="relative w-full group">
								<div className="flex flex-row space-x-8" style={{ "--itemsPerPage": itemsPerPage, "--gutter": `${gutter}px`, "--itemWidth": itemWidth }}>
									{businesses.map((business) => (
										<div key={business.id} id={business.id} className="relative flex items-center justify-center w-[var(--itemWidth)] flex-none">
											<div className="relative w-full overflow-hidden bg-black border rounded-md shadow">
												<img className="absolute top-0 left-0 z-0 object-cover object-center w-full h-full" src={business.image} alt={business.name} />
												<div className="absolute top-0 left-0 z-0 w-full h-full bg-gradient-to-r from-black via-black/80 to-transparent" />
												<div className="relative z-20 flex flex-row items-start gap-4 p-4">
													<div className="flex flex-col space-y-2">
														<img src={business.logo} alt={`${business.name} logo`} className="object-cover w-16 h-16 rounded-md" />
													</div>
													<div className="flex-1">
														<h3 className="mb-1 text-lg font-semibold leading-none tracking-tight">{business.name}</h3>
														<div className="flex flex-wrap items-center gap-2">
															{business.tags.map((tag, index) => (
																<div key={index} className="inline-flex items-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground border shadow px-[2px] py-0 text-[10px] font-bold">
																	{tag}
																</div>
															))}
														</div>
														<p className="mt-2 text-sm text-muted-foreground">{business.description}</p>
													</div>
													<div className="flex flex-col space-y-2">
														<Button className="inline-flex ring-offset-background focus-visible:ring-offset-2 bg-primary text-white hover:bg-primary-light w-10 items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
															<a target="_blank" type="button" href={`/biz/${business.id}`}>
																<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
																	<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
																	<polyline points="15 3 21 3 21 9" />
																	<line x1={10} y1={14} x2={21} y2={3} />
																</svg>
															</a>
														</Button>
														<Button variant="secondary" className="inline-flex ring-offset-background focus-visible:ring-offset-2 border border-input w-10 items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
															<a target="_blank" type="button" href={`/biz/${business.id}`}>
																<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
																	<circle cx={18} cy={5} r={3} />
																	<circle cx={6} cy={12} r={3} />
																	<circle cx={18} cy={19} r={3} />
																	<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
																	<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
																</svg>
															</a>
														</Button>
														<Button variant="secondary" className="inline-flex ring-offset-background focus-visible:ring-offset-2 border border-input w-10 items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
															<a target="_blank" type="button" href={`/biz/${business.id}`}>
																<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
																	<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
																</svg>
															</a>
														</Button>
													</div>
												</div>
												<div className="relative z-20 p-6 pt-0">
													<div className="flex flex-wrap text-sm text-muted-foreground">
														<div className="flex items-center mb-1 ml-1">
															<Button variant="secondary" className="ring-offset-background focus-visible:ring-offset-2 border border-input inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
																<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1 text-gray-400 fill-gray-400">
																	<circle cx={12} cy={12} r={10} />
																</svg>
																{business.status}
															</Button>
														</div>
														<div className="flex items-center mb-1 ml-1">
															<Button variant="secondary" className="ring-offset-background focus-visible:ring-offset-2 border border-input w-10 inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
																<p className="text-sm text-green-600">{business.price}</p>
															</Button>
														</div>
														<div className="flex items-center mb-1 ml-1">
															<Button variant="secondary" className="ring-offset-background focus-visible:ring-offset-2 border border-input inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
																<svg width={15} height={15} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1 text-yellow-500">
																	<path
																		d="M7.22303 0.665992C7.32551 0.419604 7.67454 0.419604 7.77702 0.665992L9.41343 4.60039C9.45663 4.70426 9.55432 4.77523 9.66645 4.78422L13.914 5.12475C14.18 5.14607 14.2878 5.47802 14.0852 5.65162L10.849 8.42374C10.7636 8.49692 10.7263 8.61176 10.7524 8.72118L11.7411 12.866C11.803 13.1256 11.5206 13.3308 11.2929 13.1917L7.6564 10.9705C7.5604 10.9119 7.43965 10.9119 7.34365 10.9705L3.70718 13.1917C3.47945 13.3308 3.19708 13.1256 3.25899 12.866L4.24769 8.72118C4.2738 8.61176 4.23648 8.49692 4.15105 8.42374L0.914889 5.65162C0.712228 5.47802 0.820086 5.14607 1.08608 5.12475L5.3336 4.78422C5.44573 4.77523 5.54342 4.70426 5.58662 4.60039L7.22303 0.665992Z"
																		fill="currentColor"
																	/>
																</svg>
																{business.rating}
															</Button>
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
								<div className="z-[60] absolute right-0 top-0 h-full w-1/6 pointer-events-none opacity-0 group-hover:opacity-100">
									<ChevronRight className="absolute w-10 h-10 text-white transform -translate-y-1/2 right-4 top-1/2" size={32} />
								</div>
								<ScrollBar className="hidden" orientation="horizontal" />
							</ScrollArea>
						</div>
					</div>
				</div>

				<div className="bg-black">
					<div className="px-8 py-8">
						<div className="relative px-6 pt-16 overflow-hidden bg-gray-900 shadow-2xl isolate sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
							<svg viewBox="0 0 1024 1024" aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0">
								<circle r={512} cx={512} cy={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
								<defs>
									<radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
										<stop stopColor="#7775D6" />
										<stop offset={1} stopColor="#E935C1" />
									</radialGradient>
								</defs>
							</svg>
							<div className="max-w-md mx-auto text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
								<h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Get preimium access to all our features.</h2>
								<p className="mt-6 text-lg leading-8 text-gray-300">Starting with a new way to search for companies. With our new AI search feature with full access to our businesses.</p>
								<div className="flex items-center justify-center mt-10 gap-x-6 lg:justify-start">
									<Button>Signup</Button>
									<Button variant="link">
										Learn more <ChevronRight className="w-4 h-4 ml-2" />
									</Button>
								</div>
							</div>
							<div className="relative mt-16 h-80 lg:mt-8">
								<img alt="App screenshot" src="https://sitemile.com/wp-content/uploads/2023/01/ChatGPT.png" width={1824} height={1080} className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10" />
							</div>
						</div>
					</div>
				</div>

				<div className="w-full py-24 pl-8 space-y-10 bg-black">
					{["Plumbers in San Francisco, CA", "Home Services in Atlanta, GA"].map((sectionTitle, index) => (
						<div key={index} className="overflow-hidden">
							<div className="pb-4 md:flex md:items-center md:justify-between">
								<div className="flex flex-row flex-1 min-w-0">
									<h2 className="mr-8 text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">{sectionTitle}</h2>
									<Button variant="link" size="sm">
										View more <ArrowRight className="w-4 h-4 ml-2" />
									</Button>
								</div>
							</div>
							<ScrollArea className="relative w-full group">
								<div className="flex flex-row space-x-8" style={{ "--itemsPerPage": itemsPerPage, "--gutter": `${gutter}px`, "--itemWidth": itemWidth }}>
									{businesses.map((business) => (
										<div key={business.id} id={business.id} className="relative flex items-center justify-center w-[var(--itemWidth)] flex-none">
											<div className="relative w-full overflow-hidden bg-black border rounded-md shadow">
												<img className="absolute top-0 left-0 z-0 object-cover object-center w-full h-full" src={business.image} alt={business.name} />
												<div className="absolute top-0 left-0 z-0 w-full h-full bg-gradient-to-r from-black via-black/80 to-transparent" />
												<div className="relative z-20 flex flex-row items-start gap-4 p-4">
													<div className="flex flex-col space-y-2">
														<img src={business.logo} alt={`${business.name} logo`} className="object-cover w-16 h-16 rounded-md" />
													</div>
													<div className="flex-1">
														<h3 className="mb-1 text-lg font-semibold leading-none tracking-tight">{business.name}</h3>
														<div className="flex flex-wrap items-center gap-2">
															{business.tags.map((tag, index) => (
																<div key={index} className="inline-flex items-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground border shadow px-[2px] py-0 text-[10px] font-bold">
																	{tag}
																</div>
															))}
														</div>
														<p className="mt-2 text-sm text-muted-foreground">{business.description}</p>
													</div>
													<div className="flex flex-col space-y-2">
														<Button className="inline-flex ring-offset-background focus-visible:ring-offset-2 bg-primary text-white hover:bg-primary-light w-10 items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
															<a target="_blank" type="button" href={`/biz/${business.id}`}>
																<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
																	<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
																	<polyline points="15 3 21 3 21 9" />
																	<line x1={10} y1={14} x2={21} y2={3} />
																</svg>
															</a>
														</Button>
														<Button variant="secondary" className="inline-flex ring-offset-background focus-visible:ring-offset-2 border border-input w-10 items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
															<a target="_blank" type="button" href={`/biz/${business.id}`}>
																<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
																	<circle cx={18} cy={5} r={3} />
																	<circle cx={6} cy={12} r={3} />
																	<circle cx={18} cy={19} r={3} />
																	<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
																	<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
																</svg>
															</a>
														</Button>
														<Button variant="secondary" className="inline-flex ring-offset-background focus-visible:ring-offset-2 border border-input w-10 items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
															<a target="_blank" type="button" href={`/biz/${business.id}`}>
																<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
																	<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
																</svg>
															</a>
														</Button>
													</div>
												</div>
												<div className="relative z-20 p-6 pt-0">
													<div className="flex flex-wrap text-sm text-muted-foreground">
														<div className="flex items-center mb-1 ml-1">
															<Button variant="secondary" className="ring-offset-background focus-visible:ring-offset-2 border border-input inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
																<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1 text-gray-400 fill-gray-400">
																	<circle cx={12} cy={12} r={10} />
																</svg>
																{business.status}
															</Button>
														</div>
														<div className="flex items-center mb-1 ml-1">
															<Button variant="secondary" className="ring-offset-background focus-visible:ring-offset-2 border border-input w-10 inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
																<p className="text-sm text-green-600">{business.price}</p>
															</Button>
														</div>
														<div className="flex items-center mb-1 ml-1">
															<Button variant="secondary" className="ring-offset-background focus-visible:ring-offset-2 border border-input inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
																<svg width={15} height={15} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1 text-yellow-500">
																	<path
																		d="M7.22303 0.665992C7.32551 0.419604 7.67454 0.419604 7.77702 0.665992L9.41343 4.60039C9.45663 4.70426 9.55432 4.77523 9.66645 4.78422L13.914 5.12475C14.18 5.14607 14.2878 5.47802 14.0852 5.65162L10.849 8.42374C10.7636 8.49692 10.7263 8.61176 10.7524 8.72118L11.7411 12.866C11.803 13.1256 11.5206 13.3308 11.2929 13.1917L7.6564 10.9705C7.5604 10.9119 7.43965 10.9119 7.34365 10.9705L3.70718 13.1917C3.47945 13.3308 3.19708 13.1256 3.25899 12.866L4.24769 8.72118C4.2738 8.61176 4.23648 8.49692 4.15105 8.42374L0.914889 5.65162C0.712228 5.47802 0.820086 5.14607 1.08608 5.12475L5.3336 4.78422C5.44573 4.77523 5.54342 4.70426 5.58662 4.60039L7.22303 0.665992Z"
																		fill="currentColor"
																	/>
																</svg>
																{business.rating}
															</Button>
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
								<div className="z-[60] absolute right-0 top-0 h-full w-1/6 pointer-events-none group-hover:from-black group-hover:via-black/80 group-hover:to-transparent bg-gradient-to-l transition-opacity duration-300 opacity-0 group-hover:opacity-100">
									<ChevronRight className="absolute w-10 h-10 text-white transform -translate-y-1/2 right-4 top-1/2" size={32} />
								</div>
								<ScrollBar className="hidden" orientation="horizontal" />
							</ScrollArea>
						</div>
					))}
				</div>

				<div className="relative w-full h-[30em]">
					<div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-black via-black/80 to-transparent" />
					<img className="object-cover object-center w-full h-full" src="https://images.unsplash.com/photo-1708094018348-2f3853af61fb?q=80&w=3090&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Descendants: The Rise of Red" />
					<div className="absolute top-[20%] w-full">
						<div className="px-8">
							<h1 className="mb-4 text-3xl font-bold md:text-5xl">Find a welder</h1>
							<div className="space-x-4">
								<Button>Search</Button>
								<Button variant="outline">Post a company</Button>
							</div>
							<p className="mt-6 text-sm text-gray-400">Search for a welder out of 3000 companies</p>
							<p className="w-full text-gray-200 md:max-w-[70%] lg:max-w-[50%] xl:max-w-[35%] mt-1">After the Queen of Hearts incites a coup on Auradon, her rebellious daughter Red and Cinderella&apos;s perfectionist daughter Chloe join forces and travel ...</p>
						</div>
					</div>
				</div>

				<div className="w-full py-24 pl-8 space-y-10 bg-black">
					{["Plumbers in San Francisco, CA", "Home Services in Atlanta, GA"].map((sectionTitle, index) => (
						<div key={index} className="overflow-hidden">
							<div className="pb-4 md:flex md:items-center md:justify-between">
								<div className="flex flex-row flex-1 min-w-0">
									<h2 className="mr-8 text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">{sectionTitle}</h2>
									<Button variant="link" size="sm">
										View more <ArrowRight className="w-4 h-4 ml-2" />
									</Button>
								</div>
							</div>

							<ScrollArea className="relative w-full group">
								<div className="flex flex-row space-x-8" style={{ "--itemsPerPage": itemsPerPage, "--gutter": `${gutter}px`, "--itemWidth": itemWidth }}>
									{businesses.map((business) => (
										<div key={business.id} id={business.id} className="relative flex items-center justify-center w-[var(--itemWidth)] flex-none">
											<div className="relative w-full overflow-hidden bg-black border rounded-md shadow">
												<img className="absolute top-0 left-0 z-0 object-cover object-center w-full h-full" src={business.image} alt={business.name} />
												<div className="absolute top-0 left-0 z-0 w-full h-full bg-gradient-to-r from-black via-black/80 to-transparent" />
												<div className="relative z-20 flex flex-row items-start gap-4 p-4">
													<div className="flex flex-col space-y-2">
														<img src={business.logo} alt={`${business.name} logo`} className="object-cover w-16 h-16 rounded-md" />
													</div>
													<div className="flex-1">
														<h3 className="mb-1 text-lg font-semibold leading-none tracking-tight">{business.name}</h3>
														<div className="flex flex-wrap items-center gap-2">
															{business.tags.map((tag, index) => (
																<div key={index} className="inline-flex items-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground border shadow px-[2px] py-0 text-[10px] font-bold">
																	{tag}
																</div>
															))}
														</div>
														<p className="mt-2 text-sm text-muted-foreground">{business.description}</p>
													</div>
													<div className="flex flex-col space-y-2">
														<Button className="inline-flex ring-offset-background focus-visible:ring-offset-2 bg-primary text-white hover:bg-primary-light w-10 items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
															<a target="_blank" type="button" href={`/biz/${business.id}`}>
																<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
																	<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
																	<polyline points="15 3 21 3 21 9" />
																	<line x1={10} y1={14} x2={21} y2={3} />
																</svg>
															</a>
														</Button>
														<Button variant="secondary" className="inline-flex ring-offset-background focus-visible:ring-offset-2 border border-input w-10 items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
															<a target="_blank" type="button" href={`/biz/${business.id}`}>
																<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
																	<circle cx={18} cy={5} r={3} />
																	<circle cx={6} cy={12} r={3} />
																	<circle cx={18} cy={19} r={3} />
																	<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
																	<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
																</svg>
															</a>
														</Button>
														<Button variant="secondary" className="inline-flex ring-offset-background focus-visible:ring-offset-2 border border-input w-10 items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
															<a target="_blank" type="button" href={`/biz/${business.id}`}>
																<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
																	<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
																</svg>
															</a>
														</Button>
													</div>
												</div>
												<div className="relative z-20 p-6 pt-0">
													<div className="flex flex-wrap text-sm text-muted-foreground">
														<div className="flex items-center mb-1 ml-1">
															<Button variant="secondary" className="ring-offset-background focus-visible:ring-offset-2 border border-input inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
																<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1 text-gray-400 fill-gray-400">
																	<circle cx={12} cy={12} r={10} />
																</svg>
																{business.status}
															</Button>
														</div>
														<div className="flex items-center mb-1 ml-1">
															<Button variant="secondary" className="ring-offset-background focus-visible:ring-offset-2 border border-input w-10 inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
																<p className="text-sm text-green-600">{business.price}</p>
															</Button>
														</div>
														<div className="flex items-center mb-1 ml-1">
															<Button variant="secondary" className="ring-offset-background focus-visible:ring-offset-2 border border-input inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
																<svg width={15} height={15} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1 text-yellow-500">
																	<path
																		d="M7.22303 0.665992C7.32551 0.419604 7.67454 0.419604 7.77702 0.665992L9.41343 4.60039C9.45663 4.70426 9.55432 4.77523 9.66645 4.78422L13.914 5.12475C14.18 5.14607 14.2878 5.47802 14.0852 5.65162L10.849 8.42374C10.7636 8.49692 10.7263 8.61176 10.7524 8.72118L11.7411 12.866C11.803 13.1256 11.5206 13.3308 11.2929 13.1917L7.6564 10.9705C7.5604 10.9119 7.43965 10.9119 7.34365 10.9705L3.70718 13.1917C3.47945 13.3308 3.19708 13.1256 3.25899 12.866L4.24769 8.72118C4.2738 8.61176 4.23648 8.49692 4.15105 8.42374L0.914889 5.65162C0.712228 5.47802 0.820086 5.14607 1.08608 5.12475L5.3336 4.78422C5.44573 4.77523 5.54342 4.70426 5.58662 4.60039L7.22303 0.665992Z"
																		fill="currentColor"
																	/>
																</svg>
																{business.rating}
															</Button>
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
								<div className="z-[60] absolute right-0 top-0 h-full w-1/6 pointer-events-none group-hover:from-black group-hover:via-black/80 group-hover:to-transparent bg-gradient-to-l transition-opacity duration-300 opacity-0 group-hover:opacity-100">
									<ChevronRight className="absolute w-10 h-10 text-white transform -translate-y-1/2 right-4 top-1/2" size={32} />
								</div>
								<ScrollBar className="hidden" orientation="horizontal" />
							</ScrollArea>
						</div>
					))}
				</div>

				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
			</main>
			<Footer />
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
