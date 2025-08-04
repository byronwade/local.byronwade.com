"use client";
import Header from "@components/site/Header";
import Footer from "@components/site/Footer";

/**
 * DashboardRootLayout is a layout component that includes a header, footer, and the main content.
 * 
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The main content to be displayed between the header and footer.
 * @returns {JSX.Element} The complete layout with header, footer, and children components.
 */
export default function DashboardRootLayout({ children }) {
	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	);
}
