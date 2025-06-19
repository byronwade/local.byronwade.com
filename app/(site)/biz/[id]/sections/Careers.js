import React from "react";
import { Users } from "lucide-react";

export default function Careers({ business }) {
	// Defensive programming - provide fallback data if business or careers is undefined
	if (!business || !business.careers) {
		return (
			<section className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
				<div className="mb-8">
					<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
						<Users className="w-6 h-6 mr-3 text-primary" />
						💼 Join Our Team
					</h2>
					<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
				</div>
				<div className="p-6 border rounded-xl bg-card/30 border-border">
					<p className="text-muted-foreground">Career information is loading...</p>
				</div>
			</section>
		);
	}

	const { jobOpenings = [], culture = [], benefits = [] } = business.careers;

	return (
		<section className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
			<div className="mb-8">
				<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
					<Users className="w-6 h-6 mr-3 text-primary" />
					💼 Join Our Team
				</h2>
				<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
			</div>

			<div className="space-y-8">
				{/* Job Openings */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-foreground">Current Openings</h3>
					<div className="space-y-4">
						{jobOpenings.map((job, index) => (
							<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
								<div className="flex items-start justify-between">
									<div className="space-y-2">
										<h4 className="font-medium text-foreground">{job.title}</h4>
										<p className="text-sm text-muted-foreground">{job.description}</p>
										<div className="flex items-center space-x-4 text-xs text-muted-foreground">
											<span>Type: {job.type}</span>
											<span>Location: {job.location}</span>
											<span>Experience: {job.experience}</span>
										</div>
									</div>
									<div className="text-right">
										<p className="text-sm font-medium text-foreground">{job.salary}</p>
										<p className="text-xs text-muted-foreground">{job.status}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Company Culture */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-foreground">Company Culture</h3>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{culture.map((item, index) => (
							<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
								<h4 className="font-medium text-foreground">{item.title}</h4>
								<p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
							</div>
						))}
					</div>
				</div>

				{/* Benefits */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-foreground">Benefits & Perks</h3>
					<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
						{benefits.map((benefit, index) => (
							<div key={index} className="p-3 border rounded-lg bg-card/20 border-border">
								<p className="text-sm font-medium text-foreground">{benefit}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
