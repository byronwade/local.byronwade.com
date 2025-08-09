import React from "react";
import { Skeleton } from "@components/ui/skeleton";
import { Info } from "react-feather";

const SkeletonBusinessCard = () => {
	return (
		<div className="px-4">
			<div className="flex items-center justify-center w-full mb-4">
				<div className="relative w-full border-0 rounded-xl shadow-sm bg-card/50 backdrop-blur-sm text-card-foreground">
					<div className="flex flex-row items-center pt-5 pl-5 text-sm">
						<Skeleton className="w-20 h-4 bg-muted/50" />
						<Info className="w-4 h-4 ml-2 opacity-10 text-muted-foreground" />
					</div>
					<div className="flex flex-col items-start gap-4 p-5 lg:flex-row">
						<Skeleton className="object-cover w-16 h-16 rounded-xl bg-muted/50" />
						<div className="flex-1">
							<Skeleton className="w-3/4 h-6 mb-2 bg-muted/50" />
							<div className="flex flex-wrap items-center gap-2 mb-3">
								<div className="flex space-x-1.5">
									<Skeleton className="w-12 h-4 rounded-lg bg-muted/50" />
									<Skeleton className="w-12 h-4 rounded-lg bg-muted/50" />
								</div>
								<div className="flex items-center space-x-1">
									<Skeleton className="w-16 h-4 bg-muted/50" />
								</div>
							</div>
							<Skeleton className="w-full h-4 mt-2 bg-muted/50" />
						</div>
						<div className="flex flex-col w-full space-y-2 lg:absolute lg:top-5 lg:right-5 lg:space-y-0 lg:space-x-2 lg:w-auto lg:justify-end lg:flex-row lg:flex-wrap">
							<Skeleton className="w-24 h-8 rounded-lg bg-muted/50" />
						</div>
					</div>
					<div className="p-6 pt-0">
						<div className="flex flex-wrap text-sm text-muted-foreground">
							<div className="flex items-center mb-1 ml-1">
								<Skeleton className="w-24 h-6 rounded-lg bg-muted/50" />
							</div>
							<div className="flex items-center mb-1 ml-1">
								<Skeleton className="w-16 h-6 rounded-lg bg-muted/50" />
							</div>
							<div className="flex items-center mb-1 ml-1">
								<Skeleton className="w-20 h-6 rounded-lg bg-muted/50" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SkeletonBusinessCard;
