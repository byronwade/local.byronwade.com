import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaApple, FaGooglePlay } from "react-icons/fa";

export const metadata = {
	title: "Thorbis Mobile App - Download for iOS & Android",
	description: "Get the Thorbis mobile app for iOS and Android. Find great businesses, read reviews, and connect with your community on the go. Download from App Store or Google Play.",
	keywords: ["thorbis mobile app", "ios app", "android app", "app store", "google play", "mobile reviews", "local business app"],
	openGraph: {
		title: "Thorbis Mobile App - Download for iOS & Android",
		description: "Get the Thorbis mobile app for iOS and Android. Find great businesses, read reviews, and connect with your community on the go. Download from App Store or Google Play.",
		url: "https://local.byronwade.com/mobile",
		siteName: "Thorbis",
		images: [
			{
				url: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=1950&auto=format&fit=crop",
				width: 1200,
				height: 630,
				alt: "Thorbis Mobile App",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Thorbis Mobile App - iOS & Android",
		description: "Download the Thorbis mobile app and access local businesses on the go.",
		images: ["https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=1950&auto=format&fit=crop"],
	},
	alternates: {
		canonical: "https://local.byronwade.com/mobile",
	},
};

export default function MobilePage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "MobileApplication",
		name: "Thorbis Mobile App",
		description: "Find great businesses, read reviews, and connect with your community on mobile",
		url: "https://local.byronwade.com/mobile",
		applicationCategory: "BusinessApplication",
		operatingSystem: ["iOS", "Android"],
		offers: [
			{
				"@type": "Offer",
				price: "0",
				priceCurrency: "USD",
				availability: "https://schema.org/InStock",
				url: "https://apps.apple.com/app/thorbis",
			},
			{
				"@type": "Offer",
				price: "0",
				priceCurrency: "USD",
				availability: "https://schema.org/InStock",
				url: "https://play.google.com/store/apps/details?id=com.thorbis",
			},
		],
		author: {
			"@type": "Organization",
			name: "Thorbis",
			logo: "https://local.byronwade.com/ThorbisLogo.webp",
		},
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: "4.8",
			reviewCount: "12847",
			bestRating: "5",
			worstRating: "1",
		},
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				<div className="grid grid-cols-1 lg:grid-cols-2">
					{/* Left Side - Text Content */}
					<div className="flex flex-col justify-center p-12 lg:p-24">
						<h1 className="text-4xl font-extrabold tracking-tighter md:text-6xl">Thorbis on the Go</h1>
						<p className="mt-4 max-w-xl text-lg md:text-xl text-muted-foreground">Access all of Thorbis&apos;s features from anywhere. Find great businesses, read reviews, and connect with your community, all from your mobile device.</p>
						<div className="flex flex-col gap-4 mt-8 sm:flex-row">
							<Button size="lg" className="h-14">
								<FaApple className="mr-3 w-6 h-6" />
								<span>
									<span className="block text-xs">Download on the</span>
									<span className="font-semibold">App Store</span>
								</span>
							</Button>
							<Button size="lg" className="h-14">
								<FaGooglePlay className="mr-3 w-6 h-6" />
								<span>
									<span className="block text-xs">GET IT ON</span>
									<span className="font-semibold">Google Play</span>
								</span>
							</Button>
						</div>
					</div>

					{/* Right Side - Image */}
					<div className="relative h-96 lg:h-auto bg-muted">
						<Image src="https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=1950&auto=format&fit=crop" alt="Thorbis Mobile App" layout="fill" objectFit="cover" className="mix-blend-multiply" />
					</div>
				</div>
			</div>
		</>
	);
}
