"use client";

import { forwardRef } from "react";
import { SmartImage } from "./SmartImage";

/**
 * OptimizedImage Component
 *
 * Drop-in replacement for Next.js Image component that automatically
 * handles SVG files and other problematic image types by using regular img tags.
 *
 * This component can be imported as "Image" to replace Next.js Image globally.
 */
const OptimizedImage = forwardRef(function OptimizedImage(props, ref) {
	return <SmartImage {...props} ref={ref} />;
});

export { OptimizedImage as Image, OptimizedImage as default, SmartImage };
