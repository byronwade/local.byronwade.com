// app/api/send/route.js
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { renderEmail } from "@utils/render-email";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req) {
	const { emailType, to, subject, firstName, url } = await req.json();

	if (!resendApiKey) {
		console.warn("RESEND_API_KEY not configured - email functionality disabled");
		return NextResponse.json({ message: "Email service not configured" }, { status: 503 });
	}

	try {
		const emailHTML = await renderEmail(emailType, { firstName, url });

		const emailProps = {
			from: "Thorbis <noreply@thorbis.com>",
			to: [to],
			subject,
			html: emailHTML,
		};

		const { data, error } = await resend.emails.send(emailProps);
		if (error) {
			console.error("Error data:", data);
			console.error("Error:", error);
			throw new Error(JSON.stringify(error));
		}
		return NextResponse.json({ message: "Email sent successfully", data }, { status: 200 });
	} catch (error) {
		console.error("Error sending email:", error);
		return NextResponse.json({ message: "Error sending email", error: error.message }, { status: 400 });
	}
}
