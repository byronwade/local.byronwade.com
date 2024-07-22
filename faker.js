const { faker } = require("@faker-js/faker");
const fs = require("fs");
const path = require("path");

const cities = [
	{ name: "San Francisco", coordinates: [37.7749, -122.4194] },
	{ name: "Los Angeles", coordinates: [34.0522, -118.2437] },
	{ name: "New York", coordinates: [40.7128, -74.006] },
	{ name: "Chicago", coordinates: [41.8781, -87.6298] },
	{ name: "Houston", coordinates: [29.7604, -95.3698] },
];

const generateRandomPriceLevel = () => {
	const levels = ["$", "$$", "$$$", "$$$$"];
	return levels[Math.floor(Math.random() * levels.length)];
};

const generateUniqueName = (existingNames) => {
	let name;
	do {
		name = faker.company.name();
	} while (existingNames.has(name));
	existingNames.add(name);
	return name;
};

const generateBusinesses = (num = 1000) => {
	const businesses = [];
	const existingNames = new Set();

	for (let i = 0; i < num; i++) {
		const city = faker.helpers.arrayElement(cities);
		const [lat, lng] = faker.location.nearbyGPSCoordinate({
			origin: city.coordinates,
			radius: 50, // 50 miles radius
			isMetric: false,
		});

		const business = {
			id: i + 1,
			name: generateUniqueName(existingNames),
			categories: [faker.commerce.department(), faker.commerce.department()],
			price: generateRandomPriceLevel(),
			deal: `${faker.finance.amount({ min: 1, max: 1000, dec: 0 })}% off`,
			description: faker.lorem.sentence(),
			logo: faker.image.avatarGitHub(),
			isOpenNow: faker.datatype.boolean(),
			reviewsCount: faker.number.int({ min: 10, max: 10000 }),
			statusMessage: faker.lorem.sentence(),
			isSponsored: faker.datatype.boolean(),
			address: faker.location.streetAddress({ useFullAddress: true }),
			phone: faker.phone.number(),
			ratings: {
				overall: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
				totalReviews: faker.number.int({ min: 10, max: 10000 }),
				5: faker.number.int({ min: 10, max: 10000 }),
				4: faker.number.int({ min: 10, max: 10000 }),
				3: faker.number.int({ min: 10, max: 10000 }),
				2: faker.number.int({ min: 10, max: 10000 }),
				1: faker.number.int({ min: 10, max: 10000 }),
			},
			image: faker.image.urlPlaceholder(),
			images: [faker.image.urlPlaceholder(), faker.image.urlPlaceholder(), faker.image.urlPlaceholder()],
			serviceArea: {
				type: "radius",
				value: faker.number.int({ min: 5, max: 50 }),
			},
			reviews: [
				{
					reviewerName: faker.person.firstName(),
					date: faker.date.past().toISOString().split("T")[0],
					text: faker.lorem.sentence(),
					rating: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
				},
				{
					reviewerName: faker.person.firstName(),
					date: faker.date.past().toISOString().split("T")[0],
					text: faker.lorem.sentence(),
					rating: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
				},
			],
			hours: [
				{ day: "Monday", open: "10:00 AM", close: "6:00 PM" },
				{ day: "Tuesday", open: "10:00 AM", close: "6:00 PM" },
				{ day: "Wednesday", open: "10:00 AM", close: "6:00 PM" },
				{ day: "Thursday", open: "10:00 AM", close: "6:00 PM" },
				{ day: "Friday", open: "10:00 AM", close: "6:00 PM" },
				{ day: "Saturday", open: "10:00 AM", close: "6:00 PM" },
				{ day: "Sunday", open: "Closed", close: "Closed" },
			],
			plusCode: faker.location.zipCode(),
			coordinates: {
				lat: parseFloat(lat.toFixed(5)),
				lng: parseFloat(lng.toFixed(5)),
			},
		};
		businesses.push(business);
	}

	return businesses;
};

const businesses = generateBusinesses();

const businessesFilePath = path.join(process.cwd(), "businesses.json");
fs.writeFileSync(businessesFilePath, JSON.stringify({ businesses }, null, 2));
console.log(`Generated ${businesses.length} businesses`);
