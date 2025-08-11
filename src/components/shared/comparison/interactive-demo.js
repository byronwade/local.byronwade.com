import React from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Play, Calendar } from "lucide-react";

/**
 * Interactive demo section component for comparison pages
 * @param {Object} props
 * @param {string} props.title - Demo section title
 * @param {string} props.subtitle - Demo section subtitle
 * @param {Object} props.demoVideo - Video demo configuration
 * @param {string} props.demoVideo.title - Video demo title
 * @param {string} props.demoVideo.description - Video demo description
 * @param {string} props.demoVideo.buttonText - Video button text
 * @param {Function} props.demoVideo.onClick - Video button click handler
 * @param {Object} props.consultation - Consultation booking configuration
 * @param {string} props.consultation.title - Consultation title
 * @param {string} props.consultation.description - Consultation description
 * @param {string} props.consultation.buttonText - Consultation button text
 * @param {Function} props.consultation.onClick - Consultation button click handler
 * @param {Object} props.preview - Preview configuration
 * @param {React.ComponentType} props.preview.icon - Preview icon component
 * @param {string} props.preview.title - Preview title
 * @param {string} props.preview.description - Preview description
 * @param {string} props.className - Additional CSS classes
 */
export function InteractiveDemo({ title, subtitle, demoVideo, consultation, preview, className = "" }) {
	return (
		<section className={`px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 ${className}`}>
			<div className="mb-12 text-center">
				<h2 className="text-3xl font-bold text-foreground sm:text-4xl">{title}</h2>
				<p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
			</div>
			<div className="grid gap-8 lg:grid-cols-2 items-center">
				<div className="space-y-6">
					{/* Video Demo Card */}
					<Card className="p-6 bg-card rounded-lg border border-border">
						<CardContent className="p-0">
							<div className="flex items-center gap-3 mb-4">
								<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
									<Play className="w-4 h-4 text-primary" />
								</div>
								<h3 className="font-semibold">{demoVideo.title}</h3>
							</div>
							<p className="text-sm text-muted-foreground mb-4">{demoVideo.description}</p>
							<Button variant="outline" className="w-full" onClick={demoVideo.onClick}>
								<Play className="w-4 h-4 mr-2" />
								{demoVideo.buttonText}
							</Button>
						</CardContent>
					</Card>

					{/* Consultation Card */}
					<Card className="p-6 bg-card rounded-lg border border-border">
						<CardContent className="p-0">
							<div className="flex items-center gap-3 mb-4">
								<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
									<Calendar className="w-4 h-4 text-primary" />
								</div>
								<h3 className="font-semibold">{consultation.title}</h3>
							</div>
							<p className="text-sm text-muted-foreground mb-4">{consultation.description}</p>
							<Button className="w-full" onClick={consultation.onClick}>
								<Calendar className="w-4 h-4 mr-2" />
								{consultation.buttonText}
							</Button>
						</CardContent>
					</Card>
				</div>

				{/* Preview */}
				<div className="relative">
					<div className="aspect-video bg-primary/5 rounded-xl border border-primary/20 flex items-center justify-center">
						<div className="text-center">
							<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
								<preview.icon className="w-8 h-8 text-primary" />
							</div>
							<h3 className="font-semibold text-lg mb-2">{preview.title}</h3>
							<p className="text-sm text-muted-foreground">{preview.description}</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

/**
 * Pre-configured demo for service businesses
 */
export function ServiceBusinessDemo({ businessType = "Service" }) {
	return (
		<InteractiveDemo
			title={`Experience Thorbis for ${businessType} Businesses`}
			subtitle="See how we help service businesses get qualified leads and grow revenue"
			demoVideo={{
				title: `${businessType} Business Demo`,
				description: "Watch how contractors and service professionals manage leads, quotes, and customer communications.",
				buttonText: `Watch ${businessType} Demo`,
				onClick: () => console.log("Video demo clicked"),
			}}
			consultation={{
				title: "Personalized Consultation",
				description: `Get expert advice on growing your ${businessType.toLowerCase()} business and improving lead quality.`,
				buttonText: `Book ${businessType} Consultation`,
				onClick: () => console.log("Consultation booking clicked"),
			}}
			preview={{
				icon: ({ className }) => (
					<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
					</svg>
				),
				title: `${businessType} Business Dashboard`,
				description: "Lead management, customer communications, and business growth tools",
			}}
			className="bg-muted/30"
		/>
	);
}

/**
 * Pre-configured demo for travel businesses
 */
export function TravelBusinessDemo({ businessType = "Travel" }) {
	return (
		<InteractiveDemo
			title={`Experience Thorbis for ${businessType} Businesses`}
			subtitle="See how we help travel businesses eliminate commission dependency"
			demoVideo={{
				title: `${businessType} Platform Demo`,
				description: "Watch how hotels, resorts, and travel agencies manage bookings, pricing, and guest communications.",
				buttonText: `Watch ${businessType} Demo`,
				onClick: () => console.log("Video demo clicked"),
			}}
			consultation={{
				title: `${businessType} Industry Consultation`,
				description: "Get expert advice on reducing commission dependency and building a sustainable direct booking strategy.",
				buttonText: `Book ${businessType} Consultation`,
				onClick: () => console.log("Consultation booking clicked"),
			}}
			preview={{
				icon: ({ className }) => (
					<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
					</svg>
				),
				title: `${businessType} Business Control Center`,
				description: "Multi-channel management, guest relations, and revenue optimization",
			}}
			className="bg-muted/30"
		/>
	);
}

/**
 * Pre-configured demo for restaurant businesses
 */
export function RestaurantBusinessDemo() {
	return (
		<InteractiveDemo
			title="Experience Thorbis for Restaurants"
			subtitle="See how we help restaurants manage reviews, reservations, and customer relationships"
			demoVideo={{
				title: "Restaurant Platform Demo",
				description: "Watch how restaurants manage reservations, reviews, menu updates, and customer communications across all platforms.",
				buttonText: "Watch Restaurant Demo",
				onClick: () => console.log("Video demo clicked"),
			}}
			consultation={{
				title: "Restaurant Consultation",
				description: "Get expert advice on improving your restaurant's online presence and increasing direct reservations.",
				buttonText: "Book Restaurant Consultation",
				onClick: () => console.log("Consultation booking clicked"),
			}}
			preview={{
				icon: ({ className }) => (
					<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5h13M7 13v8a2 2 0 002 2h6a2 2 0 002-2v-8m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v4.01" />
					</svg>
				),
				title: "Restaurant Management Dashboard",
				description: "Reservation system, review management, and customer engagement tools",
			}}
			className="bg-muted/30"
		/>
	);
}
