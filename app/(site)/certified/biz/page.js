import React from "react";
import Image from "next/image";

export default function Categories() {
	return (
		<>
			<div className="flex items-center justify-between w-full gap-6 p-2 px-4 py-4 pl-8 mx-auto sm:px-12 lg:px-24">
				<div>
					<h1 className="text-5xl">Wade&apos;s Plumbing & Septic</h1>
					<p>Thorbis Certified Company Report</p>
				</div>
				<div className="p-4 border">
					<div className="relative overflow-hidden pb-[70%]">
						<img alt="diamondcertified logo" src="https://www.diamondcertified.org/DCR_Public_Images/report/logo-certified.jpg?w=3840&q=75" layout="fill" objectFit="contain" className="absolute top-0 left-0 w-full h-full" />
					</div>
					<p className="mt-4 text-center">
						Rated Highest in Quality
						<span className="block">and Helpful Expertise</span>
						<span className="block">PERFORMANCE GUARANTEED</span>
					</p>
					<div className="mt-4">
						<div className="text-xl font-bold">Duncan Plumbing Ent., Inc.</div>
						<div className="text-lg">335 SURVEYS</div>
						<div className="flex items-center mt-2">
							<ul className="flex space-x-2">
								<li className="relative overflow-hidden pb-[100%]">
									<img alt="star image" src="https://diamondcertified.org/DCR_Public_Images/category/star10.png?w=3840&q=75" layout="fill" objectFit="contain" className="absolute top-0 left-0 w-full h-full" />
								</li>
								<li className="relative overflow-hidden pb-[100%]">
									<img alt="star image" src="https://diamondcertified.org/DCR_Public_Images/category/star10.png?w=3840&q=75" layout="fill" objectFit="contain" className="absolute top-0 left-0 w-full h-full" />
								</li>
								<li className="relative overflow-hidden pb-[100%]">
									<img alt="star image" src="https://diamondcertified.org/DCR_Public_Images/category/star10.png?w=3840&q=75" layout="fill" objectFit="contain" className="absolute top-0 left-0 w-full h-full" />
								</li>
								<li className="relative overflow-hidden pb-[100%]">
									<img alt="star image" src="https://diamondcertified.org/DCR_Public_Images/category/star10.png?w=3840&q=75" layout="fill" objectFit="contain" className="absolute top-0 left-0 w-full h-full" />
								</li>
								<li className="relative overflow-hidden pb-[100%]">
									<img alt="star image" src="https://diamondcertified.org/DCR_Public_Images/category/star5.png?w=3840&q=75" layout="fill" objectFit="contain" className="absolute top-0 left-0 w-full h-full" />
								</li>
							</ul>
							<span className="ml-2">Rating</span>
						</div>
						<div className="mt-2 text-lg">10 CONSECUTIVE YEARS</div>
						<div className="flex mt-2">
							<div className="flex-1 pr-0">
								<span className="font-bold">SINCE</span> <span>DECEMBER 2014</span>
							</div>
							<div className="flex-1">
								<span className="font-bold">CERT</span> <span>2213</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
