import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 600 };
export const contentType = "image/png";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const title = (searchParams.get("title") || "Thorbis").slice(0, 100);

	return new ImageResponse(
		(
			<div
				style={{
					width: size.width,
					height: size.height,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "#0B1220",
					color: "#fff",
					fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial",
				}}
			>
				<div style={{ textAlign: "center", padding: 48 }}>
					<img src="https://thorbis.com/logos/ThorbisLogo.webp" width={72} height={72} />
					<h1 style={{ fontSize: 56, marginTop: 16 }}>{title}</h1>
				</div>
			</div>
		),
		{ ...size }
	);
}
