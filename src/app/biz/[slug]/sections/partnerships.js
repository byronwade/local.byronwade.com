import React from "react";
import { Handshake } from "lucide-react";

export default function Partnerships({ business }) {
	// Defensive programming - provide fallback data if business or partnerships is undefined
	if (!business || !business.partnerships) {
		return (
			<section className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
				<div className="mb-8">
					<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
						<Handshake className="w-6 h-6 mr-3 text-primary" />
						🤝 Strategic Partnerships
					</h2>
					<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
				</div>
				<div className="p-6 border rounded-xl bg-card/30 border-border">
					<p className="text-muted-foreground">Partnership information is loading...</p>
				</div>
			</section>
		);
	}

	const { categories = [], benefits = [] } = business.partnerships;

	return (
		<section className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
			<div className="mb-8">
				<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
					<Handshake className="w-6 h-6 mr-3 text-primary" />
					🤝 Strategic Partnerships
				</h2>
				<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
			</div>

			<div className="space-y-8">
				{/* Partnership Overview */}
				<div className="p-6 border rounded-lg bg-card/30 border-border">
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-foreground">Our Partners</h3>
						<p className="text-sm text-muted-foreground">{business.partnerships.description || "We work with trusted partners to deliver the best service to our customers."}</p>
					</div>
				</div>

				{/* Partner Categories */}
				<div className="space-y-6">
					{categories.map((category, index) => (
						<div key={index} className="space-y-4">
							<h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
								{(category.partners || []).map((partner, partnerIndex) => (
									<div key={partnerIndex} className="p-4 border rounded-lg bg-card/30 border-border">
										<div className="space-y-2">
											<h4 className="font-medium text-foreground">{partner.name}</h4>
											<p className="text-sm text-muted-foreground">{partner.description}</p>
											{partner.website && (
												<a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
													Visit Website
												</a>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>

				{/* Partnership Benefits */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-foreground">Partnership Benefits</h3>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{benefits.map((benefit, index) => (
							<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
								<h4 className="font-medium text-foreground">{benefit.title}</h4>
								<p className="mt-1 text-sm text-muted-foreground">{benefit.description}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
