"use client";

// FallbackImage is now a simple alias to SmartImage for backward compatibility
// This ensures any components still importing FallbackImage will work correctly

import { SmartImage } from "./SmartImage";

/**
 * FallbackImage Component (Legacy)
 *
 * This is now just an alias to SmartImage for backward compatibility.
 * New code should use SmartImage directly.
 *
 * @deprecated Use SmartImage instead
 */
export function FallbackImage(props) {
	return <SmartImage {...props} />;
}

/**
 * SafeImage Component (Legacy)
 *
 * This is now just an alias to SmartImage for backward compatibility.
 *
 * @deprecated Use SmartImage instead
 */
export function SafeImage(props) {
	return <SmartImage {...props} />;
}

export default FallbackImage;
