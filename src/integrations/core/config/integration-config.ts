/**
 * Integration Configuration Manager
 * Handles configuration templates, validation, and environment-specific settings
 */

import { Integration, IntegrationCategory, IntegrationCapability } from '../types';
import { logger } from '@utils/logger';
import { z } from 'zod';

// ============================================================================
// CONFIGURATION TEMPLATES
// ============================================================================

export interface IntegrationTemplate {
  id: string;
  name: string;
  category: IntegrationCategory;
  provider: string;
  description: string;
  version: string;
  
  // Configuration schema
  configSchema: z.ZodSchema;
  credentialsSchema: z.ZodSchema;
  
  // Default configuration
  defaultConfig: Record<string, any>;
  requiredFields: string[];
  
  // Capabilities and permissions
  capabilities: IntegrationCapability[];
  requiredPermissions: string[];
  
  // Setup requirements
  setupInstructions: SetupInstruction[];
  prerequisites: Prerequisite[];
  
  // Documentation
  documentationUrl?: string;
  supportUrl?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface SetupInstruction {
  step: number;
  title: string;
  description: string;
  type: 'manual' | 'automated' | 'external';
  action?: string;
  externalUrl?: string;
  required: boolean;
}

export interface Prerequisite {
  type: 'integration' | 'permission' | 'plan' | 'technical';
  requirement: string;
  description: string;
  checkFunction?: () => Promise<boolean>;
}

// ============================================================================
// PREDEFINED INTEGRATION TEMPLATES
// ============================================================================

const commonSchemas = {
  oauth2: z.object({
    clientId: z.string().min(1, 'Client ID is required'),
    clientSecret: z.string().min(1, 'Client Secret is required'),
    scope: z.string().optional(),
    redirectUri: z.string().url('Must be a valid URL').optional(),
  }),
  
  apiKey: z.object({
    apiKey: z.string().min(1, 'API Key is required'),
    apiSecret: z.string().optional(),
  }),
  
  webhook: z.object({
    webhookUrl: z.string().url('Must be a valid webhook URL'),
    secret: z.string().min(1, 'Webhook secret is required'),
  }),
};

export const INTEGRATION_TEMPLATES: Record<string, IntegrationTemplate> = {
  // ============================================================================
  // COMMUNICATION INTEGRATIONS
  // ============================================================================
  
  slack: {
    id: 'slack',
    name: 'Slack',
    category: 'communication',
    provider: 'Slack Technologies',
    description: 'Team communication and notifications',
    version: '1.0.0',
    
    configSchema: z.object({
      workspace: z.string().min(1, 'Workspace name is required'),
      defaultChannel: z.string().min(1, 'Default channel is required'),
      notificationTypes: z.array(z.string()).default([]),
    }),
    
    credentialsSchema: commonSchemas.oauth2,
    
    defaultConfig: {
      environment: 'production',
      defaultChannel: '#general',
      notificationTypes: ['business_review', 'new_customer', 'booking_confirmed'],
    },
    
    requiredFields: ['workspace', 'defaultChannel'],
    capabilities: ['write', 'webhook', 'realtime'],
    requiredPermissions: ['channels:read', 'chat:write', 'incoming-webhook'],
    
    setupInstructions: [
      {
        step: 1,
        title: 'Create Slack App',
        description: 'Go to api.slack.com and create a new app for your workspace',
        type: 'external',
        externalUrl: 'https://api.slack.com/apps',
        required: true,
      },
      {
        step: 2,
        title: 'Configure OAuth',
        description: 'Add the required scopes and set the redirect URI',
        type: 'manual',
        required: true,
      },
    ],
    
    prerequisites: [
      {
        type: 'permission',
        requirement: 'admin',
        description: 'Admin access required to install Slack integration',
      },
    ],
    
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // ============================================================================
  // ANALYTICS INTEGRATIONS
  // ============================================================================
  
  google_analytics: {
    id: 'google_analytics',
    name: 'Google Analytics',
    category: 'analytics',
    provider: 'Google',
    description: 'Website and business analytics tracking',
    version: '4.0.0',
    
    configSchema: z.object({
      measurementId: z.string().regex(/^G-[A-Z0-9]+$/, 'Invalid GA4 Measurement ID'),
      trackingEvents: z.array(z.string()).default([]),
      customDimensions: z.record(z.string()).optional(),
    }),
    
    credentialsSchema: z.object({
      serviceAccountKey: z.string().min(1, 'Service Account Key is required'),
    }),
    
    defaultConfig: {
      environment: 'production',
      trackingEvents: ['page_view', 'business_view', 'review_submitted'],
      enableEcommerce: false,
    },
    
    requiredFields: ['measurementId'],
    capabilities: ['read', 'write', 'export'],
    requiredPermissions: ['analytics.readonly'],
    
    setupInstructions: [
      {
        step: 1,
        title: 'Create GA4 Property',
        description: 'Create a new GA4 property in Google Analytics',
        type: 'external',
        externalUrl: 'https://analytics.google.com',
        required: true,
      },
      {
        step: 2,
        title: 'Enable Analytics API',
        description: 'Enable the Google Analytics Reporting API in Google Cloud Console',
        type: 'external',
        externalUrl: 'https://console.cloud.google.com',
        required: true,
      },
    ],
    
    prerequisites: [
      {
        type: 'technical',
        requirement: 'google_cloud_project',
        description: 'Google Cloud Project with Analytics API enabled',
      },
    ],
    
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // ============================================================================
  // PAYMENT INTEGRATIONS
  // ============================================================================
  
  stripe: {
    id: 'stripe',
    name: 'Stripe',
    category: 'payment',
    provider: 'Stripe, Inc.',
    description: 'Payment processing and subscription management',
    version: '2.0.0',
    
    configSchema: z.object({
      currency: z.string().length(3, 'Currency must be 3 characters').default('USD'),
      webhookEndpoint: z.string().url('Must be a valid URL'),
      enableSubscriptions: z.boolean().default(false),
      paymentMethods: z.array(z.string()).default(['card']),
    }),
    
    credentialsSchema: z.object({
      publishableKey: z.string().startsWith('pk_', 'Invalid publishable key'),
      secretKey: z.string().startsWith('sk_', 'Invalid secret key'),
      webhookSecret: z.string().startsWith('whsec_', 'Invalid webhook secret'),
    }),
    
    defaultConfig: {
      environment: 'production',
      currency: 'USD',
      enableSubscriptions: true,
      paymentMethods: ['card', 'apple_pay', 'google_pay'],
    },
    
    requiredFields: ['currency', 'webhookEndpoint'],
    capabilities: ['read', 'write', 'webhook', 'realtime'],
    requiredPermissions: ['payments:read', 'payments:write'],
    
    setupInstructions: [
      {
        step: 1,
        title: 'Create Stripe Account',
        description: 'Sign up for a Stripe account and complete verification',
        type: 'external',
        externalUrl: 'https://dashboard.stripe.com/register',
        required: true,
      },
      {
        step: 2,
        title: 'Configure Webhooks',
        description: 'Set up webhook endpoints for payment events',
        type: 'automated',
        action: 'setup_stripe_webhooks',
        required: true,
      },
    ],
    
    prerequisites: [
      {
        type: 'plan',
        requirement: 'pro',
        description: 'Pro plan or higher required for payment processing',
      },
    ],
    
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // ============================================================================
  // CRM INTEGRATIONS
  // ============================================================================
  
  hubspot: {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'crm',
    provider: 'HubSpot, Inc.',
    description: 'Customer relationship management and marketing automation',
    version: '1.0.0',
    
    configSchema: z.object({
      portalId: z.string().min(1, 'Portal ID is required'),
      syncContacts: z.boolean().default(true),
      syncDeals: z.boolean().default(false),
      syncFrequency: z.enum(['realtime', 'hourly', 'daily']).default('hourly'),
    }),
    
    credentialsSchema: commonSchemas.oauth2.extend({
      privateAppToken: z.string().optional(),
    }),
    
    defaultConfig: {
      environment: 'production',
      syncContacts: true,
      syncDeals: true,
      syncFrequency: 'hourly',
    },
    
    requiredFields: ['portalId'],
    capabilities: ['read', 'write', 'sync', 'webhook'],
    requiredPermissions: ['contacts', 'deals', 'companies'],
    
    setupInstructions: [
      {
        step: 1,
        title: 'Create HubSpot App',
        description: 'Create a private app in your HubSpot account',
        type: 'external',
        externalUrl: 'https://developers.hubspot.com/docs/api/private-apps',
        required: true,
      },
    ],
    
    prerequisites: [
      {
        type: 'plan',
        requirement: 'business',
        description: 'Business plan required for CRM integrations',
      },
    ],
    
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // ============================================================================
  // BUSINESS OPERATIONS INTEGRATIONS (Thorbis First-Class)
  // ============================================================================

  // 1) Field Management (FSM) — First integration
  field_management: {
    id: 'field_management',
    name: 'Field Management',
    category: 'scheduling',
    provider: 'Thorbis',
    description: 'Jobs, dispatch, time tracking, and technician scheduling',
    version: '1.0.0',

    configSchema: z.object({
      timezone: z.string().min(1, 'Timezone is required').default('UTC'),
      defaultJobDurationMin: z.number().int().min(15).max(1440).default(60),
      autoDispatch: z.boolean().default(false),
      geofencing: z.boolean().default(true),
      locationAccuracyMeters: z.number().int().min(5).max(200).default(25),
      enableTimesheets: z.boolean().default(true),
      webhookUrl: z.string().url('Must be a valid webhook URL').optional(),
    }),

    credentialsSchema: commonSchemas.apiKey.partial(),

    defaultConfig: {
      environment: 'production',
      defaultJobDurationMin: 60,
      autoDispatch: false,
      geofencing: true,
      locationAccuracyMeters: 25,
      enableTimesheets: true,
    },

    requiredFields: ['timezone'],
    capabilities: ['read', 'write', 'sync', 'webhook', 'realtime'],
    requiredPermissions: ['jobs', 'teams', 'locations'],

    setupInstructions: [
      { step: 1, title: 'Configure scheduling rules', description: 'Set business hours, territories, and dispatch rules', type: 'manual', required: true },
      { step: 2, title: 'Enable webhooks', description: 'Receive job and status events in real-time', type: 'manual', required: false },
    ],

    prerequisites: [],

    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // 2) Payroll — depends on FSM timesheets (recommended)
  payroll: {
    id: 'payroll',
    name: 'Payroll',
    category: 'hr',
    provider: 'Generic',
    description: 'Automated salary, timesheets, tax calculations, and payouts',
    version: '1.0.0',

    configSchema: z.object({
      paySchedule: z.enum(['weekly', 'biweekly', 'monthly']).default('biweekly'),
      currency: z.string().length(3).default('USD'),
      overtimeRule: z.enum(['none', 'daily', 'weekly']).default('weekly'),
      country: z.string().min(2).default('US'),
      enableCommissions: z.boolean().default(false),
    }),

    credentialsSchema: commonSchemas.apiKey.or(commonSchemas.oauth2.partial()),

    defaultConfig: {
      environment: 'production',
      paySchedule: 'biweekly',
      currency: 'USD',
      overtimeRule: 'weekly',
      enableCommissions: false,
    },

    requiredFields: ['paySchedule', 'currency'],
    capabilities: ['read', 'write', 'export'],
    requiredPermissions: ['payroll.process', 'employees.read'],

    setupInstructions: [
      { step: 1, title: 'Connect payroll provider', description: 'Enter API credentials or complete OAuth', type: 'manual', required: true },
      { step: 2, title: 'Map timesheets', description: 'Map FSM timesheets to payroll time entries', type: 'manual', required: false },
    ],

    prerequisites: [
      { type: 'integration', requirement: 'field_management', description: 'Recommended: Use FSM timesheets as time source' },
    ],

    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // 3) Invoicing — can ingest jobs and time/materials from FSM
  invoicing: {
    id: 'invoicing',
    name: 'Invoicing',
    category: 'accounting',
    provider: 'Generic',
    description: 'Generate invoices from jobs, time, and materials; sync to accounting',
    version: '1.0.0',

    configSchema: z.object({
      defaultNetTerms: z.number().int().min(0).max(90).default(30),
      taxRatePercent: z.number().min(0).max(100).default(0),
      autoEmailInvoices: z.boolean().default(true),
      sendReminders: z.boolean().default(true),
    }),

    credentialsSchema: commonSchemas.apiKey.partial(),

    defaultConfig: {
      environment: 'production',
      defaultNetTerms: 30,
      taxRatePercent: 0,
      autoEmailInvoices: true,
      sendReminders: true,
    },

    requiredFields: [],
    capabilities: ['read', 'write', 'export'],
    requiredPermissions: ['invoices.write', 'customers.read'],

    setupInstructions: [
      { step: 1, title: 'Configure branding and terms', description: 'Upload logo, set net terms and taxes', type: 'manual', required: true },
      { step: 2, title: 'Enable job import', description: 'Import completed jobs from FSM for billing', type: 'manual', required: false },
    ],

    prerequisites: [
      { type: 'integration', requirement: 'field_management', description: 'Recommended: Use FSM jobs as billing source' },
    ],

    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // 4) Estimates — pre-invoice quotes; enhances FSM job workflow
  estimates: {
    id: 'estimates',
    name: 'Estimates',
    category: 'accounting',
    provider: 'Generic',
    description: 'Create and manage estimates; convert to jobs and invoices',
    version: '1.0.0',

    configSchema: z.object({
      defaultExpirationDays: z.number().int().min(1).max(90).default(30),
      requireSignature: z.boolean().default(true),
      allowDiscounts: z.boolean().default(true),
    }),

    credentialsSchema: z.object({}).optional() as any,

    defaultConfig: {
      environment: 'production',
      defaultExpirationDays: 30,
      requireSignature: true,
      allowDiscounts: true,
    },

    requiredFields: [],
    capabilities: ['read', 'write', 'export'],
    requiredPermissions: ['estimates.write'],

    setupInstructions: [
      { step: 1, title: 'Configure templates', description: 'Set estimate templates and terms', type: 'manual', required: true },
    ],

    prerequisites: [
      { type: 'integration', requirement: 'field_management', description: 'Recommended: Convert accepted estimates into FSM jobs' },
    ],

    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // 5) POS — optional link with invoices/inventory
  pos: {
    id: 'pos',
    name: 'Point of Sale',
    category: 'inventory',
    provider: 'Generic',
    description: 'In-person sales, receipts, inventory decrement, and daily totals',
    version: '1.0.0',

    configSchema: z.object({
      receiptFooter: z.string().default('Thank you for your business!'),
      trackInventory: z.boolean().default(true),
      cashDrawer: z.boolean().default(true),
      taxInclusivePricing: z.boolean().default(false),
    }),

    credentialsSchema: commonSchemas.apiKey.partial(),

    defaultConfig: {
      environment: 'production',
      receiptFooter: 'Thank you for your business!',
      trackInventory: true,
      cashDrawer: true,
      taxInclusivePricing: false,
    },

    requiredFields: [],
    capabilities: ['read', 'write', 'export'],
    requiredPermissions: ['pos.read', 'pos.write'],

    setupInstructions: [
      { step: 1, title: 'Pair hardware', description: 'Connect terminal, barcode scanner, and cash drawer', type: 'manual', required: false },
    ],

    prerequisites: [
      { type: 'integration', requirement: 'invoicing', description: 'Optional: Sync POS sales to invoicing' },
    ],

    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // 6) VOIP — calls, recordings, click-to-call; ties to CRM/FSM
  voip: {
    id: 'voip',
    name: 'VOIP',
    category: 'communication',
    provider: 'Generic',
    description: 'Unified calling, recordings, and call routing integrated with jobs and CRM',
    version: '1.0.0',

    configSchema: z.object({
      defaultCountry: z.string().min(2).default('US'),
      callRecording: z.boolean().default(true),
      spamFilter: z.boolean().default(true),
      clickToCall: z.boolean().default(true),
      webhookUrl: z.string().url('Must be a valid webhook URL').optional(),
    }),

    credentialsSchema: commonSchemas.oauth2.partial().or(commonSchemas.apiKey),

    defaultConfig: {
      environment: 'production',
      callRecording: true,
      spamFilter: true,
      clickToCall: true,
    },

    requiredFields: [],
    capabilities: ['read', 'write', 'realtime', 'webhook', 'notify'],
    requiredPermissions: ['calls.read', 'calls.write'],

    setupInstructions: [
      { step: 1, title: 'Provision numbers', description: 'Buy/provision VOIP numbers and assign queues', type: 'manual', required: true },
      { step: 2, title: 'Enable CRM pop', description: 'Show customer/job context on incoming calls', type: 'manual', required: false },
    ],

    prerequisites: [
      { type: 'integration', requirement: 'field_management', description: 'Optional: Surface job context during calls' },
    ],

    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
};

// ============================================================================
// CONFIGURATION MANAGER
// ============================================================================

export class IntegrationConfigManager {
  private templates: Map<string, IntegrationTemplate> = new Map();

  constructor() {
    this.loadTemplates();
  }

  // ============================================================================
  // TEMPLATE MANAGEMENT
  // ============================================================================

  private loadTemplates(): void {
    Object.values(INTEGRATION_TEMPLATES).forEach(template => {
      this.templates.set(template.id, template);
    });
    
    logger.info(`Loaded ${this.templates.size} integration templates`);
  }

  getTemplate(integrationId: string): IntegrationTemplate | undefined {
    return this.templates.get(integrationId);
  }

  getAllTemplates(): IntegrationTemplate[] {
    return Array.from(this.templates.values());
  }

  getTemplatesByCategory(category: IntegrationCategory): IntegrationTemplate[] {
    return Array.from(this.templates.values()).filter(
      template => template.category === category
    );
  }

  registerTemplate(template: IntegrationTemplate): void {
    this.validateTemplate(template);
    this.templates.set(template.id, template);
    logger.info(`Registered integration template: ${template.id}`);
  }

  // ============================================================================
  // CONFIGURATION VALIDATION
  // ============================================================================

  validateConfiguration(integrationId: string, config: any): ValidationResult {
    const template = this.getTemplate(integrationId);
    if (!template) {
      return {
        isValid: false,
        errors: [`Template not found for integration: ${integrationId}`],
        warnings: [],
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Validate against schema
      template.configSchema.parse(config);
      
      // Check required fields
      for (const field of template.requiredFields) {
        if (!config[field]) {
          errors.push(`Required field missing: ${field}`);
        }
      }
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(...error.errors.map(e => `${e.path.join('.')}: ${e.message}`));
      } else {
        errors.push(`Configuration validation failed: ${error.message}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  validateCredentials(integrationId: string, credentials: any): ValidationResult {
    const template = this.getTemplate(integrationId);
    if (!template) {
      return {
        isValid: false,
        errors: [`Template not found for integration: ${integrationId}`],
        warnings: [],
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      template.credentialsSchema.parse(credentials);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(...error.errors.map(e => `${e.path.join('.')}: ${e.message}`));
      } else {
        errors.push(`Credentials validation failed: ${error.message}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // ============================================================================
  // INTEGRATION GENERATION
  // ============================================================================

  generateIntegrationFromTemplate(
    templateId: string, 
    config: any, 
    credentials: any
  ): Partial<Integration> {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // Validate configuration
    const configValidation = this.validateConfiguration(templateId, config);
    if (!configValidation.isValid) {
      throw new Error(`Invalid configuration: ${configValidation.errors.join(', ')}`);
    }

    // Validate credentials
    const credentialsValidation = this.validateCredentials(templateId, credentials);
    if (!credentialsValidation.isValid) {
      throw new Error(`Invalid credentials: ${credentialsValidation.errors.join(', ')}`);
    }

    // Generate integration
    const integration: Partial<Integration> = {
      id: `${templateId}_${Date.now()}`,
      name: template.name,
      displayName: template.name,
      description: template.description,
      version: template.version,
      category: template.category,
      provider: template.provider,
      
      status: 'installing',
      isEnabled: false,
      isRequired: false,
      isSystemIntegration: false,
      
      config: {
        ...template.defaultConfig,
        ...config,
      },
      
      credentials: {
        type: this.determineCredentialType(credentials),
        encrypted: true,
        fields: credentials,
      },
      
      capabilities: template.capabilities,
      permissions: template.requiredPermissions.map(perm => ({
        scope: perm,
        actions: ['read', 'write'],
        resources: ['*'],
      })),
      
      dependencies: [],
      conflicts: [],
      enhances: [],
      
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return integration;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private determineCredentialType(credentials: any): any {
    if (credentials.clientId && credentials.clientSecret) {
      return 'oauth2';
    }
    if (credentials.apiKey) {
      return 'api_key';
    }
    if (credentials.username && credentials.password) {
      return 'basic';
    }
    return 'custom';
  }

  private validateTemplate(template: IntegrationTemplate): void {
    if (!template.id || !template.name || !template.version) {
      throw new Error('Template must have id, name, and version');
    }

    if (this.templates.has(template.id)) {
      throw new Error(`Template with id '${template.id}' already exists`);
    }
  }

  // ============================================================================
  // DEPENDENCY SUGGESTIONS
  // ============================================================================

  suggestIntegrations(category?: IntegrationCategory, capabilities?: IntegrationCapability[]): IntegrationTemplate[] {
    let templates = Array.from(this.templates.values());

    if (category) {
      templates = templates.filter(t => t.category === category);
    }

    if (capabilities?.length) {
      templates = templates.filter(t => 
        capabilities.some(cap => t.capabilities.includes(cap))
      );
    }

    // Sort by popularity/recommendation score (could be based on usage data)
    return templates.sort((a, b) => a.name.localeCompare(b.name));
  }

  getIntegrationPrerequisites(integrationId: string): Prerequisite[] {
    const template = this.getTemplate(integrationId);
    return template?.prerequisites || [];
  }

  async checkPrerequisites(integrationId: string): Promise<PrerequisiteCheckResult[]> {
    const prerequisites = this.getIntegrationPrerequisites(integrationId);
    const results: PrerequisiteCheckResult[] = [];

    for (const prerequisite of prerequisites) {
      let satisfied = true;
      let message = 'Satisfied';

      if (prerequisite.checkFunction) {
        try {
          satisfied = await prerequisite.checkFunction();
          if (!satisfied) {
            message = 'Check failed';
          }
        } catch (error) {
          satisfied = false;
          message = `Check error: ${error.message}`;
        }
      }

      results.push({
        prerequisite,
        satisfied,
        message,
      });
    }

    return results;
  }
}

// ============================================================================
// TYPES
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PrerequisiteCheckResult {
  prerequisite: Prerequisite;
  satisfied: boolean;
  message: string;
}

// Singleton instance
export const integrationConfig = new IntegrationConfigManager();
