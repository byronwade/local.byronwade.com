"use client";

import React from 'react';
import { getIndustryConfig, getIndustryNavigation, getUserIndustryType } from '../services/industryConfig';
import { IndustryNavigation } from './IndustryNavigation';
import { IndustryHeader } from './IndustryHeader';
import ModuleRouter from './ModuleRouter';
import useAuth from '@hooks/use-auth';

/**
 * Shared Industry Dashboard Layout
 * Provides consistent layout and navigation for all industry dashboards
 * Uses modular architecture for flexible feature management
 */
export default function IndustryDashboardLayout({ 
  industryType, 
  children,
  pageTitle,
  pageDescription,
  showNavigation = true,
  showHeader = true 
}) {
  const { user } = useAuth();
  const config = getIndustryConfig(industryType);
  const navigation = getIndustryNavigation(industryType);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Industry-specific header */}
      {showHeader && (
        <IndustryHeader 
          industry={config}
          user={user}
          pageTitle={pageTitle}
          pageDescription={pageDescription}
        />
      )}

      <div className="flex">
        {/* Industry-specific navigation */}
        {showNavigation && (
          <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16">
            <IndustryNavigation 
              industry={config}
              navigation={navigation}
              currentPath={window?.location?.pathname}
            />
          </div>
        )}

        {/* Main content area */}
        <div className={`flex-1 ${showNavigation ? 'lg:pl-64' : ''} ${showHeader ? 'pt-16' : ''}`}>
          <ModuleRouter industryType={industryType}>
            {children}
          </ModuleRouter>
        </div>
      </div>
    </div>
  );
}

/**
 * HOC for wrapping industry dashboard pages
 */
export function withIndustryLayout(WrappedComponent, industryType) {
  return function IndustryLayoutWrapper(props) {
    return (
      <IndustryDashboardLayout industryType={industryType}>
        <WrappedComponent {...props} />
      </IndustryDashboardLayout>
    );
  };
}

/**
 * Hook for accessing industry configuration in components
 */
export function useIndustryConfig(industryType) {
  const { user } = useAuth();
  const userIndustryType = getUserIndustryType(user);
  const effectiveIndustryType = industryType || userIndustryType;
  
  return {
    industryType: effectiveIndustryType,
    config: getIndustryConfig(effectiveIndustryType),
    navigation: getIndustryNavigation(effectiveIndustryType),
    user
  };
}

