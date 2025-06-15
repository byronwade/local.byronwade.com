import React, { useEffect, useRef, useCallback, memo, forwardRef, Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { ScrollArea } from "@components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip";
import { Bookmark, Circle, Clock, ExternalLink, Info, Share2, Star, Phone, MapPin, Navigation, Heart, Eye, Award, DollarSign, Users, MessageCircle, Camera, Globe, Plus } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";
import useBusinessStore from "@store/useBusinessStore";
import useMapStore from "@store/useMapStore";
import SkeletonBusinessCard from "@components/site/map/SkeletonBusinessCard";

const BusinessCard = memo(
	forwardRef(({ business, isActive, handleClick, isLoading, onHover, onLeave }, ref) => {
		const [isHovered, setIsHovered] = useState(false);
		const [isFavorited, setIsFavorited] = useState(false);
		const [imageError, setImageError] = useState(false);

		const handleMouseEnter = () => {
			setIsHovered(true);
			onHover?.(business);
		};

		const handleMouseLeave = () => {
			setIsHovered(false);
			onLeave?.(business);
		};

		const handleShare = async (e) => {
			e.stopPropagation();
			if (navigator.share) {
				try {
					await navigator.share({
						title: business.name,
						text: `Check out ${business.name}`,
						url: `${window.location.origin}/biz/${business.id}`,
					});
				} catch (err) {
					console.log("Error sharing:", err);
				}
			} else {
				navigator.clipboard.writeText(`${window.location.origin}/biz/${business.id}`);
			}
		};

		const handleCall = (e) => {
			e.stopPropagation();
			if (business.phone) {
				window.open(`tel:${business.phone}`, "_self");
			}
		};

		const handleDirections = (e) => {
			e.stopPropagation();
			if (business.coordinates) {
				const { lat, lng } = business.coordinates;
				window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
			}
		};

		const renderStars = (rating) => {
			return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : i < rating ? "fill-yellow-200 text-yellow-400" : "text-gray-300"}`} />);
		};

		return (
			<div className="px-4" ref={ref}>
				<div id={`business-${business.id}`} className={`relative w-full mb-4 cursor-pointer transform transition-all duration-200 ease-in-out ${isActive ? "scale-105 shadow-lg ring-2 ring-primary ring-opacity-50" : isHovered ? "scale-102 shadow-md" : "hover:shadow-sm"}`} onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
					<div className="relative w-full overflow-hidden border rounded-lg shadow bg-card text-card-foreground">
						{/* Sponsored Badge */}
						{business.isSponsored && (
							<div className="absolute top-2 right-2 z-10">
								<Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
									<Award className="w-3 h-3 mr-1" />
									Sponsored
								</Badge>
							</div>
						)}

						{/* Main Content */}
						<div className="flex flex-row items-start gap-4 p-4">
							{/* Business Logo/Image */}
							<div className="flex-shrink-0">
								<div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
									{business.logo && !imageError ? (
										<Image src={business.logo} alt={`${business.name} logo`} fill className="object-cover" onError={() => setImageError(true)} />
									) : (
										<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
											<span className="text-lg font-bold text-primary">{business.name.charAt(0)}</span>
										</div>
									)}
									{business.images && business.images.length > 0 && (
										<div className="absolute bottom-1 right-1 bg-black/50 text-white px-1 py-0.5 rounded text-xs">
											<Camera className="w-2 h-2" />
										</div>
									)}
								</div>
							</div>

							{/* Business Info */}
							<div className="flex-1 min-w-0">
								<div className="flex items-start justify-between mb-2">
									<h3 className="text-lg font-semibold leading-tight truncate pr-2">{business.name}</h3>
									<div className="flex items-center gap-1 flex-shrink-0">
										{business.ratings?.overall && (
											<div className="flex items-center gap-1">
												<div className="flex">{renderStars(business.ratings.overall)}</div>
												<span className="text-sm font-medium">{business.ratings.overall}</span>
											</div>
										)}
									</div>
								</div>

								{/* Categories */}
								<div className="flex flex-wrap gap-1 mb-2">
									{Array.isArray(business.categories) &&
										business.categories.slice(0, 3).map((category, index) => (
											<Badge key={index} variant="outline" className="text-xs px-2 py-0">
												{category}
											</Badge>
										))}
									{business.categories && business.categories.length > 3 && (
										<Badge variant="outline" className="text-xs px-2 py-0">
											+{business.categories.length - 3}
										</Badge>
									)}
								</div>

								{/* Description */}
								<p className="text-sm text-muted-foreground line-clamp-2 mb-3">{business.description}</p>

								{/* Quick Info */}
								<div className="flex items-center gap-3 text-sm">
									<div className="flex items-center gap-1">
										<div className={`w-2 h-2 rounded-full ${business.isOpenNow ? "bg-green-500" : "bg-red-500"}`}></div>
										<span className={business.isOpenNow ? "text-green-600" : "text-red-600"}>{business.isOpenNow ? "Open" : "Closed"}</span>
									</div>
									{business.price && (
										<div className="flex items-center gap-1">
											<DollarSign className="w-3 h-3 text-gray-500" />
											<span className="text-gray-600">{business.price}</span>
										</div>
									)}
									{business.address && (
										<div className="flex items-center gap-1 truncate">
											<MapPin className="w-3 h-3 text-gray-500 flex-shrink-0" />
											<span className="text-gray-600 truncate text-xs">{business.address.split(",")[0]}</span>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Action Buttons - Show on hover or when active */}
						<div className={`px-4 pb-4 transition-all duration-200 ${isHovered || isActive ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden"}`}>
							<div className="flex gap-2">
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button size="sm" variant="outline" onClick={handleCall} disabled={!business.phone} className="flex-1">
												<Phone className="w-3 h-3 mr-1" />
												Call
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>{business.phone || "No phone number"}</p>
										</TooltipContent>
									</Tooltip>

									<Tooltip>
										<TooltipTrigger asChild>
											<Button size="sm" variant="outline" onClick={handleDirections} className="flex-1">
												<Navigation className="w-3 h-3 mr-1" />
												Directions
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Get directions</p>
										</TooltipContent>
									</Tooltip>

									<Tooltip>
										<TooltipTrigger asChild>
											<Button size="sm" variant="outline" onClick={handleShare}>
												<Share2 className="w-3 h-3" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Share business</p>
										</TooltipContent>
									</Tooltip>

									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												size="sm"
												variant="outline"
												onClick={(e) => {
													e.stopPropagation();
													setIsFavorited(!isFavorited);
												}}
											>
												<Heart className={`w-3 h-3 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>{isFavorited ? "Remove from favorites" : "Add to favorites"}</p>
										</TooltipContent>
									</Tooltip>

									<Tooltip>
										<TooltipTrigger asChild>
											<Link href={`/biz/${business.id}`} target="_blank">
												<Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
													<ExternalLink className="w-3 h-3" />
												</Button>
											</Link>
										</TooltipTrigger>
										<TooltipContent>
											<p>View full profile</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						</div>

						{/* Status Messages */}
						{business.statusMessage && (
							<div className="px-4 pb-2">
								<div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 dark:bg-gray-800 rounded px-2 py-1">
									<Clock className="w-3 h-3" />
									<span className="truncate">{business.statusMessage}</span>
								</div>
							</div>
						)}

						{/* Loading Indicator */}
						{isLoading && (
							<div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center">
								<ReloadIcon className="w-6 h-6 animate-spin text-primary" />
							</div>
						)}

						{/* Active Indicator */}
						{isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
					</div>
				</div>
			</div>
		);
	})
);

BusinessCard.displayName = "BusinessCard";

const BusinessCardList = ({ activeBusinessId, activeCardRef }) => {
	const { filteredBusinesses = [], loading, setActiveBusinessId } = useBusinessStore();
	const { centerOn, loadingBusinessId } = useMapStore();
	const listRef = useRef(null);
	const activeCardElementRef = useRef(null);
	const [hoveredBusinessId, setHoveredBusinessId] = useState(null);

	useEffect(() => {
		if (activeCardElementRef.current) {
			activeCardElementRef.current.scrollIntoView({
				behavior: "smooth",
				block: "center",
				inline: "nearest",
			});
		}
	}, [activeBusinessId]);

	const handleCardClick = (business) => {
		setActiveBusinessId(business.id);
		const { lat, lng } = business.coordinates;
		centerOn(lat, lng, business.id);
	};

	const handleCardHover = (business) => {
		setHoveredBusinessId(business.id);
		// Optional: Center map on hovered business with subtle animation
		if (business.coordinates) {
			const { lat, lng } = business.coordinates;
			centerOn(lat, lng, null, { duration: 1000 });
		}
	};

	const handleCardLeave = (business) => {
		setHoveredBusinessId(null);
	};

	const handleKeyDown = useCallback(
		(e) => {
			if (filteredBusinesses.length === 0) return;
			const currentIndex = filteredBusinesses.findIndex((b) => b.id === activeBusinessId);
			if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
				e.preventDefault();
				const prevIndex = (currentIndex - 1 + filteredBusinesses.length) % filteredBusinesses.length;
				setActiveBusinessId(filteredBusinesses[prevIndex].id);
			} else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
				e.preventDefault();
				const nextIndex = (currentIndex + 1) % filteredBusinesses.length;
				setActiveBusinessId(filteredBusinesses[nextIndex].id);
			} else if (e.key === "Enter" && activeBusinessId) {
				e.preventDefault();
				const activeBusiness = filteredBusinesses.find((b) => b.id === activeBusinessId);
				if (activeBusiness) {
					window.open(`/biz/${activeBusiness.id}`, "_blank");
				}
			}
		},
		[filteredBusinesses, activeBusinessId, setActiveBusinessId]
	);

	useEffect(() => {
		const listElement = listRef.current;
		if (listElement) {
			listElement.addEventListener("keydown", handleKeyDown);
			// Make the list focusable
			listElement.setAttribute("tabindex", "0");
		}
		return () => {
			if (listElement) {
				listElement.removeEventListener("keydown", handleKeyDown);
			}
		};
	}, [handleKeyDown]);

	return (
		<div className="h-full flex flex-col">
			{/* Header with count */}
			{!loading && filteredBusinesses.length > 0 && (
				<div className="px-4 py-3 border-b bg-gray-50 dark:bg-gray-800">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">
							{filteredBusinesses.length} business{filteredBusinesses.length !== 1 ? "es" : ""} found
						</span>
						<div className="flex items-center gap-2 text-xs text-gray-500">
							<div className="flex items-center gap-1">
								<div className="w-2 h-2 bg-green-500 rounded-full"></div>
								<span>{filteredBusinesses.filter((b) => b.isOpenNow).length} open</span>
							</div>
							<div className="flex items-center gap-1">
								<div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
								<span>{filteredBusinesses.filter((b) => b.isSponsored).length} sponsored</span>
							</div>
						</div>
					</div>
				</div>
			)}

			<ScrollArea ref={listRef} className="flex-1 focus:outline-none">
				{loading ? (
					<div className="space-y-4 p-4">
						{Array.from({ length: 4 }).map((_, index) => (
							<SkeletonBusinessCard key={index} />
						))}
					</div>
				) : (
					<>
						{Array.isArray(filteredBusinesses) && filteredBusinesses.length > 0 ? (
							<div className="py-4">
								{filteredBusinesses.map((business, index) => (
									<Suspense key={business.id} fallback={<SkeletonBusinessCard />}>
										<BusinessCard business={business} isActive={business.id === activeBusinessId} handleClick={() => handleCardClick(business)} ref={business.id === activeBusinessId ? activeCardElementRef : null} isLoading={loadingBusinessId === business.id} onHover={handleCardHover} onLeave={handleCardLeave} />
									</Suspense>
								))}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
								<div className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
									<MapPin className="w-8 h-8 text-gray-400" />
								</div>
								<h3 className="text-lg font-medium mb-2">No businesses found</h3>
								<p className="text-sm mb-4 max-w-sm">Try adjusting your search or zoom out to see more results in the area.</p>
								<Link href="/add-a-business">
									<Button variant="outline" size="sm">
										<Plus className="w-4 h-4 mr-2" />
										Add a business
									</Button>
								</Link>
							</div>
						)}
					</>
				)}
			</ScrollArea>
		</div>
	);
};

export default memo(BusinessCardList);
export { BusinessCard };
