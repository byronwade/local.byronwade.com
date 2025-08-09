import Header from "@components/site/header";
import Footer from "@components/site/footer";
import { evaluateAllFlags } from "@lib/flags/server";
import { cookies } from "next/headers";
import DevToolsClient from "@components/debug/DevToolsClient";
import WebVitalsClient from "@components/debug/WebVitalsClient";
import WDYRClient from "@components/debug/WDYRClient";
import ProfilerToggle from "@components/debug/ProfilerToggle";

/**
 * DashboardRootLayout is a layout component that includes a header, footer, and the main content.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The main content to be displayed between the header and footer.
 * @returns {JSX.Element} The complete layout with header, footer, and children components.
 */
function DevLinks() {
	if (process.env.NODE_ENV === "production") return null;

	const routes = [
		// Core site pages
		"/",
		"/about-us",
		"/accessibility-statement",
		"/ad-choices",
		"/advertise",
		"/affiliates",
		"/blog",
		"/blog/article",
		"/blog/example-post", // from /blog/[slug]
		"/biz/example-biz", // from /biz/[slug]
		"/business",
		"/business-certification",
		"/business-story-videos",
		"/business-success-stories",
		"/business-support",
		"/careers",
		"/case-studies/wades-plumbing-and-septic",
		"/categories",
		"/categories/all",
		"/categories/plumbing", // from /categories/[category]
		"/challenges",
		"/changelog",
		"/community-guidelines",
		"/content-guidelines",
		"/contact-support",
		"/developers",
		"/events",
		"/explore-business",
		"/faq",
		"/help-center",
		"/how-it-works",
		"/certified",
		"/certified/biz",
		"/industries",
		"/investor-relations",
		"/learn",
		"/learn/example-course", // from /learn/[courseId]
		"/live-streaming",
		"/localhub",
		"/mobile",
		"/neighborhoods",
		"/news",
		"/partners",
		"/press",
		"/privacy",
		"/restaurant-owners",
		"/rss",
		"/search",
		"/shorts",
		"/support",
		"/table-management",
		"/terms",
		"/trust-safety",

		// Landing pages
		"/academy-learning-platform",
		"/admin-operations-console",
		"/agriculture-management-software",
		"/automotive-shop-software",
		"/beauty-salon-software",
		"/booking-alternative",
		"/bark-alternative",
		"/yelp-alternative",
		"/angies-list-alternative",
		"/expedia-alternative",
		"/google-business-alternative",
		"/ecommerce-operations-platform",
		"/energy-services-software",
		"/construction-management-software",
		"/fitness-studio-software",
		"/field-management-software",
		"/healthcare-operations-platform",
		"/hospitality-operations-platform",
		"/localhub-marketplace-platform",
		"/logistics-operations-platform",
		"/nonprofit-operations-platform",
		"/professional-services-platform",
		"/property-management-platform",
		"/real-estate-operations-platform",
		"/retail-operations-platform",
		"/transparency",
		"/tripadvisor-alternative",
		"/yellow-pages-alternative",

		// Jobs app
		"/jobs",
		"/jobs/1", // from /jobs/[jobId]
		"/jobs/post",
		"/reviews", // (jobs-app)/reviews
		"/salary", // (jobs-app)/salary

		// LinkedIn clone
		"/network",
		"/network/messages",
		"/network/manage",
		"/profile/example-user", // from /profile/[userId]

		// Auth forms
		"/login",
		"/login-demo",
		"/signup",
		"/password-reset",
		"/otp",
		"/onboarding",
		"/onboarding/business-setup",
		"/unauthorized",
		"/report",
		"/contact",
		"/claim-a-business",
		"/add-a-business",
		"/email-verified",

		// Dashboards (root)
		"/dashboard",

		// User dashboard
		"/dashboard/user",
		"/dashboard/user/settings",
		"/dashboard/user/support",
		"/dashboard/user/reviews",
		"/dashboard/user/reviews/create",
		"/dashboard/user/billing",
		"/dashboard/user/activity",
		"/dashboard/user/jobs",
		"/dashboard/user/jobs/create",

		// Business dashboard
		"/dashboard/business",
		"/dashboard/business/profile",
		"/dashboard/business/settings",
		"/dashboard/business/ads",
		"/dashboard/business/ads/create",

		// Admin dashboard
		"/dashboard/admin",
		"/dashboard/admin/users",
		"/dashboard/admin/customers",
		"/dashboard/admin/billing",
		"/dashboard/admin/reports",
		"/dashboard/admin/support",
		"/dashboard/admin/settings",
		"/dashboard/admin/pro-accounts",

		// Localhub dashboard
		"/dashboard/localhub",
		"/dashboard/localhub/settings",
		"/dashboard/localhub/support",
		"/dashboard/localhub/analytics",
		"/dashboard/localhub/businesses",
		"/dashboard/localhub/customization",
		"/dashboard/localhub/domains",
		"/dashboard/localhub/directories",
		"/dashboard/localhub/create-directory",

		// Academy dashboard
		"/dashboard/academy",
		"/dashboard/academy/courses",

		// Vertical dashboards
		"/dashboard/logistics",
		"/dashboard/construction",
		"/dashboard/property-management",

		// Field management (high-value sections)
		"/dashboard/field-management/analytics",
		"/dashboard/field-management/analytics/dashboard",
		"/dashboard/field-management/analytics/forecasting-predictive",
		"/dashboard/field-management/jobs",
		"/dashboard/field-management/jobs/list",
		"/dashboard/field-management/jobs/scheduling",
		"/dashboard/field-management/jobs/tracking",
		"/dashboard/field-management/communication/inbox",
		"/dashboard/field-management/communication/calls",
		"/dashboard/field-management/automation",
		"/dashboard/field-management/automation/review-requests",
		"/dashboard/field-management/companies",
		"/dashboard/field-management/billing",
		"/dashboard/field-management/performance",
		"/dashboard/field-management/performance/scorecards",
		"/dashboard/field-management/employees",
	];

	return (
		<div id="dev-route-index" className="w-full border-t border-dashed border-yellow-300 bg-yellow-50 text-yellow-900 dark:bg-yellow-900/10 dark:text-yellow-200">
			<div className="container mx-auto px-4 py-4">
				<div className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-80">Dev Route Index</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
					{routes.map((href) => (
						<a key={href} href={href} className="text-sm hover:underline break-all">
							{href}
						</a>
					))}
				</div>
			</div>
		</div>
	);
}

export default async function DashboardRootLayout({ children }) {
	const ff = await evaluateAllFlags();
	// Apply dev-only cookie overrides to SSR flags so client toggles are SEO-safe
	let overridden = { ...ff };
	if (process.env.NODE_ENV !== "production") {
		try {
			const raw = cookies().get("dev_flag_overrides")?.value;
			if (raw) {
				const parsed = JSON.parse(decodeURIComponent(raw));
				if (parsed && typeof parsed === "object") {
					for (const [k, v] of Object.entries(parsed)) {
						if (typeof v === "boolean" && k in overridden) {
							overridden[k] = v;
						}
					}
				}
			}
		} catch {}
	}
	return (
		<div
			data-flags={JSON.stringify(overridden)}
			data-flag-new-navigation={overridden.newNavigation ? "1" : "0"}
			data-flag-linkedin-clone={overridden.linkedinClone ? "1" : "0"}
			data-flag-jobs-app={overridden.jobsApp ? "1" : "0"}
			data-flag-affiliates={overridden.affiliates ? "1" : "0"}
			data-flag-landing-pages={overridden.landingPages ? "1" : "0"}
			data-flag-business-certification={overridden.businessCertification ? "1" : "0"}
			data-flag-investor-relations={overridden.investorRelations ? "1" : "0"}
			data-flag-about-us={overridden.aboutUs ? "1" : "0"}
		>
			<Header />
			<ProfilerToggle>{children}</ProfilerToggle>
			<Footer />
			<DevLinks />
			{process.env.NODE_ENV !== "production" && (
				<>
					<WDYRClient />
					<WebVitalsClient />
					<DevToolsClient />
				</>
			)}
		</div>
	);
}
