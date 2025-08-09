import { useEffect, useRef, useState } from "react";
import { IoMdPlay, IoMdVolumeHigh, IoMdVolumeOff } from "react-icons/io";
import { RiShareForwardFill, RiVerifiedBadgeFill } from "react-icons/ri";
import { FaHeart, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { MdInsertComment, MdBookmark, MdBookmarkBorder } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";

const VideoComponent = ({ video, isPlaying, mute, setMute, onNext, onPrevious }) => {
	const videoRef = useRef(null);
	const [isLiked, setIsLiked] = useState(false);
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [showDescription, setShowDescription] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	// Check if mobile
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		const videoElement = videoRef.current;

		if (isPlaying) {
			videoElement.play().catch((e) => console.log("Video play failed:", e));
		} else {
			videoElement.pause();
		}
	}, [isPlaying]);

	useEffect(() => {
		const handleResize = () => {
			const videoElement = videoRef.current;
			if (!videoElement) return;

			const aspectRatio = 9 / 16;
			const container = videoElement.parentElement;
			const width = container.offsetWidth;
			const height = container.offsetHeight;

			if (width / height > aspectRatio) {
				videoElement.style.width = "100%";
				videoElement.style.height = "auto";
			} else {
				videoElement.style.width = "auto";
				videoElement.style.height = "100%";
			}
		};

		window.addEventListener("resize", handleResize);
		handleResize();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const handleVideoClick = () => {
		if (isPlaying) {
			videoRef.current.pause();
		} else {
			videoRef.current.play();
		}
	};

	const handleLike = (e) => {
		e.stopPropagation();
		setIsLiked(!isLiked);
	};

	const handleBookmark = (e) => {
		e.stopPropagation();
		setIsBookmarked(!isBookmarked);
	};

	const handleShare = (e) => {
		e.stopPropagation();
		console.log("Share video:", video.id);
	};

	const handleComment = (e) => {
		e.stopPropagation();
		console.log("Comment on video:", video.id);
	};

	const formatNumber = (num) => {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + "M";
		} else if (num >= 1000) {
			return (num / 1000).toFixed(1) + "K";
		}
		return num.toString();
	};

	return (
		<div className={`relative ${isMobile ? "w-full h-full" : "w-full max-w-md h-full mx-auto"} bg-black`}>
			{/* Video Container */}
			<div className="relative h-full w-full flex items-center justify-center">
				<video ref={videoRef} src={video.videoUrl} className="absolute top-0 left-0 w-full h-full object-cover" muted={mute} loop onClick={handleVideoClick} onEnded={onNext} playsInline />

				{/* Video Overlay Controls */}
				<div className="absolute inset-0 flex items-center justify-center">
					{!isPlaying && (
						<button onClick={handleVideoClick} className="p-4 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all video-control">
							<IoMdPlay className="w-8 h-8" />
						</button>
					)}
				</div>

				{/* Top Controls */}
				<div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
					<button
						onClick={(e) => {
							e.stopPropagation();
							setMute(!mute);
						}}
						className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all video-control"
					>
						{mute ? <IoMdVolumeOff className="w-5 h-5" /> : <IoMdVolumeHigh className="w-5 h-5" />}
					</button>

					<div className="flex items-center space-x-2">
						{video.isLive && (
							<div className="px-2 py-1 bg-red-500 text-white text-xs rounded-full flex items-center live-indicator">
								<div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
								LIVE
							</div>
						)}
						<button className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all video-control">
							<BsThreeDots className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* Right Side Actions */}
				<div className={`absolute ${isMobile ? "right-4" : "right-2"} bottom-20 flex flex-col items-center space-y-4 z-10`}>
					{/* Business Profile */}
					<div className="flex flex-col items-center business-profile">
						<div className="relative">
							<img src={video.authorAvatar} alt={video.author} className="w-12 h-12 rounded-full border-2 border-white object-cover" />
							{video.isVerified && <RiVerifiedBadgeFill className="absolute -bottom-1 -right-1 w-5 h-5 text-blue-500 bg-white rounded-full verified-badge" />}
						</div>
						<button className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded-full hover:bg-red-600 transition-all">Follow</button>
					</div>

					{/* Like Button */}
					<div className="flex flex-col items-center">
						<button onClick={handleLike} className={`p-3 rounded-full transition-all video-control ${isLiked ? "bg-red-500 text-white" : "bg-black bg-opacity-50 text-white hover:bg-opacity-75"}`}>
							<FaHeart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
						</button>
						<span className="text-white text-xs mt-1 video-stats">{formatNumber(parseInt(video.likes))}</span>
					</div>

					{/* Comment Button */}
					<div className="flex flex-col items-center">
						<button onClick={handleComment} className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all video-control">
							<MdInsertComment className="w-6 h-6" />
						</button>
						<span className="text-white text-xs mt-1 video-stats">{formatNumber(parseInt(video.comments))}</span>
					</div>

					{/* Share Button */}
					<div className="flex flex-col items-center">
						<button onClick={handleShare} className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all video-control">
							<RiShareForwardFill className="w-6 h-6" />
						</button>
						<span className="text-white text-xs mt-1 video-stats">{formatNumber(parseInt(video.shares))}</span>
					</div>

					{/* Bookmark Button */}
					<div className="flex flex-col items-center">
						<button onClick={handleBookmark} className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all video-control">
							{isBookmarked ? <MdBookmark className="w-6 h-6" /> : <MdBookmarkBorder className="w-6 h-6" />}
						</button>
					</div>
				</div>

				{/* Bottom Content */}
				<div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black via-black/50 to-transparent">
					{/* Business Info */}
					<div className="flex items-start space-x-3 mb-3">
						<div className="flex-1">
							<div className="flex items-center space-x-2 mb-1">
								<h3 className="font-semibold text-lg">{video.author}</h3>
								{video.isVerified && <RiVerifiedBadgeFill className="w-4 h-4 text-blue-500" />}
								<div className="flex items-center space-x-1">
									<FaStar className="w-3 h-3 text-yellow-400" />
									<span className="text-sm">{video.rating}</span>
								</div>
							</div>
							<div className="flex items-center space-x-2 text-sm text-gray-300 mb-2">
								<FaMapMarkerAlt className="w-3 h-3" />
								<span>{video.location}</span>
								<span>•</span>
								<span className="business-tag">{video.businessCategory}</span>
							</div>
						</div>
					</div>

					{/* Video Title and Description */}
					<div className="mb-3">
						<h2 className="font-semibold text-base mb-2">{video.title}</h2>
						<div className="text-sm">
							{showDescription ? (
								<div>
									<p className="mb-2">{video.description}</p>
									<div className="flex flex-wrap gap-1 mb-2">
										{video.tags.map((tag, index) => (
											<span key={index} className="text-blue-400">
												#{tag}
											</span>
										))}
									</div>
									<button onClick={() => setShowDescription(false)} className="text-gray-400 hover:text-white">
										Show less
									</button>
								</div>
							) : (
								<div>
									<p className="line-clamp-2">{video.description}</p>
									<button onClick={() => setShowDescription(true)} className="text-gray-400 hover:text-white">
										Show more
									</button>
								</div>
							)}
						</div>
					</div>

					{/* Video Stats */}
					<div className="flex items-center space-x-4 text-sm text-gray-300 video-stats">
						<span>{video.views} views</span>
						<span>•</span>
						<span>{video.uploadTime}</span>
						<span>•</span>
						<span>{video.duration}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VideoComponent;
