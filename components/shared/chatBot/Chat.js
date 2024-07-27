"use client";
import { useState } from "react";
import UserBubble from "@components/shared/chatBot/UserBubble";
import ThorbisBubble from "@components/shared/chatBot/ThorbisBubble";
import ChatInput from "@components/shared/chatBot/ChatInput";
import ChatSuggestions from "@components/shared/chatBot/ChatSuggestions";

const initialMessages = [
	// {
	// 	id: 1,
	// 	sender: "user",
	// 	message: "hi",
	// },
	// {
	// 	id: 2,
	// 	sender: "thorbis",
	// 	message: "Hello! How can I assist you today?",
	// },
	// {
	// 	id: 3,
	// 	sender: "user",
	// 	message: "What are your working hours?",
	// },
	// {
	// 	id: 4,
	// 	sender: "thorbis",
	// 	message: "Our working hours are from 9 AM to 5 PM, Monday to Friday.",
	// },
	// {
	// 	id: 5,
	// 	sender: "user",
	// 	message: "Can you tell me a joke?",
	// },
	// {
	// 	id: 6,
	// 	sender: "thorbis",
	// 	message: "Why don’t scientists trust atoms? Because they make up everything!",
	// },
	// {
	// 	id: 7,
	// 	sender: "user",
	// 	message: "What services do you offer?",
	// },
	// {
	// 	id: 8,
	// 	sender: "thorbis",
	// 	message: "We offer a variety of services including plumbing repairs, installations, and maintenance. How can we help you today?",
	// },
];

const suggestions = [
	{
		text: "Find business information",
		icon: "Search",
		color: "rgb(226, 197, 65)",
	},
	{
		text: "Create a business content calendar",
		icon: "Calendar",
		color: "rgb(203, 139, 208)",
	},
	{
		text: "Organize business documents",
		icon: "Clipboard",
		color: "rgb(203, 139, 208)",
	},
	{
		text: "Write a business proposal",
		icon: "Book",
		color: "rgb(226, 197, 65)",
	},
];

function ChatContent({ messages: initialMessages, suggestions }) {
	const [messages, setMessages] = useState(initialMessages);

	const addMessage = (message, sender) => {
		setMessages([...messages, { id: messages.length + 1, message, sender }]);
	};

	return (
		<div className="flex flex-col justify-between h-full min-h-96">
			<div className="flex-1 overflow-auto text-sm">{messages.length === 0 ? <ChatSuggestions suggestions={suggestions} /> : messages.map((msg) => (msg.sender === "user" ? <UserBubble key={msg.id} message={msg.message} /> : <ThorbisBubble key={msg.id} message={msg.message} />))}</div>
			<div className="p-4">
				<ChatInput addMessage={addMessage} />
			</div>
		</div>
	);
}

function ChatWindow({ messages, suggestions }) {
	return (
		<div className="fixed bg-[#212121] bottom-4 right-4 w-96 text-white rounded-md min-h-96 flex flex-col">
			<header className="flex flex-col space-y-1.5 pb-6 p-4 text-left">
				<h2 className="text-lg font-semibold tracking-tight">Thorbis</h2>
			</header>
			<ChatContent messages={messages} suggestions={suggestions} />
		</div>
	);
}

function ChatFull({ messages, suggestions }) {
	return (
		<div className="bg-[#212121] w-full text-white rounded-md min-h-96 flex flex-col justify-between h-full">
			<ChatContent messages={messages} suggestions={suggestions} />
		</div>
	);
}

export default function Chat({ variant }) {
	return variant === "Full" ? <ChatFull messages={initialMessages} suggestions={suggestions} /> : <ChatWindow messages={initialMessages} suggestions={suggestions} />;
}
