"use client";
import React, { useState, useEffect, useRef } from "react";
import UserBubble from "@components/shared/chatBot/UserBubble";
import ThorbisBubble from "@components/shared/chatBot/ThorbisBubble";
import ChatInput from "@components/shared/chatBot/ChatInput";
import ChatSuggestions from "@components/shared/chatBot/ChatSuggestions";
import { ScrollArea } from "@components/ui/scroll-area";
import agent from "@lib/OpenAIClient"; // Import the OpenAI client

export default function ChatContent({ messages: initialMessages, suggestions }) {
	const [messages, setMessages] = useState(initialMessages);
	const [isTyping, setIsTyping] = useState(false);
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const addMessage = async (message, sender) => {
		const newMessages = [...messages, { id: messages.length + 1, message, sender }];
		setMessages(newMessages);
		console.log("Message added:", newMessages);

		if (sender === "user") {
			setIsTyping(true);
			try {
				console.log("Sending message to agent:", message);
				const response = await agent(message);
				console.log("AI Response:", response);
				setMessages([...newMessages, { id: newMessages.length + 1, message: response, sender: "thorbis" }]);
			} catch (error) {
				console.error("Error getting AI response:", error);
			}
			setIsTyping(false);
		}
	};

	return (
		<div className="flex flex-col justify-between min-h-96">
			<ScrollArea className="flex-1 overflow-auto text-sm">
				{messages.length === 0 ? <ChatSuggestions suggestions={suggestions} addMessage={addMessage} /> : messages.map((msg) => (msg.sender === "user" ? <UserBubble key={msg.id} message={msg.message} /> : <ThorbisBubble key={msg.id} message={msg.message} isTyping={isTyping} />))}
				<div ref={messagesEndRef} />
			</ScrollArea>
			<div className="p-4">
				<ChatInput addMessage={addMessage} />
			</div>
		</div>
	);
}
