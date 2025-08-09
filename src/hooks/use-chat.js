"use client";

import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const useChat = (initialMessages = []) => {
	const [messages, setMessages] = useState(initialMessages);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [isRecording, setIsRecording] = useState(false);
	const [error, setError] = useState(null);

	// Load messages from localStorage on initial render
	useEffect(() => {
		try {
			const savedMessages = localStorage.getItem("chatMessages");
			if (savedMessages) {
				setMessages(JSON.parse(savedMessages));
			}
		} catch (err) {
			console.error("Failed to load messages from localStorage", err);
			setError("Could not load previous conversation.");
		}
	}, []);

	// Save messages to localStorage whenever they change
	useEffect(() => {
		try {
			if (messages.length > 0) {
				localStorage.setItem("chatMessages", JSON.stringify(messages));
			}
		} catch (err) {
			console.error("Failed to save messages to localStorage", err);
			setError("Could not save conversation.");
		}
	}, [messages]);

	const handleFileUpload = useCallback((files) => {
		const newFiles = Array.from(files).map((file) => ({
			id: uuidv4(),
			file,
			name: file.name,
			size: file.size,
			type: file.type,
			preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
		}));
		setUploadedFiles((prev) => [...prev, ...newFiles]);
	}, []);

	const removeFile = useCallback((fileId) => {
		setUploadedFiles((prevFiles) => {
			const fileToRemove = prevFiles.find((f) => f.id === fileId);
			if (fileToRemove?.preview) {
				URL.revokeObjectURL(fileToRemove.preview);
			}
			return prevFiles.filter((f) => f.id !== fileId);
		});
	}, []);

	const clearChat = useCallback(() => {
		setMessages([]);
		setUploadedFiles([]);
		setInput("");
		localStorage.removeItem("chatMessages");
	}, []);

	const handleSubmit = useCallback(
		async (e) => {
			if (e) e.preventDefault();
			if ((!input.trim() && uploadedFiles.length === 0) || isLoading) return;

			const userMessage = {
				id: uuidv4(),
				role: "user",
				content: input,
				files: uploadedFiles,
				createdAt: new Date(),
			};

			setMessages((prev) => [...prev, userMessage]);
			setInput("");
			setUploadedFiles([]);
			setIsLoading(true);
			setError(null);

			// Simulate API call
			setTimeout(() => {
				try {
					// Mock AI response logic
					let responseContent = "I've received your message.";
					if (input) {
						responseContent += ` You said: "${input}".`;
					}
					if (uploadedFiles.length > 0) {
						responseContent += ` And you've uploaded ${uploadedFiles.length} file(s).`;
					}

					const assistantMessage = {
						id: uuidv4(),
						role: "assistant",
						content: responseContent,
						createdAt: new Date(),
					};
					setMessages((prev) => [...prev, assistantMessage]);
				} catch (err) {
					setError("Sorry, I encountered an error. Please try again.");
				} finally {
					setIsLoading(false);
				}
			}, 1500);
		},
		[input, uploadedFiles, isLoading]
	);

	const stopGenerating = useCallback(() => {
		setIsLoading(false);
		// In a real scenario, you'd also send an abort signal to the API call
	}, []);

	return {
		messages,
		setMessages,
		input,
		setInput,
		isLoading,
		error,
		uploadedFiles,
		isRecording,
		setIsRecording,
		handleFileUpload,
		removeFile,
		handleSubmit,
		clearChat,
		stopGenerating,
	};
};
