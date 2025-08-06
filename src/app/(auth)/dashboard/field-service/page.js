import { Suspense } from 'react';
import BusinessDashboard from '@components/business/field-service/BusinessDashboard';
import { createServerClient } from "@supabase/ssr";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Field Service Dashboard Page
 * Main SaaS dashboard for business users on the Thorbis platform
 */

export const metadata = {
  title: 'Field Service Dashboard - Thorbis',
  description: 'Manage your field service operations, schedule jobs, track performance, and grow your business with Thorbis.',
};

async function getBusinessData(userId) {
  try {
    const supabase = createServerComponentClient({ cookies });
    
    // Get user's business profile
    const { data: business, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', userId)
      .single();

    if (error) {
      console.error('Error fetching business:', error);
      return null;
    }

    return business;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

export default async function FieldServiceDashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  
  // Check authentication
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    redirect('/login?redirectTo=/dashboard/field-service');
  }

  // Get business data
  const business = await getBusinessData(session.user.id);
  
  if (!business) {
    redirect('/onboarding/business-setup');
  }

  return (
    <div className="min-h-screen">
      <Suspense fallback={<DashboardSkeleton />}>
        <BusinessDashboard 
          businessId={business.id} 
          user={session.user}
        />
      </Suspense>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-9 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-9 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
              <div className="mt-2 h-3 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="space-y-6">
          <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}