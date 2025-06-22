"use client";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Home, Search, ArrowLeft, MapPin, Phone, Mail } from "lucide-react";

export default function NotFound() {
	const handleGoBack = () => {
		if (typeof window !== "undefined") {
			window.history.back();
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="max-w-2xl w-full text-center">
				{/* 404 Animation */}
				<div className="mb-8">
					<div className="text-9xl font-bold text-blue-600 mb-4 animate-bounce">404</div>
					<div className="text-6xl mb-4">🔍</div>
				</div>

				{/* Error Message */}
				<Card className="mb-8 shadow-xl">
					<CardHeader>
						<CardTitle className="text-3xl font-bold text-gray-900 mb-2">Oops! Page Not Found</CardTitle>
						<p className="text-xl text-gray-600">The page you&apos;re looking for seems to have gone on vacation.</p>
					</CardHeader>
					<CardContent className="space-y-6">
						<p className="text-gray-700">Don&apos;t worry! This happens sometimes. The page might have been moved, deleted, or you might have typed the URL incorrectly.</p>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
								<Link href="/">
									<Home className="w-5 h-5 mr-2" />
									Go Home
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg">
								<Link href="/search">
									<Search className="w-5 h-5 mr-2" />
									Search Businesses
								</Link>
							</Button>
							<Button variant="ghost" size="lg" onClick={handleGoBack} className="hover:bg-gray-100">
								<ArrowLeft className="w-5 h-5 mr-2" />
								Go Back
							</Button>
						</div>

						{/* Popular Links */}
						<div className="pt-6 border-t">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Pages</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<Link href="/categories" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
									Browse Categories
								</Link>
								<Link href="/learn" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
									Business Courses
								</Link>
								<Link href="/localhub" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
									LocalHub
								</Link>
								<Link href="/support" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
									Get Support
								</Link>
							</div>
						</div>

						{/* Contact Information */}
						<div className="pt-6 border-t">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
							<div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-gray-600">
								<div className="flex items-center justify-center">
									<Mail className="w-4 h-4 mr-2" />
									<a href="mailto:support@byronwade.com" className="hover:text-blue-600 transition-colors">
										support@byronwade.com
									</a>
								</div>
								<div className="flex items-center justify-center">
									<Phone className="w-4 h-4 mr-2" />
									<a href="tel:+1234567890" className="hover:text-blue-600 transition-colors">
										(123) 456-7890
									</a>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Fun Fact */}
				<div className="text-sm text-gray-500">
					<p>
						💡 <strong>Fun Fact:</strong> The term &ldquo;404&rdquo; comes from room number 404 at CERN, where the original web servers were located.
					</p>
				</div>
			</div>
		</div>
	);
}
