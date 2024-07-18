"use client";

import React, { createContext, useContext } from "react";
import useSWR from "swr";
import axios from "axios";

const UserContext = createContext();

const fetcher = (url) => axios.get(url).then((res) => res.data);

export const UserProvider = ({ children }) => {
	const { data: users, error: usersError } = useSWR("/api/users", fetcher);

	const value = {
		users,
		usersError,
		isLoading: !users && !usersError,
	};

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};
