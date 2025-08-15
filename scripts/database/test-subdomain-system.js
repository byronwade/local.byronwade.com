#!/usr/bin/env node

/**
 * Simple Subdomain System Test Script
 * Tests the core functionality without requiring complex test frameworks
 */

const https = require("https");
const http = require("http");

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const TEST_SUBDOMAINS = ["santacruz", "raleigh", "portland", "austin", "denver"];

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

// Simple HTTP request helper
function makeRequest(url, options = {}) {
	return new Promise((resolve, reject) => {
		const protocol = url.startsWith("https") ? https : http;
		const req = protocol.request(url, options, (res) => {
			let data = "";
			res.on("data", (chunk) => (data += chunk));
			res.on("end", () => {
				try {
					const parsedData = data ? JSON.parse(data) : {};
					resolve({ status: res.statusCode, data: parsedData, headers: res.headers });
				} catch (e) {
					resolve({ status: res.statusCode, data: data, headers: res.headers });
				}
			});
		});

		req.on("error", reject);
		req.setTimeout(10000, () => {
			req.destroy();
			reject(new Error("Request timeout"));
		});

		if (options.body) {
			req.write(options.body);
		}

		req.end();
	});
}

// Test functions
async function testApiEndpoints() {
	log(colors.bold, "\n🔌 Testing API Endpoints...");

	try {
		// Test main subdomains list endpoint
		info("Testing GET /api/v2/subdomains");
		const response = await makeRequest(`${BASE_URL}/api/v2/subdomains`);

		if (response.status === 200 && response.data.success) {
			success("Subdomains API endpoint is working");
			info(`Found ${response.data.data?.subdomains?.length || 0} subdomains`);
		} else {
			warning(`Subdomains API returned status ${response.status}`);
		}
	} catch (err) {
		error(`API test failed: ${err.message}`);
	}

	// Test individual subdomain endpoints
	for (const subdomain of TEST_SUBDOMAINS) {
		try {
			info(`Testing GET /api/v2/subdomains/${subdomain}`);
			const response = await makeRequest(`${BASE_URL}/api/v2/subdomains/${subdomain}`);

			if (response.status === 200 && response.data.success) {
				success(`Subdomain ${subdomain} API is working`);
			} else if (response.status === 404) {
				warning(`Subdomain ${subdomain} not found (may need seeding)`);
			} else {
				warning(`Subdomain ${subdomain} API returned status ${response.status}`);
			}
		} catch (err) {
			error(`Subdomain ${subdomain} API test failed: ${err.message}`);
		}
	}

	// Test businesses endpoint for each subdomain
	for (const subdomain of TEST_SUBDOMAINS) {
		try {
			info(`Testing GET /api/v2/subdomains/${subdomain}/businesses`);
			const response = await makeRequest(`${BASE_URL}/api/v2/subdomains/${subdomain}/businesses`);

			if (response.status === 200 && response.data.success) {
				const businessCount = response.data.data?.businesses?.length || 0;
				success(`Subdomain ${subdomain} businesses API working (${businessCount} businesses)`);
			} else if (response.status === 404) {
				warning(`Subdomain ${subdomain} businesses not found`);
			} else {
				warning(`Subdomain ${subdomain} businesses API returned status ${response.status}`);
			}
		} catch (err) {
			error(`Subdomain ${subdomain} businesses API test failed: ${err.message}`);
		}
	}
}

async function testDynamicRoutes() {
	log(colors.bold, "\n🛣️  Testing Dynamic Routes...");

	for (const subdomain of TEST_SUBDOMAINS) {
		try {
			info(`Testing route /${subdomain}`);
			const response = await makeRequest(`${BASE_URL}/${subdomain}`);

			if (response.status === 200) {
				success(`Dynamic route /${subdomain} is working`);
			} else if (response.status === 404) {
				warning(`Dynamic route /${subdomain} not found`);
			} else {
				warning(`Dynamic route /${subdomain} returned status ${response.status}`);
			}
		} catch (err) {
			error(`Dynamic route /${subdomain} test failed: ${err.message}`);
		}

		// Test businesses page
		try {
			info(`Testing route /${subdomain}/businesses`);
			const response = await makeRequest(`${BASE_URL}/${subdomain}/businesses`);

			if (response.status === 200) {
				success(`Businesses route /${subdomain}/businesses is working`);
			} else {
				warning(`Businesses route /${subdomain}/businesses returned status ${response.status}`);
			}
		} catch (err) {
			error(`Businesses route /${subdomain}/businesses test failed: ${err.message}`);
		}

		// Test search page
		try {
			info(`Testing route /${subdomain}/search`);
			const response = await makeRequest(`${BASE_URL}/${subdomain}/search`);

			if (response.status === 200) {
				success(`Search route /${subdomain}/search is working`);
			} else {
				warning(`Search route /${subdomain}/search returned status ${response.status}`);
			}
		} catch (err) {
			error(`Search route /${subdomain}/search test failed: ${err.message}`);
		}
	}
}

async function testDashboardIntegration() {
	log(colors.bold, "\n📊 Testing Dashboard Integration...");

	try {
		info("Testing /dashboard/localhub/domains");
		const response = await makeRequest(`${BASE_URL}/dashboard/localhub/domains`);

		if (response.status === 200) {
			success("Dashboard domains page is accessible");
		} else if ([301, 302, 307, 308].includes(response.status)) {
			success("Dashboard domains page redirects correctly (likely to auth)");
		} else if ([401, 403].includes(response.status)) {
			success("Dashboard domains page properly protects with auth");
		} else {
			warning(`Dashboard domains page returned status ${response.status}`);
		}
	} catch (err) {
		error(`Dashboard test failed: ${err.message}`);
	}
}

async function testErrorHandling() {
	log(colors.bold, "\n🚨 Testing Error Handling...");

	try {
		info("Testing non-existent subdomain");
		const response = await makeRequest(`${BASE_URL}/nonexistent-subdomain-test`);

		if (response.status === 404) {
			success("Non-existent subdomain properly returns 404");
		} else {
			warning(`Non-existent subdomain returned status ${response.status}`);
		}
	} catch (err) {
		error(`Error handling test failed: ${err.message}`);
	}

	try {
		info("Testing invalid API subdomain");
		const response = await makeRequest(`${BASE_URL}/api/v2/subdomains/invalid-subdomain-name`);

		if ([400, 404].includes(response.status)) {
			success("Invalid API subdomain properly returns error");
		} else {
			warning(`Invalid API subdomain returned status ${response.status}`);
		}
	} catch (err) {
		error(`Invalid API test failed: ${err.message}`);
	}
}

async function testSubdomainValidation() {
	log(colors.bold, "\n✅ Testing Subdomain Validation...");

	try {
		info("Testing subdomain availability check");
		const response = await makeRequest(`${BASE_URL}/api/v2/subdomains/check-availability?subdomain=test-availability`);

		if ([200, 400, 401].includes(response.status)) {
			success("Subdomain availability check endpoint exists");
		} else {
			warning(`Availability check returned status ${response.status}`);
		}
	} catch (err) {
		error(`Availability check test failed: ${err.message}`);
	}
}

async function generateReport() {
	log(colors.bold, "\n📋 Test Summary Report");
	log(colors.bold, "===================");

	const startTime = Date.now();

	await testApiEndpoints();
	await testDynamicRoutes();
	await testDashboardIntegration();
	await testErrorHandling();
	await testSubdomainValidation();

	const endTime = Date.now();
	const duration = ((endTime - startTime) / 1000).toFixed(2);

	log(colors.bold, `\n⏱️  Tests completed in ${duration} seconds`);

	log(colors.bold, "\n🎯 Next Steps:");
	console.log("1. If any APIs failed, run: bun run seed:database");
	console.log("2. If routes failed, check Next.js app is running: bun run dev");
	console.log("3. For production: Configure DNS for *.localhub.com");
	console.log("4. Test subdomain creation in dashboard UI");

	log(colors.bold, "\n📚 Available URLs to Test:");
	console.log(`• Dashboard: ${BASE_URL}/dashboard/localhub/domains`);
	for (const subdomain of TEST_SUBDOMAINS) {
		console.log(`• ${subdomain}: ${BASE_URL}/${subdomain}`);
	}
}

// Main execution
async function main() {
	log(colors.bold, "🚀 Starting Subdomain System Tests...");
	log(colors.blue, `Testing against: ${BASE_URL}`);

	await generateReport();

	log(colors.green, "\n✨ Subdomain system testing complete!");
}

// Handle interruption gracefully
process.on("SIGINT", () => {
	log(colors.yellow, "\n⚠️  Tests interrupted by user");
	process.exit(0);
});

// Run if called directly
if (require.main === module) {
	main().catch((error) => {
		error(`Fatal error: ${error.message}`);
		process.exit(1);
	});
}

module.exports = { main, testApiEndpoints, testDynamicRoutes };
