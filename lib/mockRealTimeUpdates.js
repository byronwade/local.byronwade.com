// lib/mockRealTimeUpdates.js
import businessesData from "./businesses.json";

export const mockRealTimeUpdates = (updateBusinesses) => {
	const businesses = businessesData.businesses;
	let currentIndex = 0;

	setInterval(() => {
		if (currentIndex < businesses.length) {
			const newBusiness = businesses[currentIndex];
			updateBusinesses((prevBusinesses) => [...prevBusinesses, newBusiness]);
			currentIndex++;
		}
	}, 5000); // Add a new business every 5 seconds
};
