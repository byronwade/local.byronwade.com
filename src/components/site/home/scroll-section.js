"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "react-feather";
import { Button } from "@components/ui/button";

export default function ScrollSection({ title, link, children, subtitle, category }) {
	const scrollContainerRef = useRef(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const [partiallyVisibleIndices, setPartiallyVisibleIndices] = useState({});

	const scrollBy = (distance) => {
		const scrollContainer = scrollContainerRef.current;
		if (scrollContainer) {
			scrollContainer.scrollBy({ left: distance, behavior: "smooth" });
		}
	};

	const checkPartialVisibility = useCallback(() => {
		const scrollContainer = scrollContainerRef.current;
		if (scrollContainer) {
			const containerRect = scrollContainer.getBoundingClientRect();
			const children = Array.from(scrollContainer.children);
			children.forEach((child, index) => {
				const childRect = child.getBoundingClientRect();
				const isVisible = (childRect.left < containerRect.right && childRect.right > containerRect.right) || (childRect.right > containerRect.left && childRect.left < containerRect.left);
				setPartiallyVisibleIndices((prev) => ({
					...prev,
					[index]: isVisible,
				}));
			});
		}
	}, []);

	const handleScroll = useCallback(() => {
		const scrollContainer = scrollContainerRef.current;
		if (scrollContainer) {
			const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
			const atEnd = scrollContainer.scrollLeft >= maxScrollLeft - 1;
			const atStart = scrollContainer.scrollLeft <= 0;
			setCanScrollLeft(!atStart);
			setCanScrollRight(!atEnd);
			checkPartialVisibility();
		}
	}, [checkPartialVisibility]);

	useEffect(() => {
		handleScroll();
	}, [children, handleScroll]);

	useEffect(() => {
		const handleResize = () => handleScroll();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [handleScroll]);

	const getScrollDistance = () => {
		const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
		// Adjust for new larger card sizes
		return vw < 640 ? 320 : vw < 768 ? 350 : vw < 1024 ? 380 : 400;
	};

	return (
		<div className="w-full">
			<div className="relative w-full overflow-hidden group">
				{(title || link || category) && (
					<div className="flex flex-col space-y-4 py-4 sm:py-6 lg:py-8">
						{category && (
							<div className="flex items-center space-x-2">
								<span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 rounded-full border border-primary/20">
									<div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
									{category}
								</span>
							</div>
						)}
						<div className="flex items-start justify-between">
							<div className="flex flex-col space-y-2 flex-1">
								{title && <h3 className="text-xl font-bold text-foreground tracking-tight hover:text-primary transition-colors duration-200 sm:text-2xl lg:text-3xl group-hover:text-primary">{title}</h3>}
								{subtitle && <p className="text-base text-muted-foreground max-w-2xl leading-relaxed sm:text-lg">{subtitle}</p>}
							</div>
							{link && (
								<Button variant="ghost" size="sm" className="text-primary hover:text-primary-foreground hover:bg-primary/90 transition-all duration-300 group flex-shrink-0 rounded-xl px-4 py-2" asChild>
									<a href={link} className="flex items-center gap-2">
										<span className="text-sm font-medium">View all</span>
										<ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
									</a>
								</Button>
							)}
						</div>
					</div>
				)}
				<div className="relative">
					{/* Scroll indicators */}
					{canScrollLeft && <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-40 pointer-events-none" />}
					{canScrollRight && <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-40 pointer-events-none" />}

					<div ref={scrollContainerRef} onScroll={handleScroll} className="flex flex-row gap-4 sm:gap-5 lg:gap-6 py-4 overflow-x-auto scrollbar-hide scroll-smooth" style={{ scrollBehavior: "smooth" }}>
						{React.Children.map(children, (child, idx) => (
							<div key={idx} className="flex-none relative w-[280px] sm:w-[300px] md:w-[320px] lg:w-[340px]">
								{React.cloneElement(child, { disabled: partiallyVisibleIndices[idx] })}
							</div>
						))}
					</div>

					{/* Enhanced Navigation Arrows - Always visible when needed */}
					{canScrollLeft && (
						<button onClick={() => scrollBy(-getScrollDistance())} className="absolute inset-y-0 left-0 z-50 items-center justify-center flex px-2 lg:px-3 text-foreground hover:text-foreground transition-all duration-300 bg-gradient-to-r from-background/95 via-background/80 to-transparent" style={{ pointerEvents: "auto" }}>
							<div className="p-2 lg:p-3 rounded-full bg-white dark:bg-neutral-900 backdrop-blur-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl border border-neutral-200 dark:border-neutral-700 hover:scale-105">
								<ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5 text-neutral-700 dark:text-neutral-300" />
							</div>
						</button>
					)}
					{canScrollRight && (
						<button onClick={() => scrollBy(getScrollDistance())} className="absolute inset-y-0 right-0 z-50 items-center justify-center flex px-2 lg:px-3 text-foreground hover:text-foreground transition-all duration-300 bg-gradient-to-l from-background/95 via-background/80 to-transparent" style={{ pointerEvents: "auto" }}>
							<div className="p-2 lg:p-3 rounded-full bg-white dark:bg-neutral-900 backdrop-blur-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl border border-neutral-200 dark:border-neutral-700 hover:scale-105">
								<ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-neutral-700 dark:text-neutral-300" />
							</div>
						</button>
					)}

					{/* Mobile scroll indicators */}
					{children.length > 2 && (
						<div className="flex justify-center mt-3 md:hidden">
							<div className="flex gap-1">
								{Array.from({ length: Math.min(5, children.length) }).map((_, idx) => (
									<div key={idx} className={`w-2 h-2 rounded-full transition-colors duration-200 ${idx === 0 ? "bg-primary" : "bg-neutral-300 dark:bg-neutral-600"}`} />
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
