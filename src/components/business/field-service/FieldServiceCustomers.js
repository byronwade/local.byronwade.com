"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { 
  Users, 
  Plus, 
  Filter, 
  Download, 
  Search,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  FileText,
  DollarSign,
  Building,
  Home,
  User,
  MoreHorizontal,
  Settings,
  MessageSquare,
  History,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Heart,
  Target,
  Zap,
  Award,
  RefreshCw,
  Upload,
  Tag,
  ChevronDown,
  SortAsc,
  SortDesc,
  X,
  Navigation,
  Wrench,
  Archive,
  UserPlus,
  BookOpen
} from "lucide-react";
import { format, parseISO, differenceInDays, differenceInMonths } from "date-fns";
import Header from "@components/business/header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@components/ui/dropdown-menu";
import { Checkbox } from "@components/ui/checkbox";
import { Progress } from "@components/ui/progress";

/**
 * Comprehensive Field Service Customer Management System
 * Advanced customer relationship management with service history, profiles, and analytics
 */
export default function FieldServiceCustomers({ 
  user, 
  userRole,
  initialCustomers = [], 
  customerStats = null,
  customerTypes = [],
  serviceAreas = []
}) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomerType, setSelectedCustomerType] = useState("all");
  const [selectedServiceArea, setSelectedServiceArea] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedValue, setSelectedValue] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [showFilters, setShowFilters] = useState(false);

  // Enhanced mock data for comprehensive demonstration
  const mockCustomers = [
    {
      id: "CUST001",
      customer_number: "C-2024-001",
      name: "John Smith",
      company: null,
      customer_type: "residential",
      email: "john.smith@email.com",
      phone: "(555) 123-4567",
      mobile: "(555) 987-6543",
      primary_address: "123 Main St, Anytown, CA 12345",
      billing_address: "123 Main St, Anytown, CA 12345",
      service_area: "North Zone",
      status: "active",
      created_at: "2023-03-15T09:30:00Z",
      last_service: "2024-01-10T14:00:00Z",
      next_service: "2024-02-10T14:00:00Z",
      total_jobs: 12,
      completed_jobs: 11,
      cancelled_jobs: 1,
      total_spent: 2450.00,
      avg_job_value: 204.17,
      customer_rating: 4.8,
      payment_terms: "Net 30",
      preferred_technician: "Mike Wilson",
      emergency_contact: "Jane Smith - (555) 111-2222",
      special_instructions: "Gate code: 1234. Dog in backyard.",
      tags: ["vip", "residential", "recurring"],
      loyalty_points: 245,
      referrals_made: 3,
      last_contact: "2024-01-08T10:30:00Z",
      contact_method: "phone",
      satisfaction_score: 9.2,
      lifetime_value: 3200.00,
      risk_score: "low",
      notes_count: 5,
      invoices_count: 11,
      estimates_count: 2,
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: "CUST002",
      customer_number: "C-2024-002",
      name: "ABC Manufacturing Corp",
      company: "ABC Manufacturing Corp",
      customer_type: "commercial",
      email: "facilities@abcmfg.com",
      phone: "(555) 456-7890",
      mobile: null,
      primary_address: "456 Industrial Blvd, Business Park, CA 12345",
      billing_address: "PO Box 789, Business Park, CA 12345",
      service_area: "Industrial Zone",
      status: "active",
      created_at: "2023-01-20T11:15:00Z",
      last_service: "2024-01-12T08:00:00Z",
      next_service: "2024-01-26T08:00:00Z",
      total_jobs: 28,
      completed_jobs: 26,
      cancelled_jobs: 2,
      total_spent: 8750.00,
      avg_job_value: 312.50,
      customer_rating: 4.9,
      payment_terms: "Net 15",
      preferred_technician: "David Brown",
      emergency_contact: "Mike Johnson - (555) 333-4444",
      special_instructions: "24/7 facility. Check in at security gate.",
      tags: ["commercial", "contract", "priority"],
      loyalty_points: 875,
      referrals_made: 1,
      last_contact: "2024-01-05T14:20:00Z",
      contact_method: "email",
      satisfaction_score: 9.6,
      lifetime_value: 12500.00,
      risk_score: "low",
      notes_count: 12,
      invoices_count: 26,
      estimates_count: 8,
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    {
      id: "CUST003",
      customer_number: "C-2024-003",
      name: "Sarah Johnson",
      company: null,
      customer_type: "residential",
      email: "sarah.j@home.com",
      phone: "(555) 234-5678",
      mobile: "(555) 876-5432",
      primary_address: "789 Oak Avenue, Suburbs, CA 12345",
      billing_address: "789 Oak Avenue, Suburbs, CA 12345",
      service_area: "South Zone",
      status: "active",
      created_at: "2023-06-10T16:45:00Z",
      last_service: "2023-12-20T13:30:00Z",
      next_service: null,
      total_jobs: 6,
      completed_jobs: 5,
      cancelled_jobs: 1,
      total_spent: 980.00,
      avg_job_value: 163.33,
      customer_rating: 4.5,
      payment_terms: "Due on Receipt",
      preferred_technician: "Lisa Chen",
      emergency_contact: "Tom Johnson - (555) 555-6666",
      special_instructions: "Prefer morning appointments. No weekends.",
      tags: ["residential", "seasonal"],
      loyalty_points: 98,
      referrals_made: 0,
      last_contact: "2023-12-18T09:15:00Z",
      contact_method: "email",
      satisfaction_score: 8.5,
      lifetime_value: 1400.00,
      risk_score: "medium",
      notes_count: 3,
      invoices_count: 5,
      estimates_count: 3,
      coordinates: { lat: 40.7505, lng: -73.9934 }
    },
    {
      id: "CUST004",
      customer_number: "C-2024-004",
      name: "Green Valley Restaurant",
      company: "Green Valley Restaurant",
      customer_type: "commercial",
      email: "manager@greenvalley.com",
      phone: "(555) 345-6789",
      mobile: "(555) 765-4321",
      primary_address: "321 Restaurant Row, Downtown, CA 12345",
      billing_address: "321 Restaurant Row, Downtown, CA 12345",
      service_area: "Downtown Zone",
      status: "active",
      created_at: "2023-02-28T12:00:00Z",
      last_service: "2024-01-05T19:00:00Z",
      next_service: "2024-01-19T19:00:00Z",
      total_jobs: 18,
      completed_jobs: 17,
      cancelled_jobs: 1,
      total_spent: 4200.00,
      avg_job_value: 233.33,
      customer_rating: 4.7,
      payment_terms: "Net 30",
      preferred_technician: "Mike Wilson",
      emergency_contact: "Chef Marco - (555) 777-8888",
      special_instructions: "After hours service only. Kitchen equipment priority.",
      tags: ["commercial", "restaurant", "after-hours"],
      loyalty_points: 420,
      referrals_made: 2,
      last_contact: "2024-01-03T16:30:00Z",
      contact_method: "phone",
      satisfaction_score: 9.0,
      lifetime_value: 6000.00,
      risk_score: "low",
      notes_count: 8,
      invoices_count: 17,
      estimates_count: 4,
      coordinates: { lat: 40.7282, lng: -74.0776 }
    },
    {
      id: "CUST005",
      customer_number: "C-2024-005",
      name: "Robert Chen",
      company: null,
      customer_type: "residential",
      email: "rchen@residence.net",
      phone: "(555) 567-8901",
      mobile: null,
      primary_address: "654 Maple Drive, Residential Area, CA 12345",
      billing_address: "654 Maple Drive, Residential Area, CA 12345",
      service_area: "West Zone",
      status: "inactive",
      created_at: "2023-09-12T14:20:00Z",
      last_service: "2023-11-15T10:00:00Z",
      next_service: null,
      total_jobs: 3,
      completed_jobs: 2,
      cancelled_jobs: 1,
      total_spent: 425.00,
      avg_job_value: 141.67,
      customer_rating: 3.5,
      payment_terms: "Due on Receipt",
      preferred_technician: null,
      emergency_contact: "Linda Chen - (555) 999-0000",
      special_instructions: "Call before arriving. Elderly customer.",
      tags: ["residential", "elderly"],
      loyalty_points: 42,
      referrals_made: 0,
      last_contact: "2023-11-10T11:30:00Z",
      contact_method: "phone",
      satisfaction_score: 6.8,
      lifetime_value: 600.00,
      risk_score: "high",
      notes_count: 2,
      invoices_count: 2,
      estimates_count: 1,
      coordinates: { lat: 40.7831, lng: -73.9712 }
    },
    {
      id: "CUST006",
      customer_number: "C-2024-006",
      name: "Downtown Office Complex",
      company: "Prestige Property Management",
      customer_type: "commercial",
      email: "maintenance@prestige.com",
      phone: "(555) 678-9012",
      mobile: "(555) 654-3210",
      primary_address: "987 Business Center Dr, Financial District, CA 12345",
      billing_address: "PO Box 1234, Financial District, CA 12345",
      service_area: "Financial Zone",
      status: "prospect",
      created_at: "2024-01-05T09:00:00Z",
      last_service: null,
      next_service: "2024-01-20T09:00:00Z",
      total_jobs: 0,
      completed_jobs: 0,
      cancelled_jobs: 0,
      total_spent: 0.00,
      avg_job_value: 0.00,
      customer_rating: null,
      payment_terms: "Net 30",
      preferred_technician: null,
      emergency_contact: "Property Manager - (555) 111-1111",
      special_instructions: "Large complex. Coordinate with property management.",
      tags: ["prospect", "commercial", "large-account"],
      loyalty_points: 0,
      referrals_made: 0,
      last_contact: "2024-01-05T09:00:00Z",
      contact_method: "email",
      satisfaction_score: null,
      lifetime_value: 0.00,
      risk_score: "unknown",
      notes_count: 1,
      invoices_count: 0,
      estimates_count: 2,
      coordinates: { lat: 40.7694, lng: -73.9442 }
    }
  ];

  const mockStats = {
    total_customers: mockCustomers.length,
    active_customers: mockCustomers.filter(c => c.status === 'active').length,
    prospect_customers: mockCustomers.filter(c => c.status === 'prospect').length,
    inactive_customers: mockCustomers.filter(c => c.status === 'inactive').length,
    residential_customers: mockCustomers.filter(c => c.customer_type === 'residential').length,
    commercial_customers: mockCustomers.filter(c => c.customer_type === 'commercial').length,
    avg_customer_value: mockCustomers.reduce((sum, c) => sum + c.lifetime_value, 0) / mockCustomers.length,
    total_revenue: mockCustomers.reduce((sum, c) => sum + c.total_spent, 0),
    avg_satisfaction: mockCustomers.filter(c => c.satisfaction_score).reduce((sum, c) => sum + c.satisfaction_score, 0) / mockCustomers.filter(c => c.satisfaction_score).length,
    retention_rate: 85,
    referral_rate: 23,
    growth_rate: 12
  };

  useEffect(() => {
    // Initialize with mock data for demonstration
    setCustomers(mockCustomers);
  }, []);

  // Filtering and sorting logic
  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers.filter(customer => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          customer.name.toLowerCase().includes(searchLower) ||
          (customer.company && customer.company.toLowerCase().includes(searchLower)) ||
          customer.customer_number.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower) ||
          customer.phone.includes(searchTerm) ||
          customer.primary_address.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Customer type filter
      if (selectedCustomerType !== "all" && customer.customer_type !== selectedCustomerType) return false;

      // Service area filter
      if (selectedServiceArea !== "all" && customer.service_area !== selectedServiceArea) return false;

      // Status filter
      if (selectedStatus !== "all" && customer.status !== selectedStatus) return false;

      // Value filter
      if (selectedValue !== "all") {
        switch (selectedValue) {
          case "high":
            if (customer.lifetime_value < 5000) return false;
            break;
          case "medium":
            if (customer.lifetime_value < 1000 || customer.lifetime_value >= 5000) return false;
            break;
          case "low":
            if (customer.lifetime_value >= 1000) return false;
            break;
        }
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "last_service":
          aValue = new Date(a.last_service || 0);
          bValue = new Date(b.last_service || 0);
          break;
        case "total_spent":
          aValue = a.total_spent || 0;
          bValue = b.total_spent || 0;
          break;
        case "satisfaction_score":
          aValue = a.satisfaction_score || 0;
          bValue = b.satisfaction_score || 0;
          break;
        case "lifetime_value":
          aValue = a.lifetime_value || 0;
          bValue = b.lifetime_value || 0;
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
  }, [customers, searchTerm, selectedCustomerType, selectedServiceArea, selectedStatus, selectedValue, sortBy, sortOrder]);

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "inactive": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "prospect": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "vip": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "low": return "text-green-600 dark:text-green-400";
      case "medium": return "text-yellow-600 dark:text-yellow-400";
      case "high": return "text-red-600 dark:text-red-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getCustomerTypeIcon = (type) => {
    switch (type) {
      case "residential": return <Home className="w-4 h-4" />;
      case "commercial": return <Building className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const formatLastService = (lastService) => {
    if (!lastService) return "Never";
    const days = differenceInDays(new Date(), new Date(lastService));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    const months = differenceInMonths(new Date(), new Date(lastService));
    return `${months} month${months > 1 ? 's' : ''} ago`;
  };

  const getValueSegment = (lifetimeValue) => {
    if (lifetimeValue >= 5000) return { label: "High Value", color: "text-green-600" };
    if (lifetimeValue >= 1000) return { label: "Medium Value", color: "text-yellow-600" };
    return { label: "Low Value", color: "text-gray-600" };
  };

  // Bulk actions
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCustomers(filteredAndSortedCustomers.map(customer => customer.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId, checked) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId]);
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Business Header Component */}
      <Header />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Customer Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
              <p className="text-muted-foreground">Build lasting relationships with comprehensive customer profiles and service history</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import
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
                <UserPlus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </div>

          {/* Customer Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                    <p className="text-2xl font-bold">{mockStats.total_customers}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-green-600">{mockStats.active_customers}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Prospects</p>
                    <p className="text-2xl font-bold text-blue-600">{mockStats.prospect_customers}</p>
                  </div>
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Value</p>
                    <p className="text-2xl font-bold text-purple-600">${mockStats.avg_customer_value?.toFixed(0)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
                    <p className="text-2xl font-bold text-yellow-600">{mockStats.avg_satisfaction?.toFixed(1)}/10</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Retention</p>
                    <p className="text-2xl font-bold text-green-600">{mockStats.retention_rate}%</p>
                  </div>
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search customers by name, company, email, phone, or address..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCustomerType("all");
                      setSelectedServiceArea("all");
                      setSelectedStatus("all");
                      setSelectedValue("all");
                    }}
                  >
                    Clear All
                  </Button>
                </div>

                {/* Filters */}
                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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

                    <Select value={selectedServiceArea} onValueChange={setSelectedServiceArea}>
                      <SelectTrigger>
                        <SelectValue placeholder="Service Area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Areas</SelectItem>
                        <SelectItem value="North Zone">North Zone</SelectItem>
                        <SelectItem value="South Zone">South Zone</SelectItem>
                        <SelectItem value="East Zone">East Zone</SelectItem>
                        <SelectItem value="West Zone">West Zone</SelectItem>
                        <SelectItem value="Downtown Zone">Downtown Zone</SelectItem>
                        <SelectItem value="Industrial Zone">Industrial Zone</SelectItem>
                        <SelectItem value="Financial Zone">Financial Zone</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="prospect">Prospect</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedValue} onValueChange={setSelectedValue}>
                      <SelectTrigger>
                        <SelectValue placeholder="Customer Value" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Values</SelectItem>
                        <SelectItem value="high">High Value ($5,000+)</SelectItem>
                        <SelectItem value="medium">Medium Value ($1,000-$4,999)</SelectItem>
                        <SelectItem value="low">Low Value (<$1,000)</SelectItem>
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
                        <SelectItem value="name-asc">Name: A-Z</SelectItem>
                        <SelectItem value="name-desc">Name: Z-A</SelectItem>
                        <SelectItem value="last_service-desc">Recent Service</SelectItem>
                        <SelectItem value="total_spent-desc">Highest Spent</SelectItem>
                        <SelectItem value="lifetime_value-desc">Highest Value</SelectItem>
                        <SelectItem value="satisfaction_score-desc">Highest Satisfaction</SelectItem>
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
          {selectedCustomers.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{selectedCustomers.length} customer(s) selected</span>
                    <Button variant="outline" size="sm" onClick={() => setSelectedCustomers([])}>
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
                        <DropdownMenuLabel>Communication</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email Campaign
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Send SMS
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Management</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Tag className="w-4 h-4 mr-2" />
                          Add Tags
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="w-4 h-4 mr-2" />
                          Generate Report
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Export Selected
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Archive className="w-4 h-4 mr-2" />
                          Archive Selected
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Customers List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Customer Directory ({filteredAndSortedCustomers.length} of {customers.length})
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedCustomers.length === filteredAndSortedCustomers.length && filteredAndSortedCustomers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-muted-foreground">Select All</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredAndSortedCustomers.map((customer) => (
                  <div key={customer.id} className="p-6 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Selection Checkbox */}
                      <Checkbox
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked)}
                        className="mt-1"
                      />

                      {/* Customer Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            {/* Customer Header */}
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className="flex items-center gap-2">
                                {getCustomerTypeIcon(customer.customer_type)}
                                <h3 className="font-semibold text-lg">
                                  {customer.company || customer.name}
                                </h3>
                                {customer.company && (
                                  <span className="text-sm text-muted-foreground">({customer.name})</span>
                                )}
                              </div>
                              <Badge className={getStatusColor(customer.status)}>
                                {customer.status}
                              </Badge>
                              <Badge variant="outline" className={getValueSegment(customer.lifetime_value).color}>
                                {getValueSegment(customer.lifetime_value).label}
                              </Badge>
                              {customer.tags && customer.tags.includes('vip') && (
                                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                  <Award className="w-3 h-3 mr-1" />
                                  VIP
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">#{customer.customer_number}</span>
                            </div>
                            
                            {/* Customer Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                <div>
                                  <p className="font-medium">Contact</p>
                                  <p className="truncate">{customer.email}</p>
                                  <p>{customer.phone}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <div>
                                  <p className="font-medium">Location</p>
                                  <p className="truncate">{customer.service_area}</p>
                                  <p className="text-xs truncate">{customer.primary_address}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Activity className="w-4 h-4" />
                                <div>
                                  <p className="font-medium">Service History</p>
                                  <p>{customer.total_jobs} jobs • {customer.completed_jobs} completed</p>
                                  <p className="text-xs">Last: {formatLastService(customer.last_service)}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <TrendingUp className="w-4 h-4" />
                                <div>
                                  <p className="font-medium">Performance</p>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current text-yellow-500" />
                                    <span>{customer.satisfaction_score?.toFixed(1) || 'N/A'}</span>
                                  </div>
                                  <p className="text-xs">Risk: <span className={getRiskColor(customer.risk_score)}>{customer.risk_score}</span></p>
                                </div>
                              </div>
                            </div>

                            {/* Customer Metrics */}
                            <div className="flex items-center gap-6 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                <span>Total Spent: ${customer.total_spent?.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                <span>Lifetime Value: ${customer.lifetime_value?.toLocaleString()}</span>
                              </div>
                              {customer.loyalty_points > 0 && (
                                <div className="flex items-center gap-1">
                                  <Zap className="w-3 h-3" />
                                  <span>{customer.loyalty_points} points</span>
                                </div>
                              )}
                              {customer.referrals_made > 0 && (
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  <span>{customer.referrals_made} referrals</span>
                                </div>
                              )}
                              {customer.preferred_technician && (
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  <span>Prefers: {customer.preferred_technician}</span>
                                </div>
                              )}
                            </div>

                            {/* Tags */}
                            {customer.tags && customer.tags.length > 0 && (
                              <div className="flex gap-1 flex-wrap">
                                {customer.tags.slice(0, 3).map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                                {customer.tags.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{customer.tags.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Customer Actions & Lifetime Value */}
                          <div className="text-right ml-6 space-y-2">
                            <div>
                              <p className="font-bold text-2xl text-green-600">
                                ${customer.lifetime_value?.toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">Lifetime Value</p>
                              {customer.satisfaction_score && (
                                <div className="flex items-center justify-end gap-1 mt-1">
                                  <Star className="w-3 h-3 fill-current text-yellow-500" />
                                  <span className="text-xs">{customer.satisfaction_score.toFixed(1)}/10</span>
                                </div>
                              )}
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
                                  <DropdownMenuItem>
                                    <Navigation className="w-4 h-4 mr-2" />
                                    Get Directions
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Schedule Service
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FileText className="w-4 h-4 mr-2" />
                                    Create Estimate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <History className="w-4 h-4 mr-2" />
                                    View History
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Tag className="w-4 h-4 mr-2" />
                                    Manage Tags
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Settings className="w-4 h-4 mr-2" />
                                    Customer Settings
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
                
                {filteredAndSortedCustomers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No customers found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || selectedCustomerType !== "all" || selectedStatus !== "all" 
                        ? "Try adjusting your filters or search terms"
                        : "Add your first customer to get started"}
                    </p>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Customer
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
