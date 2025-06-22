"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function BusinessOwnerLoginPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Business Owner Login",
		description: "Secure login portal for business owners to access their Thorbis dashboard",
		url: "https://local.byronwade.com/business-owner-login",
		mainEntity: {
			"@type": "WebApplication",
			name: "Thorbis Business Dashboard",
			description: "Business management portal for managing profiles, reviews, and analytics",
			applicationCategory: "BusinessApplication",
		},
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
