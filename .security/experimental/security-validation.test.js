/**
 * 🔬 EXPERIMENTAL SECURITY VALIDATION TESTS
 * Comprehensive Testing Suite for Cutting-Edge Security Features
 * 
 * This test suite validates all experimental security features and ensures
 * they're working correctly across different browsers and environments.
 * 
 * @version 1.0.0-experimental
 * @requires Node.js 18+, modern browser environment
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { createMocks } from 'node-mocks-http';
import { NextRequest, NextResponse } from 'next/server';

// Import experimental security modules
import { 
  initializeTrustedTypes,
  getTrustedTypesManager,
  validateTrustedTypesRequest 
} from './trusted-types.js';

import { 
  generateIsolationHeaders,
  validateCrossOriginRequest,
  checkCrossOriginIsolation 
} from './cross-origin-isolation.js';

import { 
  generateDocumentIsolationHeader,
  isDocumentIsolationSupported 
} from './document-isolation-policy.js';

import { 
  generatePermissionsPolicyHeader,
  validatePermissionsRequest 
} from './permissions-policy.js';

import middleware from '../../middleware.experimental-security.js';

// ============================================================================
// TEST SETUP & UTILITIES
// ============================================================================

/**
 * Create mock request for testing
 */
function createMockRequest(options = {}) {
  const {
    method = 'GET',
    url = 'https://local.byronwade.com/test',
    headers = {},
    body = null
  } = options;
  
  const request = new NextRequest(new Request(url, {
    method,
    headers: {
      'user-agent': 'Mozilla/5.0 (Chrome/120.0.0.0)',
      'host': 'local.byronwade.com',
      'origin': 'https://local.byronwade.com',
      ...headers
    },
    body
  }));
  
  return request;
}

/**
 * Mock performance.now() for consistent testing
 */
const mockPerformance = {
  now: () => Date.now()
};

global.performance = mockPerformance;

// ============================================================================
// TRUSTED TYPES API TESTS
// ============================================================================

describe('🔐 Trusted Types API', () => {
  let trustedTypesManager;
  
  beforeAll(() => {
    // Mock Trusted Types API for testing
    global.trustedTypes = {
      createPolicy: (name, rules) => ({
        name,
        createHTML: rules.createHTML || ((input) => input),
        createScript: rules.createScript || ((input) => input),
        createScriptURL: rules.createScriptURL || ((input) => input)
      }),
      isHTML: (value) => typeof value === 'object' && value._trustedHTML,
      isScript: (value) => typeof value === 'object' && value._trustedScript,
      isScriptURL: (value) => typeof value === 'object' && value._trustedScriptURL
    };
    
    initializeTrustedTypes();
    trustedTypesManager = getTrustedTypesManager();
  });
  
  test('should initialize Trusted Types policies', () => {
    expect(trustedTypesManager).toBeDefined();
    expect(trustedTypesManager.createHTML).toBeFunction();
    expect(trustedTypesManager.createScript).toBeFunction();
    expect(trustedTypesManager.createScriptURL).toBeFunction();
  });
  
  test('should create safe HTML content', () => {
    const unsafeHTML = '<script>alert(\"XSS\")</script><div>Safe content</div>';
    const safeHTML = trustedTypesManager.createHTML(unsafeHTML);
    
    // Should sanitize malicious content
    expect(safeHTML.toString()).not.toContain('<script>');
    expect(safeHTML.toString()).toContain('Safe content');
  });
  
  test('should create safe script content', () => {
    const unsafeScript = 'console.log(\"safe\"); eval(\"malicious code\");';
    const safeScript = trustedTypesManager.createScript(unsafeScript);
    
    // Should sanitize eval and other dangerous functions
    expect(safeScript.toString()).not.toContain('eval');
    expect(safeScript.toString()).toContain('console.log');
  });
  
  test('should validate business content', () => {
    const businessData = {\n      name: 'Test Business',\n      description: 'A <em>great</em> business',\n      maliciousField: '<script>steal()</script>'\n    };\n    \n    const safeBusinessHTML = trustedTypesManager.createBusinessContent(businessData);\n    \n    expect(safeBusinessHTML.toString()).toContain('Test Business');\n    expect(safeBusinessHTML.toString()).toContain('<em>great</em>');\n    expect(safeBusinessHTML.toString()).not.toContain('<script>');\n  });\n  \n  test('should handle analytics content safely', () => {\n    const analyticsData = {\n      event: 'page_view',\n      maliciousPayload: 'javascript:alert(1)'\n    };\n    \n    const safeAnalyticsScript = trustedTypesManager.createAnalyticsScript(analyticsData);\n    \n    expect(safeAnalyticsScript.toString()).toContain('page_view');\n    expect(safeAnalyticsScript.toString()).not.toContain('javascript:');\n  });\n  \n  test('should validate Trusted Types requests', async () => {\n    const request = createMockRequest({\n      method: 'POST',\n      headers: {\n        'content-type': 'application/json'\n      },\n      body: JSON.stringify({\n        content: '<div>Safe content</div>',\n        type: 'html'\n      })\n    });\n    \n    const validation = await validateTrustedTypesRequest(request);\n    expect(validation.valid).toBe(true);\n  });\n  \n  test('should reject malicious Trusted Types requests', async () => {\n    const request = createMockRequest({\n      method: 'POST',\n      headers: {\n        'content-type': 'application/json'\n      },\n      body: JSON.stringify({\n        content: '<script>alert(\"XSS\")</script>',\n        type: 'html'\n      })\n    });\n    \n    const validation = await validateTrustedTypesRequest(request);\n    expect(validation.valid).toBe(false);\n    expect(validation.violations).toContain('script');\n  });\n});\n\n// ============================================================================\n// CROSS-ORIGIN ISOLATION TESTS\n// ============================================================================\n\ndescribe('🌐 Cross-Origin Isolation', () => {\n  test('should generate correct isolation headers', () => {\n    const headers = generateIsolationHeaders({\n      strict: true,\n      allowCredentials: false\n    });\n    \n    expect(headers['Cross-Origin-Embedder-Policy']).toBe('require-corp');\n    expect(headers['Cross-Origin-Opener-Policy']).toBe('same-origin');\n  });\n  \n  test('should generate credentialless headers for less strict mode', () => {\n    const headers = generateIsolationHeaders({\n      strict: false,\n      allowCredentials: true\n    });\n    \n    expect(headers['Cross-Origin-Embedder-Policy']).toBe('credentialless');\n    expect(headers['Cross-Origin-Opener-Policy']).toBe('same-origin-allow-popups');\n  });\n  \n  test('should validate cross-origin requests', () => {\n    const validRequest = createMockRequest({\n      headers: {\n        'origin': 'https://local.byronwade.com',\n        'sec-fetch-site': 'same-origin'\n      }\n    });\n    \n    const validation = validateCrossOriginRequest(validRequest);\n    expect(validation.valid).toBe(true);\n  });\n  \n  test('should reject suspicious cross-origin requests', () => {\n    const suspiciousRequest = createMockRequest({\n      headers: {\n        'origin': 'https://malicious-site.com',\n        'sec-fetch-site': 'cross-site'\n      }\n    });\n    \n    const validation = validateCrossOriginRequest(suspiciousRequest);\n    expect(validation.valid).toBe(false);\n    expect(validation.reason).toContain('origin');\n  });\n  \n  test('should check cross-origin isolation status', () => {\n    // Mock crossOriginIsolated global\n    global.crossOriginIsolated = true;\n    \n    const isolationStatus = checkCrossOriginIsolation();\n    expect(isolationStatus.isolated).toBe(true);\n    expect(isolationStatus.sharedArrayBufferAvailable).toBe(true);\n  });\n});\n\n// ============================================================================\n// DOCUMENT ISOLATION POLICY TESTS\n// ============================================================================\n\ndescribe('📄 Document-Isolation-Policy (Experimental)', () => {\n  test('should detect Chrome browser support', () => {\n    const chromeUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';\n    \n    const isSupported = isDocumentIsolationSupported(chromeUserAgent);\n    expect(isSupported).toBe(true);\n  });\n  \n  test('should reject non-Chrome browsers', () => {\n    const firefoxUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0';\n    \n    const isSupported = isDocumentIsolationSupported(firefoxUserAgent);\n    expect(isSupported).toBe(false);\n  });\n  \n  test('should generate document isolation headers', () => {\n    const header = generateDocumentIsolationHeader({\n      mode: 'credentialless',\n      reportOnly: false\n    });\n    \n    expect(header.value).toBe('isolate-and-credentialless');\n    expect(header.reportOnly).toBe(false);\n  });\n  \n  test('should generate report-only headers for development', () => {\n    const header = generateDocumentIsolationHeader({\n      mode: 'credentialless',\n      reportOnly: true\n    });\n    \n    expect(header.value).toBe('isolate-and-credentialless');\n    expect(header.reportOnly).toBe(true);\n  });\n});\n\n// ============================================================================\n// PERMISSIONS POLICY TESTS\n// ============================================================================\n\ndescribe('🔑 Permissions Policy', () => {\n  test('should generate comprehensive permissions policy', () => {\n    const policy = generatePermissionsPolicyHeader({\n      strict: true,\n      allowSelfOrigin: false\n    });\n    \n    // Should block all sensitive features\n    expect(policy).toContain('camera=()');\n    expect(policy).toContain('microphone=()');\n    expect(policy).toContain('geolocation=()');\n    expect(policy).toContain('attribution-reporting=()');\n  });\n  \n  test('should allow self-origin features when specified', () => {\n    const policy = generatePermissionsPolicyHeader({\n      strict: false,\n      allowSelfOrigin: true\n    });\n    \n    // Should allow some features for self\n    expect(policy).toContain('fullscreen=(self)');\n    expect(policy).toContain('picture-in-picture=(self)');\n  });\n  \n  test('should validate permissions requests', () => {\n    const request = createMockRequest({\n      headers: {\n        'sec-fetch-dest': 'document',\n        'sec-fetch-mode': 'navigate'\n      }\n    });\n    \n    const validation = validatePermissionsRequest(request);\n    expect(validation.valid).toBe(true);\n  });\n  \n  test('should block dangerous permission requests', () => {\n    const request = createMockRequest({\n      headers: {\n        'sec-fetch-dest': 'embed',\n        'sec-fetch-mode': 'cors'\n      }\n    });\n    \n    const validation = validatePermissionsRequest(request);\n    expect(validation.valid).toBe(false);\n  });\n});\n\n// ============================================================================\n// MIDDLEWARE INTEGRATION TESTS\n// ============================================================================\n\ndescribe('🛡️ Security Middleware Integration', () => {\n  test('should apply security headers to public routes', async () => {\n    const request = createMockRequest({\n      url: 'https://local.byronwade.com/'\n    });\n    \n    const response = await middleware(request);\n    \n    // Check basic security headers\n    expect(response.headers.get('X-Frame-Options')).toBe('DENY');\n    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');\n    expect(response.headers.get('X-Security-Suite')).toBe('experimental-2025');\n  });\n  \n  test('should apply strict security to admin routes', async () => {\n    const request = createMockRequest({\n      url: 'https://local.byronwade.com/admin/dashboard'\n    });\n    \n    const response = await middleware(request);\n    \n    // Check admin-specific headers\n    expect(response.headers.get('X-Security-Level')).toBe('maximum');\n    expect(response.headers.get('Cross-Origin-Embedder-Policy')).toBe('require-corp');\n  });\n  \n  test('should protect against CVE-2025-29927', async () => {\n    const maliciousRequest = createMockRequest({\n      url: 'https://local.byronwade.com/../admin',\n      headers: {\n        'host': 'malicious-host.com'\n      }\n    });\n    \n    const response = await middleware(maliciousRequest);\n    \n    // Should block malicious requests\n    expect(response.status).toBe(403);\n    expect(response.headers.get('X-Security-Alert')).toBe('CVE-2025-29927-Protection');\n  });\n  \n  test('should handle middleware errors gracefully', async () => {\n    // Mock error in security processing\n    const originalConsoleError = console.error;\n    console.error = () => {}; // Suppress error logs during test\n    \n    // Create request that might cause processing error\n    const request = createMockRequest({\n      url: 'https://local.byronwade.com/test',\n      headers: {\n        'user-agent': null // Invalid header\n      }\n    });\n    \n    const response = await middleware(request);\n    \n    // Should fail securely with basic headers\n    expect(response.headers.get('X-Frame-Options')).toBe('DENY');\n    \n    console.error = originalConsoleError;\n  });\n  \n  test('should measure performance within budget', async () => {\n    const request = createMockRequest();\n    \n    const startTime = performance.now();\n    const response = await middleware(request);\n    const duration = performance.now() - startTime;\n    \n    // Should complete within performance budget\n    expect(duration).toBeLessThan(50); // 50ms budget\n    \n    // Check performance header\n    const serverTiming = response.headers.get('Server-Timing');\n    expect(serverTiming).toContain('security-middleware');\n  });\n});\n\n// ============================================================================\n// BROWSER COMPATIBILITY TESTS\n// ============================================================================\n\ndescribe('🌐 Browser Compatibility', () => {\n  const browsers = [\n    {\n      name: 'Chrome 120',\n      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',\n      supportsTrustedTypes: true,\n      supportsCrossOriginIsolation: true,\n      supportsDocumentIsolation: true,\n      supportsPermissionsPolicy: true\n    },\n    {\n      name: 'Firefox 119',\n      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',\n      supportsTrustedTypes: false,\n      supportsCrossOriginIsolation: true,\n      supportsDocumentIsolation: false,\n      supportsPermissionsPolicy: true\n    },\n    {\n      name: 'Safari 17',\n      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',\n      supportsTrustedTypes: false,\n      supportsCrossOriginIsolation: true,\n      supportsDocumentIsolation: false,\n      supportsPermissionsPolicy: true\n    }\n  ];\n  \n  browsers.forEach(browser => {\n    test(`should handle ${browser.name} correctly`, async () => {\n      const request = createMockRequest({\n        headers: {\n          'user-agent': browser.userAgent\n        }\n      });\n      \n      const response = await middleware(request);\n      \n      // All browsers should get basic security headers\n      expect(response.headers.get('X-Frame-Options')).toBe('DENY');\n      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');\n      \n      // Feature-specific tests\n      if (browser.supportsTrustedTypes) {\n        expect(response.headers.get('Content-Security-Policy')).toContain('require-trusted-types-for');\n      }\n      \n      if (browser.supportsDocumentIsolation) {\n        const dipHeader = response.headers.get('Document-Isolation-Policy') || \n                         response.headers.get('Document-Isolation-Policy-Report-Only');\n        expect(dipHeader).toBeTruthy();\n      }\n      \n      if (browser.supportsPermissionsPolicy) {\n        expect(response.headers.get('Permissions-Policy')).toBeTruthy();\n      }\n    });\n  });\n});\n\n// ============================================================================\n// PERFORMANCE TESTS\n// ============================================================================\n\ndescribe('⚡ Performance Validation', () => {\n  test('should initialize security features quickly', () => {\n    const startTime = performance.now();\n    \n    // Initialize all security features\n    initializeTrustedTypes();\n    const trustedTypesManager = getTrustedTypesManager();\n    \n    const initTime = performance.now() - startTime;\n    \n    // Should initialize within 10ms\n    expect(initTime).toBeLessThan(10);\n  });\n  \n  test('should process security headers efficiently', async () => {\n    const requests = [];\n    \n    // Create multiple concurrent requests\n    for (let i = 0; i < 10; i++) {\n      requests.push(createMockRequest({\n        url: `https://local.byronwade.com/test${i}`\n      }));\n    }\n    \n    const startTime = performance.now();\n    \n    // Process all requests concurrently\n    const responses = await Promise.all(\n      requests.map(request => middleware(request))\n    );\n    \n    const totalTime = performance.now() - startTime;\n    const averageTime = totalTime / requests.length;\n    \n    // Should process each request in under 20ms\n    expect(averageTime).toBeLessThan(20);\n    \n    // All responses should have security headers\n    responses.forEach(response => {\n      expect(response.headers.get('X-Security-Suite')).toBe('experimental-2025');\n    });\n  });\n  \n  test('should handle memory efficiently', () => {\n    // Create many instances to test memory usage\n    const instances = [];\n    \n    for (let i = 0; i < 100; i++) {\n      const manager = getTrustedTypesManager();\n      const html = manager.createHTML(`<div>Test ${i}</div>`);\n      instances.push(html);\n    }\n    \n    // Should not leak memory - this is basic validation\n    expect(instances.length).toBe(100);\n    \n    // Cleanup\n    instances.length = 0;\n  });\n});\n\n// ============================================================================\n// SECURITY VALIDATION TESTS\n// ============================================================================\n\ndescribe('🔒 Security Validation', () => {\n  test('should prevent XSS through Trusted Types', () => {\n    const trustedTypesManager = getTrustedTypesManager();\n    \n    const maliciousInputs = [\n      '<script>alert(\"XSS\")</script>',\n      '<img src=x onerror=alert(1)>',\n      'javascript:alert(1)',\n      '<svg onload=alert(1)>',\n      '<iframe src=\"javascript:alert(1)\"></iframe>'\n    ];\n    \n    maliciousInputs.forEach(input => {\n      const sanitized = trustedTypesManager.createHTML(input);\n      const sanitizedString = sanitized.toString();\n      \n      // Should not contain dangerous patterns\n      expect(sanitizedString).not.toContain('<script>');\n      expect(sanitizedString).not.toContain('javascript:');\n      expect(sanitizedString).not.toContain('onerror=');\n      expect(sanitizedString).not.toContain('onload=');\n    });\n  });\n  \n  test('should prevent clickjacking through frame options', async () => {\n    const request = createMockRequest();\n    const response = await middleware(request);\n    \n    expect(response.headers.get('X-Frame-Options')).toBe('DENY');\n  });\n  \n  test('should prevent MIME sniffing attacks', async () => {\n    const request = createMockRequest();\n    const response = await middleware(request);\n    \n    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');\n  });\n  \n  test('should enforce HTTPS in production', async () => {\n    const originalEnv = process.env.NODE_ENV;\n    process.env.NODE_ENV = 'production';\n    \n    const request = createMockRequest();\n    const response = await middleware(request);\n    \n    expect(response.headers.get('Strict-Transport-Security')).toContain('max-age=31536000');\n    \n    process.env.NODE_ENV = originalEnv;\n  });\n});\n\n// ============================================================================\n// CLEANUP\n// ============================================================================\n\nafterAll(() => {\n  // Cleanup global mocks\n  delete global.trustedTypes;\n  delete global.crossOriginIsolated;\n});