import Script from "next/script";

export const metadata = {
  title: "Thorbis Slideshow (Pre‑Launch) — Concept, Roadmap, and Honest Plans",
  description: "Transparent, pre‑launch overview of Thorbis — our planned all‑in‑one platform to unify customer acquisition, operations, and analytics. No customers yet; all figures shown are goals or scenarios, not promises.",
  keywords: "pre‑launch, business platform roadmap, small business software plans, Thorbis concept, CRM, scheduling, analytics, honest roadmap",
  robots: "noindex, nofollow", // Slideshow is for presentation purposes
  openGraph: {
    title: "Thorbis (Pre‑Launch) Slideshow",
    description: "Honest pre‑launch presentation of our concept and roadmap.",
    type: "website",
    url: "https://thorbis.com/slideshow",
    images: [
      {
        url: "https://thorbis.com/logos/ThorbisLogo.webp",
        width: 1200,
        height: 630,
        alt: "Thorbis Business Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thorbis (Pre‑Launch) Slideshow",
    description: "Transparent concept and roadmap (no marketing fluff).",
    images: ["https://thorbis.com/logos/ThorbisLogo.webp"],
  },
};

export default function SlideshowLayout({ children }) {
  return (
    <>
      <Script id="slideshow-jsonld" type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Thorbis Slideshow (Pre‑Launch)",
            "description": "Transparent pre‑launch overview of the Thorbis concept and roadmap. No customers yet; any figures are scenarios or targets, not results.",
            "creator": {
              "@type": "Organization",
              "name": "Thorbis",
              "url": "https://thorbis.com",
              "logo": "https://thorbis.com/logos/ThorbisLogo.webp"
            },
            "about": {
              "@type": "SoftwareApplication",
              "name": "Thorbis (Pre‑Launch)",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web, iOS, Android",
              "developmentStatus": "Pre‑release",
              "isAccessibleForFree": false
            },
            "dateCreated": "2024-01-01",
            "dateModified": "2025-01-01",
            "inLanguage": "en-US",
            "audience": {
              "@type": "BusinessAudience",
              "audienceType": "Small Business Owners"
            }
          })
        }}
      />
      {children}
    </>
  );
}
