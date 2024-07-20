import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Circle, Clock, Info } from "react-feather";
import { StarFilledIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const BusinessCard = ({ business, onClick, isActive }) => {
	return (
		<div id={`business-${business.id}`} className={`flex items-center justify-center w-full mb-4 cursor-pointer ${isActive ? "bg-gray-900" : ""} transition-colors duration-200 ease-in-out`} onClick={onClick}>
			<div className="relative w-full border rounded-md shadow bg-card text-card-foreground">
				{business.isSponsored && (
					<div className="flex flex-row items-center pt-4 pl-4 text-sm">
						Sponsored <Info className="w-4 h-4 ml-2" />
					</div>
				)}
				<div className="flex flex-col items-start gap-4 p-4 lg:flex-row">
					{business.logo && <Image width={100} height={100} src={business.logo} alt={`${business.name} logo`} className="object-cover w-16 h-16 rounded-md" />}
					<div className="flex-1">
						<h3 className="mb-1 text-lg font-semibold leading-none tracking-tight">
							{business.name}

							<Button variant="outline" size="icon" className="ml-2 inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs ">
								<p className="text-sm text-green-600">{business.price}</p>
							</Button>
						</h3>
						<div className="flex flex-wrap items-center gap-2">
							<div className="flex space-x-1">
								{business.categories.map((category, index) => (
									<Badge key={index} variant="outline" className="border shadow px-[2px] py-0 text-[10px] font-bold">
										{category}
									</Badge>
								))}
							</div>
							<div className="flex items-center space-x-1">
								<p className="text-sm text-muted-foreground">{business.deal}</p>
							</div>
						</div>
						<p className="mt-2 text-sm text-muted-foreground">{business.description}</p>
					</div>
					<div className="flex flex-col w-full space-y-2 lg:absolute lg:top-4 lg:right-4 lg:space-y-0 lg:space-x-2 lg:w-auto lg:justify-end lg:flex-row lg:flex-wrap">
						{/* <Button className="flex items-center justify-center h-8 gap-2 px-2 py-2 text-sm font-medium transition-colors bg-gray-800 rounded-md select-none shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3" type="button">
							<Star className="w-4 h-4" />
							Ratings
							<ChevronDown className="w-4 h-4 text-secondary-foreground" />
						</Button> */}
						<Link href={`/biz/${business.id}`} passHref legacyBehavior>
							<a target="_blank" className="flex items-center justify-center h-8 gap-2 px-2 py-2 text-sm font-medium transition-colors bg-gray-800 rounded-md select-none shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3" type="button">
								View Profile
							</a>
						</Link>
					</div>
				</div>
				<div className="p-6 pt-0">
					<div className="flex space-x-4 text-sm text-muted-foreground">
						<div className="flex items-center">
							<Button variant="outline" className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs ">
								<Circle className={`w-3 h-3 mr-1 ${business.isOpenNow ? "fill-green-400 text-green-400" : "fill-gray-400 text-gray-400"}`} />
								{business.isOpenNow ? "Open now" : "Closed"}
							</Button>
						</div>
						<div className="flex items-center">
							<Button variant="outline" className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs ">
								<StarFilledIcon className="w-3 h-3 mr-1 text-yellow-500" />
								{business.reviewsCount}
							</Button>
						</div>
						<div className="flex items-center">
							<Button variant="outline" className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] px-3 text-xs ">
								<Clock className="w-3 h-3 mr-1" />
								{business.statusMessage}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BusinessCard;
