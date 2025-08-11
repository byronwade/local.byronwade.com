import { headers } from "next/headers";

export default function robots() {
    const headersList = headers();
	const host = headersList.get("host") || "thorbis.com";
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${host}`;

	// Disallow indexing on preview domains (high-reward, low-risk)
	if (host.endsWith(".vercel.app")) {
		return {
			rules: [
				{
					userAgent: "*",
					disallow: "/",
				},
			],
		};
	}

    return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/", "/__", "/trending", "/*?utm_*", "/*&gclid=*"],
			},
		],
		sitemap: `${siteUrl}/sitemap.xml`,
	};
}
