/**
 * Structured Data (JSON-LD) Utilities
 * Generates schema.org compliant structured data for enhanced SEO
 */

/**
 * Base organization schema
 */
export function generateOrganizationSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Thorbis",
		description: "Local business directory and community platform",
		url: "https://thorbis.com",
		logo: {
			"@type": "ImageObject",
			url: "https://thorbis.com/logos/ThorbisLogo.webp",
			width: 512,
			height: 512,
		},
		founder: {
			"@type": "Organization",
			name: "ByteRover LLC",
		},
		foundingDate: "2024",
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "customer service",
			email: "hello@thorbis.com",
		},
		sameAs: [
			"https://twitter.com/thorbis",
			"https://facebook.com/thorbis",
			"https://linkedin.com/company/thorbis",
		],
	};
}

/**
 * Website schema
 */
export function generateWebsiteSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Thorbis",
		description: "Discover local businesses and community resources",
		url: "https://thorbis.com",
		publisher: {
			"@type": "Organization",
			name: "ByteRover LLC",
		},
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: "https://thorbis.com/search?q={search_term_string}",
			},
			"query-input": "required name=search_term_string",
		},
	};
}

/**
 * Business directory schema
 */
export function generateBusinessDirectorySchema() {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": "https://thorbis.com/#website",
		name: "Thorbis Business Directory",
		description: "Comprehensive local business directory with verified reviews and ratings",
		url: "https://thorbis.com",
		mainEntity: {
			"@type": "ItemList",
			name: "Local Business Directory",
			description: "Curated list of local businesses with reviews and ratings",
			url: "https://thorbis.com/businesses",
		},
	};
}

/**
 * Local business schema
 */
export function generateLocalBusinessSchema(business) {
	const schema = {
		"@context": "https://schema.org",
		"@type": business.businessType || "LocalBusiness",
		"@id": `https://thorbis.com/business/${business.slug}#business`,
		name: business.name,
		description: business.description,
		url: business.website || `https://thorbis.com/business/${business.slug}`,
		image: business.photos?.map(photo => ({
			"@type": "ImageObject",
			url: photo.url,
			caption: photo.caption || business.name,
		})) || [],
		address: {
			"@type": "PostalAddress",
			streetAddress: business.address,
			addressLocality: business.city,
			addressRegion: business.state,
			postalCode: business.zipCode,
			addressCountry: "US",
		},
		telephone: business.phone,
		email: business.email,
		priceRange: business.priceRange,
	};

	// Add geo coordinates if available
	if (business.latitude && business.longitude) {
		schema.geo = {
			"@type": "GeoCoordinates",
			latitude: business.latitude,
			longitude: business.longitude,
		};
	}

	// Add operating hours if available
	if (business.hours) {
		schema.openingHoursSpecification = Object.entries(business.hours).map(([day, hours]) => ({
			"@type": "OpeningHoursSpecification",
			dayOfWeek: `https://schema.org/${day.charAt(0).toUpperCase() + day.slice(1)}`,
			opens: hours.open,
			closes: hours.close,
		}));
	}

	// Add aggregate rating if available
	if (business.rating && business.reviewCount > 0) {
		schema.aggregateRating = {
			"@type": "AggregateRating",
			ratingValue: business.rating,
			reviewCount: business.reviewCount,
			bestRating: 5,
			worstRating: 1,
		};
	}

	// Add reviews if available
	if (business.reviews && business.reviews.length > 0) {
		schema.review = business.reviews.map(review => ({
			"@type": "Review",
			"@id": `https://thorbis.com/business/${business.slug}#review-${review.id}`,
			author: {
				"@type": "Person",
				name: review.user?.name || "Anonymous",
			},
			reviewRating: {
				"@type": "Rating",
				ratingValue: review.rating,
				bestRating: 5,
				worstRating: 1,
			},
			reviewBody: review.text,
			datePublished: review.createdAt,
		}));
	}

	return schema;
}

/**
 * Product schema for business services
 */
export function generateServiceSchema(service, business) {
	return {
		"@context": "https://schema.org",
		"@type": "Service",
		name: service.name,
		description: service.description,
		provider: {
			"@type": "LocalBusiness",
			name: business.name,
			url: `https://thorbis.com/business/${business.slug}`,
		},
		areaServed: {
			"@type": "Place",
			name: `${business.city}, ${business.state}`,
		},
		offers: {
			"@type": "Offer",
			price: service.price,
			priceCurrency: "USD",
			availability: "https://schema.org/InStock",
		},
	};
}

/**
 * FAQ schema
 */
export function generateFAQSchema(faqs) {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map(faq => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer,
			},
		})),
	};
}

/**
 * Article schema for blog posts
 */
export function generateArticleSchema(article) {
	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: article.title,
		description: article.description,
		image: article.image || "https://thorbis.com/logos/ThorbisLogo.webp",
		author: {
			"@type": "Person",
			name: article.author || "Thorbis Team",
		},
		publisher: {
			"@type": "Organization",
			name: "Thorbis",
			logo: {
				"@type": "ImageObject",
				url: "https://thorbis.com/logos/ThorbisLogo.webp",
			},
		},
		datePublished: article.publishedDate,
		dateModified: article.modifiedDate || article.publishedDate,
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `https://thorbis.com/blog/${article.slug}`,
		},
	};
}

/**
 * BreadcrumbList schema
 */
export function generateBreadcrumbSchema(breadcrumbs) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: breadcrumbs.map((crumb, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: crumb.name,
			item: `https://thorbis.com${crumb.path}`,
		})),
	};
}

/**
 * Event schema
 */
export function generateEventSchema(event) {
	return {
		"@context": "https://schema.org",
		"@type": "Event",
		name: event.name,
		description: event.description,
		startDate: event.startDate,
		endDate: event.endDate,
		location: {
			"@type": "Place",
			name: event.venue,
			address: {
				"@type": "PostalAddress",
				streetAddress: event.address,
				addressLocality: event.city,
				addressRegion: event.state,
				postalCode: event.zipCode,
			},
		},
		organizer: {
			"@type": "Organization",
			name: event.organizer,
		},
		offers: event.ticketPrice ? {
			"@type": "Offer",
			price: event.ticketPrice,
			priceCurrency: "USD",
			url: event.ticketUrl,
		} : undefined,
	};
}

/**
 * Generate combined schema for a page
 */
export function generatePageSchema({ type, data, breadcrumbs }) {
	const schemas = [
		generateOrganizationSchema(),
		generateWebsiteSchema(),
	];

	// Add page-specific schemas
	switch (type) {
		case "business":
			schemas.push(generateLocalBusinessSchema(data));
			break;
		case "article":
			schemas.push(generateArticleSchema(data));
			break;
		case "event":
			schemas.push(generateEventSchema(data));
			break;
		case "directory":
			schemas.push(generateBusinessDirectorySchema());
			break;
		case "faq":
			schemas.push(generateFAQSchema(data));
			break;
	}

	// Add breadcrumb schema if provided
	if (breadcrumbs && breadcrumbs.length > 0) {
		schemas.push(generateBreadcrumbSchema(breadcrumbs));
	}

	return schemas;
}

/**
 * Utility to render JSON-LD script tag
 */
export function renderJsonLd(schema) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(schema, null, 2),
			}}
		/>
	);
}
