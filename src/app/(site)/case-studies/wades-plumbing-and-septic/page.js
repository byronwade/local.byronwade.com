import React from "react";

export const metadata = {
	title: "Case Study: Duncan Plumbing Ent., Inc. | Thorbis",
	description: "How Duncan Plumbing Ent., Inc. achieved reliable performance and operational efficiency with a modern data platform.",
	openGraph: {
		title: "Case Study: Duncan Plumbing Ent., Inc. | Thorbis",
		description: "Operational reliability and efficiency improvements highlighted in this case study.",
		url: "https://thorbis.com/case-studies/wades-plumbing-and-septic",
		type: "article",
	},
	twitter: {
		card: "summary_large_image",
		title: "Case Study: Duncan Plumbing Ent., Inc.",
		description: "How Duncan Plumbing improved reliability and efficiency with a modern data platform.",
	},
	alternates: { canonical: "https://thorbis.com/case-studies/wades-plumbing-and-septic" },
};

export default function YelpAlternitive() {
  const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: "Case Study: Duncan Plumbing Ent., Inc.",
		description: "How Duncan Plumbing Ent., Inc. achieved operational reliability and efficiency with a modern data platform.",
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": "https://thorbis.com/case-studies/wades-plumbing-and-septic",
		},
		author: { "@type": "Organization", name: "Thorbis" },
		publisher: {
			"@type": "Organization",
			name: "Thorbis",
			logo: {
				"@type": "ImageObject",
				url: "https://thorbis.com/logos/ThorbisLogo.webp",
			},
		},
		about: {
			"@type": "LocalBusiness",
			name: "Duncan Plumbing Ent., Inc.",
		},
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "Home", item: "https://thorbis.com/" },
				{ "@type": "ListItem", position: 2, name: "Case Studies", item: "https://thorbis.com/business-success-stories" },
				{
					"@type": "ListItem",
					position: 3,
					name: "Duncan Plumbing Ent., Inc.",
					item: "https://thorbis.com/case-studies/wades-plumbing-and-septic",
				},
			],
		},
  };
  // Add basic metadata via static export (page is static only content)
  // Note: Layout/design preserved; only SEO added via JSON-LD would be ideal, but this page lacks head.
  // If needed later, move to metadata export pattern.
  return (
		<main className="relative">
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-secondary">
				<div className="container grid items-center justify-center grid-cols-8 col-span-8 gap-2 py-8 sm:col-span-16 sm:grid-cols-16 sm:gap-3 lg:gap-8 lg:py-14">
					<div className="relative order-last text-center border rounded shadow-xl col-span-full shadow-black/25 lg:col-span-7">
						<img
							alt="MyFitnessPal"
							fetchpriority="high"
							width={720}
							height={480}
							decoding="async"
							data-nimg={1}
							className="relative z-0 w-full h-auto transition rounded opacity-25 grayscale"
							srcSet="/_next/image?url=%2Fassets%2Fcustomers%2Fmyfitnesspal%2Fmyfitnesspal.jpg&w=750&q=75 1x, /_next/image?url=%2Fassets%2Fcustomers%2Fmyfitnesspal%2Fmyfitnesspal.jpg&w=1920&q=75 2x"
							src="/_next/image?url=%2Fassets%2Fcustomers%2Fmyfitnesspal%2Fmyfitnesspal.jpg&w=1920&q=75"
							style={{ color: "transparent" }}
						/>
						<div className="absolute top-[50%] w-full -translate-y-1/2 text-center">
							<img alt="MyFitnessPal" loading="lazy" width={100} height={60} decoding="async" data-nimg={1} className="mx-auto w-fit max-w-[35%] text-primary" src="/assets/customers/myfitnesspal/myfitnesspal-full.svg" style={{ color: "transparent" }} />
						</div>
					</div>
					<div className="order-first space-y-6 col-span-full lg:col-span-9">
						<div className="space-y-3 lg:col-span-7">
							<div className="space-y-3">
								<span className="relative text-sm font-medium text-primary before:absolute before:inset-y-xs before:-left-[16px] before:w-px before:bg-orange-500 sm:before:-left-[25px]">Case study: MyFitnessPal</span>
								<h1 className="text-4xl font-semibold tracking-tight text-primary lg:text-5xl">MyFitnessPal chose PlanetScale so they can focus on their data, not the database</h1>
								<div className="space-y-2 text-base prose max-w-none text-secondary">
									<p>MyFitnessPal is the world’s largest health and nutrition data source. As MyFitnessPal’s data size grew, valuable internal resources were spent working with the database, on the schema, and managing the database servers themselves. Since switching over to PlanetScale Managed, MyFitnessPal is focused on helping their customers meet their health and fitness goals rather than managing the database.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="container grid items-start grid-cols-8 col-span-8 gap-2 py-8 mx-auto sm:col-span-16 sm:grid-cols-16 sm:gap-3 lg:gap-8 lg:py-14">
				<div className="order-last space-y-6 prose prose-invert col-span-full prose-h2:mb-2 prose-h2:text-4xl lg:order-first lg:col-span-9">
					<h2 id="unfulfilled-promises-with-amazon-rds">
						<a href="#unfulfilled-promises-with-amazon-rds">Unfulfilled promises with Amazon RDS</a>
					</h2>
					<blockquote className="mb-1.5 border-0 border-l-2 border-orange px-3 font-light not-italic leading-relaxed text-primary before:!content-none after:!content-none lg:text-lg lg:font-medium [&>*]:mb-1 [&>*]:leading-relaxed">
						<p>Our team wants to focus on helping our customers meet their health and fitness goals, not the database servers.</p>
					</blockquote>
					<p>
						Chris Karper is the VP of Engineering at MyFitnessPal where he manages a team of DevOps experts. He’s been instrumental in configuring their backend infrastructure. Before PlanetScale, MyFitnessPal transitioned from using MySQL servers to clustered Percona servers. As their data size grew, it became increasingly difficult to do maintenance on any single server. At a certain point, Chris had 3 to 4 full-time staff working with the database, the data structure, and managing
						the servers themselves.
					</p>
					<p>As a cloud-centric company, MyFitnessPal moved to Amazon RDS. As many are, they were sold on the idea that this would solve their problem of maintaining the server components. They hired AWS professional services but were disappointed with the support they received from it. To add to this, it was not possible to make changes with zero downtime with RDS, leading to fear and avoidance of doing schema migrations.</p>
					<p>This is where MyFitnessPal signed on with PlanetScale. Under PlanetScale, the fear to make schema changes disappeared. It enabled Chris’s team to focus on “helping their customers meet their health and fitness goals, not the database servers.”</p>
					<div className="mb-3 space-y-md lg:-ml-4">
						<blockquote className="relative mb-2 border-0 pl-0 text-base font-semibold not-italic text-orange before:!content-none after:!content-none md:text-2xl [&>*]:inline">
							<span className="absolute -left-[0.5rem] select-none lg:-left-[0.6rem]">“</span>
							<p>Databases are hard. We would rather PlanetScale manage them.</p>
							<span className="absolute select-none">”</span>
						</blockquote>
					</div>
					<h2 id="making-the-switch-to-planetscale-managed">
						<a href="#making-the-switch-to-planetscale-managed">Making the switch to PlanetScale Managed</a>
					</h2>
					<p>MyFitnessPal found out about PlanetScale through their familiarity with Vitess, the open-source technology that has scaled the world’s largest applications. Chris was originally intrigued by Vitess’s distributed model, which enables MySQL to be more scalable.</p>
					<blockquote className="mb-1.5 border-0 border-l-2 border-orange px-3 font-light not-italic leading-relaxed text-primary before:!content-none after:!content-none lg:text-lg lg:font-medium [&>*]:mb-1 [&>*]:leading-relaxed">
						<p>Databases are hard. We would rather PlanetScale manage them. We wanted the support PlanetScale offers because they are the experts in the field. We’ve seen this come to fruition in our relationship.</p>
					</blockquote>
					<p>
						PlanetScale is the MySQL-compatible, database platform built on Vitess. Chris stated that he wants PlanetScale and Vitess to bring to MyFitnessPal “what Kubernetes brought to application delivery and deployment.” With PlanetScale’s patented database branches, their engineers can deploy database schema like they do code, deliver it live, and PlanetScale handles the transition seamlessly. MyFitnessPal are PlanetScale Managed customers: “Databases are hard. We would rather
						PlanetScale manage them. We wanted the support PlanetScale offers because they are the experts in the field. We’ve seen this come to fruition in our relationship.”
					</p>
					<p>Chris recounts numerous instances where they’ve pinged PlanetScale and received a rapid response to their support tickets. During one particular instance, there was a service that failed to reconnect to the database. MyFitnessPal’s team and PlanetScale worked on discovering the root cause for a few hours. Once their internal team stopped, PlanetScale kept working to discover and solve the problem.</p>
					<blockquote className="mb-1.5 border-0 border-l-2 border-orange px-3 font-light not-italic leading-relaxed text-primary before:!content-none after:!content-none lg:text-lg lg:font-medium [&>*]:mb-1 [&>*]:leading-relaxed">
						<p>This is more valuable than any feature. It’s a people thing.</p>
					</blockquote>
					<h2 id="increased-visibility-and-real-time-data-strategy">
						<a href="#increased-visibility-and-real-time-data-strategy">Increased visibility and real-time data strategy</a>
					</h2>
					<p>Since switching from Amazon RDS to PlanetScale, MyFitnessPal has enjoyed using query Insights. Observability is central to what MyFitnessPal does. Insights has enabled them to understand what’s happening in a distributed architecture. Insights gives MyFitnessPal the confidence to verify and check query performance. Chris specifically enjoys PlanetScale’s ability to capture 100% of queries on a running system as opposed to random query sampling:</p>
					<blockquote className="mb-1.5 border-0 border-l-2 border-orange px-3 font-light not-italic leading-relaxed text-primary before:!content-none after:!content-none lg:text-lg lg:font-medium [&>*]:mb-1 [&>*]:leading-relaxed">
						<p>Having Insights where it captures 100% of queries scratches an itch like nothing else can. You can get the complete picture.</p>
					</blockquote>
					<p>Possessing insight into every single query as opposed to a random subset has made it incredibly easier for MyFitnessPal to discover areas of optimization.</p>
					<p>On top of Insights, Chris is exceptionally excited about making use of Connect. With Connect, MyFitnessPal will be able to stream real-time data. This will transform their current process from batch updates to a real-time environment for BI and other analytics use cases. They’re actively building out a new data strategy around this feature.</p>
				</div>
				<div className="order-first px-4 pt-4 mb-6 space-y-4 border rounded shadow-xl top-14 col-span-full shadow-black/25 lg:sticky lg:order-last lg:col-span-7 lg:mb-0">
					<img alt="MyFitnessPal" loading="lazy" width={100} height={60} decoding="async" data-nimg={1} className="mx-auto h-auto max-w-[100px]" src="/assets/customers/myfitnesspal/myfitnesspal-full.svg" style={{ color: "transparent" }} />
					<dl className="flex flex-col mx-auto text-sm text-center border-t divide-y">
						<div className="py-4 space-y-sm">
							<dt className="font-semibold">Previous Database</dt>
							<dd className="text-secondary">Amazon RDS</dd>
						</div>
						<div className="py-4 space-y-sm">
							<dt className="font-semibold">Achieved with PlanetScale</dt>
							<dd className="text-secondary">Power and Velocity</dd>
						</div>
					</dl>
				</div>
			</div>
			<div className="py-6">
				<div className="container grid justify-between py-8 gap-y-8 md:grid-cols-2 md:items-center">
					<div className="space-y-3">
						<h2 className="text-4xl font-semibold text-primary lg:text-5xl">Your business deserves a predictable database.</h2>
						<div className="prose max-w-none">Never worry about another 3am wake-up call saying the site is down. Give your engineers the power they deserve with a PlanetScale database today.</div>
						<div className="flex flex-wrap justify-start gap-2">
							<a
								className="inline-flex items-center justify-center h-5 px-2 text-sm font-semibold leading-none text-center text-white no-underline transition rounded-full cursor-pointer group focus-ring whitespace-nowrap gap-sm disabled:cursor-not-allowed focus:outline-none focus:ring focus:ring-orange-300 border-orange bg-orange hover:brightness-105 disabled:bg-gray-900 disabled:text-gray-300 dark:disabled:bg-white dark:disabled:text-gray-600"
								href="https://auth.planetscale.com/sign-up"
							>
								Get started
								<svg width={16} height={16} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 16 16">
									<path d="M12 8H4" className="transition-transform origin-center scale-x-0 group-hover:scale-x-100" />
									<path d="m6.5 11.5 3.146-3.146a.5.5 0 0 0 0-.708L6.5 4.5" className="transition-transform group-hover:translate-x-xs" />
								</svg>
							</a>
							<a className="inline-flex items-center justify-center h-auto p-0 text-sm font-semibold text-center no-underline transition rounded-full cursor-pointer group focus-ring whitespace-nowrap gap-sm disabled:cursor-not-allowed focus:outline-none focus:ring focus:ring-orange-300 hover:text-orange disabled:text-gray-600" href="/contact">
								Contact sales
								<svg width={16} height={16} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 16 16" className="text-orange">
									<path d="M12 8H4" className="transition-transform origin-center scale-x-0 group-hover:scale-x-100" />
									<path d="m6.5 11.5 3.146-3.146a.5.5 0 0 0 0-.708L6.5 4.5" className="transition-transform group-hover:translate-x-xs" />
								</svg>
							</a>
						</div>
					</div>
					<div className="flex flex-col gap-y-4 md:w-4/5 md:justify-center md:justify-self-end">
						<span className="relative text-sm font-medium text-primary before:absolute before:inset-y-xs before:-left-[16px] before:w-px before:bg-orange-500 sm:before:-left-[25px]">Next case study</span>
						<div className="lg:w-2/3">
							<a className="space-y-2 text-sm group" href="/customers/attentive">
								<img alt="Attentive" loading="lazy" width={175} height={60} decoding="async" data-nimg={1} className="transition-opacity opacity-75  group-hover:opacity-100 lg:px-0" src="/assets/customers/attentive/attentive-full.svg" style={{ color: "transparent" }} />
								<button className="inline-flex items-center justify-center h-auto p-0 text-sm font-semibold text-center no-underline transition rounded-full cursor-pointer group focus-ring whitespace-nowrap gap-sm disabled:cursor-not-allowed focus:outline-none focus:ring focus:ring-orange-300 hover:text-orange disabled:text-gray-600">
									Read more <span className="sr-only">about Attentive</span>
									<svg width={16} height={16} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 16 16" className="text-orange">
										<path d="M12 8H4" className="transition-transform origin-center scale-x-0 group-hover:scale-x-100" />
										<path d="m6.5 11.5 3.146-3.146a.5.5 0 0 0 0-.708L6.5 4.5" className="transition-transform group-hover:translate-x-xs" />
									</svg>
								</button>
							</a>
						</div>
					</div>
				</div>
			</div>
		</main>
  );
}
