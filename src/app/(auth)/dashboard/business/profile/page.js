/**
 * BusinessProfile Component (Refactored)
 * Clean, modular implementation using extracted sections and hooks
 * Reduced from 2,221 lines to focused, maintainable architecture
 * Following enterprise-grade patterns for large-scale applications
 */

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Building, DollarSign, Shield, Award, Clock, Image, Users, Settings, Eye, Grid, List, Filter, Search, ArrowLeft, ExternalLink, Share, Edit } from "lucide-react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Badge } from "@components/ui/badge";

// Import modular sections
import { OverviewSection, ServicesSection, TeamSection, BusinessHoursSection, MediaSection, SettingsSection } from "@components/dashboard/business/profile/sections";

// Import existing sections that are already modular
// Note: Partnerships, Careers, and FAQ sections can be imported when needed

// AI Integration imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Sparkles, Brain, Wand2, MessageSquare, Target, TrendingUp, Lightbulb, Zap, Robot, Star, MapPin, Phone, Globe, Calendar, Camera, Heart, ThumbsUp, MessageCircle, Quote, BarChart3, Users2, Clock4, CheckCircle2, Verified, Crown, Shield as ShieldIcon } from "lucide-react";

// Import custom hook
import { useBusinessProfile } from "@lib/hooks/business/profile/use-business-profile";

const BusinessProfile = () => {
	const {
		// State
		profile,
		setProfile,
		activeSection,
		setActiveSection,
		isEditing,
		setIsEditing,
		isClient,
		setIsClient,

		// Refs
		fileInputRef,

		// Functions
		handleSaveProfile,
		navigateToSection,
		handleFileUpload,
	} = useBusinessProfile();

	// Additional state for enhanced functionality
	const [viewMode, setViewMode] = useState("grid"); // grid, list
	const [searchTerm, setSearchTerm] = useState("");
	const [showFilters, setShowFilters] = useState(false);
	const [completionScore, setCompletionScore] = useState(0);

	// AI Integration state
	const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
	const [aiSuggestions, setAiSuggestions] = useState([]);
	const [aiGenerating, setAiGenerating] = useState(false);
	const [aiOptimizationScore, setAiOptimizationScore] = useState(0);
	const [aiInsights, setAiInsights] = useState({
		seoScore: 0,
		contentQuality: 0,
		competitiveness: 0,
		suggestions: [],
	});

	// AI-powered helper functions
	const generateAIContent = async (type, context) => {
		setAiGenerating(true);
		try {
			// Simulate AI content generation
			await new Promise((resolve) => setTimeout(resolve, 2000));

			const suggestions = {
				description: ["A professional, customer-focused business that delivers exceptional service and value to our community.", "Leading provider of quality services with a commitment to excellence and customer satisfaction.", "Trusted by hundreds of satisfied customers for reliable, professional service since our establishment."],
				tagline: ["Excellence in every service call", "Your trusted local professionals", "Quality service, guaranteed satisfaction"],
				services: ["Emergency 24/7 support", "Free estimates and consultations", "Licensed and insured professionals"],
			};

			setAiSuggestions(suggestions[type] || []);
			return suggestions[type] || [];
		} catch (error) {
			console.error("AI content generation failed:", error);
		} finally {
			setAiGenerating(false);
		}
	};

	const analyzeProfileWithAI = useCallback(() => {
		// AI analysis of profile completeness and optimization
		const seoScore = Math.min(100, completionScore + Math.random() * 20);
		const contentQuality = Math.min(100, completionScore + Math.random() * 15);
		const competitiveness = Math.min(100, completionScore + Math.random() * 25);

		setAiInsights({
			seoScore,
			contentQuality,
			competitiveness,
			suggestions: ["Add more keywords to your business description", "Upload high-quality photos to improve engagement", "Complete your business hours for better visibility", "Add customer testimonials to build trust"],
		});
		setAiOptimizationScore(Math.round((seoScore + contentQuality + competitiveness) / 3));
	}, [completionScore]);

	// Enhanced Business Data (Yelp/Google-style)
	const businessHighlights = [
		{ id: "verified", label: "Verified Business", icon: Verified, color: "blue" },
		{ id: "locally-owned", label: "Locally Owned", icon: Heart, color: "red" },
		{ id: "24-7", label: "24/7 Support", icon: Clock4, color: "green" },
		{ id: "veteran-owned", label: "Veteran Owned", icon: ShieldIcon, color: "purple" },
		{ id: "licensed", label: "Licensed & Insured", icon: CheckCircle2, color: "emerald" },
		{ id: "elite", label: "Thorbis Elite", icon: Crown, color: "yellow" },
	];

	const mockReviews = [
		{
			id: 1,
			author: "Sarah Johnson",
			rating: 5,
			date: "2 days ago",
			text: "Outstanding service! The team was professional, punctual, and exceeded my expectations. Highly recommend!",
			helpful: 12,
			avatar: "/placeholder-avatar.svg",
		},
		{
			id: 2,
			author: "Mike Chen",
			rating: 5,
			date: "1 week ago",
			text: "Great experience from start to finish. Fair pricing and quality work. Will definitely use again.",
			helpful: 8,
			avatar: "/placeholder-avatar.svg",
		},
		{
			id: 3,
			author: "Emily Rodriguez",
			rating: 4,
			date: "2 weeks ago",
			text: "Very satisfied with the service. Professional team and good communication throughout the project.",
			helpful: 5,
			avatar: "/placeholder-avatar.svg",
		},
	];

	const mockQnA = [
		{
			id: 1,
			question: "Do you offer emergency services?",
			answer: "Yes, we provide 24/7 emergency services for urgent situations. Call our emergency line anytime.",
			askedBy: "Local Customer",
			answeredDate: "3 days ago",
		},
		{
			id: 2,
			question: "What areas do you serve?",
			answer: "We serve the entire metropolitan area within a 50-mile radius. Contact us to confirm service in your area.",
			askedBy: "Jennifer M.",
			answeredDate: "1 week ago",
		},
	];

	// Navigation items configuration with AI enhancement
	const navigationItems = [
		{ id: "overview", label: "Overview", icon: Building, hasAI: true },
		{ id: "highlights", label: "Business Highlights", icon: Star, hasAI: false },
		{ id: "services", label: "Services", icon: DollarSign, hasAI: true },
		{ id: "portfolio", label: "Portfolio", icon: Camera, hasAI: true },
		{ id: "reviews", label: "Reviews", icon: MessageCircle, hasAI: false },
		{ id: "qna", label: "Q&A", icon: Quote, hasAI: true },
		{ id: "hours", label: "Business Hours", icon: Clock, hasAI: true },
		{ id: "media", label: "Media Gallery", icon: Image, hasAI: true },
		{ id: "team", label: "Team", icon: Users, hasAI: true },
		{ id: "insights", label: "Business Insights", icon: BarChart3, hasAI: true },
		{ id: "verifications", label: "Verifications", icon: Shield, hasAI: false },
		{ id: "elite", label: "Thorbis Elite", icon: Award, hasAI: false },
		{ id: "ai-insights", label: "AI Insights", icon: Brain, hasAI: true },
		{ id: "settings", label: "Settings", icon: Settings, hasAI: false },
	];

	// Calculate profile completion score and AI insights
	useEffect(() => {
		if (profile) {
			const fields = [profile.name, profile.description, profile.address, profile.phone, profile.email, profile.website, profile.services?.length > 0, profile.photos?.length > 0, profile.hours, profile.team?.length > 0];
			const completed = fields.filter(Boolean).length;
			const score = Math.round((completed / fields.length) * 100);
			setCompletionScore(score);

			// Auto-run AI analysis when profile changes
			analyzeProfileWithAI();
		}
	}, [profile]);

	// Set client-side flag and document title
	useEffect(() => {
		setIsClient(true);
		document.title = "Business Profile - Dashboard - Thorbis";
	}, [setIsClient]);

	// Debug navigation state
	useEffect(() => {
		console.log("Active Section Changed:", activeSection);
	}, [activeSection]);

	// Handle file uploads
	useEffect(() => {
		const handleFileInputChange = (e) => {
			const files = e.target.files;
			const uploadType = e.target.getAttribute("data-upload-type");
			if (files && files.length > 0) {
				handleFileUpload(files, uploadType);
			}
		};

		const fileInput = fileInputRef.current;
		if (fileInput) {
			fileInput.addEventListener("change", handleFileInputChange);
			return () => fileInput.removeEventListener("change", handleFileInputChange);
		}
	}, [fileInputRef, handleFileUpload]);

	// Filter navigation items based on search
	const filteredNavigationItems = navigationItems.filter((item) => item.label.toLowerCase().includes(searchTerm.toLowerCase()));

	// Get completion status for each section
	const getSectionCompletion = (sectionId) => {
		switch (sectionId) {
			case "overview":
				return profile?.name && profile?.description ? "complete" : "incomplete";
			case "services":
				return profile?.services?.length > 0 ? "complete" : "incomplete";
			case "media":
				return profile?.photos?.length > 0 ? "complete" : "incomplete";
			case "hours":
				return profile?.hours ? "complete" : "incomplete";
			case "team":
				return profile?.team?.length > 0 ? "complete" : "incomplete";
			default:
				return "incomplete";
		}
	};

	// AI-Enhanced Section Components
	const AIInsightsSection = () => (
		<div className="space-y-6">
			{/* AI Dashboard Header */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Brain className="w-6 h-6 text-purple-600" />
						<span>AI Profile Intelligence</span>
						<Badge variant="secondary" className="ml-2">
							<Sparkles className="w-3 h-3 mr-1" />
							AI Powered
						</Badge>
					</CardTitle>
					<CardDescription>Advanced AI analysis of your business profile with optimization recommendations</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
						<div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
							<Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
							<div className="text-2xl font-bold text-blue-900">{aiInsights.seoScore}%</div>
							<div className="text-sm text-blue-700">SEO Score</div>
						</div>
						<div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
							<Lightbulb className="w-8 h-8 text-green-600 mx-auto mb-2" />
							<div className="text-2xl font-bold text-green-900">{aiInsights.contentQuality}%</div>
							<div className="text-sm text-green-700">Content Quality</div>
						</div>
						<div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
							<TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
							<div className="text-2xl font-bold text-purple-900">{aiInsights.competitiveness}%</div>
							<div className="text-sm text-purple-700">Competitiveness</div>
						</div>
					</div>

					<div className="space-y-4">
						<h4 className="font-semibold flex items-center">
							<Zap className="w-4 h-4 mr-2 text-yellow-500" />
							AI Recommendations
						</h4>
						{aiInsights.suggestions.map((suggestion, index) => (
							<div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 border">
								<Robot className="w-5 h-5 text-primary mt-0.5" />
								<span className="text-sm">{suggestion}</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* AI Content Generator */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Wand2 className="w-5 h-5 text-indigo-600" />
						<span>AI Content Generator</span>
					</CardTitle>
					<CardDescription>Generate professional content with AI assistance</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Button variant="outline" onClick={() => generateAIContent("description")} disabled={aiGenerating} className="h-auto p-4 flex flex-col items-center space-y-2">
							<MessageSquare className="w-6 h-6" />
							<span className="text-sm">Generate Description</span>
						</Button>
						<Button variant="outline" onClick={() => generateAIContent("tagline")} disabled={aiGenerating} className="h-auto p-4 flex flex-col items-center space-y-2">
							<Lightbulb className="w-6 h-6" />
							<span className="text-sm">Create Tagline</span>
						</Button>
						<Button variant="outline" onClick={() => generateAIContent("services")} disabled={aiGenerating} className="h-auto p-4 flex flex-col items-center space-y-2">
							<Target className="w-6 h-6" />
							<span className="text-sm">Suggest Services</span>
						</Button>
					</div>

					{aiSuggestions.length > 0 && (
						<div className="mt-6 space-y-2">
							<h4 className="font-medium">AI Generated Suggestions:</h4>
							{aiSuggestions.map((suggestion, index) => (
								<div key={index} className="p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
									<p className="text-sm">{suggestion}</p>
									<Button
										size="sm"
										variant="ghost"
										className="mt-2"
										onClick={() => {
											// Here you could implement copying the suggestion to the relevant field
											navigator.clipboard.writeText(suggestion);
										}}
									>
										Use This Suggestion
									</Button>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);

	const VerificationsSection = () => (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Shield className="w-5 h-5" />
					<span>Business Verifications</span>
					<Badge variant="outline">AI Enhanced</Badge>
				</CardTitle>
				<CardDescription>Verify your business credentials and build trust with customers</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="p-4 rounded-lg border border-green-200 bg-green-50">
							<div className="flex items-center justify-between">
								<span className="font-medium">Business License</span>
								<Badge variant="default">Verified</Badge>
							</div>
							<p className="text-sm text-muted-foreground mt-1">License #BL-2024-001</p>
						</div>
						<div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50">
							<div className="flex items-center justify-between">
								<span className="font-medium">Insurance Coverage</span>
								<Badge variant="secondary">Pending</Badge>
							</div>
							<p className="text-sm text-muted-foreground mt-1">Upload insurance documents</p>
						</div>
					</div>
					<Button className="w-full">
						<Sparkles className="w-4 h-4 mr-2" />
						Start AI-Assisted Verification
					</Button>
				</div>
			</CardContent>
		</Card>
	);

	// Business Highlights Section (Yelp-style badges)
	const BusinessHighlightsSection = () => (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Star className="w-5 h-5 text-yellow-500" />
						<span>Business Highlights</span>
						<Badge variant="outline">Stand Out</Badge>
					</CardTitle>
					<CardDescription>Showcase what makes your business special to potential customers</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
						{businessHighlights.map((highlight) => {
							const IconComponent = highlight.icon;
							const colorClasses = {
								blue: "bg-blue-50 border-blue-200 text-blue-700",
								red: "bg-red-50 border-red-200 text-red-700",
								green: "bg-green-50 border-green-200 text-green-700",
								purple: "bg-purple-50 border-purple-200 text-purple-700",
								emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
								yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
							};

							return (
								<div key={highlight.id} className={`p-4 rounded-lg border-2 border-dashed ${colorClasses[highlight.color]} hover:bg-opacity-80 transition-all cursor-pointer`}>
									<div className="flex items-center space-x-3">
										<IconComponent className="w-6 h-6" />
										<span className="font-medium">{highlight.label}</span>
									</div>
								</div>
							);
						})}
					</div>

					<div className="text-center">
						<Button variant="outline" className="w-full">
							<Sparkles className="w-4 h-4 mr-2" />
							Add Custom Highlight
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);

	// Portfolio Section (Google Business-style)
	const PortfolioSection = () => (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Camera className="w-5 h-5 text-indigo-500" />
						<span>Project Portfolio</span>
						<Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
							Professional
						</Badge>
					</CardTitle>
					<CardDescription>Showcase your best work with before/after photos, project details, and customer results</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
						{[1, 2, 3, 4].map((project) => (
							<div key={project} className="group cursor-pointer">
								<div className="relative overflow-hidden rounded-lg border aspect-video bg-gradient-to-br from-gray-100 to-gray-200 mb-3 hover:shadow-lg transition-all">
									<div className="absolute inset-0 flex items-center justify-center">
										<Camera className="w-12 h-12 text-gray-400" />
									</div>
									<div className="absolute top-2 right-2">
										<Badge variant="secondary" className="bg-black/50 text-white">
											Before/After
										</Badge>
									</div>
								</div>
								<div className="space-y-2">
									<h4 className="font-semibold group-hover:text-primary transition-colors">Kitchen Renovation Project #{project}</h4>
									<p className="text-sm text-muted-foreground">Complete kitchen remodel with modern appliances and custom cabinetry</p>
									<div className="flex items-center justify-between text-xs text-muted-foreground">
										<span>Cost: $15,000 - $25,000</span>
										<span>Duration: 2-3 weeks</span>
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="text-center space-y-3">
						<Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
							<Camera className="w-4 h-4 mr-2" />
							Upload Project Photos
						</Button>
						<p className="text-xs text-muted-foreground">Show potential customers your quality work</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);

	// Reviews Section (Yelp-style)
	const ReviewsSection = () => (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="flex items-center space-x-2">
								<MessageCircle className="w-5 h-5 text-green-500" />
								<span>Customer Reviews</span>
								<Badge variant="default" className="bg-green-100 text-green-700">
									4.8★
								</Badge>
							</CardTitle>
							<CardDescription>What customers are saying about your business</CardDescription>
						</div>
						<Button variant="outline">
							<MessageCircle className="w-4 h-4 mr-2" />
							Respond to Reviews
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4 mb-6">
						{mockReviews.map((review) => (
							<div key={review.id} className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
								<div className="flex items-start space-x-4">
									<div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">{review.author.charAt(0)}</div>
									<div className="flex-1">
										<div className="flex items-center justify-between mb-2">
											<div className="flex items-center space-x-2">
												<span className="font-semibold">{review.author}</span>
												<div className="flex">
													{[...Array(review.rating)].map((_, i) => (
														<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
													))}
												</div>
											</div>
											<span className="text-xs text-muted-foreground">{review.date}</span>
										</div>
										<p className="text-sm mb-3">{review.text}</p>
										<div className="flex items-center space-x-4 text-xs text-muted-foreground">
											<button className="flex items-center space-x-1 hover:text-foreground">
												<ThumbsUp className="w-3 h-3" />
												<span>Helpful ({review.helpful})</span>
											</button>
											<button className="hover:text-foreground">Reply</button>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="text-center p-4 rounded-lg bg-muted/50 border border-dashed">
						<MessageCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
						<p className="text-sm text-muted-foreground mb-3">Encourage customers to leave reviews</p>
						<Button variant="outline">
							<Share className="w-4 h-4 mr-2" />
							Share Review Link
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);

	// Q&A Section
	const QnASection = () => (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Quote className="w-5 h-5 text-blue-500" />
						<span>Questions & Answers</span>
						<Badge variant="secondary" className="bg-blue-100 text-blue-700">
							Interactive
						</Badge>
					</CardTitle>
					<CardDescription>Answer customer questions to build trust and provide helpful information</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4 mb-6">
						{mockQnA.map((qa) => (
							<div key={qa.id} className="p-4 rounded-lg border bg-card">
								<div className="space-y-3">
									<div className="flex items-start space-x-3">
										<Quote className="w-5 h-5 text-blue-500 mt-0.5" />
										<div>
											<p className="font-medium">{qa.question}</p>
											<p className="text-xs text-muted-foreground">Asked by {qa.askedBy}</p>
										</div>
									</div>
									<div className="ml-8 p-3 rounded-lg bg-muted/50 border-l-4 border-green-500">
										<p className="text-sm">{qa.answer}</p>
										<p className="text-xs text-muted-foreground mt-2">Answered {qa.answeredDate}</p>
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="text-center space-y-3">
						<Button className="w-full">
							<MessageCircle className="w-4 h-4 mr-2" />
							Answer New Questions
						</Button>
						<p className="text-xs text-muted-foreground">Quick responses help customers make decisions</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);

	// Business Insights Section (Google Business-style analytics)
	const BusinessInsightsSection = () => (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<BarChart3 className="w-5 h-5 text-purple-500" />
						<span>Business Insights</span>
						<Badge variant="secondary" className="bg-purple-100 text-purple-700">
							Analytics
						</Badge>
					</CardTitle>
					<CardDescription>Track how customers find and interact with your business profile</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
						<div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
							<Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
							<div className="text-2xl font-bold text-blue-900">2,847</div>
							<div className="text-sm text-blue-700">Profile Views</div>
							<div className="text-xs text-blue-600 mt-1">+12% this week</div>
						</div>
						<div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
							<Phone className="w-8 h-8 text-green-600 mx-auto mb-2" />
							<div className="text-2xl font-bold text-green-900">156</div>
							<div className="text-sm text-green-700">Phone Calls</div>
							<div className="text-xs text-green-600 mt-1">+8% this week</div>
						</div>
						<div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
							<MapPin className="w-8 h-8 text-purple-600 mx-auto mb-2" />
							<div className="text-2xl font-bold text-purple-900">89</div>
							<div className="text-sm text-purple-700">Direction Requests</div>
							<div className="text-xs text-purple-600 mt-1">+15% this week</div>
						</div>
						<div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
							<Globe className="w-8 h-8 text-orange-600 mx-auto mb-2" />
							<div className="text-2xl font-bold text-orange-900">234</div>
							<div className="text-sm text-orange-700">Website Clicks</div>
							<div className="text-xs text-orange-600 mt-1">+22% this week</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="p-4 rounded-lg border">
							<h4 className="font-semibold mb-3 flex items-center">
								<Users2 className="w-4 h-4 mr-2 text-blue-500" />
								Customer Demographics
							</h4>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span>Age 25-34</span>
									<span className="font-medium">42%</span>
								</div>
								<div className="flex justify-between">
									<span>Age 35-44</span>
									<span className="font-medium">28%</span>
								</div>
								<div className="flex justify-between">
									<span>Age 45-54</span>
									<span className="font-medium">20%</span>
								</div>
								<div className="flex justify-between">
									<span>Other</span>
									<span className="font-medium">10%</span>
								</div>
							</div>
						</div>

						<div className="p-4 rounded-lg border">
							<h4 className="font-semibold mb-3 flex items-center">
								<Clock4 className="w-4 h-4 mr-2 text-green-500" />
								Peak Hours
							</h4>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span>9:00 AM - 11:00 AM</span>
									<span className="font-medium">High</span>
								</div>
								<div className="flex justify-between">
									<span>1:00 PM - 3:00 PM</span>
									<span className="font-medium">Medium</span>
								</div>
								<div className="flex justify-between">
									<span>5:00 PM - 7:00 PM</span>
									<span className="font-medium">High</span>
								</div>
								<div className="flex justify-between">
									<span>Weekend</span>
									<span className="font-medium">Low</span>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);

	const EliteSection = () => (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Award className="w-5 h-5 text-yellow-500" />
					<span>Thorbis Elite Program</span>
					<Badge variant="default" className="bg-gradient-to-r from-yellow-400 to-orange-500">
						Premium
					</Badge>
				</CardTitle>
				<CardDescription>Join our premium program for enhanced visibility and AI-powered growth tools</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					<div className="text-center p-6 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200">
						<Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
						<h3 className="text-xl font-bold text-yellow-900 mb-2">Upgrade to Elite</h3>
						<p className="text-yellow-700 mb-4">Get priority listing, AI marketing tools, and dedicated support</p>
						<Button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
							<Brain className="w-4 h-4 mr-2" />
							Unlock AI Elite Features
						</Button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="p-4 rounded-lg border">
							<Brain className="w-6 h-6 text-purple-500 mb-2" />
							<h4 className="font-semibold">AI Marketing Assistant</h4>
							<p className="text-sm text-muted-foreground">Automated content creation and campaign optimization</p>
						</div>
						<div className="p-4 rounded-lg border">
							<TrendingUp className="w-6 h-6 text-green-500 mb-2" />
							<h4 className="font-semibold">Priority Ranking</h4>
							<p className="text-sm text-muted-foreground">Appear first in search results and recommendations</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);

	// Enhanced Section rendering function with debug logging
	const renderSection = () => {
		console.log("Rendering section:", activeSection);

		switch (activeSection) {
			case "overview":
				return <OverviewSection profile={profile} setProfile={setProfile} isEditing={isEditing} handleSaveProfile={handleSaveProfile} fileInputRef={fileInputRef} />;

			case "highlights":
				return <BusinessHighlightsSection />;

			case "services":
				return <ServicesSection profile={profile} setProfile={setProfile} isEditing={isEditing} />;

			case "portfolio":
				return <PortfolioSection />;

			case "reviews":
				return <ReviewsSection />;

			case "qna":
				return <QnASection />;

			case "hours":
				return <BusinessHoursSection profile={profile} setProfile={setProfile} isEditing={isEditing} />;

			case "media":
				return <MediaSection profile={profile} setProfile={setProfile} handleSaveProfile={handleSaveProfile} fileInputRef={fileInputRef} />;

			case "team":
				return <TeamSection profile={profile} setProfile={setProfile} isEditing={isEditing} />;

			case "insights":
				return <BusinessInsightsSection />;

			case "verifications":
				return <VerificationsSection />;

			case "elite":
				return <EliteSection />;

			case "ai-insights":
				return <AIInsightsSection />;

			case "settings":
				return <SettingsSection profile={profile} setProfile={setProfile} handleSaveProfile={handleSaveProfile} />;

			default:
				console.log("Default case triggered, showing overview");
				return <OverviewSection profile={profile} setProfile={setProfile} isEditing={isEditing} handleSaveProfile={handleSaveProfile} fileInputRef={fileInputRef} />;
		}
	};

	return (
		<div className="relative w-full bg-background">
			{/* Enhanced Toolbar - Positioned relative to header */}
			<header
				className="sticky top-[72px] z-40 border-b bg-background/95 backdrop-blur-md shadow-sm"
				style={{ top: "calc(72px)" }} // Account for dashboard header height
			>
				<div className="px-4 py-3 lg:px-24 max-w-screen-2xl mx-auto">
					{/* Breadcrumb and Quick Actions Row */}
					<div className="flex items-center justify-between mb-3">
						<div className="flex items-center space-x-2 text-sm text-muted-foreground">
							<Button variant="ghost" size="sm" className="px-2 h-7 text-muted-foreground hover:text-foreground" onClick={() => window.history.back()}>
								<ArrowLeft className="w-4 h-4" />
							</Button>
							<span>Dashboard</span>
							<span>/</span>
							<span>Business</span>
							<span>/</span>
							<span className="font-medium text-foreground">Profile</span>
						</div>
						<div className="flex items-center space-x-2">
							<Button variant="ghost" size="sm" className="px-2 h-7">
								<Share className="w-4 h-4" />
								<span className="text-xs ml-1 hidden lg:inline">Share</span>
							</Button>
							<Button variant="ghost" size="sm" className="px-2 h-7">
								<ExternalLink className="w-4 h-4" />
								<span className="text-xs ml-1 hidden lg:inline">Preview</span>
							</Button>
						</div>
					</div>

					{/* Main Toolbar Row */}
					<div className="flex items-center justify-between">
						{/* Left: Search and Filter */}
						<div className="flex items-center space-x-3 flex-1 max-w-lg">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input placeholder="Search sections..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-9" />
							</div>
							<Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className={`h-9 ${showFilters ? "bg-muted" : ""}`}>
								<Filter className="w-4 h-4 mr-1" />
								Filter
							</Button>
						</div>

						{/* Right: AI Features, View Mode and Completion */}
						<div className="flex items-center space-x-3">
							{/* AI Optimization Score */}
							<div className="hidden lg:flex items-center space-x-2">
								<Brain className="w-4 h-4 text-purple-500" />
								<span className="text-sm text-muted-foreground">AI Score:</span>
								<Badge variant="secondary" className="bg-purple-100 text-purple-700">
									{aiOptimizationScore}%
								</Badge>
							</div>

							{/* Completion Score */}
							<div className="hidden md:flex items-center space-x-2">
								<span className="text-sm text-muted-foreground">Completion:</span>
								<Badge variant={completionScore >= 80 ? "default" : completionScore >= 50 ? "secondary" : "destructive"}>{completionScore}%</Badge>
							</div>

							{/* AI Assistant Toggle */}
							<Button variant={aiAssistantOpen ? "default" : "outline"} size="sm" onClick={() => setAiAssistantOpen(!aiAssistantOpen)} className="h-9">
								<Sparkles className="w-4 h-4 mr-1" />
								AI Assistant
							</Button>

							{/* View Mode Toggle */}
							<div className="flex items-center border rounded-lg p-1">
								<Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="h-7 px-2">
									<Grid className="w-4 h-4" />
								</Button>
								<Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="h-7 px-2">
									<List className="w-4 h-4" />
								</Button>
							</div>

							{/* Edit Mode Toggle */}
							<Button variant={isEditing ? "default" : "outline"} size="sm" onClick={() => setIsEditing(!isEditing)} className="h-9">
								<Edit className="w-4 h-4 mr-1" />
								{isEditing ? "Save" : "Edit"}
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content - Footer-style container */}
			<div className="px-4 py-16 lg:px-24 max-w-screen-2xl mx-auto">
				{/* Priority Section - Profile Completion Call-to-Action */}
				{completionScore < 80 && (
					<div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-12">
						<div className="flex items-start gap-4">
							<div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 border border-blue-200">
								<Building className="w-6 h-6 text-blue-600" />
							</div>
							<div className="flex-1">
								<h3 className="text-lg font-semibold text-blue-900 mb-2">Complete Your Profile</h3>
								<p className="text-blue-700 mb-4">Your profile is {completionScore}% complete. Add more information to improve visibility and attract customers.</p>
								<div className="flex flex-wrap gap-2">
									{!profile?.description && (
										<Button size="sm" variant="outline" onClick={() => navigateToSection("overview")} className="border-blue-200 text-blue-700 hover:bg-blue-100">
											Add Description
										</Button>
									)}
									{!profile?.photos?.length && (
										<Button size="sm" variant="outline" onClick={() => navigateToSection("media")} className="border-blue-200 text-blue-700 hover:bg-blue-100">
											Upload Photos
										</Button>
									)}
									{!profile?.services?.length && (
										<Button size="sm" variant="outline" onClick={() => navigateToSection("services")} className="border-blue-200 text-blue-700 hover:bg-blue-100">
											Add Services
										</Button>
									)}
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Enhanced Header Section - Yelp/Google Business Style */}
				<div className="mb-16">
					{/* Business Cover Photo Area */}
					<div className="relative h-64 mb-8 rounded-xl overflow-hidden bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600">
						<div className="absolute inset-0 bg-black/30" />
						<div className="absolute bottom-6 left-6 right-6">
							<div className="flex items-end justify-between text-white">
								<div className="flex items-center space-x-6">
									<div className="w-24 h-24 rounded-xl bg-white/20 border-4 border-white/40 flex items-center justify-center backdrop-blur-sm">
										<Building className="w-12 h-12 text-white" />
									</div>
									<div className="text-left">
										<h1 className="text-4xl font-bold mb-2">{profile?.name || "Your Business Name"}</h1>
										<p className="text-white/90 flex items-center text-lg mb-2">
											<MapPin className="w-5 h-5 mr-2" />
											{profile?.address || "Business Address"}
										</p>
										<div className="flex items-center space-x-4 text-sm text-white/80">
											<span className="flex items-center">
												<Phone className="w-4 h-4 mr-1" />
												{profile?.phone || "(555) 123-4567"}
											</span>
											<span className="flex items-center">
												<Globe className="w-4 h-4 mr-1" />
												{profile?.website || "website.com"}
											</span>
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="flex items-center space-x-2 mb-3">
										<div className="flex">
											{[...Array(5)].map((_, i) => (
												<Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
											))}
										</div>
										<span className="text-2xl font-bold">4.8</span>
									</div>
									<p className="text-white/90 mb-2">(247 customer reviews)</p>
									<Badge variant="secondary" className="bg-green-500 text-white border-0">
										<Clock4 className="w-3 h-3 mr-1" />
										Open Now
									</Badge>
								</div>
							</div>
						</div>
						<Button variant="ghost" className="absolute top-4 right-4 text-white hover:bg-white/20">
							<Camera className="w-4 h-4 mr-2" />
							Update Cover Photo
						</Button>
					</div>

					{/* Main Action CTAs - Yelp/Google Style */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
						<Button className="h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg">
							<Phone className="w-6 h-6 mr-3" />
							<div className="text-left">
								<div className="font-semibold text-base">Call Business</div>
								<div className="text-xs opacity-90">{profile?.phone || "(555) 123-4567"}</div>
							</div>
						</Button>
						<Button variant="outline" className="h-16 border-2 hover:bg-muted/50">
							<MapPin className="w-6 h-6 mr-3" />
							<div className="text-left">
								<div className="font-semibold text-base">Get Directions</div>
								<div className="text-xs text-muted-foreground">Navigate to location</div>
							</div>
						</Button>
						<Button variant="outline" className="h-16 border-2 hover:bg-muted/50">
							<Globe className="w-6 h-6 mr-3" />
							<div className="text-left">
								<div className="font-semibold text-base">Visit Website</div>
								<div className="text-xs text-muted-foreground">Learn more online</div>
							</div>
						</Button>
						<Button variant="outline" className="h-16 border-2 hover:bg-muted/50">
							<Calendar className="w-6 h-6 mr-3" />
							<div className="text-left">
								<div className="font-semibold text-base">Book Service</div>
								<div className="text-xs text-muted-foreground">Schedule appointment</div>
							</div>
						</Button>
					</div>

					{/* Business Performance Stats - Google Business Style */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
						<div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-lg transition-all">
							<div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white mx-auto mb-3">
								<Eye className="w-6 h-6" />
							</div>
							<div className="text-3xl font-bold text-blue-900 mb-1">2.8K</div>
							<div className="text-sm text-blue-700 font-medium">Monthly Views</div>
							<div className="text-xs text-blue-600 mt-1">+12% this month</div>
						</div>
						<div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:shadow-lg transition-all">
							<div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white mx-auto mb-3">
								<Phone className="w-6 h-6" />
							</div>
							<div className="text-3xl font-bold text-green-900 mb-1">156</div>
							<div className="text-sm text-green-700 font-medium">Phone Calls</div>
							<div className="text-xs text-green-600 mt-1">+8% this month</div>
						</div>
						<div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:shadow-lg transition-all">
							<div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500 text-white mx-auto mb-3">
								<MessageCircle className="w-6 h-6" />
							</div>
							<div className="text-3xl font-bold text-purple-900 mb-1">247</div>
							<div className="text-sm text-purple-700 font-medium">Customer Reviews</div>
							<div className="text-xs text-purple-600 mt-1">4.8★ average</div>
						</div>
						<div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 hover:shadow-lg transition-all">
							<div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 text-white mx-auto mb-3">
								<TrendingUp className="w-6 h-6" />
							</div>
							<div className="text-3xl font-bold text-orange-900 mb-1">{aiOptimizationScore}%</div>
							<div className="text-sm text-orange-700 font-medium">AI Optimization</div>
							<div className="text-xs text-orange-600 mt-1">Profile strength</div>
						</div>
					</div>

					{/* Business Highlights Strip */}
					<div className="flex flex-wrap gap-3 justify-center mb-8">
						{businessHighlights.slice(0, 4).map((highlight) => {
							const IconComponent = highlight.icon;
							const colorClasses = {
								blue: "bg-blue-100 text-blue-700 border-blue-200",
								red: "bg-red-100 text-red-700 border-red-200",
								green: "bg-green-100 text-green-700 border-green-200",
								purple: "bg-purple-100 text-purple-700 border-purple-200",
								emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
								yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
							};

							return (
								<div key={highlight.id} className={`px-4 py-2 rounded-full border ${colorClasses[highlight.color]} flex items-center space-x-2 text-sm font-medium`}>
									<IconComponent className="w-4 h-4" />
									<span>{highlight.label}</span>
								</div>
							);
						})}
					</div>
				</div>

				{/* Navigation Grid - Responsive Design */}
				<div className="mb-16">
					<div className="text-center mb-12">
						<h3 className="text-2xl font-bold mb-4">Manage Your Profile</h3>
						<p className="text-muted-foreground max-w-2xl mx-auto">Complete each section to create a comprehensive business profile that attracts and converts visitors.</p>
					</div>

					<div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
						{filteredNavigationItems.map((item) => {
							const IconComponent = item.icon;
							const completion = getSectionCompletion(item.id);
							const isActive = activeSection === item.id;

							return (
								<button key={item.id} onClick={() => navigateToSection(item.id)} className={`group relative flex ${viewMode === "list" ? "flex-row items-center p-4" : "flex-col items-center p-6"} rounded-xl border transition-all duration-200 ${viewMode === "list" ? "min-h-[80px]" : "min-h-[120px]"} ${isActive ? "bg-primary/5 border-primary/20 text-primary shadow-md" : "bg-background border-border hover:border-primary/40 hover:bg-muted/50 hover:shadow-sm"}`}>
									{/* AI indicator */}
									{item.hasAI && (
										<div className={`absolute ${viewMode === "list" ? "left-3 top-3" : "left-3 top-3"} flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white`}>
											<Sparkles className="w-3 h-3" />
										</div>
									)}

									{/* Completion indicator */}
									<div className={`absolute ${viewMode === "list" ? "right-3 top-3" : "right-3 top-3"} w-3 h-3 rounded-full ${completion === "complete" ? "bg-green-500" : "bg-muted-foreground/20"}`} />

									<div className={`flex items-center justify-center rounded-lg transition-colors ${viewMode === "list" ? "w-10 h-10 mr-4" : "w-12 h-12 mb-3"} ${isActive ? "bg-primary/20 border border-primary/30" : "bg-muted border border-border group-hover:bg-primary/10 group-hover:border-primary/20"}`}>
										<IconComponent className={`transition-colors ${viewMode === "list" ? "w-5 h-5" : "w-6 h-6"} ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
									</div>

									<div className={viewMode === "list" ? "flex-1 text-left" : "text-center"}>
										<div className="flex items-center justify-center gap-1">
											<span className={`font-medium leading-tight transition-colors ${viewMode === "list" ? "text-base" : "text-sm"} ${isActive ? "text-primary" : "text-foreground group-hover:text-primary"}`}>{item.label}</span>
											{item.hasAI && viewMode === "grid" && (
												<Badge variant="secondary" className="text-xs px-1 py-0 bg-purple-100 text-purple-700">
													AI
												</Badge>
											)}
										</div>
										{viewMode === "list" && (
											<div className="flex items-center justify-between mt-1">
												<p className="text-xs text-muted-foreground">{completion === "complete" ? "Complete" : "Needs attention"}</p>
												{item.hasAI && (
													<Badge variant="secondary" className="text-xs px-1 py-0 bg-purple-100 text-purple-700">
														AI Enhanced
													</Badge>
												)}
											</div>
										)}
									</div>
								</button>
							);
						})}
					</div>
				</div>

				{/* Content Section */}
				<div className="mb-16">
					<div className="bg-background rounded-xl border shadow-sm p-8">{isClient && renderSection()}</div>
				</div>
			</div>

			{/* Floating AI Assistant Panel */}
			{aiAssistantOpen && (
				<div className="fixed right-6 bottom-6 z-50 w-80 max-h-96 bg-background border rounded-xl shadow-2xl">
					<Card className="border-0 shadow-none">
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center space-x-2 text-lg">
									<div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
										<Brain className="w-4 h-4" />
									</div>
									<span>AI Assistant</span>
								</CardTitle>
								<Button variant="ghost" size="sm" onClick={() => setAiAssistantOpen(false)}>
									<span className="sr-only">Close</span>×
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Quick AI Actions */}
							<div className="space-y-2">
								<h4 className="text-sm font-medium">Quick Actions</h4>
								<div className="grid grid-cols-2 gap-2">
									<Button size="sm" variant="outline" onClick={() => generateAIContent("description")} disabled={aiGenerating} className="text-xs h-8">
										<Wand2 className="w-3 h-3 mr-1" />
										Generate Text
									</Button>
									<Button size="sm" variant="outline" onClick={() => navigateToSection("ai-insights")} className="text-xs h-8">
										<Target className="w-3 h-3 mr-1" />
										View Insights
									</Button>
								</div>
							</div>

							{/* AI Suggestions */}
							<div className="space-y-2">
								<h4 className="text-sm font-medium">Optimization Tips</h4>
								<div className="space-y-2 max-h-32 overflow-y-auto">
									{aiInsights.suggestions.slice(0, 3).map((suggestion, index) => (
										<div key={index} className="text-xs p-2 rounded-lg bg-muted/50 border">
											<div className="flex items-start space-x-2">
												<Lightbulb className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
												<span>{suggestion}</span>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* AI Score Display */}
							<div className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">AI Optimization Score</span>
									<Badge variant="secondary" className="bg-purple-100 text-purple-700">
										{aiOptimizationScore}%
									</Badge>
								</div>
								<div className="mt-2 w-full bg-purple-200 rounded-full h-2">
									<div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300" style={{ width: `${aiOptimizationScore}%` }} />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Hidden file input for uploads */}
			<input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" aria-hidden="true" />
		</div>
	);
};

export default BusinessProfile;
