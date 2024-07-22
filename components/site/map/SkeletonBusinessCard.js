import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, Circle, Clock } from "react-feather";
import { StarFilledIcon } from "@radix-ui/react-icons";

const SkeletonBusinessCard = () => {
	return (
		<div className="px-4">
			<div className="flex items-center justify-center w-full mb-4">
				<div className="relative w-full border rounded-md shadow bg-card text-card-foreground">
					<div className="flex flex-row items-center pt-4 pl-4 text-sm">
						<Skeleton className="w-20 h-4" />
						<Info className="w-4 h-4 ml-2 opacity-10" />
					</div>
					<div className="flex flex-col items-start gap-4 p-4 lg:flex-row">
						<Skeleton className="object-cover w-16 h-16 rounded-md" />
						<div className="flex-1">
							<Skeleton className="w-3/4 h-6 mb-1" />
							<div className="flex flex-wrap items-center gap-2">
								<div className="flex space-x-1">
									<Skeleton className="w-10 h-4 rounded-md" />
									<Skeleton className="w-10 h-4 rounded-md" />
								</div>
								<div className="flex items-center space-x-1">
									<Skeleton className="w-16 h-4" />
								</div>
							</div>
							<Skeleton className="w-full h-4 mt-2" />
						</div>
						<div className="flex flex-col w-full space-y-2 lg:absolute lg:top-4 lg:right-4 lg:space-y-0 lg:space-x-2 lg:w-auto lg:justify-end lg:flex-row lg:flex-wrap">
							<Skeleton className="w-24 h-8 rounded-md" />
						</div>
					</div>
					<div className="p-6 pt-0">
						<div className="flex flex-wrap text-sm text-muted-foreground">
							<div className="flex items-center mb-1 ml-1">
								<Skeleton className="w-24 h-6 rounded-md" />
							</div>
							<div className="flex items-center mb-1 ml-1">
								<Skeleton className="w-16 h-6 rounded-md" />
							</div>
							<div className="flex items-center mb-1 ml-1">
								<Skeleton className="w-20 h-6 rounded-md" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SkeletonBusinessCard;
