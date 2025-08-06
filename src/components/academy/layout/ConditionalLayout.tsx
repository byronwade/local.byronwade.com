"use client";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { useEffect } from "react";

interface ConditionalLayoutProps {
	children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
	const pathname = usePathname();

	// Routes that should have full-screen layout (no header/container)
	const fullScreenRoutes = ["/courses/[id]/learn", "/courses/[id]"];

	// Check if current path matches any full-screen route pattern
	const isFullScreen = fullScreenRoutes.some((route) => {
		if (route.includes("[id]")) {
			// Convert route pattern to regex
			const regexPattern = route.replace("[id]", "[^/]+");
			const regex = new RegExp(`^${regexPattern}$`);
			return regex.test(pathname);
		}
		return pathname === route;
	});

	// Update body class based on route
	useEffect(() => {
		const body = document.body;
		if (isFullScreen) {
			body.className = "min-h-screen bg-gray-50";
		} else {
			body.className = "min-h-screen bg-background text-foreground";
		}
	}, [isFullScreen]);

	if (isFullScreen) {
		// Full-screen layout for course pages and learn pages
		return <>{children}</>;
	}

	// Default layout with header and container
	return (
		<>
			<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-6xl">
					<h1 className="text-2xl font-bold text-primary">Contractor Academy</h1>
					<nav className="flex items-center space-x-6">
						<NextLink href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
							Home
						</NextLink>
						<NextLink href="/courses" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
							Courses
						</NextLink>
						<NextLink href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
							Dashboard
						</NextLink>
						<NextLink href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
							About
						</NextLink>
						<NextLink href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
							Contact
						</NextLink>
					</nav>
				</div>
			</header>
			<main className="container mx-auto px-4 py-8">{children}</main>
		</>
	);
}
