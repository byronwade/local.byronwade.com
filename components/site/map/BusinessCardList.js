import React, { useEffect, useRef, useCallback, memo, forwardRef, Suspense, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { ScrollArea } from "@components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip";
import { Bookmark, Circle, Clock, ExternalLink, Info, Share2, Star, Phone, MapPin, Navigation, Heart, Eye, Award, DollarSign, Users, MessageCircle, Camera, Globe, Plus, Shield, Verified, Timer, ChevronRight, TrendingUp, Zap } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";
import useBusinessStore from "@store/useBusinessStore";
import useSearchStore from "@store/useSearchStore";
import useMapStore from "@store/useMapStore";
import SkeletonBusinessCard from "@components/site/map/SkeletonBusinessCard";
import { Card, CardContent } from "@components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";

// Virtual scrolling constants
const ITEMS_PER_PAGE = 20;
const ITEM_HEIGHT = 200; // Approximate height of each business card

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
			const slug =
				business.slug ||
				business.name
					.toLowerCase()
					.replace(/[^a-z0-9\s-]/g, "")
					.replace(/\s+/g, "-")
					.replace(/-+/g, "-")
					.trim();
			if (navigator.share) {
				try {
					await navigator.share({
						title: business.name,
						text: `Check out ${business.name}`,
						url: `${window.location.origin}/biz/${slug}`,
					});
				} catch (err) {
					console.log("Error sharing:", err);
				}
			} else {
				navigator.clipboard.writeText(`${window.location.origin}/biz/${slug}`);
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
				<div id={`business-${business.id}`} className={`relative w-full mb-4 cursor-pointer transform transition-all duration-200 ease-in-out ${isActive ? "scale-105 shadow-lg ring-2 ring-primary/50 rounded-xl" : isHovered ? "scale-[1.02] shadow-md" : "hover:shadow-sm"}`} onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
					<div className="relative w-full overflow-hidden border border-border/20 rounded-xl shadow-sm bg-card/50 backdrop-blur-sm text-card-foreground hover:bg-card/80 hover:border-border/40 transition-all duration-200">
						{/* Sponsored Badge */}
						{business.isSponsored && (
							<div className="absolute z-10 top-3 right-3">
								<Badge variant="secondary" className="text-xs bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200/50 shadow-sm">
									<Award className="w-3 h-3 mr-1" />
									Sponsored
								</Badge>
							</div>
						)}

						{/* Main Content */}
						<div className="flex flex-row items-start gap-4 p-5">
							{/* Business Logo/Image */}
							<div className="flex-shrink-0">
								<div className="relative w-16 h-16 overflow-hidden bg-muted/50 rounded-xl shadow-sm ring-1 ring-border/50">
									{business.logo && !imageError ? (
										<Image src={business.logo} alt={`${business.name} logo`} fill className="object-cover" onError={() => setImageError(true)} />
									) : (
										<div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary/20 to-primary/10">
											<span className="text-lg font-bold text-primary">{business.name.charAt(0)}</span>
										</div>
									)}
									{business.images && business.images.length > 0 && (
										<div className="absolute bottom-1 right-1 bg-black/60 text-white px-1.5 py-0.5 rounded-md text-xs backdrop-blur-sm">
											<Camera className="w-2 h-2" />
										</div>
									)}
								</div>
							</div>

							{/* Business Info */}
							<div className="flex-1 min-w-0">
								<div className="flex items-start justify-between mb-2">
									<h3 className="pr-2 text-lg font-semibold leading-tight truncate text-card-foreground">{business.name}</h3>
									<div className="flex items-center flex-shrink-0 gap-1">
										{business.ratings?.overall && (
											<div className="flex items-center gap-1 bg-muted/30 px-2 py-1 rounded-lg">
												<div className="flex">{renderStars(business.ratings.overall)}</div>
												<span className="text-sm font-medium text-foreground">{business.ratings.overall}</span>
											</div>
										)}
									</div>
								</div>

								{/* Categories */}
								<div className="flex flex-wrap gap-1.5 mb-3">
									{Array.isArray(business.categories) &&
										business.categories.slice(0, 3).map((category, index) => (
											<Badge key={index} variant="outline" className="px-2 py-0.5 text-xs bg-secondary/50 text-secondary-foreground border-border/50 hover:bg-secondary/80 transition-colors">
												{category}
											</Badge>
										))}
									{business.categories && business.categories.length > 3 && (
										<Badge variant="outline" className="px-2 py-0.5 text-xs bg-secondary/50 text-secondary-foreground border-border/50">
											+{business.categories.length - 3}
										</Badge>
									)}
								</div>

								{/* Description */}
								<p className="mb-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{business.description}</p>

								{/* Quick Info */}
								<div className="flex items-center gap-4 text-sm">
									<div className="flex items-center gap-1.5">
										<div className={`w-2 h-2 rounded-full ${business.isOpenNow ? "bg-green-500 shadow-sm shadow-green-500/50" : "bg-red-500 shadow-sm shadow-red-500/50"}`}></div>
										<span className={`font-medium ${business.isOpenNow ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{business.isOpenNow ? "Open" : "Closed"}</span>
									</div>
									{business.price && (
										<div className="flex items-center gap-1">
											<DollarSign className="w-3 h-3 text-muted-foreground" />
											<span className="text-foreground font-medium">{business.price}</span>
										</div>
									)}
									{business.address && (
										<div className="flex items-center gap-1 truncate">
											<MapPin className="flex-shrink-0 w-3 h-3 text-muted-foreground" />
											<span className="text-xs text-muted-foreground truncate">{business.address.split(",")[0]}</span>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Action Buttons - Show on hover or when active */}
						<div className={`px-5 pb-4 transition-all duration-200 ${isHovered || isActive ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden"}`}>
							<div className="flex gap-2">
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button size="sm" variant="outline" onClick={handleCall} disabled={!business.phone} className="flex-1 border-border/50 hover:bg-accent/80 hover:border-primary/50 transition-all">
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
											<Button size="sm" variant="outline" onClick={handleDirections} className="flex-1 border-border/50 hover:bg-accent/80 hover:border-primary/50 transition-all">
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
											<Button size="sm" variant="outline" onClick={handleShare} className="border-border/50 hover:bg-accent/80 hover:border-primary/50 transition-all">
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
												className="border-border/50 hover:bg-accent/80 hover:border-primary/50 transition-all"
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
											<Link
												href={`/biz/${
													business.slug ||
													business.name
														.toLowerCase()
														.replace(/[^a-z0-9\s-]/g, "")
														.replace(/\s+/g, "-")
														.replace(/-+/g, "-")
														.trim()
												}`}
												target="_blank"
											>
												<Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()} className="border-border/50 hover:bg-accent/80 hover:border-primary/50 transition-all">
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
							<div className="px-5 pb-3">
								<div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground rounded-lg bg-muted/30 border border-border/30">
									<Clock className="w-3 h-3" />
									<span className="truncate">{business.statusMessage}</span>
								</div>
							</div>
						)}

						{/* Loading Indicator */}
						{isLoading && (
							<div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl">
								<ReloadIcon className="w-6 h-6 animate-spin text-primary" />
							</div>
						)}

						{/* Active Indicator */}
						{isActive && <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-l-xl"></div>}
					</div>
				</div>
			</div>
		);
	})
);

BusinessCard.displayName = "BusinessCard";

const BusinessCardList = ({ activeBusinessId, activeCardRef }) => {
	const { filteredBusinesses = [], loading, setActiveBusinessId, selectedBusiness } = useBusinessStore();
	const { searchQuery, searchLocation } = useSearchStore();
	const { centerOn, loadingBusinessId } = useMapStore();
	const listRef = useRef(null);
	const activeCardElementRef = useRef(null);
	const sentinelRef = useRef(null);
	const [hoveredBusinessId, setHoveredBusinessId] = useState(null);

	// Virtual scrolling state
	const [visibleStartIndex, setVisibleStartIndex] = useState(0);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	// Calculate how many items to show (start with initial batch)
	const itemsToShow = Math.min(visibleStartIndex + ITEMS_PER_PAGE, filteredBusinesses.length);

	// Memoize visible businesses for performance
	const visibleBusinesses = useMemo(() => {
		return filteredBusinesses.slice(0, itemsToShow);
	}, [filteredBusinesses, itemsToShow]);

	// Intersection Observer for infinite loading
	useEffect(() => {
		if (!sentinelRef.current || filteredBusinesses.length <= ITEMS_PER_PAGE) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (entry.isIntersecting && !isLoadingMore && itemsToShow < filteredBusinesses.length) {
					setIsLoadingMore(true);
					// Simulate loading delay for smoother UX
					setTimeout(() => {
						setVisibleStartIndex((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredBusinesses.length - ITEMS_PER_PAGE));
						setIsLoadingMore(false);
					}, 100);
				}
			},
			{
				threshold: 0.1,
				rootMargin: "100px",
			}
		);

		observer.observe(sentinelRef.current);

		return () => {
			observer.disconnect();
		};
	}, [itemsToShow, filteredBusinesses.length, isLoadingMore]);

	// Reset virtual scrolling when businesses change
	useEffect(() => {
		setVisibleStartIndex(0);
	}, [filteredBusinesses.length]);

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

		// Simplified coordinate validation
		if (business.coordinates && business.coordinates.lat && business.coordinates.lng) {
			const { lat, lng } = business.coordinates;
			centerOn(lat, lng, business.id);
		} else {
			console.error("Invalid business coordinates in handleCardClick:", business.name, business.coordinates);
		}
	};

	const handleCardHover = (business) => {
		setHoveredBusinessId(business.id);

		// Simplified coordinate validation
		if (business.coordinates && business.coordinates.lat && business.coordinates.lng) {
			const { lat, lng } = business.coordinates;
			centerOn(lat, lng, null, { duration: 1000 });
		} else if (business.coordinates) {
			console.error("Invalid business coordinates in handleCardHover:", business.name, business.coordinates);
		}
	};

	const handleCardLeave = (business) => {
		setHoveredBusinessId(null);
	};

	const handleKeyDown = useCallback(
		(e) => {
			if (visibleBusinesses.length === 0) return;
			const currentIndex = visibleBusinesses.findIndex((b) => b.id === activeBusinessId);
			if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
				e.preventDefault();
				const prevIndex = (currentIndex - 1 + visibleBusinesses.length) % visibleBusinesses.length;
				setActiveBusinessId(visibleBusinesses[prevIndex].id);
			} else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
				e.preventDefault();
				const nextIndex = (currentIndex + 1) % visibleBusinesses.length;
				setActiveBusinessId(visibleBusinesses[nextIndex].id);
			} else if (e.key === "Enter" && activeBusinessId) {
				e.preventDefault();
				const activeBusiness = visibleBusinesses.find((b) => b.id === activeBusinessId);
				if (activeBusiness) {
					const slug =
						activeBusiness.slug ||
						activeBusiness.name
							.toLowerCase()
							.replace(/[^a-z0-9\s-]/g, "")
							.replace(/\s+/g, "-")
							.replace(/-+/g, "-")
							.trim();
					window.open(`/biz/${slug}`, "_blank");
				}
			}
		},
		[visibleBusinesses, activeBusinessId, setActiveBusinessId]
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

	// Simulated real-time activity data
	const [activityData] = useState(() =>
		filteredBusinesses.reduce((acc, business) => {
			acc[business.id] = {
				recentViews: Math.floor(Math.random() * 15) + 1,
				lastViewedMinutes: Math.floor(Math.random() * 60) + 1,
				bookingsToday: Math.floor(Math.random() * 8),
				responseTime: Math.floor(Math.random() * 4) + 1, // hours
			};
			return acc;
		}, {})
	);

	const getUrgencyIndicator = (business) => {
		const activity = activityData[business.id];
		if (!activity) return null;

		if (activity.bookingsToday >= 5) {
			return { type: "high-demand", text: "High demand today", color: "bg-red-100 text-red-700" };
		}
		if (activity.recentViews >= 10) {
			return { type: "trending", text: `${activity.recentViews} people viewing`, color: "bg-orange-100 text-orange-700" };
		}
		if (activity.responseTime <= 2) {
			return { type: "fast-response", text: `Responds in ${activity.responseTime}h`, color: "bg-green-100 text-green-700" };
		}
		return null;
	};

	const getTrustScore = (business) => {
		let score = 0;
		if (business.ratings?.overall >= 4.5) score += 20;
		if (business.isVerified) score += 25;
		if (business.isInsured) score += 20;
		if (business.yearsInBusiness >= 5) score += 15;
		if (business.isLicensed) score += 20;
		return Math.min(score, 100);
	};

	const formatDistance = (distance) => {
		if (!distance) return "";
		return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}mi`;
	};

	const BusinessCard = ({ business, isActive }) => {
		const renderStars = (rating) => {
			return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : i < rating ? "fill-yellow-200 text-yellow-400" : "text-muted-foreground/50"}`} />);
		};

		const trustScore = getTrustScore(business);

		return (
			<div ref={isActive ? activeCardRef : null} className={`mb-3 cursor-pointer transition-all duration-200 ${isActive ? "ring-2 ring-primary/50 rounded-xl" : ""}`} onClick={() => handleCardClick(business)}>
				<Card className={`overflow-hidden border-0 rounded-xl shadow-sm bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-200 ${isActive ? "shadow-lg" : "hover:shadow-md"}`}>
					<CardContent className="p-0">
						{/* Business Header */}
						<div className="p-5 pb-3">
							<div className="flex items-start gap-3">
								{/* Business Image */}
								<div className="relative flex-shrink-0">
									<div className="w-14 h-14 rounded-xl overflow-hidden bg-muted/50 shadow-sm ring-1 ring-border/50">
										{business.logo ? (
											<Image src={business.logo} alt={`${business.name} logo`} width={56} height={56} className="object-cover w-full h-full" />
										) : (
											<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
												<span className="text-lg font-bold text-primary">{business.name?.charAt(0) || "?"}</span>
											</div>
										)}
									</div>
									{/* Trust Badge */}
									{trustScore >= 80 && (
										<div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
											<Shield className="w-2.5 h-2.5 text-white" />
										</div>
									)}
								</div>

								{/* Business Info */}
								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between">
										<div className="flex-1 min-w-0">
											<h3 className="font-semibold text-card-foreground text-base leading-tight mb-1 truncate">{business.name}</h3>
											<p className="text-sm text-muted-foreground truncate">{business.categories?.slice(0, 2).join(" • ") || "Business"}</p>
										</div>
										{business.isSponsored && (
											<Badge variant="secondary" className="text-xs bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200/50 ml-2 shadow-sm">
												Ad
											</Badge>
										)}
									</div>
								</div>
							</div>
						</div>

						{/* Rating & Key Info Row */}
						<div className="px-5 pb-3">
							<div className="flex items-center gap-4">
								{/* Rating */}
								<div className="flex items-center gap-1.5">
									<div className="flex bg-muted/30 px-2 py-1 rounded-lg">{renderStars(business.ratings?.overall || 0)}</div>
									<span className="text-sm font-medium text-foreground">{business.ratings?.overall?.toFixed(1) || "New"}</span>
									<span className="text-xs text-muted-foreground">({business.ratings?.count || 0})</span>
								</div>

								{/* Quick Info */}
								<div className="flex items-center gap-3 text-sm">
									{/* Price */}
									{business.price && (
										<div className="flex items-center gap-1">
											<span className="text-sm font-bold text-green-600 dark:text-green-400">{business.price}</span>
										</div>
									)}

									{/* Status */}
									{business.isOpenNow !== undefined && (
										<div className="flex items-center gap-1">
											<div className={`w-2 h-2 rounded-full ${business.isOpenNow ? "bg-green-500 shadow-sm shadow-green-500/50" : "bg-red-500 shadow-sm shadow-red-500/50"}`} />
											<span className={`text-xs font-medium ${business.isOpenNow ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{business.isOpenNow ? "Open" : "Closed"}</span>
										</div>
									)}

									{/* Distance */}
									{business.distance && (
										<span className="text-xs text-muted-foreground flex items-center gap-1">
											<MapPin className="w-3 h-3" />
											{formatDistance(business.distance)}
										</span>
									)}
								</div>
							</div>
						</div>

						{/* Description */}
						{business.description && (
							<div className="px-5 pb-3">
								<p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{business.description}</p>
							</div>
						)}

						{/* Action Footer */}
						<div className="px-5 py-3 bg-muted/20 border-t border-border/30">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3 text-xs text-muted-foreground">
									{business.phone && (
										<span className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
											<Phone className="w-3 h-3" />
											Call
										</span>
									)}
									<span className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
										<Navigation className="w-3 h-3" />
										Directions
									</span>
									<span className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
										<Globe className="w-3 h-3" />
										Website
									</span>
								</div>
								<ChevronRight className="w-4 h-4 text-muted-foreground/50" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	};

	return (
		<div className="flex flex-col h-full">
			{/* Clean Results Header */}
			<div className="px-5 py-4 border-b border-border/50 bg-card/30 backdrop-blur-sm">
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<h2 className="text-base font-medium text-card-foreground">
							{filteredBusinesses.length.toLocaleString()} result{filteredBusinesses.length !== 1 ? "s" : ""}
							{searchQuery && ` for "${searchQuery}"`}
							{searchLocation && ` in ${searchLocation}`}
						</h2>
					</div>
					<div className="flex items-center gap-4 text-xs text-muted-foreground">
						<span className="flex items-center gap-1">
							<div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
							{filteredBusinesses.filter((b) => b.isOpenNow).length} open now
						</span>
						<span>•</span>
						<span>Sorted by relevance</span>
					</div>
				</div>
			</div>

			{/* Business List */}
			<ScrollArea className="flex-1" ref={listRef}>
				<div className="p-4">
					{visibleBusinesses.map((business) => (
						<BusinessCard key={business.id} business={business} isActive={business.id === activeBusinessId} />
					))}

					{/* Load More */}
					{itemsToShow < filteredBusinesses.length && (
						<div className="mt-4 text-center">
							<Button variant="outline" onClick={() => setVisibleStartIndex(Math.min(visibleStartIndex + ITEMS_PER_PAGE, filteredBusinesses.length - ITEMS_PER_PAGE))} className="w-full">
								Show {Math.min(ITEMS_PER_PAGE, filteredBusinesses.length - itemsToShow)} more businesses
							</Button>
						</div>
					)}
				</div>
			</ScrollArea>
		</div>
	);
};

export default memo(BusinessCardList);
export { BusinessCard };
