import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaApple, FaGooglePlay } from "react-icons/fa";

export const metadata = {
	title: "Mobile App",
	description: "Access all of our features from anywhere with our mobile app.",
};

export default function MobilePage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "MobileApplication",
		name: "Thorbis",
		description: metadata.description,
		operatingSystem: "iOS, Android",
		applicationCategory: "Business",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
		},
	};
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				<div className="grid grid-cols-1 lg:grid-cols-2">
					{/* Left Side - Text Content */}
					<div className="flex flex-col justify-center p-12 lg:p-24">
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Thorbis on the Go</h1>
						<p className="mt-4 text-lg md:text-xl max-w-xl text-muted-foreground">Access all of Thorbis&apos;s features from anywhere. Find great businesses, read reviews, and connect with your community, all from your mobile device.</p>
						<div className="mt-8 flex flex-col sm:flex-row gap-4">
							<Button size="lg" className="h-14">
								<FaApple className="w-6 h-6 mr-3" />
								<span>
									<span className="text-xs block">Download on the</span>
									<span className="font-semibold">App Store</span>
								</span>
							</Button>
							<Button size="lg" className="h-14">
								<FaGooglePlay className="w-6 h-6 mr-3" />
								<span>
									<span className="text-xs block">GET IT ON</span>
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
