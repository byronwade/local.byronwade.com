"use client";
import React, { useRef, useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "react-feather";
import BusinessCard from "@components/site/home/BusinessCard";
import { Button } from "@components/ui/button";

export default function ScrollSection({ title, link, businesses }) {
	const scrollContainerRefs = useRef({});
	const [canScrollLeft, setCanScrollLeft] = useState({});
	const [canScrollRight, setCanScrollRight] = useState({});
	const [partiallyVisibleIndices, setPartiallyVisibleIndices] = useState({});

	const scrollBy = (key, distance) => {
		const scrollContainer = scrollContainerRefs.current[key];
		if (scrollContainer) {
			scrollContainer.scrollBy({ left: distance, behavior: "smooth" });
		}
	};

	const handleScroll = (key) => {
		const scrollContainer = scrollContainerRefs.current[key];
		if (scrollContainer) {
			const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
			const atEnd = scrollContainer.scrollLeft >= maxScrollLeft;
			const atStart = scrollContainer.scrollLeft <= 0;
			setCanScrollLeft((prev) => ({ ...prev, [key]: !atStart }));
			setCanScrollRight((prev) => ({ ...prev, [key]: !atEnd }));
			checkPartialVisibility(key, atStart, atEnd);
		}
	};

	const checkPartialVisibility = (key, atStart, atEnd) => {
		const scrollContainer = scrollContainerRefs.current[key];
		if (scrollContainer) {
			const containerRect = scrollContainer.getBoundingClientRect();
			const children = Array.from(scrollContainer.children);
			children.forEach((child, index) => {
				const childRect = child.getBoundingClientRect();
				const isVisible = (childRect.left < containerRect.right && childRect.right > containerRect.right) || (childRect.right > containerRect.left && childRect.left < containerRect.left);
				setPartiallyVisibleIndices((prev) => ({
					...prev,
					[key]: { ...prev[key], [index]: isVisible },
				}));
			});
		}
	};

	useEffect(() => {
		Object.keys(scrollContainerRefs.current).forEach((key) => {
			handleScroll(key);
		});
	}, [businesses]);

	const cardWidth = `calc((100vw - 8rem) / 5.5)`; // Adjusted width to ensure half card visibility

	const getScrollDistance = () => {
		const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
		return ((vw - parseFloat(getComputedStyle(document.documentElement).fontSize) * 8) / 5.5) * 3;
	};

	return (
		<div className="w-full">
			<div className="relative w-full overflow-hidden group">
				<div className="flex items-center w-full px-6 py-4 sm:px-12 lg:px-24">
					<h2 className="text-2xl font-bold text-white sm:text-3xl sm:tracking-tight">{title}</h2>
					<a href={link} className="inline-block ml-8">
						<Button variant="secondary" size="xs">
							View more <ArrowRight className="inline-block w-4 h-4 ml-2 align-middle" />
						</Button>
					</a>
				</div>
				<div className="relative">
					<div ref={(el) => (scrollContainerRefs.current[title] = el)} onScroll={() => handleScroll(title)} className="flex flex-row gap-4 px-6 py-8 overflow-x-hidden sm:px-12 lg:px-24 scrollbar-hide scroll-smooth" style={{ scrollBehavior: "smooth" }}>
						{businesses.map((business, idx) => (
							<div
								key={business.id}
								className="flex-none relative min-w-[200px]"
								style={{
									width: cardWidth,
									aspectRatio: "16 / 9",
								}}
							>
								<BusinessCard business={business} disabled={partiallyVisibleIndices[title]?.[idx]} />
							</div>
						))}
					</div>
					{canScrollLeft[title] && (
						<div className="absolute inset-y-0 left-0 flex items-center justify-center px-12 transition-all cursor-pointer text-muted-foreground hover:text-white group-hover:opacity-100" style={{ paddingLeft: "3em", paddingRight: "3em" }} onClick={() => scrollBy(title, -getScrollDistance())}>
							<ChevronLeft className="w-16 h-16" />
						</div>
					)}
					{canScrollRight[title] && (
						<div className="absolute inset-y-0 right-0 flex items-center justify-center px-12 transition-all cursor-pointer text-muted-foreground hover:text-white group-hover:opacity-100" style={{ paddingLeft: "3em", paddingRight: "3em" }} onClick={() => scrollBy(title, getScrollDistance())}>
							<ChevronRight className="w-16 h-16" />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
