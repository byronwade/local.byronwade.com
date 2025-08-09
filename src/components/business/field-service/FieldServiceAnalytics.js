"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Progress } from "@components/ui/progress";
import {
	BarChart3,
	Plus,
	Filter,
	Download,
	Eye,
	Edit,
	TrendingUp,
	DollarSign,
	Users,
	Clock,
	Target,
	Activity,
	LineChart,
	Settings,
	RefreshCw,
	FileText,
	Star,
	Award,
	AlertTriangle,
	CheckCircle,
	Timer,
	ArrowUp,
	ArrowDown,
	Minus,
	MoreHorizontal,
	Share,
	Calendar as CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import Header from "@components/business/header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

/**
 * Comprehensive Field Service Analytics & Reports System
 * Advanced business intelligence with performance metrics, financial insights, and custom reporting
 */
export default function FieldServiceAnalytics({
	user,
	userRole,
	businessMetrics = null,
	revenueAnalytics = [],
	customerAnalytics = [],
	jobAnalytics = [],
	technicianPerformance = [],
	financialTrends = [],
	operationalMetrics = null,
	customReports = [],
}) {
	const [dateRange, setDateRange] = useState("30d");
	const [selectedMetric, setSelectedMetric] = useState("revenue");
	const [viewMode, setViewMode] = useState("dashboard");
	const [activeTab, setActiveTab] = useState("overview");
	const [showFilters, setShowFilters] = useState(false);
	const [compareMode, setCompareMode] = useState(false);
	const [chartType, setChartType] = useState("line");

	// Enhanced mock data for comprehensive demonstration
	const mockBusinessMetrics = {
		total_revenue: 285640.75,
		monthly_revenue: 47607.13,
		revenue_growth: 12.4, // percentage
		total_jobs: 245,
		completed_jobs: 220,
		pending_jobs: 15,
		cancelled_jobs: 10,
		job_completion_rate: 89.8, // percentage
		avg_job_value: 1165.47,
		total_customers: 156,
		new_customers_monthly: 12,
		customer_retention_rate: 94.2, // percentage
		total_invoices: 178,
		paid_invoices: 145,
		overdue_invoices: 23,
		collection_rate: 81.5, // percentage
		avg_payment_time: 18.3, // days
		total_technicians: 8,
		utilization_rate: 78.5, // percentage
		customer_satisfaction: 4.7, // out of 5
		first_time_fix_rate: 85.2, // percentage
		response_time: 2.4, // hours
	};

	const mockRevenueData = [
		{ month: "Jan", revenue: 38420, target: 40000, jobs: 42, avg_value: 914 },
		{ month: "Feb", revenue: 41250, target: 40000, jobs: 38, avg_value: 1085 },
		{ month: "Mar", revenue: 45680, target: 42000, jobs: 45, avg_value: 1015 },
		{ month: "Apr", revenue: 43920, target: 42000, jobs: 41, avg_value: 1071 },
		{ month: "May", revenue: 48750, target: 45000, jobs: 47, avg_value: 1037 },
		{ month: "Jun", revenue: 52340, target: 45000, jobs: 49, avg_value: 1068 },
		{ month: "Jul", revenue: 49850, target: 47000, jobs: 44, avg_value: 1133 },
		{ month: "Aug", revenue: 51620, target: 47000, jobs: 46, avg_value: 1122 },
		{ month: "Sep", revenue: 47890, target: 48000, jobs: 43, avg_value: 1114 },
		{ month: "Oct", revenue: 54320, target: 48000, jobs: 51, avg_value: 1065 },
		{ month: "Nov", revenue: 58940, target: 50000, jobs: 54, avg_value: 1092 },
		{ month: "Dec", revenue: 61250, target: 50000, jobs: 56, avg_value: 1094 },
	];

	const mockTechnicianData = [
		{
			id: "TECH001",
			name: "David Brown",
			jobs_completed: 68,
			avg_rating: 4.9,
			revenue_generated: 78540,
			efficiency_score: 92,
			first_time_fix: 88,
			response_time: 1.8,
			utilization: 85,
			specialties: ["HVAC", "Electrical"],
		},
		{
			id: "TECH002",
			name: "Mike Wilson",
			jobs_completed: 72,
			avg_rating: 4.8,
			revenue_generated: 84320,
			efficiency_score: 89,
			first_time_fix: 84,
			response_time: 2.1,
			utilization: 88,
			specialties: ["Electrical", "Security"],
		},
		{
			id: "TECH003",
			name: "Lisa Chen",
			jobs_completed: 64,
			avg_rating: 4.7,
			revenue_generated: 71280,
			efficiency_score: 86,
			first_time_fix: 82,
			response_time: 2.3,
			utilization: 78,
			specialties: ["Plumbing", "General"],
		},
		{
			id: "TECH004",
			name: "Tom Garcia",
			jobs_completed: 58,
			avg_rating: 4.6,
			revenue_generated: 65490,
			efficiency_score: 84,
			first_time_fix: 79,
			response_time: 2.6,
			utilization: 75,
			specialties: ["Security", "General"],
		},
	];

	const mockCustomerMetrics = {
		total_customers: 156,
		new_customers: 12,
		repeat_customers: 87,
		customer_lifetime_value: 3840,
		acquisition_cost: 245,
		retention_rate: 94.2,
		satisfaction_score: 4.7,
		referral_rate: 28.5,
		segments: {
			residential: { count: 98, revenue: 156430, avg_value: 1596 },
			commercial: { count: 58, revenue: 129210, avg_value: 2228 },
		},
		top_customers: [
			{ name: "ABC Manufacturing", revenue: 15840, jobs: 12 },
			{ name: "Green Valley Restaurant", revenue: 12450, jobs: 8 },
			{ name: "Office Park Complex", revenue: 11230, jobs: 9 },
		],
	};

	const mockOperationalMetrics = {
		job_metrics: {
			completion_rate: 89.8,
			on_time_completion: 92.4,
			first_time_fix: 85.2,
			rework_rate: 4.8,
			cancellation_rate: 4.1,
		},
		efficiency_metrics: {
			avg_job_duration: 3.2, // hours
			travel_time_ratio: 18.5, // percentage
			utilization_rate: 78.5,
			overtime_hours: 124,
			productivity_score: 87.3,
		},
		quality_metrics: {
			customer_satisfaction: 4.7,
			complaint_rate: 2.3,
			callback_rate: 6.1,
			warranty_claims: 1.8,
			safety_incidents: 0,
		},
	};

	const mockFinancialTrends = {
		revenue_trend: {
			current_month: 58940,
			previous_month: 54320,
			growth: 8.5,
			ytd_revenue: 595640,
			ytd_growth: 15.3,
		},
		profitability: {
			gross_margin: 62.4,
			net_margin: 18.7,
			operating_expenses: 234520,
			cost_per_job: 425,
		},
		cash_flow: {
			operating_cash_flow: 89640,
			accounts_receivable: 45230,
			days_sales_outstanding: 28.5,
			working_capital: 156780,
		},
	};

	const mockCustomReports = [
		{
			id: "RPT001",
			name: "Monthly Performance Report",
			description: "Comprehensive monthly business performance analysis",
			type: "performance",
			schedule: "monthly",
			last_generated: "2024-01-01T00:00:00Z",
			format: "PDF",
			recipients: ["owner@company.com", "manager@company.com"],
		},
		{
			id: "RPT002",
			name: "Technician Efficiency Report",
			description: "Individual technician performance and efficiency metrics",
			type: "operational",
			schedule: "weekly",
			last_generated: "2024-01-15T00:00:00Z",
			format: "Excel",
			recipients: ["hr@company.com"],
		},
		{
			id: "RPT003",
			name: "Customer Satisfaction Analysis",
			description: "Customer feedback analysis and satisfaction trends",
			type: "customer",
			schedule: "quarterly",
			last_generated: "2023-12-31T00:00:00Z",
			format: "PDF",
			recipients: ["owner@company.com"],
		},
	];

	useEffect(() => {
		// Initialize with mock data for demonstration
		// In real implementation, this would fetch data based on dateRange and other filters
	}, [dateRange, selectedMetric]);

	// Helper functions
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	};

	const formatPercentage = (value) => {
		return `${value.toFixed(1)}%`;
	};

	const getGrowthColor = (growth) => {
		if (growth > 0) return "text-green-600";
		if (growth < 0) return "text-red-600";
		return "text-gray-600";
	};

	const getGrowthIcon = (growth) => {
		if (growth > 0) return <ArrowUp className="w-4 h-4" />;
		if (growth < 0) return <ArrowDown className="w-4 h-4" />;
		return <Minus className="w-4 h-4" />;
	};

	const getPerformanceColor = (value, benchmark) => {
		if (value >= benchmark * 1.1) return "text-green-600";
		if (value >= benchmark * 0.9) return "text-yellow-600";
		return "text-red-600";
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Business Header Component */}
			<Header />

			<div className="p-6">
				<div className="max-w-7xl mx-auto space-y-6">
					{/* Analytics Header */}
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="space-y-1">
							<h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
							<p className="text-muted-foreground">Comprehensive business intelligence and performance insights</p>
						</div>
						<div className="flex flex-wrap gap-2">
							<Select value={dateRange} onValueChange={setDateRange}>
								<SelectTrigger className="w-[140px]">
									<CalendarIcon className="w-4 h-4 mr-2" />
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="7d">Last 7 days</SelectItem>
									<SelectItem value="30d">Last 30 days</SelectItem>
									<SelectItem value="90d">Last 90 days</SelectItem>
									<SelectItem value="12m">Last 12 months</SelectItem>
									<SelectItem value="ytd">Year to date</SelectItem>
									<SelectItem value="custom">Custom range</SelectItem>
								</SelectContent>
							</Select>
							<Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
								<Filter className="w-4 h-4 mr-2" />
								{showFilters ? "Hide Filters" : "Show Filters"}
							</Button>
							<Button variant="outline" size="sm" onClick={() => setCompareMode(!compareMode)}>
								<BarChart3 className="w-4 h-4 mr-2" />
								{compareMode ? "Exit Compare" : "Compare"}
							</Button>
							<Button variant="outline" size="sm">
								<Download className="w-4 h-4 mr-2" />
								Export
							</Button>
							<Button variant="outline" size="sm">
								<RefreshCw className="w-4 h-4 mr-2" />
								Refresh
							</Button>
							<Button size="sm">
								<Plus className="w-4 h-4 mr-2" />
								New Report
							</Button>
						</div>
					</div>

					{/* Key Performance Indicators */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
										<p className="text-2xl font-bold text-green-600">{formatCurrency(mockBusinessMetrics.total_revenue)}</p>
										<div className="flex items-center gap-1 mt-1">
											{getGrowthIcon(mockBusinessMetrics.revenue_growth)}
											<span className={`text-xs ${getGrowthColor(mockBusinessMetrics.revenue_growth)}`}>{formatPercentage(mockBusinessMetrics.revenue_growth)} vs last month</span>
										</div>
									</div>
									<DollarSign className="w-8 h-8 text-green-600" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Jobs Completed</p>
										<p className="text-2xl font-bold text-blue-600">{mockBusinessMetrics.completed_jobs}</p>
										<div className="flex items-center gap-1 mt-1">
											<Progress value={mockBusinessMetrics.job_completion_rate} className="h-1 w-16" />
											<span className="text-xs text-muted-foreground">{formatPercentage(mockBusinessMetrics.job_completion_rate)} rate</span>
										</div>
									</div>
									<CheckCircle className="w-8 h-8 text-blue-600" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Customer Satisfaction</p>
										<p className="text-2xl font-bold text-yellow-600">{mockBusinessMetrics.customer_satisfaction}</p>
										<div className="flex items-center gap-1 mt-1">
											<Star className="w-3 h-3 text-yellow-500 fill-current" />
											<span className="text-xs text-muted-foreground">out of 5.0</span>
										</div>
									</div>
									<Star className="w-8 h-8 text-yellow-600" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Collection Rate</p>
										<p className="text-2xl font-bold text-purple-600">{formatPercentage(mockBusinessMetrics.collection_rate)}</p>
										<div className="flex items-center gap-1 mt-1">
											<Timer className="w-3 h-3" />
											<span className="text-xs text-muted-foreground">{mockBusinessMetrics.avg_payment_time} days avg</span>
										</div>
									</div>
									<Target className="w-8 h-8 text-purple-600" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Utilization Rate</p>
										<p className="text-2xl font-bold text-orange-600">{formatPercentage(mockBusinessMetrics.utilization_rate)}</p>
										<div className="flex items-center gap-1 mt-1">
											<Users className="w-3 h-3" />
											<span className="text-xs text-muted-foreground">{mockBusinessMetrics.total_technicians} technicians</span>
										</div>
									</div>
									<Activity className="w-8 h-8 text-orange-600" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Response Time</p>
										<p className="text-2xl font-bold text-red-600">{mockBusinessMetrics.response_time}h</p>
										<div className="flex items-center gap-1 mt-1">
											<Clock className="w-3 h-3" />
											<span className="text-xs text-muted-foreground">average response</span>
										</div>
									</div>
									<Clock className="w-8 h-8 text-red-600" />
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Tabbed Analytics Interface */}
					<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
						<TabsList className="grid w-full grid-cols-6">
							<TabsTrigger value="overview">Overview</TabsTrigger>
							<TabsTrigger value="revenue">Revenue</TabsTrigger>
							<TabsTrigger value="operations">Operations</TabsTrigger>
							<TabsTrigger value="customers">Customers</TabsTrigger>
							<TabsTrigger value="technicians">Technicians</TabsTrigger>
							<TabsTrigger value="reports">Reports</TabsTrigger>
						</TabsList>

						<TabsContent value="overview" className="space-y-6">
							{/* Overview Dashboard */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Revenue Trend Chart */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<TrendingUp className="w-5 h-5" />
											Revenue Trend
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="flex justify-between items-center text-sm">
												<span>Monthly Target Achievement</span>
												<span className="font-semibold text-green-600">118% avg</span>
											</div>
											<div className="h-64 bg-muted rounded flex items-center justify-center">
												<div className="text-center text-muted-foreground">
													<BarChart3 className="w-16 h-16 mx-auto mb-2" />
													<p>Revenue trend chart would be displayed here</p>
													<p className="text-sm">Interactive chart showing monthly revenue vs targets</p>
												</div>
											</div>
											<div className="grid grid-cols-3 gap-4 text-center">
												<div>
													<p className="text-2xl font-bold text-green-600">{formatCurrency(mockRevenueData[mockRevenueData.length - 1].revenue)}</p>
													<p className="text-xs text-muted-foreground">This Month</p>
												</div>
												<div>
													<p className="text-2xl font-bold text-blue-600">{formatCurrency(mockRevenueData.reduce((sum, m) => sum + m.revenue, 0))}</p>
													<p className="text-xs text-muted-foreground">Year to Date</p>
												</div>
												<div>
													<p className="text-2xl font-bold text-purple-600">{formatCurrency(mockRevenueData.reduce((sum, m) => sum + m.target, 0))}</p>
													<p className="text-xs text-muted-foreground">Annual Target</p>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Job Performance Overview */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Activity className="w-5 h-5" />
											Job Performance
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="grid grid-cols-2 gap-4">
												<div className="space-y-2">
													<div className="flex justify-between text-sm">
														<span>Completion Rate</span>
														<span className="font-semibold">{formatPercentage(mockOperationalMetrics.job_metrics.completion_rate)}</span>
													</div>
													<Progress value={mockOperationalMetrics.job_metrics.completion_rate} className="h-2" />
												</div>
												<div className="space-y-2">
													<div className="flex justify-between text-sm">
														<span>On-Time Rate</span>
														<span className="font-semibold">{formatPercentage(mockOperationalMetrics.job_metrics.on_time_completion)}</span>
													</div>
													<Progress value={mockOperationalMetrics.job_metrics.on_time_completion} className="h-2" />
												</div>
												<div className="space-y-2">
													<div className="flex justify-between text-sm">
														<span>First-Time Fix</span>
														<span className="font-semibold">{formatPercentage(mockOperationalMetrics.job_metrics.first_time_fix)}</span>
													</div>
													<Progress value={mockOperationalMetrics.job_metrics.first_time_fix} className="h-2" />
												</div>
												<div className="space-y-2">
													<div className="flex justify-between text-sm">
														<span>Customer Satisfaction</span>
														<span className="font-semibold">{mockOperationalMetrics.quality_metrics.customer_satisfaction}/5.0</span>
													</div>
													<Progress value={(mockOperationalMetrics.quality_metrics.customer_satisfaction / 5) * 100} className="h-2" />
												</div>
											</div>
											<div className="pt-4 border-t">
												<div className="grid grid-cols-3 gap-4 text-center">
													<div>
														<p className="text-2xl font-bold text-blue-600">{mockBusinessMetrics.completed_jobs}</p>
														<p className="text-xs text-muted-foreground">Completed</p>
													</div>
													<div>
														<p className="text-2xl font-bold text-yellow-600">{mockBusinessMetrics.pending_jobs}</p>
														<p className="text-xs text-muted-foreground">Pending</p>
													</div>
													<div>
														<p className="text-2xl font-bold text-red-600">{mockBusinessMetrics.cancelled_jobs}</p>
														<p className="text-xs text-muted-foreground">Cancelled</p>
													</div>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Financial Health */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<DollarSign className="w-5 h-5" />
											Financial Health
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="grid grid-cols-2 gap-4">
												<div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
													<p className="text-2xl font-bold text-green-600">{formatPercentage(mockFinancialTrends.profitability.gross_margin)}</p>
													<p className="text-sm text-muted-foreground">Gross Margin</p>
												</div>
												<div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
													<p className="text-2xl font-bold text-blue-600">{formatPercentage(mockFinancialTrends.profitability.net_margin)}</p>
													<p className="text-sm text-muted-foreground">Net Margin</p>
												</div>
											</div>
											<div className="space-y-3">
												<div className="flex justify-between items-center">
													<span className="text-sm">Operating Cash Flow</span>
													<span className="font-semibold text-green-600">{formatCurrency(mockFinancialTrends.cash_flow.operating_cash_flow)}</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="text-sm">Accounts Receivable</span>
													<span className="font-semibold text-orange-600">{formatCurrency(mockFinancialTrends.cash_flow.accounts_receivable)}</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="text-sm">Working Capital</span>
													<span className="font-semibold text-blue-600">{formatCurrency(mockFinancialTrends.cash_flow.working_capital)}</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="text-sm">Days Sales Outstanding</span>
													<span className="font-semibold text-purple-600">{mockFinancialTrends.cash_flow.days_sales_outstanding} days</span>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Customer Analytics Summary */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Users className="w-5 h-5" />
											Customer Insights
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="grid grid-cols-2 gap-4">
												<div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
													<p className="text-2xl font-bold text-purple-600">{mockCustomerMetrics.total_customers}</p>
													<p className="text-sm text-muted-foreground">Total Customers</p>
												</div>
												<div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
													<p className="text-2xl font-bold text-green-600">{formatPercentage(mockCustomerMetrics.retention_rate)}</p>
													<p className="text-sm text-muted-foreground">Retention Rate</p>
												</div>
											</div>
											<div className="space-y-3">
												<div className="flex justify-between items-center">
													<span className="text-sm">New Customers</span>
													<span className="font-semibold text-green-600">+{mockCustomerMetrics.new_customers} this month</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="text-sm">Customer Lifetime Value</span>
													<span className="font-semibold text-blue-600">{formatCurrency(mockCustomerMetrics.customer_lifetime_value)}</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="text-sm">Acquisition Cost</span>
													<span className="font-semibold text-orange-600">{formatCurrency(mockCustomerMetrics.acquisition_cost)}</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="text-sm">Referral Rate</span>
													<span className="font-semibold text-purple-600">{formatPercentage(mockCustomerMetrics.referral_rate)}</span>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						<TabsContent value="revenue" className="space-y-6">
							{/* Revenue Analytics */}
							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<BarChart3 className="w-5 h-5" />
											Revenue Analytics Dashboard
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="h-96 bg-muted rounded flex items-center justify-center">
											<div className="text-center text-muted-foreground">
												<LineChart className="w-24 h-24 mx-auto mb-4" />
												<h3 className="text-lg font-semibold mb-2">Interactive Revenue Dashboard</h3>
												<p>Advanced revenue analytics with multiple chart types</p>
												<p className="text-sm">Line charts, bar charts, and revenue breakdowns</p>
											</div>
										</div>
									</CardContent>
								</Card>

								<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
									{/* Revenue by Service Type */}
									<Card>
										<CardHeader>
											<CardTitle className="text-lg">Revenue by Service</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-3">
												<div className="flex justify-between items-center">
													<span className="text-sm">HVAC Services</span>
													<span className="font-semibold">{formatCurrency(124580)}</span>
												</div>
												<Progress value={65} className="h-2" />
												<div className="flex justify-between items-center">
													<span className="text-sm">Electrical</span>
													<span className="font-semibold">{formatCurrency(89420)}</span>
												</div>
												<Progress value={47} className="h-2" />
												<div className="flex justify-between items-center">
													<span className="text-sm">Plumbing</span>
													<span className="font-semibold">{formatCurrency(56780)}</span>
												</div>
												<Progress value={30} className="h-2" />
												<div className="flex justify-between items-center">
													<span className="text-sm">Security Systems</span>
													<span className="font-semibold">{formatCurrency(34920)}</span>
												</div>
												<Progress value={18} className="h-2" />
											</div>
										</CardContent>
									</Card>

									{/* Monthly Targets */}
									<Card>
										<CardHeader>
											<CardTitle className="text-lg">Target Achievement</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-4">
												<div className="text-center">
													<p className="text-3xl font-bold text-green-600">118%</p>
													<p className="text-sm text-muted-foreground">Average Achievement</p>
												</div>
												<div className="space-y-3">
													{mockRevenueData.slice(-6).map((month, idx) => (
														<div key={idx} className="flex justify-between items-center">
															<span className="text-sm">{month.month}</span>
															<div className="flex items-center gap-2">
																<span className={`text-sm font-semibold ${month.revenue >= month.target ? "text-green-600" : "text-red-600"}`}>
																	{Math.round((month.revenue / month.target) * 100)}%
																</span>
																{month.revenue >= month.target ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
															</div>
														</div>
													))}
												</div>
											</div>
										</CardContent>
									</Card>

									{/* Revenue Forecasting */}
									<Card>
										<CardHeader>
											<CardTitle className="text-lg">Revenue Forecast</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-4">
												<div className="text-center">
													<p className="text-3xl font-bold text-blue-600">{formatCurrency(675000)}</p>
													<p className="text-sm text-muted-foreground">Projected Annual Revenue</p>
												</div>
												<div className="space-y-3">
													<div className="flex justify-between items-center">
														<span className="text-sm">Q1 Forecast</span>
														<span className="font-semibold">{formatCurrency(156750)}</span>
													</div>
													<div className="flex justify-between items-center">
														<span className="text-sm">Q2 Forecast</span>
														<span className="font-semibold">{formatCurrency(168250)}</span>
													</div>
													<div className="flex justify-between items-center">
														<span className="text-sm">Q3 Forecast</span>
														<span className="font-semibold">{formatCurrency(172500)}</span>
													</div>
													<div className="flex justify-between items-center">
														<span className="text-sm">Q4 Forecast</span>
														<span className="font-semibold">{formatCurrency(177500)}</span>
													</div>
												</div>
												<div className="pt-3 border-t">
													<div className="flex items-center justify-center gap-2 text-green-600">
														<TrendingUp className="w-4 h-4" />
														<span className="text-sm font-semibold">15.3% projected growth</span>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="operations" className="space-y-6">
							{/* Operational Analytics */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Activity className="w-5 h-5" />
											Operational Efficiency
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="grid grid-cols-2 gap-4">
												<div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
													<p className="text-2xl font-bold text-blue-600">{formatPercentage(mockOperationalMetrics.efficiency_metrics.utilization_rate)}</p>
													<p className="text-sm text-muted-foreground">Utilization Rate</p>
												</div>
												<div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
													<p className="text-2xl font-bold text-green-600">{mockOperationalMetrics.efficiency_metrics.avg_job_duration}h</p>
													<p className="text-sm text-muted-foreground">Avg Job Duration</p>
												</div>
											</div>
											<div className="space-y-3">
												<div className="flex justify-between items-center">
													<span className="text-sm">Travel Time Ratio</span>
													<span className="font-semibold">{formatPercentage(mockOperationalMetrics.efficiency_metrics.travel_time_ratio)}</span>
												</div>
												<Progress value={mockOperationalMetrics.efficiency_metrics.travel_time_ratio} className="h-2" />
												<div className="flex justify-between items-center">
													<span className="text-sm">Productivity Score</span>
													<span className="font-semibold">{mockOperationalMetrics.efficiency_metrics.productivity_score}/100</span>
												</div>
												<Progress value={mockOperationalMetrics.efficiency_metrics.productivity_score} className="h-2" />
												<div className="flex justify-between items-center">
													<span className="text-sm">Overtime Hours</span>
													<span className="font-semibold">{mockOperationalMetrics.efficiency_metrics.overtime_hours}h</span>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Target className="w-5 h-5" />
											Quality Metrics
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="grid grid-cols-2 gap-4">
												<div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
													<p className="text-2xl font-bold text-yellow-600">{mockOperationalMetrics.quality_metrics.customer_satisfaction}</p>
													<p className="text-sm text-muted-foreground">Customer Rating</p>
												</div>
												<div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
													<p className="text-2xl font-bold text-green-600">{formatPercentage(mockOperationalMetrics.job_metrics.first_time_fix)}</p>
													<p className="text-sm text-muted-foreground">First-Time Fix</p>
												</div>
											</div>
											<div className="space-y-3">
												<div className="flex justify-between items-center">
													<span className="text-sm">Complaint Rate</span>
													<span className="font-semibold text-red-600">{formatPercentage(mockOperationalMetrics.quality_metrics.complaint_rate)}</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="text-sm">Callback Rate</span>
													<span className="font-semibold text-orange-600">{formatPercentage(mockOperationalMetrics.quality_metrics.callback_rate)}</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="text-sm">Warranty Claims</span>
													<span className="font-semibold text-yellow-600">{formatPercentage(mockOperationalMetrics.quality_metrics.warranty_claims)}</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="text-sm">Safety Incidents</span>
													<span className="font-semibold text-green-600">{mockOperationalMetrics.quality_metrics.safety_incidents}</span>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						<TabsContent value="customers" className="space-y-6">
							{/* Customer Analytics */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Users className="w-5 h-5" />
											Customer Segmentation
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="grid grid-cols-2 gap-4">
												<div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
													<p className="text-2xl font-bold text-blue-600">{mockCustomerMetrics.segments.residential.count}</p>
													<p className="text-sm text-muted-foreground">Residential</p>
													<p className="text-xs text-muted-foreground">{formatCurrency(mockCustomerMetrics.segments.residential.avg_value)} avg</p>
												</div>
												<div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
													<p className="text-2xl font-bold text-purple-600">{mockCustomerMetrics.segments.commercial.count}</p>
													<p className="text-sm text-muted-foreground">Commercial</p>
													<p className="text-xs text-muted-foreground">{formatCurrency(mockCustomerMetrics.segments.commercial.avg_value)} avg</p>
												</div>
											</div>
											<div className="space-y-3">
												<div className="flex justify-between items-center">
													<span className="text-sm">Lifetime Value</span>
													<span className="font-semibold">{formatCurrency(mockCustomerMetrics.customer_lifetime_value)}</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="text-sm">Acquisition Cost</span>
													<span className="font-semibold">{formatCurrency(mockCustomerMetrics.acquisition_cost)}</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="text-sm">Retention Rate</span>
													<span className="font-semibold text-green-600">{formatPercentage(mockCustomerMetrics.retention_rate)}</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="text-sm">Referral Rate</span>
													<span className="font-semibold text-purple-600">{formatPercentage(mockCustomerMetrics.referral_rate)}</span>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Award className="w-5 h-5" />
											Top Customers
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{mockCustomerMetrics.top_customers.map((customer, idx) => (
												<div key={idx} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
													<div>
														<p className="font-semibold">{customer.name}</p>
														<p className="text-sm text-muted-foreground">{customer.jobs} jobs completed</p>
													</div>
													<div className="text-right">
														<p className="font-bold text-green-600">{formatCurrency(customer.revenue)}</p>
														<p className="text-xs text-muted-foreground">total revenue</p>
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						<TabsContent value="technicians" className="space-y-6">
							{/* Technician Performance */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Users className="w-5 h-5" />
										Technician Performance Dashboard
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-6">
										{mockTechnicianData.map((tech) => (
											<div key={tech.id} className="p-4 border rounded-lg">
												<div className="flex justify-between items-start mb-4">
													<div>
														<h4 className="font-semibold text-lg">{tech.name}</h4>
														<div className="flex gap-2 mt-1">
															{tech.specialties.map((specialty) => (
																<Badge key={specialty} variant="secondary" className="text-xs">
																	{specialty}
																</Badge>
															))}
														</div>
													</div>
													<div className="text-right">
														<p className="font-bold text-green-600">{formatCurrency(tech.revenue_generated)}</p>
														<p className="text-sm text-muted-foreground">Revenue Generated</p>
													</div>
												</div>
												<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
													<div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded">
														<p className="text-2xl font-bold text-blue-600">{tech.jobs_completed}</p>
														<p className="text-xs text-muted-foreground">Jobs Completed</p>
													</div>
													<div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded">
														<p className="text-2xl font-bold text-yellow-600">{tech.avg_rating}</p>
														<p className="text-xs text-muted-foreground">Avg Rating</p>
													</div>
													<div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded">
														<p className="text-2xl font-bold text-green-600">{formatPercentage(tech.first_time_fix)}</p>
														<p className="text-xs text-muted-foreground">First-Time Fix</p>
													</div>
													<div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded">
														<p className="text-2xl font-bold text-purple-600">{formatPercentage(tech.utilization)}</p>
														<p className="text-xs text-muted-foreground">Utilization</p>
													</div>
												</div>
												<div className="mt-4 grid grid-cols-2 gap-4 text-sm">
													<div className="flex justify-between">
														<span>Efficiency Score:</span>
														<span className="font-semibold">{tech.efficiency_score}/100</span>
													</div>
													<div className="flex justify-between">
														<span>Response Time:</span>
														<span className="font-semibold">{tech.response_time}h</span>
													</div>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="reports" className="space-y-6">
							{/* Custom Reports */}
							<Card>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle className="flex items-center gap-2">
											<FileText className="w-5 h-5" />
											Custom Reports & Scheduled Analytics
										</CardTitle>
										<Button size="sm">
											<Plus className="w-4 h-4 mr-2" />
											Create Report
										</Button>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{mockCustomReports.map((report) => (
											<div key={report.id} className="p-4 border rounded-lg">
												<div className="flex justify-between items-start">
													<div className="flex-1">
														<div className="flex items-center gap-3 mb-2">
															<h4 className="font-semibold">{report.name}</h4>
															<Badge variant="outline">{report.type}</Badge>
															<Badge variant="secondary">{report.schedule}</Badge>
														</div>
														<p className="text-sm text-muted-foreground mb-3">{report.description}</p>
														<div className="flex items-center gap-4 text-xs text-muted-foreground">
															<span>Format: {report.format}</span>
															<span>Last Generated: {format(new Date(report.last_generated), "MMM d, yyyy")}</span>
															<span>Recipients: {report.recipients.length}</span>
														</div>
													</div>
													<div className="flex gap-2">
														<Button size="sm" variant="outline">
															<Eye className="w-4 h-4 mr-1" />
															View
														</Button>
														<Button size="sm" variant="outline">
															<Download className="w-4 h-4 mr-1" />
															Download
														</Button>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button size="sm" variant="outline">
																	<MoreHorizontal className="w-4 h-4" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent>
																<DropdownMenuItem>
																	<Edit className="w-4 h-4 mr-2" />
																	Edit Report
																</DropdownMenuItem>
																<DropdownMenuItem>
																	<RefreshCw className="w-4 h-4 mr-2" />
																	Generate Now
																</DropdownMenuItem>
																<DropdownMenuItem>
																	<Share className="w-4 h-4 mr-2" />
																	Share Report
																</DropdownMenuItem>
																<DropdownMenuSeparator />
																<DropdownMenuItem>
																	<Settings className="w-4 h-4 mr-2" />
																	Configure
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</div>
												</div>
											</div>
										))}
									</div>
									<div className="mt-6 text-center py-8 border-t">
										<FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
										<h3 className="text-lg font-semibold mb-2">Advanced Reporting Engine</h3>
										<p className="text-muted-foreground mb-4">Create custom reports with automated scheduling and distribution</p>
										<Button>
											<Plus className="w-4 h-4 mr-2" />
											Create Your First Custom Report
										</Button>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
