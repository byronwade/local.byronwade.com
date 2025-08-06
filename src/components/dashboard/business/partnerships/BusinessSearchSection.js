/**
 * Business Search Section Component
 * Handles searching and selecting businesses for partnerships
 */

import React from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Search, X, Plus, Loader2, AlertTriangle, Building2 } from "lucide-react";

const BusinessCard = ({ business, onSelect }) => (
	<div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => onSelect(business)}>
		<div className="flex items-center space-x-3">
			<Avatar className="w-12 h-12">
				<AvatarImage src={business.logo} alt={business.name} />
				<AvatarFallback>
					<Building2 className="w-6 h-6" />
				</AvatarFallback>
			</Avatar>
			<div className="flex-1 min-w-0">
				<h4 className="font-medium text-sm truncate">{business.name}</h4>
				<p className="text-xs text-muted-foreground truncate">{business.description}</p>
				{business.categories && business.categories.length > 0 && (
					<div className="flex flex-wrap gap-1 mt-1">
						{business.categories.slice(0, 2).map((category) => (
							<Badge key={category} variant="outline" className="text-xs">
								{category}
							</Badge>
						))}
					</div>
				)}
			</div>
			<Button size="sm" variant="outline">
				<Plus className="w-4 h-4" />
			</Button>
		</div>
	</div>
);

const BusinessSearchSection = ({ isSearching, searchQuery, setSearchQuery, searchResults, hasSearched, showNoResults, onBusinessSelect, onClose }) => {
	return (
		<Card className="border-dashed">
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<Search className="w-5 h-5" />
						<span>Search for Business Partners</span>
					</div>
					<Button variant="outline" size="sm" onClick={onClose}>
						<X className="w-4 h-4" />
					</Button>
				</CardTitle>
				<CardDescription>Search for businesses to add as partnerships</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Search Input */}
				<div className="space-y-2">
					<Label htmlFor="search">Search Businesses</Label>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input id="search" placeholder="Search by business name, category, or description..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" suppressHydrationWarning />
					</div>
				</div>

				{/* Search Results */}
				{hasSearched && (
					<div className="space-y-4">
						{isSearching ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="w-6 h-6 animate-spin" />
								<span className="ml-2">Searching...</span>
							</div>
						) : showNoResults ? (
							<div className="text-center py-8">
								<AlertTriangle className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
								<h3 className="text-lg font-medium mb-1">No Results Found</h3>
								<p className="text-muted-foreground">We couldn't find any businesses matching "{searchQuery}". Try searching with different keywords.</p>
							</div>
						) : (
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="text-sm font-medium">Search Results ({searchResults.length})</h3>
								</div>
								<div className="space-y-2 max-h-64 overflow-y-auto">
									{searchResults.map((business) => (
										<BusinessCard key={business.id} business={business} onSelect={onBusinessSelect} />
									))}
								</div>
							</div>
						)}
					</div>
				)}

				{/* Search Instructions */}
				{!hasSearched && (
					<div className="text-center py-8 text-muted-foreground">
						<Search className="w-8 h-8 mx-auto mb-2" />
						<p>Start typing to search for businesses to add as partners</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default BusinessSearchSection;
