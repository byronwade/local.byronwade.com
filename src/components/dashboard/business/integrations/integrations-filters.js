/**
 * IntegrationsFilters Component
 * Filtering and search interface for integrations
 * Extracted from large page for better organization
 */

"use client";

import React from "react";
import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Search } from "lucide-react";

export const IntegrationsFilters = ({ searchTerm, selectedCategory, selectedIndustry, onSearchChange, onCategoryChange, onIndustryChange, categories = [], industries = [] }) => {
	return (
		<Card>
			<CardContent className="p-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* Search */}
					<div className="space-y-2">
						<Label htmlFor="search" className="text-sm font-medium">
							Search Features
						</Label>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<Input id="search" placeholder="Search features..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className="pl-10" />
						</div>
					</div>

					{/* Category Filter */}
					<div className="space-y-2">
						<Label htmlFor="category" className="text-sm font-medium">
							Category
						</Label>
						<Select value={selectedCategory} onValueChange={onCategoryChange}>
							<SelectTrigger id="category">
								<SelectValue placeholder="All Categories" />
							</SelectTrigger>
							<SelectContent>
								{categories.map((category) => (
									<SelectItem key={category} value={category}>
										{category}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Industry Filter */}
					<div className="space-y-2">
						<Label htmlFor="industry" className="text-sm font-medium">
							Industry
						</Label>
						<Select value={selectedIndustry} onValueChange={onIndustryChange}>
							<SelectTrigger id="industry">
								<SelectValue placeholder="All Industries" />
							</SelectTrigger>
							<SelectContent>
								{industries.map((industry) => (
									<SelectItem key={industry} value={industry}>
										{industry}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
