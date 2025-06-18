"use client";
import React, { useState } from "react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Card } from "@components/ui/card";
import { Award, Shield, Star, TrendingUp, Clock, Users, CheckCircle, Crown, Target, Search, Trophy, Phone, Mail, Calendar, ExternalLink, ArrowRight } from "lucide-react";

export default function BusinessCertificationPage() {
	const [selectedIndustry, setSelectedIndustry] = useState("");

	const certificationStats = [
		{
			stat: "0.0008%",
			label: "Acceptance Rate",
			description: "Rarer than Harvard admission",
		},
		{
			stat: "6-9",
			label: "Month Process",
			description: "Rigorous evaluation period",
		},
		{
			stat: "400+",
			label: "Customer Interviews",
			description: "Independent verification",
		},
		{
			stat: "1 in 125,000",
			label: "Elite Recognition",
			description: "Industry-leading certification",
		},
	];

	const certificationStages = [
		{ stage: 1, title: "Initial Screening", description: "Basic qualifications and eligibility review", difficulty: "Standard" },
		{ stage: 2, title: "License Audit", description: "Comprehensive licensing and permit verification", difficulty: "Moderate" },
		{ stage: 3, title: "Insurance Validation", description: "Coverage adequacy and claims history review", difficulty: "Moderate" },
		{ stage: 4, title: "Background Investigation", description: "Complete business and owner background check", difficulty: "Intensive" },
		{ stage: 5, title: "Customer Deep Dive", description: "400+ independent customer interviews", difficulty: "Intensive" },
		{ stage: 6, title: "Reference Verification", description: "Extensive reference checking and validation", difficulty: "Intensive" },
		{ stage: 7, title: "Financial Analysis", description: "Complete financial stability assessment", difficulty: "Expert" },
		{ stage: 8, title: "Quality Evaluation", description: "Work samples and quality standards review", difficulty: "Expert" },
		{ stage: 9, title: "Expertise Assessment", description: "Technical knowledge and skill testing", difficulty: "Expert" },
		{ stage: 10, title: "Facility Inspection", description: "Physical location and equipment audit", difficulty: "Expert" },
		{ stage: 11, title: "Final Review Board", description: "Executive committee comprehensive evaluation", difficulty: "Elite" },
		{ stage: 12, title: "Elite Certification", description: "Award of Thorbis Certified Elite status", difficulty: "Elite" },
	];

	const benefits = [
		{
			title: "Guaranteed Quality Recognition",
			description: "Join the top 0.0008% of businesses with proven excellence",
			icon: Crown,
		},
		{
			title: "Performance Guarantee Protection",
			description: "Comprehensive coverage and dispute resolution services",
			icon: Shield,
		},
		{
			title: "Priority Platform Placement",
			description: "Featured positioning in search results and directory listings",
			icon: Star,
		},
		{
			title: "Verified Badge & Marketing",
			description: "Official certification badge for all marketing materials",
			icon: Award,
		},
		{
			title: "Customer Trust Boost",
			description: "Instant credibility with the most recognized quality seal",
			icon: Target,
		},
		{
			title: "Premium Support Access",
			description: "Dedicated account management and priority customer service",
			icon: Phone,
		},
	];

	const requirements = ["Minimum 3 years in business", "Valid business license and insurance", "Positive customer satisfaction record", "Financial stability verification", "Professional facility and equipment", "Willingness to undergo comprehensive evaluation"];

	const industries = ["Home Services", "Professional Services", "Healthcare", "Automotive", "Construction", "Technology", "Food & Beverage", "Retail", "Other"];

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-24">
				<div className="text-center">
					{/* Elite Badge */}
					<div className="inline-flex items-center px-4 py-2 mb-6 space-x-2 rounded-full bg-primary/10 text-primary border border-primary/20">
						<Crown className="w-4 h-4" />
						<span className="text-sm font-medium">🏆 Elite Business Certification</span>
					</div>

					<h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
						Get <span className="text-primary">Thorbis Certified</span>
					</h1>

					<p className="max-w-3xl mx-auto mb-8 text-lg text-muted-foreground sm:text-xl">Join the most exclusive business certification program. Like a Michelin star for service excellence, this certification represents the highest standards of quality and reliability.</p>

					{/* Key Stats */}
					<div className="grid grid-cols-2 gap-4 mb-12 lg:grid-cols-4">
						{certificationStats.map((stat, index) => (
							<Card key={index} className="p-6 text-center">
								<div className="text-2xl font-bold text-primary lg:text-3xl">{stat.stat}</div>
								<div className="text-sm font-medium text-foreground">{stat.label}</div>
								<div className="mt-1 text-xs text-muted-foreground">{stat.description}</div>
							</Card>
						))}
					</div>

					{/* CTA Buttons */}
					<div className="flex flex-col justify-center gap-4 sm:flex-row">
						<Button size="lg" className="px-8 py-4 text-lg font-semibold">
							<Trophy className="w-5 h-5 mr-3" />
							Start Application
						</Button>
						<Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold">
							<ExternalLink className="w-5 h-5 mr-3" />
							Learn More
						</Button>
					</div>
				</div>
			</section>

			{/* Comparison Section */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 bg-muted/30">
				<div className="text-center mb-12">
					<h2 className="mb-4 text-3xl font-bold text-foreground">Beyond Industry Standards</h2>
					<p className="max-w-3xl mx-auto text-lg text-muted-foreground">While other certifications set good standards, Thorbis Certified represents the absolute pinnacle of business excellence.</p>
				</div>

				<div className="grid gap-8 md:grid-cols-2">
					<Card className="p-6">
						<div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-muted">
							<Shield className="w-6 h-6 text-muted-foreground" />
						</div>
						<h3 className="mb-3 text-lg font-semibold text-center">Diamond Certified</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>• ~5% acceptance rate</li>
							<li>• Basic phone surveys</li>
							<li>• Limited background checks</li>
							<li>• Standard industry requirements</li>
							<li>• Regional recognition</li>
						</ul>
					</Card>

					<Card className="p-6 border-primary/20 bg-primary/5">
						<div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10">
							<Crown className="w-6 h-6 text-primary" />
						</div>
						<h3 className="mb-3 text-lg font-semibold text-center text-primary">Thorbis Certified Elite</h3>
						<ul className="space-y-2 text-sm text-foreground">
							<li>• 0.0008% acceptance rate (625x more selective)</li>
							<li>• 400+ independent customer interviews</li>
							<li>• Comprehensive 12-stage evaluation</li>
							<li>• 6-9 month rigorous process</li>
							<li>• National prestige recognition</li>
						</ul>
					</Card>
				</div>

				<div className="mt-8 text-center">
					<Badge className="px-6 py-2 text-lg font-bold">625x More Exclusive Than Diamond Certified</Badge>
				</div>
			</section>

			{/* 12-Stage Process */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="mb-12 text-center">
					<h2 className="mb-4 text-3xl font-bold text-foreground">12-Stage Evaluation Process</h2>
					<p className="max-w-3xl mx-auto text-lg text-muted-foreground">Our comprehensive certification process is the most rigorous in the industry.</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{certificationStages.map((stage, index) => (
						<Card key={index} className="p-4 transition-all duration-200 hover:shadow-md hover:scale-105">
							<div className="flex items-center mb-3">
								<div className={`flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full ${stage.difficulty === "Elite" ? "bg-gradient-to-r from-amber-500 to-orange-500" : stage.difficulty === "Expert" ? "bg-gradient-to-r from-red-500 to-pink-500" : stage.difficulty === "Intensive" ? "bg-gradient-to-r from-blue-500 to-cyan-500" : "bg-muted-foreground"}`}>{stage.stage}</div>
								<h4 className="ml-3 font-semibold text-foreground">{stage.title}</h4>
							</div>
							<p className="mb-3 text-sm leading-relaxed text-muted-foreground">{stage.description}</p>
							<Badge variant="outline" className={`text-xs ${stage.difficulty === "Elite" ? "border-amber-300 text-amber-700 bg-amber-50" : stage.difficulty === "Expert" ? "border-red-300 text-red-700 bg-red-50" : stage.difficulty === "Intensive" ? "border-blue-300 text-blue-700 bg-blue-50" : ""}`}>
								{stage.difficulty}
							</Badge>
						</Card>
					))}
				</div>
			</section>

			{/* Benefits Section */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 bg-muted/30">
				<div className="mb-12 text-center">
					<h2 className="mb-4 text-3xl font-bold text-foreground">Certification Benefits</h2>
					<p className="max-w-3xl mx-auto text-lg text-muted-foreground">Thorbis Certified businesses enjoy unparalleled advantages and premium positioning.</p>
				</div>

				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{benefits.map((benefit, index) => (
						<Card key={index} className="p-6 transition-all duration-200 hover:shadow-lg hover:scale-105">
							<div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10">
								<benefit.icon className="w-6 h-6 text-primary" />
							</div>
							<h3 className="mb-3 text-xl font-semibold text-foreground">{benefit.title}</h3>
							<p className="leading-relaxed text-muted-foreground">{benefit.description}</p>
						</Card>
					))}
				</div>
			</section>

			{/* Requirements & Industries */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="grid gap-12 lg:grid-cols-2">
					<div>
						<h2 className="mb-6 text-3xl font-bold text-foreground">Requirements</h2>
						<p className="mb-8 text-lg text-muted-foreground">Basic qualifications needed to begin the evaluation process.</p>
						<div className="space-y-4">
							{requirements.map((requirement, index) => (
								<div key={index} className="flex items-start space-x-3">
									<CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-green-500" />
									<span className="text-foreground">{requirement}</span>
								</div>
							))}
						</div>
					</div>

					<div>
						<h2 className="mb-6 text-3xl font-bold text-foreground">Industries</h2>
						<p className="mb-8 text-lg text-muted-foreground">We certify businesses across multiple industries with tailored standards.</p>
						<div className="grid grid-cols-2 gap-3">
							{industries.map((industry, index) => (
								<button key={index} onClick={() => setSelectedIndustry(industry)} className={`p-3 text-left border rounded-lg transition-all ${selectedIndustry === industry ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:bg-muted text-foreground"}`}>
									{industry}
								</button>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Performance Guarantee */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 bg-muted/30">
				<Card className="p-8 lg:p-12">
					<div className="text-center">
						<div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary/10">
							<Shield className="w-8 h-8 text-primary" />
						</div>
						<h2 className="mb-4 text-3xl font-bold text-foreground">Performance Guarantee</h2>
						<p className="max-w-3xl mx-auto mb-8 text-lg text-muted-foreground">Every Thorbis Certified business is backed by our comprehensive performance guarantee and ongoing quality monitoring.</p>
						<div className="flex flex-wrap justify-center gap-4">
							<Badge className="px-4 py-2">🛡️ 100% Satisfaction</Badge>
							<Badge className="px-4 py-2">⚖️ Expert Mediation</Badge>
							<Badge className="px-4 py-2">🔍 Ongoing Monitoring</Badge>
							<Badge className="px-4 py-2">📞 24/7 Resolution</Badge>
						</div>
					</div>
				</Card>
			</section>

			{/* Application CTA */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<Card className="p-8 lg:p-12 bg-primary text-primary-foreground">
					<div className="text-center">
						<Crown className="w-16 h-16 mx-auto mb-6" />
						<h2 className="mb-4 text-3xl font-bold">Ready to Join the Elite?</h2>
						<p className="max-w-3xl mx-auto mb-8 text-lg opacity-90">Apply for Thorbis Certification and join the top 0.0008% of businesses recognized for exceptional quality and service excellence.</p>

						<div className="flex flex-col justify-center gap-4 sm:flex-row">
							<Button size="lg" variant="secondary" className="px-8 py-4 text-lg font-semibold">
								<Trophy className="w-5 h-5 mr-3" />
								Begin Application
							</Button>
							<Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
								<Phone className="w-5 h-5 mr-3" />
								Schedule Consultation
							</Button>
						</div>

						<p className="mt-6 text-sm opacity-75">Applications reviewed by invitation and pre-qualification only</p>
					</div>
				</Card>
			</section>
		</div>
	);
}
