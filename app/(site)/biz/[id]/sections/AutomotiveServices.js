import React from "react";
import { Car, Wrench, Settings, Zap, Shield, Clock, DollarSign, Star, CheckCircle, AlertTriangle, Oil, Battery, Tire, Engine, Brakes, Phone } from "lucide-react";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";

export default function AutomotiveServices({ business }) {
	// Defensive programming - provide fallback data if business or automotive is undefined
	if (!business || !business.automotive) {
		return (
			<section className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
				<div className="mb-8">
					<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
						<Car className="w-6 h-6 mr-3 text-primary" />
						🚗 Automotive Services
					</h2>
					<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
				</div>
				<div className="p-6 border rounded-xl bg-card/30 border-border">
					<p className="text-muted-foreground">Automotive service information is loading...</p>
				</div>
			</section>
		);
	}

	const { services = [], specials = [], certifications = [], warranties = {} } = business.automotive;

	return (
		<section className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
			<div className="mb-8">
				<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
					<Car className="w-6 h-6 mr-3 text-primary" />
					🚗 Automotive Services
				</h2>
				<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
			</div>

			<div className="space-y-8">
				{/* Service Categories */}
				<div className="space-y-6">
					{services.map((service, index) => (
						<div key={index} className="space-y-4">
							<div className="flex items-center space-x-3">
								{service.icon === "engine" && <Engine className="w-5 h-5 text-primary" />}
								{service.icon === "brakes" && <Brakes className="w-5 h-5 text-primary" />}
								{service.icon === "tire" && <Tire className="w-5 h-5 text-primary" />}
								{service.icon === "battery" && <Battery className="w-5 h-5 text-primary" />}
								{service.icon === "oil" && <Oil className="w-5 h-5 text-primary" />}
								{service.icon === "wrench" && <Wrench className="w-5 h-5 text-primary" />}
								{service.icon === "settings" && <Settings className="w-5 h-5 text-primary" />}
								{service.icon === "car" && <Car className="w-5 h-5 text-primary" />}
								<h3 className="text-lg font-semibold text-foreground">{service.name}</h3>
								{service.emergency && (
									<Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
										Emergency
									</Badge>
								)}
							</div>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
								{(service.items || []).map((item, itemIndex) => (
									<div key={itemIndex} className="p-4 border rounded-lg bg-card/30 border-border hover:bg-card/50 transition-colors">
										<div className="flex items-start justify-between mb-2">
											<div className="flex-1">
												<h4 className="font-medium text-foreground">{item.name}</h4>
												{item.recommended && (
													<Badge variant="outline" className="mt-1 text-xs border-primary/20 text-primary">
														<CheckCircle className="w-3 h-3 mr-1" />
														Recommended
													</Badge>
												)}
											</div>
											<span className="text-lg font-bold text-primary ml-4">{item.price}</span>
										</div>
										<p className="text-sm text-muted-foreground mb-3">{item.description}</p>

										{/* Service Details */}
										<div className="space-y-2">
											{item.duration && (
												<div className="flex items-center text-xs text-muted-foreground">
													<Clock className="w-3 h-3 mr-1" />
													{item.duration}
												</div>
											)}
											{item.warranty && (
												<div className="flex items-center text-xs text-muted-foreground">
													<Shield className="w-3 h-3 mr-1" />
													{item.warranty} warranty
												</div>
											)}
											{item.urgent && (
												<div className="flex items-center text-xs text-red-600">
													<AlertTriangle className="w-3 h-3 mr-1" />
													Urgent service available
												</div>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>

				{/* Special Offers */}
				{specials.length > 0 && (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-foreground">Special Offers</h3>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
							{specials.map((special, index) => (
								<div key={index} className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950/20 dark:to-indigo-950/20 dark:border-blue-800/50">
									<div className="flex items-start justify-between mb-2">
										<h4 className="font-medium text-foreground">{special.name}</h4>
										<Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
											{special.discount}
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground mb-2">{special.description}</p>
									<div className="flex items-center justify-between">
										<span className="text-lg font-bold text-primary">{special.price}</span>
										<span className="text-sm text-muted-foreground line-through">{special.originalPrice}</span>
									</div>
									{special.expires && <div className="mt-2 text-xs text-muted-foreground">Expires: {special.expires}</div>}
								</div>
							))}
						</div>
					</div>
				)}

				{/* Certifications & Specializations */}
				{certifications.length > 0 && (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-foreground">Certifications & Specializations</h3>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							{certifications.map((cert, index) => (
								<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
									<div className="flex items-center space-x-3 mb-2">
										<Shield className="w-5 h-5 text-primary" />
										<h4 className="font-medium text-foreground">{cert.name}</h4>
									</div>
									<p className="text-sm text-muted-foreground mb-2">{cert.description}</p>
									<div className="flex items-center justify-between text-xs text-muted-foreground">
										<span>Issued: {cert.issued}</span>
										<span>Expires: {cert.expires}</span>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Warranty Information */}
				{warranties && Object.keys(warranties).length > 0 && (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-foreground">Warranty Coverage</h3>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
							{warranties.parts && (
								<div className="p-4 border rounded-lg bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/50">
									<div className="flex items-center space-x-2 mb-2">
										<CheckCircle className="w-4 h-4 text-green-600" />
										<span className="font-medium text-green-800 dark:text-green-400">Parts Warranty</span>
									</div>
									<p className="text-sm text-green-700 dark:text-green-300">{warranties.parts}</p>
								</div>
							)}
							{warranties.labor && (
								<div className="p-4 border rounded-lg bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800/50">
									<div className="flex items-center space-x-2 mb-2">
										<Wrench className="w-4 h-4 text-blue-600" />
										<span className="font-medium text-blue-800 dark:text-blue-400">Labor Warranty</span>
									</div>
									<p className="text-sm text-blue-700 dark:text-blue-300">{warranties.labor}</p>
								</div>
							)}
							{warranties.roadside && (
								<div className="p-4 border rounded-lg bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800/50">
									<div className="flex items-center space-x-2 mb-2">
										<Car className="w-4 h-4 text-purple-600" />
										<span className="font-medium text-purple-800 dark:text-purple-400">Roadside Assistance</span>
									</div>
									<p className="text-sm text-purple-700 dark:text-purple-300">{warranties.roadside}</p>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Service Actions */}
				<div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
					<Button className="flex-1">
						<Car className="w-4 h-4 mr-2" />
						Schedule Service
					</Button>
					<Button variant="outline" className="flex-1">
						<Phone className="w-4 h-4 mr-2" />
						Call for Quote
					</Button>
					<Button variant="outline" className="flex-1">
						<Zap className="w-4 h-4 mr-2" />
						Emergency Service
					</Button>
				</div>
			</div>
		</section>
	);
}
