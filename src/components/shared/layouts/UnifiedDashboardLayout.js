"use client";

import React from 'react';
import Header from '@components/business/header';

/**
 * Unified Dashboard Layout for all dashboard types
 * Uses the comprehensive business header for consistency across all dashboards
 * Maintains the same header design and layout patterns everywhere
 */
export default function UnifiedDashboardLayout({ children, dashboardType = "business" }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Unified Header - Uses the comprehensive business header for consistency */}
      <Header dashboardType={dashboardType} />
      
      {/* Main Content Area */}
      <main className="pt-0">
        {children}
      </main>
    </div>
  );
}
