"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Progress } from "@components/ui/progress";
import { 
  FileText, 
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
  DollarSign,
  TrendingUp,
  Calendar,
  User,
  Building,
  Phone,
  Mail,
  MoreHorizontal,
  Copy,
  Trash2,
  ArrowRight,
  Target,
  AlertTriangle,
  Settings,
  RefreshCw,
  PieChart,
  BarChart3,
  Activity,
  Users,
  Archive,
  ChevronDown,
  Star,
  MessageSquare,
  Paperclip,
  Calculator,
  Percent,
  CreditCard,
  FileCheck,
  Timer,
  BookOpen,
  Briefcase,
  Award,
  Zap,
  ShoppingCart,
  Wrench,
  Tag
} from "lucide-react";
import { format, parseISO, differenceInDays, addDays } from "date-fns";
import Header from "@components/business/header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@components/ui/dropdown-menu";
import { Checkbox } from "@components/ui/checkbox";

/**
 * Comprehensive Field Service Estimates & Quotes Management System
 * Advanced estimate creation, tracking, approval workflow, and conversion management
 */
export default function FieldServiceEstimates({ 
  user, 
  userRole,
  initialEstimates = [], 
  estimateStats = null,
  serviceCategories = [],
  products = [],
  templates = []
}) {
  const [estimates, setEstimates] = useState(initialEstimates);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [selectedValue, setSelectedValue] = useState("all");
  const [selectedCustomerType, setSelectedCustomerType] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedEstimates, setSelectedEstimates] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [showFilters, setShowFilters] = useState(false);

  // Enhanced mock data for comprehensive demonstration
  const mockEstimates = [
    {
      id: "EST001",
      estimate_number: "EST-2024-001",
      customer_id: "CUST001",
      customer_name: "John Smith",
      customer_company: null,
      customer_type: "residential",
      customer_email: "john.smith@email.com",
      customer_phone: "(555) 123-4567",
      title: "Complete HVAC System Replacement",
      description: "Replace existing HVAC system with high-efficiency unit including ductwork updates",
      status: "sent",
      priority: "high",
      created_at: "2024-01-10T09:30:00Z",
      updated_at: "2024-01-12T14:20:00Z",
      valid_until: "2024-02-10T23:59:59Z",
      sent_date: "2024-01-12T14:20:00Z",
      viewed_date: "2024-01-13T10:15:00Z",
      approved_date: null,
      subtotal: 4500.00,
      tax_rate: 8.25,
      tax_amount: 371.25,
      discount_amount: 200.00,
      total_amount: 4671.25,
      payment_terms: "50% deposit, balance on completion",
      estimated_duration: "2-3 days",
      warranty_terms: "5 years parts, 2 years labor",
      created_by: "Owner",
      assigned_technician: "David Brown",
      service_category: "HVAC Installation",
      conversion_probability: 85,
      follow_up_date: "2024-01-15T10:00:00Z",
      notes_count: 3,
      attachments_count: 2,
      line_items_count: 8,
      competitor_estimates: 2,
      customer_budget: 5000.00,
      margin_percentage: 35,
      tags: ["urgent", "hvac", "residential", "high-value"]
    },
    {
      id: "EST002",
      estimate_number: "EST-2024-002",
      customer_id: "CUST002",
      customer_name: "ABC Manufacturing Corp",
      customer_company: "ABC Manufacturing Corp",
      customer_type: "commercial",
      customer_email: "facilities@abcmfg.com",
      customer_phone: "(555) 456-7890",
      title: "Industrial Electrical Panel Upgrade",
      description: "Upgrade main electrical panel and install backup power systems",
      status: "approved",
      priority: "urgent",
      created_at: "2024-01-08T11:15:00Z",
      updated_at: "2024-01-14T16:30:00Z",
      valid_until: "2024-02-08T23:59:59Z",
      sent_date: "2024-01-08T15:00:00Z",
      viewed_date: "2024-01-09T08:30:00Z",
      approved_date: "2024-01-14T16:30:00Z",
      subtotal: 12500.00,
      tax_rate: 8.25,
      tax_amount: 1031.25,
      discount_amount: 500.00,
      total_amount: 13031.25,
      payment_terms: "Net 30",
      estimated_duration: "5-7 days",
      warranty_terms: "10 years parts, 5 years labor",
      created_by: "Office Staff",
      assigned_technician: "Mike Wilson",
      service_category: "Electrical",
      conversion_probability: 95,
      follow_up_date: null,
      notes_count: 5,
      attachments_count: 4,
      line_items_count: 12,
      competitor_estimates: 1,
      customer_budget: 15000.00,
      margin_percentage: 42,
      tags: ["commercial", "electrical", "urgent", "contracted"]
    },
    {
      id: "EST003",
      estimate_number: "EST-2024-003",
      customer_id: "CUST003",
      customer_name: "Sarah Johnson",
      customer_company: null,
      customer_type: "residential",
      customer_email: "sarah.j@home.com",
      customer_phone: "(555) 234-5678",
      title: "Kitchen Plumbing Renovation",
      description: "Complete kitchen plumbing overhaul including new fixtures and pipes",
      status: "draft",
      priority: "normal",
      created_at: "2024-01-14T13:45:00Z",
      updated_at: "2024-01-14T13:45:00Z",
      valid_until: "2024-02-14T23:59:59Z",
      sent_date: null,
      viewed_date: null,
      approved_date: null,
      subtotal: 2800.00,
      tax_rate: 8.25,
      tax_amount: 231.00,
      discount_amount: 0.00,
      total_amount: 3031.00,
      payment_terms: "Due on completion",
      estimated_duration: "3-4 days",
      warranty_terms: "2 years parts and labor",
      created_by: "Owner",
      assigned_technician: "Lisa Chen",
      service_category: "Plumbing",
      conversion_probability: 70,
      follow_up_date: "2024-01-16T09:00:00Z",
      notes_count: 1,
      attachments_count: 0,
      line_items_count: 6,
      competitor_estimates: 0,
      customer_budget: 3500.00,
      margin_percentage: 28,
      tags: ["residential", "plumbing", "renovation"]
    },
    {
      id: "EST004",
      estimate_number: "EST-2024-004",
      customer_id: "CUST004",
      customer_name: "Green Valley Restaurant",
      customer_company: "Green Valley Restaurant",
      customer_type: "commercial",
      customer_email: "manager@greenvalley.com",
      customer_phone: "(555) 345-6789",
      title: "Commercial Kitchen Equipment Maintenance Contract",
      description: "Annual maintenance contract for all kitchen equipment and ventilation systems",
      status: "pending_approval",
      priority: "normal",
      created_at: "2024-01-11T10:20:00Z",
      updated_at: "2024-01-13T09:15:00Z",
      valid_until: "2024-02-11T23:59:59Z",
      sent_date: "2024-01-11T14:30:00Z",
      viewed_date: "2024-01-12T19:45:00Z",
      approved_date: null,
      subtotal: 6000.00,
      tax_rate: 8.25,
      tax_amount: 495.00,
      discount_amount: 300.00,
      total_amount: 6195.00,
      payment_terms: "Annual payment in advance",
      estimated_duration: "Ongoing - 12 months",
      warranty_terms: "Included in contract",
      created_by: "Office Staff",
      assigned_technician: "Multiple",
      service_category: "Maintenance Contract",
      conversion_probability: 90,
      follow_up_date: "2024-01-16T14:00:00Z",
      notes_count: 4,
      attachments_count: 3,
      line_items_count: 4,
      competitor_estimates: 3,
      customer_budget: 7000.00,
      margin_percentage: 40,
      tags: ["commercial", "contract", "restaurant", "annual"]
    },
    {
      id: "EST005",
      estimate_number: "EST-2024-005",
      customer_id: "CUST005",
      customer_name: "Robert Chen",
      customer_company: null,
      customer_type: "residential",
      customer_email: "rchen@residence.net",
      customer_phone: "(555) 567-8901",
      title: "Home Security System Installation",
      description: "Complete home security system with cameras, sensors, and monitoring",
      status: "rejected",
      priority: "low",
      created_at: "2024-01-05T16:00:00Z",
      updated_at: "2024-01-09T11:30:00Z",
      valid_until: "2024-02-05T23:59:59Z",
      sent_date: "2024-01-06T10:00:00Z",
      viewed_date: "2024-01-07T15:20:00Z",
      approved_date: null,
      subtotal: 1800.00,
      tax_rate: 8.25,
      tax_amount: 148.50,
      discount_amount: 0.00,
      total_amount: 1948.50,
      payment_terms: "50% deposit, balance on completion",
      estimated_duration: "1-2 days",
      warranty_terms: "3 years equipment, 1 year labor",
      created_by: "Office Staff",
      assigned_technician: "Tom Garcia",
      service_category: "Security Systems",
      conversion_probability: 15,
      follow_up_date: null,
      notes_count: 2,
      attachments_count: 1,
      line_items_count: 5,
      competitor_estimates: 2,
      customer_budget: 1500.00,
      margin_percentage: 25,
      tags: ["residential", "security", "rejected"]
    },
    {
      id: "EST006",
      estimate_number: "EST-2024-006",
      customer_id: "CUST006",
      customer_name: "Downtown Office Complex",
      customer_company: "Prestige Property Management",
      customer_type: "commercial",
      customer_email: "maintenance@prestige.com",
      customer_phone: "(555) 678-9012",
      title: "Building-Wide LED Lighting Upgrade",
      description: "Replace all fluorescent lighting with energy-efficient LED systems",
      status: "awaiting_review",
      priority: "normal",
      created_at: "2024-01-12T14:30:00Z",
      updated_at: "2024-01-13T10:45:00Z",
      valid_until: "2024-02-12T23:59:59Z",
      sent_date: null,
      viewed_date: null,
      approved_date: null,
      subtotal: 18500.00,
      tax_rate: 8.25,
      tax_amount: 1526.25,
      discount_amount: 1000.00,
      total_amount: 19026.25,
      payment_terms: "Net 45",
      estimated_duration: "10-14 days",
      warranty_terms: "7 years LED warranty, 3 years installation",
      created_by: "Owner",
      assigned_technician: "Multiple",
      service_category: "Electrical",
      conversion_probability: 80,
      follow_up_date: "2024-01-17T11:00:00Z",
      notes_count: 6,
      attachments_count: 5,
      line_items_count: 15,
      competitor_estimates: 4,
      customer_budget: 20000.00,
      margin_percentage: 38,
      tags: ["commercial", "led", "energy-efficiency", "large-project"]
    }
  ];

  const mockStats = {
    total_estimates: mockEstimates.length,
    draft_estimates: mockEstimates.filter(e => e.status === 'draft').length,
    sent_estimates: mockEstimates.filter(e => e.status === 'sent').length,
    pending_estimates: mockEstimates.filter(e => e.status === 'pending_approval').length,
    approved_estimates: mockEstimates.filter(e => e.status === 'approved').length,
    rejected_estimates: mockEstimates.filter(e => e.status === 'rejected').length,
    total_value: mockEstimates.reduce((sum, e) => sum + e.total_amount, 0),
    avg_estimate_value: mockEstimates.reduce((sum, e) => sum + e.total_amount, 0) / mockEstimates.length,
    conversion_rate: 45, // percentage
    avg_approval_time: 3.2, // days
    pipeline_value: mockEstimates.filter(e => ['sent', 'pending_approval'].includes(e.status)).reduce((sum, e) => sum + e.total_amount, 0),
    win_rate: 42, // percentage
    avg_margin: mockEstimates.reduce((sum, e) => sum + e.margin_percentage, 0) / mockEstimates.length
  };

  useEffect(() => {
    // Initialize with mock data for demonstration
    setEstimates(mockEstimates);
  }, []);

  // Filtering and sorting logic
  const filteredAndSortedEstimates = useMemo(() => {
    let filtered = estimates.filter(estimate => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          estimate.customer_name.toLowerCase().includes(searchLower) ||
          estimate.estimate_number.toLowerCase().includes(searchLower) ||
          estimate.title.toLowerCase().includes(searchLower) ||
          estimate.description.toLowerCase().includes(searchLower) ||
          (estimate.customer_company && estimate.customer_company.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Status filter
      if (selectedStatus !== "all" && estimate.status !== selectedStatus) return false;

      // Customer type filter
      if (selectedCustomerType !== "all" && estimate.customer_type !== selectedCustomerType) return false;

      // Value filter
      if (selectedValue !== "all") {
        switch (selectedValue) {
          case "high":
            if (estimate.total_amount < 10000) return false;
            break;
          case "medium":
            if (estimate.total_amount < 2000 || estimate.total_amount >= 10000) return false;
            break;
          case "low":
            if (estimate.total_amount >= 2000) return false;
            break;
        }
      }

      // Date range filter
      if (selectedDateRange !== "all") {
        const estimateDate = new Date(estimate.created_at);
        const today = new Date();
        
        switch (selectedDateRange) {
          case "today":
            if (differenceInDays(today, estimateDate) !== 0) return false;
            break;
          case "week":
            if (differenceInDays(today, estimateDate) > 7) return false;
            break;
          case "month":
            if (differenceInDays(today, estimateDate) > 30) return false;
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
        case "conversion_probability":
          aValue = a.conversion_probability || 0;
          bValue = b.conversion_probability || 0;
          break;
        case "valid_until":
          aValue = new Date(a.valid_until);
          bValue = new Date(b.valid_until);
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
  }, [estimates, searchTerm, selectedStatus, selectedCustomerType, selectedValue, selectedDateRange, sortBy, sortOrder]);

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
      case "sent": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "pending_approval": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "approved": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "awaiting_review": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent": return "text-red-600 dark:text-red-400";
      case "high": return "text-orange-600 dark:text-orange-400";
      case "normal": return "text-blue-600 dark:text-blue-400";
      case "low": return "text-green-600 dark:text-green-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "draft": return <Edit className="w-4 h-4" />;
      case "sent": return <Send className="w-4 h-4" />;
      case "pending_approval": return <Clock className="w-4 h-4" />;
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      case "awaiting_review": return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getConversionColor = (probability) => {
    if (probability >= 80) return "text-green-600";
    if (probability >= 60) return "text-yellow-600";
    if (probability >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const isExpiringSoon = (validUntil) => {
    const daysUntilExpiry = differenceInDays(new Date(validUntil), new Date());
    return daysUntilExpiry <= 3 && daysUntilExpiry >= 0;
  };

  const isExpired = (validUntil) => {
    return new Date(validUntil) < new Date();
  };

  // Bulk actions
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedEstimates(filteredAndSortedEstimates.map(estimate => estimate.id));
    } else {
      setSelectedEstimates([]);
    }
  };

  const handleSelectEstimate = (estimateId, checked) => {
    if (checked) {
      setSelectedEstimates(prev => [...prev, estimateId]);
    } else {
      setSelectedEstimates(prev => prev.filter(id => id !== estimateId));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Business Header Component */}
      <Header />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Estimates Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Estimates & Quotes</h1>
              <p className="text-muted-foreground">Create, track, and manage estimates with comprehensive approval workflows</p>
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
                New Estimate
              </Button>
            </div>
          </div>

          {/* Estimate Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Estimates</p>
                    <p className="text-2xl font-bold">{mockStats.total_estimates}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pipeline Value</p>
                    <p className="text-2xl font-bold text-green-600">${mockStats.pipeline_value?.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                    <p className="text-2xl font-bold text-purple-600">{mockStats.conversion_rate}%</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Value</p>
                    <p className="text-2xl font-bold text-orange-600">${mockStats.avg_estimate_value?.toLocaleString()}</p>
                  </div>
                  <Calculator className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
                    <p className="text-2xl font-bold text-yellow-600">{mockStats.win_rate}%</p>
                  </div>
                  <Award className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Pipeline Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Sales Pipeline Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Draft ({mockStats.draft_estimates})</span>
                    <span>{((mockStats.draft_estimates / mockStats.total_estimates) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={(mockStats.draft_estimates / mockStats.total_estimates) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sent ({mockStats.sent_estimates})</span>
                    <span>{((mockStats.sent_estimates / mockStats.total_estimates) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={(mockStats.sent_estimates / mockStats.total_estimates) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pending ({mockStats.pending_estimates})</span>
                    <span>{((mockStats.pending_estimates / mockStats.total_estimates) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={(mockStats.pending_estimates / mockStats.total_estimates) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Approved ({mockStats.approved_estimates})</span>
                    <span>{((mockStats.approved_estimates / mockStats.total_estimates) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={(mockStats.approved_estimates / mockStats.total_estimates) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Rejected ({mockStats.rejected_estimates})</span>
                    <span>{((mockStats.rejected_estimates / mockStats.total_estimates) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={(mockStats.rejected_estimates / mockStats.total_estimates) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Avg. Margin</span>
                    <span>{mockStats.avg_margin?.toFixed(1)}%</span>
                  </div>
                  <Progress value={mockStats.avg_margin} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search estimates by customer, number, title, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedStatus("all");
                      setSelectedCustomerType("all");
                      setSelectedValue("all");
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
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="pending_approval">Pending Approval</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="awaiting_review">Awaiting Review</SelectItem>
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

                    <Select value={selectedValue} onValueChange={setSelectedValue}>
                      <SelectTrigger>
                        <SelectValue placeholder="Estimate Value" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Values</SelectItem>
                        <SelectItem value="high">High Value ($10,000+)</SelectItem>
                        <SelectItem value="medium">Medium Value ($2,000-$9,999)</SelectItem>
                        <SelectItem value="low">Low Value (<$2,000)</SelectItem>
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

                    <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                      const [field, order] = value.split('-');
                      setSortBy(field);
                      setSortOrder(order);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="created_at-desc">Newest First</SelectItem>
                        <SelectItem value="created_at-asc">Oldest First</SelectItem>
                        <SelectItem value="total_amount-desc">Highest Value</SelectItem>
                        <SelectItem value="total_amount-asc">Lowest Value</SelectItem>
                        <SelectItem value="conversion_probability-desc">Highest Probability</SelectItem>
                        <SelectItem value="valid_until-asc">Expiring Soon</SelectItem>
                        <SelectItem value="customer_name-asc">Customer: A-Z</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant={viewMode === "list" ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setViewMode("list")}
                      >
                        List
                      </Button>
                      <Button 
                        variant={viewMode === "grid" ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setViewMode("grid")}
                      >
                        Grid
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedEstimates.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{selectedEstimates.length} estimate(s) selected</span>
                    <Button variant="outline" size="sm" onClick={() => setSelectedEstimates([])}>
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
                        <DropdownMenuLabel>Status Updates</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Send className="w-4 h-4 mr-2" />
                          Send Estimates
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Approved
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate Selected
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Export Selected
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="w-4 h-4 mr-2" />
                          Archive Selected
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

          {/* Estimates List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Estimates Directory ({filteredAndSortedEstimates.length} of {estimates.length})
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedEstimates.length === filteredAndSortedEstimates.length && filteredAndSortedEstimates.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-muted-foreground">Select All</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredAndSortedEstimates.map((estimate) => (
                  <div 
                    key={estimate.id} 
                    className={`p-6 hover:bg-muted/50 transition-colors ${
                      isExpired(estimate.valid_until) ? 'bg-red-50 dark:bg-red-950/10' : 
                      isExpiringSoon(estimate.valid_until) ? 'bg-yellow-50 dark:bg-yellow-950/10' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Selection Checkbox */}
                      <Checkbox
                        checked={selectedEstimates.includes(estimate.id)}
                        onCheckedChange={(checked) => handleSelectEstimate(estimate.id, checked)}
                        className="mt-1"
                      />

                      {/* Estimate Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            {/* Estimate Header */}
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(estimate.status)}
                                <h3 className="font-semibold text-lg">{estimate.title}</h3>
                              </div>
                              <Badge className={getStatusColor(estimate.status)}>
                                {estimate.status.replace('_', ' ')}
                              </Badge>
                              <Badge variant="outline" className={getPriorityColor(estimate.priority)}>
                                {estimate.priority} priority
                              </Badge>
                              {isExpired(estimate.valid_until) && (
                                <Badge variant="destructive">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  EXPIRED
                                </Badge>
                              )}
                              {isExpiringSoon(estimate.valid_until) && !isExpired(estimate.valid_until) && (
                                <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                                  <Timer className="w-3 h-3 mr-1" />
                                  EXPIRES SOON
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">#{estimate.estimate_number}</span>
                            </div>

                            {/* Customer & Service Details */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                {estimate.customer_type === 'commercial' ? <Building className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                <span className="font-medium">
                                  {estimate.customer_company || estimate.customer_name}
                                </span>
                                {estimate.customer_company && (
                                  <span className="text-sm text-muted-foreground">({estimate.customer_name})</span>
                                )}
                              </div>
                              <Badge variant="secondary">{estimate.service_category}</Badge>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-muted-foreground line-clamp-2">{estimate.description}</p>
                            
                            {/* Estimate Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <div>
                                  <p className="font-medium">Timeline</p>
                                  <p>Created: {format(new Date(estimate.created_at), "MMM d")}</p>
                                  <p className="text-xs">Valid until: {format(new Date(estimate.valid_until), "MMM d, yyyy")}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="w-4 h-4" />
                                <div>
                                  <p className="font-medium">Contact</p>
                                  <p className="truncate">{estimate.customer_email}</p>
                                  <p>{estimate.customer_phone}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Target className="w-4 h-4" />
                                <div>
                                  <p className="font-medium">Conversion</p>
                                  <div className="flex items-center gap-2">
                                    <span className={getConversionColor(estimate.conversion_probability)}>
                                      {estimate.conversion_probability}%
                                    </span>
                                    <Progress 
                                      value={estimate.conversion_probability} 
                                      className="h-1 w-16" 
                                    />
                                  </div>
                                  <p className="text-xs">Budget: ${estimate.customer_budget?.toLocaleString()}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Activity className="w-4 h-4" />
                                <div>
                                  <p className="font-medium">Details</p>
                                  <p>{estimate.line_items_count} items • {estimate.estimated_duration}</p>
                                  <p className="text-xs">Margin: {estimate.margin_percentage}%</p>
                                </div>
                              </div>
                            </div>

                            {/* Estimate Metrics */}
                            <div className="flex items-center gap-6 text-xs text-muted-foreground">
                              {estimate.sent_date && (
                                <div className="flex items-center gap-1">
                                  <Send className="w-3 h-3" />
                                  <span>Sent: {format(new Date(estimate.sent_date), "MMM d")}</span>
                                </div>
                              )}
                              {estimate.viewed_date && (
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  <span>Viewed: {format(new Date(estimate.viewed_date), "MMM d")}</span>
                                </div>
                              )}
                              {estimate.attachments_count > 0 && (
                                <div className="flex items-center gap-1">
                                  <Paperclip className="w-3 h-3" />
                                  <span>{estimate.attachments_count} files</span>
                                </div>
                              )}
                              {estimate.notes_count > 0 && (
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  <span>{estimate.notes_count} notes</span>
                                </div>
                              )}
                              {estimate.competitor_estimates > 0 && (
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  <span>{estimate.competitor_estimates} competitors</span>
                                </div>
                              )}
                            </div>

                            {/* Tags */}
                            {estimate.tags && estimate.tags.length > 0 && (
                              <div className="flex gap-1 flex-wrap">
                                {estimate.tags.slice(0, 3).map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                                {estimate.tags.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{estimate.tags.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Estimate Actions & Pricing */}
                          <div className="text-right ml-6 space-y-2">
                            <div>
                              <p className="font-bold text-2xl text-green-600">
                                ${estimate.total_amount?.toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Total Amount
                              </p>
                              {estimate.discount_amount > 0 && (
                                <p className="text-xs text-orange-600">
                                  -${estimate.discount_amount.toLocaleString()} discount
                                </p>
                              )}
                              <div className="flex items-center justify-end gap-1 mt-1">
                                <Percent className="w-3 h-3" />
                                <span className="text-xs">{estimate.margin_percentage}% margin</span>
                              </div>
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
                                    <Copy className="w-4 h-4 mr-2" />
                                    Duplicate Estimate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download PDF
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <ArrowRight className="w-4 h-4 mr-2" />
                                    Convert to Job
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Create Invoice
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
                                    <Tag className="w-4 h-4 mr-2" />
                                    Manage Tags
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Settings className="w-4 h-4 mr-2" />
                                    Estimate Settings
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
                
                {filteredAndSortedEstimates.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No estimates found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || selectedStatus !== "all" || selectedCustomerType !== "all" 
                        ? "Try adjusting your filters or search terms"
                        : "Create your first estimate to get started"}
                    </p>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      New Estimate
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
