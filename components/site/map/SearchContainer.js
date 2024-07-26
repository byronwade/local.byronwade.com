import React, { useEffect, useState, Suspense, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "react-feather";
import { Button } from "@components/ui/button";
import MapContainer from "@components/site/map/MapContainer";
import FullSearchBox from "@components/shared/searchBox/FullSearchBox";
import BusinessCardList from "@components/site/map/BusinessCardList";
import useBusinessStore from "@store/useBusinessStore";

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
			<div className="flex flex-1 overflow-hidden">
				<div className="relative flex flex-col w-1/4 space-y-4 overflow-y-auto min-w-96">
					<div className="sticky top-0 left-0 z-30 shadow-2xl bg-[#121212] w-full">
						<header className="flex flex-row items-center px-4 pt-4">
							<Link href="/" className="flex w-full space-x-2">
								<Button variant="secondary">
									<ChevronLeft className="w-4 h-4 mr-2" /> Thorbis
								</Button>
								<div className="flex flex-row items-center justify-end w-full">
									<Image src="/ThorbisLogo.webp" alt="Thorbis" width={50} height={50} className="h-full w-[36px]" />
								</div>
							</Link>
						</header>
						<div className="w-full px-4 pt-4">
							<Suspense fallback={<div>Loading search box...</div>}>
								<FullSearchBox />
							</Suspense>
						</div>
					</div>
					<div className="z-10 w-full">
						<BusinessCardList activeBusinessId={activeBusinessId} activeCardRef={activeCardRef} />
					</div>
				</div>
				<div className="relative w-3/4">
					<Suspense fallback={<div>Loading map...</div>}>
						<MapContainer />
					</Suspense>
				</div>
			</div>
		</div>
	);
};

export default SearchContainer;
