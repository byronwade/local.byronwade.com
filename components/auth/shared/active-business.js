import React from "react";
import Image from "next/image";

export default function ActiveBusiness() {
	return (
		<div className="mt-10">
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">These buissness are linked to your account</h2>
			<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-400">Select a company from bellow</p>
			<div className="mt-4 space-y-4">
				<div className="relative flex flex-row p-2 bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
					<Image src="/ThorbisLogo.webp" alt="Thorbis Logo" width={100} height={100} className="inline-block w-12 h-12 rounded-md" />
					<div className="ml-4">
						<h3>Wades Plumbing & Septic</h3>
						<p className="text-sm text-dark-500 dark:text-gray-300">17655 old summit road, los gatos, CA, 95033</p>
					</div>
				</div>
				<div className="relative flex flex-row p-2 bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
					<Image src="/ThorbisLogo.webp" alt="Thorbis Logo" width={100} height={100} className="inline-block w-12 h-12 rounded-md" />
					<div className="ml-4">
						<h3>Wades Plumbing & Septic</h3>
						<p className="text-sm text-dark-500 dark:text-gray-300">17655 old summit road, los gatos, CA, 95033</p>
					</div>
				</div>
				<div className="relative flex flex-row p-2 bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
					<Image src="/ThorbisLogo.webp" alt="Thorbis Logo" width={100} height={100} className="inline-block w-12 h-12 rounded-md" />
					<div className="ml-4">
						<h3>Wades Plumbing & Septic</h3>
						<p className="text-sm text-dark-500 dark:text-gray-300">17655 old summit road, los gatos, CA, 95033</p>
					</div>
				</div>
			</div>
		</div>
	);
}
