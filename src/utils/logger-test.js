/**
 * Logger Test Utility
 * Validates logger functionality and exports
 */

import { logger } from "./logger.js";

export function validateLogger() {
	console.log("🧪 Testing logger functionality...");

	// Check if logger exists
	if (!logger) {
		console.error("❌ Logger is null or undefined");
		return false;
	}

	// Check if logger is an object
	if (typeof logger !== "object") {
		console.error("❌ Logger is not an object, type:", typeof logger);
		return false;
	}

	// Check required methods
	const requiredMethods = ["info", "warn", "error", "debug", "performance", "interaction", "analytics"];
	const missingMethods = [];

	requiredMethods.forEach((method) => {
		if (typeof logger[method] !== "function") {
			missingMethods.push(method);
		}
	});

	if (missingMethods.length > 0) {
		console.error("❌ Logger missing methods:", missingMethods);
		console.log(
			"Available methods:",
			Object.keys(logger).filter((key) => typeof logger[key] === "function")
		);
		return false;
	}

	// Test interaction method specifically
	try {
		logger.interaction({
			type: "test",
			message: "Logger validation test",
			timestamp: Date.now(),
		});
		console.log("✅ Logger.interaction test successful");
	} catch (error) {
		console.error("❌ Logger.interaction test failed:", error);
		return false;
	}

	console.log("✅ Logger validation complete - all tests passed");
	return true;
}

// Auto-run validation in development
if (process.env.NODE_ENV === "development") {
	validateLogger();
}
