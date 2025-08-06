"use client";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "@components/ui/carousel";
import Image from "next/image";

// JSON data with featured and base images
const companyMedia = {
	featured: ["https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg", "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg", "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg"],
	base: [
		"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg",
		"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg",
		"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg",
		"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg",
		"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg",
		"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg",
		"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg",
		"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg",
		"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg",
		"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg",
		"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg",
		"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg",
	],
};

// Carousel Plugin Component
function CarouselPlugin({ images }) {
	return (
		<Carousel
			plugins={[
				Autoplay({
					delay: 3000,
					stopOnInteraction: false,
				}),
			]}
			className="w-full overflow-hidden rounded-lg shadow-lg"
		>
			<CarouselContent>
				{images.map((url, index) => (
					<CarouselItem key={index} className="relative">
						<Image
							width={1920}
							height={1080}
							src={url}
							alt={`Featured ${index + 1}`}
							className="object-cover w-full h-auto rounded-lg"
							style={{ aspectRatio: "16 / 9" }} // Adjusted aspect ratio for better fit
						/>
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
}

// Main Photos Component
export function Photos() {
	return (
		<section id="work" className="py-4">
			<div className="mb-6">
				<h2 className="mb-2 text-3xl font-bold md:text-4xl">Media</h2>
				<p className="text-lg text-muted-foreground">Discover who we are and what we stand for.</p>
			</div>

			{/* Carousel for Featured Images */}
			<div className="mb-4">
				<CarouselPlugin images={companyMedia.featured} />
			</div>

			{/* Base Images */}

			{/* Base Images */}
			<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
				<div className="grid gap-4">
					{companyMedia.base.slice(0, 3).map((url, index) => (
						<div key={index}>
							<Image width={1920} height={1080} src={url} alt={`Work ${index + 1}`} className="h-auto max-w-full rounded-lg" />
						</div>
					))}
				</div>
				<div className="grid gap-4">
					{companyMedia.base.slice(3, 6).map((url, index) => (
						<div key={index}>
							<Image width={1920} height={1080} src={url} alt={`Work ${index + 4}`} className="h-auto max-w-full rounded-lg" />
						</div>
					))}
				</div>
				<div className="grid gap-4">
					{companyMedia.base.slice(6, 9).map((url, index) => (
						<div key={index}>
							<Image width={1920} height={1080} src={url} alt={`Work ${index + 7}`} className="h-auto max-w-full rounded-lg" />
						</div>
					))}
				</div>
				<div className="grid gap-4">
					{companyMedia.base.slice(9, 12).map((url, index) => (
						<div key={index}>
							<Image width={1920} height={1080} src={url} alt={`Work ${index + 10}`} className="h-auto max-w-full rounded-lg" />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
