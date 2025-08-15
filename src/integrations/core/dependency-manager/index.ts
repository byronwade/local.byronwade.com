/**
 * Integration Dependency Manager
 * Handles complex dependency resolution, topological sorting, and circular dependency detection
 */

import { IntegrationDependency } from '../types';
import { logger } from '@utils/logger';

export class DependencyManager {
  private dependencies: Map<string, IntegrationDependency[]> = new Map();
  private dependents: Map<string, string[]> = new Map();
  private enabledIntegrations: Set<string> = new Set();

  // ============================================================================
  // DEPENDENCY REGISTRATION
  // ============================================================================

  registerDependencies(integrationId: string, dependencies: IntegrationDependency[]): void {
    this.dependencies.set(integrationId, dependencies);

    // Build reverse dependency mapping
    for (const dependency of dependencies) {
      if (!this.dependents.has(dependency.integrationId)) {
        this.dependents.set(dependency.integrationId, []);
      }
      this.dependents.get(dependency.integrationId)!.push(integrationId);
    }

    logger.debug(`Dependencies registered for ${integrationId}:`, dependencies.map(d => d.integrationId));
  }

  unregisterDependencies(integrationId: string): void {
    const dependencies = this.dependencies.get(integrationId) || [];
    
    // Remove from reverse mapping
    for (const dependency of dependencies) {
      const dependents = this.dependents.get(dependency.integrationId) || [];
      const index = dependents.indexOf(integrationId);
      if (index > -1) {
        dependents.splice(index, 1);
        if (dependents.length === 0) {
          this.dependents.delete(dependency.integrationId);
        }
      }
    }

    this.dependencies.delete(integrationId);
    this.enabledIntegrations.delete(integrationId);

    logger.debug(`Dependencies unregistered for ${integrationId}`);
  }

  // ============================================================================
  // DEPENDENCY RESOLUTION
  // ============================================================================

  getDependencies(integrationId: string): IntegrationDependency[] {
    return this.dependencies.get(integrationId) || [];
  }

  getDependents(integrationId: string): string[] {
    return this.dependents.get(integrationId) || [];
  }

  getEnabledDependents(integrationId: string): string[] {
    return this.getDependents(integrationId).filter(id => this.enabledIntegrations.has(id));
  }

  getMissingDependencies(integrationId: string): string[] {
    const dependencies = this.getDependencies(integrationId);
    return dependencies
      .filter(dep => dep.required && !this.enabledIntegrations.has(dep.integrationId))
      .map(dep => dep.integrationId);
  }

  getOptionalDependencies(integrationId: string): string[] {
    const dependencies = this.getDependencies(integrationId);
    return dependencies
      .filter(dep => !dep.required)
      .map(dep => dep.integrationId);
  }

  // ============================================================================
  // TOPOLOGICAL SORTING
  // ============================================================================

  getInstallationOrder(integrationIds: string[]): string[] {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const order: string[] = [];

    const visit = (id: string): void => {
      if (visited.has(id)) return;
      if (visiting.has(id)) {
        throw new Error(`Circular dependency detected involving: ${id}`);
      }

      visiting.add(id);

      // Visit all dependencies first
      const dependencies = this.getDependencies(id);
      for (const dep of dependencies) {
        if (dep.required && integrationIds.includes(dep.integrationId)) {
          visit(dep.integrationId);
        }
      }

      visiting.delete(id);
      visited.add(id);
      order.push(id);
    };

    for (const id of integrationIds) {
      visit(id);
    }

    logger.debug('Installation order determined:', order);
    return order;
  }

  getRemovalOrder(integrationIds: string[]): string[] {
    // For removal, we need reverse topological order
    const installOrder = this.getInstallationOrder(integrationIds);
    return installOrder.reverse();
  }

  // ============================================================================
  // CIRCULAR DEPENDENCY DETECTION
  // ============================================================================

  detectCircularDependencies(): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (node: string, path: string[]): void => {
      if (recursionStack.has(node)) {
        // Found a cycle
        const cycleStart = path.indexOf(node);
        cycles.push([...path.slice(cycleStart), node]);
        return;
      }

      if (visited.has(node)) return;

      visited.add(node);
      recursionStack.add(node);
      path.push(node);

      const dependencies = this.getDependencies(node);
      for (const dep of dependencies) {
        dfs(dep.integrationId, [...path]);
      }

      recursionStack.delete(node);
      path.pop();
    };

    for (const integrationId of this.dependencies.keys()) {
      if (!visited.has(integrationId)) {
        dfs(integrationId, []);
      }
    }

    if (cycles.length > 0) {
      logger.warn('Circular dependencies detected:', cycles);
    }

    return cycles;
  }

  // ============================================================================
  // DEPENDENCY GRAPH ANALYSIS
  // ============================================================================

  getDependencyTree(integrationId: string, depth: number = 3): DependencyNode {
    const buildTree = (id: string, currentDepth: number): DependencyNode => {
      const dependencies = currentDepth > 0 ? this.getDependencies(id) : [];
      
      return {
        id,
        enabled: this.enabledIntegrations.has(id),
        required: true, // Will be set correctly by parent
        dependencies: dependencies.map(dep => ({
          ...buildTree(dep.integrationId, currentDepth - 1),
          required: dep.required,
        })),
      };
    };

    return buildTree(integrationId, depth);
  }

  getDependentsTree(integrationId: string, depth: number = 3): DependencyNode {
    const buildTree = (id: string, currentDepth: number): DependencyNode => {
      const dependents = currentDepth > 0 ? this.getDependents(id) : [];
      
      return {
        id,
        enabled: this.enabledIntegrations.has(id),
        required: true,
        dependencies: dependents.map(depId => buildTree(depId, currentDepth - 1)),
      };
    };

    return buildTree(integrationId, depth);
  }

  // ============================================================================
  // IMPACT ANALYSIS
  // ============================================================================

  analyzeDisableImpact(integrationId: string): DisableImpact {
    const directDependents = this.getEnabledDependents(integrationId);
    const allImpacted = new Set<string>();
    
    const findImpacted = (id: string): void => {
      const dependents = this.getEnabledDependents(id);
      for (const depId of dependents) {
        if (!allImpacted.has(depId)) {
          allImpacted.add(depId);
          findImpacted(depId);
        }
      }
    };

    findImpacted(integrationId);

    const criticalImpact = directDependents.filter(depId => {
      const deps = this.getDependencies(depId);
      return deps.some(d => d.integrationId === integrationId && d.required);
    });

    return {
      directDependents,
      allImpacted: Array.from(allImpacted),
      criticalImpact,
      canDisable: criticalImpact.length === 0,
    };
  }

  analyzeEnableRequirements(integrationId: string): EnableRequirements {
    const missingRequired = this.getMissingDependencies(integrationId);
    const missingOptional = this.getOptionalDependencies(integrationId)
      .filter(id => !this.enabledIntegrations.has(id));

    const cascadeRequired = new Set<string>();
    
    const findCascade = (id: string): void => {
      const missing = this.getMissingDependencies(id);
      for (const depId of missing) {
        if (!cascadeRequired.has(depId)) {
          cascadeRequired.add(depId);
          findCascade(depId);
        }
      }
    };

    for (const reqId of missingRequired) {
      findCascade(reqId);
    }

    return {
      missingRequired,
      missingOptional,
      cascadeRequired: Array.from(cascadeRequired),
      canEnable: missingRequired.length === 0,
    };
  }

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  markAsEnabled(integrationId: string): void {
    this.enabledIntegrations.add(integrationId);
    logger.debug(`Integration marked as enabled: ${integrationId}`);
  }

  markAsDisabled(integrationId: string): void {
    this.enabledIntegrations.delete(integrationId);
    logger.debug(`Integration marked as disabled: ${integrationId}`);
  }

  isEnabled(integrationId: string): boolean {
    return this.enabledIntegrations.has(integrationId);
  }

  getEnabledIntegrations(): string[] {
    return Array.from(this.enabledIntegrations);
  }

  // ============================================================================
  // VALIDATION
  // ============================================================================

  validateDependencyGraph(): ValidationResult {
    const issues: ValidationIssue[] = [];

    // Check for circular dependencies
    const cycles = this.detectCircularDependencies();
    for (const cycle of cycles) {
      issues.push({
        type: 'error',
        code: 'CIRCULAR_DEPENDENCY',
        message: `Circular dependency detected: ${cycle.join(' -> ')}`,
        affectedIntegrations: cycle,
      });
    }

    // Check for missing dependencies
    for (const [integrationId, dependencies] of this.dependencies) {
      for (const dep of dependencies) {
        if (dep.required && !this.dependencies.has(dep.integrationId)) {
          issues.push({
            type: 'error',
            code: 'MISSING_DEPENDENCY',
            message: `Integration ${integrationId} depends on missing integration: ${dep.integrationId}`,
            affectedIntegrations: [integrationId, dep.integrationId],
          });
        }
      }
    }

    // Check for orphaned integrations
    const orphaned = Array.from(this.dependencies.keys()).filter(id => {
      const deps = this.getDependencies(id);
      const dependents = this.getDependents(id);
      return deps.length === 0 && dependents.length === 0;
    });

    for (const orphanId of orphaned) {
      issues.push({
        type: 'warning',
        code: 'ORPHANED_INTEGRATION',
        message: `Integration ${orphanId} has no dependencies or dependents`,
        affectedIntegrations: [orphanId],
      });
    }

    return {
      isValid: issues.filter(i => i.type === 'error').length === 0,
      issues,
    };
  }

  // ============================================================================
  // EXPORT STATE
  // ============================================================================

  getManagerState() {
    return {
      totalDependencies: this.dependencies.size,
      enabledIntegrations: this.enabledIntegrations.size,
      dependencyCount: Array.from(this.dependencies.values()).reduce((sum, deps) => sum + deps.length, 0),
      circularDependencies: this.detectCircularDependencies().length,
    };
  }
}

// ============================================================================
// TYPES
// ============================================================================

export interface DependencyNode {
  id: string;
  enabled: boolean;
  required: boolean;
  dependencies: DependencyNode[];
}

export interface DisableImpact {
  directDependents: string[];
  allImpacted: string[];
  criticalImpact: string[];
  canDisable: boolean;
}

export interface EnableRequirements {
  missingRequired: string[];
  missingOptional: string[];
  cascadeRequired: string[];
  canEnable: boolean;
}

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  affectedIntegrations: string[];
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
}
