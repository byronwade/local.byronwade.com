"use client";

import React, { Suspense, useState } from "react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Separator } from "@components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@components/ui/accordion";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { 
  ShoppingCart, 
  Star, 
  CheckCircle, 
  Truck, 
  Shield, 
  Clock, 
  Package, 
  ArrowLeft, 
  Heart, 
  Share2, 
  ThumbsUp, 
  ArrowRight, 
  User,
  Award,
  Microscope,
  Leaf,
  HeartHandshake,
  Headphones,
  ShoppingBag,
  Eye,
  Move3D,
  ZoomIn,
  Info,
  Plus,
  Minus,
  Copy
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Product3DViewer from "@components/store/Product3DViewer";

export const dynamic = "force-dynamic";

const getProductData = (productId) => {
	const products = {
		"bulk-hardwood-dowels": {
			id: "bulk-hardwood-dowels",
			name: "Bulk Hardwood Dowels for Mushroom Plug Spawn",
			description: "These chemical-free, non-sterilized, un-inoculated 1\" fluted hardwood dowels are ideal for mushroom plug spawn production. Aside from being kiln dried, dowels are not treated in any other way. (Note: These plugs do not contain mushroom mycelium.)",
			price: 11.00,
			originalPrice: null,
			images: [
				"https://cdn.shopify.com/s/files/1/0594/1261/1132/files/cultivating-tools-fluted-hardwood-dowels-for-mushroom-plug-spawn-29527678976102.jpg?v=1739411593",
				"https://cdn.shopify.com/s/files/1/0594/1261/1132/files/cultivating-tools-fluted-hardwood-dowels-for-mushroom-plug-spawn-29605840617574.jpg?v=1739411593"
			],
			category: "Cultivating Tools",
			brand: "Zugzology",
			rating: 5.0,
			reviewCount: 0,
			badges: ["Zugzology", "Cultivating Tools"],
			variants: [
				{ name: "500 plugs", price: 11.00, selected: true },
				{ name: "2500 plugs", price: 45.00, selected: false }
			],
			features: {
				"Small Family Business": "Family Owned & Operated in California",
				"Expert Mycology Knowledge": "Decades of Experience",
				"Eco-Friendly Practices": "100% Sustainable",
				"Same-Day Processing": "Lightning Fast Shipping"
			},
			specifications: {
				Category: "Cultivating Tools",
				Brand: "Zugzology", 
				SKU: "42553753567292"
			},
			inStock: true,
			availability: "Available (Backorder)",
			shipping: "FREE Shipping",
			shippingTime: "Ships within 1-2 weeks",
			returnPolicy: "30-day money-back guarantee",
			madeIn: "California, USA",
			businessType: "Family Owned"
		},
		"thorbis-pos-lite": {
			id: "thorbis-pos-lite",
			name: "Thorbis POS Lite",
			description: "Entry-level point-of-sale system perfect for small businesses. Includes essential features for payment processing and basic inventory tracking.",
			price: 599,
			originalPrice: 799,
			images: ["/placeholder-business.svg", "/placeholder-business.svg", "/placeholder-business.svg", "/placeholder-business.svg"],
			category: "POS Systems",
			brand: "Thorbis",
			rating: 4.5,
			reviewCount: 89,
			badges: ["Thorbis", "POS Systems"],
			variants: [
				{ name: "Basic Package", price: 599, selected: true },
				{ name: "Plus Package", price: 749, selected: false }
			],
			features: {
				"Easy Setup": "Get started in under 30 minutes",
				"Cloud-Based": "Access your data anywhere",
				"Payment Processing": "Accept all major payment methods",
				"24/7 Support": "Round-the-clock customer support"
			},
			specifications: {
				Display: '12" HD Touchscreen',
				Processor: "ARM Cortex A7",
				Memory: "4GB RAM",
				Storage: "128GB SSD",
				Connectivity: "WiFi, Bluetooth",
				Ports: "USB 2.0, Ethernet",
				OS: "Android 12",
				Warranty: "2 years",
				Category: "POS Systems",
				Brand: "Thorbis",
				SKU: "TH-POS-LITE-001"
			},
			inStock: true,
			availability: "Available",
			shipping: "FREE Shipping",
			shippingTime: "Ships within 2-3 business days",
			returnPolicy: "30-day money-back guarantee",
			madeIn: "United States",
			businessType: "Technology Company"
		},
		"thorbis-pos-pro": {
			id: "thorbis-pos-pro",
			name: "Thorbis POS Pro",
			description: "Advanced point-of-sale system with integrated payment processing, inventory management, and real-time analytics.",
			price: 1299,
			originalPrice: 1599,
			images: ["/placeholder-business.svg", "/placeholder-business.svg", "/placeholder-business.svg", "/placeholder-business.svg"],
			category: "POS Systems",
			brand: "Thorbis",
			rating: 4.8,
			reviewCount: 127,
			badges: ["Thorbis", "Best Seller"],
			variants: [
				{ name: "Standard Package", price: 1299, selected: true },
				{ name: "Premium Package", price: 1599, selected: false }
			],
			features: {
				"Advanced Analytics": "Real-time business insights",
				"Multi-Location": "Manage multiple stores",
				"Employee Management": "Staff scheduling and tracking",
				"Customer Loyalty": "Built-in loyalty program"
			},
			specifications: {
				Display: '15.6" HD Touchscreen',
				Processor: "Intel Core i3",
				Memory: "8GB RAM",
				Storage: "256GB SSD",
				Connectivity: "WiFi 6, Bluetooth 5.0",
				Ports: "USB 3.0, Ethernet, HDMI",
				OS: "Windows 11 Pro",
				Warranty: "3 years",
				Category: "POS Systems",
				Brand: "Thorbis",
				SKU: "TH-POS-PRO-001"
			},
			inStock: true,
			availability: "Available",
			shipping: "FREE Shipping",
			shippingTime: "Ships within 1-2 business days",
			returnPolicy: "30-day money-back guarantee",
			madeIn: "United States",
			businessType: "Technology Company"
		},
		"thorbis-fleet-tracker": {
			id: "thorbis-fleet-tracker",
			name: "Thorbis Fleet Tracker",
			description: "Real-time GPS tracking system for fleet vehicles with advanced monitoring and reporting capabilities.",
			price: 299,
			originalPrice: 399,
			images: ["/placeholder-business.svg", "/placeholder-business.svg", "/placeholder-business.svg", "/placeholder-business.svg"],
			category: "Fleet Management",
			brand: "Thorbis",
			rating: 4.6,
			reviewCount: 89,
			badges: ["Thorbis", "Popular"],
			variants: [
				{ name: "Single Device", price: 299, selected: true },
				{ name: "5-Pack Bundle", price: 1299, selected: false }
			],
			features: {
				"Real-Time Tracking": "Live GPS location updates",
				"Driver Analytics": "Monitor driving behavior and safety",
				"Route Optimization": "AI-powered route planning",
				"Maintenance Alerts": "Predictive maintenance reminders"
			},
			specifications: {
				"GPS Accuracy": "±3 meters",
				"Battery Life": "Up to 30 days",
				"Operating Temperature": "-20°C to +70°C",
				"Water Resistance": "IP67",
				Connectivity: "4G LTE, GPS, GLONASS",
				Installation: "Plug-and-play",
				Coverage: "Global",
				Warranty: "2 years",
				Category: "Fleet Management",
				Brand: "Thorbis",
				SKU: "TH-FLEET-001"
			},
			inStock: true,
			availability: "Available",
			shipping: "FREE Shipping",
			shippingTime: "Ships within 1-2 business days",
			returnPolicy: "30-day money-back guarantee",
			madeIn: "United States",
			businessType: "Technology Company"
		},
	};
	return products[productId] || null;
};

function ProductSkeleton() {
	return (
		<div className="max-w-full mx-auto p-4 lg:p-8">
			<div className="grid grid-cols-1 md:grid-cols-[1fr_420px] xl:grid-cols-[minmax(0,1fr)_420px] gap-8 mb-16">
				<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
					<div className="col-span-1">
						<div className="sticky top-[126px]">
							<div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl animate-pulse shadow-lg" />
						</div>
					</div>
				</div>
				<div className="col-span-1 w-full lg:max-w-[420px] justify-self-end">
					<div className="space-y-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-8 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-xl animate-pulse">
						<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
						<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
						<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2" />
					</div>
				</div>
			</div>
		</div>
	);
}

function ProductGallery({ images, productName, category, product }) {
	const [selectedImage, setSelectedImage] = useState(0);
	const [viewMode, setViewMode] = useState('3d'); // '3d', 'image'
	const [isZoomed, setIsZoomed] = useState(false);

	return (
		<section aria-label="Product gallery" className="col-span-1">
			<div className="sticky top-[126px]">
				<div className="space-y-6">
					{/* Main viewer area with enhanced styling */}
					<div className="relative group">
						{viewMode === '3d' ? (
							<div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border border-gray-200/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50">
								<Product3DViewer 
									productName={productName}
									productCategory={category}
									className="h-full w-full"
									autoRotate={false}
									showControls={true}
								/>
							</div>
						) : (
							<div className="relative aspect-square group bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 overflow-hidden">
								<Image
									alt={productName}
									fill
									className={`object-contain p-6 transition-all duration-500 ${
										isZoomed ? 'scale-150 cursor-zoom-out' : 'group-hover:scale-105 cursor-zoom-in'
									}`}
									sizes="(min-width: 1024px) 66vw, 100vw"
									src={images[selectedImage]}
									priority
									onClick={() => setIsZoomed(!isZoomed)}
								/>
								
								{/* Image counter */}
								<div className="absolute top-4 right-4 z-10">
									<Badge className="bg-black/70 text-white border-0 backdrop-blur-sm">
										{selectedImage + 1} / {images.length}
									</Badge>
								</div>

								{/* Navigation arrows - enhanced design */}
								<div className="absolute inset-0 flex items-center justify-between p-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
									{selectedImage > 0 && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setSelectedImage(selectedImage - 1)}
											className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full h-12 w-12 p-0 shadow-lg shadow-black/20 border border-white/20 backdrop-blur-sm hover:scale-110 transition-transform"
										>
											<ArrowLeft className="h-5 w-5" />
										</Button>
									)}
									
									{selectedImage < images.length - 1 && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setSelectedImage(selectedImage + 1)}
											className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full h-12 w-12 p-0 shadow-lg shadow-black/20 border border-white/20 backdrop-blur-sm hover:scale-110 transition-transform ml-auto"
										>
											<ArrowRight className="h-5 w-5" />
										</Button>
									)}
								</div>

								{/* Zoom indicator */}
								{!isZoomed && (
									<div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
										<Badge className="bg-black/70 text-white border-0 backdrop-blur-sm">
											<ZoomIn className="h-3 w-3 mr-1" />
											Click to zoom
										</Badge>
									</div>
								)}
							</div>
						)}
					</div>

					{/* Enhanced view mode selector */}
					<div className="flex justify-center">
						<div className="flex items-center gap-1 p-1.5 bg-gray-100/80 dark:bg-gray-800/80 rounded-2xl backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 shadow-lg">
							<Button
								variant={viewMode === '3d' ? 'default' : 'ghost'}
								size="sm"
								onClick={() => setViewMode('3d')}
								className={`h-10 px-4 rounded-xl font-medium transition-all duration-200 ${
									viewMode === '3d' 
										? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25' 
										: 'hover:bg-white/60 dark:hover:bg-gray-700/60'
								}`}
							>
								<Move3D className="h-4 w-4 mr-2" />
								3D View
							</Button>
							<Button
								variant={viewMode === 'image' ? 'default' : 'ghost'}
								size="sm"
								onClick={() => setViewMode('image')}
								className={`h-10 px-4 rounded-xl font-medium transition-all duration-200 ${
									viewMode === 'image' 
										? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25' 
										: 'hover:bg-white/60 dark:hover:bg-gray-700/60'
								}`}
							>
								<Eye className="h-4 w-4 mr-2" />
								Photos ({images.length})
							</Button>
						</div>
					</div>

					{/* Enhanced thumbnails section */}
					<div className="space-y-4">
						{/* Desktop thumbnails */}
						<div className="hidden md:flex justify-center">
							<div className="flex gap-3 max-w-md overflow-x-auto py-2 px-1">
								{/* 3D View thumbnail */}
								<button
									onClick={() => setViewMode('3d')}
									className={`relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-2 transition-all duration-300 hover:scale-105 ${
										viewMode === '3d' 
											? "border-blue-500 ring-4 ring-blue-500/20 shadow-lg shadow-blue-500/25" 
											: "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
									}`}
								>
									<div className="flex items-center justify-center h-full">
										<Move3D className="w-7 h-7 text-blue-600" />
									</div>
									<div className="absolute inset-x-0 bottom-0 bg-blue-600/90 text-white text-[11px] text-center py-1 font-semibold">
										3D
									</div>
								</button>

								{/* Image thumbnails */}
								{images.map((image, index) => (
									<button
										key={index}
										onClick={() => {
											setSelectedImage(index);
											setViewMode('image');
										}}
										className={`relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 border-2 transition-all duration-300 hover:scale-105 ${
											viewMode === 'image' && selectedImage === index 
												? "border-blue-500 ring-4 ring-blue-500/20 shadow-lg shadow-blue-500/25" 
												: "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
										}`}
									>
										<Image
											alt={`${productName} view ${index + 1}`}
											loading="lazy"
											fill
											className="object-cover"
											sizes="80px"
											src={image}
										/>
										{viewMode === 'image' && selectedImage === index && (
											<div className="absolute inset-0 bg-blue-600/10 border-2 border-blue-500 rounded-xl" />
										)}
									</button>
								))}
							</div>
						</div>

						{/* Mobile thumbnails - enhanced */}
						<div className="md:hidden">
							<div className="flex gap-3 overflow-x-auto py-3 px-4 -mx-4 scrollbar-hide">
								{/* 3D View thumbnail - mobile */}
								<button
									onClick={() => setViewMode('3d')}
									className={`relative aspect-square w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-2 transition-all duration-300 ${
										viewMode === '3d' 
											? "border-blue-500 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/25" 
											: "border-gray-200 dark:border-gray-700"
									}`}
								>
									<div className="flex items-center justify-center h-full">
										<Move3D className="w-5 h-5 text-blue-600" />
									</div>
									<div className="absolute inset-x-0 bottom-0 bg-blue-600/90 text-white text-[10px] text-center py-0.5 font-semibold">
										3D
									</div>
								</button>

								{/* Image thumbnails - mobile */}
								{images.map((image, index) => (
									<button
										key={index}
										onClick={() => {
											setSelectedImage(index);
											setViewMode('image');
										}}
										className={`relative aspect-square w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 border-2 transition-all duration-300 ${
											viewMode === 'image' && selectedImage === index 
												? "border-blue-500 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/25" 
												: "border-gray-200 dark:border-gray-700"
										}`}
									>
										<Image
											alt={`${productName} view ${index + 1}`}
											loading="lazy"
											fill
											className="object-cover"
											sizes="64px"
											src={image}
										/>
									</button>
								))}
								<div className="w-4 flex-shrink-0" aria-hidden="true" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function ProductInfo({ product }) {
	const [selectedVariant, setSelectedVariant] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [showFullDescription, setShowFullDescription] = useState(false);

	return (
		<section aria-label="Product information" className="col-span-1">
			<div className="space-y-6">
				{/* Enhanced product header */}
				<div className="space-y-4">
					<div className="space-y-2">
											<h1 className="text-2xl xl:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 leading-tight" itemProp="name">
						{product.name}
					</h1>
						
						<meta itemProp="description" content={product.description} />
						<meta itemProp="brand" content={product.brand} />
						<meta itemProp="category" content={product.category} />

											{/* Enhanced badges */}
					<div className="flex flex-wrap gap-1.5" aria-label="Product badges">
						{product.badges.map((badge, index) => (
							<Badge 
								key={index}
								className={`text-xs font-medium px-2.5 py-1 transition-all duration-200 ${
									index === 0 
										? "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300" 
										: "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
								}`}
							>
								{badge}
							</Badge>
						))}
					</div>
				</div>

				{/* Enhanced rating */}
					<div className="flex items-center gap-2 p-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-lg border border-gray-200/50 dark:border-gray-700/50" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
						<div className="flex items-center gap-1">
							{[...Array(5)].map((_, i) => (
								<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
							))}
						</div>
						<div className="flex items-center gap-2">
							<span className="text-base font-semibold text-gray-900 dark:text-gray-100" itemProp="ratingValue">{product.rating}</span>
							<span className="text-sm text-gray-600 dark:text-gray-300">({product.reviewCount} reviews)</span>
							<button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline ml-1 font-medium">
								Read reviews
							</button>
						</div>
						<meta itemProp="bestRating" content="5" />
						<meta itemProp="worstRating" content="1" />
						<meta itemProp="reviewCount" content={product.reviewCount} />
					</div>
				</div>

				{/* Enhanced variant selection - positioned after rating */}
				<div className="space-y-3">
					<div className="space-y-2">
						<Label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">Available Options</Label>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
							{product.variants.map((variant, index) => (
								<button
									key={index}
									onClick={() => setSelectedVariant(index)}
									className={`p-3 border-2 rounded-lg text-left transition-all duration-200 hover:scale-[1.01] ${
										selectedVariant === index
											? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 ring-2 ring-blue-500/20"
											: "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800/50"
									}`}
								>
									<div className="font-medium text-gray-900 dark:text-gray-100">{variant.name}</div>
									<div className="text-base font-bold text-blue-600 dark:text-blue-400">${variant.price.toFixed(2)}</div>
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Enhanced business info card */}
				<BusinessInfoCard product={product} />

				{/* Enhanced product description */}
				<div className="bg-white/50 dark:bg-gray-900/30 rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
					<h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
						<Info className="h-4 w-4 text-blue-600" />
						Product Description
					</h2>
					<div className="prose prose-gray dark:prose-invert max-w-none">
						<p className={`text-gray-700 dark:text-gray-300 leading-relaxed ${!showFullDescription && product.description.length > 200 ? 'line-clamp-3' : ''}`}>
							{product.description}
						</p>
						{product.description.length > 200 && (
							<button
								onClick={() => setShowFullDescription(!showFullDescription)}
								className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium mt-2 flex items-center gap-1"
							>
								{showFullDescription ? 'Show less' : 'Show more'}
								<ArrowRight className={`h-4 w-4 transition-transform ${showFullDescription ? 'rotate-90' : ''}`} />
							</button>
						)}
					</div>
				</div>


			</div>
		</section>
	);
}

function BusinessInfoCard({ product }) {
	const [copied, setCopied] = useState(false);

	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-card-foreground shadow-lg border border-gray-200/60 dark:border-gray-700/60 rounded-2xl overflow-hidden">
			<div className="p-6 space-y-6">
				{/* MODERNIZED USA MADE SECTION */}
				<div className="relative overflow-hidden bg-gradient-to-br from-red-500/5 via-white to-blue-600/5 dark:from-red-900/20 dark:via-gray-900 dark:to-blue-900/20 rounded-2xl border-2 border-gradient-to-r border-red-200/50 dark:border-red-800/30 shadow-xl">
					{/* Patriotic Background Pattern */}
					<div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
						<div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-blue-500/10"></div>
					</div>
					
					{/* Star decorations */}
					<div className="absolute top-4 right-4 text-blue-600/20 dark:text-blue-400/20">
						<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9.049 2.927c.396-.954 1.506-.954 1.902 0l1.07 2.585a1 1 0 00.95.69h2.735c1.006 0 1.424 1.298.614 1.911l-2.213 1.676a1 1 0 00-.364 1.118l1.07 2.585c.396.954-.441 1.747-1.175 1.146L10 11.347l-2.638 2.291c-.734.601-1.571-.192-1.175-1.146l1.07-2.585a1 1 0 00-.364-1.118L4.68 7.113c-.81-.613-.392-1.911.614-1.911h2.735a1 1 0 00.95-.69l1.07-2.585z" />
						</svg>
					</div>
					<div className="absolute bottom-4 left-4 text-red-600/20 dark:text-red-400/20">
						<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9.049 2.927c.396-.954 1.506-.954 1.902 0l1.07 2.585a1 1 0 00.95.69h2.735c1.006 0 1.424 1.298.614 1.911l-2.213 1.676a1 1 0 00-.364 1.118l1.07 2.585c.396.954-.441 1.747-1.175 1.146L10 11.347l-2.638 2.291c-.734.601-1.571-.192-1.175-1.146l1.07-2.585a1 1 0 00-.364-1.118L4.68 7.113c-.81-.613-.392-1.911.614-1.911h2.735a1 1 0 00.95-.69l1.07-2.585z" />
						</svg>
					</div>

					<div className="relative p-8">
						{/* Premium USA Header */}
						<div className="text-center mb-6">
							<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 via-white to-blue-600 rounded-full shadow-2xl mb-4 relative overflow-hidden">
								<div className="absolute inset-0 bg-gradient-to-br from-red-600/80 via-transparent to-blue-600/80"></div>
								<Image
									alt="USA Flag"
									width={48}
									height={32}
									className="relative z-10 rounded-md shadow-lg"
									src="/usa.svg"
									priority
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-full"></div>
							</div>
							
							<div className="space-y-2">
								<h3 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-red-600 via-blue-600 to-red-600 bg-clip-text text-transparent leading-tight">
									🇺🇸 PROUDLY MADE IN
								</h3>
								<div className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-wider">
									{product.madeIn.toUpperCase()}
								</div>
							</div>
						</div>

						{/* Commitment Statement */}
						<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
							<div className="text-center space-y-3">
								<div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-full text-sm font-bold shadow-lg">
									<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									100% AMERICAN MANUFACTURING
								</div>
								
								<h4 className="text-xl font-bold text-gray-900 dark:text-white">
									Supporting American Workers & Communities
								</h4>
								<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
									Every product is designed, engineered, and manufactured right here in the USA, 
									creating jobs and supporting local economies across America.
								</p>
							</div>
						</div>

						{/* Quality & Business Badges */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
							<div className="group bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-xl p-4 border border-red-200/50 dark:border-red-800/30 hover:shadow-lg transition-all duration-300 hover:scale-105">
								<div className="text-center">
									<div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:rotate-12 transition-transform duration-300">
										<span className="text-white text-lg font-bold">🇺🇸</span>
									</div>
									<div className="text-sm font-bold text-red-700 dark:text-red-300">{product.businessType}</div>
									<div className="text-xs text-red-600 dark:text-red-400">Business</div>
								</div>
							</div>

							<div className="group bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/30 hover:shadow-lg transition-all duration-300 hover:scale-105">
								<div className="text-center">
									<div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:rotate-12 transition-transform duration-300">
										<svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
											<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
									<div className="text-sm font-bold text-blue-700 dark:text-blue-300">Premium Quality</div>
									<div className="text-xs text-blue-600 dark:text-blue-400">Guaranteed</div>
								</div>
							</div>

							<div className="group bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-4 border border-green-200/50 dark:border-green-800/30 hover:shadow-lg transition-all duration-300 hover:scale-105">
								<div className="text-center">
									<div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:rotate-12 transition-transform duration-300">
										<svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
											<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
										</svg>
									</div>
									<div className="text-sm font-bold text-green-700 dark:text-green-300">Local Jobs</div>
									<div className="text-xs text-green-600 dark:text-green-400">Created</div>
								</div>
							</div>

							<div className="group bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/30 hover:shadow-lg transition-all duration-300 hover:scale-105">
								<div className="text-center">
									<div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:rotate-12 transition-transform duration-300">
										<svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
											<path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
										</svg>
									</div>
									<div className="text-sm font-bold text-purple-700 dark:text-purple-300">ISO Certified</div>
									<div className="text-xs text-purple-600 dark:text-purple-400">Standards</div>
								</div>
							</div>
						</div>

						{/* American Values Statement */}
						<div className="bg-gradient-to-r from-blue-600 to-red-600 rounded-xl p-[1px] shadow-xl">
							<div className="bg-white dark:bg-gray-900 rounded-xl p-6">
								<div className="flex items-center justify-center gap-4 text-sm">
									<div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
										<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path d="M10 2L3 7v11h3v-6h8v6h3V7l-7-5z" />
										</svg>
										<span>Made in America</span>
									</div>
									<div className="w-1 h-1 bg-gray-400 rounded-full"></div>
									<div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold">
										<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
										</svg>
										<span>Supporting Workers</span>
									</div>
									<div className="w-1 h-1 bg-gray-400 rounded-full"></div>
									<div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
										<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										<span>Quality First</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Enhanced specifications grid */}
				<div className="grid gap-6">
					<div className="grid sm:grid-cols-2 gap-4 text-sm">
						<div className="space-y-3">
							<div className="flex items-center justify-between sm:justify-start sm:gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
								<span className="text-gray-600 dark:text-gray-300 font-medium">Category</span>
								<span className="font-semibold text-gray-900 dark:text-gray-100">{product.category}</span>
							</div>
							<div className="flex items-center justify-between sm:justify-start sm:gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
								<span className="text-gray-600 dark:text-gray-300 font-medium">Brand</span>
								<span className="font-semibold text-gray-900 dark:text-gray-100">{product.brand}</span>
							</div>
						</div>
						<div className="space-y-3">
							<div className="flex items-center justify-between sm:justify-start sm:gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
								<span className="text-gray-600 dark:text-gray-300 font-medium">SKU</span>
								<div className="flex items-center gap-2">
									<span className="text-xs font-mono font-medium text-gray-900 dark:text-gray-100">{product.specifications.SKU}</span>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => copyToClipboard(product.specifications.SKU)}
										className="h-6 w-6 p-0"
									>
										{copied ? <CheckCircle className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Enhanced feature highlights */}
				<div className="space-y-4">
					<h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Key Features</h3>
					<div className="grid sm:grid-cols-2 gap-3">
						{Object.entries(product.features).map(([title, description], index) => {
							const icons = [Award, Microscope, Leaf, Clock];
							const IconComponent = icons[index % icons.length];
							
							return (
								<div key={title} className="group relative flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-all duration-200 hover:shadow-md">
									<div className="p-2 rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
										<IconComponent className="h-4 w-4" />
									</div>
									<div className="space-y-1 flex-1">
										<h4 className="font-semibold text-sm leading-none text-gray-900 dark:text-gray-100">{title}</h4>
										<p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Trust indicators */}
				<div className="bg-gradient-to-r from-blue-50 to-gray-50 dark:from-blue-950/20 dark:to-gray-800/50 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/30">
					<div className="text-center">
						<div className="flex justify-center items-center gap-2 mb-2">
							<Shield className="h-5 w-5 text-blue-600" />
							<span className="font-semibold text-gray-900 dark:text-gray-100">Trusted Quality</span>
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-300">
							Trusted by thousands of business professionals nationwide
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

function PurchaseOptions({ product }) {
	const [quantity, setQuantity] = useState(1);
	const [selectedVariant, setSelectedVariant] = useState(0);
	const [isWishlisted, setIsWishlisted] = useState(false);
	const selectedPrice = product.variants[selectedVariant]?.price || product.price;

	const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, 99));
	const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

	return (
		<section aria-label="Purchase options" className="col-span-1 w-full lg:max-w-[420px] justify-self-end">
			<div className="sticky top-[126px]">
							<div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 w-full mx-auto overflow-hidden">
				<div className="p-6 space-y-6">
						{/* Enhanced price section */}
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<div className="flex items-baseline gap-2">
										<div className="text-3xl font-bold text-blue-600 dark:text-blue-400">${selectedPrice.toFixed(2)}</div>
										{product.originalPrice && product.originalPrice > selectedPrice && (
											<div className="text-base text-gray-500 dark:text-gray-300 line-through">${product.originalPrice.toFixed(2)}</div>
										)}
									</div>
									{product.originalPrice && product.originalPrice > selectedPrice && (
										<div className="text-sm font-medium text-green-600 dark:text-green-400">
											Save ${(product.originalPrice - selectedPrice).toFixed(2)} ({Math.round(((product.originalPrice - selectedPrice) / product.originalPrice) * 100)}% off)
										</div>
									)}
								</div>
							</div>

							{/* Enhanced availability */}
							<div className="space-y-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200/50 dark:border-green-800/30">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-600" />
										<span className="font-medium text-green-700 dark:text-green-300">Available</span>
									</div>
									<Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-0 text-xs">
										{product.availability}
									</Badge>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Truck className="h-4 w-4 text-blue-600" />
										<span className="text-sm font-medium text-blue-600 dark:text-blue-400">{product.shipping}</span>
									</div>
									<span className="text-xs text-gray-600 dark:text-gray-300">{product.shippingTime}</span>
								</div>
								{product.availability.includes('Backorder') && (
									<div className="text-xs text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 p-2 rounded">
										Backordered items are prioritized for restocking and ship as soon as available
									</div>
								)}
							</div>
						</div>

						{/* Enhanced quantity input */}
						<div className="space-y-2">
							<Label htmlFor="quantity" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
								Quantity
							</Label>
							<div className="flex items-center gap-3">
								<div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
									<Button
										variant="ghost"
										size="sm"
										onClick={decrementQuantity}
										disabled={quantity <= 1}
										className="h-9 w-9 rounded-none border-0 hover:bg-gray-100 dark:hover:bg-gray-700"
									>
										<Minus className="h-3 w-3" />
									</Button>
									<Input
										id="quantity"
										type="number"
										min="1"
										max="99"
										value={quantity}
										onChange={(e) => setQuantity(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
										className="w-14 text-center border-0 focus:ring-0 h-9 text-sm"
									/>
									<Button
										variant="ghost"
										size="sm"
										onClick={incrementQuantity}
										disabled={quantity >= 99}
										className="h-9 w-9 rounded-none border-0 hover:bg-gray-100 dark:hover:bg-gray-700"
									>
										<Plus className="h-3 w-3" />
									</Button>
								</div>
								<div className="text-sm text-gray-600 dark:text-gray-300">
									Total: <span className="font-semibold text-gray-900 dark:text-gray-100">${(selectedPrice * quantity).toFixed(2)}</span>
								</div>
							</div>
						</div>

						{/* Enhanced action buttons */}
						<div className="space-y-3">
							<Button variant="outline" className="w-full h-11 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.01]">
								<ShoppingCart className="mr-2 h-4 w-4" />
								Add to Cart
							</Button>
							<Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-200 hover:scale-[1.01]">
								Buy Now
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
							
							{/* Secondary actions */}
							<div className="grid grid-cols-2 gap-2 mt-4">
								<Button 
									variant="outline" 
									className="h-9 rounded-lg border-2 hover:scale-[1.01] transition-all duration-200 text-sm"
									onClick={() => setIsWishlisted(!isWishlisted)}
								>
									<Heart className={`mr-1 h-3 w-3 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
									{isWishlisted ? 'Saved' : 'Save'}
								</Button>
								<Button variant="outline" className="h-9 rounded-lg border-2 hover:scale-[1.01] transition-all duration-200 text-sm">
									<Share2 className="mr-1 h-3 w-3" />
									Share
								</Button>
							</div>
						</div>

						<Separator className="my-4" />

						{/* Enhanced accordion sections */}
						<div className="w-full space-y-3">
							<Accordion type="single" collapsible className="w-full space-y-3">
								<AccordionItem value="security" className="border rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-200/50 dark:border-green-800/30">
									<AccordionTrigger className="px-3 py-2.5 hover:no-underline">
										<div className="flex items-center">
											<Shield className="h-4 w-4 mr-2 text-green-600" />
											<span className="font-medium text-gray-900 dark:text-gray-100 text-sm">Secure Transaction</span>
										</div>
									</AccordionTrigger>
									<AccordionContent className="px-3 pb-3">
										<p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
											Your payment information is processed securely using industry-standard encryption. We do not store credit card details and all transactions are protected by SSL.
										</p>
									</AccordionContent>
								</AccordionItem>

								<AccordionItem value="shipping" className="border rounded-lg bg-gray-50 dark:bg-gray-800/30 border-gray-200/50 dark:border-gray-700/50">
									<AccordionTrigger className="px-3 py-2.5 hover:no-underline">
										<div className="flex items-center">
											<Truck className="h-4 w-4 mr-2 text-blue-600" />
											<span className="font-medium text-gray-900 dark:text-gray-100 text-sm">Shipping Information</span>
										</div>
									</AccordionTrigger>
									<AccordionContent className="px-3 pb-3">
										<div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
											<p>• Free shipping on orders over $50</p>
											<p>• Standard delivery in {product.shippingTime.toLowerCase()}</p>
											<p>• Express shipping available at checkout</p>
											<p>• Tracking information provided via email</p>
										</div>
									</AccordionContent>
								</AccordionItem>

								<AccordionItem value="guarantee" className="border rounded-lg bg-blue-50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-800/30">
									<AccordionTrigger className="px-3 py-2.5 hover:no-underline">
										<div className="flex items-center">
											<HeartHandshake className="h-4 w-4 mr-2 text-blue-600" />
											<span className="font-medium text-gray-900 dark:text-gray-100 text-sm">Satisfaction Guarantee</span>
										</div>
									</AccordionTrigger>
									<AccordionContent className="px-3 pb-3">
										<div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
											<p>• {product.returnPolicy}</p>
											<p>• Hassle-free returns process</p>
											<p>• Full refund or exchange options</p>
											<p>• Dedicated customer support team</p>
										</div>
									</AccordionContent>
								</AccordionItem>

								<AccordionItem value="support" className="border rounded-lg bg-purple-50 dark:bg-purple-950/20 border-purple-200/50 dark:border-purple-800/30">
									<AccordionTrigger className="px-3 py-2.5 hover:no-underline">
										<div className="flex items-center">
											<Headphones className="h-4 w-4 mr-2 text-purple-600" />
											<span className="font-medium text-gray-900 dark:text-gray-100 text-sm">Expert Support</span>
										</div>
									</AccordionTrigger>
									<AccordionContent className="px-3 pb-3">
										<div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
											<p>• 24/7 customer support available</p>
											<p>• Technical experts for product guidance</p>
											<p>• Live chat, phone, and email support</p>
											<p>• Comprehensive setup assistance</p>
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

// Additional enhanced components (recommendations, related products, etc.) would go here...
// For brevity, I'll include just the key enhanced components above.



// Placeholder functions for the remaining components (keeping existing structure)
function RecommendationsSection() {
	return (
		<section className="mt-20">
			<div className="w-full py-16">
				<div className="max-w-4xl mx-auto text-center">
					<div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-gradient-to-br dark:from-gray-900/50 dark:to-gray-800/50 rounded-3xl p-12 md:p-16 border border-gray-200/60 dark:border-gray-700/60 shadow-xl">
						<div className="mb-8">
							<div className="bg-white dark:bg-gray-800 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg border border-gray-200/60 dark:border-gray-700/60">
								<Package className="w-10 h-10 text-blue-600" />
							</div>
							<h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Explore More Products</h2>
							<p className="text-gray-600 dark:text-gray-300 text-xl mb-8 leading-relaxed">
								Discover our complete range of business solutions and technology products designed to accelerate your success.
							</p>
						</div>
						<div className="grid gap-6 md:flex md:gap-8 justify-center mb-12">
							<Button asChild className="bg-blue-600 text-white shadow-lg hover:bg-blue-700 h-14 rounded-2xl px-10 text-lg font-semibold hover:scale-105 transition-all duration-200">
								<Link href="/store">
									<ShoppingBag className="w-6 h-6 mr-3" />
									Browse All Products
								</Link>
							</Button>
							<Button asChild variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white h-14 rounded-2xl px-10 text-lg font-semibold hover:scale-105 transition-all duration-200">
								<Link href="/store">
									Latest Products
									<ArrowRight className="w-6 h-6 ml-3" />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function RelatedProducts() {
	// Mock related products data  
	const relatedProducts = [
		{
			id: "professional-camera-kit",
			name: "Professional 4K Business Camera Kit",
			brand: "ProVision",
			price: 899.00,
			originalPrice: 1299.00,
			image: "/placeholder-camera.svg",
			availability: "Available",
			shipping: "FREE Shipping",
			shippingTime: "Ships within 1-2 business days",
			rating: 4.7,
			reviewCount: 156
		},
		{
			id: "smart-inventory-scanner",
			name: "AI-Powered Smart Inventory Scanner",
			brand: "ScanTech",
			price: 249.00,
			originalPrice: 349.00,
			image: "/placeholder-scanner.svg",
			availability: "Available",
			shipping: "FREE Shipping",
			shippingTime: "Ships within 1-2 business days",
			rating: 4.8,
			reviewCount: 203
		},
		{
			id: "wireless-payment-terminal",
			name: "Wireless Payment Terminal with NFC",
			brand: "PayTech",
			price: 149.00,
			originalPrice: 199.00,
			image: "/placeholder-terminal.svg",
			availability: "Available", 
			shipping: "FREE Shipping",
			shippingTime: "Ships within 1-2 business days",
			rating: 4.5,
			reviewCount: 298
		},
		{
			id: "professional-headset",
			name: "Professional Wireless Business Headset",
			brand: "AudioPro",
			price: 89.00,
			originalPrice: 129.00,
			image: "/placeholder-headset.svg",
			availability: "Available",
			shipping: "FREE Shipping", 
			shippingTime: "Ships within 1-2 business days",
			rating: 4.7,
			reviewCount: 567
		}
	];

	return (
		<section className="mt-24" itemScope itemType="https://schema.org/ItemList">
			<meta itemProp="name" content="Related Products" />
			<meta itemProp="description" content="Business technology products you might also like" />
			
			<div className="mb-20">
				<div className="mb-12 text-center">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">You Might Also Like</h2>
					<p className="text-xl text-gray-600 dark:text-gray-300">Explore our complete range of business solutions</p>
				</div>
				
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
					{relatedProducts.map((product, index) => (
						<div key={product.id} className="group relative" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
							<meta itemProp="position" content={index + 1} />
							<div className="group relative h-full flex flex-col border border-foreground/10 hover:border-foreground/20 transition-colors duration-200 rounded-lg my-0.5">
								
								{/* Wishlist Button */}
								<Button 
									variant="ghost" 
									size="sm" 
									className="absolute z-[1] right-2 top-2 h-9 w-9"
								>
									<Heart className="h-5 w-5 transition-colors duration-200 fill-secondary stroke-foreground/60 group-hover:stroke-foreground/80" />
								</Button>

								{/* Product Image */}
								<Link href={`/store/product/${product.id}`} className="block shrink-0 w-full">
									<div className="relative bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-foreground/10 hover:border-foreground/20 transition-colors border-0 aspect-square w-full rounded-t-lg">
										<Image
											alt={product.name}
											loading="eager"
											fill
											className="object-cover hover:scale-105 transition-transform duration-300"
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
											src={product.image}
										/>
									</div>
								</Link>

								{/* Product Info */}
								<div className="flex flex-col mt-3 flex-1 p-3">
									<Link href={`/store/product/${product.id}`} className="flex-1">
										<p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
										<h2 className="font-medium text-base group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
											{product.name}
										</h2>
										
										{/* Rating */}
										<div className="mt-1">
											<div className="flex items-center gap-1">
												{[...Array(5)].map((_, i) => (
													<Star 
														key={i} 
														className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
													/>
												))}
												<span className="text-sm text-muted-foreground ml-1">
													({product.reviewCount} reviews)
												</span>
											</div>
										</div>

										{/* Price */}
										<div className="mt-2">
											{product.originalPrice && (
												<div className="flex items-center gap-1">
													<span className="text-sm text-muted-foreground line-through">
														List Price: ${product.originalPrice.toFixed(2)}
													</span>
												</div>
											)}
											<div className="flex items-baseline gap-2">
												<span className="text-xl font-medium text-blue-600 dark:text-blue-400" aria-label={`Price: $${product.price.toFixed(2)}`}>
													<span className="text-sm">$</span>
													<span>{Math.floor(product.price)}</span>
													<span className="text-sm">.{(product.price % 1).toFixed(2).slice(2)}</span>
												</span>
												{product.originalPrice && (
													<span className="text-sm text-red-600 font-medium">
														Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% 
														(${(product.originalPrice - product.price).toFixed(2)})
													</span>
												)}
											</div>
										</div>

										{/* Availability & Shipping */}
										<div className="space-y-1.5 mt-2">
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium text-green-600">Available</span>
												<span className="text-xs text-muted-foreground">{product.availability}</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm text-blue-600">{product.shipping}</span>
												<span className="text-xs text-muted-foreground">{product.shippingTime}</span>
											</div>
										</div>
									</Link>

									{/* Add to Cart Button */}
									<div className="flex items-stretch gap-2 mt-3">
										<Button className="h-9 w-full bg-blue-600 hover:bg-blue-700 text-white border border-foreground/10 hover:border-foreground/20">
											<div className="flex items-center justify-center w-full">
												<ShoppingCart className="h-4 w-4 mr-2" />
												<span>Add to Cart</span>
											</div>
										</Button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default function ProductPage(props) {
    // Next.js 15: params is now a Promise in client components
    // Use React.use() to unwrap the Promise
    const params = React.use(props.params);
	const productId = params?.productId;
	const product = getProductData(productId);

	if (!product) {
		return (
			<div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
										<div className="text-center p-8">
							<div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl border border-gray-200/60 dark:border-gray-700/60">
								<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Product Not Found</h1>
								<p className="text-gray-600 dark:text-gray-300 mb-8">The product you&apos;re looking for doesn&apos;t exist.</p>
						<Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold">
							<Link href="/store">
								<ArrowLeft className="mr-2 w-5 h-5" />
								Back to Store
							</Link>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white dark:bg-neutral-900">
			<section className="max-w-full mx-auto p-6 lg:p-8" itemScope itemType="https://schema.org/Product">
				<Suspense fallback={<ProductSkeleton />}>
					{/* Main product layout */}
					<div className="grid grid-cols-1 md:grid-cols-[1fr_420px] xl:grid-cols-[minmax(0,1fr)_420px] gap-8 mb-16">
						<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
							<ProductGallery images={product.images} productName={product.name} category={product.category} product={product} />
							<ProductInfo product={product} />
						</div>
						<PurchaseOptions product={product} />
					</div>

					{/* Customer Reviews Section - moved below main content */}
					<div className="max-w-4xl mx-auto mb-16">
						<div className="bg-white/50 dark:bg-gray-900/30 rounded-lg p-6 border border-gray-200/50 dark:border-gray-700/50">
							<h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
								<Star className="h-5 w-5 text-yellow-500" />
								Customer Reviews
							</h2>
							
							{/* Review summary */}
							<div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg mb-6">
								<div className="flex items-center gap-1">
									{[...Array(5)].map((_, i) => (
										<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
									))}
								</div>
								<span className="text-lg font-semibold">{product.rating}</span>
								<span className="text-sm text-gray-600 dark:text-gray-300">Based on {product.reviewCount} reviews</span>
							</div>
							
							{/* Fake Reviews */}
							<div className="space-y-6">
								<div className="border-b border-gray-200 dark:border-gray-700 pb-6">
									<div className="flex items-start gap-4">
										<div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
											<User className="w-5 h-5 text-blue-600" />
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												<span className="font-semibold text-gray-900 dark:text-gray-100">Sarah Mitchell</span>
												<div className="flex items-center gap-1">
													{[...Array(5)].map((_, i) => (
														<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
													))}
												</div>
												<span className="text-sm text-gray-500 dark:text-gray-300">2 weeks ago</span>
											</div>
											<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
												"Absolutely fantastic POS system! The setup was incredibly easy and our team was up and running in under an hour. The interface is intuitive and the customer support is outstanding. Highly recommend for any small business!"
											</p>
											<div className="flex items-center gap-4 mt-3">
												<button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200">
													<ThumbsUp className="w-4 h-4" />
													Helpful (12)
												</button>
												<button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
													Reply
												</button>
											</div>
										</div>
									</div>
								</div>

								<div className="border-b border-gray-200 dark:border-gray-700 pb-6">
									<div className="flex items-start gap-4">
										<div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
											<User className="w-5 h-5 text-green-600" />
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												<span className="font-semibold text-gray-900 dark:text-gray-100">Mike Rodriguez</span>
												<div className="flex items-center gap-1">
													{[...Array(5)].map((_, i) => (
														<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
													))}
												</div>
												<span className="text-sm text-gray-500 dark:text-gray-300">1 month ago</span>
											</div>
											<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
												"We've been using this system for about 6 months now and it's been a game-changer for our restaurant. The analytics features help us track our best-selling items and the integration with our inventory system is seamless."
											</p>
											<div className="flex items-center gap-4 mt-3">
												<button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200">
													<ThumbsUp className="w-4 h-4" />
													Helpful (8)
												</button>
												<button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
													Reply
												</button>
											</div>
										</div>
									</div>
								</div>

								<div className="border-b border-gray-200 dark:border-gray-700 pb-6">
									<div className="flex items-start gap-4">
										<div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
											<User className="w-5 h-5 text-purple-600" />
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												<span className="font-semibold text-gray-900 dark:text-gray-100">Jennifer Chen</span>
												<div className="flex items-center gap-1">
													{[...Array(4)].map((_, i) => (
														<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
													))}
													<Star className="w-4 h-4 text-gray-300" />
												</div>
												<span className="text-sm text-gray-500 dark:text-gray-300">3 weeks ago</span>
											</div>
											<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
												"Great product overall! The only reason I'm giving 4 stars instead of 5 is that the initial learning curve was a bit steep for some of our older staff members. But once everyone got comfortable with it, it's been smooth sailing."
											</p>
											<div className="flex items-center gap-4 mt-3">
												<button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200">
													<ThumbsUp className="w-4 h-4" />
													Helpful (15)
												</button>
												<button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
													Reply
												</button>
											</div>
										</div>
									</div>
								</div>

								<div className="text-center">
									<Button variant="outline" className="text-sm px-6 py-2">
										View All {product.reviewCount} Reviews
									</Button>
								</div>
							</div>
						</div>
					</div>

					{/* Recommendations section */}
					<RecommendationsSection />

					{/* Related products */}
					<RelatedProducts />
				</Suspense>
			</section>
		</div>
	);
}