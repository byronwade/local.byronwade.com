"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import { ArrowLeft } from "react-feather";
import DarkModeToggle from "@components/ui/DarkModeToggle";

export default function AuthFormsLayout({ children }) {
	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative">
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
					<DarkModeToggle />
				</div>
			</header>

			{/* Main Content Area */}
			<main className="flex flex-col items-center justify-center min-h-screen px-4 py-20">
				{/* Welcome Section */}
				<div className="text-center mb-8 max-w-md">
					<div className="mb-4">
						<h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
							Welcome Back{" "}
							<span role="img" aria-label="wave" className="inline-block animate-bounce">
								👋
							</span>
						</h1>
						<p className="text-lg text-muted-foreground">Let's get you signed in and back to discovering amazing local businesses</p>
					</div>
				</div>

				{/* Form Container */}
				<div className="w-full max-w-md">
					<div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg p-8">{children}</div>
				</div>

				{/* Footer Help Text */}
				<div className="mt-8 text-center max-w-md">
					<p className="text-sm text-muted-foreground">
						New to Thorbis?{" "}
						<Link href="/signup" className="font-medium text-primary hover:text-primary/80 transition-colors">
							Create an account
						</Link>{" "}
						and start exploring local businesses in your area.
					</p>
				</div>
			</main>

			{/* Decorative Elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
			</div>
		</div>
	);
}
