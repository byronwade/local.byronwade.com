import React from "react";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Target } from "lucide-react";

export default function Expertise({ business }) {
	return (
		<section className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
			<div className="mb-8">
				<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
					<Target className="w-6 h-6 mr-3 text-primary" />
					Expertise & Professional Details
				</h2>
				<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
			</div>

			<div className="space-y-8">
				{/* Specializations */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-foreground">Our Specializations</h3>
					<div className="flex flex-wrap gap-2">
						{business.specializations.map((spec, index) => (
							<Badge key={index} variant="outline" className="border-primary/20 text-primary bg-primary/5">
								{spec}
							</Badge>
						))}
					</div>
				</div>

				{/* Professional Equipment */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-foreground">Professional Equipment</h3>
					<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
						{business.equipment.map((item, index) => (
							<div key={index} className="flex items-center space-x-2">
								<div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary"></div>
								<span className="text-sm text-foreground">{item}</span>
							</div>
						))}
					</div>
				</div>

				{/* Trusted Brands */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-foreground">Trusted Brands We Work With</h3>
					<div className="flex flex-wrap gap-2">
						{business.brands.map((brand, index) => (
							<Badge key={index} variant="secondary" className="bg-muted text-foreground">
								{brand}
							</Badge>
						))}
					</div>
				</div>

				{/* Professional Team */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-foreground">Meet Our Team</h3>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{business.team.map((member, index) => (
							<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
								<div className="space-y-3 text-center">
									<Avatar className="w-16 h-16 mx-auto">
										<AvatarImage src={member.photo} />
										<AvatarFallback className="text-lg bg-primary/10 text-primary">
											{member.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div className="space-y-1">
										<h5 className="font-medium leading-snug break-words text-foreground">{member.name}</h5>
										<p className="text-sm leading-relaxed break-words text-muted-foreground">{member.title}</p>
										<p className="text-xs text-muted-foreground">{member.experience}</p>
									</div>
									<div className="flex flex-wrap justify-center gap-1">
										{member.specialties.map((specialty, idx) => (
											<Badge key={idx} variant="secondary" className="text-xs bg-primary/10 text-primary">
												<span className="break-words">{specialty}</span>
											</Badge>
										))}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
