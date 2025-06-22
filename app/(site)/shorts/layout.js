import ShortsLayoutClient from "./ShortsLayoutClient";

/**
 * Custom layout for the shorts page that completely hides the default header and footer.
 * This allows the shorts page to have its own custom header and full-screen video experience.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The shorts page content.
 * @returns {JSX.Element} The shorts page layout without any default site elements.
 */
export const metadata = {
	title: "Business Shorts - Thorbis",
	description: "Discover local businesses through short-form videos. Watch business tips, behind-the-scenes content, and local business stories.",
	robots: "index, follow",
};

export const viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export default function ShortsLayout({ children }) {
	return <ShortsLayoutClient>{children}</ShortsLayoutClient>;
}
