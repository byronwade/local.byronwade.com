export const metadata = {
  title: "Explore Local Businesses – Directory & Solutions | Thorbis",
  description:
    "Discover local businesses by category and location. Explore solutions like premium listings, reviews, analytics, and lead generation.",
  keywords: [
    "explore businesses",
    "local directory",
    "business solutions",
    "reviews",
    "lead generation",
  ],
  openGraph: {
    title: "Explore Local Businesses – Thorbis",
    description: "Browse local businesses and growth solutions.",
    url: "https://thorbis.com/explore-business",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Local Businesses – Thorbis",
    description: "Discover local businesses and growth solutions.",
  },
  alternates: { canonical: "https://thorbis.com/explore-business" },
};

import ExploreBusinessContent from "@components/site/explore/ExploreBusinessContent";

export default function ExploreBusinessPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Explore Local Businesses",
    description:
      "Discover and explore local businesses across various categories and locations",
    url: "https://thorbis.com/explore-business",
    mainEntity: {
      "@type": "ItemList",
      name: "Local Business Directory",
      description:
        "Comprehensive directory of local businesses with reviews and contact information",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@id": "https://thorbis.com",
            name: "Thorbis",
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@id": "https://thorbis.com/explore-business",
            name: "Explore Businesses",
          },
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ExploreBusinessContent />
    </>
  );
}
