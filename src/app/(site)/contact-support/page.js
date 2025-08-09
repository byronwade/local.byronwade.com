export const metadata = {
	title: "Contact Support – Thorbis Help",
	description: "Get help with Thorbis. Contact our support team for account, billing, technical, or general questions.",
	keywords: ["contact support", "thorbis support", "help", "billing help", "technical support"],
	openGraph: {
		title: "Contact Support – Thorbis Help",
		description: "Reach the Thorbis support team for assistance.",
		url: "https://thorbis.com/contact-support",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Contact Support – Thorbis",
		description: "Get help with Thorbis.",
	},
	alternates: { canonical: "https://thorbis.com/contact-support" },
};
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/card";
import { LifeBuoy, Mail, MessageSquare } from "lucide-react";

export default function ContactSupportPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "ContactPage",
		name: "Contact Support",
		description: "Get help with Thorbis: account, billing, technical support, or general questions",
		url: "https://thorbis.com/contact-support",
		potentialAction: {
			"@type": "ContactAction",
			target: "https://thorbis.com/contact-support",
			name: "Submit support request",
		},
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "Home", item: "https://thorbis.com/" },
				{ "@type": "ListItem", position: 2, name: "Contact Support", item: "https://thorbis.com/contact-support" },
			],
		},
	};
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-muted">
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-4xl mx-auto">
						<div className="text-center mb-16">
							<LifeBuoy className="w-16 h-16 mx-auto text-primary mb-4" />
							<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Contact Support</h1>
							<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">We&apos;re here to help. Whether you have a question about a feature or need assistance with your account, please reach out.</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
							{/* Contact Form */}
							<Card>
								<CardHeader>
									<CardTitle>Send us a Message</CardTitle>
									<CardDescription>Our team will get back to you within 24 hours.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<label htmlFor="name" className="sr-only">
											Name
										</label>
										<Input id="name" placeholder="Your Name" />
									</div>
									<div>
										<label htmlFor="email" className="sr-only">
											Email
										</label>
										<Input id="email" type="email" placeholder="Your Email" />
									</div>
									<div>
										<label htmlFor="topic" className="sr-only">
											Topic
										</label>
										<Select>
											<SelectTrigger>
												<SelectValue placeholder="Choose a Topic" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="general">General Inquiry</SelectItem>
												<SelectItem value="billing">Billing Issue</SelectItem>
												<SelectItem value="technical">Technical Support</SelectItem>
												<SelectItem value="feedback">Feedback</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div>
										<label htmlFor="message" className="sr-only">
											Message
										</label>
										<Textarea id="message" placeholder="Your Message" rows={6} />
									</div>
									<Button className="w-full">Submit</Button>
								</CardContent>
							</Card>

							{/* Other Contact Methods */}
							<div className="space-y-8">
								<Card>
									<CardHeader className="flex flex-row items-center gap-4">
										<Mail className="w-8 h-8 text-primary" />
										<div>
											<CardTitle>Email Us</CardTitle>
											<p className="text-muted-foreground">For non-urgent inquiries.</p>
										</div>
									</CardHeader>
									<CardContent>
										<a href="mailto:support@thorbis.com" className="font-semibold text-primary">
											support@thorbis.com
										</a>
									</CardContent>
								</Card>
								<Card>
									<CardHeader className="flex flex-row items-center gap-4">
										<MessageSquare className="w-8 h-8 text-primary" />
										<div>
											<CardTitle>Live Chat</CardTitle>
											<p className="text-muted-foreground">Available 9am-5pm CT, Mon-Fri.</p>
										</div>
									</CardHeader>
									<CardContent>
										<Button disabled>Chat Coming Soon</Button>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
