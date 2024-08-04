"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Info } from "react-feather";
import { Button } from "@components/ui/button";

export default function HeroSection({ title, description, mediaSrc, link }) {
	const isYouTubeUrl = (url) => {
		const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
		return youtubeRegex.test(url);
	};

	const isVideoUrl = (url) => {
		const videoRegex = /\.(mp4|webm|ogg)$/;
		return videoRegex.test(url);
	};

	const getYouTubeEmbedUrl = (url) => {
		const videoId = url.split("v=")[1]?.split("&")[0] || url.split("youtu.be/")[1];
		return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&html5=1&mute=1&autoplay=1&controls=0&loop=1&playlist=${videoId}`;
	};

	return (
		<div className="relative h-[60vh]">
			<div className="absolute inset-0 z-10 bg-gradient-to-t from-background to-transparent"></div>
			<div className="absolute inset-0 z-10 bg-gradient-to-r from-background to-transparent"></div>
			<div className="absolute inset-0">
				{isYouTubeUrl(mediaSrc) ? (
					<iframe src={getYouTubeEmbedUrl(mediaSrc)} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="absolute top-0 left-0 object-cover w-full h-full"></iframe>
				) : isVideoUrl(mediaSrc) ? (
					<video autoPlay muted loop className="absolute top-0 left-0 object-cover w-full h-full" playsInline>
						<source src={mediaSrc} type="video/mp4" />
						<source src={mediaSrc} type="video/webm" />
						<source src={mediaSrc} type="video/ogg" />
					</video>
				) : (
					<Image width={2200} height={2200} src={mediaSrc} alt={title} className="object-cover w-full h-full" />
				)}
				<div className="absolute inset-0 bg-black opacity-50"></div>
			</div>
			<div className="relative z-20 flex flex-col items-start justify-center h-full px-6 space-y-4 sm:px-12 lg:px-24">
				<div className="max-w-lg">
					<Image width={2200} height={2200} src={title} alt="Title" className="w-full h-auto mb-4" />
					<p className="text-xl text-white">{description}</p>
					<div className="z-50 flex mt-8 space-x-4">
						<Link href={link} className="inline-block" passHref legacyBehavior>
							<Button size="lg" className="flex items-center space-x-2 h-14">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" preserveAspectRatio="xMidYMid meet" className="mr-2">
									<circle cx="16" cy="16" r="15" fill="currentColor" opacity="0.1" />
									<circle cx="16" cy="16" r="7" fill="currentColor" opacity="0.4" />
									<circle cx="16" cy="16" r="3" fill="currentColor" />
								</svg>
								<span>Live Now</span>
							</Button>
						</Link>
						<Link href={link} className="inline-block" passHref legacyBehavior>
							<Button variant="secondary" size="lg" className="flex items-center space-x-2 h-14">
								<Info className="w-6 h-6" />
								<span>More Info</span>
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
