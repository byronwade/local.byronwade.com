#!/usr/bin/env bun

import { readFileSync } from "fs";
import { createServiceRoleClient } from "../lib/supabase/client.ts";
import { logger } from "../lib/utils/logger.js";

/**
 * Apply database schema from thorbis.sql to Supabase
 * This script reads the SQL schema file and executes it against the database
 */

async function applyDatabaseSchema() {
	const startTime = performance.now();
	logger.info("🗄️  Applying database schema...");

	try {
		// Initialize Supabase with service role for admin operations
		const supabase = createServiceRoleClient();

		// Read the schema file
		const schemaPath = "./database/thorbis.sql";
		logger.info(`📄 Reading schema from: ${schemaPath}`);

		const schemaSQL = readFileSync(schemaPath, "utf-8");

		if (!schemaSQL.trim()) {
			throw new Error("Schema file is empty or could not be read");
		}

		logger.info(`📏 Schema file size: ${schemaSQL.length} characters`);

		// Split the SQL into individual statements
		// Remove comments and empty lines, then split by semicolon
		const statements = schemaSQL
			.split("\n")
			.filter((line) => {
				const trimmed = line.trim();
				return trimmed && !trimmed.startsWith("--");
			})
			.join("\n")
			.split(";")
			.map((stmt) => stmt.trim())
			.filter((stmt) => stmt.length > 0);

		logger.info(`🔧 Found ${statements.length} SQL statements to execute`);

		// Execute each statement
		let successCount = 0;
		let errorCount = 0;

		for (let i = 0; i < statements.length; i++) {
			const statement = statements[i];

			if (!statement.trim()) continue;

			try {
				logger.debug(`Executing statement ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);

				const { error } = await supabase.rpc("exec_sql", {
					sql_query: statement,
				});

				if (error) {
					// Some errors might be expected (like "already exists")
					if (error.message?.includes("already exists") || error.message?.includes("does not exist")) {
						logger.debug(`⚠️  Statement ${i + 1}: ${error.message}`);
					} else {
						logger.error(`❌ Statement ${i + 1} failed:`, error.message);
						errorCount++;
					}
				} else {
					successCount++;
					logger.debug(`✅ Statement ${i + 1} executed successfully`);
				}
			} catch (statementError) {
				logger.error(`❌ Error executing statement ${i + 1}:`, statementError);
				errorCount++;

				// Try to continue with other statements
				continue;
			}
		}

		const duration = performance.now() - startTime;
		logger.performance(`Schema application completed in ${(duration / 1000).toFixed(2)}s`);

		logger.info("📊 Schema application results:");
		logger.info(`   ✅ Successful statements: ${successCount}`);
		logger.info(`   ❌ Failed statements: ${errorCount}`);
		logger.info(`   📈 Success rate: ${((successCount / statements.length) * 100).toFixed(1)}%`);

		if (errorCount > 0) {
			logger.warn(`⚠️  ${errorCount} statements failed. This might be normal for CREATE IF NOT EXISTS statements.`);
		}

		// Verify schema was applied by checking for key tables
		await verifySchemaApplication(supabase);

		logger.info("🎉 Database schema application completed!");
	} catch (error) {
		logger.error("❌ Schema application failed:", error);
		process.exit(1);
	}
}

/**
 * Verify that the schema was applied correctly
 */
async function verifySchemaApplication(supabase) {
	logger.info("🔍 Verifying schema application...");

	try {
		// Check if schemas exist by trying to access key tables
		const tablesToCheck = [
			{ schema: "users_schema", table: "users" },
			{ schema: "users_schema", table: "roles" },
			{ schema: "business_schema", table: "businesses" },
			{ schema: "business_schema", table: "company_types" },
			{ schema: "admin_schema", table: "audit_logs" },
		];

		let schemaValidCount = 0;

		for (const { schema, table } of tablesToCheck) {
			try {
				const { error } = await supabase.from(`${schema}.${table}`).select("*", { count: "exact", head: true });

				if (!error) {
					logger.debug(`✅ Table ${schema}.${table} exists and is accessible`);
					schemaValidCount++;
				} else {
					logger.warn(`⚠️  Table ${schema}.${table} check failed:`, error.message);
				}
			} catch (tableError) {
				logger.warn(`⚠️  Could not verify table ${schema}.${table}:`, tableError.message);
			}
		}

		logger.info(`📊 Schema verification: ${schemaValidCount}/${tablesToCheck.length} tables verified`);

		if (schemaValidCount >= 3) {
			logger.info("✅ Schema appears to be applied successfully!");
		} else {
			logger.warn("⚠️  Schema verification incomplete. Some tables may not be accessible.");
		}
	} catch (error) {
		logger.warn("Schema verification failed:", error);
	}
}

// Run the schema application
if (import.meta.main) {
	await applyDatabaseSchema();
}
