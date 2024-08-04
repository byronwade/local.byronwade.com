import React from "react";
import Link from "next/link";
import { Star } from "react-feather";
import { RiCircleFill } from "react-icons/ri";

export default function BusinessCard({ business, disabled }) {
	return (
		<Link href="/biz/1" className="flex flex-col items-start w-full h-auto">
			<div className="relative flex-none w-full h-0 pb-[56.25%] hover:scale-110 hover:z-10 transition-transform duration-300">
				<div className="absolute top-0 left-0 w-full h-full overflow-visible">
					<div className={`relative w-full h-full overflow-hidden rounded-md shadow-md hover:outline hover:outline-4 hover:outline-primary`}>
						<img className={`absolute top-0 left-0 z-0 object-cover object-center w-full h-full`} src={business.image} alt={business.name} />
						{disabled && <div className="absolute inset-0 bg-black opacity-50"></div>}
					</div>
				</div>
			</div>
			<div className="flex flex-col items-start justify-between w-full mt-2">
				<div className="flex items-center justify-between w-full">
					<h3 className={`text-lg font-semibold ${disabled ? "text-gray-400" : "text-white"}`}>{business.name}</h3>
					<div className="flex flex-row space-x-1">
						<div className="flex items-center px-2 py-1 rounded-md bg-secondary">
							<Star className={`w-4 h-4 ${disabled ? "text-gray-400" : "text-yellow-400"}`} />
							<span className={`ml-1 text-sm ${disabled ? "text-gray-400" : "text-white"}`}>{business.rating}</span>
						</div>
						<div className={`text-sm font-bold px-2 py-1 rounded-md bg-secondary ${disabled ? "text-gray-400" : "text-green-500"}`}>{business.price}</div>
					</div>
				</div>
				<div className="flex items-center justify-between w-full mt-1">
					<div className="flex items-center px-2 py-1 rounded-md bg-secondary">
						<RiCircleFill className={`w-3 h-3 ${business.status === "Open" ? "text-green-400" : "text-red-400"}`} />
						<span className={`ml-1 text-sm ${disabled ? "text-gray-400" : "text-white"}`}>{business.status}</span>
					</div>
					<div className="flex items-center px-2 py-1 rounded-md bg-secondary">
						{business.tags.map((tag, idx) => (
							<span key={idx} className={`ml-1 text-sm ${disabled ? "text-gray-400" : "text-white"}`}>
								{tag}
								{idx < business.tags.length - 1 && ","}
							</span>
						))}
					</div>
				</div>
			</div>
		</Link>
	);
}
