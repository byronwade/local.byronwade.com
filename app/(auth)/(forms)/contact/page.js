import ContactUsForm from "@components/site/contact/contact-us-form";
import { Metadata } from "next";

export const metadata = {
	title: "Contact Us - Thorbis",
	description: "Get in touch with the Thorbis team. We're here to help with any questions about our business directory and services.",
	keywords: ["contact", "support", "help", "customer service", "business directory"],
	openGraph: {
		title: "Contact Us - Thorbis",
		description: "Get in touch with the Thorbis team. We're here to help with any questions about our business directory and services.",
		url: "https://thorbis/contact",
		siteName: "Thorbis",
		images: [
			{
				url: "https://thorbis/og-contact.jpg",
				width: 800,
				height: 600,
				alt: "Contact Thorbis",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Contact Us - Thorbis",
		description: "Get in touch with the Thorbis team. We're here to help with any questions about our business directory and services.",
		images: ["https://thorbis/twitter-contact.jpg"],
	},
	alternates: {
		canonical: "https://thorbis/contact",
	},
};

const jsonLdData = {
	"@context": "http://schema.org",
	"@type": "ContactPage",
	url: "https://thorbis/contact",
	name: "Contact Thorbis",
	description: "Get in touch with the Thorbis team for support and inquiries.",
	mainEntity: {
		"@type": "Organization",
		name: "Thorbis",
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "customer service",
			availableLanguage: "English",
		},
	},
};

const ContactUsPage = () => {
	return (
		<>
			<ContactUsForm />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
		</>
	);
};

export default ContactUsPage;
