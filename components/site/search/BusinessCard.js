import React from "react";
import Image from "next/image";
import Link from "next/link";

const BusinessCard = ({ business, onClick }) => {
	return (
		<Link href="/biz" passHref>
			<div id={`business-${business.id}`} className="p-4 mb-4 border rounded-lg cursor-pointer" onClick={onClick}>
				<div className="flex items-center">
					<Image src={business.image} alt={business.name} width={1000} height={1000} className="object-cover w-24 h-24 rounded-lg" />
					<div className="ml-4">
						<h3 className="text-lg font-medium">{business.name}</h3>
						<p>{business.address}</p>
						<p>{business.phone}</p>
						<p className="text-yellow-500">{`Rating: ${business.rating}`}</p>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default BusinessCard;
