"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getDictionary, languages } from "@lib/i18n/dictionaries";

const LanguageContext = createContext();

export const useLanguage = () => {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}
	return context;
};

export const LanguageProvider = ({ children, initialLocale = "en" }) => {
	const [locale, setLocale] = useState(initialLocale);
	const [dictionary, setDictionary] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const loadDictionary = async () => {
			setLoading(true);
			try {
				const dict = await getDictionary(locale);
				setDictionary(dict);
			} catch (error) {
				console.error("Error loading dictionary:", error);
				// Fallback to English
				const fallbackDict = await getDictionary("en");
				setDictionary(fallbackDict);
			} finally {
				setLoading(false);
			}
		};

		loadDictionary();
	}, [locale]);

	const changeLanguage = async (newLocale) => {
		if (newLocale === locale) return;

		setLocale(newLocale);

		// Update URL to reflect new locale
		const currentPath = pathname;
		const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}/, "");
		const newPath = newLocale === "en" ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`;

		router.push(newPath);
	};

	const value = {
		locale,
		dictionary,
		loading,
		changeLanguage,
		languages,
	};

	return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
