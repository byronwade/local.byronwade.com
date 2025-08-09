import React from "react";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Target } from "lucide-react";

export default function Expertise({ business }) {
	// Add defensive checks to prevent undefined errors
	if (!business) {
		return (
			<section className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
				<div className="mb-8">
					<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
						<Target className="w-6 h-6 mr-3 text-primary" />
						Expertise & Professional Details
					</h2>
					<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
				</div>
				<div className="p-8 text-center text-muted-foreground">Business expertise information is loading...</div>
			</section>
		);
	}

	// Safely extract arrays with fallbacks
	const specializations = business?.specializations || business?.expertise?.map((e) => e.area) || ["Professional Service", "Customer Excellence"];
	const equipment = business?.equipment || ["Professional Grade Tools", "Modern Equipment", "Quality Materials"];
	const brands = business?.brands || ["Industry Leading Brands", "Quality Partners"];
	const team = business?.team || [
		{
			name: "Professional Team",
			title: "Service Specialists",
			experience: "Years of Experience",
			photo: null,
			specialties: ["Customer Service", "Quality Work"],
		},
	];

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
				{specializations && specializations.length > 0 && (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-foreground">Our Specializations</h3>
						<div className="flex flex-wrap gap-2">
							{specializations.map((spec, index) => (
								<Badge key={index} variant="outline" className="border-primary/20 text-primary bg-primary/5">
									{spec}
								</Badge>
							))}
						</div>
					</div>
				)}

				{/* Professional Equipment */}
				{equipment && equipment.length > 0 && (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-foreground">Professional Equipment</h3>
						<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
							{equipment.map((item, index) => (
								<div key={index} className="flex items-center space-x-2">
									<div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary"></div>
									<span className="text-sm text-foreground">{item}</span>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Trusted Brands */}
				{brands && brands.length > 0 && (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-foreground">Trusted Brands We Work With</h3>
						<div className="flex flex-wrap gap-2">
							{brands.map((brand, index) => (
								<Badge key={index} variant="secondary" className="bg-muted text-foreground">
									{brand}
								</Badge>
							))}
						</div>
					</div>
				)}

				{/* Professional Team */}
				{team && team.length > 0 && (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-foreground">Meet Our Team</h3>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{team.map((member, index) => {
								// Safely extract member properties with fallbacks
								const memberName = member?.name || "Team Member";
								const memberTitle = member?.title || "Professional";
								const memberExperience = member?.experience || "Experienced Professional";
								const memberPhoto = member?.photo || null;
								const memberSpecialties = member?.specialties || ["Professional Service"];

								// Generate initials safely
								const initials =
									memberName
										.split(" ")
										.map((n) => n?.[0] || "")
										.join("")
										.substring(0, 2)
										.toUpperCase() || "PM";

								return (
									<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
										<div className="space-y-3 text-center">
											<Avatar className="w-16 h-16 mx-auto">
												<AvatarImage src={memberPhoto} />
												<AvatarFallback className="text-lg bg-primary/10 text-primary">{initials}</AvatarFallback>
											</Avatar>
											<div className="space-y-1">
												<h5 className="font-medium leading-snug break-words text-foreground">{memberName}</h5>
												<p className="text-sm leading-relaxed break-words text-muted-foreground">{memberTitle}</p>
												<p className="text-xs text-muted-foreground">{memberExperience}</p>
											</div>
											<div className="flex flex-wrap justify-center gap-1">
												{memberSpecialties.map((specialty, idx) => (
													<Badge key={idx} variant="secondary" className="text-xs bg-primary/10 text-primary">
														<span className="break-words">{specialty}</span>
													</Badge>
												))}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
