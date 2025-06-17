import { Button } from "@components/ui/button";
import { ChevronRight } from "react-feather";
import ScrollSection from "@components/site/home/ScrollSection";
import HeroSection from "@components/site/home/HeroSection";
import BusinessCard from "@components/site/home/BusinessCard";

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
		<main className="relative bg-background min-h-screen">
			<HeroSection
				carouselItems={[
					{
						title: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=3126&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						description: "Find trusted local businesses in your area. From restaurants to home services, discover the best rated professionals near you.",
						mediaSrc: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=3126&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						link: "/search",
					},
					{
						title: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						description: "Connect with skilled professionals for all your home improvement needs. Read reviews, compare prices, and book services instantly.",
						mediaSrc: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						link: "/search?category=home-services",
					},
					{
						title: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						description: "Discover amazing restaurants, cafes, and dining experiences. Browse menus, read reviews, and find your next favorite meal.",
						mediaSrc: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						link: "/search?category=restaurants",
					},
					{
						title: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						description: "Find healthcare providers, wellness centers, and medical professionals. Your health and wellbeing are our priority.",
						mediaSrc: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						link: "/search?category=health",
					},
				]}
			/>

			<div className="relative bg-background">
				<div className="relative py-8 space-y-12">
					<ScrollSection category="Home Services" title="Top Rated Plumbers Near You" subtitle="Trusted professionals with excellent reviews and fast response times" link="/search?category=plumbers">
						{businesses.map((business) => (
							<BusinessCard key={business.id} business={business} />
						))}
					</ScrollSection>

					<ScrollSection category="Trending Now" title="Most Popular This Week" subtitle="Businesses that are getting the most attention from customers like you" link="/trending">
						{businesses.map((business) => (
							<BusinessCard key={business.id} business={business} />
						))}
					</ScrollSection>

					<ScrollSection category="Food & Dining" title="Restaurants Open Now" subtitle="Delicious meals available for delivery or pickup right now" link="/search?category=restaurants">
						{businesses.map((business) => (
							<BusinessCard key={business.id} business={business} />
						))}
					</ScrollSection>
				</div>

				<div className="relative py-16 space-y-16">
					{/* Verified Reviews & Trust Section - Addresses fake review complaints */}
					<div className="py-4 pl-8 sm:px-12 lg:px-24">
						<div className="relative px-6 pt-16 overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 shadow-2xl isolate sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0 border border-emerald-400/20">
							<svg viewBox="0 0 1024 1024" aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0">
								<circle r={512} cx={512} cy={512} fill="url(#trust-gradient)" fillOpacity="0.3" />
								<defs>
									<radialGradient id="trust-gradient">
										<stop stopColor="#10B981" />
										<stop offset={1} stopColor="#06B6D4" />
									</radialGradient>
								</defs>
							</svg>
							<div className="max-w-md mx-auto text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
								<div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-bold text-white bg-white/20 rounded-full border border-white/30 backdrop-blur-sm">🛡️ Verified Trust System</div>
								<h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">Real Reviews, Real People</h2>
								<p className="text-xl leading-8 text-white/90 mb-8">Our blockchain-verified review system ensures every review comes from a real customer. No fake reviews, no manipulation - just authentic experiences.</p>
								<div className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:justify-start">
									<Button size="lg" className="bg-white text-emerald-600 hover:bg-white/90 font-semibold px-8 h-12">
										See How It Works
									</Button>
									<Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 h-12">
										Trust Center
									</Button>
								</div>
								<div className="flex items-center justify-center lg:justify-start space-x-6 mt-8 text-sm text-white/80">
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
										<span>100% Verified</span>
									</div>
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
										<span>AI Detection</span>
									</div>
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
										<span>24/7 Moderation</span>
									</div>
								</div>
							</div>
							<div className="relative mt-16 h-80 lg:mt-8">
								<div className="absolute left-0 top-0 w-[57rem] max-w-none">
									<div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-6">
										<div className="grid grid-cols-3 gap-4 mb-4">
											<div className="bg-white/20 rounded-lg p-3 text-center">
												<div className="text-2xl font-bold text-white">100%</div>
												<div className="text-white/70 text-xs">Verified</div>
											</div>
											<div className="bg-white/20 rounded-lg p-3 text-center">
												<div className="text-2xl font-bold text-white">AI</div>
												<div className="text-white/70 text-xs">Detection</div>
											</div>
											<div className="bg-white/20 rounded-lg p-3 text-center">
												<div className="text-2xl font-bold text-white">24/7</div>
												<div className="text-white/70 text-xs">Support</div>
											</div>
										</div>
										<div className="bg-emerald-500/20 rounded-lg p-3">
											<div className="text-emerald-300 text-sm font-medium">✅ Blockchain Verified Review</div>
											<div className="text-white/90 text-sm mt-1">&ldquo;Amazing service! Highly recommend.&rdquo;</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Business Section - Verified Businesses */}
					<div className="relative py-8">
						<ScrollSection category="Verified Businesses" title="Most Trusted Local Businesses" subtitle="Businesses with 100% verified reviews and authentic customer feedback" link="/search?verified=true">
							{businesses.map((business) => (
								<BusinessCard key={business.id} business={business} />
							))}
						</ScrollSection>
					</div>

					{/* Advanced Search & Filtering - Addresses limited filtering complaints */}
					<div className="py-4 pl-8 sm:px-12 lg:px-24">
						<div className="relative px-6 pt-16 overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 shadow-2xl isolate sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0 border border-purple-400/20">
							<svg viewBox="0 0 1024 1024" aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0">
								<circle r={512} cx={512} cy={512} fill="url(#search-gradient)" fillOpacity="0.3" />
								<defs>
									<radialGradient id="search-gradient">
										<stop stopColor="#8B5CF6" />
										<stop offset={1} stopColor="#3B82F6" />
									</radialGradient>
								</defs>
							</svg>
							<div className="max-w-md mx-auto text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
								<div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-bold text-white bg-white/20 rounded-full border border-white/30 backdrop-blur-sm">🔍 Smart Search</div>
								<h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">Find Exactly What You Need</h2>
								<p className="text-xl leading-8 text-white/90 mb-8">Advanced AI-powered search with 50+ filters including real-time availability, pricing tiers, accessibility features, and customer sentiment analysis.</p>
								<div className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:justify-start">
									<Button size="lg" className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-8 h-12">
										Try Advanced Search
									</Button>
									<Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 h-12">
										View All Filters
									</Button>
								</div>
								<div className="flex items-center justify-center lg:justify-start space-x-6 mt-8 text-sm text-white/80">
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
										<span>50+ Filters</span>
									</div>
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
										<span>Real-time Data</span>
									</div>
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse"></div>
										<span>AI Powered</span>
									</div>
								</div>
							</div>
							<div className="relative mt-16 h-80 lg:mt-8">
								<div className="absolute left-0 top-0 w-[57rem] max-w-none">
									<div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-6">
										<div className="bg-white/20 rounded-xl p-4 mb-4">
											<div className="text-white font-semibold mb-2">Search: &ldquo;Pet-friendly restaurants with outdoor seating&rdquo;</div>
											<div className="text-white/70 text-sm">🤖 Found 47 matches with real-time availability</div>
										</div>
										<div className="grid grid-cols-2 gap-3">
											<div className="bg-white/10 rounded-lg p-3">
												<div className="text-white text-sm font-medium">Price Range</div>
												<div className="text-white/70 text-xs">$$ - $$$</div>
											</div>
											<div className="bg-white/10 rounded-lg p-3">
												<div className="text-white text-sm font-medium">Available Now</div>
												<div className="text-white/70 text-xs">23 restaurants</div>
											</div>
											<div className="bg-white/10 rounded-lg p-3">
												<div className="text-white text-sm font-medium">Pet Amenities</div>
												<div className="text-white/70 text-xs">Water bowls, treats</div>
											</div>
											<div className="bg-white/10 rounded-lg p-3">
												<div className="text-white text-sm font-medium">Avg. Rating</div>
												<div className="text-white/70 text-xs">4.7 ⭐</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Business Section - Pet-Friendly Places */}
					<div className="relative py-8">
						<ScrollSection category="Pet-Friendly" title="Best Places for You & Your Pet" subtitle="Restaurants, parks, and services that welcome your furry friends" link="/search?pet-friendly=true">
							{businesses.map((business) => (
								<BusinessCard key={business.id} business={business} />
							))}
						</ScrollSection>
					</div>

					{/* Transparent Pricing & No Hidden Fees - Addresses monetization complaints */}
					<div className="py-4 pl-8 sm:px-12 lg:px-24">
						<div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 lg:p-12">
							<div className="max-w-4xl mx-auto text-center">
								<div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-bold text-white bg-white/20 rounded-full border border-white/30 backdrop-blur-sm">💎 Fair & Transparent</div>
								<h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">No Hidden Fees, No Pay-to-Play</h2>
								<p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">Unlike other platforms, we don&apos;t manipulate search results based on who pays more. Every business gets a fair chance to shine based on genuine customer satisfaction.</p>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
									<div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
										<div className="text-3xl mb-4">🚫</div>
										<div className="text-white font-semibold mb-2">No Pay-to-Rank</div>
										<div className="text-white/70 text-sm">Organic search results only</div>
									</div>
									<div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
										<div className="text-3xl mb-4">💰</div>
										<div className="text-white font-semibold mb-2">Transparent Pricing</div>
										<div className="text-white/70 text-sm">All costs shown upfront</div>
									</div>
									<div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
										<div className="text-3xl mb-4">🤝</div>
										<div className="text-white font-semibold mb-2">Fair Commission</div>
										<div className="text-white/70 text-sm">Lower fees for businesses</div>
									</div>
									<div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
										<div className="text-3xl mb-4">📊</div>
										<div className="text-white font-semibold mb-2">Open Algorithm</div>
										<div className="text-white/70 text-xs">See how rankings work</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Business Section - Fair Pricing Businesses */}
					<div className="relative py-8">
						<ScrollSection category="Fair Pricing" title="Transparent & Honest Businesses" subtitle="No hidden fees, upfront pricing, and fair business practices" link="/search?transparent-pricing=true">
							{businesses.map((business) => (
								<BusinessCard key={business.id} business={business} />
							))}
						</ScrollSection>
					</div>

					{/* Real-Time Business Information - Addresses outdated info complaints */}
					<div className="py-4 pl-8 sm:px-12 lg:px-24">
						<div className="relative px-6 pt-16 overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 shadow-2xl isolate sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0 border border-green-400/20">
							<svg viewBox="0 0 1024 1024" aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0">
								<circle r={512} cx={512} cy={512} fill="url(#realtime-gradient)" fillOpacity="0.3" />
								<defs>
									<radialGradient id="realtime-gradient">
										<stop stopColor="#059669" />
										<stop offset={1} stopColor="#0D9488" />
									</radialGradient>
								</defs>
							</svg>
							<div className="max-w-md mx-auto text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
								<div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-bold text-white bg-white/20 rounded-full border border-white/30 backdrop-blur-sm">⚡ Live Updates</div>
								<h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">Always Current, Always Accurate</h2>
								<p className="text-xl leading-8 text-white/90 mb-8">Real-time business information updated by staff and verified by customers. No more showing up to closed restaurants or outdated hours.</p>
								<div className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:justify-start">
									<Button size="lg" className="bg-white text-green-600 hover:bg-white/90 font-semibold px-8 h-12">
										See Live Business Data
									</Button>
									<Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 h-12">
										How It Works
									</Button>
								</div>
								<div className="flex items-center justify-center lg:justify-start space-x-6 mt-8 text-sm text-white/80">
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
										<span>Live Hours</span>
									</div>
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
										<span>Wait Times</span>
									</div>
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-teal-300 rounded-full animate-pulse"></div>
										<span>Staff Verified</span>
									</div>
								</div>
							</div>
							<div className="relative mt-16 h-80 lg:mt-8">
								<div className="absolute left-0 top-0 w-[57rem] max-w-none">
									<div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-6">
										<div className="flex items-center justify-between mb-4">
											<div className="text-white font-semibold">Mario&apos;s Italian Bistro</div>
											<div className="flex items-center space-x-2">
												<div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
												<span className="text-green-400 text-sm">Open Now</span>
											</div>
										</div>
										<div className="grid grid-cols-2 gap-3 mb-4">
											<div className="bg-white/10 rounded-lg p-3">
												<div className="text-white/70 text-xs">Current Wait</div>
												<div className="text-white font-semibold">15 mins</div>
											</div>
											<div className="bg-white/10 rounded-lg p-3">
												<div className="text-white/70 text-xs">Tables Available</div>
												<div className="text-white font-semibold">3 left</div>
											</div>
										</div>
										<div className="bg-green-500/20 rounded-lg p-3">
											<div className="text-green-400 text-sm font-medium">✅ Real-time verified by staff</div>
											<div className="text-white/70 text-xs">Updated 2 minutes ago</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Business Section - Open Now */}
					<div className="relative py-8">
						<ScrollSection category="Open Now" title="Businesses Available Right Now" subtitle="Real-time hours and availability - no more wasted trips" link="/search?open-now=true">
							{businesses.map((business) => (
								<BusinessCard key={business.id} business={business} />
							))}
						</ScrollSection>
					</div>

					{/* Community-Driven Reviews - Addresses customer service complaints */}
					<div className="py-4 pl-8 sm:px-12 lg:px-24">
						<div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl p-8 lg:p-12">
							<div className="max-w-4xl mx-auto text-center">
								<div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-bold text-white bg-white/20 rounded-full border border-white/30 backdrop-blur-sm">🤝 Community First</div>
								<h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">Your Voice Matters Most</h2>
								<p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">Unlike platforms that prioritize business payments, we put community feedback first. Every review is valued, every complaint is heard, and every suggestion shapes our platform.</p>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
									<div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
										<div className="text-3xl font-bold text-white mb-2">4.9/5</div>
										<div className="text-white/80">Customer Support Rating</div>
									</div>
									<div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
										<div className="text-3xl font-bold text-white mb-2">&lt;2hrs</div>
										<div className="text-white/80">Average Response Time</div>
									</div>
									<div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
										<div className="text-3xl font-bold text-white mb-2">95%</div>
										<div className="text-white/80">Issues Resolved</div>
									</div>
									<div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
										<div className="text-3xl font-bold text-white mb-2">50K+</div>
										<div className="text-white/80">Community Members</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Business Section - Community Favorites */}
					<div className="relative py-8">
						<ScrollSection category="Community Favorites" title="Loved by Our Community" subtitle="Businesses with the highest customer satisfaction and community engagement" link="/search?community-favorites=true">
							{businesses.map((business) => (
								<BusinessCard key={business.id} business={business} />
							))}
						</ScrollSection>
					</div>
				</div>
			</div>
		</main>
	);
}
