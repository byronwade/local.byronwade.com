/**
 * Global Metadata Configuration for Next.js App Router
 * Enterprise-level SEO optimization with performance-first approach
 */

export const metadata = {
	// Basic metadata
	title: {
		default: "Local ByteRover Directory - Discover Local Businesses & Community",
		template: "%s | Local ByteRover Directory",
	},
	description: "Discover the best local businesses, events, and community resources in your area. Connect with your neighborhood and find trusted local services with verified reviews and ratings.",
	keywords: ["local business directory", "community events", "neighborhood guide", "local services", "business reviews", "community resources", "local marketplace", "small business", "local economy", "community networking"],

	// Authors and creator
	authors: [{ name: "ByteRover LLC", url: "https://local.byronwade.com" }],
	creator: "ByteRover LLC",
	publisher: "ByteRover LLC",

	// Application metadata
	applicationName: "Local ByteRover Directory",
	generator: "Next.js",
	category: "Business Directory",

	// Referrer policy
	referrer: "origin-when-cross-origin",

	// Robots configuration
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},

	// Open Graph
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://local.byronwade.com",
		siteName: "Local ByteRover Directory",
		title: "Local ByteRover Directory - Your Community Business Hub",
		description: "Discover amazing local businesses, events, and connect with your community. Your comprehensive guide to everything local.",
		images: [
			{
				url: "https://local.byronwade.com/images/og-default.jpg",
				width: 1200,
				height: 630,
				alt: "Local ByteRover Directory - Community Business Hub",
				type: "image/jpeg",
			},
			{
				url: "https://local.byronwade.com/images/og-logo.jpg",
				width: 800,
				height: 600,
				alt: "Local ByteRover Directory Logo",
				type: "image/jpeg",
			},
		],
	},

	// Twitter
	twitter: {
		card: "summary_large_image",
		site: "@byronwade",
		creator: "@byronwade",
		title: "Local ByteRover Directory - Your Community Business Hub",
		description: "Discover amazing local businesses, events, and connect with your community.",
		images: [
			{
				url: "https://local.byronwade.com/images/twitter-card.jpg",
				alt: "Local ByteRover Directory - Community Business Hub",
			},
		],
	},

	// Icons
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
		],
		apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
		shortcut: "/favicon.ico",
	},

	// Manifest
	manifest: "/manifest.json",

	// Alternates
	alternates: {
		canonical: "https://local.byronwade.com",
		types: {
			"application/rss+xml": [{ url: "https://local.byronwade.com/rss.xml", title: "Local ByteRover Directory RSS Feed" }],
		},
	},

	// Verification
	verification: {
		google: process.env.GOOGLE_VERIFICATION_CODE,
		bing: process.env.BING_VERIFICATION_CODE,
		yandex: process.env.YANDEX_VERIFICATION_CODE,
	},

	// Other meta tags
	other: {
		// Performance and mobile optimization
		"theme-color": "#000000",
		"msapplication-TileColor": "#000000",
		"msapplication-config": "/browserconfig.xml",
		"apple-mobile-web-app-capable": "yes",
		"apple-mobile-web-app-status-bar-style": "default",
		"apple-mobile-web-app-title": "Local Directory",
		"format-detection": "telephone=no",

		// Social media optimization
		"fb:app_id": process.env.FACEBOOK_APP_ID,
		"twitter:domain": "local.byronwade.com",

		// SEO optimization
		rating: "general",
		distribution: "global",
		"revisit-after": "7 days",
		language: "English",
		"geo.region": "US",
		"geo.placename": "United States",

		// Security headers
		"X-UA-Compatible": "IE=edge",
		"Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://www.google-analytics.com https://vitals.vercel-analytics.com;",

		// Performance hints
		"dns-prefetch": "https://fonts.googleapis.com",
		preconnect: "https://fonts.gstatic.com",
	},
};

export const viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	userScalable: true,
	viewportFit: "cover",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#000000" },
	],
};
