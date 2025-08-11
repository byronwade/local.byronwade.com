"use client";

import React, { Suspense, lazy } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { getIndustryConfig, isModuleAvailable, getModuleCustomizations } from '../services/industryConfig';
import { Skeleton } from '@components/ui/skeleton';
import { Alert, AlertDescription } from '@components/ui/alert';
import { AlertTriangle } from 'lucide-react';

/**
 * Dynamic Module Router
 * Intelligently routes to core or industry-specific modules
 * Handles lazy loading and fallbacks
 */
export default function ModuleRouter({ industryType, children }) {
  const pathname = usePathname();
  const params = useParams();
  
  // Extract module name from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const dashboardIndex = pathSegments.indexOf('dashboard');
  const moduleSegment = pathSegments[dashboardIndex + 2]; // Skip dashboard and industry
  
  if (!moduleSegment || moduleSegment === 'page') {
    return children; // Return dashboard home
  }

  return (
    <Suspense fallback={<ModuleLoadingSkeleton />}>
      <DynamicModuleLoader 
        industryType={industryType}
        moduleName={moduleSegment}
        pathname={pathname}
        params={params}
      />
    </Suspense>
  );
}

/**
 * Dynamic module loader with intelligent fallback system
 */
function DynamicModuleLoader({ industryType, moduleName, pathname, params }) {
  const config = getIndustryConfig(industryType);
  
  // Check if module is available for this industry
  if (!isModuleAvailable(industryType, moduleName)) {
    return <ModuleNotAvailable moduleName={moduleName} industryType={industryType} />;
  }

  // Determine if this is a core module or industry-specific module
  const isCoreModule = config.coreModules.includes(moduleName);
  const isIndustryModule = config.industryModules.includes(moduleName);

  if (isCoreModule) {
    return (
      <CoreModuleWrapper
        moduleName={moduleName}
        industryType={industryType}
        pathname={pathname}
        params={params}
      />
    );
  }

  if (isIndustryModule) {
    return (
      <IndustryModuleWrapper
        moduleName={moduleName}
        industryType={industryType}
        pathname={pathname}
        params={params}
      />
    );
  }

  return <ModuleNotFound moduleName={moduleName} />;
}

/**
 * Core module wrapper with industry customizations
 */
function CoreModuleWrapper({ moduleName, industryType, pathname, params }) {
  const customizations = getModuleCustomizations(industryType, moduleName);

  // Dynamically import core module
  const CoreModule = lazy(() => 
    import(`../../_core/${moduleName}/page.js`)
      .then(module => ({ default: module.default }))
      .catch(() => ({ default: ModuleNotImplemented }))
  );

  return (
    <div data-module="core" data-module-name={moduleName} data-industry={industryType}>
      <CoreModule 
        industryType={industryType}
        customizations={customizations}
        pathname={pathname}
        params={params}
      />
    </div>
  );
}

/**
 * Industry module wrapper
 */
function IndustryModuleWrapper({ moduleName, industryType, pathname, params }) {
  // Try industry-specific module first, fall back to core if available
  const IndustryModule = lazy(() => 
    import(`../../_industry-overlays/${industryType}/${moduleName}/page.js`)
      .then(module => ({ default: module.default }))
      .catch(() => 
        // Fallback to legacy industry dashboard structure
        import(`../../${industryType}/${moduleName}/page.js`)
          .then(module => ({ default: module.default }))
          .catch(() => ({ default: ModuleNotImplemented }))
      )
  );

  return (
    <div data-module="industry" data-module-name={moduleName} data-industry={industryType}>
      <IndustryModule 
        industryType={industryType}
        pathname={pathname}
        params={params}
      />
    </div>
  );
}

/**
 * Module loading skeleton
 */
function ModuleLoadingSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 border rounded-lg space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Content area skeleton */}
      <div className="border rounded-lg p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Module not available for industry
 */
function ModuleNotAvailable({ moduleName, industryType }) {
  const config = getIndustryConfig(industryType);
  
  return (
    <div className="container mx-auto p-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          The <strong>{moduleName}</strong> module is not available for {config.name} businesses.
          <br />
          <span className="text-sm text-muted-foreground mt-2 block">
            Available modules: {[...config.coreModules, ...config.industryModules].join(', ')}
          </span>
        </AlertDescription>
      </Alert>
    </div>
  );
}

/**
 * Module not found
 */
function ModuleNotFound({ moduleName }) {
  return (
    <div className="container mx-auto p-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Module <strong>{moduleName}</strong> was not found.
        </AlertDescription>
      </Alert>
    </div>
  );
}

/**
 * Module not implemented yet
 */
function ModuleNotImplemented({ moduleName }) {
  return (
    <div className="container mx-auto p-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          The <strong>{moduleName}</strong> module is not implemented yet.
          <br />
          <span className="text-sm text-muted-foreground mt-2 block">
            This module is coming soon. Check back later for updates.
          </span>
        </AlertDescription>
      </Alert>
    </div>
  );
}

