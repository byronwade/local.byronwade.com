// components/shared/OptimisticInteractions.js - Optimistic UI for All User Interactions
import React, { useState, useCallback, useEffect, useRef } from "react";
import { logger } from "@lib/utils/logger";
import instantPageLoader from "@lib/utils/instantPageLoader";

/**
 * Optimistic Navigation - Instant page transitions with zero loading
 */
export const OptimisticNavigation = ({ href, children, className = "", onClick, ...props }) => {
	const [isNavigating, setIsNavigating] = useState(false);

	const handleClick = useCallback(
		(e) => {
			e.preventDefault();

			// Immediate visual feedback
			setIsNavigating(true);

			// Custom onClick handler
			if (onClick) {
				onClick(e);
			}

			// Instant navigation
			try {
				instantPageLoader.handleInstantNavigation(href);
			} catch (error) {
				// Fallback to regular navigation
				window.location.href = href;
			}

			// Reset state after navigation
			setTimeout(() => setIsNavigating(false), 200);
		},
		[href, onClick]
	);

	return (
		<a href={href} onClick={handleClick} className={`optimistic-nav ${isNavigating ? "navigating" : ""} ${className}`} {...props}>
			{children}
		</a>
	);
};

/**
 * Optimistic Rating - Instant rating feedback
 */
export const OptimisticRating = ({ initialRating = 0, maxRating = 5, onRate, businessId, className = "" }) => {
	const [currentRating, setCurrentRating] = useState(initialRating);
	const [hoverRating, setHoverRating] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	const handleRate = useCallback(
		async (rating) => {
			// Immediate optimistic update
			setCurrentRating(rating);
			setIsSubmitting(true);
			setShowSuccess(true);

			try {
				// Submit rating in background
				if (onRate) {
					await onRate(rating, businessId);
				} else {
					// Default API call
					await fetch(`/api/business/${businessId}/rate`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ rating }),
					});
				}

				// Show success feedback
				setTimeout(() => {
					setIsSubmitting(false);
					setShowSuccess(false);
				}, 1500);
			} catch (error) {
				// Revert on failure
				setCurrentRating(initialRating);
				setIsSubmitting(false);
				setShowSuccess(false);
				logger.error("Rating submission failed:", error);
			}
		},
		[onRate, businessId, initialRating]
	);

	return (
		<div className={`optimistic-rating ${className}`}>
			<div className="flex items-center space-x-1 relative">
				{[...Array(maxRating)].map((_, index) => {
					const ratingValue = index + 1;
					const isActive = ratingValue <= (hoverRating || currentRating);

					return (
						<button
							key={index}
							onClick={() => handleRate(ratingValue)}
							onMouseEnter={() => setHoverRating(ratingValue)}
							onMouseLeave={() => setHoverRating(0)}
							className={`
								w-6 h-6 transition-all duration-150 transform hover:scale-110
								${isActive ? "text-yellow-400" : "text-gray-300"}
								${isSubmitting ? "animate-pulse" : ""}
							`}
							disabled={isSubmitting}
						>
							<svg fill="currentColor" viewBox="0 0 20 20" className="w-full h-full">
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
						</button>
					);
				})}

				{/* Success indicator */}
				{showSuccess && (
					<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded animate-bounce">
						Rated {currentRating} star{currentRating !== 1 ? "s" : ""}!
					</div>
				)}
			</div>
		</div>
	);
};

/**
 * Optimistic Like/Favorite - Instant feedback for likes
 */
export const OptimisticLike = ({ initialLiked = false, onToggle, businessId, className = "" }) => {
	const [isLiked, setIsLiked] = useState(initialLiked);
	const [isAnimating, setIsAnimating] = useState(false);

	const handleToggle = useCallback(async () => {
		// Immediate optimistic update
		const newLiked = !isLiked;
		setIsLiked(newLiked);
		setIsAnimating(true);

		try {
			// Submit in background
			if (onToggle) {
				await onToggle(newLiked, businessId);
			} else {
				await fetch(`/api/business/${businessId}/favorite`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ liked: newLiked }),
				});
			}

			// Reset animation
			setTimeout(() => setIsAnimating(false), 300);
		} catch (error) {
			// Revert on failure
			setIsLiked(initialLiked);
			setIsAnimating(false);
			logger.error("Like toggle failed:", error);
		}
	}, [isLiked, onToggle, businessId, initialLiked]);

	return (
		<button
			onClick={handleToggle}
			className={`
				optimistic-like relative p-2 rounded-full transition-all duration-200
				${isLiked ? "text-red-500 bg-red-50" : "text-gray-400 bg-gray-50"}
				hover:scale-110 active:scale-95
				${isAnimating ? "animate-pulse" : ""}
				${className}
			`}
		>
			<svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
			</svg>

			{/* Animation effect */}
			{isAnimating && <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30" />}
		</button>
	);
};

/**
 * Optimistic Share - Instant share feedback
 */
export const OptimisticShare = ({ url, title, businessName, className = "" }) => {
	const [isSharing, setIsSharing] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	const handleShare = useCallback(async () => {
		setIsSharing(true);

		try {
			// Use native share if available
			if (navigator.share) {
				await navigator.share({
					title: title || `Check out ${businessName}`,
					url: url || window.location.href,
				});
			} else {
				// Fallback to clipboard
				await navigator.clipboard.writeText(url || window.location.href);
				setShowSuccess(true);
				setTimeout(() => setShowSuccess(false), 2000);
			}
		} catch (error) {
			// Fallback to manual copy
			try {
				await navigator.clipboard.writeText(url || window.location.href);
				setShowSuccess(true);
				setTimeout(() => setShowSuccess(false), 2000);
			} catch (clipboardError) {
				logger.error("Share failed:", error);
			}
		}

		setIsSharing(false);
	}, [url, title, businessName]);

	return (
		<div className="relative">
			<button
				onClick={handleShare}
				disabled={isSharing}
				className={`
					optimistic-share p-2 rounded-full transition-all duration-200
					text-gray-600 bg-gray-50 hover:bg-gray-100 hover:scale-110 active:scale-95
					${isSharing ? "animate-pulse" : ""}
					${className}
				`}
			>
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
				</svg>
			</button>

			{/* Success message */}
			{showSuccess && <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-bounce">Link copied!</div>}
		</div>
	);
};

/**
 * Optimistic Contact - Instant contact feedback
 */
export const OptimisticContact = ({ businessId, phone, email, className = "" }) => {
	const [lastAction, setLastAction] = useState(null);

	const handleCall = useCallback(() => {
		setLastAction("call");
		window.open(`tel:${phone}`);
		setTimeout(() => setLastAction(null), 2000);
	}, [phone]);

	const handleEmail = useCallback(() => {
		setLastAction("email");
		window.open(`mailto:${email}`);
		setTimeout(() => setLastAction(null), 2000);
	}, [email]);

	return (
		<div className={`optimistic-contact flex space-x-2 ${className}`}>
			{phone && (
				<button
					onClick={handleCall}
					className={`
						flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
						bg-green-600 text-white hover:bg-green-700 hover:scale-105 active:scale-95
						${lastAction === "call" ? "animate-pulse bg-green-700" : ""}
					`}
				>
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
					</svg>
					<span>Call</span>
				</button>
			)}

			{email && (
				<button
					onClick={handleEmail}
					className={`
						flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
						bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95
						${lastAction === "email" ? "animate-pulse bg-blue-700" : ""}
					`}
				>
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
					</svg>
					<span>Email</span>
				</button>
			)}
		</div>
	);
};

/**
 * Optimistic Bookmark - Instant bookmark feedback
 */
export const OptimisticBookmark = ({ initialBookmarked = false, onToggle, businessId, className = "" }) => {
	const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
	const [isAnimating, setIsAnimating] = useState(false);

	const handleToggle = useCallback(async () => {
		const newBookmarked = !isBookmarked;
		setIsBookmarked(newBookmarked);
		setIsAnimating(true);

		try {
			if (onToggle) {
				await onToggle(newBookmarked, businessId);
			} else {
				await fetch(`/api/business/${businessId}/bookmark`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ bookmarked: newBookmarked }),
				});
			}

			setTimeout(() => setIsAnimating(false), 300);
		} catch (error) {
			setIsBookmarked(initialBookmarked);
			setIsAnimating(false);
			logger.error("Bookmark toggle failed:", error);
		}
	}, [isBookmarked, onToggle, businessId, initialBookmarked]);

	return (
		<button
			onClick={handleToggle}
			className={`
				optimistic-bookmark p-2 rounded-full transition-all duration-200
				${isBookmarked ? "text-blue-500 bg-blue-50" : "text-gray-400 bg-gray-50"}
				hover:scale-110 active:scale-95
				${isAnimating ? "animate-bounce" : ""}
				${className}
			`}
		>
			<svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
			</svg>
		</button>
	);
};

/**
 * Optimistic Check-in - Instant check-in feedback
 */
export const OptimisticCheckin = ({ businessId, businessName, onCheckin, className = "" }) => {
	const [isCheckingIn, setIsCheckingIn] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	const handleCheckin = useCallback(async () => {
		setIsCheckingIn(true);
		setShowSuccess(true);

		try {
			if (onCheckin) {
				await onCheckin(businessId);
			} else {
				await fetch(`/api/business/${businessId}/checkin`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ timestamp: new Date().toISOString() }),
				});
			}

			// Show success for a moment
			setTimeout(() => {
				setIsCheckingIn(false);
				setShowSuccess(false);
			}, 2000);
		} catch (error) {
			setIsCheckingIn(false);
			setShowSuccess(false);
			logger.error("Check-in failed:", error);
		}
	}, [businessId, onCheckin]);

	return (
		<div className="relative">
			<button
				onClick={handleCheckin}
				disabled={isCheckingIn}
				className={`
					optimistic-checkin flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
					${showSuccess ? "bg-green-600 text-white" : "bg-orange-600 text-white hover:bg-orange-700"}
					hover:scale-105 active:scale-95
					${isCheckingIn ? "animate-pulse" : ""}
					${className}
				`}
			>
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
				<span>{showSuccess ? "Checked in!" : "Check In"}</span>
			</button>

			{showSuccess && <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded animate-bounce whitespace-nowrap">Checked in at {businessName}!</div>}
		</div>
	);
};

/**
 * Optimistic Follow - Instant follow feedback
 */
export const OptimisticFollow = ({ initialFollowing = false, onToggle, businessId, followCount = 0, className = "" }) => {
	const [isFollowing, setIsFollowing] = useState(initialFollowing);
	const [currentCount, setCurrentCount] = useState(followCount);
	const [isAnimating, setIsAnimating] = useState(false);

	const handleToggle = useCallback(async () => {
		const newFollowing = !isFollowing;
		setIsFollowing(newFollowing);
		setCurrentCount((prev) => (newFollowing ? prev + 1 : prev - 1));
		setIsAnimating(true);

		try {
			if (onToggle) {
				await onToggle(newFollowing, businessId);
			} else {
				await fetch(`/api/business/${businessId}/follow`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ following: newFollowing }),
				});
			}

			setTimeout(() => setIsAnimating(false), 300);
		} catch (error) {
			setIsFollowing(initialFollowing);
			setCurrentCount(followCount);
			setIsAnimating(false);
			logger.error("Follow toggle failed:", error);
		}
	}, [isFollowing, onToggle, businessId, initialFollowing, followCount]);

	return (
		<button
			onClick={handleToggle}
			className={`
				optimistic-follow flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
				${isFollowing ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
				hover:scale-105 active:scale-95
				${isAnimating ? "animate-pulse" : ""}
				${className}
			`}
		>
			<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
			</svg>
			<span>{isFollowing ? "Following" : "Follow"}</span>
			{currentCount > 0 && <span className="text-sm opacity-75">({currentCount})</span>}
		</button>
	);
};

/**
 * Optimistic Photo Upload - Instant photo feedback
 */
export const OptimisticPhotoUpload = ({ businessId, onUpload, className = "" }) => {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [showSuccess, setShowSuccess] = useState(false);
	const fileInputRef = useRef(null);

	const handleFileSelect = useCallback(
		async (e) => {
			const file = e.target.files[0];
			if (!file) return;

			setIsUploading(true);
			setUploadProgress(0);

			try {
				// Simulate upload progress
				const progressInterval = setInterval(() => {
					setUploadProgress((prev) => {
						if (prev >= 90) {
							clearInterval(progressInterval);
							return prev;
						}
						return prev + 10;
					});
				}, 100);

				// Create FormData
				const formData = new FormData();
				formData.append("photo", file);
				formData.append("businessId", businessId);

				// Upload
				if (onUpload) {
					await onUpload(formData);
				} else {
					await fetch(`/api/business/${businessId}/photos`, {
						method: "POST",
						body: formData,
					});
				}

				// Complete progress
				setUploadProgress(100);
				setShowSuccess(true);

				setTimeout(() => {
					setIsUploading(false);
					setUploadProgress(0);
					setShowSuccess(false);
				}, 2000);
			} catch (error) {
				setIsUploading(false);
				setUploadProgress(0);
				logger.error("Photo upload failed:", error);
			}
		},
		[businessId, onUpload]
	);

	return (
		<div className={`optimistic-photo-upload ${className}`}>
			<input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

			<button
				onClick={() => fileInputRef.current?.click()}
				disabled={isUploading}
				className={`
					flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
					${showSuccess ? "bg-green-600" : "bg-purple-600"} text-white hover:scale-105 active:scale-95
					${isUploading ? "cursor-not-allowed" : "hover:bg-purple-700"}
				`}
			>
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
				<span>{isUploading ? `Uploading... ${uploadProgress}%` : showSuccess ? "Photo uploaded!" : "Add Photo"}</span>
			</button>

			{/* Upload progress bar */}
			{isUploading && (
				<div className="mt-2 w-full bg-gray-200 rounded-full h-1">
					<div className="bg-purple-600 h-1 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
				</div>
			)}
		</div>
	);
};

// CSS for optimistic interactions
const optimisticStyles = `
.optimistic-nav {
	transition: all 0.2s ease;
}

.optimistic-nav.navigating {
	transform: scale(0.98);
	opacity: 0.8;
}

.optimistic-rating .animate-pulse {
	animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes bounce {
	0%, 100% {
		transform: translateY(-25%);
		animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
	}
	50% {
		transform: none;
		animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
	}
}

.animate-bounce {
	animation: bounce 1s infinite;
}

@keyframes ping {
	75%, 100% {
		transform: scale(2);
		opacity: 0;
	}
}

.animate-ping {
	animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
`;

// Inject styles
if (typeof document !== "undefined" && !document.getElementById("optimistic-interactions-styles")) {
	const styleSheet = document.createElement("style");
	styleSheet.id = "optimistic-interactions-styles";
	styleSheet.textContent = optimisticStyles;
	document.head.appendChild(styleSheet);
}

export default {
	OptimisticNavigation,
	OptimisticRating,
	OptimisticLike,
	OptimisticShare,
	OptimisticContact,
	OptimisticBookmark,
	OptimisticCheckin,
	OptimisticFollow,
	OptimisticPhotoUpload,
};
