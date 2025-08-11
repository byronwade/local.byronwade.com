/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
	plugins: [react()],
	test: {
		// Test environment
		environment: "jsdom",
		// Global setup
		setupFiles: ["./tests/setup.ts"],

		// Include and exclude patterns
		include: ["tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}", "components/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}", "lib/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}", "hooks/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		exclude: ["node_modules", "dist", ".next", "cypress", "tests/e2e/**"],

		// Coverage configuration
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html", "lcov"],
			reportsDirectory: "./coverage",
			exclude: ["node_modules/", ".next/", "cypress/", "tests/setup.ts", "tests/utils/", "types/", "**/*.d.ts", "**/*.config.{js,ts}", "public/", ".env*"],
			thresholds: {
				global: {
					branches: 80,
					functions: 80,
					lines: 80,
					statements: 80,
				},
			},
		},

		// Globals
		globals: true,

		// Reporter configuration
		reporters: ["verbose", "json", "html"],

		// Watch mode configuration
		watch: false,

		// Timeout settings
		testTimeout: 10000,
		hookTimeout: 10000,

		// Performance settings
		maxConcurrency: 5,

		// Mock configuration
		mockReset: true,
		restoreMocks: true,

		// Environment options
		environmentOptions: {
			jsdom: {
				resources: "usable",
			},
		},
	},

        // Path resolution for imports
        resolve: {
                alias: {
                        "@": resolve(__dirname, "./src"),
                        "@components": resolve(__dirname, "./src/components"),
                        "@lib": resolve(__dirname, "./src/lib"),
                        "@hooks": resolve(__dirname, "./src/hooks"),
                        "@store": resolve(__dirname, "./src/store"),
                        "@types": resolve(__dirname, "./src/types"),
                        "@utils": resolve(__dirname, "./src/utils"),
                        "@context": resolve(__dirname, "./src/context"),
                        "@data": resolve(__dirname, "./src/data"),
                        "@config": resolve(__dirname, "./src/config"),
                        "@tests": resolve(__dirname, "./tests"),
                },
        },

	// Define global variables for tests
	define: {
		global: "globalThis",
	},
});
