import { Badge } from "@components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import Link from "next/link";
import { Eye, Star, Users, ListChecks, Lock, ShieldCheck, GitBranch, FileText, ExternalLink } from "lucide-react";

export const metadata = {
	title: "Transparency & Review Algorithm | Thorbis",
	description: "A founder&apos;s essay and full technical transparency on Thorbis&apos;s review algorithm, changelogs, audits, and open-source code. Radical trust, open data, and community accountability.",
	keywords: "review algorithm, transparency, open source, trust, moderation, star rating, Thorbis, changelog, audit",
};

const GITHUB_REPO = "https://github.com/your-org/thorbis";
const CHANGELOG_URL = "https://github.com/your-org/thorbis/commits/main";

export default function TransparencyPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
			{/* Hero Section */}
			<section className="relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5"></div>
				<div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
					<Badge variant="secondary" className="mb-6 text-sm font-medium">
						Trust & Transparency
					</Badge>
					<h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">Radical Transparency at Thorbis</h1>
					<p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">Our review algorithm, moderation, and business logic are fully public, open-source, and community-audited. Read our founder&apos;s letter and see every change, every audit, and every line of code.</p>
					<Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
						<Link href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
							<GitBranch className="mr-2 w-5 h-5" /> View on GitHub
						</Link>
					</Button>
				</div>
			</section>

			{/* Founder Essay */}
			<section className="py-16 bg-white dark:bg-slate-900">
				<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
					<Card className="bg-slate-50 dark:bg-slate-800">
						<CardHeader>
							<CardTitle className="text-2xl font-bold text-blue-700 dark:text-blue-300">A Letter from Our Founder</CardTitle>
						</CardHeader>
						<CardContent className="prose dark:prose-invert max-w-none text-lg">
							<p>
								Dear Thorbis Community,
								<br />
								<br />
								When I started Thorbis, I was frustrated by the lack of transparency in online reviews and business platforms. Too often, algorithms are black boxes, moderation is hidden, and users are left in the dark. I believe trust is built on openness, not secrecy.
								<br />
								<br />
								That&apos;s why we&apos;re making every part of our review system public. You can see how ratings are calculated, how moderation works, and even audit our code and changelogs. We invite you to hold us accountable, contribute, and help us set a new standard for business transparency.
								<br />
								<br />
								Thank you for being part of this journey.
								<br />
								<br />
								<span className="font-semibold">— Byron Wade, Founder</span>
							</p>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Key Points with Proof */}
			<section className="py-16 bg-slate-50 dark:bg-slate-800">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center">Key Transparency Commitments</h2>
					<div className="grid md:grid-cols-2 gap-8">
						<Card className="bg-white dark:bg-slate-900">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
									<Eye className="w-6 h-6" /> 100% Open Source
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2 text-slate-700 dark:text-slate-200">
								<ul className="list-disc pl-5 space-y-1">
									<li>
										All review and moderation logic is public on{" "}
										<a href={GITHUB_REPO} className="underline text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
											GitHub <ExternalLink className="inline w-4 h-4" />
										</a>
										.
									</li>
									<li>Anyone can audit, suggest changes, or report issues.</li>
									<li>
										We publish a{" "}
										<a href={CHANGELOG_URL} className="underline text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
											changelog <FileText className="inline w-4 h-4" />
										</a>{" "}
										for every update.
									</li>
								</ul>
							</CardContent>
						</Card>
						<Card className="bg-white dark:bg-slate-900">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
									<ShieldCheck className="w-6 h-6" /> Audited by the Community
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2 text-slate-700 dark:text-slate-200">
								<ul className="list-disc pl-5 space-y-1">
									<li>Transparency Advisory Board: SMB owners, consumer advocates, and experts.</li>
									<li>
										All audits and findings are published <span className="italic">(see below)</span>.
									</li>
									<li>Moderation actions and algorithm changes are logged and reviewable.</li>
								</ul>
							</CardContent>
						</Card>
						<Card className="bg-white dark:bg-slate-900">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
									<ListChecks className="w-6 h-6" /> User & Business Rights
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2 text-slate-700 dark:text-slate-200">
								<ul className="list-disc pl-5 space-y-1">
									<li>Businesses can hide reviews, but all reviews count toward the star rating.</li>
									<li>Users can see which reviews are hidden and why.</li>
									<li>Neighbors can see each other&apos;s reviews for local context.</li>
								</ul>
							</CardContent>
						</Card>
						<Card className="bg-white dark:bg-slate-900">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
									<Star className="w-6 h-6" /> Full Algorithm Disclosure
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2 text-slate-700 dark:text-slate-200">
								<ul className="list-disc pl-5 space-y-1">
									<li>Star ratings = average of all reviews (visible or hidden, except ToS-violating).</li>
									<li>Algorithm logic is documented and versioned in the repo.</li>
									<li>Planned: Blockchain-backed verification for all moderation actions.</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* In-Depth Algorithm Breakdown */}
			<section className="py-16 bg-white dark:bg-slate-900">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center">How the Review Algorithm Works</h2>
					<div className="prose dark:prose-invert max-w-none text-lg mx-auto">
						<ol className="list-decimal pl-6 space-y-4">
							<li>
								<b>Submission:</b> Any user can submit a review for a business. Reviews are timestamped and cryptographically signed (planned: blockchain log).
							</li>
							<li>
								<b>Moderation:</b> Reviews are checked for ToS violations (hate speech, spam, etc). Flagged reviews are removed from public view and the star rating.
							</li>
							<li>
								<b>Visibility:</b> Business owners can hide reviews from public view, but hidden reviews still count toward the star rating. Hidden reviews are marked and auditable.
							</li>
							<li>
								<b>Ordering:</b> Owners can drag and drop to reorder visible reviews, highlighting their best feedback. Users see the order chosen by the business, but can also sort by date or rating.
							</li>
							<li>
								<b>Neighborhood Context:</b> Reviews are labeled by neighborhood. Users can filter to see only reviews from their area or all reviews.
							</li>
							<li>
								<b>Star Rating Calculation:</b> The star rating is the average of all non-flagged reviews, regardless of visibility. This ensures accuracy and prevents manipulation.
							</li>
							<li>
								<b>Audit Trail:</b> Every moderation action, algorithm change, and review edit is logged and published in the changelog.
							</li>
						</ol>
						<p className="mt-8">
							For the full algorithm code, see our{" "}
							<a href={GITHUB_REPO} className="underline text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
								GitHub repository <ExternalLink className="inline w-4 h-4" />
							</a>
							.
						</p>
					</div>
				</div>
			</section>

			{/* Changelog Section */}
			<section className="py-16 bg-slate-50 dark:bg-slate-800">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<Card className="bg-white dark:bg-slate-900">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
								<FileText className="w-6 h-6" /> Recent Changelog
							</CardTitle>
						</CardHeader>
						<CardContent className="text-slate-700 dark:text-slate-200">
							<p>
								Every change to our review algorithm and moderation logic is tracked and published. See the{" "}
								<a href={CHANGELOG_URL} className="underline text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
									full changelog on GitHub <ExternalLink className="inline w-4 h-4" />
								</a>
								.
							</p>
							<ul className="mt-4 list-disc pl-5 space-y-2 text-base">
								<li>2024-06-10: Added blockchain-backed review logging (planned)</li>
								<li>2024-06-05: Launched Transparency Advisory Board</li>
								<li>2024-06-01: Made moderation logs public</li>
								<li>2024-05-20: Open-sourced the review algorithm</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Advisory Board & Audits */}
			<section className="py-16 bg-white dark:bg-slate-900">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<Card className="bg-slate-50 dark:bg-slate-800">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
								<ShieldCheck className="w-6 h-6" /> Transparency Advisory Board & Audits
							</CardTitle>
						</CardHeader>
						<CardContent className="text-slate-700 dark:text-slate-200">
							<p>Our Transparency Advisory Board is made up of respected SMB owners, consumer advocates, and industry experts. The board meets quarterly to audit our review and moderation processes, and publishes public reports for the community.</p>
							<ul className="mt-4 list-disc pl-5 space-y-2 text-base">
								<li>
									2024 Q2 Audit:{" "}
									<a href="#" className="underline text-blue-600 hover:text-blue-800">
										Read the report (PDF)
									</a>
								</li>
								<li>
									2024 Q1 Audit:{" "}
									<a href="#" className="underline text-blue-600 hover:text-blue-800">
										Read the report (PDF)
									</a>
								</li>
							</ul>
							<p className="mt-4">
								Want to join the board or suggest an audit?{" "}
								<a href="/contact-support" className="underline text-blue-600 hover:text-blue-800">
									Contact us
								</a>
								.
							</p>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Call to Action */}
			<section className="py-16 bg-slate-50 dark:bg-slate-800">
				<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-6">Help Us Build the Most Trusted Platform</h2>
					<p className="text-xl text-slate-600 dark:text-slate-300 mb-8">Thorbis is a living experiment in radical transparency. Audit us, contribute code, or just ask questions. We&apos;re here to earn your trust, every day.</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
							<Link href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
								<GitBranch className="mr-2 w-5 h-5" /> Contribute on GitHub
							</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link href="/trust-safety">Learn More About Trust & Safety</Link>
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
