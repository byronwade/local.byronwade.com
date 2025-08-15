"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator, 
  DropdownMenuLabel, 
  DropdownMenuGroup 
} from "@components/ui/dropdown-menu";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle 
} from "@components/ui/sheet";
import { 
  ChevronDown, 
  Menu, 
  Settings, 
  Briefcase, 
  CreditCard, 
  HelpCircle, 
  User, 
  Building2, 
  Plus, 
  Star, 
  BarChart3, 
  Calendar, 
  Users, 
  Book, 
  Package, 
  TrendingUp,
  ShoppingCart,
  X,
  Truck,
  Monitor,
  Crown, 
  Calculator, 
  GraduationCap,
  Shield,
  LogOut,
  Home,
  MapPin,
  ShoppingBag
} from "lucide-react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { RiComputerFill } from "react-icons/ri";
import { useTheme } from "next-themes";
import { useAuthStore } from "@store/auth";
import { logger } from "@lib/utils/logger";
import AdvancedSearch from "./advanced-search";
import AdvancedSearchHeader from "./advanced-search-header";
import RealTimeNotifications from "./real-time-notifications";
import BreadcrumbNavigation from "./breadcrumb-navigation";
import KeyboardShortcuts from "./keyboard-shortcuts";
import MicroInteractions from "./micro-interactions";

/**
 * Unified Header Component - Consistent across all dashboards
 * Features: Mobile responsive, professional dropdowns, configurable for different dashboard types
 * Performance: Optimized with memoization and efficient re-renders
 */
export default function UnifiedHeader({ 
  dashboardType = "business",
  showCompanySelector = true,
  showSearch = false,
  showCart = false,
  customNavItems = null,
  customNotifications = null,
  customTitle = null,
  customSubtitle = null
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentCompanyId, setCurrentCompanyId] = useState("1");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(3); // Mock cart count
  
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  
  const { user, userRoles, logout } = useAuthStore((state) => ({
    user: state.user,
    userRoles: state.userRoles,
    logout: state.logout,
  }));

  // Performance tracking
  const startTime = performance.now();

  // Mock companies data (in production, this would come from context/API)
  const mockCompanies = useMemo(() => [
    {
      id: "1",
      name: "Wade's Plumbing & Septic",
      industry: "Plumbing Services",
      status: "active",
      subscription: "Pro",
      location: "Raleigh, NC",
    },
    {
      id: "2", 
      name: "Downtown Coffee Co.",
      industry: "Food & Beverage",
      status: "active",
      subscription: "Basic",
      location: "Raleigh, NC",
    },
    {
      id: "3",
      name: "Elite Auto Repair", 
      industry: "Automotive",
      status: "active",
      subscription: "Pro",
      location: "Durham, NC",
    },
  ], []);

  const currentCompany = useMemo(() => 
    mockCompanies.find((company) => company.id === currentCompanyId) || mockCompanies[0],
    [mockCompanies, currentCompanyId]
  );

  // Dashboard configurations
  const dashboardConfigs = useMemo(() => ({
    business: {
      title: customTitle || "Thorbis Business",
      subtitle: customSubtitle || "Directory & Field Services Dashboard",
      logoHoverClass: "group-hover:from-blue-500/20 group-hover:to-green-500/20",
      primaryColor: "blue",
      showCompanySelector: true,
    },
    user: {
      title: customTitle || "Thorbis", 
      subtitle: customSubtitle || "Personal Dashboard",
      logoHoverClass: "group-hover:from-purple-500/20 group-hover:to-blue-500/20",
      primaryColor: "purple",
      showCompanySelector: false,
    },
    admin: {
      title: customTitle || "Thorbis Admin",
      subtitle: customSubtitle || "Administrative Dashboard", 
      logoHoverClass: "group-hover:from-red-500/20 group-hover:to-orange-500/20",
      primaryColor: "red",
      showCompanySelector: false,
    },
    academy: {
      title: customTitle || "Thorbis Academy",
      subtitle: customSubtitle || "Learning Dashboard",
      logoHoverClass: "group-hover:from-green-500/20 group-hover:to-blue-500/20", 
      primaryColor: "green",
      showCompanySelector: false,
    },
    site: {
      title: customTitle || "Thorbis",
      subtitle: customSubtitle || "Local Business Directory",
      logoHoverClass: "group-hover:from-blue-500/20 group-hover:to-green-500/20",
      primaryColor: "blue",
      showCompanySelector: false,
    },
    localhub: {
      title: customTitle || "Thorbis LocalHub",
      subtitle: customSubtitle || "Community Dashboard",
      logoHoverClass: "group-hover:from-indigo-500/20 group-hover:to-purple-500/20",
      primaryColor: "indigo", 
      showCompanySelector: false,
    },
    gofor: {
      title: customTitle || "Thorbis GoFor",
      subtitle: customSubtitle || "Delivery Dashboard",
      logoHoverClass: "group-hover:from-orange-500/20 group-hover:to-red-500/20",
      primaryColor: "orange",
      showCompanySelector: true,
    },
  }), [customTitle, customSubtitle]);

  const config = dashboardConfigs[dashboardType] || dashboardConfigs.business;

  // Navigation items by dashboard type
  const getNavigationItems = useMemo(() => {
    if (customNavItems) return customNavItems;

    const navConfigs = {
      business: [
        { key: "dashboard", text: "Dashboard", icon: BarChart3, href: "/dashboard/business" },
        { key: "profile", text: "Directory Profile", icon: User, href: "/dashboard/business/profile" },
        { key: "schedule", text: "Scheduling", icon: Calendar, href: "/dashboard/business/schedule" },
        { key: "jobs", text: "Jobs", icon: Briefcase, href: "/dashboard/business/jobs" },
        { key: "customers", text: "Customers", icon: Users, href: "/dashboard/business/customers" },
        { key: "analytics", text: "Analytics", icon: TrendingUp, href: "/dashboard/business/analytics" },
      ],
      user: [
        { key: "dashboard", text: "Dashboard", icon: BarChart3, href: "/dashboard/user" },
        { key: "reviews", text: "Reviews", icon: Star, href: "/dashboard/user/reviews" },
        { key: "bookmarks", text: "Bookmarks", icon: Book, href: "/dashboard/user/bookmarks" },
        { key: "jobs", text: "Jobs", icon: Briefcase, href: "/dashboard/user/jobs" },
      ],
      admin: [
        { key: "dashboard", text: "Dashboard", icon: BarChart3, href: "/admin" },
        { key: "users", text: "Users", icon: Users, href: "/admin/users" },
        { key: "customers", text: "Customers", icon: Users, href: "/admin/customers" },
        { key: "billing", text: "Billing", icon: CreditCard, href: "/admin/billing" },
        { key: "settings", text: "Settings", icon: Settings, href: "/admin/settings" },
      ],
      academy: [
        { key: "overview", text: "Overview", icon: BarChart3, href: "/academy" },
        { key: "courses", text: "Courses", icon: Book, href: "/academy/courses" },
        { key: "progress", text: "Progress", icon: TrendingUp, href: "/academy/progress" },
        { key: "certifications", text: "Certificates", icon: Crown, href: "/academy/certifications" },
      ],
      site: [
        { key: "home", text: "Home", icon: Home, href: "/" },
        { key: "categories", text: "Categories", icon: MapPin, href: "/categories" },
        { key: "pricing", text: "Pricing", icon: Calculator, href: "/pricing" },
        { key: "business", text: "For Business", icon: Building2, href: "/add-a-business" },
        ...(pathname.startsWith("/store") ? [
          { key: "store", text: "Store", icon: ShoppingBag, href: "/store" },
          { key: "store-categories", text: "Categories", icon: Package, href: "/store/categories" },
          { key: "deals", text: "Deals", icon: TrendingUp, href: "/store/deals" },
        ] : []),
      ],
      localhub: [
        { key: "dashboard", text: "Dashboard", icon: BarChart3, href: "/dashboard/localhub" },
        { key: "community", text: "Community", icon: Users, href: "/dashboard/localhub/community" },
        { key: "events", text: "Events", icon: Calendar, href: "/dashboard/localhub/events" },
      ],
      gofor: [
        { key: "dashboard", text: "Dashboard", icon: BarChart3, href: "/dashboard/gofor" },
        { key: "deliveries", text: "Deliveries", icon: Truck, href: "/dashboard/gofor/deliveries" },
        { key: "drivers", text: "Drivers", icon: Users, href: "/dashboard/gofor/drivers" },
      ],
    };

    return navConfigs[dashboardType] || navConfigs.business;
  }, [dashboardType, customNavItems]);

  // Handle logout with performance tracking
  const handleLogout = async () => {
    const logoutStart = performance.now();
    try {
      await logout();
      const logoutTime = performance.now() - logoutStart;
      logger.performance(`Logout completed in ${logoutTime.toFixed(2)}ms`);
      logger.user({
        action: 'logout',
        userId: user?.id,
        timestamp: Date.now(),
      });
    } catch (error) {
      logger.error('Logout failed:', error);
    }
  };

  // Sub-navigation configuration for business dashboard
  const businessSubNavItems = useMemo(() => ({
    dashboard: [
      { text: "Overview", href: "/dashboard/business/dashboard/overview" },
      { text: "Real-time Insights", href: "/dashboard/business/dashboard/real-time-insights" },
    ],
    schedule: [
      { text: "Calendar", href: "/dashboard/business/schedule/calendar" },
      { text: "New Job", href: "/dashboard/business/schedule/new-job" },
      { text: "Recurring Jobs", href: "/dashboard/business/schedule/recurring-jobs" },
      { text: "Dispatch", href: "/dashboard/business/dispatch" },
      { text: "Capacity Planning", href: "/dashboard/business/schedule/capacity-planning" },
    ],
    jobs: [
      { text: "List", href: "/dashboard/business/jobs/list" },
      { text: "Details", href: "/dashboard/business/jobs/details" },
      { text: "Photos & Checklists", href: "/dashboard/business/jobs/photos-checklists" },
      { text: "Job Costs", href: "/dashboard/business/jobs/job-costs" },
    ],
    customers: [
      { text: "List", href: "/dashboard/business/customers/list" },
      { text: "Details", href: "/dashboard/business/customers/details" },
      { text: "Service History", href: "/dashboard/business/customers/service-history" },
      { text: "Portal Access", href: "/dashboard/business/customers/portal-access" },
    ],
    analytics: [
      { text: "Dashboard", href: "/dashboard/business/analytics/dashboard" },
      { text: "Reports", href: "/dashboard/business/analytics/reports" },
      { text: "Custom Builder", href: "/dashboard/business/analytics/custom-report-builder" },
    ],
    profile: [
      { text: "Business Info", href: "/dashboard/business/profile" },
      { text: "Photos", href: "/dashboard/business/profile/photos" },
      { text: "Hours", href: "/dashboard/business/profile/hours" },
      { text: "Service Areas", href: "/dashboard/business/profile/service-areas" },
    ],
  }), []);

  // Determine active navigation item
  const activeNavKey = useMemo(() => {
    const pathSegments = pathname.split('/');
    const relevantSegment = pathSegments[pathSegments.indexOf(dashboardType) + 1] || 'dashboard';
    return getNavigationItems.some(item => item.key === relevantSegment) ? relevantSegment : 'dashboard';
  }, [pathname, dashboardType, getNavigationItems]);

  // Get current sub-navigation items (only for business dashboard)
  const currentSubNavItems = useMemo(() => {
    if (dashboardType === 'business') {
      return businessSubNavItems[activeNavKey] || [];
    }
    return [];
  }, [dashboardType, activeNavKey, businessSubNavItems]);

  // Keyboard shortcut handler for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowAdvancedSearch(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Determine if breadcrumbs should be shown
  const shouldShowBreadcrumbs = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    
    // Hide breadcrumbs on store pages
    if (pathname.startsWith('/store')) return false;

    // Don't show breadcrumbs on home page
    if (pathname === '/') return false;
    
    // For dashboard pages, only show if deeper than main dashboard
    if (pathname.startsWith('/dashboard')) {
      return pathSegments.length > 2;
    }
    
    // For other pages, show if more than one segment
    return pathSegments.length > 1;
  }, [pathname]);

  // Performance logging
  useEffect(() => {
    const renderTime = performance.now() - startTime;
    logger.performance(`UnifiedHeader (${dashboardType}) rendered in ${renderTime.toFixed(2)}ms`);
  }, [dashboardType, startTime]);

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      {/* Main Header */}
      <div className="flex items-center justify-between w-full gap-4 py-3 px-4 lg:px-6">
        
        {/* Left Section - Logo and Company Info */}
        <div className="flex items-center space-x-4 min-w-0">
          {/* Logo and Title with Micro-interactions */}
          <MicroInteractions type="navigation">
            <Link href="/" className="flex items-center space-x-3 text-xl font-bold group">
              <div className="relative">
                <Image 
                  src="/logos/ThorbisLogo.webp" 
                  alt={config.title} 
                  width={48} 
                  height={48} 
                  className="w-12 h-12 transition-transform duration-200 group-hover:scale-105" 
                />
                <div className={`absolute inset-0 transition-opacity duration-200 rounded-full opacity-0 ${config.logoHoverClass} group-hover:opacity-100`} />
              </div>
              <div className="hidden sm:block min-w-0">
                <h1 className="text-lg font-bold leading-none text-foreground truncate">{config.title}</h1>
                <p className="text-xs text-muted-foreground truncate">{config.subtitle}</p>
              </div>
            </Link>
          </MicroInteractions>

          {/* Company Selector - Only show for applicable dashboards */}
          {(showCompanySelector && config.showCompanySelector) && (
            <div className="hidden lg:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="max-w-[240px] justify-start">
                    <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <div className="font-medium text-foreground truncate text-sm">{currentCompany.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {currentCompany.industry} • {currentCompany.subscription}
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="start">
                  <DropdownMenuLabel>Your Companies</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {mockCompanies.map((company) => (
                    <DropdownMenuItem 
                      key={company.id} 
                      onClick={() => setCurrentCompanyId(company.id)}
                      className={`flex items-center space-x-3 p-3 cursor-pointer ${
                        company.id === currentCompanyId ? "bg-accent" : ""
                      }`}
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-foreground truncate">{company.name}</span>
                          {company.subscription === "Pro" && (
                            <Badge variant="secondary" className="text-xs">Pro</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{company.industry}</p>
                        <p className="text-xs text-muted-foreground truncate">{company.location}</p>
                      </div>
                      {company.id === currentCompanyId && (
                        <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </DropdownMenuItem>
                  ))}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/add-a-business" className="flex items-center space-x-3 p-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Plus className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-foreground">Add New Company</span>
                        <p className="text-xs text-muted-foreground">Create or claim a new business</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Advanced Search Header - Optional */}
          {showSearch && (
            <AdvancedSearchHeader 
              onSearch={(query, location) => {
                // Handle search with query and location
                console.log("Search:", query, location);
                // You can add navigation logic here or trigger the advanced search dialog
                setShowAdvancedSearch(true);
              }}
              placeholder="Find restaurants, services, and more..."
              showAiMode={true}
              showVoiceSearch={true}
              showLocationSelector={true}
              className="w-full"
            />
          )}
        </div>

        {/* Right Section - Navigation and User Controls */}
        <div className="flex items-center space-x-2">
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {getNavigationItems.slice(0, 5).map((item) => {
              const isActive = activeNavKey === item.key;
              const IconComponent = item.icon;
              
              return (
                <MicroInteractions key={item.key} type="button">
                  <Link href={item.href}>
                    <Button 
                      variant={isActive ? "default" : "ghost"} 
                      size="sm" 
                      className={`text-sm font-medium transition-colors ${
                        isActive 
                          ? "bg-primary/10 text-primary border border-primary/20" 
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {item.text}
                    </Button>
                  </Link>
                </MicroInteractions>
              );
            })}

            {/* More Navigation - Dropdown for additional items */}
            {getNavigationItems.length > 5 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-sm font-medium">
                    More
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  {getNavigationItems.slice(5).map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeNavKey === item.key;
                    
                    return (
                      <DropdownMenuItem key={item.key} asChild>
                        <Link href={item.href} className={`flex items-center space-x-2 w-full ${
                          isActive ? "bg-accent text-accent-foreground" : ""
                        }`}>
                          <IconComponent className="w-4 h-4" />
                          <span>{item.text}</span>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Shopping Cart - Store Only */}
          {showCart && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MicroInteractions type="button">
                  <Button variant="ghost" size="sm" className="relative h-9 w-9 rounded-full">
                    <ShoppingCart className="w-4 h-4" />
                    {cartItemCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-full flex items-center justify-center p-0">
                        {cartItemCount}
                      </Badge>
                    )}
                  </Button>
                </MicroInteractions>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel className="text-center">
                  <div className="flex items-center justify-between">
                    <span>Shopping Cart</span>
                    <Badge variant="outline" className="text-xs">
                      {cartItemCount} items
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <div className="max-h-64 overflow-y-auto">
                  {cartItemCount > 0 ? (
                    <>
                      {/* Mock cart items */}
                      <div className="p-3 border-b border-border/50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center">
                            <Monitor className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">Thorbis POS Pro</p>
                            <p className="text-xs text-muted-foreground">$1,299.00</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 border-b border-border/50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">Payment Terminal</p>
                            <p className="text-xs text-muted-foreground">$199.00</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center">
                            <Truck className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">Fleet Tracker</p>
                            <p className="text-xs text-muted-foreground">$399.00</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center">
                      <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">Your cart is empty</p>
                      <p className="text-xs text-muted-foreground mt-1">Add items to get started</p>
                    </div>
                  )}
                </div>

                {cartItemCount > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium">Total:</span>
                        <span className="text-sm font-bold">$1,897.00</span>
                      </div>
                      <Link href="/store/cart" className="w-full">
                        <Button className="w-full" size="sm">
                          <ShoppingCart className="mr-2 w-4 h-4" />
                          View Cart & Checkout
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Real-time Notifications */}
          <RealTimeNotifications 
            dashboardType={dashboardType}
            onNotificationClick={customNotifications}
          />

          {/* Keyboard Shortcuts */}
          <KeyboardShortcuts 
            dashboardType={dashboardType}
          />

          {/* User Menu with Micro-interactions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MicroInteractions type="button">
                <Button variant="outline" size="sm" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={`https://vercel.com/api/www/avatar?u=${user?.email?.split("@")[0] || "user"}&s=64`} 
                    />
                    <AvatarFallback>
                      {user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </MicroInteractions>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              
              {/* User Info Header */}
              <div className="flex items-center p-3 space-x-3 border-b">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={`https://vercel.com/api/www/avatar?u=${user?.email?.split("@")[0] || "user"}&s=64`} 
                  />
                  <AvatarFallback>
                    {user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user?.user_metadata?.first_name || user?.email?.split("@")[0] || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>

              {/* Dashboard Switch Options */}
              <DropdownMenuGroup>
                <DropdownMenuLabel>Switch Dashboard</DropdownMenuLabel>
                
                {dashboardType !== "user" && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/user">
                      <User className="w-4 h-4 mr-2" />
                      <span>User Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {dashboardType !== "business" && userRoles?.includes("business_owner") && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/business">
                      <Building2 className="w-4 h-4 mr-2" />
                      <span>Business Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {dashboardType !== "academy" && (
                  <DropdownMenuItem asChild>
                    <Link href="/academy">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      <span>Academy</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {dashboardType !== "admin" && userRoles?.includes("admin") && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Shield className="w-4 h-4 mr-2" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Settings and Support */}
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${dashboardType}/settings`}>
                    <Settings className="w-4 h-4 mr-2" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${dashboardType}/support`}>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    <span>Support</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Theme Switcher */}
              <DropdownMenuGroup>
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <SunIcon className="w-4 h-4 mr-2" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <MoonIcon className="w-4 h-4 mr-2" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <RiComputerFill className="w-4 h-4 mr-2" />
                  System
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Back to Main Site */}
              <DropdownMenuItem asChild>
                <Link href="/">
                  <span>Back to Main Site</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Logout */}
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>{config.title}</SheetTitle>
              </SheetHeader>

              {/* Mobile Company Selector */}
              {(showCompanySelector && config.showCompanySelector) && (
                <div className="mt-6 p-4 border-b">
                  <div className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-muted">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{currentCompany.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {currentCompany.subscription} • {currentCompany.industry}
                      </p>
                    </div>
                  </div>

                  {/* Company Switch Options */}
                  <div className="mt-3 space-y-2">
                    {mockCompanies.map((company) => (
                      <button
                        key={company.id}
                        onClick={() => {
                          setCurrentCompanyId(company.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                          company.id === currentCompanyId 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-accent"
                        }`}
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-muted">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium truncate">{company.name}</span>
                            {company.subscription === "Pro" && (
                              <Badge variant="secondary" className="text-xs">Pro</Badge>
                            )}
                          </div>
                          <p className="text-xs opacity-80 truncate">{company.industry}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Navigation */}
              <nav className="mt-6">
                <ul className="space-y-2">
                  {getNavigationItems.map((item) => {
                    const isActive = activeNavKey === item.key;
                    const IconComponent = item.icon;
                    
                    return (
                      <li key={item.key}>
                        <Link href={item.href} onClick={() => setMobileMenuOpen(false)}>
                          <Button 
                            variant={isActive ? "default" : "ghost"} 
                            className={`w-full justify-start ${
                              isActive ? "bg-primary/10 text-primary" : ""
                            }`}
                          >
                            <IconComponent className="w-4 h-4 mr-2" />
                            {item.text}
                          </Button>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Mobile User Actions */}
              <div className="mt-8 pt-4 border-t space-y-2">
                <Link href={`/dashboard/${dashboardType}/settings`} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                
                <Link href={`/dashboard/${dashboardType}/support`} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Support
                  </Button>
                </Link>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600 focus:text-red-600"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Breadcrumb Navigation - Only show when needed */}
      {shouldShowBreadcrumbs && (
        <div className="border-t border-border bg-background/30 backdrop-blur-sm">
          <div className="px-4 lg:px-6 py-2">
            <BreadcrumbNavigation 
              dashboardType={dashboardType}
              maxItems={4}
              showRelated={true}
            />
          </div>
        </div>
      )}

      {/* Sub-Header Navigation - Only for business dashboard */}
      {currentSubNavItems.length > 0 && (
        <div className="border-t border-border bg-background/50 backdrop-blur-sm">
          <div className="px-4 lg:px-6">
            {/* Desktop Sub-navigation */}
            <div className="hidden md:flex items-center py-3 space-x-1 overflow-x-auto">
              <div className="flex items-center space-x-1 min-w-0">
                {currentSubNavItems.map((item, index) => {
                  const isActiveSubNav = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link key={index} href={item.href}>
                      <Button 
                        variant={isActiveSubNav ? "secondary" : "ghost"} 
                        size="sm" 
                        className={`text-sm whitespace-nowrap transition-colors ${
                          isActiveSubNav 
                            ? "bg-muted text-foreground hover:bg-muted/80" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {item.text}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Sub-navigation - Horizontal Scroll */}
            <div className="flex md:hidden py-3 space-x-2 overflow-x-auto scrollbar-hide">
              {currentSubNavItems.map((item, index) => {
                const isActiveSubNav = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link key={index} href={item.href}>
                    <Button 
                      variant={isActiveSubNav ? "secondary" : "ghost"} 
                      size="sm" 
                      className={`text-sm whitespace-nowrap flex-shrink-0 transition-colors ${
                        isActiveSubNav 
                          ? "bg-muted text-foreground hover:bg-muted/80" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {item.text}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Advanced Search Dialog */}
      {showAdvancedSearch && (
        <AdvancedSearch 
          dashboardType={dashboardType}
          onSearchSelect={() => setShowAdvancedSearch(false)}
          isOpen={showAdvancedSearch}
          onClose={() => setShowAdvancedSearch(false)}
        />
      )}
    </div>
  );
}
