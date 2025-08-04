import { headers } from "next/headers";

export default async function sitemap() {
	const headersList = headers();
	let domain = headersList.get("host");

	if (domain === "localhost:3000" || domain.endsWith(".vercel.app")) {
		console.log(domain);
	}

	return [
		{
			url: `https://${domain}`,
			lastModified: new Date(),
		},
	];
}
