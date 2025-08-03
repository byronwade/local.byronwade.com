// components/shared/ImageHoverPrefetch.js - Easy Image Hover Prefetching for React Components
import React, { useEffect, useRef, useCallback } from "react";
import imageHoverPrefetcher from "@lib/utils/imageHoverPrefetching";
import { logger } from "@lib/utils/logger";

/**
 * Business Card with Image Hover Prefetching
 * Automatically prefetches business images on hover
 */
export const BusinessCard = ({ business, onClick, className = "", children, ...props }) => {
	const cardRef = useRef(null);

	useEffect(() => {
		const card = cardRef.current;
		if (!card || !business?.id) return;

		// Set business ID for automatic prefetching
		card.setAttribute("data-business-id", business.id);

		// Custom image prefetch configuration
		if (business.images) {
			card.setAttribute("data-prefetch-images", JSON.stringify(business.images));
		}
	}, [business]);

	const handleClick = useCallback(
		(e) => {
			if (onClick) {
				onClick(business, e);
			}
		},
		[business, onClick]
	);

	return (
		<div ref={cardRef} onClick={handleClick} className={`business-card cursor-pointer transition-transform hover:scale-105 ${className}`} {...props}>
			{children || (
				<div className="bg-white rounded-lg shadow-md p-4">
					<div className="aspect-video bg-gray-200 rounded mb-3 overflow-hidden">{business.thumbnail && <img src={business.thumbnail} alt={business.name} className="w-full h-full object-cover" loading="lazy" />}</div>
					<h3 className="font-semibold text-lg mb-1">{business.name}</h3>
					<p className="text-gray-600 text-sm mb-2">{business.category}</p>
					<div className="flex items-center space-x-2">
						<div className="flex text-yellow-400">
							{Array.from({ length: 5 }, (_, i) => (
								<span key={i}>{i < Math.floor(business.rating || 0) ? "★" : "☆"}</span>
							))}
						</div>
						<span className="text-sm text-gray-500">{business.reviewCount || 0} reviews</span>
					</div>
				</div>
			)}
		</div>
	);
};

/**
 * Prefetch Link Component
 * Automatically prefetches images when hovering over links
 */
export const PrefetchLink = ({ href, prefetchImages = [], children, className = "", priority = "normal", ...props }) => {
	const linkRef = useRef(null);

	useEffect(() => {
		const link = linkRef.current;
		if (!link) return;

		// Set prefetch images data
		if (prefetchImages.length > 0) {
			link.setAttribute("data-prefetch-images", JSON.stringify(prefetchImages));
		}

		// Set priority class for different hover delays
		if (priority === "instant") {
			link.classList.add("prefetch-instant");
		} else if (priority === "fast") {
			link.classList.add("prefetch-fast");
		}
	}, [prefetchImages, priority]);

	return (
		<a ref={linkRef} href={href} className={`prefetch-link ${className}`} {...props}>
			{children}
		</a>
	);
};

/**
 * Image Gallery with Smart Prefetching
 * Prefetches gallery images based on user interaction
 */
export const ImageGallery = ({
	images = [],
	businessId,
	className = "",
	onImageClick,
	preloadNext = 3, // Number of next images to preload
}) => {
	const galleryRef = useRef(null);
	const [currentIndex, setCurrentIndex] = React.useState(0);

	useEffect(() => {
		// Preload next few images when current index changes
		const nextImages = images.slice(currentIndex + 1, currentIndex + 1 + preloadNext);

		nextImages.forEach((image, index) => {
			if (image.url) {
				imageHoverPrefetcher.queueImagePrefetch({
					url: image.url,
					priority: imageHoverPrefetcher.imagePriorities.GALLERY_IMAGES,
					type: "gallery_preload",
					businessId,
					index: currentIndex + 1 + index,
				});
			}
		});
	}, [currentIndex, images, businessId, preloadNext]);

	const handleImageHover = useCallback(
		(image, index) => {
			// Prefetch high-resolution version on hover
			if (image.highRes) {
				imageHoverPrefetcher.queueImagePrefetch({
					url: image.highRes,
					priority: imageHoverPrefetcher.imagePriorities.GALLERY_IMAGES,
					type: "gallery_highres",
					businessId,
					index,
				});
			}
		},
		[businessId]
	);

	const handleImageClick = useCallback(
		(image, index) => {
			setCurrentIndex(index);
			if (onImageClick) {
				onImageClick(image, index);
			}
		},
		[onImageClick]
	);

	return (
		<div ref={galleryRef} className={`image-gallery ${className}`}>
			<div className="grid grid-cols-3 gap-2">
				{images.map((image, index) => (
					<div key={index} className="aspect-square bg-gray-200 rounded overflow-hidden cursor-pointer hover:opacity-90 transition-opacity" onMouseEnter={() => handleImageHover(image, index)} onClick={() => handleImageClick(image, index)}>
						<img src={image.thumbnail || image.url} alt={image.alt || `Gallery image ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
					</div>
				))}
			</div>
		</div>
	);
};

/**
 * Smart Image Component with Hover Prefetching
 * Automatically handles different image sizes and prefetching
 */
export const SmartImage = ({ src, thumbnail, highRes, alt, className = "", prefetchOnHover = true, priority = "normal", ...props }) => {
	const imgRef = useRef(null);
	const [isHovered, setIsHovered] = React.useState(false);
	const [highResLoaded, setHighResLoaded] = React.useState(false);

	const handleMouseEnter = useCallback(() => {
		setIsHovered(true);

		if (prefetchOnHover && highRes && !highResLoaded) {
			// Prefetch high-resolution image on hover
			const img = new Image();
			img.onload = () => setHighResLoaded(true);
			img.src = highRes;
		}
	}, [prefetchOnHover, highRes, highResLoaded]);

	const handleMouseLeave = useCallback(() => {
		setIsHovered(false);
	}, []);

	// Use high-res image if loaded and hovered, otherwise use src or thumbnail
	const currentSrc = isHovered && highResLoaded && highRes ? highRes : src || thumbnail;

	return <img ref={imgRef} src={currentSrc} alt={alt} className={`smart-image transition-all duration-300 ${className}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props} />;
};

/**
 * Business Search Result with Image Prefetching
 * Optimized for search result lists
 */
export const SearchResultCard = ({ business, onClick, className = "", showImage = true }) => {
	const cardRef = useRef(null);

	useEffect(() => {
		const card = cardRef.current;
		if (!card || !business?.id) return;

		// Auto-prefetch business images
		card.setAttribute("data-business-id", business.id);
	}, [business]);

	const handleClick = useCallback(() => {
		if (onClick) {
			onClick(business);
		}
	}, [business, onClick]);

	return (
		<div ref={cardRef} onClick={handleClick} className={`search-result-card flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${className}`}>
			{showImage && <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">{business.thumbnail && <SmartImage src={business.thumbnail} highRes={business.heroImage} alt={business.name} className="w-full h-full object-cover" priority="fast" />}</div>}

			<div className="flex-1 min-w-0">
				<h3 className="font-semibold text-lg truncate">{business.name}</h3>
				<p className="text-gray-600 text-sm truncate">{business.address}</p>
				<div className="flex items-center space-x-2 mt-1">
					<div className="flex text-yellow-400 text-sm">
						{Array.from({ length: 5 }, (_, i) => (
							<span key={i}>{i < Math.floor(business.rating || 0) ? "★" : "☆"}</span>
						))}
					</div>
					<span className="text-xs text-gray-500">({business.reviewCount || 0})</span>
				</div>
			</div>

			<div className="text-right">
				<div className="text-sm font-medium text-green-600">{business.isOpen ? "Open" : "Closed"}</div>
				{business.distance && <div className="text-xs text-gray-500">{business.distance} away</div>}
			</div>
		</div>
	);
};

/**
 * Category Card with Image Prefetching
 * For category browsing pages
 */
export const CategoryCard = ({ category, onClick, className = "" }) => {
	const cardRef = useRef(null);

	useEffect(() => {
		const card = cardRef.current;
		if (!card || !category?.slug) return;

		// Set up category image prefetching
		if (category.images) {
			card.setAttribute("data-prefetch-images", JSON.stringify(category.images));
		}
	}, [category]);

	const handleClick = useCallback(() => {
		if (onClick) {
			onClick(category);
		}
	}, [category, onClick]);

	return (
		<div ref={cardRef} onClick={handleClick} className={`category-card bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer ${className}`}>
			<div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-lg flex items-center justify-center">{category.icon && <span className="text-4xl">{category.icon}</span>}</div>
			<div className="p-4">
				<h3 className="font-semibold text-lg">{category.name}</h3>
				<p className="text-gray-600 text-sm">{category.businessCount || 0} businesses</p>
			</div>
		</div>
	);
};

/**
 * Hook for custom image prefetching
 */
export const useImagePrefetch = () => {
	const prefetchImage = useCallback((url, options = {}) => {
		imageHoverPrefetcher.queueImagePrefetch({
			url,
			priority: options.priority || imageHoverPrefetcher.imagePriorities.BACKGROUND_IMAGES,
			type: options.type || "custom",
			...options,
		});
	}, []);

	const prefetchBusinessImages = useCallback((businessId) => {
		const images = imageHoverPrefetcher.getBusinessImages(businessId);
		images.forEach((imageData) => {
			imageHoverPrefetcher.queueImagePrefetch(imageData);
		});
	}, []);

	const getCachedImage = useCallback((url) => {
		return imageHoverPrefetcher.getCachedImage(url);
	}, []);

	return {
		prefetchImage,
		prefetchBusinessImages,
		getCachedImage,
	};
};

// CSS for image prefetching components
const imageStyles = `
.prefetch-instant {
	--hover-delay: 0ms;
}

.prefetch-fast {
	--hover-delay: 25ms;
}

.business-card:hover {
	transform: translateY(-2px);
}

.search-result-card:hover {
	transform: translateX(4px);
}

.category-card:hover {
	transform: translateY(-4px) scale(1.02);
}

.smart-image {
	transition: all 0.3s ease;
}

.smart-image:hover {
	transform: scale(1.05);
}

.image-gallery img {
	transition: opacity 0.2s ease;
}

.image-gallery img:hover {
	opacity: 0.9;
}
`;

// Inject styles
if (typeof document !== "undefined" && !document.getElementById("image-prefetch-styles")) {
	const styleSheet = document.createElement("style");
	styleSheet.id = "image-prefetch-styles";
	styleSheet.textContent = imageStyles;
	document.head.appendChild(styleSheet);
}

export default {
	BusinessCard,
	PrefetchLink,
	ImageGallery,
	SmartImage,
	SearchResultCard,
	CategoryCard,
	useImagePrefetch,
};
