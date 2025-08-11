/*
 * Dynamic Open Graph image (high-reward social CTR) rendered at the edge.
 * Accepts ?title=&description=&bg= params. Cached by default via Next image route.
 */
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const title = (searchParams.get("title") || "Thorbis").slice(0, 100);
	const description = (searchParams.get("description") || "Discover local businesses, events and services.").slice(0, 200);
	const bg = searchParams.get("bg") || "#0B1220";

	return new ImageResponse(
		(
			<div
				style={{
					width: size.width,
					height: size.height,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					padding: 64,
					background: bg,
					color: "#fff",
					fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
					<img src="https://thorbis.com/logos/ThorbisLogo.webp" width={64} height={64} style={{ borderRadius: 12 }} />
					<span style={{ opacity: 0.9 }}>thorbis.com</span>
				</div>
				<h1 style={{ fontSize: 64, lineHeight: 1.1, margin: 0 }}>{title}</h1>
				<p style={{ fontSize: 28, marginTop: 16, opacity: 0.9 }}>{description}</p>
			</div>
		),
		{ ...size }
	);
}
