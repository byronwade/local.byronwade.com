import React from "react";
import Image from "next/image";

export function AboutUs() {
	return (
		<section id="about" className="py-4">
			<div className="mb-6">
				<h2 className="mb-2 text-3xl font-bold md:text-4xl">About Us</h2>
				<p className="text-lg text-muted-foreground">Discover who we are and what we stand for.</p>
			</div>
			<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				<div className="p-6 rounded-lg shadow bg-primary text-primary-foreground">
					<h3 className="mb-2 text-xl font-semibold">Our Mission</h3>
					<p>At Acme Web Design, our mission is to deliver innovative and effective web solutions that drive business success. We strive to exceed our clients&apos; expectations through dedication, expertise, and a commitment to quality.</p>
				</div>
				<div className="p-6 rounded-lg shadow bg-primary text-primary-foreground">
					<h3 className="mb-2 text-xl font-semibold">Our Vision</h3>
					<p>Our vision is to be a leader in the web design industry, known for our creativity, technical expertise, and exceptional customer service. We aim to empower businesses of all sizes to achieve their online goals.</p>
				</div>
				<div className="p-6 rounded-lg shadow bg-primary text-primary-foreground">
					<h3 className="mb-2 text-xl font-semibold">Our Values</h3>
					<ul className="list-disc list-inside">
						<li>Innovation: Pushing boundaries to create unique web solutions.</li>
						<li>Integrity: Upholding honesty and transparency in all our dealings.</li>
						<li>Customer Satisfaction: Prioritizing our clients&apos; needs and success.</li>
						<li>Excellence: Committing to the highest standards of quality.</li>
					</ul>
				</div>
			</div>
			<div className="mt-12">
				<h3 className="mb-4 text-2xl font-bold">Meet Our Team</h3>
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					<div className="flex items-center p-6 rounded-lg shadow bg-primary text-primary-foreground">
						<Image src="/placeholder.svg" alt="Team Member 1" width={400} height={400} className="w-16 h-16 mr-4 rounded-full" />
						<div>
							<h4 className="text-xl font-semibold">John Doe</h4>
							<p className="text-sm">CEO & Founder</p>
						</div>
					</div>
					<div className="flex items-center p-6 rounded-lg shadow bg-primary text-primary-foreground">
						<Image src="/placeholder.svg" alt="Team Member 1" width={400} height={400} className="w-16 h-16 mr-4 rounded-full" />
						<div>
							<h4 className="text-xl font-semibold">Jane Smith</h4>
							<p className="text-sm">Chief Technology Officer</p>
						</div>
					</div>
					<div className="flex items-center p-6 rounded-lg shadow bg-primary text-primary-foreground">
						<Image src="/placeholder.svg" alt="Team Member 1" width={400} height={400} className="w-16 h-16 mr-4 rounded-full" />
						<div>
							<h4 className="text-xl font-semibold">Alice Johnson</h4>
							<p className="text-sm">Head of Design</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
