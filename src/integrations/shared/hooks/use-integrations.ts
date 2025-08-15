/**
 * Integration Management Hooks
 * React hooks for managing integrations with optimistic updates and caching
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Integration, IntegrationFilter, IntegrationContext, ConditionalContent, EnhancedFeature } from '../../../core/types';
import { integrationRegistry } from '../../../core/registry/integration-registry';
import { integrationConfig } from '../../../core/config/integration-config';
import { useAuth } from '@hooks/use-auth';
import { useToast } from '@components/ui/use-toast';
import { logger } from '@utils/logger';

// ============================================================================
// MAIN INTEGRATION HOOK
// ============================================================================

export function useIntegrations(filter?: IntegrationFilter) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  // Set integration context
  useEffect(() => {
    if (user) {
      const context: IntegrationContext = {
        user: {
          id: user.id,
          role: user.role || 'user',
          permissions: user.permissions || [],
          preferences: user.preferences || {},
        },
        business: user.business ? {
          id: user.business.id,
          type: user.business.type,
          size: user.business.size,
          industry: user.business.industry,
          plan: user.business.plan,
        } : undefined,
        session: {
          sessionId: user.sessionId || '',
          timestamp: new Date().toISOString(),
        },
      };
      
      integrationRegistry.setContext(context);
    }
  }, [user]);

  // Query integrations
  const {
    data: integrations = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['integrations', filter],
    queryFn: () => {
      if (filter) {
        return integrationRegistry.searchIntegrations(filter);
      }
      return integrationRegistry.getAllIntegrations();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Enable integration mutation
  const enableMutation = useMutation({
    mutationFn: async (integrationId: string) => {
      await integrationRegistry.enableIntegration(integrationId);
      return integrationRegistry.getIntegration(integrationId);
    },
    onMutate: async (integrationId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['integrations'] });
      
      const previousIntegrations = queryClient.getQueryData(['integrations', filter]);
      
      queryClient.setQueryData(['integrations', filter], (old: Integration[] = []) =>
        old.map(integration =>
          integration.id === integrationId
            ? { ...integration, isEnabled: true, status: 'active' as const }
            : integration
        )
      );

      return { previousIntegrations };
    },
    onError: (error, integrationId, context) => {
      // Revert optimistic update
      queryClient.setQueryData(['integrations', filter], context?.previousIntegrations);
      
      toast({
        title: 'Enable Failed',
        description: error.message,
        variant: 'destructive',
      });
      
      logger.error(`Failed to enable integration: ${integrationId}`, error);
    },
    onSuccess: (integration) => {
      toast({
        title: 'Integration Enabled',
        description: `${integration?.name} has been enabled successfully.`,
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      queryClient.invalidateQueries({ queryKey: ['conditional-content'] });
      queryClient.invalidateQueries({ queryKey: ['enhanced-features'] });
    },
  });

  // Disable integration mutation
  const disableMutation = useMutation({
    mutationFn: async (integrationId: string) => {
      await integrationRegistry.disableIntegration(integrationId);
      return integrationRegistry.getIntegration(integrationId);
    },
    onMutate: async (integrationId) => {
      await queryClient.cancelQueries({ queryKey: ['integrations'] });
      
      const previousIntegrations = queryClient.getQueryData(['integrations', filter]);
      
      queryClient.setQueryData(['integrations', filter], (old: Integration[] = []) =>
        old.map(integration =>
          integration.id === integrationId
            ? { ...integration, isEnabled: false, status: 'inactive' as const }
            : integration
        )
      );

      return { previousIntegrations };
    },
    onError: (error, integrationId, context) => {
      queryClient.setQueryData(['integrations', filter], context?.previousIntegrations);
      
      toast({
        title: 'Disable Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: (integration) => {
      toast({
        title: 'Integration Disabled',
        description: `${integration?.name} has been disabled.`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      queryClient.invalidateQueries({ queryKey: ['conditional-content'] });
      queryClient.invalidateQueries({ queryKey: ['enhanced-features'] });
    },
  });

  // Install integration mutation
  const installMutation = useMutation({
    mutationFn: async ({ templateId, config, credentials }: InstallIntegrationParams) => {
      const integration = integrationConfig.generateIntegrationFromTemplate(
        templateId,
        config,
        credentials
      );
      
      await integrationRegistry.registerIntegration(integration as Integration);
      return integration;
    },
    onSuccess: (integration) => {
      toast({
        title: 'Integration Installed',
        description: `${integration?.name} has been installed successfully.`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
    onError: (error) => {
      toast({
        title: 'Installation Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Computed values
  const enabledIntegrations = useMemo(
    () => integrations.filter(integration => integration.isEnabled),
    [integrations]
  );

  const integrationsByCategory = useMemo(() => {
    const grouped = integrations.reduce((acc, integration) => {
      if (!acc[integration.category]) {
        acc[integration.category] = [];
      }
      acc[integration.category].push(integration);
      return acc;
    }, {} as Record<string, Integration[]>);

    return grouped;
  }, [integrations]);

  return {
    // Data
    integrations,
    enabledIntegrations,
    integrationsByCategory,
    
    // State
    isLoading,
    error,
    
    // Actions
    enableIntegration: enableMutation.mutate,
    disableIntegration: disableMutation.mutate,
    installIntegration: installMutation.mutate,
    refetch,
    
    // Mutation states
    isEnabling: enableMutation.isPending,
    isDisabling: disableMutation.isPending,
    isInstalling: installMutation.isPending,
  };
}

// ============================================================================
// CONDITIONAL CONTENT HOOK
// ============================================================================

export function useConditionalContent(integrationId?: string) {
  const { data: content = [], isLoading } = useQuery({
    queryKey: ['conditional-content', integrationId],
    queryFn: () => integrationRegistry.getConditionalContent(integrationId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const contentByType = useMemo(() => {
    return content.reduce((acc, item) => {
      if (!acc[item.content.type]) {
        acc[item.content.type] = [];
      }
      acc[item.content.type].push(item);
      return acc;
    }, {} as Record<string, ConditionalContent[]>);
  }, [content]);

  return {
    content,
    contentByType,
    isLoading,
  };
}

// ============================================================================
// ENHANCED FEATURES HOOK
// ============================================================================

export function useEnhancedFeatures() {
  const { data: features = [], isLoading } = useQuery({
    queryKey: ['enhanced-features'],
    queryFn: () => integrationRegistry.getAvailableEnhancedFeatures(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const featuresByIntegration = useMemo(() => {
    return features.reduce((acc, feature) => {
      if (!acc[feature.baseIntegration]) {
        acc[feature.baseIntegration] = [];
      }
      acc[feature.baseIntegration].push(feature);
      return acc;
    }, {} as Record<string, EnhancedFeature[]>);
  }, [features]);

  return {
    features,
    featuresByIntegration,
    isLoading,
  };
}

// ============================================================================
// INTEGRATION HEALTH HOOK
// ============================================================================

export function useIntegrationHealth(integrationId?: string) {
  const queryClient = useQueryClient();

  const { data: healthData, isLoading } = useQuery({
    queryKey: ['integration-health', integrationId],
    queryFn: async () => {
      await integrationRegistry.checkIntegrationHealth(integrationId);
      
      if (integrationId) {
        const integration = integrationRegistry.getIntegration(integrationId);
        return integration?.health;
      }
      
      const integrations = integrationRegistry.getEnabledIntegrations();
      return integrations.map(integration => ({
        integrationId: integration.id,
        health: integration.health,
      }));
    },
    refetchInterval: 5 * 60 * 1000, // Check every 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const refreshHealth = useCallback(async () => {
    await integrationRegistry.checkIntegrationHealth(integrationId);
    queryClient.invalidateQueries({ queryKey: ['integration-health', integrationId] });
  }, [integrationId, queryClient]);

  return {
    healthData,
    isLoading,
    refreshHealth,
  };
}

// ============================================================================
// INTEGRATION TEMPLATES HOOK
// ============================================================================

export function useIntegrationTemplates(category?: string) {
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['integration-templates', category],
    queryFn: () => {
      if (category) {
        return integrationConfig.getTemplatesByCategory(category as any);
      }
      return integrationConfig.getAllTemplates();
    },
    staleTime: 30 * 60 * 1000, // 30 minutes (templates don't change often)
  });

  const templatesByCategory = useMemo(() => {
    return templates.reduce((acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = [];
      }
      acc[template.category].push(template);
      return acc;
    }, {} as Record<string, any[]>);
  }, [templates]);

  return {
    templates,
    templatesByCategory,
    isLoading,
  };
}

// ============================================================================
// DEPENDENCY MANAGEMENT HOOK
// ============================================================================

export function useIntegrationDependencies(integrationId: string) {
  const [dependencies, setDependencies] = useState<any>({});
  const [dependents, setDependents] = useState<string[]>([]);

  useEffect(() => {
    const deps = integrationRegistry['dependencyManager'].getDependencies(integrationId);
    const dpts = integrationRegistry['dependencyManager'].getDependents(integrationId);
    
    setDependencies(deps);
    setDependents(dpts);
  }, [integrationId]);

  const canEnable = useMemo(() => {
    const missing = integrationRegistry['dependencyManager'].getMissingDependencies(integrationId);
    return missing.length === 0;
  }, [integrationId]);

  const canDisable = useMemo(() => {
    const enabledDependents = integrationRegistry['dependencyManager'].getEnabledDependents(integrationId);
    return enabledDependents.length === 0;
  }, [integrationId]);

  return {
    dependencies,
    dependents,
    canEnable,
    canDisable,
  };
}

// ============================================================================
// INTEGRATION METRICS HOOK
// ============================================================================

export function useIntegrationMetrics() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['integration-metrics'],
    queryFn: () => {
      const registryState = integrationRegistry.getRegistryState();
      const dependencyState = integrationRegistry['dependencyManager'].getManagerState();
      
      return {
        ...registryState,
        ...dependencyState,
        timestamp: new Date().toISOString(),
      };
    },
    refetchInterval: 30 * 1000, // Update every 30 seconds
    staleTime: 10 * 1000, // 10 seconds
  });

  return {
    metrics,
    isLoading,
  };
}

// ============================================================================
// TYPES
// ============================================================================

export interface InstallIntegrationParams {
  templateId: string;
  config: Record<string, any>;
  credentials: Record<string, any>;
}

export interface UseIntegrationsOptions {
  filter?: IntegrationFilter;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

export function useIntegrationById(integrationId: string) {
  const { integrations } = useIntegrations();
  
  return useMemo(
    () => integrations.find(integration => integration.id === integrationId),
    [integrations, integrationId]
  );
}

export function useEnabledIntegrations() {
  const { enabledIntegrations, isLoading } = useIntegrations();
  return { enabledIntegrations, isLoading };
}

export function useIntegrationsByCategory(category: string) {
  const { integrationsByCategory, isLoading } = useIntegrations();
  return { 
    integrations: integrationsByCategory[category] || [], 
    isLoading 
  };
}
