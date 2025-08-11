"use client";
import { useState } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Card, CardContent } from "@components/ui/card";

export default function QuestionRenderer({ question, onAnswer, isAnswered, userAnswer, showFeedback }) {
	const [tempAnswer, setTempAnswer] = useState("");

	const getButtonVariant = (optionIndex) => {
		if (!isAnswered) return userAnswer === optionIndex ? "default" : "outline";

		const isCorrectOption = question.correctAnswer === optionIndex;
		const isUserChoice = userAnswer === optionIndex;

		if (isCorrectOption) return "default";
		if (isUserChoice && !isCorrectOption) return "destructive";
		return "outline";
	};

	const getButtonClasses = (optionIndex) => {
		if (!isAnswered) {
			return userAnswer === optionIndex ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground";
		}

		const isCorrectOption = question.correctAnswer === optionIndex;
		const isUserChoice = userAnswer === optionIndex;

		if (isCorrectOption) return "bg-green-500 text-white hover:bg-green-600";
		if (isUserChoice && !isCorrectOption) return "bg-red-500 text-white hover:bg-red-600";
		return "";
	};

	switch (question.type) {
		case "multiple-choice":
			return (
				<div className="space-y-4">
					{question.options?.map((option, index) => (
						<Button key={index} variant="outline" size="lg" className={`w-full h-auto min-h-[60px] p-6 text-left justify-start whitespace-normal transition-all duration-200 border border-border hover:border-primary/50 ${getButtonClasses(index)} ${!isAnswered ? "hover:shadow-md hover:-translate-y-1" : ""}`} onClick={() => !isAnswered && onAnswer(index)} disabled={isAnswered}>
							<div className="flex items-start space-x-4 w-full">
								<span className="text-lg font-bold flex-shrink-0">{String.fromCharCode(65 + index)}.</span>
								<span className="text-lg text-left">{option}</span>
							</div>
						</Button>
					))}
				</div>
			);

		case "true-false":
			return (
				<div className="flex justify-center space-x-6">
					<Button variant="outline" size="lg" className={`px-12 py-8 text-xl min-w-[150px] transition-all duration-200 border border-border hover:border-primary/50 ${getButtonClasses("true")} ${!isAnswered ? "hover:shadow-md hover:-translate-y-1" : ""}`} onClick={() => !isAnswered && onAnswer("true")} disabled={isAnswered}>
						True
					</Button>
					<Button variant="outline" size="lg" className={`px-12 py-8 text-xl min-w-[150px] transition-all duration-200 border border-border hover:border-primary/50 ${getButtonClasses("false")} ${!isAnswered ? "hover:shadow-md hover:-translate-y-1" : ""}`} onClick={() => !isAnswered && onAnswer("false")} disabled={isAnswered}>
						False
					</Button>
				</div>
			);

		case "text-input":
			return (
				<div className="max-w-md mx-auto space-y-4 text-center">
					<Input size="lg" placeholder="Type your answer here..." value={isAnswered ? String(userAnswer || "") : tempAnswer} onChange={(e) => !isAnswered && setTempAnswer(e.target.value)} readOnly={isAnswered} className="text-center text-lg py-6 border-2 border-border focus:border-primary" />
					{!isAnswered && (
						<Button size="lg" onClick={() => onAnswer(tempAnswer.trim())} disabled={!tempAnswer.trim()} className="px-8">
							Submit Answer
						</Button>
					)}
				</div>
			);

		case "drag-drop":
			// Simplified version as multiple choice
			return (
				<div className="space-y-4">
					<p className="text-center text-muted-foreground mb-4">Select the correct answer:</p>
					{question.options?.map((option, index) => {
						const isCorrectOption = isAnswered && question.correctAnswer === index;
						const isUserChoice = userAnswer === index;
						const isWrongChoice = isAnswered && isUserChoice && question.correctAnswer !== index;

						return (
							<Card key={index} className={`cursor-pointer transition-all duration-200 border-2 ${!isAnswered ? "hover:shadow-md hover:-translate-y-1" : ""} ${isCorrectOption ? "border-green-500 bg-green-50 dark:bg-green-950/20" : isWrongChoice ? "border-red-500 bg-red-50 dark:bg-red-950/20" : isUserChoice ? "border-primary bg-primary/5" : "border-border"}`} onClick={() => !isAnswered && onAnswer(index)}>
								<CardContent className="p-4">
									<p className="text-lg text-center">{option}</p>
								</CardContent>
							</Card>
						);
					})}
				</div>
			);

		default:
			return <p className="text-red-500 text-center">Unsupported question type: {question.type}</p>;
	}
}
