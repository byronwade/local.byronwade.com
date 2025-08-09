"use client";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { Rocket, Compass } from "lucide-react";

export default function NotFound() {
	const handleGoBack = () => {
		if (typeof window !== "undefined") {
			window.history.back();
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
			<div className="max-w-md text-center">
				<div className="relative inline-block mb-8">
					<h1 className="text-9xl font-bold text-primary">404</h1>
					<p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-background text-sm font-medium px-2 bg-foreground rounded-full">Page Not Found</p>
				</div>
				<h2 className="text-2xl font-semibold mb-2">Well, this is awkward.</h2>
				<p className="text-muted-foreground mb-8">It seems the page you&apos;re looking for has either been moved to a parallel universe or we&apos;re just really bad at hide-and-seek. Let&apos;s pretend it&apos;s the former.</p>
				<div className="flex gap-4 justify-center">
					<Button asChild>
						<Link href="/">
							<Home className="w-4 h-4 mr-2" />
							Go to Homepage
						</Link>
					</Button>
					<Button variant="outline" onClick={handleGoBack}>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Travel Back
					</Button>
				</div>
				<div className="mt-12 text-sm text-muted-foreground/80">
					<p>If you&apos;re feeling adventurous, pick a direction:</p>
					<div className="flex justify-center gap-6 mt-4">
						<Link href="/learn" className="flex items-center gap-1.5 hover:text-primary transition-colors">
							<Rocket className="w-4 h-4" /> Learn Something New
						</Link>
						<Link href="/localhub" className="flex items-center gap-1.5 hover:text-primary transition-colors">
							<Compass className="w-4 h-4" /> Explore LocalHub
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
