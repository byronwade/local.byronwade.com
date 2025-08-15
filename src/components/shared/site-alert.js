"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function SiteWideAlert() {
	const pathname = usePathname();
	
	// Don't show alert on slideshow pages
	if (pathname && pathname.includes("/slideshow")) {
		return null;
	}

	// Build email only after mount to avoid exposing it in SSR HTML
	const [email, setEmail] = useState("");
	useEffect(() => {
		const userPart = "bcw" + "1995";
		const domainPart = "gmail" + ".com";
		setEmail(`${userPart}\u0040${domainPart}`);
	}, []);

	return (
		<div data-notification="global-site-alert" data-nosnippet className="relative z-[70] w-full bg-amber-400 text-black" role="status" aria-live="polite">
			<div className="mx-auto px-4 lg:px-24 py-2 text-xs sm:text-sm leading-relaxed text-center">
				<span className="font-medium">Work in progress:</span> This website is being built by one person and will take a few years to complete. Looking for an investor —<span className="whitespace-nowrap"> email me at </span>
				{email ? (
					<a href={`mailto:${email}`} className="underline hover:no-underline font-medium" rel="nofollow noopener">
						{email}
					</a>
				) : (
					<span className="font-medium">(enable JavaScript to view)</span>
				)}
				.
			</div>
		</div>
	);
}
