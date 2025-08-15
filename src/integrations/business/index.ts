/**
 * Business Integrations
 * Integrations specifically designed for business operations and management
 */

export * from './payment-processing';
export * from './crm-systems';
export * from './analytics-platforms';
export * from './communication-tools';
export * from './accounting-software';
export * from './scheduling-booking';
export * from './marketing-automation';
export * from './inventory-management';
export * from './point-of-sale';
export * from './delivery-logistics';

// Thorbis-first business ops integrations (prioritized order)
export const BUSINESS_OPS_ORDER = [
  'field_management', // First
  'payroll',          // Second
  'invoicing',        // Third
  'estimates',        // Fourth
  'pos',              // Fifth
  'voip',             // Sixth
] as const;
