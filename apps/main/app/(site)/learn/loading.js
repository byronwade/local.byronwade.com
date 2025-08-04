import Image from "next/image";

export default function Loading() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-background">
			<div className="flex flex-col items-center justify-center gap-4">
				<Image src="/logos/ThorbisLogo.webp" alt="Thorbis Logo" width={100} height={100} className="w-16 h-16 animate-breathe" />
				<p className="text-muted-foreground">Loading Courses...</p>
			</div>
		</div>
	);
}
