import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@context/ThemeContext";
import { LanguageProvider } from "@context/LanguageContext";
import { StatsigProvider } from "@context/StatsigContext";
import { Toaster } from "@components/ui/toaster";
import ErrorBoundary from "@components/shared/ErrorBoundary";
import AnalyticsInitializer from "@components/shared/AnalyticsInitializer";
import { cn } from "@utils";

import { AuthProvider } from "@context/AuthContext";

// Import global metadata configuration
export { metadata, viewport } from "./metadata";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
			<head>
				{/* Dark mode script to prevent flash of wrong theme */}
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								try {
									const savedTheme = localStorage.getItem('thorbis-theme');
									if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
										document.documentElement.classList.add('dark');
									} else if (savedTheme === 'light') {
										document.documentElement.classList.remove('dark');
									} else {
										// Default to dark mode if no preference is set
										document.documentElement.classList.add('dark');
									}
								} catch (e) {
									// Fallback to dark mode
									document.documentElement.classList.add('dark');
								}
							})();
						`,
					}}
				/>

				{/* Performance optimizations */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
				<link rel="dns-prefetch" href="https://www.google-analytics.com" />

				{/* Preload critical assets with proper priority */}
				<link rel="preload" as="image" href="/logos/ThorbisLogo.webp" fetchPriority="high" />
				<link rel="preload" href="/_next/static/media/e4af272ccee01ff0-s.p.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

				{/* Organization structured data for global recognition */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(
							{
								"@context": "https://schema.org",
								"@type": "Organization",
								name: "ByteRover LLC",
								url: "https://local.byronwade.com",
								logo: {
									"@type": "ImageObject",
									url: "https://local.byronwade.com/logos/ThorbisLogo.webp",
									width: 512,
									height: 512,
								},
								description: "Local business directory connecting communities with trusted local businesses and services",
								foundingDate: "2024",
								address: {
									"@type": "PostalAddress",
									addressCountry: "US",
									addressRegion: "California",
								},
								contactPoint: {
									"@type": "ContactPoint",
									telephone: "+1-555-123-4567",
									email: "support@local.byronwade.com",
									contactType: "Customer Service",
									areaServed: "US",
									availableLanguage: "English",
								},
								sameAs: ["https://twitter.com/byronwade", "https://linkedin.com/company/byronwade"],
							},
							null,
							0
						),
					}}
				/>

				{/* Website structured data */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(
							{
								"@context": "https://schema.org",
								"@type": "WebSite",
								name: "Local ByteRover Directory",
								url: "https://local.byronwade.com",
								description: "Discover local businesses, events, and community resources in your area",
								potentialAction: {
									"@type": "SearchAction",
									target: {
										"@type": "EntryPoint",
										urlTemplate: "https://local.byronwade.com/search?q={search_term_string}",
									},
									"query-input": "required name=search_term_string",
								},
								publisher: {
									"@type": "Organization",
									name: "ByteRover LLC",
									url: "https://local.byronwade.com",
									logo: "https://local.byronwade.com/logos/ThorbisLogo.webp",
								},
							},
							null,
							0
						),
					}}
				/>
			</head>
			<body className={cn("min-h-screen bg-background text-foreground font-sans antialiased", fontSans.variable)}>
				<ErrorBoundary>
					<ThemeProvider>
						<LanguageProvider initialLocale="en">
							<AuthProvider>
								<StatsigProvider>
									<AnalyticsInitializer />
									{children}
									<Toaster />
								</StatsigProvider>
							</AuthProvider>
						</LanguageProvider>
					</ThemeProvider>
				</ErrorBoundary>
				{/* Global error handlers and performance optimizations */}
				<script
					dangerouslySetInnerHTML={{
						__html: `
														// Suppress React DevTools warnings and ZodErrors in production
							if (typeof window !== 'undefined') {
								const originalWarn = console.warn;
								const originalLog = console.log;
								const originalError = console.error;

								console.warn = function(...args) {
									if (args[0] && typeof args[0] === 'string') {
										if (args[0].includes('Download the React DevTools') ||
											args[0].includes('ZodError') ||
											args[0].includes('Invalid email')) {
											return;
										}
									}
									originalWarn.apply(console, args);
								};

								console.log = function(...args) {
									if (args[0] && typeof args[0] === 'string' &&
										args[0].includes('Download the React DevTools')) {
										return;
									}
									originalLog.apply(console, args);
								};

								console.error = function(...args) {
									if (args[0] && (
										(typeof args[0] === 'string' && args[0].includes('ZodError')) ||
										(args[0] && args[0].name === 'ZodError') ||
										(typeof args[0] === 'string' && args[0].includes('Invalid email'))
									)) {
										return; // Suppress ZodError from console
									}
									originalError.apply(console, args);
								};
							}

							// Handle uncaught promise rejections (where ZodErrors typically occur)
							window.addEventListener('unhandledrejection', function(event) {
								if (event.reason && event.reason.name === 'ZodError') {
									console.warn('Uncaught ZodError handled globally:', event.reason);
									event.preventDefault(); // Prevent the error from appearing in console
									return;
								}
								
								// Handle other async errors gracefully
								if (event.reason && event.reason.message) {
									console.warn('Uncaught promise rejection:', event.reason.message);
									event.preventDefault();
								}
							});

							// Handle other uncaught errors
							window.addEventListener('error', function(event) {
								if (event.error && event.error.name === 'ZodError') {
									console.warn('Uncaught ZodError handled globally:', event.error);
									event.preventDefault(); // Prevent the error from appearing in console
									return;
								}
								
								// Handle performance warnings
								if (event.message && event.message.includes('Forced reflow')) {
									console.warn('Performance warning handled:', event.message);
									event.preventDefault();
									return;
								}
							});
							
							// Optimize image loading performance
							if (typeof window !== 'undefined') {
								// Prevent preload warnings by ensuring images are used quickly
								const imagePreloadHandler = function() {
									const preloadedImages = document.querySelectorAll('link[rel="preload"][as="image"]');
									preloadedImages.forEach(function(link) {
										const img = new Image();
										img.src = link.href;
										img.style.display = 'none';
										document.body.appendChild(img);
										setTimeout(function() {
											if (img.parentNode) {
												img.parentNode.removeChild(img);
											}
										}, 100);
									});
								};
								
								if (document.readyState === 'loading') {
									document.addEventListener('DOMContentLoaded', imagePreloadHandler);
								} else {
									imagePreloadHandler();
								}
							}
						`,
					}}
				/>
			</body>
		</html>
	);
}
