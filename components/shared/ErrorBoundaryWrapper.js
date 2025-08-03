"use client";

import React, { Component } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Alert, AlertDescription } from "@components/ui/alert";
import { RefreshCw, AlertTriangle, Home, Bug } from "lucide-react";
import { logger } from "@lib/utils/logger";

// Enhanced Error Boundary with better UX and error reporting
class ErrorBoundaryWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
			errorId: null,
			retryCount: 0,
		};
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI
		const errorId = Math.random().toString(36).substr(2, 9);
		return {
			hasError: true,
			error,
			errorId,
		};
	}

	componentDidCatch(error, errorInfo) {
		const { onError, component = "Unknown Component" } = this.props;

		// Enhanced error logging
		const errorDetails = {
			message: error.message,
			stack: error.stack,
			componentStack: errorInfo.componentStack,
			errorBoundary: component,
			props: this.props.logProps ? this.props : "Props logging disabled",
			userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
			timestamp: new Date().toISOString(),
			errorId: this.state.errorId,
			retryCount: this.state.retryCount,
		};

		// Log to console and external service
		logger.error(`ErrorBoundary caught error in ${component}:`, errorDetails);

		// Call custom error handler if provided
		if (onError) {
			onError(error, errorInfo, errorDetails);
		}

		// Report to error tracking service (e.g., Sentry)
		if (typeof window !== "undefined" && window.Sentry) {
			window.Sentry.captureException(error, {
				tags: {
					component,
					errorBoundary: true,
				},
				contexts: {
					errorBoundary: errorDetails,
				},
			});
		}

		// Store error info for display
		this.setState({
			error,
			errorInfo,
		});
	}

	handleRetry = () => {
		const { maxRetries = 3 } = this.props;

		if (this.state.retryCount < maxRetries) {
			this.setState((prevState) => ({
				hasError: false,
				error: null,
				errorInfo: null,
				retryCount: prevState.retryCount + 1,
			}));

			logger.debug(`Retrying component after error (attempt ${this.state.retryCount + 1})`);
		} else {
			logger.warn("Maximum retry attempts reached");
		}
	};

	handleGoHome = () => {
		if (typeof window !== "undefined") {
			window.location.href = "/";
		}
	};

	handleReload = () => {
		if (typeof window !== "undefined") {
			window.location.reload();
		}
	};

	reportBug = () => {
		const { error, errorInfo, errorId } = this.state;
		const { component = "Unknown Component" } = this.props;

		// Prepare bug report data
		const bugReport = {
			errorId,
			component,
			message: error?.message,
			userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
			timestamp: new Date().toISOString(),
			url: typeof window !== "undefined" ? window.location.href : "Unknown",
		};

		// In a real app, this would send to your bug tracking system
		logger.info("Bug report generated:", bugReport);

		// Copy to clipboard
		if (navigator.clipboard) {
			navigator.clipboard
				.writeText(JSON.stringify(bugReport, null, 2))
				.then(() => {
					alert("Bug report copied to clipboard");
				})
				.catch(() => {
					alert(`Bug Report ID: ${errorId}\nPlease include this ID when reporting the issue.`);
				});
		} else {
			alert(`Bug Report ID: ${errorId}\nPlease include this ID when reporting the issue.`);
		}
	};

	render() {
		const { hasError, error, errorId, retryCount } = this.state;

		const { children, fallback: CustomFallback, showRetry = true, maxRetries = 3, component = "Component", showDetails = process.env.NODE_ENV === "development" } = this.props;

		if (hasError) {
			// Use custom fallback if provided
			if (CustomFallback) {
				return <CustomFallback error={error} errorId={errorId} retryCount={retryCount} onRetry={this.handleRetry} onReload={this.handleReload} onGoHome={this.handleGoHome} canRetry={retryCount < maxRetries} />;
			}

			// Default error UI
			return (
				<div className="min-h-screen flex items-center justify-center p-4 bg-background">
					<Card className="w-full max-w-lg">
						<CardHeader className="text-center">
							<div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
								<AlertTriangle className="w-6 h-6 text-destructive" />
							</div>
							<CardTitle className="text-xl font-semibold">Something went wrong</CardTitle>
							<p className="text-muted-foreground">{component} encountered an unexpected error</p>
						</CardHeader>

						<CardContent className="space-y-4">
							{/* Error ID for support */}
							<Alert>
								<Bug className="w-4 h-4" />
								<AlertDescription>
									Error ID: <code className="font-mono text-sm">{errorId}</code>
								</AlertDescription>
							</Alert>

							{/* Error details (development only) */}
							{showDetails && error && (
								<Alert variant="destructive">
									<AlertDescription className="text-sm">
										<details>
											<summary className="cursor-pointer font-medium mb-2">Error Details (Development)</summary>
											<div className="mt-2 p-2 bg-background rounded border font-mono text-xs overflow-auto max-h-32">
												<div>
													<strong>Message:</strong> {error.message}
												</div>
												{error.stack && (
													<div className="mt-2">
														<strong>Stack:</strong>
														<pre className="whitespace-pre-wrap">{error.stack}</pre>
													</div>
												)}
											</div>
										</details>
									</AlertDescription>
								</Alert>
							)}

							{/* Action buttons */}
							<div className="flex flex-col sm:flex-row gap-2">
								{showRetry && retryCount < maxRetries && (
									<Button onClick={this.handleRetry} className="flex-1" variant="default">
										<RefreshCw className="w-4 h-4 mr-2" />
										Try Again {retryCount > 0 && `(${retryCount}/${maxRetries})`}
									</Button>
								)}

								<Button onClick={this.handleGoHome} variant="outline" className="flex-1">
									<Home className="w-4 h-4 mr-2" />
									Go Home
								</Button>
							</div>

							{/* Secondary actions */}
							<div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
								<Button onClick={this.handleReload} variant="ghost" size="sm" className="flex-1">
									<RefreshCw className="w-4 h-4 mr-2" />
									Reload Page
								</Button>

								<Button onClick={this.reportBug} variant="ghost" size="sm" className="flex-1">
									<Bug className="w-4 h-4 mr-2" />
									Report Bug
								</Button>
							</div>

							{/* Help text */}
							<p className="text-center text-sm text-muted-foreground">If this error persists, please contact support with the error ID above.</p>
						</CardContent>
					</Card>
				</div>
			);
		}

		return children;
	}
}

// Higher-order component to wrap components with error boundaries
export const withErrorBoundary = (WrappedComponent, options = {}) => {
	const WithErrorBoundaryComponent = (props) => (
		<ErrorBoundaryWrapper component={WrappedComponent.displayName || WrappedComponent.name || "Component"} {...options}>
			<WrappedComponent {...props} />
		</ErrorBoundaryWrapper>
	);

	WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

	return WithErrorBoundaryComponent;
};

// Simplified error boundary for smaller components
export const SimpleErrorBoundary = ({ children, fallback, onError }) => (
	<ErrorBoundaryWrapper
		fallback={
			fallback ||
			(({ onRetry, canRetry }) => (
				<Alert variant="destructive" className="m-4">
					<AlertTriangle className="w-4 h-4" />
					<AlertDescription className="flex items-center justify-between">
						<span>Something went wrong loading this component.</span>
						{canRetry && (
							<Button onClick={onRetry} size="sm" variant="outline">
								<RefreshCw className="w-4 h-4 mr-1" />
								Retry
							</Button>
						)}
					</AlertDescription>
				</Alert>
			))
		}
		onError={onError}
		showDetails={false}
		maxRetries={1}
	>
		{children}
	</ErrorBoundaryWrapper>
);

export default ErrorBoundaryWrapper;
