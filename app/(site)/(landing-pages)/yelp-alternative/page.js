import React from "react";

export default function YelpAlternitive() {
	return (
		<main className="relative min-h-screen">
			<article className="max-w-5xl px-8 py-16 mx-auto sm:px-16 xl:px-20">
				<div className="max-w-5xl mb-16 space-y-8 text-white">
					<div className="space-y-4">
						<p className="text-center text-brand">Alternative</p>
						<h1 className="text-center h1">Supabase vs Firebase</h1>
						<div className="flex justify-center space-x-3 text-sm text-muted-foreground">
							<p>2022-05-26</p>
							<p>•</p>
							<p>4 minute read</p>
						</div>
						<div className="flex justify-center gap-3">
							<div className="mt-6 mb-8 mr-4 w-max lg:mb-0">
								<a className="cursor-pointer" href="https://github.com/awalias">
									<div className="flex items-center gap-3">
										<div className="relative w-10 h-10">
											<img
												alt="author avatar"
												loading="lazy"
												decoding="async"
												data-nimg="fill"
												className="w-full border rounded-full border-default"
												sizes="100vw"
												srcSet="/_next/image?url=https%3A%2F%2Fgithub.com%2Fawalias.png&w=640&q=75 640w, /_next/image?url=https%3A%2F%2Fgithub.com%2Fawalias.png&w=750&q=75 750w, /_next/image?url=https%3A%2F%2Fgithub.com%2Fawalias.png&w=828&q=75 828w, /_next/image?url=https%3A%2F%2Fgithub.com%2Fawalias.png&w=1080&q=75 1080w, /_next/image?url=https%3A%2F%2Fgithub.com%2Fawalias.png&w=1200&q=75 1200w, /_next/image?url=https%3A%2F%2Fgithub.com%2Fawalias.png&w=1920&q=75 1920w, /_next/image?url=https%3A%2F%2Fgithub.com%2Fawalias.png&w=2048&q=75 2048w, /_next/image?url=https%3A%2F%2Fgithub.com%2Fawalias.png&w=3840&q=75 3840w"
												src="/_next/image?url=https%3A%2F%2Fgithub.com%2Fawalias.png&w=3840&q=75"
												style={{
													position: "absolute",
													height: "100%",
													width: "100%",
													inset: 0,
													objectFit: "cover",
													color: "transparent",
												}}
											/>
										</div>
										<div className="flex flex-col">
											<span className="mb-0 text-sm text-foreground">Ant Wilson</span>
											<span className="mb-0 text-xs text-muted-foreground">CTO and Co-Founder</span>
										</div>
									</div>
								</a>
							</div>
						</div>
					</div>
				</div>
				<div>
					<div className="prose dark:prose-invert prose-docs max-w-none">
						<h2 id="what-is-firebase" className="group scroll-mt-24">
							What is Firebase?
							<a href="#what-is-firebase" aria-hidden="true" className="ml-2 transition opacity-0 group-hover:opacity-100">
								<span aria-hidden="true">#</span>
							</a>
						</h2>
						<p>Now owned by Google, Firebase is a collection of tools aimed at mobile and web developers. At its core is the Firestore database.</p>
						<p>Firestore allows you to store “documents”. These are collections of key:value pairs where the value can be another sub-document. Document based storage is perfect for unstructured data, since two documents in a collection do not necessarily need to have the same structure.</p>
						<p>Firebase also offers other things that web developers find useful like an auth service for user management, and wrappers for other Google services such as Cloud Functions, and File Storage.</p>
						<h2 id="what-is-supabase" className="group scroll-mt-24">
							What is Supabase?
							<a href="#what-is-supabase" aria-hidden="true" className="ml-2 transition opacity-0 group-hover:opacity-100">
								<span aria-hidden="true">#</span>
							</a>
						</h2>
						<p>Supabase is an open source firebase alternative, but instead of being built around a document-based datastore, Supabase offers a relational database management system called PostgreSQL. This comes with a few advantages:</p>
						<ul>
							<li>It’s open source, so there is zero lock in.</li>
							<li>You can query it with SQL, a proven and powerful query language.</li>
							<li>It has a long track record of being used at scale.</li>
							<li>It’s the database of choice for transactional workloads (think apps and websites, or other things that require near-instant responses to queries).</li>
							<li>
								It comes with decades of <a href="https://supabase.com/docs/guides/database/extensions">useful postgres extensions and plug-ins</a>.
							</li>
						</ul>
						<p>At Supabase we’ve always been huge fans of Firebase - so we started adding a few things on top of PostgreSQL in an attempt to reach feature parity, including:</p>
						<ul>
							<li>
								Auto-generated API - <a href="https://supabase.com/docs/guides/api#rest-api-overview">query your data straight from the client</a>.
							</li>
							<li>
								Realtime - <a href="https://supabase.com/docs/reference/dart/subscribe">changes in your data will be streamed directly to your application</a>.
							</li>
							<li>
								Auth - <a href="https://supabase.com/auth">a simple to integrate auth system and SQL based rules engine</a>.
							</li>
							<li>
								Functions - <a href="https://supabase.com/edge-functions">javascript and typescript functions that deploy out globally</a>.
							</li>
							<li>
								Storage - <a href="https://supabase.com/storage">hosting images, videos, and pdfs easily</a>.
							</li>
						</ul>
						<h2 id="how-are-they-similar" className="group scroll-mt-24">
							How are they similar?
							<a href="#how-are-they-similar" aria-hidden="true" className="ml-2 transition opacity-0 group-hover:opacity-100">
								<span aria-hidden="true">#</span>
							</a>
						</h2>
						<p>Both Firebase and Supabase are based on the idea of bringing a superior developer experience to databases. With both platforms you can spin up a new project from directly inside the browser without the need to download any extra tools or software to your machine. Both platforms come with a useful dashboard UI for debugging your data in realtime, which is especially useful for fast iterations when in development.</p>
						<p>
							Both Firebase and Supabase have invested heavily in client side libraries so you can communicate with your database directly from the client. Firebase has their <a href="https://github.com/firebase/firebase-js-sdk">Firebase Javascript SDK</a> and Supabase has <a href="https://github.com/supabase/supabase-js/">supabase-js an isomorphic client</a> that can be used both on the client also on the server in a node-js environment.
						</p>
						<h2 id="how-are-they-different" className="group scroll-mt-24">
							How are they different?
							<a href="#how-are-they-different" aria-hidden="true" className="ml-2 transition opacity-0 group-hover:opacity-100">
								<span aria-hidden="true">#</span>
							</a>
						</h2>
						<p>Firebase and Supabase differ in several ways. The main one being that Firebase is a document store, whereas Supabase is based on PostgreSQL - a relational, SQL-based database management system.</p>
						<p>There are some other important differences.</p>
						<h3 id="open-source" className="group scroll-mt-24">
							Open Source
							<a href="#open-source" aria-hidden="true" className="ml-2 transition opacity-0 group-hover:opacity-100">
								<span aria-hidden="true">#</span>
							</a>
						</h3>
						<p>Supabase is open source. Along with the hosted cloud platform, you can also take the Supabase stack and host it inside your own cloud or run it locally on your machine. There is no vendor lock in.</p>
						<h3 id="pricing" className="group scroll-mt-24">
							Pricing
							<a href="#pricing" aria-hidden="true" className="ml-2 transition opacity-0 group-hover:opacity-100">
								<span aria-hidden="true">#</span>
							</a>
						</h3>
						<p>
							<a href="https://firebase.google.com/pricing">Firebase charges for reads, writes and deletes</a>, which can lead to some unpredictability, especially in the early stages of a project when your application is in heavy development. Supabase <a href="https://supabase.com/pricing">charges based on the amount of data stored</a>, with breathing room for unlimited API requests and an unlimited number of Auth users.
						</p>
						<h3 id="performance" className="group scroll-mt-24">
							Performance
							<a href="#performance" aria-hidden="true" className="ml-2 transition opacity-0 group-hover:opacity-100">
								<span aria-hidden="true">#</span>
							</a>
						</h3>
						<p>
							We created a benchmarking repo where you can compare the performance of both services in different scenarios. Our most recent results show that <a href="https://github.com/supabase/benchmarks/issues/8">Supabase outperforms Firebase by up to 4x</a> on number of reads per second, and 3.1x on writes per second.
						</p>
						<h2 id="how-do-i-migrate-from-firebase-to-supabase" className="group scroll-mt-24">
							How do I migrate from Firebase to Supabase?
							<a href="#how-do-i-migrate-from-firebase-to-supabase" aria-hidden="true" className="ml-2 transition opacity-0 group-hover:opacity-100">
								<span aria-hidden="true">#</span>
							</a>
						</h2>
						<p>
							Since Firebase is document based, migrating into a relational database requires you to map your data structure across into a SQL schema. Luckily we’ve built a <a href="https://supabase.com/docs/guides/migrations/firestore-data">handy conversion tool to do it for you</a>.
						</p>
						<p>
							We also have guides and tools for <a href="https://supabase.com/docs/guides/migrations/firebase-auth">migrating Firebase Auth to Supabase Auth</a> for <a href="https://supabase.com/docs/guides/migrations/firebase-storage">migrating Firebase Storage files to Supabase Storage</a>.
						</p>
						<p>These are by far the most complete Firebase to Postgres migration tools available anywhere on the web.</p>
						<p>
							You can <a href="https://supabase.com/dashboard">try Supabase for free</a>. If you require Enterprise level support with your project or migration, please get in touch using our <a href="https://forms.supabase.com/enterprise">Enterprise contact form</a>.
						</p>
					</div>
					<div className="py-16">
						<div className="text-sm text-foreground-lighter">Share this article</div>
						<div className="flex items-center mt-4 space-x-4">
							<a target="_blank" className="text-muted hover:text-foreground" href="https://twitter.com/share?text=Supabase vs Firebase&url=https://supabase.com/blog/supabase-vs-firebase">
								<svg height={26} width={26} viewBox="-89 -46.8 644 446.8" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
									<path
										d="m154.729 400c185.669 0 287.205-153.876 287.205-287.312 0-4.37-.089-8.72-.286-13.052a205.304 205.304 0 0 0 50.352-52.29c-18.087 8.044-37.55 13.458-57.968 15.899 20.841-12.501 36.84-32.278 44.389-55.852a202.42 202.42 0 0 1 -64.098 24.511c-18.42-19.628-44.644-31.904-73.682-31.904-55.744 0-100.948 45.222-100.948 100.965 0 7.925.887 15.631 2.619 23.025-83.895-4.223-158.287-44.405-208.074-105.504a100.739 100.739 0 0 0 -13.668 50.754c0 35.034 17.82 65.961 44.92 84.055a100.172 100.172 0 0 1 -45.716-12.63c-.015.424-.015.837-.015 1.29 0 48.903 34.794 89.734 80.982 98.986a101.036 101.036 0 0 1 -26.617 3.553c-6.493 0-12.821-.639-18.971-1.82 12.851 40.122 50.115 69.319 94.296 70.135-34.549 27.089-78.07 43.224-125.371 43.224a204.9 204.9 0 0 1 -24.078-1.399c44.674 28.645 97.72 45.359 154.734 45.359"
										fillRule="nonzero"
									/>
								</svg>
							</a>
							<a target="_blank" className="text-muted hover:text-foreground" href="https://www.linkedin.com/shareArticle?url=https://supabase.com/blog/supabase-vs-firebase&title=Supabase vs Firebase">
								<svg width={20} height={20} viewBox="0 5 1036 990" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
									<path d="M0 120c0-33.334 11.667-60.834 35-82.5C58.333 15.833 88.667 5 126 5c36.667 0 66.333 10.666 89 32 23.333 22 35 50.666 35 86 0 32-11.333 58.666-34 80-23.333 22-54 33-92 33h-1c-36.667 0-66.333-11-89-33S0 153.333 0 120zm13 875V327h222v668H13zm345 0h222V622c0-23.334 2.667-41.334 8-54 9.333-22.667 23.5-41.834 42.5-57.5 19-15.667 42.833-23.5 71.5-23.5 74.667 0 112 50.333 112 151v357h222V612c0-98.667-23.333-173.5-70-224.5S857.667 311 781 311c-86 0-153 37-201 111v2h-1l1-2v-95H358c1.333 21.333 2 87.666 2 199 0 111.333-.667 267.666-2 469z" />
								</svg>
							</a>
						</div>
					</div>
					<div className="grid gap-8 py-8 lg:grid-cols-1">
						<div>
							<a href="/alternatives/supabase-vs-heroku-postgres">
								<div>
									<div className="p-6 transition border rounded cursor-pointer border-default hover:bg-surface-100">
										<div className="space-y-4">
											<div>
												<p className="text-sm text-muted">Previous comparison</p>
											</div>
											<div>
												<h4 className="text-lg text-foreground">Supabase vs Heroku Postgres</h4>
												<p className="small">26 May 2022</p>
											</div>
										</div>
									</div>
								</div>
							</a>
						</div>
						<div />
					</div>
				</div>
			</article>
			<div className="grid items-center grid-cols-12 gap-4 px-16 py-32 text-center border-t bg-background ">
				<div className="col-span-12">
					<h2 className="h2">
						<span className="text-muted">Build in a weekend,</span>
						<span className="block text-foreground sm:inline"> scale to millions</span>
					</h2>
				</div>
				<div className="col-span-12 mt-4">
					<a href="https://supabase.com/dashboard">
						<button
							data-size="medium"
							type="button"
							className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border bg-brand-400 dark:bg-brand-500 hover:bg-brand/80 dark:hover:bg-brand/50 border-brand-500/75 dark:border-brand/30 hover:border-brand-600 dark:hover:border-brand focus-visible:outline-brand-600 data-[state=open]:bg-brand-400/80 dark:data-[state=open]:bg-brand-500/80 data-[state=open]:outline-brand-600 text-sm px-4 py-2 h-[38px] text-white"
						>
							{" "}
							<span className="truncate">Start your project</span>{" "}
						</button>
					</a>
				</div>
			</div>
		</main>
	);
}
