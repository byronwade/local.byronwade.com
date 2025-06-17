import React from "react";
import { faker } from "@faker-js/faker";

// This matches the business generation function from the business profile page
const generateBusinessData = (id) => {
	faker.seed(parseInt(id) * 1000);

	const businessTypes = [
		{ name: "Restaurant", categories: ["Italian", "Pizza", "Fine Dining"], services: ["Dine-in", "Takeout", "Delivery", "Catering"] },
		{ name: "Auto Repair", categories: ["Automotive", "Oil Change", "Brake Service"], services: ["Oil Change", "Brake Repair", "Engine Diagnostics", "Tire Service"] },
		{ name: "Hair Salon", categories: ["Beauty", "Hair Care", "Styling"], services: ["Haircuts", "Coloring", "Styling", "Extensions"] },
		{ name: "Dental Office", categories: ["Healthcare", "Dentistry", "Oral Care"], services: ["Cleanings", "Fillings", "Crowns", "Orthodontics"] },
		{ name: "Coffee Shop", categories: ["Cafe", "Coffee", "Bakery"], services: ["Espresso", "Pastries", "WiFi", "Meeting Space"] },
		{ name: "Plumbing", categories: ["Home Services", "Plumbing", "Repair"], services: ["Emergency Repair", "Installation", "Maintenance", "Inspection"] },
	];

	const businessType = businessTypes[parseInt(id) % businessTypes.length];
	const businessName = `${faker.company.name()} ${businessType.name}`;

	const slug = businessName
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.trim();

	return {
		id: id,
		slug: slug,
		name: businessName,
		type: businessType.name,
		categories: businessType.categories,
	};
};

export default function TestSlugs() {
	// Generate first 20 businesses to show examples
	const businesses = Array.from({ length: 20 }, (_, i) => generateBusinessData((i + 1).toString()));

	return (
		<div className="min-h-screen bg-gray-50 py-12">
			<div className="max-w-4xl mx-auto px-6">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">Available Business URLs</h1>
				<p className="text-gray-600 mb-8">Here are example business names and their corresponding URL slugs. You can visit any of these URLs to see the business profile:</p>

				<div className="bg-white rounded-lg shadow-lg overflow-hidden">
					<div className="px-6 py-4 bg-gray-100 border-b">
						<h2 className="text-lg font-semibold text-gray-800">Business Directory URLs</h2>
					</div>

					<div className="divide-y divide-gray-200">
						{businesses.map((business) => (
							<div key={business.id} className="px-6 py-4 hover:bg-gray-50">
								<div className="flex items-center justify-between">
									<div>
										<h3 className="font-semibold text-gray-900">{business.name}</h3>
										<p className="text-sm text-gray-600">{business.categories.join(" • ")}</p>
									</div>
									<div className="text-right">
										<a href={`/biz/${business.slug}`} className="text-blue-600 hover:text-blue-800 hover:underline font-mono text-sm" target="_blank" rel="noopener noreferrer">
											/biz/{business.slug}
										</a>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="mt-8 p-6 bg-blue-50 rounded-lg">
					<h3 className="font-semibold text-blue-900 mb-2">Examples to Try:</h3>
					<div className="space-y-1">
						{businesses.slice(0, 5).map((business) => (
							<div key={business.id}>
								<a href={`/biz/${business.slug}`} className="text-blue-600 hover:text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">
									http://localhost:3000/biz/{business.slug}
								</a>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
