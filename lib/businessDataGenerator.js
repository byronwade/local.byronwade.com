import { faker } from "@faker-js/faker";

// Business categories with realistic subcategories
const BUSINESS_CATEGORIES = {
	Restaurants: ["Italian Restaurant", "Mexican Restaurant", "Chinese Restaurant", "Japanese Restaurant", "American Restaurant", "Fast Food", "Pizza", "Burger Joint", "Steakhouse", "Seafood Restaurant", "Vegetarian Restaurant", "Breakfast & Brunch", "Cafe", "Diner", "Food Truck"],
	"Health & Medical": ["Dentist", "Family Doctor", "Pediatrician", "Dermatologist", "Optometrist", "Physical Therapy", "Chiropractor", "Urgent Care", "Pharmacy", "Medical Clinic", "Veterinarian", "Mental Health Counselor", "Orthodontist", "Cardiologist"],
	"Home Services": ["Plumber", "Electrician", "HVAC Contractor", "Landscaping", "House Cleaning", "Handyman", "Roofing Contractor", "Painter", "Carpet Cleaning", "Pest Control", "Locksmith", "Moving Company", "Interior Designer", "General Contractor"],
	"Beauty & Spas": ["Hair Salon", "Nail Salon", "Spa", "Barbershop", "Massage Therapy", "Eyebrow Threading", "Tattoo Parlor", "Beauty Supply Store", "Tanning Salon", "Makeup Artist", "Skincare Clinic", "Waxing Salon"],
	Automotive: ["Auto Repair", "Oil Change", "Tire Shop", "Car Wash", "Auto Parts Store", "Car Dealership", "Auto Body Shop", "Transmission Repair", "Brake Service", "Auto Glass Repair", "Towing Service", "Car Rental"],
	Shopping: ["Grocery Store", "Clothing Store", "Electronics Store", "Bookstore", "Jewelry Store", "Sporting Goods", "Pet Store", "Furniture Store", "Hardware Store", "Pharmacy", "Gift Shop", "Toy Store", "Music Store", "Antique Shop"],
	"Professional Services": ["Lawyer", "Accountant", "Real Estate Agent", "Insurance Agent", "Financial Advisor", "Marketing Agency", "Web Design", "Consulting", "Photography", "Event Planning", "Translation Services", "Notary Public", "Tax Preparation"],
	Entertainment: ["Movie Theater", "Bowling Alley", "Arcade", "Mini Golf", "Karaoke Bar", "Comedy Club", "Live Music Venue", "Dance Studio", "Art Gallery", "Museum", "Escape Room", "Amusement Park"],
	"Fitness & Recreation": ["Gym", "Yoga Studio", "Personal Trainer", "Swimming Pool", "Tennis Court", "Golf Course", "Martial Arts", "Dance Classes", "Rock Climbing", "Bike Shop", "Sports Club", "Recreation Center"],
	Education: ["Tutoring", "Music Lessons", "Driving School", "Language School", "Art Classes", "Computer Training", "Daycare", "Preschool", "After School Program", "Library"],
};

// Major US cities with coordinates for realistic distribution
const US_CITIES = [
	{ name: "New York", state: "NY", lat: 40.7128, lng: -74.006, population: 8400000 },
	{ name: "Los Angeles", state: "CA", lat: 34.0522, lng: -118.2437, population: 3900000 },
	{ name: "Chicago", state: "IL", lat: 41.8781, lng: -87.6298, population: 2700000 },
	{ name: "Houston", state: "TX", lat: 29.7604, lng: -95.3698, population: 2300000 },
	{ name: "Phoenix", state: "AZ", lat: 33.4484, lng: -112.074, population: 1600000 },
	{ name: "Philadelphia", state: "PA", lat: 39.9526, lng: -75.1652, population: 1500000 },
	{ name: "San Antonio", state: "TX", lat: 29.4241, lng: -98.4936, population: 1500000 },
	{ name: "San Diego", state: "CA", lat: 32.7157, lng: -117.1611, population: 1400000 },
	{ name: "Dallas", state: "TX", lat: 32.7767, lng: -96.797, population: 1300000 },
	{ name: "San Jose", state: "CA", lat: 37.3382, lng: -121.8863, population: 1000000 },
	{ name: "Austin", state: "TX", lat: 30.2672, lng: -97.7431, population: 950000 },
	{ name: "Jacksonville", state: "FL", lat: 30.3322, lng: -81.6557, population: 900000 },
	{ name: "Fort Worth", state: "TX", lat: 32.7555, lng: -97.3308, population: 900000 },
	{ name: "Columbus", state: "OH", lat: 39.9612, lng: -82.9988, population: 880000 },
	{ name: "San Francisco", state: "CA", lat: 37.7749, lng: -122.4194, population: 870000 },
	{ name: "Charlotte", state: "NC", lat: 35.2271, lng: -80.8431, population: 850000 },
	{ name: "Indianapolis", state: "IN", lat: 39.7684, lng: -86.1581, population: 850000 },
	{ name: "Seattle", state: "WA", lat: 47.6062, lng: -122.3321, population: 750000 },
	{ name: "Denver", state: "CO", lat: 39.7392, lng: -104.9903, population: 715000 },
	{ name: "Boston", state: "MA", lat: 42.3601, lng: -71.0589, population: 685000 },
	{ name: "Nashville", state: "TN", lat: 36.1627, lng: -86.7816, population: 670000 },
	{ name: "Baltimore", state: "MD", lat: 39.2904, lng: -76.6122, population: 620000 },
	{ name: "Portland", state: "OR", lat: 45.5152, lng: -122.6784, population: 650000 },
	{ name: "Las Vegas", state: "NV", lat: 36.1699, lng: -115.1398, population: 640000 },
	{ name: "Detroit", state: "MI", lat: 42.3314, lng: -83.0458, population: 670000 },
	{ name: "Memphis", state: "TN", lat: 35.1495, lng: -90.049, population: 650000 },
	{ name: "Louisville", state: "KY", lat: 38.2527, lng: -85.7585, population: 620000 },
	{ name: "Milwaukee", state: "WI", lat: 43.0389, lng: -87.9065, population: 590000 },
	{ name: "Albuquerque", state: "NM", lat: 35.0844, lng: -106.6504, population: 560000 },
	{ name: "Tucson", state: "AZ", lat: 32.2226, lng: -110.9747, population: 540000 },
];

// Generate realistic business hours
const generateBusinessHours = () => {
	const schedules = ["Mon-Fri 9AM-5PM", "Mon-Fri 8AM-6PM, Sat 9AM-4PM", "Mon-Sun 7AM-10PM", "Mon-Sat 10AM-9PM, Sun 11AM-7PM", "Mon-Thu 9AM-8PM, Fri-Sat 9AM-9PM, Sun 10AM-6PM", "Mon-Fri 7AM-7PM, Sat-Sun 8AM-6PM", "24/7", "Mon-Fri 6AM-9PM, Sat-Sun 7AM-8PM", "Tue-Sat 10AM-6PM", "Mon-Wed 9AM-6PM, Thu-Fri 9AM-8PM, Sat 10AM-5PM"];
	return faker.helpers.arrayElement(schedules);
};

// Generate realistic price range
const generatePriceRange = (category) => {
	const priceRanges = {
		Restaurants: ["$", "$$", "$$$", "$$$$"],
		"Health & Medical": ["$$", "$$$", "$$$$"],
		"Home Services": ["$$", "$$$"],
		"Beauty & Spas": ["$", "$$", "$$$"],
		Automotive: ["$$", "$$$"],
		Shopping: ["$", "$$", "$$$"],
		"Professional Services": ["$$", "$$$", "$$$$"],
		Entertainment: ["$", "$$"],
		"Fitness & Recreation": ["$", "$$", "$$$"],
		Education: ["$$", "$$$"],
	};

	const ranges = priceRanges[category] || ["$", "$$"];
	return faker.helpers.arrayElement(ranges);
};

// Generate realistic rating based on business type and age
const generateRating = () => {
	// Most businesses have ratings between 3.5-4.8
	const rating = faker.number.float({ min: 2.1, max: 4.9, precision: 0.1 });
	return Math.round(rating * 10) / 10;
};

// Generate realistic review count based on business age and type
const generateReviewCount = (rating, isPopular = false) => {
	let baseCount = faker.number.int({ min: 5, max: 500 });

	// Higher rated businesses tend to have more reviews
	if (rating >= 4.5) baseCount *= 1.5;
	if (rating >= 4.0) baseCount *= 1.2;

	// Popular businesses have more reviews
	if (isPopular) baseCount *= 2;

	return Math.floor(baseCount);
};

// Generate realistic business names
const generateBusinessName = (subcategory) => {
	const prefixes = ["The", "Best", "Premier", "Elite", "Golden", "Royal", "Superior", "Quality"];
	const suffixes = ["Co", "LLC", "Inc", "Group", "Services", "Solutions", "Center", "Shop"];

	const nameTypes = [() => `${faker.person.lastName()}'s ${subcategory}`, () => `${faker.location.city()} ${subcategory}`, () => `${faker.helpers.arrayElement(prefixes)} ${subcategory}`, () => `${faker.company.name().split(" ")[0]} ${subcategory}`, () => `${subcategory} ${faker.helpers.arrayElement(suffixes)}`, () => faker.company.name()];

	return faker.helpers.arrayElement(nameTypes)();
};

// Generate business descriptions
const generateBusinessDescription = (subcategory) => {
	const templates = [
		`Professional ${subcategory.toLowerCase()} services with over ${faker.number.int({ min: 5, max: 30 })} years of experience.`,
		`Family-owned ${subcategory.toLowerCase()} serving the community since ${faker.date.between({ from: "1980-01-01", to: "2010-01-01" }).getFullYear()}.`,
		`Top-rated ${subcategory.toLowerCase()} offering quality service and competitive prices.`,
		`Modern ${subcategory.toLowerCase()} with state-of-the-art equipment and friendly staff.`,
		`Locally owned ${subcategory.toLowerCase()} committed to customer satisfaction and excellence.`,
	];

	return faker.helpers.arrayElement(templates);
};

// Generate business photos (placeholder URLs)
const generateBusinessPhotos = () => {
	const photoCount = faker.number.int({ min: 3, max: 12 });
	return Array.from({ length: photoCount }, (_, i) => `https://picsum.photos/800/600?random=${faker.number.int({ min: 1, max: 1000 })}`);
};

// Generate amenities based on category
const generateAmenities = (category) => {
	const amenityMap = {
		Restaurants: ["WiFi", "Outdoor Seating", "Takeout", "Delivery", "Parking", "Wheelchair Accessible"],
		"Health & Medical": ["Parking", "Wheelchair Accessible", "Insurance Accepted", "Online Booking"],
		"Home Services": ["Licensed", "Insured", "Free Estimates", "24/7 Emergency Service"],
		"Beauty & Spas": ["WiFi", "Parking", "Online Booking", "Gift Cards", "Wheelchair Accessible"],
		Automotive: ["Parking", "Waiting Area", "WiFi", "Shuttle Service", "Warranty"],
		Shopping: ["Parking", "WiFi", "Returns Accepted", "Gift Cards", "Wheelchair Accessible"],
		"Professional Services": ["Parking", "WiFi", "Online Consultation", "Free Consultation"],
		Entertainment: ["Parking", "WiFi", "Group Discounts", "Wheelchair Accessible"],
		"Fitness & Recreation": ["Parking", "Locker Rooms", "WiFi", "Personal Training", "Group Classes"],
		Education: ["Parking", "WiFi", "Flexible Scheduling", "Online Classes"],
	};

	const available = amenityMap[category] || ["Parking", "WiFi"];
	const count = faker.number.int({ min: 2, max: available.length });
	return faker.helpers.arrayElements(available, count);
};

// Generate a single business
const generateBusiness = (id, cityData) => {
	const category = faker.helpers.objectKey(BUSINESS_CATEGORIES);
	const subcategory = faker.helpers.arrayElement(BUSINESS_CATEGORIES[category]);
	const rating = generateRating();
	const isSponsored = faker.datatype.boolean({ probability: 0.15 });
	const isPopular = faker.datatype.boolean({ probability: 0.25 });

	// Generate coordinates within city bounds (roughly 20 mile radius)
	const latOffset = faker.number.float({ min: -0.3, max: 0.3 });
	const lngOffset = faker.number.float({ min: -0.3, max: 0.3 });

	const businessName = generateBusinessName(subcategory);
	const phone = faker.phone.number("(###) ###-####");
	const website = `https://${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;

	// Business hours and status
	const hours = generateBusinessHours();
	const isOpenNow = faker.datatype.boolean({ probability: 0.7 });

	return {
		id: id.toString(),
		name: businessName,
		slug: businessName
			.toLowerCase()
			.replace(/[^a-z0-9]/g, "-")
			.replace(/-+/g, "-"),
		description: generateBusinessDescription(subcategory),
		categories: [category, subcategory],
		ratings: {
			overall: rating,
			service: faker.number.float({ min: rating - 0.3, max: rating + 0.2, precision: 0.1 }),
			quality: faker.number.float({ min: rating - 0.2, max: rating + 0.3, precision: 0.1 }),
			value: faker.number.float({ min: rating - 0.4, max: rating + 0.1, precision: 0.1 }),
		},
		reviewCount: generateReviewCount(rating, isPopular),
		address: `${faker.location.streetAddress()}, ${cityData.name}, ${cityData.state} ${faker.location.zipCode()}`,
		phone: phone,
		website: website,
		email: `info@${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
		hours: hours,
		coordinates: {
			lat: cityData.lat + latOffset,
			lng: cityData.lng + lngOffset,
		},
		isOpenNow: isOpenNow,
		price: generatePriceRange(category),
		statusMessage: isOpenNow ? "Open now" : "Closed",
		isSponsored: isSponsored,
		isPopular: isPopular,
		logo: null,
		photos: generateBusinessPhotos(),
		amenities: generateAmenities(category),
		paymentMethods: ["Credit Cards", "Cash", "Mobile Pay"],
		established: faker.date.between({ from: "1950-01-01", to: "2023-01-01" }).getFullYear(),
		verified: faker.datatype.boolean({ probability: 0.8 }),
		claimedByOwner: faker.datatype.boolean({ probability: 0.6 }),
	};
};

// Main function to generate businesses
export const generateBusinesses = (count = 10000) => {
	console.log(`Generating ${count} businesses across America...`);

	const businesses = [];

	for (let i = 1; i <= count; i++) {
		// Distribute businesses across cities based on population
		const cityData = faker.helpers.weightedArrayElement(US_CITIES.map((city) => ({ weight: city.population / 100000, value: city })));

		const business = generateBusiness(i, cityData);
		businesses.push(business);

		// Log progress for large datasets
		if (i % 1000 === 0) {
			console.log(`Generated ${i}/${count} businesses...`);
		}
	}

	console.log(`Successfully generated ${count} businesses!`);
	return businesses;
};

// Generate businesses for a specific location/bounds
export const generateBusinessesInBounds = (bounds, count = 100) => {
	const { north, south, east, west } = bounds;
	const businesses = [];

	for (let i = 1; i <= count; i++) {
		const category = faker.helpers.objectKey(BUSINESS_CATEGORIES);
		const subcategory = faker.helpers.arrayElement(BUSINESS_CATEGORIES[category]);
		const rating = generateRating();

		const business = {
			id: `bounds-${i}`,
			name: generateBusinessName(subcategory),
			categories: [category, subcategory],
			ratings: { overall: rating },
			reviewCount: generateReviewCount(rating),
			coordinates: {
				lat: faker.number.float({ min: south, max: north }),
				lng: faker.number.float({ min: west, max: east }),
			},
			address: faker.location.streetAddress(),
			phone: faker.phone.number("(###) ###-####"),
			isOpenNow: faker.datatype.boolean({ probability: 0.7 }),
			price: generatePriceRange(category),
			isSponsored: faker.datatype.boolean({ probability: 0.15 }),
		};

		businesses.push(business);
	}

	return businesses;
};

// Search businesses by query
export const searchBusinessesByQuery = (businesses, query, location = "") => {
	if (!query && !location) return businesses;

	return businesses.filter((business) => {
		const matchesQuery = !query || business.name.toLowerCase().includes(query.toLowerCase()) || business.categories.some((cat) => cat.toLowerCase().includes(query.toLowerCase())) || business.description?.toLowerCase().includes(query.toLowerCase());

		const matchesLocation = !location || business.address.toLowerCase().includes(location.toLowerCase());

		return matchesQuery && matchesLocation;
	});
};

export default {
	generateBusinesses,
	generateBusinessesInBounds,
	searchBusinessesByQuery,
	US_CITIES,
	BUSINESS_CATEGORIES,
};
