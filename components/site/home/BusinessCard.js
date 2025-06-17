import Image from "next/image";
import Link from "next/link";
import { Star, Heart } from "react-feather";

export default function BusinessCard({ business, disabled }) {
	const slug =
		business.slug ||
		business.name
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.trim();

	const rating = parseFloat(business.rating);

	return (
		<Link href={`/biz/${slug}`} className={`group block w-full ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
			<div className="w-full">
				{/* Image Section - Airbnb style */}
				<div className="relative aspect-square overflow-hidden rounded-xl mb-3">
					<Image className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" src={business.image} alt={business.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />

					{/* Heart icon - Airbnb style favorite */}
					<button className="absolute top-3 right-3 p-2 rounded-full bg-transparent hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200 group">
						<Heart className="w-5 h-5 text-white drop-shadow-lg hover:fill-red-500 hover:text-red-500 transition-colors duration-200" />
					</button>

					{/* Status badge - minimal style */}
					{business.status === "Open" && (
						<div className="absolute bottom-3 left-3">
							<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md text-xs font-medium shadow-sm">Open now</div>
						</div>
					)}
				</div>

				{/* Content Section - Airbnb minimal style */}
				<div className="space-y-1">
					{/* Location and Rating - top line */}
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
							<span className="text-sm font-medium truncate">{business.location || "Local Business"}</span>
						</div>
						<div className="flex items-center space-x-1 flex-shrink-0">
							<Star className="w-3.5 h-3.5 text-foreground fill-current" />
							<span className="text-sm font-medium text-foreground">{business.rating}</span>
						</div>
					</div>

					{/* Business name */}
					<h3 className="text-gray-600 dark:text-gray-400 text-sm leading-tight line-clamp-1">{business.name}</h3>

					{/* Description or category */}
					<p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">{business.description || business.category || "Local business"}</p>

					{/* Price */}
					<div className="pt-1">
						<span className="text-foreground font-semibold text-sm">{business.price || "$$"}</span>
						<span className="text-gray-600 dark:text-gray-400 text-sm"> per visit</span>
					</div>
				</div>
			</div>
		</Link>
	);
}
