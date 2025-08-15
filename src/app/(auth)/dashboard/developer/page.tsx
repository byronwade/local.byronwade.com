/**
 * Developer Dashboard Page
 * Provides development tools and system information
 */

import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Code, Database, Globe, Settings, Activity, FileText } from "lucide-react";

// Loading component
function DeveloperPageSkeleton() {
	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="animate-pulse">
				<div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
				<div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[...Array(6)].map((_, i) => (
						<div key={i} className="h-32 bg-gray-200 rounded"></div>
					))}
				</div>
			</div>
		</div>
	);
}

// System Status Card
function SystemStatusCard() {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">System Status</CardTitle>
				<Activity className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-sm">Database</span>
						<Badge variant="default" className="bg-green-100 text-green-800">
							Online
						</Badge>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm">API</span>
						<Badge variant="default" className="bg-green-100 text-green-800">
							Healthy
						</Badge>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm">Cache</span>
						<Badge variant="default" className="bg-green-100 text-green-800">
							Active
						</Badge>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

// Environment Info Card
function EnvironmentCard() {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Environment</CardTitle>
				<Settings className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-sm">Mode</span>
						<Badge variant="outline">Development</Badge>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm">Node.js</span>
						<span className="text-sm text-muted-foreground">20.x</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm">Next.js</span>
						<span className="text-sm text-muted-foreground">14.x</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

// API Tools Card
function APIToolsCard() {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">API Tools</CardTitle>
				<Code className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					<Button variant="outline" size="sm" className="w-full justify-start">
						<Globe className="mr-2 h-4 w-4" />
						Test API Endpoints
					</Button>
					<Button variant="outline" size="sm" className="w-full justify-start">
						<Database className="mr-2 h-4 w-4" />
						Database Console
					</Button>
					<Button variant="outline" size="sm" className="w-full justify-start">
						<FileText className="mr-2 h-4 w-4" />
						View Logs
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

// Performance Metrics Card
function PerformanceCard() {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Performance</CardTitle>
				<Activity className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-sm">Avg Response</span>
						<span className="text-sm font-medium">142ms</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm">Cache Hit Rate</span>
						<span className="text-sm font-medium">87%</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm">Uptime</span>
						<span className="text-sm font-medium">99.9%</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

// Database Status Card
function DatabaseCard() {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Database</CardTitle>
				<Database className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-sm">Connection Pool</span>
						<span className="text-sm font-medium">8/20</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm">Query Time</span>
						<span className="text-sm font-medium">23ms</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm">Storage</span>
						<span className="text-sm font-medium">2.4GB</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

// Recent Errors Card
function RecentErrorsCard() {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Recent Errors</CardTitle>
				<Activity className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					<div className="text-sm text-muted-foreground">No recent errors</div>
					<Button variant="outline" size="sm" className="w-full">
						View Error Logs
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

export default function DeveloperPage() {
	return (
		<Suspense fallback={<DeveloperPageSkeleton />}>
			<div className="container mx-auto p-6 space-y-6">
				{/* Header */}
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Developer Dashboard</h1>
					<p className="text-muted-foreground">Development tools, system monitoring, and debugging utilities</p>
				</div>

				{/* Main Content */}
				<Tabs defaultValue="overview" className="space-y-4">
					<TabsList as="div">
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="api">API Tools</TabsTrigger>
						<TabsTrigger value="database">Database</TabsTrigger>
						<TabsTrigger value="logs">Logs</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-4">
						{/* Status Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<SystemStatusCard />
							<EnvironmentCard />
							<PerformanceCard />
							<DatabaseCard />
							<APIToolsCard />
							<RecentErrorsCard />
						</div>
					</TabsContent>

					<TabsContent value="api" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>API Testing Tools</CardTitle>
								<CardDescription>Test and debug API endpoints</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<Button variant="outline" className="justify-start">
											<Code className="mr-2 h-4 w-4" />
											GraphQL Playground
										</Button>
										<Button variant="outline" className="justify-start">
											<Globe className="mr-2 h-4 w-4" />
											REST API Tester
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="database" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Database Management</CardTitle>
								<CardDescription>Monitor and manage database operations</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<Button variant="outline" className="justify-start">
											<Database className="mr-2 h-4 w-4" />
											Query Console
										</Button>
										<Button variant="outline" className="justify-start">
											<Activity className="mr-2 h-4 w-4" />
											Performance Monitor
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="logs" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>System Logs</CardTitle>
								<CardDescription>View application logs and error traces</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<Button variant="outline" className="justify-start">
											<FileText className="mr-2 h-4 w-4" />
											Application Logs
										</Button>
										<Button variant="outline" className="justify-start">
											<Activity className="mr-2 h-4 w-4" />
											Error Logs
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</Suspense>
	);
}
