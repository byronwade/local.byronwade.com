import React from "react";
import { Badge } from "@components/ui/badge";

const services = ["Web Development", "UI/UX Design", "SEO Optimization", "Digital Marketing", "Brand Strategy", "Content Creation", "E-commerce Solutions", "Mobile App Development", "Web Hosting", "Technical Support", "Analytics & Reporting", "Social Media Management"];

export function Services() {
	return (
		<section id="services" className="py-4">
			<div className="mb-6">
				<h2 className="mb-2 text-3xl font-bold md:text-4xl">Our Services</h2>
				<p className="text-lg text-muted-foreground">Discover what we can do for you and your business.</p>
			</div>
			<div className="flex flex-wrap gap-2">
				{services.map((service, index) => (
					<Badge key={index} variant="outline">
						{service}
					</Badge>
				))}
			</div>
		</section>
	);
}
