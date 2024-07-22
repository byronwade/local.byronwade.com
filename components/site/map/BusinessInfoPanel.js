import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, ChevronLeft, ChevronRight } from "react-feather";
import useBusinessStore from "@/store/useBusinessStore";

const BusinessInfoPanel = () => {
	const { activeBusiness: business, filteredBusinesses, setActiveBusiness, flyToLocation } = useBusinessStore();

	const businessIndex = business ? filteredBusinesses.findIndex((b) => b.id === business.id) : -1;

	useEffect(() => {
		if (business && business.coordinates) {
			const { lat, lng } = business.coordinates;
			const serviceAreaRadius = business.serviceArea.value;
			flyToLocation(lat, lng, serviceAreaRadius);
		}
	}, [business, flyToLocation]);

	const handlePrev = () => {
		if (businessIndex > 0) {
			setActiveBusiness(filteredBusinesses[businessIndex - 1]);
		}
	};

	const handleNext = () => {
		if (businessIndex < filteredBusinesses.length - 1) {
			setActiveBusiness(filteredBusinesses[businessIndex + 1]);
		}
	};

	const handleClose = () => {
		// Clear the active business and related states
		setActiveBusiness(null);
	};

	if (!business) return null;

	return (
		<div className="absolute top-0 left-0 z-10 w-1/4 h-full p-4 overflow-hidden min-w-96">
			<div className="flex flex-col h-full p-4 bg-black rounded-md">
				<div className="flex flex-row justify-between p-4 pt-0">
					<div className="space-x-4">
						<Button variant="secondary" size="icon" onClick={handlePrev} disabled={businessIndex === 0}>
							<ChevronLeft className="w-4 h-4" />
						</Button>
						<Button variant="secondary" size="icon" onClick={handleNext} disabled={businessIndex === filteredBusinesses.length - 1}>
							<ChevronRight className="w-4 h-4" />
						</Button>
					</div>
					<Button variant="destructive" size="icon" onClick={handleClose}>
						<X className="w-4 h-4" />
					</Button>
				</div>
				<ScrollArea className="flex-1 px-4 shadow-lg">
					<div className="space-y-4">
						<div className="grid gap-2">
							<img alt="Product image" loading="lazy" width="300" height="300" decoding="async" className="object-cover w-full rounded-md aspect-square" style={{ color: "transparent" }} src={business.image || "/placeholder.svg"} />
							<div className="grid grid-cols-3 gap-2">
								{business.images &&
									business.images.slice(0, 2).map((src, index) => (
										<button key={index}>
											<img alt="Product image" loading="lazy" width="84" height="84" decoding="async" className="object-cover w-full rounded-md aspect-square" style={{ color: "transparent" }} src={src || "/placeholder.svg"} />
										</button>
									))}
								<button className="flex items-center justify-center w-full border border-dashed rounded-md aspect-square">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-muted-foreground lucide lucide-upload">
										<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
										<polyline points="17 8 12 3 7 8"></polyline>
										<line x1="12" y1="3" x2="12" y2="15"></line>
									</svg>
									<span className="sr-only">Upload</span>
								</button>
							</div>
						</div>

						<div className="space-y-1.5 flex flex-row items-start">
							<div className="grid gap-0.5">
								<h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight group">
									{business.name}
									<button className="inline-flex items-center justify-center w-6 h-6 text-sm font-medium transition-opacity border rounded-md shadow-sm opacity-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-background hover:bg-accent hover:text-accent-foreground group-hover:opacity-100">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 lucide lucide-copy">
											<rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
											<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
										</svg>
										<span className="sr-only">Copy Business ID</span>
									</button>
								</h3>
								<p className="text-sm text-muted-foreground">Updated: {new Date().toLocaleDateString()}</p>
							</div>
						</div>

						<div className="text-sm">
							<div className="grid gap-2">
								<div className="font-semibold">Contact Information</div>
								<ul className="grid gap-2">
									<li className="flex items-center justify-between">
										<span className="text-muted-foreground">
											<strong>Address:</strong> {business.address}
										</span>
									</li>
									<li className="flex items-center justify-between">
										<span className="text-muted-foreground">
											<strong>Phone:</strong> {business.phone}
										</span>
									</li>
									<li className="flex items-center justify-between">
										<span className="text-muted-foreground">
											<strong>Email:</strong> {business.email}
										</span>
									</li>
								</ul>
							</div>

							<div className="shrink-0 bg-border h-[1px] w-full my-2"></div>

							<div className="grid gap-2">
								<div className="font-semibold">Business Details</div>
								<ul className="grid gap-2">
									<li className="flex items-center justify-between">
										<span className="text-muted-foreground">
											<strong>Rating:</strong> {business.rating} stars ({business.reviewsCount} reviews)
										</span>
									</li>
									<li className="flex items-center justify-between">
										<span className="text-muted-foreground">
											<strong>Price Range:</strong> {business.price}
										</span>
									</li>
									<li className="flex items-center justify-between">
										<span className="text-muted-foreground">
											<strong>Status:</strong> {business.isOpenNow ? "Open now" : business.statusMessage}
										</span>
									</li>
								</ul>
							</div>

							<div className="shrink-0 bg-border h-[1px] w-full my-2"></div>

							<div className="grid gap-2">
								<div className="font-semibold">Services</div>
								<ul className="list-disc list-inside">
									{business.categories.map((category, index) => (
										<li key={index}>{category}</li>
									))}
								</ul>
							</div>

							<div className="shrink-0 bg-border h-[1px] w-full my-2"></div>

							<div className="grid gap-2">
								<div className="font-semibold">Description</div>
								<p>{business.description}</p>
							</div>

							<div className="shrink-0 bg-border h-[1px] w-full my-2"></div>

							<div className="grid gap-2">
								<div className="font-semibold">Website</div>
								{business.website ? (
									<a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-500">
										{business.website}
									</a>
								) : (
									<p>No website available</p>
								)}
							</div>
						</div>
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};

export default BusinessInfoPanel;
