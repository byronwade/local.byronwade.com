import Image from "next/image";
import Link from "next/link";
import { Star } from "react-feather";
import { RiCircleFill } from "react-icons/ri";

function ImageSection({ business, disabled }) {
	return (
		<div className="relative flex-none h-0 pb-[56.25%] hover:scale-110 hover:z-10 transition-transform duration-300 w-72">
			<div className="absolute top-0 left-0 w-full h-full overflow-visible">
				<div className={"relative w-full h-full overflow-hidden rounded-md shadow-md hover:outline hover:outline-4 hover:outline-primary"}>
					<Image className={"absolute top-0 left-0 z-0 object-cover object-center w-full h-full"} src={business.image} alt={business.name} layout="fill" />
					{disabled && <div className="absolute inset-0 bg-black opacity-50" />}
				</div>
			</div>
		</div>
	);
}

function BusinessInfo({ business, disabled }) {
	return (
		<div className="flex items-center justify-between w-full">
			<h3 className={`text-lg font-bold text-ellipsis truncate w-72 ${disabled ? "text-gray-400" : "text-white"}`}>{business.name}</h3>
		</div>
	);
}

function BusinessStatus({ business, disabled }) {
	return (
		<div className="flex items-center px-2 py-1 rounded-md bg-secondary">
			<RiCircleFill className={`w-3 h-3 ${business.status === "Open" ? "text-green-400" : "text-red-400"}`} />
			<span className={`ml-1 text-xs ${disabled ? "text-gray-400" : "text-white"}`}>{business.status}</span>
		</div>
	);
}

function BusinessRating({ business, disabled }) {
	return (
		<div className="flex items-center px-2 py-1 rounded-md bg-secondary">
			<Star className={`w-3 h-3 ${disabled ? "text-gray-400" : "text-yellow-400"}`} />
			<span className={`ml-1 text-xs ${disabled ? "text-gray-400" : "text-white"}`}>{business.rating}</span>
		</div>
	);
}

function BusinessPrice({ business, disabled }) {
	return <div className={`text-xs font-bold px-2 py-1 rounded-md bg-secondary ${disabled ? "text-gray-400" : "text-green-500"}`}>{business.price}</div>;
}

export default function BusinessCard({ business, disabled }) {
	return (
		<Link href="/biz/1" className="flex flex-col items-start w-full h-auto">
			<ImageSection business={business} disabled={disabled} />
			<div className="flex flex-col items-start justify-between w-full mt-2">
				<BusinessInfo business={business} disabled={disabled} />
				<div className="items-center justify-between hidden w-full mt-1 md:flex">
					<BusinessStatus business={business} disabled={disabled} />
					<div className="flex-row hidden space-x-1 md:flex">
						<BusinessRating business={business} disabled={disabled} />
						<BusinessPrice business={business} disabled={disabled} />
					</div>
				</div>
			</div>
		</Link>
	);
}
