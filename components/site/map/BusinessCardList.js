import React, { useEffect, useRef, useCallback, memo, forwardRef, Suspense } from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { ScrollArea } from "@components/ui/scroll-area";
import { Bookmark, Circle, Clock, ExternalLink, Info, Share2 } from "react-feather";
import { StarFilledIcon, ReloadIcon } from "@radix-ui/react-icons";
import useBusinessStore from "@store/useBusinessStore";
import useMapStore from "@store/useMapStore";
import SkeletonBusinessCard from "@components/site/map/SkeletonBusinessCard";

const BusinessCard = memo(
	forwardRef(({ business, isActive, handleClick, isLoading }, ref) => {
		return (
			<div className="px-4" onClick={handleClick} ref={ref}>
				<div id={`business-${business.id}`} className={`relative flex items-center justify-center w-full mb-4 cursor-pointer ${isActive ? "bg-gray-900" : ""} transition-colors duration-200 ease-in-out`}>
					<div className="relative w-full border rounded-md shadow bg-card text-card-foreground">
						{business.isSponsored && (
							<div className="flex flex-row items-center pt-4 pl-4 text-sm">
								Sponsored <Info className="w-4 h-4 ml-2" />
							</div>
						)}
						<div className="flex flex-row items-start gap-4 p-4">
							<div className="flex flex-col space-y-2">{business.logo && <img src={business.logo} alt={`${business.name} logo`} className="object-cover w-16 h-16 rounded-md" />}</div>
							<div className="flex-1">
								<h3 className="mb-1 text-lg font-semibold leading-none tracking-tight">{business.name}</h3>
								<div className="flex flex-wrap items-center gap-2">
									<div className="flex space-x-1">
										{Array.isArray(business.categories) &&
											business.categories.map((category, index) => (
												<Badge key={index} variant="outline" className="border shadow px-[2px] py-0 text-[10px] font-bold">
													{category}
												</Badge>
											))}
									</div>
								</div>
								<p className="mt-2 text-sm text-muted-foreground">{business.description}</p>
							</div>
							<div className="flex flex-col space-y-2">
								<Button variant="brand" size="icon" className="items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
									<Link href={`/biz/${business.id}`} passHref legacyBehavior>
										<a target="_blank" type="button">
											<ExternalLink className="w-4 h-4" />
										</a>
									</Link>
								</Button>
								<Button variant="outline" size="icon" className="items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
									<Link href={`/biz/${business.id}`} passHref legacyBehavior>
										<a target="_blank" type="button">
											<Share2 className="w-4 h-4" />
										</a>
									</Link>
								</Button>
								<Button variant="outline" size="icon" className="items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
									<Link href={`/biz/${business.id}`} passHref legacyBehavior>
										<a target="_blank" type="button">
											<Bookmark className="w-4 h-4" />
										</a>
									</Link>
								</Button>
							</div>
						</div>
						<div className="p-6 pt-0">
							<div className="flex flex-wrap text-sm text-muted-foreground">
								<div className="flex items-center mb-1 ml-1">
									<Button variant="outline" className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
										<Circle className={`w-3 h-3 mr-1 ${business.isOpenNow ? "fill-green-400 text-green-400" : "fill-gray-400 text-gray-400"}`} />
										{business.isOpenNow ? "Open now" : "Closed"}
									</Button>
								</div>

								<div className="flex items-center mb-1 ml-1">
									<Button variant="outline" size="icon" className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
										<p className="text-sm text-green-600">{business.price}</p>
									</Button>
								</div>
								{business.ratings && business.ratings.overall && (
									<div className="flex items-center mb-1 ml-1">
										<Button variant="outline" className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
											<StarFilledIcon className="w-3 h-3 mr-1 text-yellow-500" />
											{business.ratings.overall}
										</Button>
									</div>
								)}
								<div className="flex items-center mb-1 ml-1">
									<Button variant="outline" className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs">
										<Clock className="w-3 h-3 mr-1" />
										<span className="truncate text-ellipsis max-w-40">{business.statusMessage}</span>
									</Button>
								</div>
								{isLoading && (
									<div className="absolute bottom-2 right-2">
										<ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	})
);

const BusinessCardList = ({ activeBusinessId, activeCardRef }) => {
	const { filteredBusinesses = [], loading, setActiveBusinessId } = useBusinessStore();
	const { centerOn, loadingBusinessId } = useMapStore();
	const listRef = useRef(null);
	const activeCardElementRef = useRef(null);

	useEffect(() => {
		if (activeCardElementRef.current) {
			activeCardElementRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}, [activeBusinessId]);

	const handleCardClick = (business) => {
		setActiveBusinessId(business.id);
		const { lat, lng } = business.coordinates;
		centerOn(lat, lng, business.id);
	};

	const handleKeyDown = useCallback(
		(e) => {
			if (filteredBusinesses.length === 0) return;
			const currentIndex = filteredBusinesses.findIndex((b) => b.id === activeBusinessId);
			if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
				const prevIndex = (currentIndex - 1 + filteredBusinesses.length) % filteredBusinesses.length;
				setActiveBusinessId(filteredBusinesses[prevIndex].id);
			} else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
				const nextIndex = (currentIndex + 1) % filteredBusinesses.length;
				setActiveBusinessId(filteredBusinesses[nextIndex].id);
			}
		},
		[filteredBusinesses, activeBusinessId, setActiveBusinessId]
	);

	useEffect(() => {
		if (listRef.current) {
			listRef.current.addEventListener("keydown", handleKeyDown);
		}
		return () => {
			if (listRef.current) {
				listRef.current.removeEventListener("keydown", handleKeyDown);
			}
		};
	}, [handleKeyDown]);

	return (
		<ScrollArea ref={listRef} className="h-full overflow-y-auto">
			{loading ? (
				Array.from({ length: 4 }).map((_, index) => <SkeletonBusinessCard key={index} />)
			) : (
				<>
					{Array.isArray(filteredBusinesses) && filteredBusinesses.length > 0 ? (
						filteredBusinesses.map((business) => (
							<Suspense key={business.id} fallback={<SkeletonBusinessCard />}>
								<BusinessCard business={business} isActive={business.id === activeBusinessId} handleClick={() => handleCardClick(business)} ref={business.id === activeBusinessId ? activeCardElementRef : null} isLoading={loadingBusinessId === business.id} />
							</Suspense>
						))
					) : (
						<div className="flex flex-col self-center py-4 text-center text-muted-foreground">
							<p className="text-md">No businesses found</p>
							<p className="text-sm">
								If you can&apos;t find what you are looking for{" "}
								<Link className="font-bold text-brand" href="/add-a-business">
									add a business here
								</Link>
							</p>
						</div>
					)}
				</>
			)}
		</ScrollArea>
	);
};

export default memo(BusinessCardList);
export { BusinessCard };
