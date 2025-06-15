export const metadata = {
	title: "Search - Thorbis Business Directory",
	description: "Find and discover local businesses with our advanced search and AI-powered recommendations.",
	robots: "index, follow",
};

export const viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export default function SearchLayout({ children }) {
	return (
		<>
			<div
				className="h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-900 antialiased"
				style={{
					fontSmooth: "always",
					WebkitFontSmoothing: "antialiased",
					MozOsxFontSmoothing: "grayscale",
					textRendering: "optimizeLegibility",
					fontFeatureSettings: '"kern" 1, "liga" 1',
					// GPU acceleration for better performance
					transform: "translateZ(0)",
					willChange: "transform",
					// Optimize rendering
					backfaceVisibility: "hidden",
					perspective: "1000px",
				}}
			>
				{children}
			</div>
		</>
	);
}
