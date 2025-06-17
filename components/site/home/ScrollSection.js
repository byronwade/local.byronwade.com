"use client";
import React, { useRef, useState, useEffect } from "react";
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

	const handleScroll = () => {
		const scrollContainer = scrollContainerRef.current;
		if (scrollContainer) {
			const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
			const atEnd = scrollContainer.scrollLeft >= maxScrollLeft - 1;
			const atStart = scrollContainer.scrollLeft <= 0;
			setCanScrollLeft(!atStart);
			setCanScrollRight(!atEnd);
			checkPartialVisibility();
		}
	};

	const checkPartialVisibility = () => {
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
	};

	useEffect(() => {
		handleScroll();
	}, [children]);

	useEffect(() => {
		const handleResize = () => handleScroll();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const getScrollDistance = () => {
		const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
		return ((vw - parseFloat(getComputedStyle(document.documentElement).fontSize) * 8) / 5.5) * 3;
	};

	return (
		<div className="w-full">
			<div className="relative w-full overflow-hidden group">
				{(title || link || category) && (
					<div className="flex flex-col space-y-2 px-6 py-6 sm:px-12 lg:px-24">
						{category && (
							<div className="flex items-center space-x-2">
								<span className="px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full border border-primary/20">{category}</span>
							</div>
						)}
						<div className="flex items-center justify-between">
							<div className="flex flex-col space-y-1">
								{title && <h2 className="text-2xl font-bold text-white tracking-tight hover:text-primary transition-colors duration-200">{title}</h2>}
								{subtitle && <p className="text-sm text-gray-400 max-w-2xl">{subtitle}</p>}
							</div>
							{link && (
								<Button variant="ghost" size="sm" className="text-primary hover:text-primary-foreground hover:bg-primary transition-all duration-200 group" asChild>
									<a href={link} className="flex items-center space-x-2">
										<span>View all</span>
										<ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
									</a>
								</Button>
							)}
						</div>
					</div>
				)}
				<div className="relative">
					<div ref={scrollContainerRef} onScroll={handleScroll} className="flex flex-row gap-6 px-6 py-4 overflow-x-auto sm:px-12 lg:px-24 scrollbar-hide scroll-smooth" style={{ scrollBehavior: "smooth" }}>
						{React.Children.map(children, (child, idx) => (
							<div
								key={idx}
								className="flex-none relative min-w-[280px]"
								style={{
									aspectRatio: "16 / 9",
								}}
							>
								{React.cloneElement(child, { disabled: partiallyVisibleIndices[idx] })}
							</div>
						))}
					</div>
					{canScrollLeft && (
						<button onClick={() => scrollBy(-getScrollDistance())} className="absolute inset-y-0 left-0 z-50 items-center justify-center hidden px-4 transition-all cursor-pointer md:flex md:px-12 text-white hover:text-white group-hover:opacity-100 bg-gradient-to-r from-background/80 to-transparent pointer-events-auto" style={{ pointerEvents: "auto" }}>
							<div className="p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors duration-200">
								<ChevronLeft className="w-6 h-6" />
							</div>
						</button>
					)}
					{canScrollRight && (
						<button onClick={() => scrollBy(getScrollDistance())} className="absolute inset-y-0 right-0 z-50 items-center justify-center hidden px-4 transition-all cursor-pointer md:flex md:px-12 text-white hover:text-white group-hover:opacity-100 bg-gradient-to-l from-background/80 to-transparent pointer-events-auto" style={{ pointerEvents: "auto" }}>
							<div className="p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors duration-200">
								<ChevronRight className="w-6 h-6" />
							</div>
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
