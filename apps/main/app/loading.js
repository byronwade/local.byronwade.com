import Image from "next/image";

export default function Loading() {
	return (
		<div className="flex justify-center items-center min-h-screen bg-background">
			<Image src="/logos/ThorbisLogo.webp" alt="Thorbis Logo" width={100} height={100} className="w-[60px] h-[60px] animate-breathe" />
		</div>
	);
}
