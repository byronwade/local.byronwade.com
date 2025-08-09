"use client";
import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Search, Send } from "lucide-react";

const mockConversations = [
	{
		id: "conv1",
		user: {
			id: "sarah-johnson",
			name: "Sarah Johnson",
			avatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&h=100&fit=crop",
			business: "Wade's Plumbing & Septic",
		},
		lastMessage: "Sounds good, let's connect next week.",
		timestamp: "2h ago",
		unread: 2,
	},
	{
		id: "conv2",
		user: {
			id: "mike-chen",
			name: "Mike Chen",
			avatar: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100&h=100&fit=crop",
			business: "Springfield Auto Care",
		},
		lastMessage: "Can you send over the proposal?",
		timestamp: "1d ago",
		unread: 0,
	},
];

const mockMessages = {
	conv1: [
		{ id: "msg1", from: "sarah-johnson", text: "Hey Byron, thanks for reaching out. I'd be interested in learning more about your services.", timestamp: "3h ago" },
		{ id: "msg2", from: "byron-wade", text: "Hi Sarah, great to hear from you. We can help streamline your operations with our new platform. Are you free for a quick call tomorrow?", timestamp: "3h ago" },
		{ id: "msg3", from: "sarah-johnson", text: "Tomorrow at 2 PM works for me.", timestamp: "2h ago" },
		{ id: "msg4", from: "sarah-johnson", text: "Sounds good, let's connect next week.", timestamp: "2h ago" },
	],
	conv2: [
		{ id: "msg5", from: "byron-wade", text: "Hi Mike, following up on our conversation. I've attached the proposal for your review.", timestamp: "2d ago" },
		{ id: "msg6", from: "mike-chen", text: "Can you send over the proposal?", timestamp: "1d ago" },
	],
};

const currentUser = {
	id: "byron-wade",
};

export default function MessagesPage() {
	const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
	const [messages, setMessages] = useState(mockMessages[selectedConversation.id]);
	const [newMessage, setNewMessage] = useState("");

	const handleSelectConversation = (conversation) => {
		setSelectedConversation(conversation);
		setMessages(mockMessages[conversation.id]);
	};

	const handleSendMessage = (e) => {
		e.preventDefault();
		if (newMessage.trim()) {
			const newMsg = {
				id: `msg${Date.now()}`,
				from: currentUser.id,
				text: newMessage,
				timestamp: "Just now",
			};
			setMessages([...messages, newMsg]);
			setNewMessage("");
		}
	};

	return (
		<Card className="h-[calc(100vh-125px)]">
			<div className="grid grid-cols-1 md:grid-cols-4 h-full">
				<div className="col-span-1 border-r border-border/50">
					<CardHeader className="p-4 border-b border-border/50">
						<div className="relative">
							<Input placeholder="Search messages" className="pl-8" />
							<Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						</div>
					</CardHeader>
					<div className="overflow-y-auto">
						{mockConversations.map((conv) => (
							<div key={conv.id} className={`p-4 cursor-pointer border-b border-border/50 hover:bg-muted/50 ${selectedConversation.id === conv.id ? "bg-muted" : ""}`} onClick={() => handleSelectConversation(conv)}>
								<div className="flex items-center gap-3">
									<Avatar className="w-12 h-12">
										<AvatarImage src={conv.user.avatar} />
										<AvatarFallback>{conv.user.name.charAt(0)}</AvatarFallback>
									</Avatar>
									<div className="flex-grow overflow-hidden">
										<div className="flex justify-between items-center">
											<p className="font-semibold truncate">{conv.user.name}</p>
											<p className="text-xs text-muted-foreground">{conv.timestamp}</p>
										</div>
										<div className="flex justify-between items-start">
											<p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
											{conv.unread > 0 && <div className="text-xs bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center">{conv.unread}</div>}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="col-span-3 flex flex-col h-full">
					{selectedConversation ? (
						<>
							<CardHeader className="p-4 border-b border-border/50">
								<Link href={`/profile/${selectedConversation.user.id}`}>
									<div className="flex items-center gap-3 cursor-pointer">
										<Avatar>
											<AvatarImage src={selectedConversation.user.avatar} />
											<AvatarFallback>{selectedConversation.user.name.charAt(0)}</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-semibold">{selectedConversation.user.name}</p>
											<p className="text-sm text-muted-foreground">{selectedConversation.user.business}</p>
										</div>
									</div>
								</Link>
							</CardHeader>
							<CardContent className="flex-grow p-4 overflow-y-auto">
								<div className="space-y-4">
									{messages.map((msg) => (
										<div key={msg.id} className={`flex gap-3 ${msg.from === currentUser.id ? "justify-end" : "justify-start"}`}>
											{msg.from !== currentUser.id && (
												<Avatar className="w-8 h-8">
													<AvatarImage src={selectedConversation.user.avatar} />
												</Avatar>
											)}
											<div>
												<div className={`p-3 rounded-lg max-w-md ${msg.from === currentUser.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
													<p>{msg.text}</p>
												</div>
												<p className={`text-xs text-muted-foreground mt-1 ${msg.from === currentUser.id ? "text-right" : "text-left"}`}>{msg.timestamp}</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
							<div className="p-4 border-t border-border/50">
								<form onSubmit={handleSendMessage} className="flex items-center gap-3">
									<Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
									<Button type="submit" size="icon" disabled={!newMessage.trim()}>
										<Send className="w-4 h-4" />
									</Button>
								</form>
							</div>
						</>
					) : (
						<div className="flex items-center justify-center h-full">
							<p className="text-muted-foreground">Select a conversation to start messaging</p>
						</div>
					)}
				</div>
			</div>
		</Card>
	);
}
