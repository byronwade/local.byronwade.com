// Enterprise Lighthouse CI Configuration
// Performance budgets and audit configuration for enterprise standards

module.exports = {
	ci: {
		collect: {
			numberOfRuns: 3,
			startServerCommand: "npm run start",
			startServerReadyPattern: "ready on",
			startServerReadyTimeout: 60000,
			url: ["http://localhost:3000", "http://localhost:3000/search", "http://localhost:3000/business/sample", "http://localhost:3000/dashboard", "http://localhost:3000/login"],
			settings: {
				chromeFlags: "--no-sandbox --disable-dev-shm-usage",
				preset: "desktop",
				onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
				skipAudits: [
					"uses-http2", // Not applicable for localhost
					"is-on-https", // Not applicable for localhost
				],
			},
		},
		assert: {
			// Performance budgets (enterprise standards)
			assertions: {
				"categories:performance": ["error", { minScore: 0.9 }],
				"categories:accessibility": ["error", { minScore: 1.0 }],
				"categories:best-practices": ["error", { minScore: 0.9 }],
				"categories:seo": ["error", { minScore: 0.9 }],

				// Core Web Vitals
				"largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
				"first-contentful-paint": ["error", { maxNumericValue: 1800 }],
				"cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
				"total-blocking-time": ["error", { maxNumericValue: 200 }],

				// Performance metrics
				"speed-index": ["error", { maxNumericValue: 3000 }],
				interactive: ["error", { maxNumericValue: 3800 }],

				// Resource budgets
				"resource-summary:document:size": ["error", { maxNumericValue: 50000 }],
				"resource-summary:script:size": ["error", { maxNumericValue: 250000 }],
				"resource-summary:stylesheet:size": ["error", { maxNumericValue: 50000 }],
				"resource-summary:image:size": ["error", { maxNumericValue: 500000 }],
				"resource-summary:font:size": ["error", { maxNumericValue: 100000 }],

				// Security and best practices
				"uses-https": "off", // Disabled for localhost
				"is-on-https": "off", // Disabled for localhost
				"redirects-http": "off", // Disabled for localhost
				"uses-http2": "off", // Disabled for localhost

				// Required for production
				"csp-xss": ["warn", {}],
				"content-width": ["error", {}],
				"tap-targets": ["error", {}],
				viewport: ["error", {}],

				// Accessibility requirements
				accesskeys: ["error", {}],
				"aria-allowed-attr": ["error", {}],
				"aria-hidden-body": ["error", {}],
				"aria-hidden-focus": ["error", {}],
				"aria-input-field-name": ["error", {}],
				"aria-required-attr": ["error", {}],
				"aria-roles": ["error", {}],
				"aria-valid-attr": ["error", {}],
				"aria-valid-attr-value": ["error", {}],
				"button-name": ["error", {}],
				"color-contrast": ["error", {}],
				"document-title": ["error", {}],
				"duplicate-id-aria": ["error", {}],
				"form-field-multiple-labels": ["error", {}],
				"frame-title": ["error", {}],
				"heading-order": ["error", {}],
				"html-has-lang": ["error", {}],
				"html-lang-valid": ["error", {}],
				"image-alt": ["error", {}],
				"input-image-alt": ["error", {}],
				label: ["error", {}],
				"link-name": ["error", {}],
				list: ["error", {}],
				listitem: ["error", {}],
				"meta-refresh": ["error", {}],
				"meta-viewport": ["error", {}],
				"object-alt": ["error", {}],
				tabindex: ["error", {}],
				"td-headers-attr": ["error", {}],
				"th-has-data-cells": ["error", {}],
				"valid-lang": ["error", {}],
				"video-caption": ["error", {}],
				"video-description": ["error", {}],
			},
		},
		upload: {
			target: "lhci",
			serverBaseUrl: process.env.LHCI_SERVER_URL,
			token: process.env.LHCI_SERVER_TOKEN,
			ignoreDuplicateBuildFailure: true,
		},
		server: {
			port: 9001,
			storage: {
				storageMethod: "sql",
				sqlDialect: "sqlite",
				sqlDatabasePath: "./lhci.db",
			},
		},
		wizard: {
			// Configuration for LHCI wizard
		},
	},
};
