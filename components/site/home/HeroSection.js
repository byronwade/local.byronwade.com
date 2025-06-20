"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Star, Users, Shield } from "react-feather";
import { Button } from "@components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@utils";

export default function HeroSection({ carouselItems }) {
	const carouselApiRef = useRef(null);
	const [headerHeight, setHeaderHeight] = useState(64); // Default header height

	const handleKeyDown = (e) => {
		if (carouselApiRef.current) {
			if (e.key === "ArrowLeft") {
				carouselApiRef.current.scrollPrev();
			} else if (e.key === "ArrowRight") {
				carouselApiRef.current.scrollNext();
			}
		}
	};

	// Calculate actual header height
	useEffect(() => {
		const calculateHeaderHeight = () => {
			const header = document.querySelector("#header");
			if (header) {
				const actualHeight = header.offsetHeight;
				setHeaderHeight(actualHeight);
				console.log("Header height calculated:", actualHeight);
			}
		};

		// Calculate on mount and resize
		calculateHeaderHeight();
		window.addEventListener("resize", calculateHeaderHeight);

		// Multiple checks to ensure accurate calculation
		const timeouts = [setTimeout(calculateHeaderHeight, 100), setTimeout(calculateHeaderHeight, 500), setTimeout(calculateHeaderHeight, 1000)];

		return () => {
			window.removeEventListener("resize", calculateHeaderHeight);
			timeouts.forEach((timeout) => clearTimeout(timeout));
		};
	}, []);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<div className="relative w-full overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90"></div>
			<div className="absolute inset-0 opacity-5">
				<div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
				<div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
				<div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
			</div>

			<Carousel
				setApi={(api) => (carouselApiRef.current = api)}
				className="relative z-20 w-full"
				opts={{
					loop: true,
				}}
				plugins={[
					Autoplay({
						delay: 8000,
					}),
				]}
			>
				<CarouselContent>
					{carouselItems.map((item, index) => (
						<CarouselItem key={index} className="w-full">
							<div className="relative w-full pt-24 pb-12 sm:pt-32 sm:pb-16 md:pt-40 md:pb-20 lg:pt-48 lg:pb-24 xl:pt-56 xl:pb-28">
								{/* Enhanced Background Image with Better Overlay */}
								<div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/60 to-background/20" />
								<div className="absolute inset-0 z-10 bg-gradient-to-r from-background via-background/40 to-transparent" />
								<div className="absolute inset-0">
									<Image width={2200} height={2200} src={item.mediaSrc} alt={`Business category ${index + 1}`} className="object-cover w-full h-full" priority={index === 0} />
								</div>

								{/* Content */}
								<div className="relative z-20 px-4 lg:px-24">
									<div className="max-w-4xl">
										{/* Main heading */}
										<h1 className="mb-4 text-4xl font-bold leading-tight sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-foreground">
											{item.title}
											<span className="block mt-2 text-2xl font-normal sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-muted-foreground">{item.subtitle}</span>
										</h1>

										{/* Description */}
										<p className="mb-6 text-lg leading-relaxed sm:mb-8 sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl">{item.description}</p>

										{/* CTA Buttons */}
										<div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 md:space-x-6">
											<Button size="lg" className="h-12 px-6 text-base font-semibold transition-all duration-200 sm:h-14 sm:px-8 sm:text-lg bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-lg hover:scale-105 active:scale-95">
												<Search className="w-5 h-5 mr-2 sm:w-6 sm:h-6" />
												Find Local Businesses
											</Button>
											<Button variant="outline" size="lg" className="h-12 px-6 text-base font-semibold transition-all duration-200 sm:h-14 sm:px-8 sm:text-lg border-border hover:bg-muted hover:scale-105 active:scale-95">
												<MapPin className="w-5 h-5 mr-2 sm:w-6 sm:h-6" />
												Browse by Location
											</Button>
										</div>

										{/* Trust indicators */}
										<div className="flex flex-wrap items-center gap-4 mt-8 text-sm sm:gap-6 sm:mt-12 sm:text-base text-muted-foreground">
											<div className="flex items-center space-x-2">
												<Users className="w-4 h-4 sm:w-5 sm:h-5" />
												<span>10,000+ verified businesses</span>
											</div>
											<div className="flex items-center space-x-2">
												<Star className="w-4 h-4 sm:w-5 sm:h-5" />
												<span>50,000+ customer reviews</span>
											</div>
											<div className="flex items-center space-x-2">
												<Shield className="w-4 h-4 sm:w-5 sm:h-5" />
												<span>Trust & safety verified</span>
											</div>
										</div>
									</div>
								</div>

								{/* Bottom gradient for smooth transition */}
								<div className="absolute bottom-0 left-0 right-0 z-10 h-8 bg-gradient-to-t from-background to-transparent" />
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>

			{/* Minimal Bottom Gradient - Smooth transition to content */}
			<div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background via-background/60 to-transparent z-30"></div>
		</div>
	);
}
