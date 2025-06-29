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
			return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : i < rating ? "fill-yellow-200 text-yellow-400" : "text-gray-300 dark:text-gray-600"}`} />);
		};

		return (
			<div className="px-4" ref={ref}>
				<div id={`business-${business.id}`} className={`group relative w-full mb-3 cursor-pointer transition-all duration-300 ease-out ${isActive ? "scale-[1.02] shadow-xl ring-2 ring-blue-500/40 dark:ring-blue-400/40" : isHovered ? "scale-[1.01] shadow-lg" : "hover:shadow-md"}`} onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
					{/* Modern Card Container */}
					<div className="relative w-full overflow-hidden bg-neutral-900 dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800 dark:border-neutral-900 hover:border-neutral-900 dark:hover:border-neutral-900 transition-all duration-300 backdrop-blur-sm">
						{/* Status Header Bar */}
						<div className="flex items-center justify-between p-4 pb-3 bg-gradient-to-r from-gray-800/80 dark:to-gray-900 border-b border-neutral-800 dark:border-neutral-900">
							<div className="flex items-center gap-2">
								{/* Availability Status */}
								<div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm ${business.isOpenNow ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-800" : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-800"}`}>
									<div className={`w-2 h-2 rounded-full ${business.isOpenNow ? "bg-emerald-500 dark:bg-emerald-400" : "bg-red-500 dark:bg-red-400"} animate-pulse`}></div>
									{business.isOpenNow ? "Open" : "Closed"}
								</div>

								{/* Trust Badges */}
								{business.isVerified && (
									<div className="flex items-center gap-1 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium ring-1 ring-blue-200 dark:ring-blue-800">
										<CheckCircle2 className="w-3 h-3" />
										<span className="hidden sm:inline">Verified</span>
									</div>
								)}
							</div>

							{/* Sponsored Badge */}
							{business.isSponsored && (
								<div className="px-2.5 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 text-amber-800 dark:text-amber-300 rounded-full text-xs font-bold ring-1 ring-amber-200 dark:ring-amber-800">
									<Award className="w-3 h-3 inline mr-1" />
									Featured
								</div>
							)}
						</div>

						{/* Main Content */}
						<div className="p-4">
							<div className="flex items-start gap-4">
								{/* Business Avatar */}
								<div className="flex-shrink-0 relative">
									<div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 shadow-md ring-2 ring-white dark:ring-gray-800 group-hover:ring-blue-200 dark:group-hover:ring-blue-800 transition-all duration-300">
										{business.logo && !imageError ? (
											<Image src={business.logo} alt={`${business.name} logo`} fill className="object-cover" onError={() => setImageError(true)} />
										) : (
											<div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-500/20 to-indigo-600/30 dark:from-blue-400/20 dark:to-indigo-500/30">
												<span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{business.name.charAt(0)}</span>
											</div>
										)}
									</div>

									{/* Photo Count Badge */}
									{business.images && business.images.length > 0 && (
										<div className="absolute -bottom-1 -right-1 bg-neutral-900/80 dark:bg-neutral-100/80 text-white dark:text-neutral-900 px-2 py-0.5 rounded-full text-xs backdrop-blur-sm flex items-center gap-1 font-medium">
											<Camera className="w-3 h-3" />
											{business.images.length}
										</div>
									)}
								</div>

								{/* Business Information */}
								<div className="flex-1 min-w-0 space-y-3">
									{/* Business Name */}
									<div>
										<h3 className="text-lg font-bold leading-tight text-gray-900 dark:text-white tracking-tight mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">{business.name}</h3>

										{/* Category & Price */}
										<div className="flex items-center gap-2 mb-2">
											{business.categories && business.categories.length > 0 && <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-neutral-800 dark:bg-neutral-800 px-2.5 py-1 rounded-lg">{business.categories[0]}</span>}
											{business.price && <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-lg">{business.price}</span>}
										</div>
									</div>

									{/* Rating & Reviews */}
									{business.ratings?.overall && (
										<div className="flex items-center gap-3">
											<div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800">
												<div className="flex">{renderStars(business.ratings.overall)}</div>
												<span className="text-sm font-bold text-gray-900 dark:text-white ml-1">{business.ratings.overall}</span>
											</div>
											{business.reviewCount && <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{business.reviewCount.toLocaleString()} reviews</span>}
										</div>
									)}

									{/* Location */}
									{business.address && (
										<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
											<MapPin className="w-4 h-4 text-gray-500 dark:text-gray-500" />
											<span className="truncate">{business.address.split(",").slice(0, 2).join(", ")}</span>
											{business.distance && <span className="text-blue-600 dark:text-blue-400 font-semibold ml-auto">{business.distance < 1 ? `${Math.round(business.distance * 1000)}m` : `${business.distance.toFixed(1)}km`}</span>}
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Action Footer */}
						<div className="border-t border-neutral-800 dark:border-neutral-900 bg-neutral-800/50 dark:bg-neutral-800/50 px-4 py-3">
							<div className="flex items-center justify-between">
								{/* Action Buttons */}
								<div className="flex gap-2">
									{business.phone && (
										<Button size="sm" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white border-0 font-medium px-4 shadow-sm" onClick={handleCall}>
											<Phone className="w-3.5 h-3.5 mr-1.5" />
											Call
										</Button>
									)}
									<Button size="sm" variant="outline" className="h-7 px-2 text-xs border-neutral-900 dark:border-neutral-900" onClick={handleDirections}>
										<Navigation className="w-3.5 h-3.5 mr-1.5" />
										Directions
									</Button>
								</div>

								{/* Social Proof Indicators */}
								<div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
									{business.responseTime && (
										<div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-md">
											<Timer className="w-3 h-3" />
											<span className="font-medium">Quick response</span>
										</div>
									)}
									{business.bookingCount && business.bookingCount > 10 && (
										<div className="flex items-center gap-1">
											<Users className="w-3 h-3" />
											<span className="font-medium">{business.bookingCount}+ bookings</span>
										</div>
									)}
									<ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
								</div>
							</div>
						</div>

						{/* Active State Indicator */}
						{isActive && <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-l-2xl"></div>}
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
			return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : i < rating ? "fill-yellow-200 text-yellow-400" : "text-gray-300 dark:text-gray-600"}`} />);
		};

		const handleBusinessPageClick = (event) => {
			// Don't navigate if this click is coming from a button
			const target = event.target;
			const isButton = target.closest("button");
			const isLink = target.closest("a");

			if (!isButton && !isLink) {
				window.location.href = `/biz/${business.id}`;
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

		const handleWebsite = (e) => {
			e.stopPropagation();
			if (business.website) {
				window.open(business.website, "_blank");
			}
		};

		return (
			<div className="mx-auto max-w-4xl">
				<Card className={`group mx-4 mb-6 overflow-hidden transition-all duration-200 cursor-pointer border border-neutral-800 dark:border-neutral-900 hover:border-neutral-900 dark:hover:border-neutral-900 ${isActive ? "ring-1 ring-blue-500/30 dark:ring-blue-400/30" : ""} bg-neutral-900`} onClick={handleBusinessPageClick}>
					<CardContent className="p-0">
						{/* Header with Business Info */}
						<div className="p-6 border-b border-neutral-800 dark:border-neutral-900">
							<div className="flex items-start gap-4">
								{/* Business Logo */}
								<div className="flex-shrink-0 relative">
									<div className="w-20 h-20 rounded-lg overflow-hidden border border-neutral-800 dark:border-neutral-900 bg-neutral-800 dark:bg-neutral-800">
										{business.logo && !imageError ? (
											<Image src={business.logo} alt={`${business.name} logo`} width={80} height={80} className="object-cover w-full h-full" onError={() => setImageError(true)} />
										) : (
											<div className="w-full h-full flex items-center justify-center bg-neutral-800 dark:bg-neutral-800">
												<span className="text-2xl font-bold text-gray-400 dark:text-gray-600">{business.name?.charAt(0) || "?"}</span>
											</div>
										)}
									</div>

									{/* Photo Count */}
									{business.images && business.images.length > 0 && (
										<div className="absolute -bottom-1 -right-1 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
											<Camera className="w-3 h-3" />
											{business.images.length}
										</div>
									)}
								</div>

								{/* Business Information */}
								<div className="flex-1 min-w-0">
									{/* Business Name and Status */}
									<div className="flex items-start justify-between mb-2">
										<div>
											<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{business.name}</h2>
											{Array.isArray(business.categories) && business.categories.length > 0 && <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{business.categories[0]}</p>}
										</div>

										{/* Status Badges */}
										<div className="flex items-center gap-2">
											{business.isOpenNow !== undefined && (
												<span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${business.isOpenNow ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"}`}>
													<div className={`w-1.5 h-1.5 rounded-full ${business.isOpenNow ? "bg-green-500" : "bg-red-500"}`}></div>
													{business.isOpenNow ? "Open" : "Closed"}
												</span>
											)}
											{business.isVerified && (
												<span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
													<CheckCircle2 className="w-3 h-3" />
													Verified
												</span>
											)}
										</div>
									</div>

									{/* Rating and Reviews */}
									{business.ratings?.overall && (
										<div className="flex items-center gap-3 mb-3">
											<div className="flex items-center gap-1.5">
												<div className="flex">{renderStars(business.ratings.overall)}</div>
												<span className="text-sm font-medium text-gray-900 dark:text-white">{business.ratings.overall}</span>
											</div>
											{business.reviewCount && <span className="text-sm text-gray-600 dark:text-gray-400">({business.reviewCount.toLocaleString()} reviews)</span>}
										</div>
									)}

									{/* Location and Distance */}
									{business.address && (
										<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
											<MapPin className="w-4 h-4 flex-shrink-0" />
											<span className="truncate">{business.address.split(",").slice(0, 2).join(", ")}</span>
										</div>
									)}

									{/* Additional Info */}
									<div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
										{business.price && <span className="font-medium text-green-600 dark:text-green-400">{business.price}</span>}
										{business.responseTime && (
											<span className="flex items-center gap-1">
												<Timer className="w-3 h-3" />
												Quick response
											</span>
										)}
										{business.bookingCount && business.bookingCount > 10 && (
											<span className="flex items-center gap-1">
												<Users className="w-3 h-3" />
												{business.bookingCount}+ booked
											</span>
										)}
									</div>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="p-4 bg-neutral-800 dark:bg-neutral-900/50">
							<div className="flex items-center gap-3">
								{business.phone && (
									<Button size="sm" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium" onClick={handleCall}>
										<Phone className="w-4 h-4 mr-2" />
										Call
									</Button>
								)}
								<Button size="sm" variant="outline" className="h-7 px-2 text-xs border-neutral-900 dark:border-neutral-900" onClick={handleDirections}>
									<Navigation className="w-4 h-4 mr-2" />
									Directions
								</Button>
								{business.website && (
									<Button size="sm" variant="outline" className="border-neutral-900 dark:border-neutral-900 font-medium" onClick={handleWebsite}>
										<Globe className="w-4 h-4 mr-2" />
										Website
									</Button>
								)}
								<div className="ml-auto">
									<ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	};

	const BusinessCard = ({ business, isActive }) => {
		const [imageError, setImageError] = useState(false);

		const renderStars = (rating) => {
			return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : i < rating ? "fill-yellow-200 text-yellow-400" : "text-gray-300 dark:text-gray-600"}`} />);
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
			<div ref={isActive ? activeCardRef : null} className={`group mb-3 cursor-pointer transition-all duration-200 ${isActive ? "ring-1 ring-blue-500/30 dark:ring-blue-400/30" : ""}`} onClick={() => handleCardClick(business)}>
				<Card className="overflow-hidden border border-neutral-800 dark:border-neutral-900 hover:border-neutral-900 dark:hover:border-neutral-900 bg-neutral-900 transition-all duration-200">
					<CardContent className="p-4">
						<div className="flex items-start gap-3">
							{/* Business Logo */}
							<div className="flex-shrink-0 relative">
								<div className="w-12 h-12 rounded-lg overflow-hidden border border-neutral-800 dark:border-neutral-900 bg-neutral-800 dark:bg-neutral-800">
									{business.logo && !imageError ? (
										<Image src={business.logo} alt={`${business.name} logo`} width={48} height={48} className="object-cover w-full h-full" onError={() => setImageError(true)} />
									) : (
										<div className="w-full h-full flex items-center justify-center bg-neutral-800 dark:bg-neutral-800">
											<span className="text-sm font-bold text-gray-400 dark:text-gray-600">{business.name?.charAt(0) || "?"}</span>
										</div>
									)}
								</div>

								{/* Photo Count Badge */}
								{business.images && business.images.length > 0 && (
									<div className="absolute -bottom-1 -right-1 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-1.5 py-0.5 rounded text-xs font-medium flex items-center gap-1">
										<Camera className="w-2.5 h-2.5" />
										{business.images.length}
									</div>
								)}
							</div>

							{/* Business Information */}
							<div className="flex-1 min-w-0">
								{/* Header with Name and Status */}
								<div className="flex items-start justify-between mb-2">
									<div className="min-w-0 flex-1">
										<h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-1 truncate">{business.name}</h3>
										{Array.isArray(business.categories) && business.categories.length > 0 && <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{business.categories[0]}</p>}
									</div>

									{/* Status */}
									{business.isOpenNow !== undefined && (
										<span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${business.isOpenNow ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"}`}>
											<div className={`w-1 h-1 rounded-full ${business.isOpenNow ? "bg-green-500" : "bg-red-500"}`}></div>
											{business.isOpenNow ? "Open" : "Closed"}
										</span>
									)}
								</div>

								{/* Rating and Distance */}
								<div className="flex items-center justify-between mb-2">
									{business.ratings?.overall && (
										<div className="flex items-center gap-1.5">
											<div className="flex">{renderStars(business.ratings.overall)}</div>
											<span className="text-xs font-medium text-gray-900 dark:text-white">{business.ratings.overall}</span>
											{business.reviewCount && <span className="text-xs text-gray-500 dark:text-gray-400">({business.reviewCount})</span>}
										</div>
									)}
									{business.distance && <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{business.distance < 1 ? `${Math.round(business.distance * 1000)}m` : `${business.distance.toFixed(1)}km`}</span>}
								</div>

								{/* Address */}
								{business.address && (
									<p className="text-xs text-gray-600 dark:text-gray-400 mb-3 truncate flex items-center gap-1">
										<MapPin className="w-3 h-3 flex-shrink-0" />
										{business.address.split(",").slice(0, 2).join(", ")}
									</p>
								)}

								{/* Quick Info and Actions */}
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
										{business.price && <span className="font-medium text-green-600 dark:text-green-400">{business.price}</span>}
										{business.isVerified && (
											<span className="flex items-center gap-1">
												<CheckCircle2 className="w-3 h-3" />
												Verified
											</span>
										)}
									</div>

									{/* Action Buttons */}
									<div className="flex items-center gap-1">
										{business.phone && (
											<Button size="sm" variant="outline" className="h-7 px-2 text-xs border-neutral-900 dark:border-neutral-900" onClick={handleCall}>
												<Phone className="w-3 h-3 mr-1" />
												Call
											</Button>
										)}
										<Button size="sm" variant="outline" className="h-7 px-2 text-xs border-neutral-900 dark:border-neutral-900" onClick={handleDirections}>
											<Navigation className="w-3 h-3" />
										</Button>
										<ChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors ml-1" />
									</div>
								</div>
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
			<div className={`border-b border-neutral-800 dark:border-neutral-900 bg-neutral-900 dark:bg-neutral-900 flex-shrink-0 ${listMode === "full" ? "px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6" : "px-3 sm:px-4 py-3 sm:py-4"}`}>
				<div className={`flex flex-col ${listMode === "full" ? "gap-3 sm:gap-4" : "gap-2 sm:gap-3"}`}>
					{/* Results Count & Search Info */}
					<div className="flex items-start justify-between gap-2">
						<div className="flex-1 min-w-0">
							<h2 className={`font-semibold text-gray-900 dark:text-white truncate ${listMode === "full" ? "text-lg sm:text-xl lg:text-2xl" : "text-sm sm:text-base lg:text-lg"}`}>
								{filteredBusinesses.length.toLocaleString()} result{filteredBusinesses.length !== 1 ? "s" : ""}
							</h2>
							{(searchQuery || searchLocation) && (
								<p className={`text-gray-600 dark:text-gray-400 truncate ${listMode === "full" ? "text-sm sm:text-base" : "text-xs sm:text-sm"} mt-0.5`}>
									{searchQuery && `"${searchQuery}"`}
									{searchQuery && searchLocation && " in "}
									{searchLocation && searchLocation}
								</p>
							)}
						</div>
						{listMode === "full" && (
							<div className="text-right flex-shrink-0 hidden sm:block">
								<p className="text-xs text-gray-500 dark:text-gray-400">Updated {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
							</div>
						)}
					</div>

					{/* Status Indicators */}
					<div className={`flex items-center gap-2 sm:gap-3 lg:gap-4 text-xs text-gray-600 dark:text-gray-400 overflow-x-auto ${listMode === "full" ? "flex-wrap" : ""}`}>
						<div className="flex items-center gap-1 flex-shrink-0">
							<div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
							<span className="font-medium whitespace-nowrap">{filteredBusinesses.filter((b) => b.isOpenNow).length} open</span>
						</div>
						{listMode === "full" && (
							<>
								<div className="flex items-center gap-1 flex-shrink-0">
									<Clock className="w-3 h-3 text-gray-500" />
									<span className="whitespace-nowrap">{filteredBusinesses.filter((b) => !b.isOpenNow).length} closed</span>
								</div>
								<div className="flex items-center gap-1 flex-shrink-0">
									<Award className="w-3 h-3 text-amber-500" />
									<span className="whitespace-nowrap">{filteredBusinesses.filter((b) => b.isSponsored).length} featured</span>
								</div>
								<div className="flex items-center gap-1 flex-shrink-0 hidden sm:flex">
									<Shield className="w-3 h-3 text-blue-500" />
									<span className="whitespace-nowrap">{filteredBusinesses.filter((b) => b.isVerified).length} verified</span>
								</div>
							</>
						)}
					</div>

					{/* Action Controls */}
					<div className={`flex flex-col gap-2 ${listMode === "full" ? "sm:flex-row sm:items-center sm:justify-between sm:gap-3" : ""}`}>
						{/* Primary Actions */}
						<div className={`flex items-center gap-2 ${listMode === "full" ? "order-2 sm:order-1" : ""}`}>
							{/* Map Toggle Button */}
							{onMapToggle && (
								<Button variant={showMap ? "default" : "outline"} size="sm" onClick={onMapToggle} className={`transition-all duration-200 flex-shrink-0 border-neutral-800 dark:border-neutral-900 hover:border-neutral-900 dark:hover:border-neutral-900 ${listMode === "full" ? "h-8 sm:h-9 lg:h-10 px-3 sm:px-4 text-xs sm:text-sm" : "h-7 sm:h-8 px-2 sm:px-3 text-xs"}`}>
									{showMap ? (
										<>
											<Map className={`${listMode === "full" ? "w-3 h-3 sm:w-4 sm:h-4" : "w-3 h-3"} ${listMode === "full" ? "sm:mr-2" : "sm:mr-1.5"}`} />
											<span className={`${listMode === "full" ? "hidden sm:inline" : "hidden lg:inline"}`}>Map View</span>
										</>
									) : (
										<>
											<List className={`${listMode === "full" ? "w-3 h-3 sm:w-4 sm:h-4" : "w-3 h-3"} ${listMode === "full" ? "sm:mr-2" : "sm:mr-1.5"}`} />
											<span className={`${listMode === "full" ? "hidden sm:inline" : "hidden lg:inline"}`}>List View</span>
										</>
									)}
								</Button>
							)}

							{/* AI Assistant Button */}
							{onAIClick && (
								<Button variant="outline" size="sm" onClick={onAIClick} className={`bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950/80 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 flex-shrink-0 ${listMode === "full" ? "h-8 sm:h-9 lg:h-10 px-3 sm:px-4 text-xs sm:text-sm" : "h-7 sm:h-8 px-2 sm:px-3 text-xs"}`}>
									<Bot className={`${listMode === "full" ? "w-3 h-3 sm:w-4 sm:h-4" : "w-3 h-3"} ${listMode === "full" ? "sm:mr-2" : "sm:mr-1.5"}`} />
									<span className={`font-medium ${listMode === "full" ? "hidden sm:inline" : "hidden lg:inline"}`}>AI Assistant</span>
								</Button>
							)}
						</div>

						{/* Filter & Sort Controls */}
						<div className={`flex items-center gap-2 ${listMode === "full" ? "order-1 sm:order-2" : ""}`}>
							{/* Filter Button */}
							<Button variant="outline" size="sm" onClick={handleFilterClick} className={`border-neutral-800 dark:border-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-900 transition-all duration-200 flex-1 sm:flex-initial ${listMode === "full" ? "h-8 sm:h-9 lg:h-10 px-3 sm:px-4 text-xs sm:text-sm" : "h-8 px-3 text-xs"}`}>
								<Filter className={`${listMode === "full" ? "w-3 h-3 sm:w-4 sm:h-4" : "w-3 h-3"} ${listMode === "full" ? "sm:mr-2" : "sm:mr-1.5"}`} />
								<span className={`${listMode === "full" ? "hidden sm:inline" : "hidden lg:inline"}`}>Filters</span>
							</Button>

							{/* Sort Dropdown */}
							<DropdownMenu open={showSort} onOpenChange={setShowSort}>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="sm" className={`border-neutral-800 dark:border-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-900 transition-all duration-200 flex-1 sm:flex-initial ${listMode === "full" ? "h-8 sm:h-9 lg:h-10 px-3 sm:px-4 text-xs sm:text-sm" : "h-8 px-3 text-xs"}`}>
										<SortAsc className={`${listMode === "full" ? "w-3 h-3 sm:w-4 sm:h-4" : "w-3 h-3"} ${listMode === "full" ? "sm:mr-2" : "sm:mr-1.5"}`} />
										<span className={`${listMode === "full" ? "hidden sm:inline" : "hidden lg:inline"} truncate`}>{sortOptions.find((option) => option.value === sortBy)?.label || "Sort"}</span>
										<ChevronDown className={`${listMode === "full" ? "w-3 h-3 sm:w-4 sm:h-4" : "w-3 h-3"} ${listMode === "full" ? "sm:ml-2" : "sm:ml-1"} flex-shrink-0`} />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-48 bg-neutral-900 dark:bg-neutral-900 border-neutral-800 dark:border-neutral-700 shadow-lg">
									{sortOptions.map((option) => (
										<DropdownMenuItem key={option.value} onClick={() => handleSortSelect(option.value)} className="text-sm hover:bg-neutral-800 dark:hover:bg-neutral-800 cursor-pointer">
											{option.label}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>
			</div>
			{/* Business List */}
			<ScrollArea className="flex-1 min-h-0" ref={listRef}>
				<div className={listMode === "full" ? "py-4" : "p-4"}>
					{filteredBusinesses.length === 0 && !loading ? (
						/* Empty State */
						<div className={`text-center ${listMode === "full" ? "py-20 max-w-2xl mx-auto px-4" : "py-12"}`}>
							<div className="w-16 h-16 mx-auto mb-4 bg-neutral-800 dark:bg-neutral-800 rounded-full flex items-center justify-center">
								<MapPin className="w-8 h-8 text-gray-500 dark:text-gray-400" />
							</div>
							<h3 className={`font-semibold text-gray-900 dark:text-white mb-2 ${listMode === "full" ? "text-2xl" : "text-lg"}`}>{searchQuery || searchLocation ? "No businesses found" : "Start exploring"}</h3>
							<p className={`text-gray-600 dark:text-gray-400 mb-6 mx-auto ${listMode === "full" ? "text-base max-w-lg" : "text-sm max-w-sm"}`}>{searchQuery || searchLocation ? "Try adjusting your search terms or explore different areas on the map" : "Search for businesses or explore the map to discover local businesses around you"}</p>
							{!searchQuery && !searchLocation && (
								<div className="space-y-3">
									<p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Popular searches:</p>
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
									<div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
										<ReloadIcon className="w-4 h-4 animate-spin" />
										<span className="text-sm">Loading more businesses...</span>
									</div>
								</div>
							)}

							{/* Load More Button or End Message */}
							{itemsToShow < filteredBusinesses.length ? (
								<div className={`text-center ${listMode === "full" ? "py-6 mx-auto max-w-4xl px-4" : "py-4"}`}>
									<Button variant="outline" size={listMode === "full" ? "lg" : "default"} onClick={() => setVisibleStartIndex(Math.min(visibleStartIndex + ITEMS_PER_PAGE, filteredBusinesses.length - ITEMS_PER_PAGE))} className={`${listMode === "full" ? "w-full max-w-md" : "w-full"} border-neutral-800 dark:border-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all`} disabled={isLoadingMore}>
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
											<div className="w-full bg-neutral-700 dark:bg-neutral-700 rounded-full h-1">
												<div className="bg-blue-500 h-1 rounded-full transition-all duration-300" style={{ width: `${(itemsToShow / filteredBusinesses.length) * 100}%` }}></div>
											</div>
											<p className="text-xs text-gray-600 dark:text-gray-400">
												Showing {itemsToShow} of {filteredBusinesses.length} businesses
											</p>
										</div>
									)}
								</div>
							) : filteredBusinesses.length > 0 ? (
								<div className={`text-center ${listMode === "full" ? "py-8 mx-auto max-w-4xl px-4" : "py-6"}`}>
									<div className="flex flex-col items-center gap-3">
										<div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
											<CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
										</div>
										<div>
											<h4 className="font-semibold text-gray-900 dark:text-white mb-1">You&apos;ve reached the end!</h4>
											<p className="text-sm text-gray-600 dark:text-gray-400">Viewed all {filteredBusinesses.length} businesses in this area</p>
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
