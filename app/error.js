"use client";

import { Button } from "@/components/ui/button";
import { Home, RefreshCw, Bug } from "lucide-react";

export default function Error({ error, reset }) {
	return (
		<div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
			<div className="max-w-md text-center">
				<div className="relative inline-block mb-8">
					<h1 className="text-9xl font-bold text-destructive">500</h1>
					<p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-background text-sm font-medium px-2 bg-foreground rounded-full">Server Error</p>
				</div>
				<h2 className="text-2xl font-semibold mb-2">Houston, we have a problem.</h2>
				<p className="text-muted-foreground mb-8">Our servers are having a bit of a moment. A team of highly trained squirrels has been dispatched to fix the issue. Please stand by.</p>

				{process.env.NODE_ENV === "development" && error && (
					<div className="bg-muted/80 p-4 rounded-lg text-left mb-6">
						<h4 className="font-semibold text-destructive mb-2 flex items-center gap-2">
							<Bug className="w-4 h-4" />
							Technical Details (For Nerds):
						</h4>
						<pre className="text-sm text-destructive/80 overflow-auto whitespace-pre-wrap font-mono">
							{error.message || "No error message provided."}
							{error.stack && `\n\n${error.stack}`}
						</pre>
					</div>
				)}

				<div className="flex gap-4 justify-center">
					<Button onClick={() => reset()}>
						<RefreshCw className="w-4 h-4 mr-2" />
						Try Again
					</Button>
					<Button asChild variant="outline">
						<a href="/">
							<Home className="w-4 h-4 mr-2" />
							Go to Homepage
						</a>
					</Button>
				</div>
				<div className="mt-12 text-xs text-muted-foreground/80">
					Error Code: <span className="font-mono">ERR_{Date.now().toString(36).toUpperCase()}</span>
				</div>
			</div>
		</div>
	);
}
