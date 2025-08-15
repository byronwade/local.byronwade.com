/**
 * SEO Utilities - Main Export
 * Centralized exports for all SEO-related functionality
 */

export * from './metadata';
export * from './structured-data';

// Re-export commonly used functions with cleaner names
export { 
	baseMetadata as defaultMetadata,
	generatePageMetadata as createPageMeta,
	generateBusinessMetadata as createBusinessMeta,
	viewport as defaultViewport
} from './metadata';

export {
	generatePageSchema as createPageSchema,
	renderJsonLd as JsonLd
} from './structured-data';
