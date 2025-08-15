import React, { createContext, useContext } from "react";

const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
	return <BusinessContext.Provider>{children}</BusinessContext.Provider>;
};

export const usePro = () => {
	return useContext(BusinessContext);
};
