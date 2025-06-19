import React from "react";
import { MessageCircle } from "lucide-react";

export default function FAQ({ business }) {
	// Defensive programming - provide fallback data if business, faq, or supportInfo is undefined
	if (!business || !business.faq) {
		return (
			<section className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
				<div className="mb-8">
					<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
						<MessageCircle className="w-6 h-6 mr-3 text-primary" />
						FAQ & Support
					</h2>
					<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
				</div>
				<div className="p-6 border rounded-xl bg-card/30 border-border">
					<p className="text-muted-foreground">FAQ and support information is loading...</p>
				</div>
			</section>
		);
	}

	const { faq = [], supportInfo = [] } = business;

	return (
		<section className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
			<div className="mb-8">
				<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
					<MessageCircle className="w-6 h-6 mr-3 text-primary" />
					FAQ & Support
				</h2>
				<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
			</div>

			<div className="space-y-8">
				{/* FAQ Section */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-foreground">Frequently Asked Questions</h3>
					<div className="space-y-4">
						{faq.map((item, index) => (
							<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
								<h4 className="font-medium text-foreground">{item.question}</h4>
								<p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
							</div>
						))}
					</div>
				</div>

				{/* Support Information */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-foreground">Support & Contact</h3>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{supportInfo.map((info, index) => (
							<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
								<h4 className="font-medium text-foreground">{info.title}</h4>
								<p className="mt-1 text-sm text-muted-foreground">{info.description}</p>
								{info.contact && <p className="mt-2 text-sm font-medium text-primary">{info.contact}</p>}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
