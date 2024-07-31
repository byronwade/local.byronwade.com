import React from "react";
import { FaBuilding, FaStar, FaComment, FaImage, FaExclamationCircle } from "react-icons/fa";

export default function WhatAreYouReporting() {
	return (
		<div>
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">What are you reporting?</h2>
			<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-400">You can report businesses, reviews, posts, images, and other related issues.</p>
			<div className="mt-4 space-y-4">
				<div className="relative flex flex-row p-2 bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
					<FaBuilding className="w-6 h-6 mr-4 text-gray-700 dark:text-gray-300" />
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">A Business</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">Report a business for Diamond Certified evaluation. Provide relevant business details and customer information.</p>
					</div>
				</div>
				<div className="relative flex flex-row p-2 bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
					<FaStar className="w-6 h-6 mr-4 text-gray-700 dark:text-gray-300" />
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">A Review</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">Report a review that you believe violates our guidelines. Provide specific details and examples.</p>
					</div>
				</div>
				<div className="relative flex flex-row p-2 bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
					<FaComment className="w-6 h-6 mr-4 text-gray-700 dark:text-gray-300" />
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">A Post</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">Report a post that you believe is inappropriate or violates our community guidelines.</p>
					</div>
				</div>
				<div className="relative flex flex-row p-2 bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
					<FaImage className="w-6 h-6 mr-4 text-gray-700 dark:text-gray-300" />
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">An Image</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">Report an image that you believe is inappropriate or violates our community guidelines.</p>
					</div>
				</div>
				<div className="relative flex flex-row p-2 bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
					<FaExclamationCircle className="w-6 h-6 mr-4 text-gray-700 dark:text-gray-300" />
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">Other</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">Report any other issues not covered by the above categories. Provide detailed information for our review.</p>
					</div>
				</div>
			</div>
		</div>
	);
}
