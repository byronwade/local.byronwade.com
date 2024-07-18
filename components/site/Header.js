import React from "react";
import { Menu, User, Briefcase } from "react-feather";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PublicHeader = () => {
	return (
		<header className="container flex items-center h-16 px-4 mx-auto max-w-screen-2xl">
			<div className="flex items-center justify-between flex-1 space-x-2 md:justify-start">
				<Link href="/" className="flex items-center mr-4 space-x-2 lg:mr-6">
					<span className="text-lg font-extrabold lg:inline-block">Thorbis</span>
				</Link>
				<nav className="items-center hidden gap-4 text-sm md:flex lg:gap-6">
					<Link href="/find-business" className="transition-colors hover:text-foreground/80 text-foreground/60">
						Find business
					</Link>
					<Link href="/how-it-works" className="transition-colors hover:text-foreground/80 text-foreground/60">
						How It Works
					</Link>
					<Link href="/blog" className="transition-colors hover:text-foreground/80 text-foreground/60">
						Blog
					</Link>
					<Link href="/support" className="transition-colors hover:text-foreground/80 text-foreground/60">
						Support
					</Link>
				</nav>
			</div>
			<div className="flex items-center space-x-2">
				<Button variant="link" className="hidden md:inline-block" asChild>
					<Link href="/pro-signup">Join our pro network</Link>
				</Button>
				<Button variant="outline" className="hidden md:inline-block" asChild>
					<Link href="/login">Login</Link>
				</Button>
				<Button variant="brand" className="hidden md:inline-block" asChild>
					<Link href="/signup">Signup</Link>
				</Button>
			</div>
		</header>
	);
};

export default PublicHeader;
