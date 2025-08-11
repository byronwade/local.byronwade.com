import React from "react";
import { Button } from "@components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

/**
 * Enhanced CTA section component for comparison pages
 * @param {Object} props
 * @param {string} props.title - CTA section title
 * @param {string} props.subtitle - CTA section subtitle/description
 * @param {Array} props.trustIndicators - Array of trust indicator objects
 * @param {string} props.trustIndicators[].text - Trust indicator text
 * @param {React.ComponentType} props.trustIndicators[].icon - Trust indicator icon (optional)
 * @param {Object} props.primaryButton - Primary button configuration
 * @param {string} props.primaryButton.text - Button text
 * @param {Function} props.primaryButton.onClick - Button click handler
 * @param {Object} props.secondaryButton - Secondary button configuration (optional)
 * @param {string} props.secondaryButton.text - Button text
 * @param {Function} props.secondaryButton.onClick - Button click handler
 * @param {string} props.competitorName - Name of competitor for personalized messaging
 * @param {string} props.className - Additional CSS classes
 */
export function CTASection({ title, subtitle, trustIndicators = [], primaryButton, secondaryButton, competitorName, className = "" }) {
	const defaultTitle = competitorName ? `Ready to Upgrade from ${competitorName}?` : "Ready to Transform Your Business?";

	return (
		<section className={`px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 ${className}`}>
			<div className="relative overflow-hidden rounded-2xl bg-primary p-8 text-center text-primary-foreground">
				<div className="relative">
					<h2 className="mb-4 text-3xl font-bold sm:text-4xl">{title || defaultTitle}</h2>
					<p className="mb-8 text-xl opacity-90">{subtitle}</p>

					{/* Action Buttons */}
					<div className="flex flex-col gap-4 justify-center sm:flex-row">
						<Button size="lg" variant="secondary" className="text-lg px-8 py-3 bg-white text-primary hover:bg-white/90" onClick={primaryButton?.onClick}>
							{primaryButton?.text || "Start Free Trial"}
							<ArrowRight className="ml-2 w-5 h-5" />
						</Button>

						{secondaryButton && (
							<Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white/20 text-white hover:bg-white/10" onClick={secondaryButton.onClick}>
								{secondaryButton.text}
							</Button>
						)}
					</div>

					{/* Trust Indicators */}
					{trustIndicators.length > 0 && (
						<div className="mt-6 flex items-center justify-center gap-6 text-sm opacity-80 flex-wrap">
							{trustIndicators.map((indicator, index) => (
								<div key={index} className="flex items-center gap-1">
									{indicator.icon ? <indicator.icon className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
									<span>{indicator.text}</span>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</section>
	);
}

/**
 * Pre-configured CTA for service businesses
 */
export function ServiceBusinessCTA({ competitorName, totalSavings }) {
	const trustIndicators = [{ text: "No commission fees" }, { text: "Qualified leads only" }, { text: `${totalSavings || "$230K+"} annual savings` }];

	const subtitle = competitorName ? `Join thousands of service businesses that have switched to Thorbis. Stop paying high commissions, get qualified leads, and grow faster. Start your free trial today.` : "Join thousands of service businesses using Thorbis. Get qualified leads, eliminate commissions, and grow faster. Start your free trial today.";

	return (
		<CTASection
			competitorName={competitorName}
			subtitle={subtitle}
			trustIndicators={trustIndicators}
			primaryButton={{
				text: "Start Free Trial",
				onClick: () => console.log("Start trial clicked"),
			}}
			secondaryButton={{
				text: "Schedule Demo",
				onClick: () => console.log("Schedule demo clicked"),
			}}
		/>
	);
}

/**
 * Pre-configured CTA for travel businesses
 */
export function TravelBusinessCTA({ competitorName, totalSavings }) {
	const trustIndicators = [{ text: "No commission fees" }, { text: "Direct guest relationships" }, { text: `${totalSavings || "$450K+"} annual savings` }];

	const subtitle = competitorName ? `Join thousands of travel businesses that have switched to Thorbis. Keep more of your revenue, build direct relationships, and grow faster. Start your free trial today.` : "Join thousands of travel businesses using Thorbis. Eliminate commission dependency, own your guest relationships, and maximize revenue. Start your free trial today.";

	return (
		<CTASection
			competitorName={competitorName}
			subtitle={subtitle}
			trustIndicators={trustIndicators}
			primaryButton={{
				text: "Start Free Trial",
				onClick: () => console.log("Start trial clicked"),
			}}
			secondaryButton={{
				text: "Schedule Demo",
				onClick: () => console.log("Schedule demo clicked"),
			}}
		/>
	);
}

/**
 * Pre-configured CTA for restaurant businesses
 */
export function RestaurantBusinessCTA({ competitorName, totalSavings }) {
	const trustIndicators = [{ text: "All-in-one platform" }, { text: "Advanced reservations" }, { text: `${totalSavings || "$180K+"} annual savings` }];

	const subtitle = competitorName ? `Join thousands of restaurants that have switched to Thorbis. Manage reservations, reviews, and customer relationships all in one place. Start your free trial today.` : "Join thousands of restaurants using Thorbis. Streamline operations, improve customer experience, and grow your business. Start your free trial today.";

	return (
		<CTASection
			competitorName={competitorName}
			subtitle={subtitle}
			trustIndicators={trustIndicators}
			primaryButton={{
				text: "Start Free Trial",
				onClick: () => console.log("Start trial clicked"),
			}}
			secondaryButton={{
				text: "Schedule Demo",
				onClick: () => console.log("Schedule demo clicked"),
			}}
		/>
	);
}

/**
 * Pre-configured CTA for general business platforms
 */
export function GeneralBusinessCTA({ competitorName, benefits = [] }) {
	const defaultBenefits = [{ text: "Fixed monthly pricing" }, { text: "Full data ownership" }, { text: "Multi-platform sync" }];

	const trustIndicators = benefits.length > 0 ? benefits : defaultBenefits;

	const subtitle = competitorName ? `Join thousands of businesses that have upgraded to Thorbis. Get better tools, transparent pricing, and superior support. Start your free trial today.` : "Join thousands of businesses using Thorbis. Streamline operations, improve customer relationships, and grow faster. Start your free trial today.";

	return (
		<CTASection
			competitorName={competitorName}
			subtitle={subtitle}
			trustIndicators={trustIndicators}
			primaryButton={{
				text: "Start Free Trial",
				onClick: () => console.log("Start trial clicked"),
			}}
			secondaryButton={{
				text: "Schedule Demo",
				onClick: () => console.log("Schedule demo clicked"),
			}}
		/>
	);
}
