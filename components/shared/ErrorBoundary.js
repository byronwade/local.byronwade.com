"use client";

import React from "react";

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		// Log the error for debugging
		console.error("ErrorBoundary caught an error:", error, errorInfo);

		// Check if it's a chunk loading error
		if (error.name === "ChunkLoadError" || error.message.includes("Loading chunk")) {
			// Reload the page to recover from chunk loading errors
			window.location.reload();
		}
	}

	render() {
		if (this.state.hasError) {
			// Fallback UI
			return (
				<div className="min-h-screen flex items-center justify-center bg-background">
					<div className="text-center p-8">
						<h2 className="text-2xl font-bold text-foreground mb-4">Something went wrong</h2>
						<p className="text-muted-foreground mb-6">We encountered an unexpected error. The page will reload automatically.</p>
						<button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
							Reload Page
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
