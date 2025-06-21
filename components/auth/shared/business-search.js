"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Alert, AlertDescription } from "@components/ui/alert";
import { ScrollArea } from "@components/ui/scroll-area";
import { Separator } from "@components/ui/separator";
import { Search, MapPin, Phone, Globe, Star, Building2, CheckCircle, AlertTriangle, Plus, Loader2, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useBusinessStore from "@store/useBusinessStore";
import { useToast } from "@components/ui/use-toast";
import Image from "next/image";

export default function BusinessSearch() {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [isSearching, setIsSearching] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);
	const [selectedBusiness, setSelectedBusiness] = useState(null);
	const [showNoResults, setShowNoResults] = useState(false);
	const searchTimeoutRef = useRef(null);

	const { filteredBusinesses, fetchBusinesses, initializeWithMockData } = useBusinessStore();
	const { toast } = useToast();

	// Initialize mock data
	useEffect(() => {
		initializeWithMockData();
	}, [initializeWithMockData]);

	// Debounced search function
	const debouncedSearch = useCallback(
		async (query) => {
			if (!query.trim()) {
				setSearchResults([]);
				setShowNoResults(false);
				setHasSearched(false);
				return;
			}

			setIsSearching(true);
			setHasSearched(true);

			try {
				// Simulate API delay
				await new Promise((resolve) => setTimeout(resolve, 500));

				// Search through mock businesses
				const results = filteredBusinesses.filter((business) => business.name.toLowerCase().includes(query.toLowerCase()) || business.description?.toLowerCase().includes(query.toLowerCase()) || business.categories?.some((cat) => cat.toLowerCase().includes(query.toLowerCase()))).slice(0, 10); // Limit to 10 results

				setSearchResults(results);
				setShowNoResults(results.length === 0);
			} catch (error) {
				console.error("Search error:", error);
				setSearchResults([]);
				setShowNoResults(true);
			} finally {
				setIsSearching(false);
			}
		},
		[filteredBusinesses]
	);

	// Debounce search input
	useEffect(() => {
		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}

		searchTimeoutRef.current = setTimeout(() => {
			debouncedSearch(searchQuery);
		}, 300);

		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, [searchQuery, debouncedSearch]);

	const handleBusinessSelect = (business) => {
		setSelectedBusiness(business);
	};

	const handleClaimBusiness = (business) => {
		// Here you would typically redirect to a claim form with the business pre-filled
		console.log("Claiming business:", business);

		// Show toast notification
		toast({
			title: "Business Selected",
			description: `Selected ${business.name} for claiming`,
		});

		// Set the selected business
		setSelectedBusiness(business);

		// Automatically advance to next step after a short delay
		setTimeout(() => {
			// Trigger the next step in the parent form
			// This will work if the parent component has a way to advance steps
			const event = new CustomEvent("businessSelected", {
				detail: { business },
			});
			window.dispatchEvent(event);

			toast({
				title: "Proceeding to Verification",
				description: "Please complete the verification process",
			});
		}, 500);
	};

	const handleAddNewBusiness = () => {
		// Redirect to add business form
		window.location.href = "/add-a-business";
	};

	const BusinessCard = ({ business, isSelected, onSelect, onClaim }) => (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
			<Card className={`cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected ? "border-primary bg-primary/5 shadow-md" : "hover:border-primary/50"}`} onClick={() => onSelect(business)}>
				<CardContent className="p-4">
					{/* Mobile-first layout */}
					<div className="space-y-3">
						{/* Header Row: Logo, Name, Rating */}
						<div className="flex items-start gap-3">
							{/* Business Logo/Image */}
							<div className="flex-shrink-0">
								{business.logo ? (
									<div className="relative w-14 h-14">
										<Image src={business.logo} alt={`${business.name} logo`} fill className="rounded-lg object-cover border border-border" />
									</div>
								) : (
									<div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center border border-border">
										<Building2 className="w-7 h-7 text-muted-foreground" />
									</div>
								)}
							</div>

							{/* Business Name and Rating */}
							<div className="flex-1 min-w-0">
								<div className="flex items-start justify-between">
									<CardTitle className="text-lg font-semibold text-foreground leading-tight">{business.name}</CardTitle>
									{business.ratings?.overall && (
										<div className="flex items-center gap-1 ml-2 flex-shrink-0">
											<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
											<span className="text-sm font-medium">{business.ratings.overall}</span>
										</div>
									)}
								</div>

								{business.reviewCount && <p className="text-sm text-muted-foreground mt-1">{business.reviewCount} reviews</p>}
							</div>
						</div>

						{/* Contact Info Row */}
						<div className="flex flex-col gap-2">
							{business.address && (
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<MapPin className="w-4 h-4 flex-shrink-0" />
									<span className="truncate">{business.address.split(",")[0]}</span>
								</div>
							)}
							{business.phone && (
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Phone className="w-4 h-4 flex-shrink-0" />
									<span>{business.phone}</span>
								</div>
							)}
						</div>

						{/* Action Buttons Row */}
						<div className="flex gap-2 pt-2">
							<Button
								size="sm"
								onClick={(e) => {
									e.stopPropagation();
									onClaim(business);
								}}
								className="flex-1"
							>
								<CheckCircle className="w-4 h-4 mr-2" />
								Claim This Business
							</Button>
							{business.website && (
								<Button
									variant="outline"
									size="sm"
									onClick={(e) => {
										e.stopPropagation();
										window.open(business.website, "_blank");
									}}
									className="flex-shrink-0"
								>
									<ExternalLink className="w-4 h-4" />
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);

	return (
		<div className="space-y-6">
			<div className="text-center space-y-2">
				<h2 className="text-2xl font-bold">Search for Your Business</h2>
				<p className="text-muted-foreground">Find your business in our directory to claim ownership and start managing your profile</p>
			</div>

			{/* Search Input */}
			<div className="relative">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
					<Input placeholder="Search for your business name, category, or description..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 h-12 text-base" />
					{isSearching && <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />}
					{searchQuery && !isSearching && (
						<Button variant="ghost" size="sm" onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0">
							<X className="w-4 h-4" />
						</Button>
					)}
				</div>
			</div>

			{/* Search Results */}
			<AnimatePresence>
				{hasSearched && (
					<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
						{/* Results Header */}
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">{isSearching ? "Searching..." : `Found ${searchResults.length} businesses`}</h3>
							{searchResults.length > 0 && (
								<Badge variant="secondary">
									{searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
								</Badge>
							)}
						</div>

						{/* No Results */}
						{showNoResults && !isSearching && (
							<Alert>
								<AlertTriangle className="h-4 w-4" />
								<AlertDescription>No businesses found matching &quot;{searchQuery}&quot;. You can add your business to our directory.</AlertDescription>
							</Alert>
						)}

						{/* Results List */}
						{searchResults.length > 0 && (
							<ScrollArea className="h-96">
								<div className="space-y-3 pr-4">
									{searchResults.map((business, index) => (
										<BusinessCard key={business.id || index} business={business} isSelected={selectedBusiness?.id === business.id} onSelect={handleBusinessSelect} onClaim={handleClaimBusiness} />
									))}
								</div>
							</ScrollArea>
						)}
					</motion.div>
				)}
			</AnimatePresence>

			{/* Add New Business Section */}
			<Separator />
			<div className="text-center space-y-4">
				<div className="space-y-2">
					<h3 className="text-lg font-semibold">Can&apos;t find your business?</h3>
					<p className="text-muted-foreground">Add your business to our directory and start connecting with customers</p>
				</div>
				<Button onClick={handleAddNewBusiness} className="w-full max-w-md" size="lg">
					<Plus className="w-4 h-4 mr-2" />
					Add New Business
				</Button>
			</div>

			{/* Help Text */}
			<Alert>
				<Building2 className="h-4 w-4" />
				<AlertDescription>
					<strong>Why claim your business?</strong> Claiming allows you to manage your profile, respond to reviews, update information, and access business analytics.
				</AlertDescription>
			</Alert>
		</div>
	);
}
