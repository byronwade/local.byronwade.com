"use client";

import Link from "next/link";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Home, RefreshCw, AlertTriangle, Mail, Phone } from "lucide-react";

export default function GlobalError({ error, reset }) {
	return (
		<html>
			<body>
				<div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
					<div className="max-w-2xl w-full text-center">
						{/* Error Animation */}
						<div className="mb-8">
							<div className="text-9xl font-bold text-red-600 mb-4 animate-pulse">500</div>
							<div className="text-6xl mb-4">⚠️</div>
						</div>

						{/* Error Message */}
						<Card className="mb-8 shadow-xl border-red-200">
							<CardHeader className="bg-red-50">
								<CardTitle className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
									<AlertTriangle className="w-8 h-8 text-red-600" />
									Something Went Wrong
								</CardTitle>
								<p className="text-xl text-gray-600">We&apos;re experiencing some technical difficulties.</p>
							</CardHeader>
							<CardContent className="space-y-6 pt-6">
								<p className="text-gray-700">Don&apos;t panic! Our team has been notified and we&apos;re working to fix this issue. Please try again in a few minutes.</p>

								{/* Error Details (Development) */}
								{process.env.NODE_ENV === "development" && error && (
									<div className="bg-gray-100 p-4 rounded-lg text-left">
										<h4 className="font-semibold text-gray-900 mb-2">Error Details:</h4>
										<pre className="text-sm text-red-600 overflow-auto">{error.message}</pre>
									</div>
								)}

								{/* Action Buttons */}
								<div className="flex flex-col sm:flex-row gap-4 justify-center">
									<Button onClick={reset} size="lg" className="bg-red-600 hover:bg-red-700">
										<RefreshCw className="w-5 h-5 mr-2" />
										Try Again
									</Button>
									<Button asChild variant="outline" size="lg">
										<Link href="/">
											<Home className="w-5 h-5 mr-2" />
											Go Home
										</Link>
									</Button>
								</div>

								{/* What You Can Do */}
								<div className="pt-6 border-t">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">What You Can Do</h3>
									<div className="text-left space-y-2 text-gray-700">
										<p>• Refresh the page or try again in a few minutes</p>
										<p>• Check your internet connection</p>
										<p>• Clear your browser cache and cookies</p>
										<p>• Try accessing the site from a different browser</p>
									</div>
								</div>

								{/* Contact Support */}
								<div className="pt-6 border-t">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">Still Having Issues?</h3>
									<p className="text-gray-700 mb-4">Our support team is here to help you get back on track.</p>
									<div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
										<div className="flex items-center justify-center">
											<Mail className="w-4 h-4 mr-2 text-red-600" />
											<a href="mailto:support@byronwade.com" className="text-red-600 hover:text-red-800 transition-colors font-medium">
												support@byronwade.com
											</a>
										</div>
										<div className="flex items-center justify-center">
											<Phone className="w-4 h-4 mr-2 text-red-600" />
											<a href="tel:+1234567890" className="text-red-600 hover:text-red-800 transition-colors font-medium">
												(123) 456-7890
											</a>
										</div>
									</div>
								</div>

								{/* Status Page Link */}
								<div className="pt-4">
									<p className="text-sm text-gray-500">
										Check our{" "}
										<a href="https://status.byronwade.com" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline transition-colors">
											status page
										</a>{" "}
										for real-time updates on system performance.
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Error ID for Support */}
						<div className="text-xs text-gray-400">
							<p>
								Error ID: {Date.now().toString(36).toUpperCase()}
								<br />
								Time: {new Date().toISOString()}
							</p>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
