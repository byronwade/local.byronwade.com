"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import Head from "next/head";

export default function BusinessOwnerLoginPage() {
	const pageTitle = "Business Owner Login";
	const pageDescription = "Access your business dashboard.";
	const pageUrl = "https://local.byronwade.com/business-owner-login";
	return (
		<>
			<Head>
				<title>{pageTitle}</title>
				<meta name="description" content={pageDescription} />
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "WebPage",
							name: pageTitle,
							description: pageDescription,
							url: pageUrl,
							isPartOf: {
								"@type": "WebSite",
								name: "Inbox Zero",
								url: "https://local.byronwade.com",
							},
						}),
					}}
				/>
			</Head>
			<div className="flex items-center justify-center min-h-screen bg-muted">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<CardTitle className="text-2xl font-bold">Business Owner Login</CardTitle>
						<CardDescription>Access your Thorbis business dashboard.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<label htmlFor="email" className="sr-only">
								Email
							</label>
							<Input id="email" type="email" placeholder="Email Address" />
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<Input id="password" type="password" placeholder="Password" />
						</div>
						<Button className="w-full">Sign In</Button>
						<div className="text-center text-sm">
							<Link href="/password-reset" className="text-primary hover:underline">
								Forgot your password?
							</Link>
						</div>
						<div className="text-center text-sm text-muted-foreground">
							Not a member yet?{" "}
							<Link href="/claim-a-business" className="text-primary hover:underline">
								Claim your business
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
