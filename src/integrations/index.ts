/**
 * Integration System - Main Export
 * Enterprise-grade integration management system
 */

// ============================================================================
// CORE EXPORTS
// ============================================================================

// Types
export * from './core/types';

// Registry and Management
export { integrationRegistry, IntegrationRegistryManager } from './core/registry/integration-registry';
export { DependencyManager } from './core/dependency-manager';
export { integrationConfig, IntegrationConfigManager, INTEGRATION_TEMPLATES } from './core/config/integration-config';

// ============================================================================
// SHARED UTILITIES
// ============================================================================

// Hooks
export * from './shared/hooks/use-integrations';

// Components
export { IntegrationCard } from './shared/components/IntegrationCard';

// ============================================================================
// CONTEXT-SPECIFIC EXPORTS
// ============================================================================

// Business integrations
export * from './business';

// User integrations
export * from './user';

// Admin integrations
export * from './admin';

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

export { default as IntegrationRoutes } from './routes';
export * from './shared/constants';
export * from './shared/utils';

// ============================================================================
// THORBIS BUSINESS OPS BOOTSTRAP
// ============================================================================

import { integrationRegistry } from './core/registry/integration-registry';
import { integrationConfig as _config } from './core/config/integration-config';
import { BUSINESS_OPS_ORDER } from './business';
import type { Integration, IntegrationDependency } from './core/types';

/**
 * Register Thorbis business-ops integrations in order:
 * 1) field_management → 2) payroll → 3) invoicing → 4) estimates → 5) pos → 6) voip
 * Includes recommended (non-blocking) dependency links for smarter enable flows.
 */
export async function registerBusinessOpsIntegrations(options?: {
  configs?: Record<string, Record<string, any>>;
  credentials?: Record<string, Record<string, any>>;
}): Promise<void> {
  const now = new Date().toISOString();

  // Suggested dependencies (required: false so order is respected but not blocking)
  const dependencyMap: Record<string, IntegrationDependency[]> = {
    payroll: [ { integrationId: 'field_management', required: false, reason: 'Use FSM timesheets as time source' } ],
    invoicing: [ { integrationId: 'field_management', required: false, reason: 'Bill completed jobs from FSM' } ],
    estimates: [ { integrationId: 'field_management', required: false, reason: 'Convert accepted estimates to jobs' } ],
    pos: [ { integrationId: 'invoicing', required: false, reason: 'Sync POS sales to invoicing' } ],
    voip: [ { integrationId: 'field_management', required: false, reason: 'Surface job context during calls' } ],
  } as const;

  for (const templateId of BUSINESS_OPS_ORDER as readonly string[]) {
    const template = _config.getTemplate(templateId);
    if (!template) continue;

    const config = options?.configs?.[templateId] ?? template.defaultConfig;
    const creds = options?.credentials?.[templateId] ?? {};

    // Generate base (schema validation) then construct a stable Integration object
    const base = _config.generateIntegrationFromTemplate(template.id, config, creds);

    const integration: Integration = {
      id: template.id,
      name: template.name,
      displayName: template.name,
      description: template.description,
      version: template.version,
      category: template.category,
      provider: template.provider,

      status: 'available',
      isEnabled: false,
      isRequired: false,
      isSystemIntegration: true,

      config: { ...template.defaultConfig, ...config, environment: (config?.environment ?? 'production') },
      credentials: {
        type: (base as any).credentials?.type ?? 'custom',
        encrypted: true,
        fields: creds,
      },
      settings: {},

      dependencies: dependencyMap[template.id] ?? [],
      conflicts: [],
      enhances: [],

      capabilities: template.capabilities,
      permissions: (base as any).permissions ?? [],
      scopes: [],

      hooks: {},

      createdAt: now,
      updatedAt: now,
      installedAt: undefined,
      lastSyncAt: undefined,

      health: {
        status: 'unknown',
        lastCheck: now,
        uptime: 0,
        errorRate: 0,
        responseTime: 0,
        issues: [],
      },
      metrics: {
        requests: 0,
        errors: 0,
        successRate: 1,
        averageResponseTime: 0,
        dataVolume: 0,
        lastReset: now,
      },
    };

    await integrationRegistry.registerIntegration(integration);
  }
}
