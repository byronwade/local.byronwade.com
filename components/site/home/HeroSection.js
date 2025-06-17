"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Star, Users, Shield } from "react-feather";
import { Button } from "@components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function HeroSection({ carouselItems }) {
	const carouselApiRef = useRef(null);

	const handleKeyDown = (e) => {
		if (carouselApiRef.current) {
			if (e.key === "ArrowLeft") {
				carouselApiRef.current.scrollPrev();
			} else if (e.key === "ArrowRight") {
				carouselApiRef.current.scrollNext();
			}
		}
	};

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<div className="relative h-[70vh] min-h-[600px] overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90"></div>
			<div className="absolute inset-0 opacity-5">
				<div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
				<div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
				<div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
			</div>

			<Carousel
				setApi={(api) => (carouselApiRef.current = api)}
				className="relative z-20 h-full"
				opts={{
					loop: true,
				}}
				plugins={[
					Autoplay({
						delay: 8000,
					}),
				]}
			>
				<CarouselContent className="h-full">
					{carouselItems.map((item, index) => (
						<CarouselItem key={index} className="w-full h-full">
							<div className="relative w-full h-full">
								{/* Enhanced Background Image with Better Overlay */}
								<div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/60 to-background/20" />
								<div className="absolute inset-0 z-10 bg-gradient-to-r from-background via-background/40 to-transparent" />
								<div className="absolute inset-0">
									<Image width={2200} height={2200} src={item.mediaSrc} alt={`Business category ${index + 1}`} className="object-cover w-full h-full opacity-80" />
								</div>

								{/* Enhanced Content Section - Vertically Centered, Left Aligned */}
								<div className="relative z-20 flex flex-col justify-center h-full px-6 space-y-8 sm:px-12 lg:px-24">
									<div className="max-w-4xl">
										{/* Enhanced Badge */}
										<div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-semibold text-primary bg-primary/10 rounded-full border border-primary/20 backdrop-blur-sm shadow-lg">
											<Shield className="w-4 h-4 mr-2" />
											🏢 Trusted Local Business Directory
										</div>

										{/* Enhanced Headlines */}
										<h1 className="text-5xl font-bold text-foreground sm:text-7xl mb-6 leading-tight">
											{index === 0 && (
												<>
													Find <span className="text-primary">Local</span>
													<br />
													Businesses
												</>
											)}
											{index === 1 && (
												<>
													<span className="text-primary">Home</span> Services
													<br />
													Made Easy
												</>
											)}
											{index === 2 && (
												<>
													Restaurants &
													<br />
													<span className="text-primary">Dining</span>
												</>
											)}
											{index === 3 && (
												<>
													Health &
													<br />
													<span className="text-primary">Wellness</span>
												</>
											)}
										</h1>

										<p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl">{item.description}</p>

										{/* Enhanced Action Buttons */}
										<div className="flex flex-col sm:flex-row gap-4 mb-8">
											<Link href={item.link} className="inline-block">
												<Button size="lg" className="flex items-center space-x-3 h-16 px-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 text-lg font-semibold">
													<Search className="w-6 h-6" />
													<span>Search Now</span>
												</Button>
											</Link>
											<Link href="/search" className="inline-block">
												<Button variant="outline" size="lg" className="flex items-center space-x-3 h-16 px-10 border-2 border-primary/20 text-foreground hover:bg-primary/5 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold">
													<MapPin className="w-6 h-6" />
													<span>Browse Categories</span>
												</Button>
											</Link>
										</div>

										{/* Enhanced Stats Section */}
										<div className="flex flex-wrap items-center gap-8 text-sm text-muted-foreground">
											<div className="flex items-center space-x-3 bg-background/20 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/10">
												<div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
												<Users className="w-4 h-4" />
												<span className="font-medium">10,000+ Businesses</span>
											</div>
											<div className="flex items-center space-x-3 bg-background/20 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/10">
												<div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
												<Shield className="w-4 h-4" />
												<span className="font-medium">Verified Reviews</span>
											</div>
											<div className="flex items-center space-x-3 bg-background/20 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/10">
												<div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
												<Star className="w-4 h-4" />
												<span className="font-medium">Local Experts</span>
											</div>
										</div>
									</div>
								</div>

								{/* Enhanced Floating Elements */}
								<div className="absolute top-20 right-20 w-4 h-4 bg-primary/30 rounded-full animate-bounce hidden lg:block"></div>
								<div className="absolute bottom-32 right-32 w-6 h-6 bg-secondary/30 rounded-full animate-pulse hidden lg:block"></div>
								<div className="absolute top-1/2 right-10 w-2 h-2 bg-accent/40 rounded-full animate-ping hidden lg:block"></div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>

			{/* Enhanced Bottom Gradient */}
			<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-30"></div>
		</div>
	);
}
