"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Clock, CalendarDays, Users, Wrench, Camera, Scissors, ShoppingCart, Car, Stethoscope, Utensils, Calendar, Coffee } from "lucide-react";

const ProfessionalServicesSection = () => {
	const serviceCategories = [
		{
			title: "Need it now?",
			subtitle: "Emergency & Urgent Services",
			urgent: true,
			services: [
				{
					name: "24/7 Emergency Plumber",
					icon: Wrench,
					query: "emergency plumber near me",
					badge: "24/7",
					color: "bg-red-500/10 text-red-600 border-red-200",
				},
				{
					name: "Urgent Care Near Me",
					icon: Stethoscope,
					query: "urgent care near me",
					badge: "Now Open",
					color: "bg-red-500/10 text-red-600 border-red-200",
				},
				{
					name: "Same Day Auto Repair",
					icon: Car,
					query: "same day auto repair",
					badge: "Same Day",
					color: "bg-orange-500/10 text-orange-600 border-orange-200",
				},
				{
					name: "Emergency Dentist",
					icon: Stethoscope,
					query: "emergency dentist near me",
					badge: "Emergency",
					color: "bg-red-500/10 text-red-600 border-red-200",
				},
			],
		},
		{
			title: "Planning ahead?",
			subtitle: "Events & Special Occasions",
			urgent: false,
			services: [
				{
					name: "Wedding Venues",
					icon: Calendar,
					query: "wedding venues near me",
					badge: "Book Early",
					color: "bg-pink-500/10 text-pink-600 border-pink-200",
				},
				{
					name: "Catering Services",
					icon: Utensils,
					query: "catering services near me",
					badge: "Events",
					color: "bg-purple-500/10 text-purple-600 border-purple-200",
				},
				{
					name: "Event Planners",
					icon: CalendarDays,
					query: "event planners near me",
					badge: "Full Service",
					color: "bg-blue-500/10 text-blue-600 border-blue-200",
				},
				{
					name: "Photography Studios",
					icon: Camera,
					query: "photography studios near me",
					badge: "Professional",
					color: "bg-green-500/10 text-green-600 border-green-200",
				},
			],
		},
		{
			title: "Regular services?",
			subtitle: "Everyday Essentials",
			urgent: false,
			services: [
				{
					name: "Hair Salons",
					icon: Scissors,
					query: "hair salons near me",
					badge: "Walk-ins",
					color: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
				},
				{
					name: "Grocery Stores",
					icon: ShoppingCart,
					query: "grocery stores near me",
					badge: "Open Late",
					color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
				},
				{
					name: "Gyms Near Me",
					icon: Users,
					query: "gyms near me",
					badge: "Memberships",
					color: "bg-teal-500/10 text-teal-600 border-teal-200",
				},
				{
					name: "Dry Cleaners",
					icon: Clock,
					query: "dry cleaners near me",
					badge: "Quick Service",
					color: "bg-amber-500/10 text-amber-600 border-amber-200",
				},
			],
		},
	];

	const getUrgencyBadge = (urgent) => {
		if (urgent) {
			return (
				<Badge variant="destructive" className="mb-4 bg-red-500/20 text-red-700 border-red-300 hover:bg-red-500/30">
					<Clock className="w-3 h-3 mr-1" />
					Urgent
				</Badge>
			);
		}
		return null;
	};

	return (
		<section className="py-16 bg-background">
			<div className="container mx-auto px-4 lg:px-24">
				{/* Section Header */}
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold text-foreground mb-4">Find the right professional for any job</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">Whether you need immediate help or planning for the future, discover trusted local professionals ready to serve you.</p>
				</div>

				{/* Service Categories */}
				<div className="space-y-16">
					{serviceCategories.map((category, categoryIndex) => (
						<div key={category.title} className="animate-fade-in" style={{ animationDelay: `${categoryIndex * 200}ms` }}>
							{/* Category Header */}
							<div className="text-center mb-8">
								{getUrgencyBadge(category.urgent)}
								<h3 className="text-2xl font-semibold text-foreground mb-2">{category.title}</h3>
								<p className="text-muted-foreground">{category.subtitle}</p>
							</div>

							{/* Services Grid */}
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
								{category.services.map((service, serviceIndex) => (
									<Link key={service.name} href={`/search?q=${encodeURIComponent(service.query)}`}>
										<Card className="h-full group transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:scale-105 cursor-pointer bg-card border-border">
											<CardHeader className="text-center p-6">
												{/* Service Icon */}
												<div className="mb-4 mx-auto">
													<div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
														<service.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
													</div>
												</div>

												{/* Service Name */}
												<CardTitle className="text-lg font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors duration-300">{service.name}</CardTitle>

												{/* Service Badge */}
												<Badge variant="outline" className={`inline-flex items-center px-3 py-1 text-xs font-medium transition-all duration-300 ${service.color} group-hover:scale-105`}>
													{service.badge}
												</Badge>

												{/* Hover Indicator */}
												<div className="absolute inset-0 rounded-lg ring-2 ring-primary/0 group-hover:ring-primary/30 transition-all duration-300 pointer-events-none"></div>
											</CardHeader>
										</Card>
									</Link>
								))}
							</div>
						</div>
					))}
				</div>

				{/* Call to Action */}
				<div className="text-center mt-16 p-8 bg-primary/5 rounded-2xl border border-primary/20">
					<h3 className="text-2xl font-semibold text-foreground mb-4">Can't find what you're looking for?</h3>
					<p className="text-muted-foreground mb-6 max-w-lg mx-auto">Search our complete directory of local professionals and businesses in your area.</p>
					<Link href="/search" className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-300">
						Browse All Services
						<Users className="w-4 h-4 ml-2" />
					</Link>
				</div>
			</div>

			{/* CSS for animations */}
			<style jsx>{`
				@keyframes fade-in {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fade-in {
					animation: fade-in 0.6s ease-out forwards;
					opacity: 0;
				}
			`}</style>
		</section>
	);
};

export default ProfessionalServicesSection;
