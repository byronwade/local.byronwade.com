"use client";
import Header from "@components/site/Header";
import Footer from "@components/site/Footer";

export default function DashboardRootLayout({ children }) {
	return (
		<>
			<Header />
			<>{children}</>
			<Footer />
		</>
	);
}
