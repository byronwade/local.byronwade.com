import { Briefcase, MapPin, Building, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

const mockJobs = [
	{
		id: "job1",
		title: "Senior Frontend Developer",
		company: "Innovate Solutions",
		logo: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=100&h=100&fit=crop",
		location: "Springfield, IL",
		isRemote: true,
		type: "Full-time",
		salary: "$120,000 - $150,000",
		posted: "2d ago",
		description: `
### About Us
Innovate Solutions is a forward-thinking tech company dedicated to creating cutting-edge solutions that drive business growth. We believe in fostering a collaborative and inclusive environment where creativity and innovation can thrive.

### Job Description
We are seeking an experienced Senior Frontend Developer to join our talented team. In this role, you will be responsible for building and maintaining our client-facing web applications, ensuring they are responsive, performant, and user-friendly. You will work closely with our design and backend teams to translate mockups and requirements into high-quality code.

### Responsibilities
- Develop new user-facing features using React and TypeScript.
- Build reusable code and libraries for future use.
- Ensure the technical feasibility of UI/UX designs.
- Optimize applications for maximum speed and scalability.
- Collaborate with other team members and stakeholders.

### Qualifications
- 5+ years of experience in frontend development.
- Proficient in React, TypeScript, and modern CSS frameworks like Tailwind CSS.
- Strong understanding of web performance and optimization techniques.
- Experience with Next.js is a plus.
- Excellent problem-solving and communication skills.
`,
		skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
	},
	// ... other jobs
];

export default function JobDetailsPage({ params }) {
	// In a real app, you would fetch the job details based on the ID.
	const job = mockJobs.find((j) => j.id === params.jobId);

	if (!job) {
		notFound();
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
			{/* Left Column - Job Description */}
			<div className="lg:col-span-3">
				<Card>
					<CardHeader>
						<CardTitle className="text-3xl">{job.title}</CardTitle>
						<div className="flex items-center gap-x-4 text-muted-foreground pt-2">
							<span className="flex items-center gap-x-1.5">
								<Building className="w-4 h-4" />
								{job.company}
							</span>
							<span className="flex items-center gap-x-1.5">
								<MapPin className="w-4 h-4" />
								{job.location}
							</span>
						</div>
					</CardHeader>
					<CardContent>
						<div className="prose dark:prose-invert max-w-none">
							<Markdown>{job.description}</Markdown>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Right Column - Summary */}
			<aside className="lg:col-span-1 sticky top-24">
				<Card>
					<CardHeader className="text-center">
						<Avatar className="w-20 h-20 mx-auto mb-4 rounded-md">
							<AvatarImage src={job.logo} />
							<AvatarFallback>{job.company.charAt(0)}</AvatarFallback>
						</Avatar>
						<CardTitle>{job.company}</CardTitle>
						<CardDescription>
							<Link href="#" className="hover:underline">
								View company profile
							</Link>
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Button className="w-full">Apply Now</Button>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="font-semibold">Job Type</span>
								<span className="text-muted-foreground">{job.type}</span>
							</div>
							{job.isRemote && (
								<div className="flex justify-between">
									<span className="font-semibold">Location</span>
									<span className="text-muted-foreground">Remote</span>
								</div>
							)}
							<div className="flex justify-between">
								<span className="font-semibold">Salary</span>
								<span className="text-muted-foreground">{job.salary}</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</aside>
		</div>
	);
}
