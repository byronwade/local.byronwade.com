"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Calculator, Users, CreditCard, MessageSquare, 
  BarChart3, Zap, TrendingUp, Settings, Wrench, Truck, Package,
  Calendar, FileText, Receipt, ClipboardList, Star,
  ShoppingCart, Utensils, Car, Building, Plane
} from 'lucide-react';
import { cn } from '@lib/utils';

/**
 * Industry-specific navigation component
 * Dynamically shows available modules based on industry configuration
 */
export function IndustryNavigation({ industry, navigation, currentPath }) {
  const pathname = usePathname();
  const industrySlug = pathname.split('/')[2]; // e.g., 'field-management'

  // Navigation items configuration
  const moduleIcons = {
    // Core modules
    dashboard: LayoutDashboard,
    accounting: Calculator,
    payroll: Users,
    payments: CreditCard,
    banking: CreditCard,
    customers: Users,
    employees: Users,
    communication: MessageSquare,
    analytics: BarChart3,
    automation: Zap,
    performance: TrendingUp,
    settings: Settings,

    // Field service modules
    jobs: Wrench,
    dispatch: Truck,
    inventory: Package,
    projects: Building,
    'service-plans': ClipboardList,
    estimates: FileText,
    invoices: Receipt,
    schedule: Calendar,
    pricebook: ShoppingCart,
    tools: Wrench,

    // Hospitality modules
    pos: ShoppingCart,
    reservations: Calendar,
    'menu-management': Utensils,
    'guest-services': Users,
    'event-management': Calendar,
    'room-management': Building,
    'loyalty-programs': Star,

    // Automotive modules
    'vehicle-tracking': Car,
    'parts-catalog': Package,
    'service-bays': Building,
    'warranty-management': ClipboardList,
    'inspection-systems': ClipboardList,

    // E-commerce modules
    'product-catalog': Package,
    'order-fulfillment': Truck,
    marketplace: ShoppingCart,
    'digital-marketing': TrendingUp,
    'subscription-management': Receipt,
    'shipping-logistics': Plane,

    // Other industry modules
    reviews: Star,
    marketing: TrendingUp,
    profile: Users
  };

  // Module display names
  const moduleNames = {
    // Core modules
    dashboard: 'Dashboard',
    accounting: 'Accounting',
    payroll: 'Payroll',
    payments: 'Payments',
    banking: 'Banking',
    customers: 'Customers',
    employees: 'Employees',
    communication: 'Communication',
    analytics: 'Analytics',
    automation: 'Automation',
    performance: 'Performance',
    settings: 'Settings',

    // Field service modules
    jobs: 'Jobs',
    dispatch: 'Dispatch',
    inventory: 'Inventory',
    projects: 'Projects',
    'service-plans': 'Service Plans',
    estimates: 'Estimates',
    invoices: 'Invoices',
    schedule: 'Schedule',
    pricebook: 'Price Book',
    tools: 'Tools',

    // Hospitality modules
    pos: 'Point of Sale',
    reservations: 'Reservations',
    'menu-management': 'Menu Management',
    'guest-services': 'Guest Services',
    'event-management': 'Events',
    'room-management': 'Rooms',
    'loyalty-programs': 'Loyalty Programs',

    // Automotive modules
    'vehicle-tracking': 'Vehicles',
    'parts-catalog': 'Parts Catalog',
    'service-bays': 'Service Bays',
    'warranty-management': 'Warranty',
    'inspection-systems': 'Inspections',

    // E-commerce modules
    'product-catalog': 'Products',
    'order-fulfillment': 'Orders',
    marketplace: 'Marketplace',
    'digital-marketing': 'Marketing',
    'subscription-management': 'Subscriptions',
    'shipping-logistics': 'Shipping',

    // Other
    reviews: 'Reviews',
    marketing: 'Marketing',
    profile: 'Profile'
  };

  const primaryItems = navigation.primarySections.map(module => ({
    name: moduleNames[module] || module,
    href: `/dashboard/${industrySlug}/${module === 'dashboard' ? '' : module}`,
    icon: moduleIcons[module] || LayoutDashboard,
    current: isCurrentPath(pathname, `/dashboard/${industrySlug}/${module === 'dashboard' ? '' : module}`)
  }));

  const secondaryItems = navigation.secondarySections.map(module => ({
    name: moduleNames[module] || module,
    href: `/dashboard/${industrySlug}/${module}`,
    icon: moduleIcons[module] || LayoutDashboard,
    current: isCurrentPath(pathname, `/dashboard/${industrySlug}/${module}`)
  }));

  return (
    <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      {/* Industry header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <span className="text-2xl mr-3">{industry.icon}</span>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {industry.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Business Dashboard
          </p>
        </div>
      </div>

      {/* Primary navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        <div className="space-y-1">
          {primaryItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                item.current
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
              )}
            >
              <item.icon
                className={cn(
                  item.current 
                    ? 'text-primary-foreground' 
                    : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300',
                  'mr-3 h-5 w-5 transition-colors'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </div>

        {/* Secondary navigation */}
        {secondaryItems.length > 0 && (
          <>
            <div className="pt-6">
              <p className="px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                More Tools
              </p>
            </div>
            <div className="space-y-1">
              {secondaryItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    item.current
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                  )}
                >
                  <item.icon
                    className={cn(
                      item.current 
                        ? 'text-primary-foreground' 
                        : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300',
                      'mr-3 h-5 w-5 transition-colors'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </div>
          </>
        )}
      </nav>

      {/* Industry info footer */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {industry.name} Dashboard
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {[...industry.coreModules, ...industry.industryModules].length} modules available
        </p>
      </div>
    </div>
  );
}

/**
 * Check if current path matches navigation item
 */
function isCurrentPath(currentPath, targetPath) {
  // Handle dashboard root path
  if (targetPath.endsWith('/dashboard/')) {
    return currentPath === targetPath.slice(0, -1) || currentPath === targetPath;
  }
  
  // Handle exact matches and sub-paths
  return currentPath === targetPath || currentPath.startsWith(targetPath + '/');
}

