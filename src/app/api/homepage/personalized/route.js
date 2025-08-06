/**
 * Intelligent Homepage Personalization API
 * Serves personalized homepage content based on user behavior
 * Enterprise-grade performance with caching and analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { generatePersonalizedHomepage } from '@utils/homepagePersonalizationEngine';
import { supabase } from '@lib/database/supabase';
import { logger } from '@utils/logger';

// Cache control headers for optimization
const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=300, stale-while-revalidate=600', // 5 min cache, 10 min stale
  'Vary': 'Accept-Encoding, User-Agent, Authorization'
};

/**
 * GET /api/homepage/personalized
 * Generate personalized homepage content
 */
export async function GET(request) {
  const startTime = performance.now();
  
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');
    const location = searchParams.get('location');
    const forceRefresh = searchParams.get('refresh') === 'true';

    // Validate required parameters
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Track API request
    logger.api({
      endpoint: '/api/homepage/personalized',
      method: 'GET',
      userId,
      sessionId,
      location,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      timestamp: Date.now()
    });

    // Generate personalized homepage
    const homepageData = await generatePersonalizedHomepage(
      userId,
      sessionId,
      location
    );

    // Track performance
    const responseTime = performance.now() - startTime;
    
    // Log successful generation
    logger.performance('Personalized homepage API response', {
      responseTime: responseTime.toFixed(2),
      personalizationScore: homepageData.metadata.personalizationScore,
      sectionCount: homepageData.sections.length,
      cacheStatus: homepageData.performance.cacheStatus,
      userId,
      sessionId
    });

    // Track business metrics
    logger.businessMetrics('personalized_homepage_served', {
      personalizationScore: homepageData.metadata.personalizationScore,
      sectionCount: homepageData.sections.length,
      isPersonalized: homepageData.metadata.personalizationScore > 0.3,
      responseTime,
      userId,
      sessionId
    });

    // Add performance metadata
    homepageData.performance.apiResponseTime = responseTime;
    homepageData.performance.servedAt = new Date().toISOString();

    return NextResponse.json(homepageData, {
      status: 200,
      headers: {
        ...CACHE_HEADERS,
        'X-Personalization-Score': homepageData.metadata.personalizationScore.toString(),
        'X-Section-Count': homepageData.sections.length.toString(),
        'X-Response-Time': responseTime.toFixed(2)
      }
    });

  } catch (error) {
    const responseTime = performance.now() - startTime;
    
    logger.error('Personalized homepage API error:', {
      error: error.message,
      stack: error.stack,
      responseTime,
      endpoint: '/api/homepage/personalized',
      method: 'GET'
    });

    // Return fallback content
    const fallbackData = {
      sections: [
        {
          type: 'hero',
          priority: 1,
          personalized: false,
          content: {
            title: "Discover Local Businesses",
            subtitle: "Find the best places near you",
            searchPlaceholder: "Search for businesses...",
            backgroundCategory: 'general'
          }
        }
      ],
      metadata: {
        personalizationScore: 0,
        generatedAt: new Date().toISOString(),
        version: '2.0',
        fallback: true
      },
      performance: {
        apiResponseTime: responseTime,
        cacheStatus: 'miss'
      }
    };

    return NextResponse.json(fallbackData, {
      status: 200,
      headers: {
        ...CACHE_HEADERS,
        'X-Fallback': 'true',
        'X-Error': 'personalization-failed'
      }
    });
  }
}

/**
 * POST /api/homepage/personalized/track
 * Track user interactions for personalization
 */
export async function POST(request) {
  const startTime = performance.now();
  
  try {
    const body = await request.json();
    const {
      sessionId,
      userId,
      interactionType,
      interactionData,
      personalizationScore,
      sectionCount
    } = body;

    // Validate required fields
    if (!sessionId || !interactionType) {
      return NextResponse.json(
        { error: 'Session ID and interaction type are required' },
        { status: 400 }
      );
    }

    // Store interaction in database
    const { error: interactionError } = await supabase
      .from('user_interactions')
      .insert({
        session_id: sessionId,
        user_id: userId || null,
        interaction_type: interactionType,
        interaction_data: interactionData || {}
      });

    if (interactionError) {
      logger.error('Failed to store user interaction:', interactionError);
    }

    // Track homepage performance if provided
    if (personalizationScore !== undefined || sectionCount !== undefined) {
      const { error: analyticsError } = await supabase
        .rpc('track_homepage_performance', {
          p_session_id: sessionId,
          p_user_id: userId || null,
          p_personalization_score: personalizationScore || 0,
          p_section_count: sectionCount || 0,
          p_performance_data: {
            interactionType,
            timestamp: Date.now(),
            userAgent: request.headers.get('user-agent')
          }
        });

      if (analyticsError) {
        logger.error('Failed to track homepage performance:', analyticsError);
      }
    }

    // Analyze patterns if enough interactions
    const { data: interactionCount } = await supabase
      .from('user_interactions')
      .select('id', { count: 'exact' })
      .eq('session_id', sessionId);

    if (interactionCount >= 5) {
      // Trigger pattern analysis
      const { error: analysisError } = await supabase
        .rpc('analyze_user_behavior_patterns', {
          p_session_id: sessionId
        });

      if (analysisError) {
        logger.error('Failed to analyze behavior patterns:', analysisError);
      }
    }

    const responseTime = performance.now() - startTime;

    logger.businessMetrics('homepage_interaction_tracked', {
      interactionType,
      sessionId,
      userId,
      responseTime,
      interactionCount: interactionCount || 0
    });

    return NextResponse.json({
      success: true,
      interactionCount: interactionCount || 0,
      responseTime: responseTime.toFixed(2)
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    const responseTime = performance.now() - startTime;
    
    logger.error('Homepage interaction tracking error:', {
      error: error.message,
      stack: error.stack,
      responseTime,
      endpoint: '/api/homepage/personalized/track',
      method: 'POST'
    });

    return NextResponse.json(
      { error: 'Failed to track interaction' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/homepage/personalized/preferences
 * Update user preferences for personalization
 */
export async function PUT(request) {
  const startTime = performance.now();
  
  try {
    const body = await request.json();
    const { userId, preferences } = body;

    // Validate required fields
    if (!userId || !preferences || !Array.isArray(preferences)) {
      return NextResponse.json(
        { error: 'User ID and preferences array are required' },
        { status: 400 }
      );
    }

    // Clear existing preferences
    await supabase
      .from('user_preferences')
      .delete()
      .eq('user_id', userId);

    // Insert new preferences
    const preferencesToInsert = preferences.map(pref => ({
      user_id: userId,
      preference_type: pref.type,
      preference_value: pref.value,
      weight: pref.weight || 1.0
    }));

    const { error: insertError } = await supabase
      .from('user_preferences')
      .insert(preferencesToInsert);

    if (insertError) {
      logger.error('Failed to update user preferences:', insertError);
      return NextResponse.json(
        { error: 'Failed to update preferences' },
        { status: 500 }
      );
    }

    // Clear personalization cache for this user
    await supabase
      .from('homepage_personalization_cache')
      .delete()
      .eq('user_id', userId);

    const responseTime = performance.now() - startTime;

    logger.businessMetrics('user_preferences_updated', {
      userId,
      preferenceCount: preferences.length,
      responseTime
    });

    return NextResponse.json({
      success: true,
      preferencesUpdated: preferences.length,
      responseTime: responseTime.toFixed(2)
    }, {
      status: 200
    });

  } catch (error) {
    const responseTime = performance.now() - startTime;
    
    logger.error('User preferences update error:', {
      error: error.message,
      stack: error.stack,
      responseTime,
      endpoint: '/api/homepage/personalized/preferences',
      method: 'PUT'
    });

    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/homepage/personalized/cache
 * Clear personalization cache (admin only)
 */
export async function DELETE(request) {
  const startTime = performance.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    // Clear cache based on parameters
    let query = supabase.from('homepage_personalization_cache').delete();

    if (userId) {
      query = query.eq('user_id', userId);
    } else if (sessionId) {
      query = query.eq('session_id', sessionId);
    } else {
      // Clear all expired cache
      query = query.lt('expires_at', new Date().toISOString());
    }

    const { error } = await query;

    if (error) {
      logger.error('Failed to clear personalization cache:', error);
      return NextResponse.json(
        { error: 'Failed to clear cache' },
        { status: 500 }
      );
    }

    const responseTime = performance.now() - startTime;

    logger.performance('Personalization cache cleared', {
      userId,
      sessionId,
      responseTime
    });

    return NextResponse.json({
      success: true,
      responseTime: responseTime.toFixed(2)
    }, {
      status: 200
    });

  } catch (error) {
    const responseTime = performance.now() - startTime;
    
    logger.error('Cache clear error:', {
      error: error.message,
      stack: error.stack,
      responseTime,
      endpoint: '/api/homepage/personalized/cache',
      method: 'DELETE'
    });

    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}