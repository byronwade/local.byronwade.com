"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import { ArrowLeft } from "react-feather";
import DarkModeToggle from "@components/ui/dark-mode-toggle";

function DevAuthTools() {
	if (typeof window === "undefined" || process.env.NODE_ENV !== "development") return null;
	const enabled = typeof window !== "undefined" && localStorage.getItem("thorbis_auth_dev_disabled") === "1";
	const toggle = () => {
		const now = localStorage.getItem("thorbis_auth_dev_disabled") === "1";
		if (now) {
			localStorage.removeItem("thorbis_auth_dev_disabled");
			document.cookie = "dev_auth_off=; Max-Age=0; path=/";
		} else {
			localStorage.setItem("thorbis_auth_dev_disabled", "1");
			document.cookie = "dev_auth_off=1; Max-Age=31536000; path=/";
		}
		window.location.reload();
	};
	return (
		<button onClick={toggle} className="text-xs px-2 py-1 rounded border border-border text-muted-foreground hover:text-foreground">
			{enabled ? "Auth OFF" : "Auth ON"}
		</button>
	);
}

export default function AuthFormsLayoutClient({ children }) {
	return (
		<div className="min-h-screen bg-background relative">
			{/* Header with Logo and Theme Toggle */}
			<header className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-6">
				<Link href="/" className="flex items-center space-x-3 group">
					<Image src="/logos/ThorbisLogo.webp" alt="Thorbis Logo" width={40} height={40} className="w-10 h-10 transition-transform group-hover:scale-110" />
					<span className="text-xl font-bold text-foreground hidden sm:block">Thorbis</span>
				</Link>
				<div className="flex items-center space-x-4">
					<Link href="/">
						<Button variant="ghost" size="sm" className="flex gap-2 items-center text-muted-foreground hover:text-foreground">
							<ArrowLeft className="w-4 h-4" />
							<span className="hidden sm:inline">Back to Thorbis</span>
						</Button>
					</Link>
					<DevAuthTools />
					<DarkModeToggle />
				</div>
			</header>

			{/* Main Content Area */}
			<main className="flex flex-col items-center justify-center min-h-screen px-4 py-20">
				{/* Welcome Section */}
				<div className="text-center mb-8 max-w-md">
					<div className="mb-4">
						<h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Welcome Back</h1>
					</div>
				</div>

				{/* Form Container */}
				<div className="w-full max-w-xl">
					<div className="bg-card border border-border rounded-xl shadow-sm p-8 sm:p-10">{children}</div>
				</div>

				{/* Reassurance (condensed) */}
				<div className="mt-4 w-full max-w-xl text-center">
					<p className="text-xs text-muted-foreground">Secure • Private • SSO options</p>
				</div>
			</main>
		</div>
	);
}
