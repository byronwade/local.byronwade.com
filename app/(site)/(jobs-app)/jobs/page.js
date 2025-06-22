import JobsClient from "./JobsClient";

const mockJobs = [
	{
		id: "job1",
		title: "Senior Frontend Developer",
		company: "Innovate Solutions",
		logo: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=100&h=100&fit=crop",
		location: "Springfield, IL",
		isRemote: true,
		type: "Full-time",
		posted: "2d ago",
		description: "Detailed description for Senior Frontend Developer...",
		salary: "$120,000 - $150,000",
	},
	{
		id: "job2",
		title: "Logistics Coordinator",
		company: "Riverstone Logistics",
		logo: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=100&h=100&fit=crop",
		location: "Springfield, IL",
		isRemote: false,
		type: "Full-time",
		posted: "1w ago",
		description: "Detailed description for Logistics Coordinator...",
		salary: "$55,000 - $65,000",
	},
	{
		id: "job3",
		title: "Construction Project Manager",
		company: "Apex Construction",
		logo: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=100&h=100&fit=crop",
		location: "Springfield, IL",
		isRemote: false,
		type: "Contract",
		posted: "5d ago",
		description: "Detailed description for Construction Project Manager...",
		salary: "$90,000 - $110,000",
	},
];

export default async function JobsPage() {
	// In a real application, you would fetch jobs from an API
	const jobs = mockJobs;

	return <JobsClient jobs={jobs} />;
}
