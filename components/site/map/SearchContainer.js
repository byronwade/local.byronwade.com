import React, { useEffect, useState, Suspense, useRef } from "react";
import Link from "next/link";
import { ChevronLeft } from "react-feather";
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
				<div className="flex flex-col w-1/4 space-y-4 overflow-y-auto min-w-96">
					<div className="sticky top-0 left-0 z-[60] shadow-2xl bg-[#121212] w-full">
						<header className="flex flex-row items-center px-4 pt-4">
							<Link href="/" className="flex flex-row items-end space-x-2">
								<ChevronLeft className="w-8 h-8 p-1 font-bold leading-none text-black bg-white rounded-full hover:bg-gray-300" />
								<span className="text-3xl font-extrabold leading-none lg:inline-block">Thorbis</span>
								<span className="leading-none text-md text-primary-500 lg:inline-block mb-[2px]">Business Directory</span>
							</Link>
						</header>
						<div className="w-full px-4 pt-4">
							<Suspense fallback={<div>Loading search box...</div>}>
								<FullSearchBox />
							</Suspense>
						</div>
					</div>
					<div className="w-full">
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
