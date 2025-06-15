"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, MessageCircle, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { ScrollArea } from "@components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@components/ui/avatar";
import { Badge } from "@components/ui/badge";

const SAMPLE_SUGGESTIONS = ["Find pizza places near me", "Best rated restaurants in downtown", "Auto repair shops open now", "Hair salons with good reviews", "24/7 pharmacies nearby", "Coffee shops with WiFi"];

const SAMPLE_RESPONSES = {
	"find pizza places near me": "I found several great pizza places in your area! Joe's Pizza Palace has excellent reviews (4.5 stars) and is open until 10 PM. Would you like me to show you more options or get directions?",
	"best rated restaurants in downtown": "Here are the top-rated restaurants downtown: Downtown Dental Care (4.7 stars), Smith's Auto Repair (4.8 stars), and Golden Gate Plumbing (4.6 stars). Would you like more details about any of these?",
	"auto repair shops open now": "I found Smith's Auto Repair which is currently open and has excellent ratings (4.8 stars). They specialize in brake repair, oil changes, and engine diagnostics. Would you like their contact information?",
	"hair salons with good reviews": "Bella's Hair Salon is highly rated (4.3 stars) and offers full-service hair care including cuts, colors, and styling. They're open Tuesday through Saturday. Would you like to see their location?",
	"24/7 pharmacies nearby": "Golden Gate Plumbing offers 24/7 emergency service, though for pharmacies specifically, I'd recommend checking with local chains. Would you like me to search for pharmacies in your area?",
	"coffee shops with wifi": "The Coffee Corner is perfect for you! They serve artisan coffee with locally roasted beans and offer WiFi. They're open 6 AM to 8 PM on weekdays. Great spot for work or relaxation!",
};

export default function AIChatDrawer({ isOpen, onClose }) {
	const [messages, setMessages] = useState([
		{
			id: 1,
			type: "ai",
			content: "Hi! I'm your AI assistant. I can help you find businesses, get recommendations, and answer questions about local services. What are you looking for today?",
			timestamp: new Date(),
		},
	]);
	const [inputValue, setInputValue] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const messagesEndRef = useRef(null);
	const inputRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	const handleSendMessage = async () => {
		if (!inputValue.trim()) return;

		const userMessage = {
			id: Date.now(),
			type: "user",
			content: inputValue,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputValue("");
		setIsTyping(true);

		// Simulate AI response
		setTimeout(() => {
			const response = SAMPLE_RESPONSES[inputValue.toLowerCase()] || "I understand you're looking for information about local businesses. Let me search for that and provide you with the best options in your area. Is there anything specific you'd like to know about the businesses I find?";

			const aiMessage = {
				id: Date.now() + 1,
				type: "ai",
				content: response,
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, aiMessage]);
			setIsTyping(false);
		}, 1000 + Math.random() * 1000);
	};

	const handleSuggestionClick = (suggestion) => {
		setInputValue(suggestion);
		handleSendMessage();
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-2xl z-50 flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
						<Sparkles className="w-5 h-5 text-white" />
					</div>
					<div>
						<h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
						<p className="text-xs text-gray-500 dark:text-gray-400">Powered by advanced AI</p>
					</div>
				</div>
				<Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800">
					<X className="w-4 h-4" />
				</Button>
			</div>

			{/* Messages */}
			<ScrollArea className="flex-1 p-4">
				<div className="space-y-4">
					{messages.map((message) => (
						<div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
							{message.type === "ai" && (
								<Avatar className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500">
									<AvatarFallback className="bg-transparent">
										<Bot className="w-4 h-4 text-white" />
									</AvatarFallback>
								</Avatar>
							)}

							<div className={`max-w-[80%] ${message.type === "user" ? "order-first" : ""}`}>
								<div className={`p-3 rounded-2xl ${message.type === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"}`}>
									<p className="text-sm leading-relaxed">{message.content}</p>
								</div>
								<p className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
							</div>

							{message.type === "user" && (
								<Avatar className="w-8 h-8 bg-gray-200 dark:bg-gray-700">
									<AvatarFallback>
										<User className="w-4 h-4" />
									</AvatarFallback>
								</Avatar>
							)}
						</div>
					))}

					{isTyping && (
						<div className="flex gap-3 justify-start">
							<Avatar className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500">
								<AvatarFallback className="bg-transparent">
									<Bot className="w-4 h-4 text-white" />
								</AvatarFallback>
							</Avatar>
							<div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl">
								<div className="flex items-center gap-1">
									<Loader2 className="w-4 h-4 animate-spin text-gray-500" />
									<span className="text-sm text-gray-500">AI is thinking...</span>
								</div>
							</div>
						</div>
					)}

					{/* Suggestions */}
					{messages.length === 1 && (
						<div className="space-y-3">
							<p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Try asking:</p>
							<div className="flex flex-wrap gap-2">
								{SAMPLE_SUGGESTIONS.map((suggestion, index) => (
									<Badge key={index} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs py-1 px-2" onClick={() => handleSuggestionClick(suggestion)}>
										{suggestion}
									</Badge>
								))}
							</div>
						</div>
					)}
				</div>
				<div ref={messagesEndRef} />
			</ScrollArea>

			{/* Input */}
			<div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
				<div className="flex gap-2">
					<Input ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask me anything about local businesses..." className="flex-1 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary" disabled={isTyping} />
					<Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
						<Send className="w-4 h-4" />
					</Button>
				</div>
				<p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">AI responses are simulated for demonstration</p>
			</div>
		</div>
	);
}
