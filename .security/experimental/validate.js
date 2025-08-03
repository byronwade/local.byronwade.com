#!/usr/bin/env node

/**
 * 🔬 EXPERIMENTAL SECURITY VALIDATION SCRIPT
 * Quick Error Detection & Health Check (2024-2025)
 *
 * Run this script to quickly validate your experimental security implementation
 * and detect any errors or configuration issues.
 *
 * Usage:
 *   node .security/experimental/validate.js
 *   npm run security:validate
 *
 * @version 1.0.0-experimental
 */

import { validateExperimentalSecurity, startSecurityMonitoring } from "./validation-suite.js";
import { logger } from "@/lib/utils/logger";

// ============================================================================
// MAIN VALIDATION RUNNER
// ============================================================================

async function runValidation() {
	console.log("🔬 EXPERIMENTAL SECURITY VALIDATION");
	console.log("=====================================\n");

	try {
		// Run comprehensive validation
		const report = await validateExperimentalSecurity();

		// Display results summary
		displaySummary(report);

		// Show detailed issues if any
		if (report.summary.failed > 0 || report.summary.criticalIssues > 0) {
			displayDetailedIssues(report);
		}

		// Show recommendations
		if (report.recommendations.length > 0) {
			displayRecommendations(report);
		}

		// Start monitoring if requested
		if (process.argv.includes("--monitor")) {
			console.log("\n🔍 Starting real-time monitoring...");
			startSecurityMonitoring();
			console.log("   Real-time monitoring active. Press Ctrl+C to stop.\n");

			// Keep process alive for monitoring
			process.on("SIGINT", () => {
				console.log("\n✅ Monitoring stopped. Goodbye!");
				process.exit(0);
			});
		} else {
			// Exit with appropriate code
			const exitCode = report.summary.criticalIssues > 0 ? 1 : 0;
			process.exit(exitCode);
		}
	} catch (error) {
		console.error("❌ Validation failed:", error.message);
		console.error("\nThis indicates a critical issue with the security implementation.");
		console.error("Please check the error details above and fix before deploying.\n");
		process.exit(1);
	}
}

// ============================================================================
// DISPLAY FUNCTIONS
// ============================================================================

function displaySummary(report) {
	console.log("📊 VALIDATION SUMMARY");
	console.log("---------------------");

	const { summary } = report;

	// Overall status
	const status = summary.criticalIssues > 0 ? "❌ CRITICAL ISSUES" : summary.failed > 0 ? "⚠️  ISSUES FOUND" : summary.warnings > 0 ? "✅ PASSED (with warnings)" : "✅ ALL PASSED";

	console.log(`Status: ${status}`);
	console.log(`Tests: ${summary.passed}/${summary.totalTests} passed`);

	if (summary.failed > 0) {
		console.log(`❌ Failed: ${summary.failed}`);
	}

	if (summary.warnings > 0) {
		console.log(`⚠️  Warnings: ${summary.warnings}`);
	}

	if (summary.criticalIssues > 0) {
		console.log(`🚨 Critical Issues: ${summary.criticalIssues}`);
	}

	console.log(`Environment: ${report.environment}`);
	console.log(`Browser: ${report.browser.name} ${report.browser.version}`);
	console.log(`Validation Time: ${report.performance.totalValidationTime.toFixed(2)}ms`);
	console.log("");
}

function displayDetailedIssues(report) {
	console.log("🔍 DETAILED ISSUES");
	console.log("------------------");

	Object.entries(report.results).forEach(([categoryName, category]) => {
		const failedTests = category.tests.filter((test) => test.status === "failed");

		if (failedTests.length > 0) {
			console.log(`\n${categoryName.toUpperCase()}:`);

			failedTests.forEach((test) => {
				const icon = test.critical ? "🚨" : "❌";
				console.log(`  ${icon} ${test.name}: ${test.error || "Failed"}`);

				if (test.details) {
					Object.entries(test.details).forEach(([key, value]) => {
						console.log(`     ${key}: ${value}`);
					});
				}
			});
		}
	});

	console.log("");
}

function displayRecommendations(report) {
	console.log("💡 RECOMMENDATIONS");
	console.log("------------------");

	report.recommendations.forEach((rec) => {
		const icon = rec.priority === "high" ? "🚨" : rec.priority === "medium" ? "⚠️" : rec.priority === "low" ? "💡" : "✅";

		console.log(`${icon} ${rec.message}`);
	});

	console.log("");
}

// ============================================================================
// QUICK HEALTH CHECK FUNCTION
// ============================================================================

function quickHealthCheck() {
	console.log("⚡ QUICK HEALTH CHECK");
	console.log("====================\n");

	const checks = [
		{
			name: "Node.js Environment",
			check: () => typeof process !== "undefined",
			fix: "Run this script in a Node.js environment",
		},
		{
			name: "ES Modules Support",
			check: () => true, // If we got here, ES modules work
			fix: "Use Node.js 14+ or enable ES modules",
		},
		{
			name: "Security Files Present",
			check: () => {
				const fs = require("fs");
				return fs.existsSync(".security/experimental/trusted-types.js") && fs.existsSync(".security/experimental/security-analytics.js");
			},
			fix: "Ensure all experimental security files are present",
		},
	];

	let allPassed = true;

	checks.forEach((check) => {
		try {
			const passed = check.check();
			console.log(`${passed ? "✅" : "❌"} ${check.name}`);

			if (!passed) {
				console.log(`   Fix: ${check.fix}`);
				allPassed = false;
			}
		} catch (error) {
			console.log(`❌ ${check.name} - Error: ${error.message}`);
			console.log(`   Fix: ${check.fix}`);
			allPassed = false;
		}
	});

	console.log(`\nOverall: ${allPassed ? "✅ Ready for full validation" : "❌ Fix issues above first"}\n`);

	return allPassed;
}

// ============================================================================
// CLI ARGUMENT HANDLING
// ============================================================================

function showHelp() {
	console.log("🔬 EXPERIMENTAL SECURITY VALIDATION TOOL");
	console.log("=========================================\n");
	console.log("Usage:");
	console.log("  node .security/experimental/validate.js [options]\n");
	console.log("Options:");
	console.log("  --help, -h        Show this help message");
	console.log("  --quick, -q       Run quick health check only");
	console.log("  --monitor, -m     Start real-time monitoring after validation");
	console.log("  --verbose, -v     Show verbose output");
	console.log("  --json            Output results in JSON format\n");
	console.log("Examples:");
	console.log("  node .security/experimental/validate.js");
	console.log("  node .security/experimental/validate.js --quick");
	console.log("  node .security/experimental/validate.js --monitor");
	console.log("  npm run security:validate\n");
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
	const args = process.argv.slice(2);

	// Handle help
	if (args.includes("--help") || args.includes("-h")) {
		showHelp();
		return;
	}

	// Handle quick check
	if (args.includes("--quick") || args.includes("-q")) {
		const healthy = quickHealthCheck();
		process.exit(healthy ? 0 : 1);
		return;
	}

	// Handle verbose mode
	if (args.includes("--verbose") || args.includes("-v")) {
		// Enable verbose logging
		process.env.LOG_LEVEL = "debug";
	}

	// Run validation
	await runValidation();
}

// Error handling for the script itself
process.on("uncaughtException", (error) => {
	console.error("💥 CRITICAL ERROR in validation script:");
	console.error(error.message);
	console.error("\nThis indicates a problem with the validation script itself.");
	console.error("Please check the implementation and try again.\n");
	process.exit(1);
});

process.on("unhandledRejection", (reason) => {
	console.error("💥 UNHANDLED PROMISE REJECTION in validation script:");
	console.error(reason);
	console.error("\nThis indicates a problem with async operations.");
	console.error("Please check the implementation and try again.\n");
	process.exit(1);
});

// Run main function
main().catch((error) => {
	console.error("💥 VALIDATION SCRIPT FAILED:");
	console.error(error.message);
	process.exit(1);
});
