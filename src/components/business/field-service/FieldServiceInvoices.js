"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Progress } from "@components/ui/progress";
import {
	Receipt,
	Plus,
	Filter,
	Download,
	Search,
	Eye,
	Edit,
	Send,
	CheckCircle,
	XCircle,
	Clock,
	TrendingUp,
	Calendar,
	User,
	Building,
	Phone,
	Mail,
	MoreHorizontal,
	Copy,
	Trash2,
	AlertTriangle,
	RefreshCw,
	BarChart3,
	Activity,
	CreditCard,
	Banknote,
	Wallet,
	Calculator,
	FileText,
	Timer,
	Archive,
	ChevronDown,
	MessageSquare,
	Paperclip,
	Target,
	Tag,
	Repeat,
	Bell,
	PrinterIcon,
	BookOpen,
	Coins,
	Landmark,
	Globe,
	Flag,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import Header from "@components/business/header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@components/ui/dropdown-menu";
import { Checkbox } from "@components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

/**
 * Comprehensive Field Service Invoices & Payments Management System
 * Advanced invoice creation, payment tracking, aging reports, and financial analytics
 */
export default function FieldServiceInvoices({ user, userRole, initialInvoices = [], invoiceStats = null, agingReport = [], paymentMethods = [], taxSettings = [], invoiceTemplates = [], recurringInvoices = [] }) {
	const [invoices, setInvoices] = useState(initialInvoices);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [selectedDateRange, setSelectedDateRange] = useState("all");
	const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
	const [selectedCustomerType, setSelectedCustomerType] = useState("all");
	const [sortBy, setSortBy] = useState("created_at");
	const [sortOrder, setSortOrder] = useState("desc");
	const [selectedInvoices, setSelectedInvoices] = useState([]);
	const [viewMode, setViewMode] = useState("list");
	const [showFilters, setShowFilters] = useState(false);
	const [activeTab, setActiveTab] = useState("invoices");

	// Enhanced mock data for comprehensive demonstration
	const mockInvoices = [
		{
			id: "INV001",
			invoice_number: "INV-2024-001",
			customer_id: "CUST001",
			customer_name: "John Smith",
			customer_company: null,
			customer_type: "residential",
			customer_email: "john.smith@email.com",
			customer_phone: "(555) 123-4567",
			job_id: "JOB001",
			job_title: "HVAC System Replacement",
			estimate_id: "EST001",
			status: "sent",
			payment_status: "pending",
			priority: "normal",
			created_at: "2024-01-15T10:30:00Z",
			updated_at: "2024-01-15T14:20:00Z",
			due_date: "2024-02-14T23:59:59Z",
			sent_date: "2024-01-15T14:20:00Z",
			viewed_date: "2024-01-16T09:15:00Z",
			paid_date: null,
			subtotal: 4671.25,
			tax_rate: 8.25,
			tax_amount: 385.38,
			discount_amount: 200.0,
			total_amount: 4856.63,
			paid_amount: 0.0,
			balance_due: 4856.63,
			payment_terms: "Net 30",
			payment_method_preference: "Credit Card",
			late_fee_applied: false,
			late_fee_amount: 0.0,
			created_by: "Owner",
			invoice_type: "standard",
			recurring_schedule_id: null,
			line_items_count: 8,
			payments_count: 0,
			notes_count: 1,
			attachments_count: 2,
			last_reminder_sent: null,
			reminder_count: 0,
			days_overdue: 0,
			aging_bucket: "current",
			collection_status: "normal",
			write_off_amount: 0.0,
			credit_applied: 0.0,
			tags: ["hvac", "residential", "high-value"],
		},
		{
			id: "INV002",
			invoice_number: "INV-2024-002",
			customer_id: "CUST002",
			customer_name: "ABC Manufacturing Corp",
			customer_company: "ABC Manufacturing Corp",
			customer_type: "commercial",
			customer_email: "accounts@abcmfg.com",
			customer_phone: "(555) 456-7890",
			job_id: "JOB002",
			job_title: "Electrical Panel Upgrade",
			estimate_id: "EST002",
			status: "paid",
			payment_status: "paid_full",
			priority: "normal",
			created_at: "2024-01-10T11:15:00Z",
			updated_at: "2024-01-25T16:30:00Z",
			due_date: "2024-02-09T23:59:59Z",
			sent_date: "2024-01-10T15:00:00Z",
			viewed_date: "2024-01-11T08:30:00Z",
			paid_date: "2024-01-25T16:30:00Z",
			subtotal: 13031.25,
			tax_rate: 8.25,
			tax_amount: 1075.08,
			discount_amount: 500.0,
			total_amount: 13606.33,
			paid_amount: 13606.33,
			balance_due: 0.0,
			payment_terms: "Net 30",
			payment_method_preference: "ACH Transfer",
			late_fee_applied: false,
			late_fee_amount: 0.0,
			created_by: "Office Staff",
			invoice_type: "standard",
			recurring_schedule_id: null,
			line_items_count: 12,
			payments_count: 2,
			notes_count: 3,
			attachments_count: 4,
			last_reminder_sent: null,
			reminder_count: 0,
			days_overdue: 0,
			aging_bucket: "current",
			collection_status: "normal",
			write_off_amount: 0.0,
			credit_applied: 0.0,
			tags: ["commercial", "electrical", "paid"],
		},
		{
			id: "INV003",
			invoice_number: "INV-2024-003",
			customer_id: "CUST003",
			customer_name: "Sarah Johnson",
			customer_company: null,
			customer_type: "residential",
			customer_email: "sarah.j@home.com",
			customer_phone: "(555) 234-5678",
			job_id: "JOB003",
			job_title: "Kitchen Plumbing Renovation",
			estimate_id: "EST003",
			status: "overdue",
			payment_status: "overdue",
			priority: "high",
			created_at: "2023-12-15T13:45:00Z",
			updated_at: "2024-01-20T10:15:00Z",
			due_date: "2024-01-14T23:59:59Z",
			sent_date: "2023-12-15T16:00:00Z",
			viewed_date: "2023-12-16T11:20:00Z",
			paid_date: null,
			subtotal: 3031.0,
			tax_rate: 8.25,
			tax_amount: 250.06,
			discount_amount: 0.0,
			total_amount: 3281.06,
			paid_amount: 1000.0,
			balance_due: 2281.06,
			payment_terms: "Due on completion",
			payment_method_preference: "Cash",
			late_fee_applied: true,
			late_fee_amount: 25.0,
			created_by: "Owner",
			invoice_type: "standard",
			recurring_schedule_id: null,
			line_items_count: 6,
			payments_count: 1,
			notes_count: 4,
			attachments_count: 1,
			last_reminder_sent: "2024-01-20T10:15:00Z",
			reminder_count: 3,
			days_overdue: 15,
			aging_bucket: "15_days",
			collection_status: "follow_up_needed",
			write_off_amount: 0.0,
			credit_applied: 0.0,
			tags: ["residential", "plumbing", "overdue", "partial-payment"],
		},
		{
			id: "INV004",
			invoice_number: "INV-2024-004",
			customer_id: "CUST004",
			customer_name: "Green Valley Restaurant",
			customer_company: "Green Valley Restaurant",
			customer_type: "commercial",
			customer_email: "accounts@greenvalley.com",
			customer_phone: "(555) 345-6789",
			job_id: "JOB004",
			job_title: "Commercial Kitchen Maintenance",
			estimate_id: "EST004",
			status: "draft",
			payment_status: "not_sent",
			priority: "normal",
			created_at: "2024-01-20T10:20:00Z",
			updated_at: "2024-01-20T10:20:00Z",
			due_date: "2024-02-19T23:59:59Z",
			sent_date: null,
			viewed_date: null,
			paid_date: null,
			subtotal: 6195.0,
			tax_rate: 8.25,
			tax_amount: 511.09,
			discount_amount: 300.0,
			total_amount: 6406.09,
			paid_amount: 0.0,
			balance_due: 6406.09,
			payment_terms: "Net 30",
			payment_method_preference: "Check",
			late_fee_applied: false,
			late_fee_amount: 0.0,
			created_by: "Office Staff",
			invoice_type: "recurring",
			recurring_schedule_id: "REC001",
			line_items_count: 4,
			payments_count: 0,
			notes_count: 1,
			attachments_count: 3,
			last_reminder_sent: null,
			reminder_count: 0,
			days_overdue: 0,
			aging_bucket: "current",
			collection_status: "normal",
			write_off_amount: 0.0,
			credit_applied: 0.0,
			tags: ["commercial", "recurring", "draft"],
		},
		{
			id: "INV005",
			invoice_number: "INV-2024-005",
			customer_id: "CUST005",
			customer_name: "Robert Chen",
			customer_company: null,
			customer_type: "residential",
			customer_email: "rchen@residence.net",
			customer_phone: "(555) 567-8901",
			job_id: "JOB005",
			job_title: "Security System Installation",
			estimate_id: "EST005",
			status: "partially_paid",
			payment_status: "partial",
			priority: "normal",
			created_at: "2024-01-05T16:00:00Z",
			updated_at: "2024-01-18T14:30:00Z",
			due_date: "2024-02-04T23:59:59Z",
			sent_date: "2024-01-06T10:00:00Z",
			viewed_date: "2024-01-07T15:20:00Z",
			paid_date: null,
			subtotal: 1948.5,
			tax_rate: 8.25,
			tax_amount: 160.75,
			discount_amount: 0.0,
			total_amount: 2109.25,
			paid_amount: 1000.0,
			balance_due: 1109.25,
			payment_terms: "50% deposit, balance on completion",
			payment_method_preference: "Credit Card",
			late_fee_applied: false,
			late_fee_amount: 0.0,
			created_by: "Office Staff",
			invoice_type: "milestone",
			recurring_schedule_id: null,
			line_items_count: 5,
			payments_count: 1,
			notes_count: 2,
			attachments_count: 1,
			last_reminder_sent: null,
			reminder_count: 0,
			days_overdue: 0,
			aging_bucket: "current",
			collection_status: "normal",
			write_off_amount: 0.0,
			credit_applied: 0.0,
			tags: ["residential", "security", "partial-payment", "milestone"],
		},
		{
			id: "INV006",
			invoice_number: "INV-2024-006",
			customer_id: "CUST006",
			customer_name: "Downtown Office Complex",
			customer_company: "Prestige Property Management",
			customer_type: "commercial",
			customer_email: "billing@prestige.com",
			customer_phone: "(555) 678-9012",
			job_id: "JOB006",
			job_title: "LED Lighting Upgrade",
			estimate_id: "EST006",
			status: "disputed",
			payment_status: "disputed",
			priority: "high",
			created_at: "2023-12-01T14:30:00Z",
			updated_at: "2024-01-10T11:45:00Z",
			due_date: "2023-12-31T23:59:59Z",
			sent_date: "2023-12-02T09:00:00Z",
			viewed_date: "2023-12-03T16:30:00Z",
			paid_date: null,
			subtotal: 19026.25,
			tax_rate: 8.25,
			tax_amount: 1569.67,
			discount_amount: 1000.0,
			total_amount: 19595.92,
			paid_amount: 0.0,
			balance_due: 19595.92,
			payment_terms: "Net 45",
			payment_method_preference: "ACH Transfer",
			late_fee_applied: true,
			late_fee_amount: 195.96,
			created_by: "Owner",
			invoice_type: "project",
			recurring_schedule_id: null,
			line_items_count: 15,
			payments_count: 0,
			notes_count: 8,
			attachments_count: 5,
			last_reminder_sent: "2024-01-10T11:45:00Z",
			reminder_count: 4,
			days_overdue: 45,
			aging_bucket: "45_days",
			collection_status: "disputed",
			write_off_amount: 0.0,
			credit_applied: 0.0,
			tags: ["commercial", "large-project", "disputed", "overdue"],
		},
	];

	const mockStats = {
		total_invoices: mockInvoices.length,
		draft_invoices: mockInvoices.filter((i) => i.status === "draft").length,
		sent_invoices: mockInvoices.filter((i) => i.status === "sent").length,
		paid_invoices: mockInvoices.filter((i) => i.status === "paid").length,
		overdue_invoices: mockInvoices.filter((i) => i.status === "overdue").length,
		disputed_invoices: mockInvoices.filter((i) => i.status === "disputed").length,
		total_outstanding: mockInvoices.reduce((sum, i) => sum + i.balance_due, 0),
		total_paid: mockInvoices.reduce((sum, i) => sum + i.paid_amount, 0),
		total_revenue: mockInvoices.reduce((sum, i) => sum + i.total_amount, 0),
		avg_invoice_value: mockInvoices.reduce((sum, i) => sum + i.total_amount, 0) / mockInvoices.length,
		collection_rate: 78, // percentage
		avg_days_to_pay: 24.5,
		late_payment_rate: 15, // percentage
		recurring_revenue: 6406.09, // monthly recurring
		aging_30_days: mockInvoices.filter((i) => i.aging_bucket === "30_days").reduce((sum, i) => sum + i.balance_due, 0),
		aging_60_days: mockInvoices.filter((i) => i.aging_bucket === "60_days").reduce((sum, i) => sum + i.balance_due, 0),
		aging_90_days: mockInvoices.filter((i) => i.aging_bucket === "90_days").reduce((sum, i) => sum + i.balance_due, 0),
	};

	const mockAgingReport = {
		current: mockInvoices.filter((i) => i.aging_bucket === "current").reduce((sum, i) => sum + i.balance_due, 0),
		days_1_15: mockInvoices.filter((i) => i.aging_bucket === "15_days").reduce((sum, i) => sum + i.balance_due, 0),
		days_16_30: mockInvoices.filter((i) => i.aging_bucket === "30_days").reduce((sum, i) => sum + i.balance_due, 0),
		days_31_60: mockInvoices.filter((i) => i.aging_bucket === "60_days").reduce((sum, i) => sum + i.balance_due, 0),
		days_61_90: mockInvoices.filter((i) => i.aging_bucket === "90_days").reduce((sum, i) => sum + i.balance_due, 0),
		days_over_90: mockInvoices.filter((i) => i.aging_bucket === "over_90").reduce((sum, i) => sum + i.balance_due, 0),
	};

	const mockRecurringInvoices = [
		{
			id: "REC001",
			customer_name: "Green Valley Restaurant",
			template_name: "Monthly Maintenance Contract",
			frequency: "monthly",
			amount: 6406.09,
			next_invoice_date: "2024-02-20T00:00:00Z",
			status: "active",
			created_at: "2023-06-01T00:00:00Z",
			total_generated: 8,
			last_generated: "2024-01-20T00:00:00Z",
		},
		{
			id: "REC002",
			customer_name: "Office Park Complex",
			template_name: "Quarterly HVAC Service",
			frequency: "quarterly",
			amount: 2500.0,
			next_invoice_date: "2024-03-01T00:00:00Z",
			status: "active",
			created_at: "2023-03-01T00:00:00Z",
			total_generated: 4,
			last_generated: "2023-12-01T00:00:00Z",
		},
	];

	useEffect(() => {
		// Initialize with mock data for demonstration
		setInvoices(mockInvoices);
	}, []);

	// Filtering and sorting logic
	const filteredAndSortedInvoices = useMemo(() => {
		let filtered = invoices.filter((invoice) => {
			// Search filter
			if (searchTerm) {
				const searchLower = searchTerm.toLowerCase();
				const matchesSearch = invoice.customer_name.toLowerCase().includes(searchLower) || invoice.invoice_number.toLowerCase().includes(searchLower) || invoice.job_title.toLowerCase().includes(searchLower) || (invoice.customer_company && invoice.customer_company.toLowerCase().includes(searchLower));
				if (!matchesSearch) return false;
			}

			// Status filter
			if (selectedStatus !== "all" && invoice.status !== selectedStatus) return false;

			// Payment status filter
			if (selectedPaymentStatus !== "all" && invoice.payment_status !== selectedPaymentStatus) return false;

			// Customer type filter
			if (selectedCustomerType !== "all" && invoice.customer_type !== selectedCustomerType) return false;

			// Date range filter
			if (selectedDateRange !== "all") {
				const invoiceDate = new Date(invoice.created_at);
				const today = new Date();

				switch (selectedDateRange) {
					case "today":
						if (differenceInDays(today, invoiceDate) !== 0) return false;
						break;
					case "week":
						if (differenceInDays(today, invoiceDate) > 7) return false;
						break;
					case "month":
						if (differenceInDays(today, invoiceDate) > 30) return false;
						break;
				}
			}

			return true;
		});

		// Sorting
		filtered.sort((a, b) => {
			let aValue, bValue;

			switch (sortBy) {
				case "customer_name":
					aValue = a.customer_name;
					bValue = b.customer_name;
					break;
				case "total_amount":
					aValue = a.total_amount || 0;
					bValue = b.total_amount || 0;
					break;
				case "balance_due":
					aValue = a.balance_due || 0;
					bValue = b.balance_due || 0;
					break;
				case "due_date":
					aValue = new Date(a.due_date);
					bValue = new Date(b.due_date);
					break;
				case "days_overdue":
					aValue = a.days_overdue || 0;
					bValue = b.days_overdue || 0;
					break;
				default:
					aValue = new Date(a.created_at);
					bValue = new Date(b.created_at);
			}

			if (sortOrder === "asc") {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

		return filtered;
	}, [invoices, searchTerm, selectedStatus, selectedPaymentStatus, selectedCustomerType, selectedDateRange, sortBy, sortOrder]);

	// Helper functions
	const getStatusColor = (status) => {
		switch (status) {
			case "draft":
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
			case "sent":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
			case "partially_paid":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
			case "paid":
				return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
			case "overdue":
				return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
			case "disputed":
				return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
			case "cancelled":
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
		}
	};

	const getPaymentStatusColor = (paymentStatus) => {
		switch (paymentStatus) {
			case "not_sent":
				return "text-gray-600 dark:text-gray-400";
			case "pending":
				return "text-blue-600 dark:text-blue-400";
			case "partial":
				return "text-yellow-600 dark:text-yellow-400";
			case "paid_full":
				return "text-green-600 dark:text-green-400";
			case "overdue":
				return "text-red-600 dark:text-red-400";
			case "disputed":
				return "text-purple-600 dark:text-purple-400";
			default:
				return "text-gray-600 dark:text-gray-400";
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case "draft":
				return <Edit className="w-4 h-4" />;
			case "sent":
				return <Send className="w-4 h-4" />;
			case "partially_paid":
				return <Coins className="w-4 h-4" />;
			case "paid":
				return <CheckCircle className="w-4 h-4" />;
			case "overdue":
				return <AlertTriangle className="w-4 h-4" />;
			case "disputed":
				return <Flag className="w-4 h-4" />;
			case "cancelled":
				return <XCircle className="w-4 h-4" />;
			default:
				return <Receipt className="w-4 h-4" />;
		}
	};

	const getPaymentMethodIcon = (method) => {
		switch (method?.toLowerCase()) {
			case "credit card":
				return <CreditCard className="w-4 h-4" />;
			case "ach transfer":
				return <Landmark className="w-4 h-4" />;
			case "check":
				return <FileText className="w-4 h-4" />;
			case "cash":
				return <Banknote className="w-4 h-4" />;
			case "wire transfer":
				return <Globe className="w-4 h-4" />;
			default:
				return <Wallet className="w-4 h-4" />;
		}
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case "urgent":
				return "text-red-600 dark:text-red-400";
			case "high":
				return "text-orange-600 dark:text-orange-400";
			case "normal":
				return "text-blue-600 dark:text-blue-400";
			case "low":
				return "text-green-600 dark:text-green-400";
			default:
				return "text-gray-600 dark:text-gray-400";
		}
	};

	const isOverdue = (dueDate, status) => {
		return new Date(dueDate) < new Date() && !["paid", "cancelled"].includes(status);
	};

	const isDueSoon = (dueDate, status) => {
		const daysUntilDue = differenceInDays(new Date(dueDate), new Date());
		return daysUntilDue <= 7 && daysUntilDue >= 0 && !["paid", "cancelled"].includes(status);
	};

	// Bulk actions
	const handleSelectAll = (checked) => {
		if (checked) {
			setSelectedInvoices(filteredAndSortedInvoices.map((invoice) => invoice.id));
		} else {
			setSelectedInvoices([]);
		}
	};

	const handleSelectInvoice = (invoiceId, checked) => {
		if (checked) {
			setSelectedInvoices((prev) => [...prev, invoiceId]);
		} else {
			setSelectedInvoices((prev) => prev.filter((id) => id !== invoiceId));
		}
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Business Header Component */}
			<Header />

			<div className="p-6">
				<div className="max-w-7xl mx-auto space-y-6">
					{/* Invoices Header */}
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="space-y-1">
							<h1 className="text-3xl font-bold tracking-tight">Invoices & Payments</h1>
							<p className="text-muted-foreground">Manage invoices, track payments, and monitor financial performance</p>
						</div>
						<div className="flex flex-wrap gap-2">
							<Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
								<Filter className="w-4 h-4 mr-2" />
								{showFilters ? "Hide Filters" : "Show Filters"}
							</Button>
							<Button variant="outline" size="sm">
								<BookOpen className="w-4 h-4 mr-2" />
								Templates
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
								New Invoice
							</Button>
						</div>
					</div>

					{/* Financial Summary Statistics */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Total Outstanding</p>
										<p className="text-2xl font-bold text-red-600">${mockStats.total_outstanding?.toLocaleString()}</p>
									</div>
									<AlertTriangle className="w-8 h-8 text-red-600" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Total Paid</p>
										<p className="text-2xl font-bold text-green-600">${mockStats.total_paid?.toLocaleString()}</p>
									</div>
									<CheckCircle className="w-8 h-8 text-green-600" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
										<p className="text-2xl font-bold text-blue-600">${mockStats.total_revenue?.toLocaleString()}</p>
									</div>
									<TrendingUp className="w-8 h-8 text-blue-600" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Collection Rate</p>
										<p className="text-2xl font-bold text-purple-600">{mockStats.collection_rate}%</p>
									</div>
									<Target className="w-8 h-8 text-purple-600" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Avg. Invoice</p>
										<p className="text-2xl font-bold text-orange-600">${mockStats.avg_invoice_value?.toLocaleString()}</p>
									</div>
									<Calculator className="w-8 h-8 text-orange-600" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Days to Pay</p>
										<p className="text-2xl font-bold text-yellow-600">{mockStats.avg_days_to_pay}</p>
									</div>
									<Clock className="w-8 h-8 text-yellow-600" />
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Accounts Receivable Aging Report */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<BarChart3 className="w-5 h-5" />
								Accounts Receivable Aging Report
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-6 gap-4">
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>Current</span>
										<span className="font-medium">${mockAgingReport.current?.toLocaleString()}</span>
									</div>
									<Progress value={70} className="h-3" />
									<p className="text-xs text-muted-foreground">0 days</p>
								</div>

								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>1-15 Days</span>
										<span className="font-medium text-yellow-600">${mockAgingReport.days_1_15?.toLocaleString()}</span>
									</div>
									<Progress value={15} className="h-3" />
									<p className="text-xs text-muted-foreground">Recently overdue</p>
								</div>

								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>16-30 Days</span>
										<span className="font-medium text-orange-600">${mockAgingReport.days_16_30?.toLocaleString()}</span>
									</div>
									<Progress value={8} className="h-3" />
									<p className="text-xs text-muted-foreground">Follow up needed</p>
								</div>

								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>31-60 Days</span>
										<span className="font-medium text-red-600">${mockAgingReport.days_31_60?.toLocaleString()}</span>
									</div>
									<Progress value={4} className="h-3" />
									<p className="text-xs text-muted-foreground">Collection priority</p>
								</div>

								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>61-90 Days</span>
										<span className="font-medium text-red-700">${mockAgingReport.days_61_90?.toLocaleString()}</span>
									</div>
									<Progress value={2} className="h-3" />
									<p className="text-xs text-muted-foreground">Urgent collection</p>
								</div>

								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>90+ Days</span>
										<span className="font-medium text-red-800">${mockAgingReport.days_over_90?.toLocaleString()}</span>
									</div>
									<Progress value={1} className="h-3" />
									<p className="text-xs text-muted-foreground">Consider write-off</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Tabbed Interface */}
					<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="invoices">All Invoices</TabsTrigger>
							<TabsTrigger value="recurring">Recurring Invoices</TabsTrigger>
							<TabsTrigger value="payments">Payment History</TabsTrigger>
						</TabsList>

						<TabsContent value="invoices" className="space-y-6">
							{/* Search and Filters */}
							<Card>
								<CardContent className="p-4">
									<div className="flex flex-col gap-4">
										{/* Search Bar */}
										<div className="flex gap-4">
											<div className="relative flex-1">
												<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
												<Input placeholder="Search invoices by customer, number, or job title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
											</div>
											<Button
												variant="outline"
												onClick={() => {
													setSearchTerm("");
													setSelectedStatus("all");
													setSelectedPaymentStatus("all");
													setSelectedCustomerType("all");
													setSelectedDateRange("all");
												}}
											>
												Clear All
											</Button>
										</div>

										{/* Filters */}
										{showFilters && (
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
												<Select value={selectedStatus} onValueChange={setSelectedStatus}>
													<SelectTrigger>
														<SelectValue placeholder="Invoice Status" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="all">All Status</SelectItem>
														<SelectItem value="draft">Draft</SelectItem>
														<SelectItem value="sent">Sent</SelectItem>
														<SelectItem value="partially_paid">Partially Paid</SelectItem>
														<SelectItem value="paid">Paid</SelectItem>
														<SelectItem value="overdue">Overdue</SelectItem>
														<SelectItem value="disputed">Disputed</SelectItem>
														<SelectItem value="cancelled">Cancelled</SelectItem>
													</SelectContent>
												</Select>

												<Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
													<SelectTrigger>
														<SelectValue placeholder="Payment Status" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="all">All Payments</SelectItem>
														<SelectItem value="not_sent">Not Sent</SelectItem>
														<SelectItem value="pending">Pending</SelectItem>
														<SelectItem value="partial">Partial</SelectItem>
														<SelectItem value="paid_full">Paid Full</SelectItem>
														<SelectItem value="overdue">Overdue</SelectItem>
														<SelectItem value="disputed">Disputed</SelectItem>
													</SelectContent>
												</Select>

												<Select value={selectedCustomerType} onValueChange={setSelectedCustomerType}>
													<SelectTrigger>
														<SelectValue placeholder="Customer Type" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="all">All Types</SelectItem>
														<SelectItem value="residential">Residential</SelectItem>
														<SelectItem value="commercial">Commercial</SelectItem>
													</SelectContent>
												</Select>

												<Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
													<SelectTrigger>
														<SelectValue placeholder="Date Range" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="all">All Dates</SelectItem>
														<SelectItem value="today">Today</SelectItem>
														<SelectItem value="week">This Week</SelectItem>
														<SelectItem value="month">This Month</SelectItem>
													</SelectContent>
												</Select>

												<Select
													value={`${sortBy}-${sortOrder}`}
													onValueChange={(value) => {
														const [field, order] = value.split("-");
														setSortBy(field);
														setSortOrder(order);
													}}
												>
													<SelectTrigger>
														<SelectValue placeholder="Sort By" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="created_at-desc">Newest First</SelectItem>
														<SelectItem value="created_at-asc">Oldest First</SelectItem>
														<SelectItem value="total_amount-desc">Highest Amount</SelectItem>
														<SelectItem value="balance_due-desc">Highest Balance</SelectItem>
														<SelectItem value="due_date-asc">Due Date (Earliest)</SelectItem>
														<SelectItem value="days_overdue-desc">Most Overdue</SelectItem>
														<SelectItem value="customer_name-asc">Customer: A-Z</SelectItem>
													</SelectContent>
												</Select>

												<div className="flex items-center gap-2">
													<Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
														List
													</Button>
													<Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
														Grid
													</Button>
												</div>
											</div>
										)}
									</div>
								</CardContent>
							</Card>

							{/* Bulk Actions */}
							{selectedInvoices.length > 0 && (
								<Card>
									<CardContent className="p-4">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-4">
												<span className="font-medium">{selectedInvoices.length} invoice(s) selected</span>
												<Button variant="outline" size="sm" onClick={() => setSelectedInvoices([])}>
													Clear Selection
												</Button>
											</div>
											<div className="flex gap-2">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="outline" size="sm">
															Bulk Actions
															<ChevronDown className="w-4 h-4 ml-2" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent>
														<DropdownMenuLabel>Send Actions</DropdownMenuLabel>
														<DropdownMenuItem>
															<Send className="w-4 h-4 mr-2" />
															Send Invoices
														</DropdownMenuItem>
														<DropdownMenuItem>
															<Bell className="w-4 h-4 mr-2" />
															Send Reminders
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuLabel>Status Updates</DropdownMenuLabel>
														<DropdownMenuItem>
															<CheckCircle className="w-4 h-4 mr-2" />
															Mark as Paid
														</DropdownMenuItem>
														<DropdownMenuItem>
															<Clock className="w-4 h-4 mr-2" />
															Mark as Pending
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuLabel>Export Actions</DropdownMenuLabel>
														<DropdownMenuItem>
															<Download className="w-4 h-4 mr-2" />
															Export Selected
														</DropdownMenuItem>
														<DropdownMenuItem>
															<PrinterIcon className="w-4 h-4 mr-2" />
															Print Selected
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem className="text-red-600">
															<Trash2 className="w-4 h-4 mr-2" />
															Delete Selected
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</div>
									</CardContent>
								</Card>
							)}

							{/* Invoices List */}
							<Card>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle className="flex items-center gap-2">
											<Receipt className="w-5 h-5" />
											Invoice Directory ({filteredAndSortedInvoices.length} of {invoices.length})
										</CardTitle>
										<div className="flex items-center gap-2">
											<Checkbox checked={selectedInvoices.length === filteredAndSortedInvoices.length && filteredAndSortedInvoices.length > 0} onCheckedChange={handleSelectAll} />
											<span className="text-sm text-muted-foreground">Select All</span>
										</div>
									</div>
								</CardHeader>
								<CardContent className="p-0">
									<div className="divide-y">
										{filteredAndSortedInvoices.map((invoice) => (
											<div key={invoice.id} className={`p-6 hover:bg-muted/50 transition-colors ${isOverdue(invoice.due_date, invoice.status) ? "bg-red-50 dark:bg-red-950/10" : isDueSoon(invoice.due_date, invoice.status) ? "bg-yellow-50 dark:bg-yellow-950/10" : ""}`}>
												<div className="flex items-start gap-4">
													{/* Selection Checkbox */}
													<Checkbox checked={selectedInvoices.includes(invoice.id)} onCheckedChange={(checked) => handleSelectInvoice(invoice.id, checked)} className="mt-1" />

													{/* Invoice Content */}
													<div className="flex-1">
														<div className="flex items-start justify-between">
															<div className="flex-1 space-y-3">
																{/* Invoice Header */}
																<div className="flex items-center gap-3 flex-wrap">
																	<div className="flex items-center gap-2">
																		{getStatusIcon(invoice.status)}
																		<h3 className="font-semibold text-lg">{invoice.job_title}</h3>
																	</div>
																	<Badge className={getStatusColor(invoice.status)}>{invoice.status.replace("_", " ")}</Badge>
																	<Badge variant="outline" className={getPaymentStatusColor(invoice.payment_status)}>
																		{invoice.payment_status.replace("_", " ")}
																	</Badge>
																	{isOverdue(invoice.due_date, invoice.status) && (
																		<Badge variant="destructive">
																			<AlertTriangle className="w-3 h-3 mr-1" />
																			{invoice.days_overdue} DAYS OVERDUE
																		</Badge>
																	)}
																	{isDueSoon(invoice.due_date, invoice.status) && !isOverdue(invoice.due_date, invoice.status) && (
																		<Badge variant="outline" className="border-yellow-500 text-yellow-600">
																			<Timer className="w-3 h-3 mr-1" />
																			DUE SOON
																		</Badge>
																	)}
																	{invoice.invoice_type === "recurring" && (
																		<Badge variant="outline" className="border-purple-500 text-purple-600">
																			<Repeat className="w-3 h-3 mr-1" />
																			RECURRING
																		</Badge>
																	)}
																	<span className="text-xs text-muted-foreground">#{invoice.invoice_number}</span>
																</div>

																{/* Customer & Job Details */}
																<div className="flex items-center gap-4">
																	<div className="flex items-center gap-2">
																		{invoice.customer_type === "commercial" ? <Building className="w-4 h-4" /> : <User className="w-4 h-4" />}
																		<span className="font-medium">{invoice.customer_company || invoice.customer_name}</span>
																		{invoice.customer_company && <span className="text-sm text-muted-foreground">({invoice.customer_name})</span>}
																	</div>
																	<div className="flex items-center gap-2">
																		{getPaymentMethodIcon(invoice.payment_method_preference)}
																		<span className="text-sm text-muted-foreground">{invoice.payment_method_preference}</span>
																	</div>
																</div>

																{/* Invoice Information Grid */}
																<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
																	<div className="flex items-center gap-2 text-muted-foreground">
																		<Calendar className="w-4 h-4" />
																		<div>
																			<p className="font-medium">Timeline</p>
																			<p>Created: {format(new Date(invoice.created_at), "MMM d")}</p>
																			<p className="text-xs">Due: {format(new Date(invoice.due_date), "MMM d, yyyy")}</p>
																		</div>
																	</div>

																	<div className="flex items-center gap-2 text-muted-foreground">
																		<Phone className="w-4 h-4" />
																		<div>
																			<p className="font-medium">Contact</p>
																			<p className="truncate">{invoice.customer_email}</p>
																			<p>{invoice.customer_phone}</p>
																		</div>
																	</div>

																	<div className="flex items-center gap-2 text-muted-foreground">
																		<Activity className="w-4 h-4" />
																		<div>
																			<p className="font-medium">Payment Progress</p>
																			<div className="flex items-center gap-2">
																				<Progress value={(invoice.paid_amount / invoice.total_amount) * 100} className="h-2 w-16" />
																				<span className="text-xs">{((invoice.paid_amount / invoice.total_amount) * 100).toFixed(0)}%</span>
																			</div>
																			<p className="text-xs">
																				${invoice.paid_amount.toLocaleString()} of ${invoice.total_amount.toLocaleString()}
																			</p>
																		</div>
																	</div>

																	<div className="flex items-center gap-2 text-muted-foreground">
																		<FileText className="w-4 h-4" />
																		<div>
																			<p className="font-medium">Details</p>
																			<p>
																				{invoice.line_items_count} items • {invoice.payment_terms}
																			</p>
																			<p className="text-xs">{invoice.payments_count} payment(s) made</p>
																		</div>
																	</div>
																</div>

																{/* Invoice Status & Activity */}
																<div className="flex items-center gap-6 text-xs text-muted-foreground">
																	{invoice.sent_date && (
																		<div className="flex items-center gap-1">
																			<Send className="w-3 h-3" />
																			<span>Sent: {format(new Date(invoice.sent_date), "MMM d")}</span>
																		</div>
																	)}
																	{invoice.viewed_date && (
																		<div className="flex items-center gap-1">
																			<Eye className="w-3 h-3" />
																			<span>Viewed: {format(new Date(invoice.viewed_date), "MMM d")}</span>
																		</div>
																	)}
																	{invoice.paid_date && (
																		<div className="flex items-center gap-1">
																			<CheckCircle className="w-3 h-3 text-green-600" />
																			<span>Paid: {format(new Date(invoice.paid_date), "MMM d")}</span>
																		</div>
																	)}
																	{invoice.attachments_count > 0 && (
																		<div className="flex items-center gap-1">
																			<Paperclip className="w-3 h-3" />
																			<span>{invoice.attachments_count} files</span>
																		</div>
																	)}
																	{invoice.notes_count > 0 && (
																		<div className="flex items-center gap-1">
																			<MessageSquare className="w-3 h-3" />
																			<span>{invoice.notes_count} notes</span>
																		</div>
																	)}
																	{invoice.reminder_count > 0 && (
																		<div className="flex items-center gap-1">
																			<Bell className="w-3 h-3 text-yellow-600" />
																			<span>{invoice.reminder_count} reminders sent</span>
																		</div>
																	)}
																</div>

																{/* Tags */}
																{invoice.tags && invoice.tags.length > 0 && (
																	<div className="flex gap-1 flex-wrap">
																		{invoice.tags.slice(0, 3).map((tag) => (
																			<Badge key={tag} variant="secondary" className="text-xs">
																				<Tag className="w-3 h-3 mr-1" />
																				{tag}
																			</Badge>
																		))}
																		{invoice.tags.length > 3 && (
																			<Badge variant="secondary" className="text-xs">
																				+{invoice.tags.length - 3} more
																			</Badge>
																		)}
																	</div>
																)}
															</div>

															{/* Invoice Amounts & Actions */}
															<div className="text-right ml-6 space-y-2">
																<div>
																	<p className="font-bold text-2xl text-blue-600">${invoice.total_amount?.toLocaleString()}</p>
																	<p className="text-xs text-muted-foreground">Total Amount</p>
																	{invoice.balance_due > 0 && (
																		<div className="mt-1">
																			<p className="font-semibold text-lg text-red-600">${invoice.balance_due.toLocaleString()}</p>
																			<p className="text-xs text-muted-foreground">Balance Due</p>
																		</div>
																	)}
																	{invoice.paid_amount > 0 && (
																		<div className="mt-1">
																			<p className="font-medium text-sm text-green-600">${invoice.paid_amount.toLocaleString()} paid</p>
																		</div>
																	)}
																	{invoice.late_fee_applied && <p className="text-xs text-red-600 mt-1">+${invoice.late_fee_amount} late fee</p>}
																</div>

																<div className="flex gap-2">
																	<Button size="sm" variant="outline">
																		<Eye className="w-4 h-4 mr-1" />
																		View
																	</Button>
																	<Button size="sm" variant="outline">
																		<Edit className="w-4 h-4 mr-1" />
																		Edit
																	</Button>
																	<DropdownMenu>
																		<DropdownMenuTrigger asChild>
																			<Button size="sm" variant="outline">
																				<MoreHorizontal className="w-4 h-4" />
																			</Button>
																		</DropdownMenuTrigger>
																		<DropdownMenuContent align="end">
																			<DropdownMenuItem>
																				<Send className="w-4 h-4 mr-2" />
																				Send to Customer
																			</DropdownMenuItem>
																			<DropdownMenuItem>
																				<Bell className="w-4 h-4 mr-2" />
																				Send Reminder
																			</DropdownMenuItem>
																			<DropdownMenuSeparator />
																			<DropdownMenuItem>
																				<CreditCard className="w-4 h-4 mr-2" />
																				Record Payment
																			</DropdownMenuItem>
																			<DropdownMenuItem>
																				<Coins className="w-4 h-4 mr-2" />
																				Apply Credit
																			</DropdownMenuItem>
																			<DropdownMenuSeparator />
																			<DropdownMenuItem>
																				<Copy className="w-4 h-4 mr-2" />
																				Duplicate Invoice
																			</DropdownMenuItem>
																			<DropdownMenuItem>
																				<Download className="w-4 h-4 mr-2" />
																				Download PDF
																			</DropdownMenuItem>
																			<DropdownMenuItem>
																				<PrinterIcon className="w-4 h-4 mr-2" />
																				Print Invoice
																			</DropdownMenuItem>
																			<DropdownMenuSeparator />
																			<DropdownMenuItem>
																				<Phone className="w-4 h-4 mr-2" />
																				Call Customer
																			</DropdownMenuItem>
																			<DropdownMenuItem>
																				<Mail className="w-4 h-4 mr-2" />
																				Send Email
																			</DropdownMenuItem>
																			<DropdownMenuItem>
																				<MessageSquare className="w-4 h-4 mr-2" />
																				Add Note
																			</DropdownMenuItem>
																			<DropdownMenuSeparator />
																			<DropdownMenuItem>
																				<Flag className="w-4 h-4 mr-2" />
																				Mark as Disputed
																			</DropdownMenuItem>
																			<DropdownMenuItem>
																				<Archive className="w-4 h-4 mr-2" />
																				Archive Invoice
																			</DropdownMenuItem>
																		</DropdownMenuContent>
																	</DropdownMenu>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										))}

										{filteredAndSortedInvoices.length === 0 && (
											<div className="text-center py-12">
												<Receipt className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
												<h3 className="text-lg font-semibold mb-2">No invoices found</h3>
												<p className="text-muted-foreground mb-4">{searchTerm || selectedStatus !== "all" || selectedPaymentStatus !== "all" ? "Try adjusting your filters or search terms" : "Create your first invoice to get started"}</p>
												<Button>
													<Plus className="w-4 h-4 mr-2" />
													New Invoice
												</Button>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="recurring" className="space-y-6">
							{/* Recurring Invoices List */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Repeat className="w-5 h-5" />
										Recurring Invoice Schedules
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="divide-y">
										{mockRecurringInvoices.map((schedule) => (
											<div key={schedule.id} className="py-4 first:pt-0 last:pb-0">
												<div className="flex items-center justify-between">
													<div className="space-y-2">
														<div className="flex items-center gap-3">
															<h4 className="font-semibold">{schedule.template_name}</h4>
															<Badge variant="outline" className="text-green-600">
																{schedule.status}
															</Badge>
															<Badge variant="secondary">{schedule.frequency}</Badge>
														</div>
														<p className="text-sm text-muted-foreground">{schedule.customer_name}</p>
														<div className="flex items-center gap-4 text-xs text-muted-foreground">
															<span>Next: {format(new Date(schedule.next_invoice_date), "MMM d, yyyy")}</span>
															<span>Generated: {schedule.total_generated} invoices</span>
															<span>Last: {format(new Date(schedule.last_generated), "MMM d")}</span>
														</div>
													</div>
													<div className="text-right">
														<p className="font-bold text-lg text-green-600">${schedule.amount.toLocaleString()}</p>
														<p className="text-xs text-muted-foreground">per {schedule.frequency.replace("ly", "")}</p>
													</div>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="payments" className="space-y-6">
							{/* Payment History Summary */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<CreditCard className="w-5 h-5" />
										Payment History & Analytics
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-center py-8">
										<CreditCard className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
										<h3 className="text-lg font-semibold mb-2">Payment History Coming Soon</h3>
										<p className="text-muted-foreground">Detailed payment tracking and analytics will be available in the next update</p>
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
