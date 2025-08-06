/**
 * SEO Page Wrapper - Simplified wrapper for easy page SEO implementation
 * Use this wrapper around your page content for automatic SEO optimization
 *
 * Examples:
 * <SEOPageWrapper type="business" data={businessData} />
 * <SEOPageWrapper type="blog" data={blogPost} />
 * <SEOPageWrapper type="static" title="About Us" description="Learn about our company" />
 */

"use client";

import SmartSEOWrapper from "./SmartSEOWrapper";

export default function SEOPageWrapper({ children, ...props }) {
	return <SmartSEOWrapper {...props}>{children}</SmartSEOWrapper>;
}

/**
 * Pre-configured wrappers for common page types
 */

export function BusinessPageSEO({ business, children }) {
	return (
		<SEOPageWrapper
			type="business"
			data={business}
			breadcrumbs={[
				{ name: "Home", url: "/" },
				{ name: "Businesses", url: "/business" },
				{ name: business.name, url: `/business/${business.slug}` },
			]}
		>
			{children}
		</SEOPageWrapper>
	);
}

export function BlogPageSEO({ article, children }) {
	return (
		<SEOPageWrapper
			type="blog"
			data={article}
			breadcrumbs={[
				{ name: "Home", url: "/" },
				{ name: "Blog", url: "/blog" },
				{ name: article.title, url: `/blog/${article.slug}` },
			]}
		>
			{children}
		</SEOPageWrapper>
	);
}

export function EventPageSEO({ event, children }) {
	return (
		<SEOPageWrapper
			type="event"
			data={event}
			breadcrumbs={[
				{ name: "Home", url: "/" },
				{ name: "Events", url: "/events" },
				{ name: event.title, url: `/events/${event.slug}` },
			]}
		>
			{children}
		</SEOPageWrapper>
	);
}

export function CategoryPageSEO({ category, children }) {
	return (
		<SEOPageWrapper
			type="category"
			data={category}
			breadcrumbs={[
				{ name: "Home", url: "/" },
				{ name: "Categories", url: "/categories" },
				{ name: category.name, url: `/categories/${category.slug}` },
			]}
		>
			{children}
		</SEOPageWrapper>
	);
}

export function StaticPageSEO({ title, description, path, keywords = [], children }) {
	return (
		<SEOPageWrapper
			type="static"
			title={title}
			description={description}
			keywords={keywords}
			breadcrumbs={[
				{ name: "Home", url: "/" },
				{ name: title, url: path },
			]}
		>
			{children}
		</SEOPageWrapper>
	);
}
