"use client";
import { useEffect } from "react";

/**
 * Client component for the shorts layout that handles DOM manipulation.
 * This component hides the main header and footer for the shorts page experience.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The shorts page content.
 * @returns {JSX.Element} The shorts page layout without any default site elements.
 */
export default function ShortsLayoutClient({ children }) {
	// Hide the main header and other site elements when this layout is active
	useEffect(() => {
		// Hide main header
		const header = document.getElementById("header");
		if (header) {
			header.style.display = "none";
		}

		// Hide footer if it exists
		const footer = document.querySelector("footer");
		if (footer) {
			footer.style.display = "none";
		}

		// Hide any notification banners or other site-wide elements
		const notificationBanners = document.querySelectorAll("[data-notification], .notification-banner, .banner");
		notificationBanners.forEach((banner) => {
			banner.style.display = "none";
		});

		// Cleanup function to restore elements when leaving shorts page
		return () => {
			// Restore main header
			if (header) {
				header.style.display = "";
			}

			// Restore footer
			if (footer) {
				footer.style.display = "";
			}

			// Restore notification banners
			notificationBanners.forEach((banner) => {
				banner.style.display = "";
			});
		};
	}, []);

	return <div className="min-h-screen bg-background">{children}</div>;
}
