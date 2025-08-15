/**
 * Integration System Types
 * Comprehensive type definitions for the integration ecosystem
 */

// ============================================================================
// CORE INTEGRATION TYPES
// ============================================================================

export interface Integration {
  id: string;
  name: string;
  displayName: string;
  description: string;
  version: string;
  category: IntegrationCategory;
  provider: string;
  
  // Lifecycle
  status: IntegrationStatus;
  isEnabled: boolean;
  isRequired: boolean;
  isSystemIntegration: boolean;
  
  // Configuration
  config: IntegrationConfig;
  credentials: IntegrationCredentials;
  settings: Record<string, any>;
  
  // Dependencies and relationships
  dependencies: IntegrationDependency[];
  conflicts: string[];
  enhances: IntegrationEnhancement[];
  
  // Capabilities
  capabilities: IntegrationCapability[];
  permissions: IntegrationPermission[];
  scopes: string[];
  
  // Lifecycle hooks
  hooks: IntegrationHooks;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  installedAt?: string;
  lastSyncAt?: string;
  
  // Health and monitoring
  health: IntegrationHealth;
  metrics: IntegrationMetrics;
}

export type IntegrationCategory = 
  | 'communication' 
  | 'analytics' 
  | 'payment' 
  | 'crm' 
  | 'marketing' 
  | 'social' 
  | 'productivity' 
  | 'security' 
  | 'storage' 
  | 'ai' 
  | 'maps' 
  | 'scheduling' 
  | 'accounting' 
  | 'hr' 
  | 'inventory' 
  | 'delivery' 
  | 'review' 
  | 'booking' 
  | 'loyalty' 
  | 'custom';

export type IntegrationStatus = 
  | 'available' 
  | 'installing' 
  | 'installed' 
  | 'configuring' 
  | 'active' 
  | 'inactive' 
  | 'error' 
  | 'updating' 
  | 'removing' 
  | 'deprecated';

export interface IntegrationConfig {
  apiUrl?: string;
  webhookUrl?: string;
  callbackUrl?: string;
  environment: 'sandbox' | 'production';
  rateLimit?: {
    requests: number;
    window: number;
  };
  timeout?: number;
  retries?: number;
  customFields?: Record<string, any>;
}

export interface IntegrationCredentials {
  type: 'oauth2' | 'api_key' | 'basic' | 'bearer' | 'custom';
  encrypted: boolean;
  fields: Record<string, string>;
  expiresAt?: string;
  refreshToken?: string;
}

export interface IntegrationDependency {
  integrationId: string;
  version?: string;
  required: boolean;
  reason: string;
  enabledFeatures?: string[];
}

export interface IntegrationEnhancement {
  integrationId: string;
  features: string[];
  condition: 'all' | 'any' | 'custom';
  customCondition?: (integrations: Integration[]) => boolean;
}

export type IntegrationCapability = 
  | 'read' 
  | 'write' 
  | 'sync' 
  | 'webhook' 
  | 'oauth' 
  | 'realtime' 
  | 'batch' 
  | 'export' 
  | 'import' 
  | 'transform' 
  | 'validate' 
  | 'notify';

export interface IntegrationPermission {
  scope: string;
  actions: string[];
  resources: string[];
  condition?: string;
}

export interface IntegrationHooks {
  onInstall?: () => Promise<void>;
  onUninstall?: () => Promise<void>;
  onEnable?: () => Promise<void>;
  onDisable?: () => Promise<void>;
  onConfig?: (config: any) => Promise<void>;
  onSync?: () => Promise<void>;
  onError?: (error: Error) => Promise<void>;
}

export interface IntegrationHealth {
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  lastCheck: string;
  uptime: number;
  errorRate: number;
  responseTime: number;
  issues: HealthIssue[];
}

export interface HealthIssue {
  type: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface IntegrationMetrics {
  requests: number;
  errors: number;
  successRate: number;
  averageResponseTime: number;
  dataVolume: number;
  lastReset: string;
}

// ============================================================================
// CONTEXT-SPECIFIC INTEGRATION TYPES
// ============================================================================

export interface BusinessIntegration extends Integration {
  businessCapabilities: BusinessCapability[];
  industrySupport: string[];
  businessSize: 'small' | 'medium' | 'large' | 'enterprise' | 'all';
  pricing: IntegrationPricing;
}

export interface UserIntegration extends Integration {
  userFeatures: UserFeature[];
  personalDataHandling: PersonalDataPolicy;
  userPermissions: UserPermission[];
}

export interface AdminIntegration extends Integration {
  adminCapabilities: AdminCapability[];
  systemRequirements: SystemRequirement[];
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
}

export type BusinessCapability = 
  | 'customer_management' 
  | 'inventory_tracking' 
  | 'sales_analytics' 
  | 'marketing_automation' 
  | 'financial_reporting' 
  | 'staff_management' 
  | 'booking_system' 
  | 'delivery_tracking' 
  | 'review_management' 
  | 'loyalty_program';

export type UserFeature = 
  | 'profile_sync' 
  | 'social_login' 
  | 'data_export' 
  | 'notifications' 
  | 'preferences' 
  | 'activity_tracking' 
  | 'content_sharing' 
  | 'collaboration';

export type AdminCapability = 
  | 'user_management' 
  | 'system_monitoring' 
  | 'security_audit' 
  | 'data_migration' 
  | 'backup_restore' 
  | 'integration_management' 
  | 'reporting' 
  | 'compliance';

export interface IntegrationPricing {
  model: 'free' | 'freemium' | 'subscription' | 'usage' | 'one_time';
  baseCost?: number;
  currency?: string;
  billingCycle?: 'monthly' | 'yearly';
  usageLimits?: Record<string, number>;
}

export interface PersonalDataPolicy {
  collects: boolean;
  stores: boolean;
  shares: boolean;
  retentionPeriod?: number;
  deletionSupport: boolean;
  gdprCompliant: boolean;
}

export interface UserPermission {
  type: 'read' | 'write' | 'admin';
  resource: string;
  autoGranted: boolean;
}

export interface SystemRequirement {
  component: string;
  version: string;
  required: boolean;
}

// ============================================================================
// REGISTRY AND MANAGEMENT TYPES
// ============================================================================

export interface IntegrationRegistry {
  integrations: Map<string, Integration>;
  categories: Map<IntegrationCategory, string[]>;
  dependencies: Map<string, string[]>;
  conflicts: Map<string, string[]>;
  enhancements: Map<string, IntegrationEnhancement[]>;
}

export interface IntegrationContext {
  user?: {
    id: string;
    role: string;
    permissions: string[];
    preferences: Record<string, any>;
  };
  business?: {
    id: string;
    type: string;
    size: string;
    industry: string;
    plan: string;
  };
  admin?: {
    level: 'super' | 'admin' | 'moderator';
    permissions: string[];
  };
  session: {
    sessionId: string;
    timestamp: string;
    ip?: string;
  };
}

export interface IntegrationEvent {
  type: IntegrationEventType;
  integrationId: string;
  data: any;
  timestamp: string;
  context: IntegrationContext;
  metadata?: Record<string, any>;
}

export type IntegrationEventType = 
  | 'install' 
  | 'uninstall' 
  | 'enable' 
  | 'disable' 
  | 'configure' 
  | 'sync' 
  | 'error' 
  | 'health_check' 
  | 'dependency_change' 
  | 'enhancement_available';

export interface IntegrationFilter {
  category?: IntegrationCategory[];
  status?: IntegrationStatus[];
  capabilities?: IntegrationCapability[];
  dependencies?: string[];
  search?: string;
  businessSize?: string;
  industry?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
}

export interface IntegrationSortOptions {
  field: 'name' | 'category' | 'status' | 'popularity' | 'rating' | 'price';
  direction: 'asc' | 'desc';
}

// ============================================================================
// ENHANCED FEATURES AND CONDITIONAL CONTENT
// ============================================================================

export interface ConditionalContent {
  id: string;
  integrationId: string;
  conditions: ContentCondition[];
  content: ContentDefinition;
  priority: number;
  enabled: boolean;
}

export interface ContentCondition {
  type: 'integration_enabled' | 'user_permission' | 'business_plan' | 'custom';
  operator: 'and' | 'or' | 'not';
  value: any;
  customCheck?: (context: IntegrationContext) => boolean;
}

export interface ContentDefinition {
  type: 'component' | 'widget' | 'menu_item' | 'dashboard_card' | 'notification' | 'feature';
  componentPath?: string;
  data?: Record<string, any>;
  styling?: Record<string, any>;
  permissions?: string[];
}

export interface IntegrationWidget {
  id: string;
  integrationId: string;
  name: string;
  component: string;
  size: 'small' | 'medium' | 'large' | 'full';
  position: 'header' | 'sidebar' | 'dashboard' | 'footer' | 'floating';
  conditions: ContentCondition[];
  config: Record<string, any>;
}

export interface EnhancedFeature {
  id: string;
  name: string;
  description: string;
  baseIntegration: string;
  enhancingIntegrations: string[];
  combinedCapabilities: string[];
  uiEnhancements: UIEnhancement[];
  dataEnhancements: DataEnhancement[];
}

export interface UIEnhancement {
  type: 'additional_fields' | 'enhanced_view' | 'new_action' | 'improved_workflow';
  targetComponent: string;
  enhancement: any;
}

export interface DataEnhancement {
  type: 'enrichment' | 'validation' | 'transformation' | 'sync';
  source: string;
  target: string;
  mapping: Record<string, string>;
}

// Export all types as a namespace for easier imports
export * as IntegrationTypes from './index';
