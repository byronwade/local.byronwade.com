import { headers } from "next/headers";

export default function robots() {
	const headersList = headers();
	let domain = headersList.get("host");

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
			},
		],
		sitemap: `https://${domain}/sitemap.xml`,
	};
}
