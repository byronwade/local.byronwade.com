"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const images = [
	"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
	"https://images.unsplash.com/photo-1528740561666-dc2479708f16?w=400&h=300&fit=crop",
	"https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop",
	"https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=400&h=300&fit=crop",
	"https://images.unsplash.com/photo-1521590832167-7ce633395e39?w=400&h=300&fit=crop",
	"https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop",
	"https://images.unsplash.com/photo-1563222899-f5429a2b5e23?w=400&h=300&fit=crop",
	"https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&h=300&fit=crop",
	"https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=400&h=300&fit=crop",
	"https://images.unsplash.com/photo-1529612645559-429315347269?w=400&h=300&fit=crop",
	"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
	"https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
];

const ImageGrid = () => {
	const [currentImages, setCurrentImages] = useState([]);

	useEffect(() => {
		const interval = setInterval(() => {
			const shuffled = [...images].sort(() => 0.5 - Math.random());
			setCurrentImages(shuffled.slice(0, 8));
		}, 5000);

		// Initial load
		const shuffled = [...images].sort(() => 0.5 - Math.random());
		setCurrentImages(shuffled.slice(0, 8));

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
			<div className="grid grid-cols-4 grid-rows-2 gap-2 h-full w-full">
				<AnimatePresence>
					{currentImages.map((src, i) => (
						<motion.div key={src + i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }} className="relative">
							<Image src={src} alt={`Hero image ${i}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
							<div className="absolute inset-0 bg-black/20" />
						</motion.div>
					))}
				</AnimatePresence>
			</div>
			<div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
		</div>
	);
};

export default ImageGrid;
