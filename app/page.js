import { Button } from "@components/ui/button";
import Header from "@components/site/Header";
import Footer from "@components/site/Footer";
import { ChevronRight } from "react-feather";
import ScrollSection from "@components/site/home/ScrollSection";
import HeroSection from "@components/site/home/HeroSection";

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
			<main className="relative">
				<HeroSection
					title="https://occ-0-8236-37.1.nflxso.net/dnm/api/v6/LmEnxtiAuzezXBjYXPuDgfZ4zZQ/AAAABc0_iOW9_pz4E5jfQmWKZ9cts2uIUGij8BVHURQzwa3Lt43j_q4mhGLT1VZaiMp-NXSBdOkpRd07ewgbkRkMcE-OdCMPeo0wxAgXFGgjldp4JRAE75RzpMFu_QxacsPXL-HgXtlr_rHVF9Qn3HtUbr86E1fXJo0sA1oYNgnpYT6WYVsHcbcuFQ.webp?r=771"
					description="Renowned comedian and podcast host Joe Rogan delivers a live stand-up set at the Majestic Theatre in San Antonio, Texas, for his third Netflix special."
					mediaSrc="/welding.mp4"
					link="/watch/81771853?trackId=254015180"
				/>

				<div className="relative">
					<div className="bg-card">
						<div className="relative z-10 py-12 pb-24 space-y-24 md:pb-32 md:space-y-32">
							<ScrollSection title="Plumbers in San Francisco, CA" link="/" businesses={businesses} />
							<ScrollSection title="Plumbers in San Francisco, CA" link="/" businesses={businesses} />
						</div>

						<div className="relative py-24 md:py-32">
							<div className="py-4 pl-8 sm:px-12 lg:px-24">
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
										<h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Get premium access to all our features.</h2>
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

						<div className="relative pb-24 space-y-24 md:pb-32 md:space-y-32">
							<ScrollSection title="Plumbers in San Francisco, CA" link="/" businesses={businesses} />
							<ScrollSection title="Plumbers in San Francisco, CA" link="/" businesses={businesses} />
						</div>

						<div className="relative w-full h-[30em]">
							<div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-black via-black/80 to-transparent" />
							<img className="object-cover object-center w-full h-full" src="https://images.unsplash.com/photo-1708094018348-2f3853af61fb?q=80&w=3090&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Descendants: The Rise of Red" />
							<div className="absolute top-[20%] w-full">
								<div className="py-4 pl-8 sm:px-12 lg:px-24">
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

						<div className="pb-24 space-y-24 md:pb-32 md:space-y-32">
							<ScrollSection title="Plumbers in San Francisco, CA" link="/" businesses={businesses} />
							<ScrollSection title="Plumbers in San Francisco, CA" link="/" businesses={businesses} />
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
}
