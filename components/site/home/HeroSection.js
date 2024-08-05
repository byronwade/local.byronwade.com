"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Info } from "react-feather";
import { Button } from "@components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function HeroSection({ carouselItems }) {
	const carouselApiRef = useRef(null);
	const playerRefs = useRef([]);
	const [isYouTubeAPIReady, setYouTubeAPIReady] = useState(false);

	const isYouTubeUrl = (url) => {
		const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
		return youtubeRegex.test(url);
	};

	const isVideoUrl = (url) => {
		const videoRegex = /\.(mp4|webm|ogg)$/;
		return videoRegex.test(url);
	};

	const getYouTubeEmbedUrl = (url) => {
		let videoId;

		if (url.includes("embed")) {
			// If the URL is already an embed link, ensure autoplay is enabled
			return url.includes("autoplay=1") ? url : `${url}?autoplay=1`;
		}

		if (url.includes("youtube.com")) {
			const urlParams = new URLSearchParams(new URL(url).search);
			videoId = urlParams.get("v");
		} else if (url.includes("youtu.be")) {
			videoId = url.split("youtu.be/")[1].split("?")[0];
		}

		if (videoId) {
			return `https://www.youtube.com/embed/${videoId}`;
		} else {
			console.error("Invalid YouTube URL:", url);
			return "";
		}
	};

	const handleKeyDown = (e) => {
		if (carouselApiRef.current) {
			if (e.key === "ArrowLeft") {
				carouselApiRef.current.scrollPrev();
			} else if (e.key === "ArrowRight") {
				carouselApiRef.current.scrollNext();
			}
		}
	};

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	useEffect(() => {
		const tag = document.createElement("script");
		tag.src = "https://www.youtube.com/iframe_api";
		const firstScriptTag = document.getElementsByTagName("script")[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		window.onYouTubeIframeAPIReady = () => {
			setYouTubeAPIReady(true);
		};
	}, []);

	useEffect(() => {
		if (isYouTubeAPIReady) {
			playerRefs.current.forEach((playerRef, index) => {
				if (playerRef) {
					new YT.Player(playerRef, {
						videoId: getYouTubeEmbedUrl(playerRef.dataset.src).split("embed/")[1].split("?")[0],
						playerVars: {
							autoplay: 1,
							controls: 0,
							mute: 1,
							loop: 1,
							modestbranding: 1,
							rel: 0,
							showinfo: 0,
							fs: 0,
							iv_load_policy: 3,
							playlist: getYouTubeEmbedUrl(playerRef.dataset.src).split("embed/")[1].split("?")[0],
						},
						events: {
							onReady: (event) => {
								event.target.playVideo();
							},
							onError: (event) => {
								console.error("YouTube Player Error:", event.data);
							},
						},
					});
				}
			});
		}
	}, [isYouTubeAPIReady, carouselItems]);

	return (
		<div className="relative h-[60vh]">
			<Carousel
				setApi={(api) => (carouselApiRef.current = api)}
				className="relative z-20 h-[60vh]"
				opts={{
					loop: true, // Enable looping
				}}
				plugins={[
					Autoplay({
						delay: 12000, // Auto-slide every 12 seconds
					}),
				]}
			>
				<CarouselContent className="h-[60vh]">
					{carouselItems.map((item, index) => (
						<CarouselItem key={index} className="w-full h-[60vh]">
							<div className="relative w-full h-[60vh]">
								<div className="absolute inset-0 z-10 bg-gradient-to-t from-background to-transparent" />
								<div className="absolute inset-0 z-10 bg-gradient-to-r from-background to-transparent" />
								<div className="absolute inset-0">
									{isYouTubeUrl(item.mediaSrc) ? (
										<div ref={(el) => (playerRefs.current[index] = el)} className="absolute top-0 left-0 z-0 object-cover w-full h-full" data-src={getYouTubeEmbedUrl(item.mediaSrc)} />
									) : isVideoUrl(item.mediaSrc) ? (
										<video autoPlay muted loop className="absolute top-0 left-0 object-cover w-full h-full" playsInline>
											<source src={item.mediaSrc} type="video/mp4" />
											<source src={item.mediaSrc} type="video/webm" />
											<source src={item.mediaSrc} type="video/ogg" />
										</video>
									) : (
										<Image width={2200} height={2200} src={item.mediaSrc} alt={item.title} className="object-cover w-full h-full" />
									)}
								</div>
								<div className="relative z-20 flex flex-col items-start justify-center h-full px-6 space-y-4 sm:px-12 lg:px-24">
									<div className="max-w-lg">
										<Image width={2200} height={2200} src={item.title} alt="Title" className="w-full h-auto mb-4" />
										<p className="text-xl text-white">{item.description}</p>
										<div className="z-50 flex mt-8 space-x-4">
											<Link href={item.link} className="inline-block" passHref legacyBehavior>
												<Button size="lg" className="flex items-center space-x-2 h-14">
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" preserveAspectRatio="xMidYMid meet" className="mr-2">
														<circle cx="16" cy="16" r="15" fill="currentColor" opacity="0.1" />
														<circle cx="16" cy="16" r="7" fill="currentColor" opacity="0.4" />
														<circle cx="16" cy="16" r="3" fill="currentColor" />
													</svg>
													<span>Live Now</span>
												</Button>
											</Link>
											<Link href={item.link} className="inline-block" passHref legacyBehavior>
												<Button variant="secondary" size="lg" className="flex items-center space-x-2 h-14">
													<Info className="w-6 h-6" />
													<span>More Info</span>
												</Button>
											</Link>
										</div>
									</div>
								</div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}
