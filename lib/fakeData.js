// lib/fakeData.js
export const fakeUser = {
	id: "1",
	email: "test@example.com",
	username: "testuser",
};

export const fakeProData = {
	id: "1",
	name: "Test Pro",
	service: "Plumbing",
};

export const fakeJobs = [
	{ id: "1", title: "Fix Sink", description: "Kitchen sink is leaking", status: "open" },
	{ id: "2", title: "Install Faucet", description: "Install new faucet in bathroom", status: "in-progress" },
];

export const fakeNotifications = [
	{ id: "1", message: "Job assigned to you", read: false },
	{ id: "2", message: "Job completed", read: true },
];

export const fakeSettings = {
	theme: "dark",
	notifications: true,
};
