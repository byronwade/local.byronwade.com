"use client";
import React, { useRef, useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "react-feather";
import { Button } from "@components/ui/button";

export default function ScrollSection({ title, link, children }) {
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
				{(title || link) && (
					<div className="flex items-center justify-between w-full px-6 py-4 -mb-8 md:justify-start sm:px-12 lg:px-24">
						{title && <h2 className="text-sm font-bold text-white md:text-xl sm:tracking-tight">{title}</h2>}
						{link && (
							<a href={link} className="inline-block ml-8">
								<Button variant="secondary" size="xs">
									View more <ArrowRight className="inline-block w-4 h-4 ml-2 align-middle" />
								</Button>
							</a>
						)}
					</div>
				)}
				<div className="relative">
					<div ref={scrollContainerRef} onScroll={handleScroll} className="flex flex-row gap-8 px-6 py-8 overflow-x-auto sm:px-12 lg:px-24 scrollbar-hide scroll-smooth" style={{ scrollBehavior: "smooth" }}>
						{React.Children.map(children, (child, idx) => (
							<div
								key={idx}
								className="flex-none relative min-w-[200px]"
								style={{
									aspectRatio: "16 / 9",
								}}
							>
								{React.cloneElement(child, { disabled: partiallyVisibleIndices[idx] })}
							</div>
						))}
					</div>
					{canScrollLeft && (
						<div className="absolute inset-y-0 left-0 items-center justify-center hidden px-4 transition-all cursor-pointer md:flex md:px-12 text-muted-foreground hover:text-white group-hover:opacity-100" onClick={() => scrollBy(-getScrollDistance())}>
							<ChevronLeft className="w-6 h-6 md:w-16 md:h-16" />
						</div>
					)}
					{canScrollRight && (
						<div className="absolute inset-y-0 right-0 items-center justify-center hidden px-4 transition-all cursor-pointer md:flex md:px-12 text-muted-foreground hover:text-white group-hover:opacity-100" onClick={() => scrollBy(getScrollDistance())}>
							<ChevronRight className="w-6 h-6 md:w-16 md:h-16" />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
