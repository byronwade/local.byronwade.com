// context/NotificationContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { fakeNotifications } from "@/lib/fakeData";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchNotifications = async () => {
			setLoading(true);
			if (process.env.NEXT_PUBLIC_USE_FAKE_DATA === "true") {
				setNotifications(fakeNotifications);
				setLoading(false);
				return;
			}
			// Fetch data from Supabase or any other API
			setLoading(false);
		};
		fetchNotifications();
	}, []);

	return <NotificationContext.Provider value={{ notifications, loading, error }}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
	return useContext(NotificationContext);
};
