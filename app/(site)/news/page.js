// app/send-test-email/page.js
"use client";

import { useState } from "react";

const SendTestEmail = () => {
	const [emailType, setEmailType] = useState("welcome");
	const [to, setTo] = useState("");
	const [subject, setSubject] = useState("");
	const [firstName, setFirstName] = useState("");
	const [url, setUrl] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		const response = await fetch("/api/send", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ emailType, to, subject, firstName, url }),
		});

		if (response.ok) {
			const data = await response.json();
			console.log(data);
		} else {
			const error = await response.json();
			console.error("Error sending email:", error);
		}
	};

	return (
		<div>
			<h1>Send Test Email</h1>
			<form onSubmit={handleSubmit}>
				<label>
					Email Type:
					<select value={emailType} onChange={(e) => setEmailType(e.target.value)}>
						<option value="welcome">Welcome</option>
						<option value="passwordReset">Password Reset</option>
						<option value="accountActivation">Account Activation</option>
						<option value="newJobNotification">New Job Notification</option>
						<option value="jobCompletion">Job Completion</option>
						<option value="accountDeactivationWarning">Account Deactivation Warning</option>
						<option value="subscriptionRenewalReminder">Subscription Renewal Reminder</option>
					</select>
				</label>
				<br />
				<label>
					To:
					<input type="email" value={to} onChange={(e) => setTo(e.target.value)} required />
				</label>
				<br />
				<label>
					Subject:
					<input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
				</label>
				<br />
				<label>
					First Name:
					<input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
				</label>
				<br />
				<label>
					URL:
					<input type="text" value={url} onChange={(e) => setUrl(e.target.value)} required />
				</label>
				<br />
				<button type="submit">Send Test Email</button>
			</form>
		</div>
	);
};

export default SendTestEmail;
