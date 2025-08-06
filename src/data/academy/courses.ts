export type Question = {
	id: string;
	type: "multiple-choice" | "true-false" | "text-input" | "drag-drop";
	question: string;
	options?: string[];
	correctAnswer: string | number;
	explanation: string;
	points: number;
};

export type Chapter = {
	title: string;
	description: string;
	questions: Question[];
};

export type Course = {
	id: string;
	title: string;
	description: string;
	price: number;
	details: string;
	chapters: Chapter[];
};

export const courses: Course[] = [
	{
		id: "plumbing-beginner",
		title: "Plumbing Beginner Guide",
		description: "Get started with basic plumbing skills.",
		price: 49,
		details: "Introductory course covering fundamental plumbing concepts with interactive diagrams and videos.",
		chapters: [
			{
				title: "Tools Overview",
				description: "Learn about essential plumbing tools and safety gear.",
				questions: [
					{
						id: "plumb-tools-1",
						type: "multiple-choice",
						question: "Which tool is essential for cutting copper pipes?",
						options: ["Hacksaw", "Pipe cutter", "Wrench", "Screwdriver"],
						correctAnswer: 1,
						explanation: "A pipe cutter provides clean, precise cuts for copper pipes and prevents burrs.",
						points: 10,
					},
					{
						id: "plumb-tools-2",
						type: "true-false",
						question: "Safety glasses should always be worn when working with plumbing tools.",
						correctAnswer: "true",
						explanation: "Safety glasses protect your eyes from debris, chemicals, and flying particles.",
						points: 5,
					},
				],
			},
			{
				title: "Pipe Installation Basics",
				description: "Understand pipe materials and basic installation techniques.",
				questions: [
					{
						id: "plumb-install-1",
						type: "multiple-choice",
						question: "What is the recommended slope for drain pipes?",
						options: ["1/8 inch per foot", "1/4 inch per foot", "1/2 inch per foot", "1 inch per foot"],
						correctAnswer: 1,
						explanation: "A 1/4 inch per foot slope ensures proper drainage without being too steep.",
						points: 15,
					},
				],
			},
		],
	},
	{
		id: "plumbing-ce",
		title: "Plumbing Continuing Education",
		description: "Stay current with plumbing codes and best practices.",
		price: 99,
		details: "Updates and advanced topics to keep licensed plumbers up to date. Interactive videos and charts help reinforce learning.",
		chapters: [
			{
				title: "Code Updates",
				description: "Review the latest plumbing code changes.",
				questions: [
					{
						id: "plumb-ce-1",
						type: "multiple-choice",
						question: "According to the latest code updates, what is the minimum pipe size for a residential main water line?",
						options: ["3/4 inch", "1 inch", "1.25 inch", "1.5 inch"],
						correctAnswer: 1,
						explanation: "Current codes require a minimum 1-inch main water line for most residential applications.",
						points: 20,
					},
				],
			},
			{
				title: "Safety Practices",
				description: "Advanced safety procedures and compliance.",
				questions: [
					{
						id: "plumb-safety-1",
						type: "true-false",
						question: "OSHA requires confined space permits for working in crawl spaces under 4 feet high.",
						correctAnswer: "true",
						explanation: "OSHA confined space regulations apply to areas with limited access and exit routes.",
						points: 15,
					},
				],
			},
		],
	},
	{
		id: "plumbing-master",
		title: "Plumbing Master Course",
		description: "Advanced training for master plumbers.",
		price: 199,
		details: "Deep dive into complex systems, leadership, and advanced code compliance. Includes interactive case studies.",
		chapters: [
			{
				title: "Commercial Systems",
				description: "Design and maintain large-scale plumbing installations.",
				questions: [],
			},
			{
				title: "Green Plumbing Technology",
				description: "Explore sustainable and energy-efficient plumbing solutions.",
				questions: [],
			},
		],
	},
	{
		id: "hvac-beginner",
		title: "HVAC Beginner Guide",
		description: "Learn the basics of heating, ventilation, and air conditioning.",
		price: 49,
		details: "Foundational HVAC concepts with interactive schematics and videos to build core skills.",
		chapters: [
			{
				title: "HVAC Tools and Safety",
				description: "Introduction to HVAC tools and safe operation.",
				questions: [],
			},
			{
				title: "System Fundamentals",
				description: "Overview of heating and cooling system components.",
				questions: [],
			},
		],
	},
	{
		id: "hvac-ce",
		title: "HVAC Continuing Education",
		description: "Update your HVAC knowledge and maintain certification.",
		price: 99,
		details: "Covers code updates, efficiency standards, and troubleshooting techniques using interactive content.",
		chapters: [
			{
				title: "Energy Efficiency Standards",
				description: "Study new efficiency requirements and best practices.",
				questions: [],
			},
			{
				title: "Advanced Troubleshooting",
				description: "Interactive scenarios to diagnose complex HVAC issues.",
				questions: [],
			},
		],
	},
	{
		id: "hvac-master",
		title: "HVAC Master Course",
		description: "Master-level training for experienced HVAC technicians.",
		price: 199,
		details: "Comprehensive coverage of system design, project management, and cutting-edge technology with interactive simulations.",
		chapters: [
			{
				title: "System Design",
				description: "Plan and design large-scale HVAC systems.",
				questions: [],
			},
			{
				title: "Project Leadership",
				description: "Manage teams and complex installations effectively.",
				questions: [],
			},
		],
	},
	{
		id: "electrical-beginner",
		title: "Electrical Beginner Guide",
		description: "Understand basic electrical theory and practice.",
		price: 49,
		details: "Starter course covering essential electrical concepts with interactive circuit diagrams and videos.",
		chapters: [
			{
				title: "Electrical Safety",
				description: "Fundamental safety procedures and personal protective equipment.",
				questions: [],
			},
			{
				title: "Circuit Basics",
				description: "Learn about circuits, current, and voltage.",
				questions: [],
			},
		],
	},
	{
		id: "electrical-ce",
		title: "Electrical Continuing Education",
		description: "Keep up with electrical codes and emerging technologies.",
		price: 99,
		details: "Explores recent code revisions, smart systems, and interactive problem-solving exercises.",
		chapters: [
			{
				title: "Code Revisions",
				description: "Detailed look at the latest National Electrical Code updates.",
				questions: [],
			},
			{
				title: "Smart Technologies",
				description: "Integrating smart devices and controls safely.",
				questions: [],
			},
		],
	},
	{
		id: "electrical-master",
		title: "Electrical Master Course",
		description: "Expert-level course for seasoned electricians.",
		price: 199,
		details: "Advanced topics including industrial systems, leadership, and interactive design projects.",
		chapters: [
			{
				title: "Industrial Systems",
				description: "Design and maintain complex industrial electrical networks.",
				questions: [],
			},
			{
				title: "Leadership and Management",
				description: "Lead teams and manage large electrical projects.",
				questions: [],
			},
		],
	},
];
