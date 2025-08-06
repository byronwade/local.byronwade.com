import React from "react";
import { Loader2 } from "lucide-react";

const FullScreenMapSkeleton = () => {
	return (
		<div className="inset-0 z-50 flex items-center justify-center w-full h-full bg-background border-l">
			<Loader2 className="w-32 h-32 text-foreground animate-spin" />
		</div>
	);
};

export default FullScreenMapSkeleton;
