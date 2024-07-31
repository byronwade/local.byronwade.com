"use client";
import React, { useEffect, useState, Suspense, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowLeft, ChevronLeft } from "react-feather";
import { Button } from "@components/ui/button";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@components/ui/resizable";
import FullSearchBox from "@components/shared/searchBox/FullSearchBox";
import BusinessCardList from "@components/site/map/BusinessCardList";
import useBusinessStore from "@store/useBusinessStore";
import FullScreenMapSkeleton from "@components/site/map/FullScreenMapSkeleton";

const MapContainer = dynamic(() => import("@components/site/map/MapContainer"), {
	ssr: false,
	loading: () => <FullScreenMapSkeleton />,
});

const SearchContainer = () => {
	const { filteredBusinesses, activeBusinessId } = useBusinessStore();
	const [loading, setLoading] = useState(true);
	const activeCardRef = useRef(null);

	useEffect(() => {
		if (filteredBusinesses.length > 0) {
			setLoading(false);
		}
	}, [filteredBusinesses]);

	return (
		<div className="flex flex-col h-screen outline-none">
			<ResizablePanelGroup direction="horizontal" className="flex flex-1 overflow-hidden">
				<ResizablePanel defaultSize={25} className="relative flex flex-col w-1/4 space-y-4 overflow-y-auto min-w-96">
					<div className="sticky top-0 left-0 z-30 shadow-2xl bg-[#121212] w-full">
						<header className="flex flex-row items-center px-4 pt-4">
							<div className="flex flex-row justify-between w-full space-x-2">
								<Link href="/">
									<Button variant="brand">
										<ArrowLeft className="w-4 h-4 mr-2" /> Thorbis
									</Button>
								</Link>
								<Link href="/">
									<Image src="/ThorbisLogo.webp" alt="Thorbis" width={50} height={50} className="h-full w-[36px]" />
								</Link>
								<Link href="/add-a-business">
									<Button variant="outline">Add a business</Button>
								</Link>
							</div>
						</header>
						<div className="w-full px-4 pt-4">
							<Suspense fallback={<div>Loading search box...</div>}>
								<FullSearchBox />
							</Suspense>
						</div>
					</div>
					<div className="z-10 w-full overflow-auto">
						<BusinessCardList activeBusinessId={activeBusinessId} activeCardRef={activeCardRef} />
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={75} className="relative w-3/4">
					<Suspense fallback={<div>Loading map...</div>}>
						<MapContainer />
					</Suspense>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
};

export default SearchContainer;
