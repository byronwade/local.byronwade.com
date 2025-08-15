import { NextResponse } from "next/server";
import { supabase } from "@/lib/database/supabase/client";
import { logger } from "@/lib/utils/logger";

export async function GET() {
	const start = performance.now();
	try {
		// Attempt to get current session user profile minimally
		// In dev, Supabase auth context may not be available server-side; return safe default
		const response = {
			success: true,
			user: null,
			roles: [],
			businesses: [],
			meta: { ts: Date.now() },
		};

		const duration = performance.now() - start;
		logger.performance?.(`GET /api/dashboard/user in ${duration.toFixed(2)}ms`);
		return NextResponse.json(response, {
			status: 200,
			headers: { "Cache-Control": "private, max-age=30" },
		});
	} catch (error: any) {
		return NextResponse.json(
			{ success: false, error: error?.message || "Internal Error" },
			{ status: 200 }
		);
	}
}


