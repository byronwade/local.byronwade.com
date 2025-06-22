"use client";

import Link from "next/link";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Home, RefreshCw, AlertTriangle, Mail, Bug } from "lucide-react";

export default function Error({ error, reset }) {
	return (
		<div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-4">
			<div className="max-w-2xl w-full text-center">
				{/* Error Animation */}
				<div className="mb-8">
					<div className="text-8xl font-bold text-orange-600 mb-4 animate-bounce">⚠️</div>
					<div className="text-4xl font-bold text-orange-700">Oops!</div>
				</div>

				{/* Error Message */}
				<Card className="mb-8 shadow-xl border-orange-200">
					<CardHeader className="bg-orange-50">
						<CardTitle className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
							<AlertTriangle className="w-8 h-8 text-orange-600" />
							Something Unexpected Happened
						</CardTitle>
						<p className="text-xl text-gray-600">We encountered an error while loading this page.</p>
					</CardHeader>
					<CardContent className="space-y-6 pt-6">
						<p className="text-gray-700">Don&apos;t worry! This is usually a temporary issue. Our team has been automatically notified and we&apos;re working to resolve it.</p>

						{/* Error Details (Development) */}
						{process.env.NODE_ENV === "development" && error && (
							<div className="bg-gray-100 p-4 rounded-lg text-left">
								<h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
									<Bug className="w-4 h-4" />
									Error Details:
								</h4>
								<pre className="text-sm text-red-600 overflow-auto whitespace-pre-wrap">
									{error.message}
									{error.stack && (
										<>
											{"\n\nStack Trace:\n"}
											{error.stack}
										</>
									)}
								</pre>
							</div>
						)}

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button onClick={reset} size="lg" className="bg-orange-600 hover:bg-orange-700">
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

						{/* Quick Solutions */}
						<div className="pt-6 border-t">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Solutions</h3>
							<div className="text-left space-y-2 text-gray-700">
								<p>• Click &ldquo;Try Again&rdquo; to reload the page</p>
								<p>• Refresh your browser (Ctrl+F5 or Cmd+Shift+R)</p>
								<p>• Check your internet connection</p>
								<p>• Try again in a few minutes</p>
							</div>
						</div>

						{/* Common Causes */}
						<div className="pt-6 border-t">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Common Causes</h3>
							<div className="text-left space-y-2 text-gray-700 text-sm">
								<p>• Temporary server overload</p>
								<p>• Network connectivity issues</p>
								<p>• Browser cache conflicts</p>
								<p>• Ongoing maintenance</p>
							</div>
						</div>

						{/* Contact Support */}
						<div className="pt-6 border-t">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Need Additional Help?</h3>
							<p className="text-gray-700 mb-4">If the problem persists, please contact our support team.</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
								<div className="flex items-center justify-center">
									<Mail className="w-4 h-4 mr-2 text-orange-600" />
									<a href="mailto:support@byronwade.com" className="text-orange-600 hover:text-orange-800 transition-colors font-medium">
										support@byronwade.com
									</a>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Error Reference */}
				<div className="text-xs text-gray-400">
					<p>
						Error Reference: ERR_{Date.now().toString(36).toUpperCase()}
						<br />
						Timestamp: {new Date().toLocaleString()}
					</p>
				</div>
			</div>
		</div>
	);
}
