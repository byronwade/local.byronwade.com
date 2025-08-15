/**
 * Integration Registry
 * Central registry for managing all integrations with dependency resolution
 */

import { Integration, IntegrationRegistry, IntegrationContext, IntegrationFilter, IntegrationEvent, ConditionalContent, EnhancedFeature } from '../types';
import { DependencyManager } from '../dependency-manager';
import { IntegrationConfig } from '../config';
import { logger } from '@utils/logger';
import { EventEmitter } from 'events';

export class IntegrationRegistryManager extends EventEmitter {
  private registry: IntegrationRegistry;
  private dependencyManager: DependencyManager;
  private conditionalContent: Map<string, ConditionalContent[]>;
  private enhancedFeatures: Map<string, EnhancedFeature[]>;
  private context: IntegrationContext | null = null;

  constructor() {
    super();
    this.registry = {
      integrations: new Map(),
      categories: new Map(),
      dependencies: new Map(),
      conflicts: new Map(),
      enhancements: new Map(),
    };
    this.dependencyManager = new DependencyManager();
    this.conditionalContent = new Map();
    this.enhancedFeatures = new Map();
    this.setupEventListeners();
  }

  // ============================================================================
  // CONTEXT MANAGEMENT
  // ============================================================================

  setContext(context: IntegrationContext): void {
    this.context = context;
    this.emit('context:changed', context);
    logger.debug('Integration context updated', { 
      userId: context.user?.id, 
      businessId: context.business?.id 
    });
  }

  getContext(): IntegrationContext | null {
    return this.context;
  }

  // ============================================================================
  // INTEGRATION REGISTRATION
  // ============================================================================

  async registerIntegration(integration: Integration): Promise<void> {
    try {
      // Validate integration
      this.validateIntegration(integration);

      // Check for conflicts
      const conflicts = this.checkConflicts(integration);
      if (conflicts.length > 0) {
        throw new Error(`Integration conflicts detected: ${conflicts.join(', ')}`);
      }

      // Register in main registry
      this.registry.integrations.set(integration.id, integration);

      // Update category mapping
      if (!this.registry.categories.has(integration.category)) {
        this.registry.categories.set(integration.category, []);
      }
      this.registry.categories.get(integration.category)!.push(integration.id);

      // Register dependencies
      this.dependencyManager.registerDependencies(integration.id, integration.dependencies);

      // Register conflicts
      if (integration.conflicts.length > 0) {
        this.registry.conflicts.set(integration.id, integration.conflicts);
      }

      // Register enhancements
      if (integration.enhances.length > 0) {
        this.registry.enhancements.set(integration.id, integration.enhances);
      }

      // Execute registration hooks
      if (integration.hooks.onInstall) {
        await integration.hooks.onInstall();
      }

      this.emit('integration:registered', integration);
      logger.info(`Integration registered: ${integration.id}`, { integration: integration.name });

    } catch (error) {
      logger.error(`Failed to register integration: ${integration.id}`, error);
      throw error;
    }
  }

  async unregisterIntegration(integrationId: string): Promise<void> {
    try {
      const integration = this.getIntegration(integrationId);
      if (!integration) {
        throw new Error(`Integration not found: ${integrationId}`);
      }

      // Check for dependents
      const dependents = this.dependencyManager.getDependents(integrationId);
      if (dependents.length > 0) {
        throw new Error(`Cannot unregister integration with dependents: ${dependents.join(', ')}`);
      }

      // Execute uninstall hooks
      if (integration.hooks.onUninstall) {
        await integration.hooks.onUninstall();
      }

      // Remove from registry
      this.registry.integrations.delete(integrationId);

      // Clean up category mapping
      for (const [category, integrations] of this.registry.categories) {
        const index = integrations.indexOf(integrationId);
        if (index > -1) {
          integrations.splice(index, 1);
          if (integrations.length === 0) {
            this.registry.categories.delete(category);
          }
        }
      }

      // Clean up dependencies
      this.dependencyManager.unregisterDependencies(integrationId);
      this.registry.conflicts.delete(integrationId);
      this.registry.enhancements.delete(integrationId);

      // Clean up conditional content
      this.conditionalContent.delete(integrationId);
      this.enhancedFeatures.delete(integrationId);

      this.emit('integration:unregistered', integration);
      logger.info(`Integration unregistered: ${integrationId}`);

    } catch (error) {
      logger.error(`Failed to unregister integration: ${integrationId}`, error);
      throw error;
    }
  }

  // ============================================================================
  // INTEGRATION QUERIES
  // ============================================================================

  getIntegration(integrationId: string): Integration | undefined {
    return this.registry.integrations.get(integrationId);
  }

  getAllIntegrations(): Integration[] {
    return Array.from(this.registry.integrations.values());
  }

  getIntegrationsByCategory(category: string): Integration[] {
    const integrationIds = this.registry.categories.get(category as any) || [];
    return integrationIds.map(id => this.getIntegration(id)!).filter(Boolean);
  }

  getEnabledIntegrations(): Integration[] {
    return this.getAllIntegrations().filter(integration => integration.isEnabled);
  }

  searchIntegrations(filter: IntegrationFilter): Integration[] {
    let integrations = this.getAllIntegrations();

    // Apply category filter
    if (filter.category?.length) {
      integrations = integrations.filter(integration => 
        filter.category!.includes(integration.category)
      );
    }

    // Apply status filter
    if (filter.status?.length) {
      integrations = integrations.filter(integration => 
        filter.status!.includes(integration.status)
      );
    }

    // Apply capabilities filter
    if (filter.capabilities?.length) {
      integrations = integrations.filter(integration => 
        filter.capabilities!.some(cap => integration.capabilities.includes(cap))
      );
    }

    // Apply text search
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      integrations = integrations.filter(integration => 
        integration.name.toLowerCase().includes(searchTerm) ||
        integration.description.toLowerCase().includes(searchTerm) ||
        integration.provider.toLowerCase().includes(searchTerm)
      );
    }

    // Apply business size filter
    if (filter.businessSize && this.context?.business) {
      integrations = integrations.filter(integration => {
        if ('businessSize' in integration) {
          const businessIntegration = integration as any;
          return businessIntegration.businessSize === 'all' || 
                 businessIntegration.businessSize === filter.businessSize;
        }
        return true;
      });
    }

    return integrations;
  }

  // ============================================================================
  // DEPENDENCY MANAGEMENT
  // ============================================================================

  async enableIntegration(integrationId: string): Promise<void> {
    const integration = this.getIntegration(integrationId);
    if (!integration) {
      throw new Error(`Integration not found: ${integrationId}`);
    }

    if (integration.isEnabled) {
      logger.warn(`Integration already enabled: ${integrationId}`);
      return;
    }

    // Check and enable dependencies
    const missingDependencies = this.dependencyManager.getMissingDependencies(integrationId);
    if (missingDependencies.length > 0) {
      logger.info(`Enabling dependencies for ${integrationId}:`, missingDependencies);
      
      for (const depId of missingDependencies) {
        await this.enableIntegration(depId);
      }
    }

    // Enable the integration
    integration.isEnabled = true;
    integration.status = 'active';
    integration.updatedAt = new Date().toISOString();

    // Execute enable hooks
    if (integration.hooks.onEnable) {
      await integration.hooks.onEnable();
    }

    // Check for enhanced features
    await this.updateEnhancedFeatures(integrationId);

    this.emit('integration:enabled', integration);
    logger.info(`Integration enabled: ${integrationId}`);
  }

  async disableIntegration(integrationId: string): Promise<void> {
    const integration = this.getIntegration(integrationId);
    if (!integration) {
      throw new Error(`Integration not found: ${integrationId}`);
    }

    if (!integration.isEnabled) {
      logger.warn(`Integration already disabled: ${integrationId}`);
      return;
    }

    // Check for dependents
    const enabledDependents = this.dependencyManager.getEnabledDependents(integrationId);
    if (enabledDependents.length > 0) {
      throw new Error(`Cannot disable integration with enabled dependents: ${enabledDependents.join(', ')}`);
    }

    // Disable the integration
    integration.isEnabled = false;
    integration.status = 'inactive';
    integration.updatedAt = new Date().toISOString();

    // Execute disable hooks
    if (integration.hooks.onDisable) {
      await integration.hooks.onDisable();
    }

    // Update enhanced features
    await this.updateEnhancedFeatures(integrationId);

    this.emit('integration:disabled', integration);
    logger.info(`Integration disabled: ${integrationId}`);
  }

  // ============================================================================
  // CONDITIONAL CONTENT MANAGEMENT
  // ============================================================================

  registerConditionalContent(content: ConditionalContent): void {
    if (!this.conditionalContent.has(content.integrationId)) {
      this.conditionalContent.set(content.integrationId, []);
    }
    this.conditionalContent.get(content.integrationId)!.push(content);
    logger.debug(`Conditional content registered for ${content.integrationId}`);
  }

  getConditionalContent(integrationId?: string): ConditionalContent[] {
    if (integrationId) {
      return this.conditionalContent.get(integrationId) || [];
    }

    // Return all conditional content from enabled integrations
    const allContent: ConditionalContent[] = [];
    for (const [intId, content] of this.conditionalContent) {
      const integration = this.getIntegration(intId);
      if (integration?.isEnabled) {
        allContent.push(...content);
      }
    }

    return allContent.filter(content => this.evaluateContentConditions(content));
  }

  private evaluateContentConditions(content: ConditionalContent): boolean {
    if (!this.context) return false;

    return content.conditions.every(condition => {
      switch (condition.type) {
        case 'integration_enabled':
          const integration = this.getIntegration(condition.value);
          return integration?.isEnabled || false;

        case 'user_permission':
          return this.context?.user?.permissions.includes(condition.value) || false;

        case 'business_plan':
          return this.context?.business?.plan === condition.value;

        case 'custom':
          return condition.customCheck ? condition.customCheck(this.context) : false;

        default:
          return false;
      }
    });
  }

  // ============================================================================
  // ENHANCED FEATURES MANAGEMENT
  // ============================================================================

  registerEnhancedFeature(feature: EnhancedFeature): void {
    if (!this.enhancedFeatures.has(feature.baseIntegration)) {
      this.enhancedFeatures.set(feature.baseIntegration, []);
    }
    this.enhancedFeatures.get(feature.baseIntegration)!.push(feature);
    logger.debug(`Enhanced feature registered: ${feature.id}`);
  }

  getAvailableEnhancedFeatures(): EnhancedFeature[] {
    const availableFeatures: EnhancedFeature[] = [];

    for (const [baseIntegrationId, features] of this.enhancedFeatures) {
      const baseIntegration = this.getIntegration(baseIntegrationId);
      if (!baseIntegration?.isEnabled) continue;

      for (const feature of features) {
        const allEnhancingEnabled = feature.enhancingIntegrations.every(intId => {
          const integration = this.getIntegration(intId);
          return integration?.isEnabled;
        });

        if (allEnhancingEnabled) {
          availableFeatures.push(feature);
        }
      }
    }

    return availableFeatures;
  }

  private async updateEnhancedFeatures(changedIntegrationId: string): Promise<void> {
    const availableFeatures = this.getAvailableEnhancedFeatures();
    this.emit('enhanced_features:updated', { changedIntegrationId, availableFeatures });
    logger.debug(`Enhanced features updated due to ${changedIntegrationId} change`);
  }

  // ============================================================================
  // HEALTH AND MONITORING
  // ============================================================================

  async checkIntegrationHealth(integrationId?: string): Promise<void> {
    const integrations = integrationId 
      ? [this.getIntegration(integrationId)].filter(Boolean)
      : this.getEnabledIntegrations();

    for (const integration of integrations) {
      try {
        // Perform health check (implement specific logic per integration)
        const healthStatus = await this.performHealthCheck(integration);
        
        integration.health = {
          ...integration.health,
          ...healthStatus,
          lastCheck: new Date().toISOString(),
        };

        this.emit('integration:health_checked', integration);

      } catch (error) {
        integration.health.status = 'critical';
        integration.health.issues.push({
          type: 'error',
          code: 'HEALTH_CHECK_FAILED',
          message: error.message,
          timestamp: new Date().toISOString(),
          resolved: false,
        });

        logger.error(`Health check failed for ${integration.id}:`, error);
      }
    }
  }

  private async performHealthCheck(integration: Integration) {
    // Implement health check logic specific to each integration type
    // This would vary based on the integration's capabilities and API
    return {
      status: 'healthy' as const,
      uptime: 100,
      errorRate: 0,
      responseTime: 50,
      issues: [],
    };
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private validateIntegration(integration: Integration): void {
    if (!integration.id || !integration.name || !integration.version) {
      throw new Error('Integration must have id, name, and version');
    }

    if (this.registry.integrations.has(integration.id)) {
      throw new Error(`Integration with id '${integration.id}' already exists`);
    }
  }

  private checkConflicts(integration: Integration): string[] {
    const conflicts: string[] = [];

    // Check direct conflicts
    for (const conflictId of integration.conflicts) {
      const conflictIntegration = this.getIntegration(conflictId);
      if (conflictIntegration?.isEnabled) {
        conflicts.push(conflictId);
      }
    }

    // Check reverse conflicts
    for (const [intId, intConflicts] of this.registry.conflicts) {
      if (intConflicts.includes(integration.id)) {
        const conflictIntegration = this.getIntegration(intId);
        if (conflictIntegration?.isEnabled) {
          conflicts.push(intId);
        }
      }
    }

    return conflicts;
  }

  private setupEventListeners(): void {
    this.on('integration:enabled', (integration) => {
      logger.info(`Integration enabled: ${integration.id}`);
    });

    this.on('integration:disabled', (integration) => {
      logger.info(`Integration disabled: ${integration.id}`);
    });

    this.on('enhanced_features:updated', ({ changedIntegrationId, availableFeatures }) => {
      logger.debug(`Enhanced features updated: ${availableFeatures.length} available`);
    });
  }

  // ============================================================================
  // EXPORT REGISTRY STATE
  // ============================================================================

  getRegistryState() {
    return {
      totalIntegrations: this.registry.integrations.size,
      enabledIntegrations: this.getEnabledIntegrations().length,
      categories: Array.from(this.registry.categories.keys()),
      enhancedFeatures: this.getAvailableEnhancedFeatures().length,
      conditionalContent: Array.from(this.conditionalContent.keys()).length,
    };
  }
}

// Singleton instance
export const integrationRegistry = new IntegrationRegistryManager();
