"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin } from "react-feather";

export default function BusinessCard({ business, disabled }) {
	const slug =
		business.slug ||
		business.name
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.trim();

	const rating = parseFloat(business.rating) || 0;

	// Ensure consistent data with fallbacks
	const consistentBusiness = {
		name: business.name || "Business Name",
		category: business.category || "Local Business",
		location: business.location || "Location",
		rating: rating > 0 ? rating.toFixed(1) : "0.0",
		reviewCount: business.reviewCount || 0,
		image: business.image || "/placeholder-business.svg",
	};

	return (
		<Link href={`/biz/${slug}`} className={`group/card block w-full ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
			{/* Minimalistic card with larger image */}
			<div className="relative w-full bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-200/60 dark:border-neutral-800 group-hover/card:shadow-lg transition-all duration-300">
				{/* Large image section - takes up most of the card */}
				<div className="relative aspect-[3/2] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
					<Image
						className="object-cover w-full h-full transition-transform duration-300 group-hover/card:scale-105"
						src={consistentBusiness.image}
						alt={consistentBusiness.name}
						width={400}
						height={267}
						onError={(e) => {
							e.target.src = "/placeholder-business.svg";
						}}
					/>

					{/* Simple rating badge in top right */}
					{rating > 0 && (
						<div className="absolute top-3 right-3">
							<div className="flex items-center gap-1 px-2 py-1 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm rounded-lg shadow-sm">
								<Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
								<span className="text-xs font-medium text-foreground">{consistentBusiness.rating}</span>
							</div>
						</div>
					)}
				</div>

				{/* Clean, minimal info section */}
				<div className="p-4">
					{/* Business name */}
					<h3 className="font-semibold text-base text-foreground line-clamp-1 mb-1 group-hover/card:text-primary transition-colors duration-200">{consistentBusiness.name}</h3>

					{/* Category */}
					<p className="text-sm text-muted-foreground mb-2">{consistentBusiness.category}</p>

					{/* Location and reviews on same line */}
					<div className="flex items-center justify-between text-xs text-muted-foreground">
						<div className="flex items-center gap-1">
							<MapPin className="w-3 h-3 flex-shrink-0" />
							<span className="truncate">{consistentBusiness.location}</span>
						</div>

						{consistentBusiness.reviewCount > 0 && <span className="flex-shrink-0">({consistentBusiness.reviewCount} reviews)</span>}
					</div>
				</div>
			</div>
		</Link>
	);
}
