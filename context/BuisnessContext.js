import React, { createContext, useState, useEffect, useContext } from "react";
import { fakeProData } from "@/lib/fakeData";

const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
	const [proData, setProData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProData = async () => {
			setLoading(true);
			if (process.env.NEXT_PUBLIC_USE_FAKE_DATA === "true") {
				setProData(fakeProData);
				setLoading(false);
				return;
			}
			// Fetch data from Supabase or any other API
			// Uncomment and complete the fetching logic here
			// const { data, error } = await fetchDataFromYourAPI();
			// if (error) {
			//   setError(error);
			// } else {
			//   setProData(data);
			// }
			setLoading(false);
		};
		fetchProData();
	}, []);

	return <BusinessContext.Provider value={{ proData, loading, error }}>{children}</BusinessContext.Provider>;
};

export const usePro = () => {
	return useContext(BusinessContext);
};
