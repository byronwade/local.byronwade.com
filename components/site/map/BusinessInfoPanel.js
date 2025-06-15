import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { ScrollArea } from "@components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { X, ChevronLeft, ChevronRight, Star, Phone, Mail, Globe, MapPin, Clock, Share2, Heart, MessageCircle, Camera, ExternalLink, Navigation, Calendar, DollarSign, Users, Award, Bookmark } from "lucide-react";
import useBusinessStore from "@store/useBusinessStore";
import useMapStore from "@store/useMapStore";

const BusinessInfoPanel = () => {
	const { activeBusinessId, filteredBusinesses, setActiveBusinessId } = useBusinessStore();
	const { centerOn } = useMapStore();
	const [activeTab, setActiveTab] = useState("overview");
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [isFavorited, setIsFavorited] = useState(false);

	const business = filteredBusinesses.find((b) => b.id === activeBusinessId);
	const businessIndex = business ? filteredBusinesses.findIndex((b) => b.id === business.id) : -1;

	// Mock reviews data
	const mockReviews = [
		{
			id: 1,
			author: "Sarah Johnson",
			avatar: "/placeholder.svg",
			rating: 5,
			date: "2024-01-15",
			text: "Excellent service! The team was professional and completed the work on time. Highly recommended!",
			helpful: 12,
		},
		{
			id: 2,
			author: "Mike Chen",
			avatar: "/placeholder.svg",
			rating: 4,
			date: "2024-01-10",
			text: "Good quality work, fair pricing. Would use their services again.",
			helpful: 8,
		},
		{
			id: 3,
			author: "Emily Davis",
			avatar: "/placeholder.svg",
			rating: 5,
			date: "2024-01-05",
			text: "Outstanding customer service and attention to detail. Very satisfied with the results.",
			helpful: 15,
		},
	];

	// Mock hours data
	const mockHours = {
		monday: "8:00 AM - 6:00 PM",
		tuesday: "8:00 AM - 6:00 PM",
		wednesday: "8:00 AM - 6:00 PM",
		thursday: "8:00 AM - 6:00 PM",
		friday: "8:00 AM - 6:00 PM",
		saturday: "9:00 AM - 4:00 PM",
		sunday: "Closed",
	};

	useEffect(() => {
		if (business?.coordinates) {
			const { lat, lng } = business.coordinates;
			const serviceAreaRadius = business.serviceArea?.value || null;
			centerOn(lat, lng, serviceAreaRadius);
		}
	}, [business, centerOn]);

	const handlePrev = () => {
		if (businessIndex > 0) {
			setActiveBusinessId(filteredBusinesses[businessIndex - 1].id);
			setActiveTab("overview");
		}
	};

	const handleNext = () => {
		if (businessIndex < filteredBusinesses.length - 1) {
			setActiveBusinessId(filteredBusinesses[businessIndex + 1].id);
			setActiveTab("overview");
		}
	};

	const handleClose = () => {
		setActiveBusinessId(null);
	};

	const handleCall = () => {
		if (business?.phone) {
			window.open(`tel:${business.phone}`, "_self");
		}
	};

	const handleEmail = () => {
		if (business?.email) {
			window.open(`mailto:${business.email}`, "_self");
		}
	};

	const handleWebsite = () => {
		if (business?.website) {
			window.open(business.website, "_blank");
		}
	};

	const handleDirections = () => {
		if (business?.coordinates) {
			const { lat, lng } = business.coordinates;
			window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
		}
	};

	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: business?.name,
					text: `Check out ${business?.name}`,
					url: window.location.href,
				});
			} catch (err) {
				console.log("Error sharing:", err);
			}
		} else {
			// Fallback to clipboard
			navigator.clipboard.writeText(window.location.href);
		}
	};

	const renderStars = (rating) => {
		return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : i < rating ? "fill-yellow-200 text-yellow-400" : "text-gray-300"}`} />);
	};

	if (!business) return null;

	const allImages = [business.image, ...(business.images || [])].filter(Boolean);

	return (
		<div className="absolute top-0 left-0 z-10 w-1/4 h-full p-4 overflow-hidden min-w-96">
			<div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow-2xl border">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b">
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="icon" onClick={handlePrev} disabled={businessIndex === 0}>
							<ChevronLeft className="w-4 h-4" />
						</Button>
						<Button variant="ghost" size="icon" onClick={handleNext} disabled={businessIndex === filteredBusinesses.length - 1}>
							<ChevronRight className="w-4 h-4" />
						</Button>
						<span className="text-sm text-gray-500">
							{businessIndex + 1} of {filteredBusinesses.length}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="icon" onClick={() => setIsFavorited(!isFavorited)}>
							<Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
						</Button>
						<Button variant="ghost" size="icon" onClick={handleShare}>
							<Share2 className="w-4 h-4" />
						</Button>
						<Button variant="ghost" size="icon" onClick={handleClose}>
							<X className="w-4 h-4" />
						</Button>
					</div>
				</div>

				{/* Content */}
				<ScrollArea className="flex-1">
					<div className="p-4">
						{/* Hero Image */}
						<div className="relative mb-4">
							<div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
								<Image src={allImages[selectedImageIndex] || "/placeholder.svg"} alt={business.name} fill className="object-cover" />
								{allImages.length > 1 && (
									<div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
										{selectedImageIndex + 1} / {allImages.length}
									</div>
								)}
							</div>
							{allImages.length > 1 && (
								<div className="flex gap-2 mt-2 overflow-x-auto">
									{allImages.map((img, index) => (
										<button key={index} onClick={() => setSelectedImageIndex(index)} className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${selectedImageIndex === index ? "border-primary" : "border-transparent"}`}>
											<Image src={img} alt="" width={64} height={64} className="object-cover w-full h-full" />
										</button>
									))}
								</div>
							)}
						</div>

						{/* Business Info */}
						<div className="space-y-4">
							<div>
								<div className="flex items-start justify-between mb-2">
									<h1 className="text-xl font-bold">{business.name}</h1>
									{business.isSponsored && (
										<Badge variant="secondary" className="text-xs">
											<Award className="w-3 h-3 mr-1" />
											Sponsored
										</Badge>
									)}
								</div>

								{business.ratings?.overall && (
									<div className="flex items-center gap-2 mb-2">
										<div className="flex items-center">{renderStars(business.ratings.overall)}</div>
										<span className="font-medium">{business.ratings.overall}</span>
										<span className="text-sm text-gray-500">({business.reviewCount || 0} reviews)</span>
									</div>
								)}

								<div className="flex flex-wrap gap-2 mb-3">
									{business.categories?.slice(0, 3).map((category, index) => (
										<Badge key={index} variant="outline" className="text-xs">
											{category}
										</Badge>
									))}
									{business.price && (
										<Badge variant="secondary" className="text-xs">
											<DollarSign className="w-3 h-3 mr-1" />
											{business.price}
										</Badge>
									)}
								</div>

								<div className="flex items-center gap-2 text-sm">
									<div className={`w-2 h-2 rounded-full ${business.isOpenNow ? "bg-green-500" : "bg-red-500"}`}></div>
									<span className={business.isOpenNow ? "text-green-600" : "text-red-600"}>{business.isOpenNow ? "Open now" : business.statusMessage || "Closed"}</span>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="grid grid-cols-2 gap-2">
								<Button onClick={handleCall} className="flex items-center gap-2">
									<Phone className="w-4 h-4" />
									Call
								</Button>
								<Button variant="outline" onClick={handleDirections} className="flex items-center gap-2">
									<Navigation className="w-4 h-4" />
									Directions
								</Button>
								{business.website && (
									<Button variant="outline" onClick={handleWebsite} className="flex items-center gap-2">
										<Globe className="w-4 h-4" />
										Website
									</Button>
								)}
								{business.email && (
									<Button variant="outline" onClick={handleEmail} className="flex items-center gap-2">
										<Mail className="w-4 h-4" />
										Email
									</Button>
								)}
							</div>

							{/* Tabs */}
							<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
								<TabsList className="grid w-full grid-cols-4">
									<TabsTrigger value="overview">Overview</TabsTrigger>
									<TabsTrigger value="reviews">Reviews</TabsTrigger>
									<TabsTrigger value="photos">Photos</TabsTrigger>
									<TabsTrigger value="hours">Hours</TabsTrigger>
								</TabsList>

								<TabsContent value="overview" className="space-y-4">
									<Card>
										<CardHeader>
											<CardTitle className="text-sm">Contact Information</CardTitle>
										</CardHeader>
										<CardContent className="space-y-3">
											{business.address && (
												<div className="flex items-start gap-3">
													<MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
													<span className="text-sm">{business.address}</span>
												</div>
											)}
											{business.phone && (
												<div className="flex items-center gap-3">
													<Phone className="w-4 h-4 text-gray-500" />
													<span className="text-sm">{business.phone}</span>
												</div>
											)}
											{business.email && (
												<div className="flex items-center gap-3">
													<Mail className="w-4 h-4 text-gray-500" />
													<span className="text-sm">{business.email}</span>
												</div>
											)}
										</CardContent>
									</Card>

									{business.description && (
										<Card>
											<CardHeader>
												<CardTitle className="text-sm">About</CardTitle>
											</CardHeader>
											<CardContent>
												<p className="text-sm text-gray-600 dark:text-gray-300">{business.description}</p>
											</CardContent>
										</Card>
									)}

									<Card>
										<CardHeader>
											<CardTitle className="text-sm">Services</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="flex flex-wrap gap-2">
												{business.categories?.map((category, index) => (
													<Badge key={index} variant="outline" className="text-xs">
														{category}
													</Badge>
												))}
											</div>
										</CardContent>
									</Card>
								</TabsContent>

								<TabsContent value="reviews" className="space-y-4">
									{mockReviews.map((review) => (
										<Card key={review.id}>
											<CardContent className="pt-4">
												<div className="flex items-start gap-3">
													<Avatar className="w-8 h-8">
														<AvatarImage src={review.avatar} />
														<AvatarFallback>{review.author[0]}</AvatarFallback>
													</Avatar>
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-1">
															<span className="font-medium text-sm">{review.author}</span>
															<div className="flex">{renderStars(review.rating)}</div>
														</div>
														<p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{review.text}</p>
														<div className="flex items-center gap-4 text-xs text-gray-500">
															<span>{new Date(review.date).toLocaleDateString()}</span>
															<button className="flex items-center gap-1 hover:text-gray-700">
																<MessageCircle className="w-3 h-3" />
																Helpful ({review.helpful})
															</button>
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</TabsContent>

								<TabsContent value="photos" className="space-y-4">
									<div className="grid grid-cols-2 gap-2">
										{allImages.map((img, index) => (
											<button key={index} onClick={() => setSelectedImageIndex(index)} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
												<Image src={img} alt="" width={150} height={150} className="object-cover w-full h-full hover:scale-105 transition-transform" />
											</button>
										))}
									</div>
								</TabsContent>

								<TabsContent value="hours" className="space-y-4">
									<Card>
										<CardHeader>
											<CardTitle className="text-sm flex items-center gap-2">
												<Clock className="w-4 h-4" />
												Business Hours
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-2">
												{Object.entries(mockHours).map(([day, hours]) => (
													<div key={day} className="flex justify-between text-sm">
														<span className="capitalize font-medium">{day}</span>
														<span className={hours === "Closed" ? "text-red-600" : "text-gray-600"}>{hours}</span>
													</div>
												))}
											</div>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};

export default BusinessInfoPanel;
