"use client";

import React, { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { ScrollArea } from "@components/ui/scroll-area";
import { Users, Hash, Send, Search, Plus } from "lucide-react";

const mockChannels = [
	{ id: "general", name: "general", description: "Company-wide updates", unread: 2 },
	{ id: "field-ops", name: "field-ops", description: "Technician coordination", unread: 0 },
	{ id: "sales", name: "sales", description: "Leads and estimates", unread: 4 },
	{ id: "support", name: "support", description: "Customer issues and tickets", unread: 1 },
];

const mockMessages = {
	general: [
		{ id: "m1", author: "Admin", text: "Welcome to the new team chat!", time: "2025-02-01T08:00:00Z" },
		{ id: "m2", author: "Mike", text: "HVAC crew heading to downtown route.", time: "2025-02-01T08:15:00Z" },
	],
	"field-ops": [{ id: "m3", author: "Dispatch", text: "Job #JOB231 delayed 30m due to traffic.", time: "2025-02-01T09:05:00Z" }],
	sales: [{ id: "m4", author: "Samantha", text: "Estimate CAM-192 approved. Next steps?", time: "2025-02-01T09:30:00Z" }],
	support: [{ id: "m5", author: "Support", text: "Reminder: follow up on ticket #T-556.", time: "2025-02-01T07:45:00Z" }],
};

// metadata removed (client component)

export default function TeamChatPage() {
	const router = useRouter();
	const [channels, setChannels] = useState(mockChannels);
	const [activeChannel, setActiveChannel] = useState("general");
	const [messages, setMessages] = useState(mockMessages);
	const [search, setSearch] = useState("");
	const [newMessage, setNewMessage] = useState("");
	const inputRef = useRef(null);

	const visibleMessages = useMemo(() => {
		const list = messages[activeChannel] || [];
		if (!search) return list;
		return list.filter((m) => `${m.author} ${m.text}`.toLowerCase().includes(search.toLowerCase()));
	}, [messages, activeChannel, search]);

	const sendMessage = () => {
		const text = newMessage.trim();
		if (!text) return;
		const msg = { id: `m_${Date.now()}`, author: "You", text, time: new Date().toISOString() };
		setMessages((prev) => ({ ...prev, [activeChannel]: [...(prev[activeChannel] || []), msg] }));
		setNewMessage("");
		inputRef.current?.focus();
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Team Chat</h1>
					<p className="text-muted-foreground">Collaborate with your team in channels</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" onClick={() => setChannels((prev) => [...prev, { id: `new-${prev.length + 1}`, name: `new-channel-${prev.length + 1}`, description: "New channel", unread: 0 }])}>
						<Plus className="w-4 h-4 mr-2" />
						New Channel
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Sidebar */}
				<div className="lg:col-span-1 space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Channels</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							<ScrollArea className="max-h-[60vh]">
								<div className="p-2 space-y-1">
									{channels.map((ch) => (
										<button key={ch.id} className={`w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors ${activeChannel === ch.id ? "bg-accent" : ""}`} onClick={() => setActiveChannel(ch.id)}>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<Hash className="w-4 h-4" />
													<span className="font-medium">{ch.name}</span>
												</div>
												{ch.unread > 0 && <Badge>{ch.unread}</Badge>}
											</div>
											<p className="text-xs text-muted-foreground mt-1 truncate">{ch.description}</p>
										</button>
									))}
								</div>
							</ScrollArea>
						</CardContent>
					</Card>
				</div>

				{/* Messages */}
				<div className="lg:col-span-3 space-y-4">
					<Card>
						<CardContent className="p-4">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search #${activeChannel}`} className="pl-9" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-0">
							<ScrollArea className="h-[50vh]">
								<div className="p-4 space-y-4">
									{visibleMessages.map((m) => (
										<div key={m.id} className="flex items-start gap-3">
											<div className="mt-1">
												<Users className="w-5 h-5 text-muted-foreground" />
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 text-sm">
													<span className="font-medium">{m.author}</span>
													<span className="text-muted-foreground">• {new Date(m.time).toLocaleString()}</span>
												</div>
												<p className="text-sm mt-1 whitespace-pre-wrap">{m.text}</p>
											</div>
										</div>
									))}
									{visibleMessages.length === 0 && <div className="p-8 text-center text-muted-foreground">No messages match your search</div>}
								</div>
							</ScrollArea>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-3">
							<div className="flex items-center gap-2">
								<Input
									ref={inputRef}
									value={newMessage}
									onChange={(e) => setNewMessage(e.target.value)}
									placeholder={`Message #${activeChannel}`}
									onKeyDown={(e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											e.preventDefault();
											sendMessage();
										}
									}}
								/>
								<Button onClick={sendMessage}>
									<Send className="w-4 h-4" />
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
