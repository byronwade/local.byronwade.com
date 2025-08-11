/**
 * Industry Configuration Service
 * Manages industry-specific module configurations and feature flags
 */

export const INDUSTRY_TYPES = {
  FIELD_SERVICE: 'field-service',
  HOSPITALITY: 'hospitality', 
  AUTOMOTIVE: 'automotive',
  RETAIL: 'retail',
  ECOMMERCE: 'ecommerce',
  LOGISTICS: 'logistics',
  PROPERTY: 'property-management',
  AGRICULTURE: 'agriculture',
  GENERAL_BUSINESS: 'business'
};

/**
 * Core modules available to all industries
 */
export const CORE_MODULES = {
  ACCOUNTING: 'accounting',
  PAYROLL: 'payroll', 
  PAYMENTS: 'payments',
  BANKING: 'banking',
  CUSTOMERS: 'customers',
  EMPLOYEES: 'employees',
  COMMUNICATION: 'communication',
  ANALYTICS: 'analytics',
  AUTOMATION: 'automation',
  PERFORMANCE: 'performance',
  SETTINGS: 'settings'
};

/**
 * Industry-specific module configurations
 */
export const INDUSTRY_CONFIGS = {
  [INDUSTRY_TYPES.FIELD_SERVICE]: {
    name: 'Field Service',
    icon: '🔧',
    coreModules: Object.values(CORE_MODULES),
    industryModules: [
      'jobs',
      'dispatch', 
      'inventory',
      'projects',
      'service-plans',
      'estimates',
      'invoices',
      'schedule',
      'pricebook',
      'tools'
    ],
    customizations: {
      [CORE_MODULES.EMPLOYEES]: {
        enableVehicleAssignment: true,
        enableSkillsTracking: true,
        enableLocationTracking: true
      },
      [CORE_MODULES.CUSTOMERS]: {
        enablePropertyProfiles: true,
        enableServiceHistory: true,
        enableEquipmentTracking: true
      },
      [CORE_MODULES.ANALYTICS]: {
        enableJobProfitAnalysis: true,
        enableRouteOptimization: true,
        enableTechnicianPerformance: true
      }
    },
    navigation: {
      primarySections: ['dashboard', 'schedule', 'jobs', 'customers'],
      secondarySections: ['estimates', 'invoices', 'inventory', 'employees']
    }
  },

  [INDUSTRY_TYPES.HOSPITALITY]: {
    name: 'Hospitality',
    icon: '🏨',
    coreModules: Object.values(CORE_MODULES),
    industryModules: [
      'pos',
      'reservations',
      'menu-management',
      'guest-services',
      'event-management',
      'room-management',
      'loyalty-programs'
    ],
    customizations: {
      [CORE_MODULES.CUSTOMERS]: {
        enableGuestProfiles: true,
        enableLoyaltyTracking: true,
        enablePreferences: true
      },
      [CORE_MODULES.EMPLOYEES]: {
        enableShiftManagement: true,
        enableTipTracking: true,
        enableStationAssignment: true
      },
      [CORE_MODULES.ANALYTICS]: {
        enableSeatingAnalytics: true,
        enableMenuAnalytics: true,
        enableSeasonalTrends: true
      }
    },
    navigation: {
      primarySections: ['dashboard', 'pos', 'reservations', 'menu-management'],
      secondarySections: ['guests', 'events', 'employees', 'analytics']
    }
  },

  [INDUSTRY_TYPES.AUTOMOTIVE]: {
    name: 'Automotive',
    icon: '🚗',
    coreModules: Object.values(CORE_MODULES),
    industryModules: [
      'vehicle-tracking',
      'parts-catalog',
      'service-bays',
      'warranty-management',
      'inspection-systems',
      'estimates',
      'invoices'
    ],
    customizations: {
      [CORE_MODULES.CUSTOMERS]: {
        enableVehicleProfiles: true,
        enableMaintenanceHistory: true,
        enableWarrantyTracking: true
      },
      [CORE_MODULES.EMPLOYEES]: {
        enableCertificationTracking: true,
        enableBayAssignment: true,
        enableCommissionTracking: true
      },
      [CORE_MODULES.ANALYTICS]: {
        enablePartsAnalytics: true,
        enableServiceBayUtilization: true,
        enableWarrantyAnalytics: true
      }
    },
    navigation: {
      primarySections: ['dashboard', 'service-bays', 'customers', 'parts-catalog'],
      secondarySections: ['estimates', 'invoices', 'warranty', 'employees']
    }
  },

  [INDUSTRY_TYPES.RETAIL]: {
    name: 'Retail',
    icon: '🛍️',
    coreModules: Object.values(CORE_MODULES),
    industryModules: [
      'pos',
      'inventory',
      'supply-chain',
      'product-catalog',
      'store-operations',
      'promotions',
      'loyalty-programs'
    ],
    customizations: {
      [CORE_MODULES.CUSTOMERS]: {
        enableLoyaltyPrograms: true,
        enablePurchaseHistory: true,
        enablePersonalization: true
      },
      [CORE_MODULES.EMPLOYEES]: {
        enableSalesTracking: true,
        enableCommissionCalculation: true,
        enableShiftManagement: true
      },
      [CORE_MODULES.ANALYTICS]: {
        enableSalesAnalytics: true,
        enableInventoryAnalytics: true,
        enableCustomerSegmentation: true
      }
    },
    navigation: {
      primarySections: ['dashboard', 'pos', 'inventory', 'customers'],
      secondarySections: ['products', 'promotions', 'employees', 'analytics']
    }
  },

  [INDUSTRY_TYPES.ECOMMERCE]: {
    name: 'E-commerce',
    icon: '🛒',
    coreModules: Object.values(CORE_MODULES),
    industryModules: [
      'product-catalog',
      'order-fulfillment',
      'marketplace',
      'digital-marketing',
      'subscription-management',
      'shipping-logistics'
    ],
    customizations: {
      [CORE_MODULES.CUSTOMERS]: {
        enableOrderHistory: true,
        enableWishlistTracking: true,
        enableSubscriptionManagement: true
      },
      [CORE_MODULES.ANALYTICS]: {
        enableConversionTracking: true,
        enableAbandonedCartAnalysis: true,
        enableSEOAnalytics: true
      }
    },
    navigation: {
      primarySections: ['dashboard', 'products', 'orders', 'customers'],
      secondarySections: ['marketing', 'subscriptions', 'analytics', 'settings']
    }
  },

  [INDUSTRY_TYPES.GENERAL_BUSINESS]: {
    name: 'General Business',
    icon: '🏢',
    coreModules: Object.values(CORE_MODULES),
    industryModules: [
      'projects',
      'estimates', 
      'invoices',
      'marketing',
      'reviews'
    ],
    customizations: {
      [CORE_MODULES.CUSTOMERS]: {
        enableBasicProfiles: true,
        enableCommunicationHistory: true
      },
      [CORE_MODULES.EMPLOYEES]: {
        enableBasicTimeTracking: true,
        enablePerformanceReviews: true
      },
      [CORE_MODULES.ANALYTICS]: {
        enableBasicReporting: true,
        enableFinancialDashboards: true
      }
    },
    navigation: {
      primarySections: ['dashboard', 'customers', 'projects', 'invoices'],
      secondarySections: ['estimates', 'employees', 'marketing', 'analytics']
    }
  }
};

/**
 * Get industry configuration by type
 */
export function getIndustryConfig(industryType) {
  return INDUSTRY_CONFIGS[industryType] || INDUSTRY_CONFIGS[INDUSTRY_TYPES.GENERAL_BUSINESS];
}

/**
 * Check if a module is available for an industry
 */
export function isModuleAvailable(industryType, moduleName) {
  const config = getIndustryConfig(industryType);
  return config.coreModules.includes(moduleName) || config.industryModules.includes(moduleName);
}

/**
 * Get customization settings for a module in an industry
 */
export function getModuleCustomizations(industryType, moduleName) {
  const config = getIndustryConfig(industryType);
  return config.customizations?.[moduleName] || {};
}

/**
 * Get navigation structure for an industry
 */
export function getIndustryNavigation(industryType) {
  const config = getIndustryConfig(industryType);
  return config.navigation;
}

/**
 * Get all available modules for an industry (core + industry-specific)
 */
export function getAvailableModules(industryType) {
  const config = getIndustryConfig(industryType);
  return [...config.coreModules, ...config.industryModules];
}

/**
 * Determine user's industry type from user data
 */
export function getUserIndustryType(user) {
  // Check user metadata for industry type
  const industryType = user?.user_metadata?.industry_type || 
                      user?.user_metadata?.account_type ||
                      user?.industry_type;

  // Map legacy account types to industry types
  const legacyMapping = {
    'field_service': INDUSTRY_TYPES.FIELD_SERVICE,
    'restaurant': INDUSTRY_TYPES.HOSPITALITY,
    'hotel': INDUSTRY_TYPES.HOSPITALITY,
    'auto_service': INDUSTRY_TYPES.AUTOMOTIVE,
    'retail_store': INDUSTRY_TYPES.RETAIL,
    'online_store': INDUSTRY_TYPES.ECOMMERCE
  };

  return legacyMapping[industryType] || industryType || INDUSTRY_TYPES.GENERAL_BUSINESS;
}

/**
 * Get dashboard route for user based on industry
 */
export function getDashboardRoute(user) {
  const industryType = getUserIndustryType(user);
  
  // Map industry types to dashboard routes
  const routeMapping = {
    [INDUSTRY_TYPES.FIELD_SERVICE]: '/dashboard/field-management',
    [INDUSTRY_TYPES.HOSPITALITY]: '/dashboard/hospitality', 
    [INDUSTRY_TYPES.AUTOMOTIVE]: '/dashboard/automotive',
    [INDUSTRY_TYPES.RETAIL]: '/dashboard/retail',
    [INDUSTRY_TYPES.ECOMMERCE]: '/dashboard/ecommerce',
    [INDUSTRY_TYPES.LOGISTICS]: '/dashboard/logistics',
    [INDUSTRY_TYPES.PROPERTY]: '/dashboard/property-management',
    [INDUSTRY_TYPES.AGRICULTURE]: '/dashboard/agriculture',
    [INDUSTRY_TYPES.GENERAL_BUSINESS]: '/dashboard/business'
  };

  return routeMapping[industryType] || '/dashboard/business';
}

