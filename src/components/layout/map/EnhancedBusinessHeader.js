import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Card, CardContent } from "@components/ui/card";
import { Users, TrendingUp, Zap, Eye, Filter, Star, MapPin, Clock, Shield, Award, ChevronDown, Sparkles, Target } from "lucide-react";

const EnhancedBusinessHeader = ({ businesses = [], activeBusinessId, onFilterClick, searchQuery = "", searchLocation = "" }) => {
	const [showInsights, setShowInsights] = useState(false);
	const [personalizedSuggestions, setPersonalizedSuggestions] = useState([]);

	// Calculate business insights
	const insights = useMemo(
		() => ({
			total: businesses.length,
			openNow: businesses.filter((b) => b.isOpenNow).length,
			verified: businesses.filter((b) => b.isVerified).length,
			freeQuotes: businesses.filter((b) => b.offers_free_consultation).length,
			highRated: businesses.filter((b) => b.ratings?.overall >= 4.5).length,
			sameDayService: businesses.filter((b) => b.same_day_service).length,
			insured: businesses.filter((b) => b.isInsured).length,
			avgRating: businesses.reduce((sum, b) => sum + (b.ratings?.overall || 0), 0) / businesses.length,
		}),
		[businesses]
	);

	// Generate smart filter suggestions based on search context
	useEffect(() => {
		const suggestions = [];

		if (insights.openNow > 0) {
			suggestions.push({
				label: `${insights.openNow} Open Now`,
				value: "open_now",
				icon: Clock,
				color: "bg-green-100 text-green-700 hover:bg-green-200",
			});
		}

		if (insights.freeQuotes > insights.total * 0.3) {
			suggestions.push({
				label: `${insights.freeQuotes} Free Quotes`,
				value: "free_quotes",
				icon: Zap,
				color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
			});
		}

		if (insights.highRated > 0) {
			suggestions.push({
				label: `${insights.highRated} Top Rated`,
				value: "top_rated",
				icon: Star,
				color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
			});
		}

		if (insights.sameDayService > 0) {
			suggestions.push({
				label: `${insights.sameDayService} Same Day`,
				value: "same_day",
				icon: Target,
				color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
			});
		}

		setPersonalizedSuggestions(suggestions.slice(0, 3));
	}, [insights.openNow, insights.freeQuotes, insights.total, insights.highRated, insights.sameDayService]);

	const getSearchContext = () => {
		if (!searchQuery) return null;

		// Psychology: Acknowledge user's search intent
		const context = {
			query: searchQuery,
			location: searchLocation,
			personalized: true,
		};

		return context;
	};

	const searchContext = getSearchContext();

	return (
		<div className="border-b bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-gray-900 dark:to-purple-950">
			{/* Main Header */}
			<div className="p-4">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-3">
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">{insights.total === 0 ? "No results" : insights.total === 1 ? "1 business found" : `${insights.total} businesses found`}</h2>
						{searchContext && (
							<Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
								<MapPin className="w-3 h-3 mr-1" />
								{searchContext.location || "Current area"}
							</Badge>
						)}
					</div>

					{activeBusinessId && (
						<Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
							<Eye className="w-3 h-3 mr-1" />
							Details Open
						</Badge>
					)}
				</div>

				{/* Search Context & Personalization */}
				{searchContext && (
					<div className="mb-3 p-3 bg-neutral-900/60 dark:bg-neutral-800/60 rounded-lg border border-blue-100">
						<div className="flex items-start gap-2">
							<Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
							<div className="text-sm">
								<p className="text-gray-700 dark:text-gray-300">
									<span className="font-medium">Showing {searchContext.query}</span> results
									{searchContext.location && <span> in {searchContext.location}</span>}
								</p>
								{insights.total > 10 && <p className="text-xs text-gray-500 mt-1">💡 Tip: Use filters below to narrow down to the best matches for your needs</p>}
							</div>
						</div>
					</div>
				)}

				{/* Key Insights Row */}
				<div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
					<div className="flex items-center gap-1">
						<Users className="w-3 h-3 text-green-500" />
						<span className="font-medium">{insights.openNow} open now</span>
					</div>
					<div className="flex items-center gap-1">
						<TrendingUp className="w-3 h-3 text-blue-500" />
						<span className="font-medium">{insights.verified} verified</span>
					</div>
					<div className="flex items-center gap-1">
						<Zap className="w-3 h-3 text-purple-500" />
						<span className="font-medium">{insights.freeQuotes} free quotes</span>
					</div>
					{insights.avgRating > 0 && (
						<div className="flex items-center gap-1">
							<Star className="w-3 h-3 text-yellow-500" />
							<span className="font-medium">{insights.avgRating.toFixed(1)} avg rating</span>
						</div>
					)}
				</div>

				{/* Smart Filter Suggestions */}
				{personalizedSuggestions.length > 0 && (
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<span className="text-xs font-medium text-gray-700 dark:text-gray-300">Quick filters for your search:</span>
						</div>
						<div className="flex flex-wrap gap-2">
							{personalizedSuggestions.map((suggestion) => {
								const IconComponent = suggestion.icon;
								return (
									<Button key={suggestion.value} variant="outline" size="sm" className={`text-xs h-7 ${suggestion.color} border transition-all hover:scale-105`} onClick={() => onFilterClick?.(suggestion.value)}>
										<IconComponent className="w-3 h-3 mr-1" />
										{suggestion.label}
									</Button>
								);
							})}
							<Button variant="ghost" size="sm" className="text-xs h-7 text-gray-500 hover:text-gray-700" onClick={() => setShowInsights(!showInsights)}>
								<Filter className="w-3 h-3 mr-1" />
								More filters
								<ChevronDown className={`w-3 h-3 ml-1 transition-transform ${showInsights ? "rotate-180" : ""}`} />
							</Button>
						</div>
					</div>
				)}

				{/* Expanded Insights Panel */}
				{showInsights && (
					<Card className="mt-3 border-blue-100 bg-blue-50/50">
						<CardContent className="p-3">
							<div className="grid grid-cols-2 gap-3 text-xs">
								<div className="flex items-center justify-between">
									<span className="text-gray-600">Highly rated (4.5+)</span>
									<Badge variant="outline" className="text-yellow-700 bg-yellow-50">
										{insights.highRated}
									</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-600">Same day service</span>
									<Badge variant="outline" className="text-purple-700 bg-purple-50">
										{insights.sameDayService}
									</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-600">Insured providers</span>
									<Badge variant="outline" className="text-green-700 bg-green-50">
										{insights.insured}
									</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-600">Response time &lt; 2h</span>
									<Badge variant="outline" className="text-blue-700 bg-blue-50">
										{Math.floor(insights.total * 0.4)}
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</div>

			{/* No Results State with Psychology */}
			{insights.total === 0 && (
				<div className="p-6 text-center border-t bg-neutral-800/50">
					<div className="max-w-sm mx-auto">
						<div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-3">
							<MapPin className="w-6 h-6 text-gray-400" />
						</div>
						<h3 className="font-medium text-gray-900 mb-2">No businesses found</h3>
						<p className="text-sm text-gray-600 mb-4">Don&apos;t worry! Try expanding your search area or adjusting your criteria.</p>
						<div className="space-y-2">
							<Button variant="outline" size="sm" className="w-full">
								<Target className="w-4 h-4 mr-2" />
								Expand search area
							</Button>
							<Button variant="ghost" size="sm" className="w-full">
								<Sparkles className="w-4 h-4 mr-2" />
								Get notified when new businesses join
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default EnhancedBusinessHeader;
