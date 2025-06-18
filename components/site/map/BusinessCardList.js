import React, { useEffect, useRef, useCallback, memo, forwardRef, Suspense, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { ScrollArea } from "@components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { Bookmark, Circle, Clock, ExternalLink, Info, Share2, Star, Phone, MapPin, Navigation, Heart, Eye, Award, DollarSign, Users, MessageCircle, Camera, Globe, Plus, Shield, Verified, Timer, ChevronRight, TrendingUp, Zap, Filter, SortAsc, ChevronDown, Bot, Map, List, CheckCircle2, ArrowUp } from "lucide-react";
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

		const handleViewDetails = (e) => {
			e.stopPropagation();
			// Generate slug for business page
			const slug =
				business.slug ||
				business.name
					.toLowerCase()
					.replace(/[^a-z0-9\s-]/g, "")
					.replace(/\s+/g, "-")
					.replace(/-+/g, "-")
					.trim();

			// Navigate to business page
			window.location.href = `/biz/${slug}`;
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
						<div className="flex flex-row items-start gap-4 p-4">
							{/* Business Logo/Image */}
							<div className="flex-shrink-0">
								<div className="relative w-14 h-14 overflow-hidden bg-muted/50 rounded-xl shadow-sm ring-1 ring-border/50">
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
									<h3 className="pr-2 text-lg font-semibold leading-tight truncate text-card-foreground tracking-tight">{business.name}</h3>
									<div className="flex items-center flex-shrink-0 gap-1">
										{business.ratings?.overall && (
											<div className="flex items-center gap-1 bg-muted/30 px-2 py-1 rounded-lg">
												<div className="flex">{renderStars(business.ratings.overall)}</div>
												<span className="text-sm font-semibold text-foreground">{business.ratings.overall}</span>
											</div>
										)}
									</div>
								</div>

								{/* Categories */}
								<div className="flex flex-wrap gap-1.5 mb-2">
									{Array.isArray(business.categories) &&
										business.categories.slice(0, 2).map((category, index) => (
											<Badge key={index} variant="outline" className="px-2 py-0.5 text-sm bg-secondary/50 text-secondary-foreground border-border/50 hover:bg-secondary/80 transition-colors font-medium">
												{category}
											</Badge>
										))}
									{business.categories && business.categories.length > 2 && (
										<Badge variant="outline" className="px-2 py-0.5 text-sm bg-secondary/50 text-secondary-foreground border-border/50 font-medium">
											+{business.categories.length - 2}
										</Badge>
									)}
								</div>

								{/* Description */}
								<p className="mb-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{business.description}</p>

								{/* Quick Info */}
								<div className="flex items-center gap-4 text-sm">
									<div className="flex items-center gap-1.5">
										<div className={`w-2 h-2 rounded-full ${business.isOpenNow ? "bg-green-500 shadow-sm shadow-green-500/50" : "bg-red-500 shadow-sm shadow-red-500/50"}`}></div>
										<span className={`font-semibold ${business.isOpenNow ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{business.isOpenNow ? "Open" : "Closed"}</span>
									</div>
									{business.price && (
										<div className="flex items-center gap-1">
											<DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
											<span className="text-foreground font-semibold">{business.price}</span>
										</div>
									)}
									{business.address && (
										<div className="flex items-center gap-1 truncate">
											<MapPin className="flex-shrink-0 w-3.5 h-3.5 text-muted-foreground" />
											<span className="text-sm text-muted-foreground truncate font-medium">{business.address.split(",")[0]}</span>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Action Buttons - Show on hover or when active */}
						<div className={`px-4 pb-3 transition-all duration-200 ${isHovered || isActive ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden"}`}>
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
											<Button size="sm" variant="default" onClick={handleViewDetails} className="flex-1 bg-primary hover:bg-primary/90 transition-all">
												<ExternalLink className="w-3 h-3 mr-1" />
												Details
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>View business details</p>
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

const BusinessCardList = ({ businesses, activeBusinessId, activeCardRef, onAIClick, onBusinessSelect, loading, showMap, onMapToggle, listMode }) => {
	const { setActiveBusinessId, selectedBusiness } = useBusinessStore();
	const filteredBusinesses = useMemo(() => businesses || [], [businesses]);
	const { searchQuery, searchLocation } = useSearchStore();
	const { centerOn, loadingBusinessId } = useMapStore();
	const listRef = useRef(null);
	const activeCardElementRef = useRef(null);
	const sentinelRef = useRef(null);
	const [hoveredBusinessId, setHoveredBusinessId] = useState(null);

	// Debug logging
	useEffect(() => {
		console.log("BusinessCardList - businesses count:", filteredBusinesses.length);
		console.log("BusinessCardList - onBusinessSelect provided:", !!onBusinessSelect);
		console.log("BusinessCardList - activeBusinessId:", activeBusinessId);
		if (filteredBusinesses.length > 0) {
			console.log("First business:", filteredBusinesses[0]);
		}
	}, [filteredBusinesses, onBusinessSelect, activeBusinessId]);

	// Filter and sort state
	const [sortBy, setSortBy] = useState("relevance");
	const [showFilters, setShowFilters] = useState(false);
	const [showSort, setShowSort] = useState(false);

	// Virtual scrolling state
	const [visibleStartIndex, setVisibleStartIndex] = useState(0);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	// Calculate how many items to show (start with initial batch)
	const itemsToShow = Math.min(visibleStartIndex + ITEMS_PER_PAGE, filteredBusinesses.length);

	// Memoize visible businesses for performance
	const visibleBusinesses = useMemo(() => {
		return filteredBusinesses.slice(0, itemsToShow);
	}, [filteredBusinesses, itemsToShow]);

	// Sort options
	const sortOptions = [
		{ value: "relevance", label: "Best Match" },
		{ value: "rating", label: "Highest Rated" },
		{ value: "distance", label: "Distance" },
		{ value: "name", label: "Name A-Z" },
	];

	// Handle filter and sort actions
	const handleFilterClick = () => {
		setShowFilters(!showFilters);
		// TODO: Implement filter panel
		console.log("Filter clicked");
	};

	const handleSortSelect = (value) => {
		setSortBy(value);
		setShowSort(false);
		// TODO: Implement actual sorting logic
		console.log("Sort changed to:", value);
	};

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
		console.log("Business card clicked:", business.name, "ID:", business.id);
		console.log("Current activeBusinessId before setting:", activeBusinessId);
		setActiveBusinessId(business.id);
		console.log("setActiveBusinessId called with:", business.id);

		// Call the onBusinessSelect prop to show business details
		if (onBusinessSelect) {
			console.log("Calling onBusinessSelect with business:", business.name);
			onBusinessSelect(business);
		} else {
			console.log("onBusinessSelect is not provided");
		}

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
				const prevBusiness = visibleBusinesses[prevIndex];
				setActiveBusinessId(prevBusiness.id);
				// Also call onBusinessSelect to show the panel
				if (onBusinessSelect) {
					onBusinessSelect(prevBusiness);
				}
			} else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
				e.preventDefault();
				const nextIndex = (currentIndex + 1) % visibleBusinesses.length;
				const nextBusiness = visibleBusinesses[nextIndex];
				setActiveBusinessId(nextBusiness.id);
				// Also call onBusinessSelect to show the panel
				if (onBusinessSelect) {
					onBusinessSelect(nextBusiness);
				}
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
		[visibleBusinesses, activeBusinessId, setActiveBusinessId, onBusinessSelect]
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

	// Google-style list card for full-width mode
	const GoogleStyleBusinessCard = ({ business, isActive }) => {
		const [imageError, setImageError] = useState(false);

		const renderStars = (rating) => {
			return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : i < rating ? "fill-yellow-200 text-yellow-400" : "text-gray-300"}`} />);
		};

		const handleBusinessPageClick = () => {
			// Generate slug for business page
			const slug =
				business.slug ||
				business.name
					.toLowerCase()
					.replace(/[^a-z0-9\s-]/g, "")
					.replace(/\s+/g, "-")
					.replace(/-+/g, "-")
					.trim();

			// Navigate to business page
			window.location.href = `/biz/${slug}`;
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

		const handleWebsite = (e) => {
			e.stopPropagation();
			if (business.website) {
				window.open(business.website, "_blank");
			}
		};

		return (
			<div className="mx-auto max-w-4xl">
				<Card className={`mx-4 mb-4 overflow-hidden border border-border/20 rounded-xl shadow-sm bg-card hover:bg-card/80 hover:shadow-md transition-all duration-200 cursor-pointer ${isActive ? "ring-2 ring-primary/50 shadow-lg" : ""}`} onClick={handleBusinessPageClick}>
					<CardContent className="p-0">
						<div className="p-6">
							<div className="flex gap-4">
								{/* Business Logo */}
								<div className="flex-shrink-0">
									<div className="w-16 h-16 rounded-xl overflow-hidden bg-muted/50 border border-border/50 shadow-sm">
										{business.logo && !imageError ? (
											<Image src={business.logo} alt={`${business.name} logo`} width={64} height={64} className="object-cover w-full h-full" onError={() => setImageError(true)} />
										) : (
											<div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary/20 to-primary/10">
												<span className="text-xl font-bold text-primary">{business.name.charAt(0)}</span>
											</div>
										)}
									</div>
								</div>

								{/* Business Info */}
								<div className="flex-1 min-w-0">
									{/* Title and Badges */}
									<div className="flex items-start justify-between mb-2">
										<div className="flex-1 min-w-0">
											<h3 className="text-xl font-semibold text-card-foreground hover:text-primary transition-colors cursor-pointer mb-1">{business.name}</h3>
											<div className="flex items-center gap-3 mb-2">
												{business.ratings?.overall && (
													<div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-lg">
														<div className="flex">{renderStars(business.ratings.overall)}</div>
														<span className="text-sm font-semibold text-foreground">{business.ratings.overall}</span>
														<span className="text-sm text-muted-foreground">({business.ratings?.count || 0})</span>
													</div>
												)}
												<div className="flex items-center gap-1">
													<div className={`w-2 h-2 rounded-full ${business.isOpenNow ? "bg-green-500 shadow-sm shadow-green-500/50" : "bg-red-500 shadow-sm shadow-red-500/50"}`}></div>
													<span className={`text-sm font-semibold ${business.isOpenNow ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{business.isOpenNow ? "Open" : "Closed"}</span>
												</div>
												{business.price && (
													<Badge variant="outline" className="text-sm font-semibold text-green-600 border-green-200 bg-green-50">
														{business.price}
													</Badge>
												)}
											</div>
										</div>
										{business.isSponsored && (
											<Badge variant="secondary" className="text-xs bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200/50 shadow-sm">
												<Award className="w-3 h-3 mr-1" />
												Sponsored
											</Badge>
										)}
									</div>

									{/* Categories */}
									<div className="flex flex-wrap gap-1.5 mb-3">
										{Array.isArray(business.categories) &&
											business.categories.slice(0, 3).map((category, index) => (
												<Badge key={index} variant="outline" className="text-sm bg-secondary/50 text-secondary-foreground border-border/50 hover:bg-secondary/80 transition-colors">
													{category}
												</Badge>
											))}
										{business.categories && business.categories.length > 3 && (
											<Badge variant="outline" className="text-sm bg-secondary/50 text-secondary-foreground border-border/50">
												+{business.categories.length - 3}
											</Badge>
										)}
									</div>

									{/* Description */}
									{business.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{business.description}</p>}

									{/* Address and Contact Info */}
									<div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
										{business.address && (
											<div className="flex items-center gap-1.5">
												<MapPin className="w-4 h-4 text-muted-foreground" />
												<span>{business.address}</span>
											</div>
										)}
										{business.phone && (
											<div className="flex items-center gap-1.5">
												<Phone className="w-4 h-4 text-muted-foreground" />
												<span>{business.phone}</span>
											</div>
										)}
										{business.distance && (
											<div className="flex items-center gap-1.5">
												<Navigation className="w-4 h-4 text-muted-foreground" />
												<span>{formatDistance(business.distance)}</span>
											</div>
										)}
									</div>

									{/* Action Buttons */}
									<div className="flex gap-3">
										<Button size="sm" variant="outline" onClick={handleCall} disabled={!business.phone} className="border-border/50 hover:bg-accent/80 hover:border-primary/50 transition-all">
											<Phone className="w-4 h-4 mr-2" />
											Call
										</Button>
										<Button size="sm" variant="outline" onClick={handleDirections} className="border-border/50 hover:bg-accent/80 hover:border-primary/50 transition-all">
											<Navigation className="w-4 h-4 mr-2" />
											Directions
										</Button>
										{business.website && (
											<Button size="sm" variant="outline" onClick={handleWebsite} className="border-border/50 hover:bg-accent/80 hover:border-primary/50 transition-all">
												<Globe className="w-4 h-4 mr-2" />
												Website
											</Button>
										)}
										<Button
											size="sm"
											variant="default"
											onClick={(e) => {
												e.stopPropagation();
												handleBusinessPageClick();
											}}
											className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary transition-all ml-auto"
										>
											<ExternalLink className="w-4 h-4 mr-2" />
											View Profile
										</Button>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
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
			{/* Enhanced Results Header with Filter and Sort */}
			<div className={`border-b border-border/50 bg-card/30 backdrop-blur-sm ${listMode === "full" ? "px-8 py-6" : "px-4 py-3"}`}>
				<div className="flex flex-col gap-3">
					{/* Results Count */}
					<div className="flex items-center justify-between">
						<h2 className={`font-medium text-card-foreground truncate pr-2 ${listMode === "full" ? "text-xl lg:text-2xl" : "text-sm lg:text-base"}`}>
							{filteredBusinesses.length.toLocaleString()} result{filteredBusinesses.length !== 1 ? "s" : ""}
							{searchQuery && ` for "${searchQuery}"`}
							{searchLocation && ` in ${searchLocation}`}
						</h2>
					</div>

					{/* Filters and Sort Controls */}
					<div className="flex flex-col gap-2">
						{/* Status Info Row - More comprehensive for full mode */}
						<div className={`flex items-center justify-between text-xs text-muted-foreground ${listMode === "full" ? "flex-wrap gap-2" : ""}`}>
							<div className="flex items-center gap-3">
								<span className="flex items-center gap-1">
									<div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
									{filteredBusinesses.filter((b) => b.isOpenNow).length} open now
								</span>
								{listMode === "full" && (
									<>
										<span className="flex items-center gap-1">
											<Clock className="w-3 h-3" />
											{filteredBusinesses.filter((b) => !b.isOpenNow).length} closed
										</span>
										<span className="flex items-center gap-1">
											<Award className="w-3 h-3" />
											{filteredBusinesses.filter((b) => b.isSponsored).length} featured
										</span>
									</>
								)}
							</div>
							{listMode === "full" && <span className="text-xs text-muted-foreground">Updated {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>}
						</div>

						{/* Controls Row */}
						<div className={`flex items-center justify-between gap-2 ${listMode === "full" ? "flex-wrap" : ""}`}>
							<div className={`flex items-center gap-1 ${listMode === "full" ? "flex-1 min-w-0 order-2 w-full justify-center sm:order-1 sm:w-auto sm:justify-start" : "flex-1 min-w-0"}`}>
								{/* Map Toggle Button */}
								{onMapToggle && (
									<Button variant={showMap ? "default" : "outline"} size={listMode === "full" ? "default" : "sm"} onClick={onMapToggle} className={`transition-all duration-200 flex-shrink-0 ${listMode === "full" ? "h-9 px-4 text-sm flex-1 sm:flex-initial" : "h-7 px-2 text-xs"}`}>
										{showMap ? <Map className={`${listMode === "full" ? "w-4 h-4" : "w-3 h-3"} ${listMode === "full" ? "mr-2" : "lg:mr-1"}`} /> : <List className={`${listMode === "full" ? "w-4 h-4" : "w-3 h-3"} ${listMode === "full" ? "mr-2" : "lg:mr-1"}`} />}
										<span className={listMode === "full" ? "block" : "hidden lg:inline"}>{showMap ? "Show Map" : "List View"}</span>
									</Button>
								)}

								{/* AI Assistant Button */}
								{onAIClick && (
									<Button variant="outline" size={listMode === "full" ? "default" : "sm"} onClick={onAIClick} className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-500 hover:from-blue-600 hover:to-purple-700 hover:border-blue-600 transition-all duration-200 flex-shrink-0 ${listMode === "full" ? "h-9 px-4 text-sm flex-1 sm:flex-initial" : "h-7 px-2 text-xs"}`}>
										<Bot className={`${listMode === "full" ? "w-4 h-4" : "w-3 h-3"} ${listMode === "full" ? "mr-2" : "lg:mr-1"}`} />
										<span className={`font-medium ${listMode === "full" ? "block" : "hidden lg:inline"}`}>AI Assistant</span>
									</Button>
								)}
							</div>

							<div className={`flex items-center gap-1 flex-shrink-0 ${listMode === "full" ? "order-1 w-full justify-between sm:order-2 sm:w-auto sm:justify-end" : ""}`}>
								{/* Filter Button */}
								<Button variant="outline" size={listMode === "full" ? "default" : "sm"} onClick={handleFilterClick} className={`border-border/50 hover:bg-accent hover:border-primary/50 transition-all ${listMode === "full" ? "h-9 px-4 text-sm flex-1 sm:flex-initial" : "h-7 px-2 text-xs"}`}>
									<Filter className={`${listMode === "full" ? "w-4 h-4" : "w-3 h-3"} ${listMode === "full" ? "mr-2" : "lg:mr-1"}`} />
									<span className={listMode === "full" ? "block" : "hidden lg:inline"}>Filters</span>
								</Button>

								{/* Sort Dropdown */}
								<DropdownMenu open={showSort} onOpenChange={setShowSort}>
									<DropdownMenuTrigger asChild>
										<Button variant="outline" size={listMode === "full" ? "default" : "sm"} className={`border-border/50 hover:bg-accent hover:border-primary/50 transition-all ${listMode === "full" ? "h-9 px-4 text-sm flex-1 sm:flex-initial" : "h-7 px-2 text-xs"}`}>
											<SortAsc className={`${listMode === "full" ? "w-4 h-4" : "w-3 h-3"} ${listMode === "full" ? "mr-2" : "lg:mr-1"}`} />
											<span className={listMode === "full" ? "block" : "hidden lg:inline"}>{sortOptions.find((option) => option.value === sortBy)?.label || "Sort"}</span>
											<ChevronDown className={`${listMode === "full" ? "w-4 h-4" : "w-3 h-3"} ${listMode === "full" ? "ml-2" : "lg:ml-1"}`} />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-40">
										{sortOptions.map((option) => (
											<DropdownMenuItem key={option.value} onClick={() => handleSortSelect(option.value)} className="text-sm">
												{option.label}
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Business List */}
			<ScrollArea className="flex-1" ref={listRef}>
				<div className={listMode === "full" ? "py-4" : "p-4"}>
					{filteredBusinesses.length === 0 && !loading ? (
						/* Empty State */
						<div className={`text-center ${listMode === "full" ? "py-20 max-w-2xl mx-auto px-4" : "py-12"}`}>
							<div className="w-16 h-16 mx-auto mb-4 bg-muted/30 rounded-full flex items-center justify-center">
								<MapPin className="w-8 h-8 text-muted-foreground" />
							</div>
							<h3 className={`font-semibold text-foreground mb-2 ${listMode === "full" ? "text-2xl" : "text-lg"}`}>{searchQuery || searchLocation ? "No businesses found" : "Start exploring"}</h3>
							<p className={`text-muted-foreground mb-6 mx-auto ${listMode === "full" ? "text-base max-w-lg" : "text-sm max-w-sm"}`}>{searchQuery || searchLocation ? "Try adjusting your search terms or explore different areas on the map" : "Search for businesses or explore the map to discover local businesses around you"}</p>
							{!searchQuery && !searchLocation && (
								<div className="space-y-3">
									<p className="text-xs text-muted-foreground mb-3">Popular searches:</p>
									<div className="flex flex-wrap gap-2 justify-center">
										{["Restaurants", "Coffee", "Plumbers", "Hair Salon"].map((term) => (
											<Badge
												key={term}
												variant="outline"
												className="cursor-pointer hover:bg-accent text-xs"
												onClick={() => {
													const searchBox = document.querySelector('input[placeholder*="business"]');
													if (searchBox) {
														searchBox.value = term;
														searchBox.dispatchEvent(new Event("input", { bubbles: true }));
													}
												}}
											>
												{term}
											</Badge>
										))}
									</div>
								</div>
							)}
						</div>
					) : (
						<>
							{/* Business Results */}
							{visibleBusinesses.map((business, index) => (
								<div key={business.id}>
									{listMode === "full" ? <GoogleStyleBusinessCard business={business} isActive={business.id === activeBusinessId} /> : <BusinessCard business={business} isActive={business.id === activeBusinessId} />}

									{/* Ad insertion for full mode */}
									{listMode === "full" && index === 3 && (
										<div className="mx-auto max-w-4xl">
											<Card className="mx-4 mb-4 overflow-hidden border border-yellow-200/50 rounded-xl shadow-sm bg-gradient-to-r from-yellow-50 to-amber-50 hover:shadow-md transition-all duration-200">
												<CardContent className="p-6">
													<div className="flex items-center gap-3 mb-3">
														<div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
															<Zap className="w-4 h-4 text-yellow-800" />
														</div>
														<div>
															<h4 className="font-semibold text-yellow-800">Advertise Your Business</h4>
															<p className="text-sm text-yellow-700">Get found by more customers</p>
														</div>
													</div>
													<Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 border-yellow-600">
														Learn More
													</Button>
												</CardContent>
											</Card>
										</div>
									)}
								</div>
							))}

							{/* Loading More Indicator */}
							{isLoadingMore && (
								<div className={`text-center ${listMode === "full" ? "py-8 mx-auto max-w-4xl px-4" : "py-6"}`}>
									<div className="flex items-center justify-center gap-2 text-muted-foreground">
										<ReloadIcon className="w-4 h-4 animate-spin" />
										<span className="text-sm">Loading more businesses...</span>
									</div>
								</div>
							)}

							{/* Load More Button or End Message */}
							{itemsToShow < filteredBusinesses.length ? (
								<div className={`text-center ${listMode === "full" ? "py-6 mx-auto max-w-4xl px-4" : "py-4"}`}>
									<Button variant="outline" size={listMode === "full" ? "lg" : "default"} onClick={() => setVisibleStartIndex(Math.min(visibleStartIndex + ITEMS_PER_PAGE, filteredBusinesses.length - ITEMS_PER_PAGE))} className={`${listMode === "full" ? "w-full max-w-md" : "w-full"} border-border/50 hover:bg-accent hover:border-primary/50 transition-all`} disabled={isLoadingMore}>
										{isLoadingMore ? (
											<>
												<ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
												Loading...
											</>
										) : (
											<>
												Show {Math.min(ITEMS_PER_PAGE, filteredBusinesses.length - itemsToShow)} more businesses
												<ChevronDown className="w-4 h-4 ml-2" />
											</>
										)}
									</Button>

									{/* Progress indicator for full mode */}
									{listMode === "full" && (
										<div className="mt-4 space-y-2">
											<div className="w-full bg-border/30 rounded-full h-1">
												<div className="bg-primary h-1 rounded-full transition-all duration-300" style={{ width: `${(itemsToShow / filteredBusinesses.length) * 100}%` }}></div>
											</div>
											<p className="text-xs text-muted-foreground">
												Showing {itemsToShow} of {filteredBusinesses.length} businesses
											</p>
										</div>
									)}
								</div>
							) : filteredBusinesses.length > 0 ? (
								<div className={`text-center ${listMode === "full" ? "py-8 mx-auto max-w-4xl px-4" : "py-6"}`}>
									<div className="flex flex-col items-center gap-3">
										<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
											<CheckCircle2 className="w-6 h-6 text-green-600" />
										</div>
										<div>
											<h4 className="font-semibold text-foreground mb-1">You&apos;ve reached the end!</h4>
											<p className="text-sm text-muted-foreground">Viewed all {filteredBusinesses.length} businesses in this area</p>
										</div>
										{listMode === "full" && (
											<Button variant="outline" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="mt-2">
												<ArrowUp className="w-4 h-4 mr-2" />
												Back to top
											</Button>
										)}
									</div>
								</div>
							) : null}

							{/* Sentinel for infinite scrolling */}
							<div ref={sentinelRef} className="h-4" />
						</>
					)}
				</div>
			</ScrollArea>
		</div>
	);
};

export default memo(BusinessCardList);
export { BusinessCard };
