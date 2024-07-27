"use client";
import React, { useState } from "react";
import UserBubble from "@components/shared/chatBot/UserBubble";
import ThorbisBubble from "@components/shared/chatBot/ThorbisBubble";
import ChatInput from "@components/shared/chatBot/ChatInput";
import ChatSuggestions from "@components/shared/chatBot/ChatSuggestions";

export default function ChatContent({ messages: initialMessages, suggestions }) {
	const [messages, setMessages] = useState(initialMessages);

	const addMessage = (message, sender) => {
		setMessages([...messages, { id: messages.length + 1, message, sender }]);
	};

	return (
		<div className="flex flex-col justify-between min-h-96">
			<div className="flex-1 overflow-auto text-sm">{messages.length === 0 ? <ChatSuggestions suggestions={suggestions} addMessage={addMessage} /> : messages.map((msg) => (msg.sender === "user" ? <UserBubble key={msg.id} message={msg.message} /> : <ThorbisBubble key={msg.id} message={msg.message} />))}</div>
			<div className="p-4">
				<ChatInput addMessage={addMessage} />
			</div>
		</div>
	);
}
