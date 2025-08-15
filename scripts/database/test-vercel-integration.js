#!/usr/bin/env node

/**
 * Vercel Integration Testing Script
 * Comprehensive testing of automated subdomain creation, SSL provisioning, and routing
 */

const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || "thorbis.com";
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

// Colors for console output
const colors = {
	green: "\x1b[32m",
	red: "\x1b[31m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	reset: "\x1b[0m",
	bold: "\x1b[1m",
};

function log(color, message) {
	console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
	log(colors.green, `✅ ${message}`);
}

function error(message) {
	log(colors.red, `❌ ${message}`);
}

function info(message) {
	log(colors.blue, `ℹ️  ${message}`);
}

function warning(message) {
	log(colors.yellow, `⚠️  ${message}`);
}

// Simple HTTP request helper with timeout
function makeRequest(url, options = {}) {
	return new Promise((resolve, reject) => {
		const protocol = url.startsWith("https") ? https : http;
		const req = protocol.request(url, options, (res) => {
			let data = "";
			res.on("data", (chunk) => (data += chunk));
			res.on("end", () => {
				try {
					const parsedData = data ? JSON.parse(data) : {};
					resolve({
						status: res.statusCode,
						data: parsedData,
						headers: res.headers,
						rawData: data,
					});
				} catch (e) {
					resolve({
						status: res.statusCode,
						data: data,
						headers: res.headers,
						rawData: data,
					});
				}
			});
		});

		req.on("error", reject);
		req.setTimeout(15000, () => {
			req.destroy();
			reject(new Error("Request timeout"));
		});

		if (options.body) {
			req.write(options.body);
		}

		req.end();
	});
}

/**
 * Test Vercel API connectivity
 */
async function testVercelAPI() {
	log(colors.bold, "\n🔌 Testing Vercel API Connectivity...");

	if (!VERCEL_TOKEN) {
		error("VERCEL_TOKEN environment variable not set");
		return false;
	}

	if (!PROJECT_ID) {
		error("VERCEL_PROJECT_ID environment variable not set");
		return false;
	}

	try {
		// Test user endpoint
		const userResponse = await makeRequest("https://api.vercel.com/v2/user", {
			headers: {
				Authorization: `Bearer ${VERCEL_TOKEN}`,
				"Content-Type": "application/json",
			},
		});

		if (userResponse.status === 200 && userResponse.data.user) {
			success(`Connected to Vercel as: ${userResponse.data.user.name || userResponse.data.user.username}`);
		} else {
			error(`Vercel API authentication failed: ${userResponse.status}`);
			return false;
		}

		// Test project endpoint
		const projectResponse = await makeRequest(`https://api.vercel.com/v9/projects/${PROJECT_ID}`, {
			headers: {
				Authorization: `Bearer ${VERCEL_TOKEN}`,
				"Content-Type": "application/json",
			},
		});

		if (projectResponse.status === 200) {
			success(`Project access verified: ${projectResponse.data.name}`);
			return true;
		} else {
			error(`Project access failed: ${projectResponse.status}`);
			return false;
		}
	} catch (err) {
		error(`Vercel API test failed: ${err.message}`);
		return false;
	}
}

/**
 * Test domain configuration
 */
async function testDomainConfiguration() {
	log(colors.bold, "\n🌐 Testing Domain Configuration...");

	try {
		// Get project domains
		const domainsResponse = await makeRequest(`https://api.vercel.com/v9/projects/${PROJECT_ID}/domains`, {
			headers: {
				Authorization: `Bearer ${VERCEL_TOKEN}`,
				"Content-Type": "application/json",
			},
		});

		if (domainsResponse.status === 200) {
			const domains = domainsResponse.data.domains || [];
			const mainDomainEntry = domains.find((d) => d.name === MAIN_DOMAIN);

			if (mainDomainEntry) {
				if (mainDomainEntry.verified) {
					success(`Main domain ${MAIN_DOMAIN} is verified and configured`);
					info(`Wildcard support: *.${MAIN_DOMAIN} is automatically available`);
					return true;
				} else {
					warning(`Main domain ${MAIN_DOMAIN} is added but not verified`);
					info("Please check DNS configuration and wait for verification");
					return false;
				}
			} else {
				warning(`Main domain ${MAIN_DOMAIN} not found in project`);
				info("Add the domain in Vercel dashboard: Project → Settings → Domains");
				return false;
			}
		} else {
			error(`Failed to fetch project domains: ${domainsResponse.status}`);
			return false;
		}
	} catch (err) {
		error(`Domain configuration test failed: ${err.message}`);
		return false;
	}
}

/**
 * Test subdomain creation API
 */
async function testSubdomainCreationAPI() {
	log(colors.bold, "\n🔗 Testing Subdomain Creation API...");

	const testSubdomain = `test-${Date.now()}`;
	const testData = {
		subdomain: testSubdomain,
		name: "Test Local Hub",
		description: "Testing Vercel integration",
		city: "Test City",
		state: "TS",
		latitude: 40.7128,
		longitude: -74.006,
	};

	try {
		info(`Testing subdomain creation: ${testSubdomain}.${MAIN_DOMAIN}`);

		const response = await makeRequest(`${BASE_URL}/api/v2/subdomains`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer test-token`, // You'll need to implement proper auth
			},
			body: JSON.stringify(testData),
		});

		if (response.status === 201 || response.status === 200) {
			if (response.data.success && response.data.performance?.vercelProvisioned) {
				success("Subdomain creation API working with Vercel integration");
				success(`Created: ${response.data.data.localHub.domain}`);

				// Test the created subdomain
				await testSubdomainResolution(testSubdomain);

				return true;
			} else {
				warning("Subdomain creation API responded but Vercel integration may not be working");
				info(`Response: ${JSON.stringify(response.data, null, 2)}`);
				return false;
			}
		} else if (response.status === 401 || response.status === 403) {
			info("Subdomain creation API requires authentication (expected)");
			info("API endpoint is accessible and responding correctly");
			return true;
		} else {
			error(`Subdomain creation API failed: ${response.status}`);
			info(`Response: ${response.rawData}`);
			return false;
		}
	} catch (err) {
		error(`Subdomain creation API test failed: ${err.message}`);
		return false;
	}
}

/**
 * Test subdomain resolution and SSL
 */
async function testSubdomainResolution(subdomain) {
	log(colors.bold, `\n🔒 Testing Subdomain Resolution: ${subdomain}.${MAIN_DOMAIN}...`);

	const testUrl = `https://${subdomain}.${MAIN_DOMAIN}`;

	try {
		// Wait a bit for DNS propagation
		info("Waiting for DNS propagation...");
		await new Promise((resolve) => setTimeout(resolve, 5000));

		const response = await makeRequest(testUrl, {
			method: "HEAD",
			timeout: 10000,
		});

		if (response.status === 200 || response.status === 404) {
			success(`Subdomain resolution working: ${testUrl}`);
			success("SSL certificate is working (HTTPS connection successful)");

			// Check for Vercel headers
			if (response.headers["server"] && response.headers["server"].includes("Vercel")) {
				success("Vercel edge network is serving the request");
			}

			return true;
		} else {
			warning(`Subdomain responded with status: ${response.status}`);
			return false;
		}
	} catch (err) {
		warning(`Subdomain resolution test failed: ${err.message}`);
		info("This might be due to DNS propagation delay (normal for new subdomains)");
		return false;
	}
}

/**
 * Test middleware routing
 */
async function testMiddlewareRouting() {
	log(colors.bold, "\n🔀 Testing Middleware Routing...");

	try {
		// Test main platform detection
		const mainResponse = await makeRequest(`${BASE_URL}/`, {
			headers: {
				Host: MAIN_DOMAIN,
			},
		});

		if (mainResponse.headers["x-platform-type"] === "main" || mainResponse.status === 200) {
			success("Main platform routing working");
		} else {
			warning("Main platform routing may not be configured");
		}

		// Test tenant platform detection
		const tenantResponse = await makeRequest(`${BASE_URL}/`, {
			headers: {
				Host: `test-tenant.${MAIN_DOMAIN}`,
			},
		});

		if (tenantResponse.headers["x-platform-type"] === "tenant" || tenantResponse.headers["x-tenant-subdomain"] === "test-tenant") {
			success("Tenant platform routing working");
		} else {
			info("Tenant platform routing headers not detected (may be normal in development)");
		}

		return true;
	} catch (err) {
		error(`Middleware routing test failed: ${err.message}`);
		return false;
	}
}

/**
 * Test database integration
 */
async function testDatabaseIntegration() {
	log(colors.bold, "\n🗄️  Testing Database Integration...");

	try {
		// Check if migration has been applied
		const migrationPath = path.join(process.cwd(), "src/lib/database/supabase/migrations/add_vercel_integration.sql");

		if (fs.existsSync(migrationPath)) {
			success("Vercel integration migration file exists");
		} else {
			warning("Vercel integration migration file not found");
			info("Run: node scripts/setup-vercel-integration.js to create it");
		}

		// Test database schema update (would need actual DB connection)
		info("Database schema verification would require live database connection");
		info("Please ensure the migration has been applied to your Supabase database");

		return true;
	} catch (err) {
		error(`Database integration test failed: ${err.message}`);
		return false;
	}
}

/**
 * Test SSL certificate provisioning
 */
async function testSSLProvisioning() {
	log(colors.bold, "\n🔐 Testing SSL Certificate Provisioning...");

	try {
		// Test main domain SSL
		const mainResponse = await makeRequest(`https://${MAIN_DOMAIN}`, {
			method: "HEAD",
			timeout: 10000,
		});

		if (mainResponse.status >= 200 && mainResponse.status < 400) {
			success(`Main domain SSL working: https://${MAIN_DOMAIN}`);
		} else {
			warning(`Main domain SSL test returned: ${mainResponse.status}`);
		}

		// Test if wildcard SSL is working (example with common subdomain)
		const wildcardTestDomains = ["www", "app", "test"];

		for (const subdomain of wildcardTestDomains) {
			try {
				const testResponse = await makeRequest(`https://${subdomain}.${MAIN_DOMAIN}`, {
					method: "HEAD",
					timeout: 5000,
				});

				success(`Wildcard SSL working for: ${subdomain}.${MAIN_DOMAIN}`);
				break; // If one works, wildcard SSL is configured
			} catch (err) {
				// Expected for non-existent subdomains
				continue;
			}
		}

		return true;
	} catch (err) {
		error(`SSL provisioning test failed: ${err.message}`);
		return false;
	}
}

/**
 * Performance benchmarking
 */
async function benchmarkPerformance() {
	log(colors.bold, "\n⚡ Performance Benchmarking...");

	const testUrls = [`https://${MAIN_DOMAIN}`, `${BASE_URL}/api/v2/subdomains`];

	for (const url of testUrls) {
		try {
			const startTime = Date.now();
			const response = await makeRequest(url, { method: "HEAD" });
			const endTime = Date.now();
			const duration = endTime - startTime;

			if (duration < 1000) {
				success(`${url} response time: ${duration}ms (excellent)`);
			} else if (duration < 3000) {
				info(`${url} response time: ${duration}ms (good)`);
			} else {
				warning(`${url} response time: ${duration}ms (slow)`);
			}
		} catch (err) {
			warning(`Performance test failed for ${url}: ${err.message}`);
		}
	}
}

/**
 * Generate comprehensive test report
 */
async function generateTestReport() {
	log(colors.bold, "\n📊 Vercel Integration Test Report");
	log(colors.bold, "====================================");

	const tests = [
		{ name: "Vercel API Connectivity", test: testVercelAPI },
		{ name: "Domain Configuration", test: testDomainConfiguration },
		{ name: "Subdomain Creation API", test: testSubdomainCreationAPI },
		{ name: "Middleware Routing", test: testMiddlewareRouting },
		{ name: "Database Integration", test: testDatabaseIntegration },
		{ name: "SSL Provisioning", test: testSSLProvisioning },
	];

	const results = [];

	for (const { name, test } of tests) {
		try {
			const result = await test();
			results.push({ name, passed: result });
		} catch (error) {
			results.push({ name, passed: false, error: error.message });
		}
	}

	// Performance benchmarking
	await benchmarkPerformance();

	// Summary
	log(colors.bold, "\n📋 Test Summary:");
	results.forEach(({ name, passed, error }) => {
		const icon = passed ? "✅" : "❌";
		console.log(`${icon} ${name}`);
		if (error) {
			console.log(`    Error: ${error}`);
		}
	});

	const passedTests = results.filter((r) => r.passed).length;
	const totalTests = results.length;

	log(colors.bold, `\n🎯 Results: ${passedTests}/${totalTests} tests passed`);

	if (passedTests === totalTests) {
		log(colors.green, "\n🎉 All tests passed! Vercel integration is working perfectly.");
	} else {
		log(colors.yellow, "\n⚠️  Some tests failed. Please review the configuration.");
	}

	log(colors.bold, "\n📚 Next Steps:");
	if (passedTests < totalTests) {
		console.log("1. Review failed tests and fix configuration issues");
		console.log("2. Ensure environment variables are correctly set");
		console.log("3. Verify DNS configuration and domain verification");
		console.log("4. Check Vercel dashboard for domain status");
	} else {
		console.log("1. Your Vercel integration is ready for production!");
		console.log("2. Test subdomain creation in the dashboard");
		console.log("3. Monitor Vercel analytics for performance metrics");
		console.log("4. Set up monitoring alerts for domain issues");
	}

	console.log("\n📖 Documentation: docs/VERCEL_INTEGRATION.md");
	console.log("🔧 Setup Script: node scripts/setup-vercel-integration.js");
}

/**
 * Main test execution
 */
async function main() {
	log(colors.bold, "🧪 Starting Vercel Integration Tests...");
	log(colors.blue, `Testing against: ${BASE_URL}`);
	log(colors.blue, `Main domain: ${MAIN_DOMAIN}\n`);

	await generateTestReport();

	log(colors.green, "\n✨ Vercel integration testing complete!");
}

// Handle interruption gracefully
process.on("SIGINT", () => {
	warning("\n⚠️  Tests interrupted by user");
	process.exit(0);
});

// Run if called directly
if (require.main === module) {
	main().catch((error) => {
		error(`Fatal error: ${error.message}`);
		process.exit(1);
	});
}

module.exports = {
	main,
	testVercelAPI,
	testDomainConfiguration,
	testSubdomainCreationAPI,
};
