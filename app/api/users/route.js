import { supabase } from "@/lib/supabaseClient";

export async function GET(request) {
	try {
		let { data, error } = await supabase.from("users").select("*");

		if (error) {
			return new Response(JSON.stringify({ error: error.message }), { status: 500 });
		}

		return new Response(JSON.stringify(data), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ error: "Fetch failed" }), { status: 500 });
	}
}
