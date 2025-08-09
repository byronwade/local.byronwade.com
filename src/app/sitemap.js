import { headers } from "next/headers";

export default async function sitemap() {
	const headersList = headers();
	let domain = headersList.get("host");

	if (domain === "localhost:3000" || domain.endsWith(".vercel.app")) {
		console.log(domain);
	}

  const paths = [
		"/",
		"/industries",
		"/academy-learning-platform",
		"/admin-operations-console",
		"/agriculture-management-software",
		"/automotive-shop-software",
		"/beauty-salon-software",
		"/business-management-platform",
		"/construction-management-software",
		"/ecommerce-operations-platform",
		"/energy-services-software",
		"/field-management-software",
		"/fitness-studio-software",
		"/healthcare-operations-platform",
		"/hospitality-operations-platform",
		"/localhub-marketplace-platform",
		"/logistics-operations-platform",
		"/nonprofit-operations-platform",
		"/professional-services-platform",
		"/property-management-platform",
		"/real-estate-operations-platform",
		"/retail-operations-platform",
  ];

  return paths.map((p) => ({ url: `https://${domain}${p}`, lastModified: new Date() }));
}
