"use client";

import React, { Suspense, useState } from "react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@components/ui/card";
import { Separator } from "@components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { ShoppingCart, Star, CheckCircle, Truck, Shield, Clock, Package, CreditCard, ArrowLeft, Heart, Share2, MessageCircle, ThumbsUp, ThumbsDown, Sparkles, ArrowRight, X, Search, Menu, Globe, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

const getProductData = (productId) => {
	const products = {
		"thorbis-pos-pro": {
			id: "thorbis-pos-pro",
			name: "Thorbis POS Pro",
			description: "Advanced point-of-sale system with integrated payment processing, inventory management, and real-time analytics.",
			price: 1299,
			originalPrice: 1599,
			images: ["/placeholder-business.svg", "/placeholder-business.svg", "/placeholder-business.svg", "/placeholder-business.svg"],
			category: "POS Systems",
			rating: 4.8,
			reviewCount: 127,
			badge: "Best Seller",
			features: ["Contactless payment processing", "Real-time inventory tracking", "Advanced analytics dashboard", "Multi-location support", "Employee management", "Customer loyalty program", "Cloud-based backup", "24/7 technical support"],
			specifications: {
				Display: '15.6" HD Touchscreen',
				Processor: "Intel Core i3",
				Memory: "8GB RAM",
				Storage: "256GB SSD",
				Connectivity: "WiFi 6, Bluetooth 5.0",
				Ports: "USB 3.0, Ethernet, HDMI",
				OS: "Windows 11 Pro",
				Warranty: "3 years",
			},
			inStock: true,
			shipping: "Free 2-day shipping",
			returnPolicy: "30-day money-back guarantee",
		},
		"thorbis-fleet-tracker": {
			id: "thorbis-fleet-tracker",
			name: "Thorbis Fleet Tracker",
			description: "Real-time GPS tracking system for fleet vehicles with advanced monitoring and reporting capabilities.",
			price: 299,
			originalPrice: 399,
			images: ["/placeholder-business.svg", "/placeholder-business.svg", "/placeholder-business.svg", "/placeholder-business.svg"],
			category: "Fleet Management",
			rating: 4.6,
			reviewCount: 89,
			badge: "Popular",
			features: ["Real-time GPS tracking", "Fuel consumption monitoring", "Driver behavior analytics", "Maintenance alerts", "Route optimization", "Geofencing capabilities", "Mobile app access", "Custom reporting"],
			specifications: {
				"GPS Accuracy": "±3 meters",
				"Battery Life": "Up to 30 days",
				"Operating Temperature": "-20°C to +70°C",
				"Water Resistance": "IP67",
				Connectivity: "4G LTE, GPS, GLONASS",
				Installation: "Plug-and-play",
				Coverage: "Global",
				Warranty: "2 years",
			},
			inStock: true,
			shipping: "Free standard shipping",
			returnPolicy: "30-day money-back guarantee",
		},
	};
	return products[productId] || null;
};

function ProductSkeleton() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-950">
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
					<div className="space-y-4">
						<div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
						<div className="grid grid-cols-4 gap-2">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
							))}
						</div>
					</div>
					<div className="space-y-6">
						<div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
						<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4" />
						<div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-1/2" />
						<div className="space-y-2">
							{[...Array(3)].map((_, i) => (
								<div key={i} className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function ProductGallery({ images }) {
	const [selectedImage, setSelectedImage] = useState(0);

	return (
		<div className="space-y-4">
			<div className="aspect-square relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
				<Image src={images[selectedImage]} alt="Product" fill className="object-cover" priority />
			</div>
			<div className="grid grid-cols-4 gap-2">
				{images.map((image, index) => (
					<button key={index} onClick={() => setSelectedImage(index)} className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-colors ${selectedImage === index ? "border-blue-500" : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"}`}>
						<Image src={image} alt={`Product view ${index + 1}`} fill className="object-cover" />
					</button>
				))}
			</div>
		</div>
	);
}

function ProductInfo({ product }) {
	return (
		<div className="space-y-6">
			<div>
				<div className="flex items-center gap-2 mb-2">
					{product.badge && (
						<Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
							{product.badge}
						</Badge>
					)}
					<div className="flex items-center gap-1">
						<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
						<span className="text-sm font-medium">{product.rating}</span>
						<span className="text-sm text-gray-500 dark:text-gray-400">({product.reviewCount} reviews)</span>
					</div>
				</div>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
				<p className="text-gray-600 dark:text-gray-400 text-lg">{product.description}</p>
			</div>

			<div className="space-y-4">
				<div className="flex items-baseline gap-3">
					<span className="text-3xl font-bold text-gray-900 dark:text-white">${product.price.toLocaleString()}</span>
					{product.originalPrice > product.price && <span className="text-xl text-gray-500 dark:text-gray-400 line-through">${product.originalPrice.toLocaleString()}</span>}
					{product.originalPrice > product.price && (
						<Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
							Save ${(product.originalPrice - product.price).toLocaleString()}
						</Badge>
					)}
				</div>

				<div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
					<div className="flex items-center gap-1">
						<CheckCircle className="w-4 h-4 text-green-500" />
						<span>{product.inStock ? "In Stock" : "Out of Stock"}</span>
					</div>
					<div className="flex items-center gap-1">
						<Truck className="w-4 h-4" />
						<span>{product.shipping}</span>
					</div>
					<div className="flex items-center gap-1">
						<Shield className="w-4 h-4" />
						<span>{product.returnPolicy}</span>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex gap-3">
					<Button size="lg" className="flex-1 bg-blue-600 hover:bg-blue-700">
						<ShoppingCart className="mr-2 w-5 h-5" />
						Add to Cart
					</Button>
					<Button size="lg" variant="outline">
						<Heart className="w-5 h-5" />
					</Button>
					<Button size="lg" variant="outline">
						<Share2 className="w-5 h-5" />
					</Button>
				</div>
			</div>
		</div>
	);
}

function ProductFeatures({ features }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{features.map((feature, index) => (
				<div key={index} className="flex items-start gap-3">
					<CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
					<span className="text-gray-700 dark:text-gray-300">{feature}</span>
				</div>
			))}
		</div>
	);
}

function ProductSpecifications({ specifications }) {
	return (
		<div className="space-y-4">
			{Object.entries(specifications).map(([key, value]) => (
				<div key={key} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
					<span className="font-medium text-gray-900 dark:text-white">{key}</span>
					<span className="text-gray-600 dark:text-gray-400">{value}</span>
				</div>
			))}
		</div>
	);
}

function ProductReviews({ rating, reviewCount }) {
	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<div className="text-center">
					<div className="text-3xl font-bold text-gray-900 dark:text-white">{rating}</div>
					<div className="flex items-center justify-center gap-1 my-1">
						{[...Array(5)].map((_, i) => (
							<Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}`} />
						))}
					</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">{reviewCount} reviews</div>
				</div>
				<div className="flex-1">
					<Button variant="outline" className="w-full">
						<MessageCircle className="mr-2 w-4 h-4" />
						Write a Review
					</Button>
				</div>
			</div>
		</div>
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
			<div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h1>
					<p className="text-gray-600 dark:text-gray-400 mb-4">The product you&apos;re looking for doesn&apos;t exist.</p>
					<Button asChild>
						<Link href="/store">
							<ArrowLeft className="mr-2 w-4 h-4" />
							Back to Store
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-950">
			<main>
				<div className="container mx-auto px-4 py-8">
					{/* Breadcrumb */}
					<div className="mb-8">
						<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
							<Link href="/store" className="hover:text-gray-900 dark:hover:text-white">
								Store
							</Link>
							<span>/</span>
							<Link href={`/store/category/${product.category.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-gray-900 dark:hover:text-white">
								{product.category}
							</Link>
							<span>/</span>
							<span className="text-gray-900 dark:text-white">{product.name}</span>
						</div>
					</div>

					<Suspense fallback={<ProductSkeleton />}>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
							<ProductGallery images={product.images} />
							<ProductInfo product={product} />
						</div>

						<Tabs defaultValue="features" className="space-y-8">
							<TabsList className="grid w-full grid-cols-4">
								<TabsTrigger value="features">Features</TabsTrigger>
								<TabsTrigger value="specifications">Specifications</TabsTrigger>
								<TabsTrigger value="reviews">Reviews</TabsTrigger>
								<TabsTrigger value="support">Support</TabsTrigger>
							</TabsList>

							<TabsContent value="features" className="space-y-6">
								<Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
									<CardHeader>
										<CardTitle>Key Features</CardTitle>
										<CardDescription>Everything you need to know about this product</CardDescription>
									</CardHeader>
									<CardContent>
										<ProductFeatures features={product.features} />
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="specifications" className="space-y-6">
								<Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
									<CardHeader>
										<CardTitle>Technical Specifications</CardTitle>
										<CardDescription>Detailed technical information</CardDescription>
									</CardHeader>
									<CardContent>
										<ProductSpecifications specifications={product.specifications} />
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="reviews" className="space-y-6">
								<ProductReviews rating={product.rating} reviewCount={product.reviewCount} />
							</TabsContent>

							<TabsContent value="support" className="space-y-6">
								<Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
									<CardHeader>
										<CardTitle>Support & Resources</CardTitle>
										<CardDescription>Get help and find resources for your product</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<Button variant="outline" className="justify-start h-auto p-4">
												<div className="text-left">
													<div className="font-medium">Documentation</div>
													<div className="text-sm text-gray-500 dark:text-gray-400">User guides and manuals</div>
												</div>
											</Button>
											<Button variant="outline" className="justify-start h-auto p-4">
												<div className="text-left">
													<div className="font-medium">Video Tutorials</div>
													<div className="text-sm text-gray-500 dark:text-gray-400">Step-by-step guides</div>
												</div>
											</Button>
											<Button variant="outline" className="justify-start h-auto p-4">
												<div className="text-left">
													<div className="font-medium">Contact Support</div>
													<div className="text-sm text-gray-500 dark:text-gray-400">24/7 customer service</div>
												</div>
											</Button>
											<Button variant="outline" className="justify-start h-auto p-4">
												<div className="text-left">
													<div className="font-medium">Community Forum</div>
													<div className="text-sm text-gray-500 dark:text-gray-400">Connect with other users</div>
												</div>
											</Button>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</Suspense>
				</div>
			</main>
		</div>
	);
}
