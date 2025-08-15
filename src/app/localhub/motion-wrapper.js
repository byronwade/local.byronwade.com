"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

// Animation variants for different components
const fadeUpVariants = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
	},
};

const staggerContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
};

const scaleInVariants = {
	hidden: { scale: 0.8, opacity: 0 },
	visible: {
		scale: 1,
		opacity: 1,
		transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
	},
};

// Reusable motion wrapper component
export function MotionSection({ children, variant = "fadeUp", className = "", delay = 0 }) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });
	const shouldReduceMotion = useReducedMotion();

	const variants = {
		fadeUp: fadeUpVariants,
		scaleIn: scaleInVariants,
		stagger: staggerContainer,
	};

	if (shouldReduceMotion) {
		return (
			<div ref={ref} className={className}>
				{children}
			</div>
		);
	}

	return (
		<motion.div ref={ref} variants={variants[variant]} initial="hidden" animate={isInView ? "visible" : "hidden"} transition={{ delay }} className={className}>
			{children}
		</motion.div>
	);
}

// Hero animation component
export function MotionHero({ children }) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div>{children}</div>;
	}

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}>
			{children}
		</motion.div>
	);
}

// Card hover animation
export function MotionCard({ children, className = "" }) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			className={className}
			whileHover={{
				y: -8,
				transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
			}}
			whileTap={{ scale: 0.98 }}
		>
			{children}
		</motion.div>
	);
}

// Button animation
export function MotionButton({ children, className = "", href, ...props }) {
	const shouldReduceMotion = useReducedMotion();

	const Component = href ? motion.a : motion.button;

	if (shouldReduceMotion) {
		const StaticComponent = href ? "a" : "button";
		return (
			<StaticComponent href={href} className={className} {...props}>
				{children}
			</StaticComponent>
		);
	}

	return (
		<Component href={href} className={className} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }} {...props}>
			{children}
		</Component>
	);
}

// Grid stagger animation
export function MotionGrid({ children, className = "" }) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-50px" });
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return (
			<div ref={ref} className={className}>
				{children}
			</div>
		);
	}

	return (
		<motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className={className}>
			{children}
		</motion.div>
	);
}

// Individual grid item
export function MotionGridItem({ children, className = "" }) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div variants={fadeUpVariants} className={className}>
			{children}
		</motion.div>
	);
}
