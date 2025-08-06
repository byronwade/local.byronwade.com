"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Progress } from "@components/ui/progress";
import { Separator } from "@components/ui/separator";
import { ArrowLeft, ArrowRight, CheckCircle, Clock, BookOpen, Trophy, RotateCcw, Play, Pause } from "lucide-react";

// Import courses data and question renderers from shared location
import { courses } from "@data/academy/courses";
import { enhancedCourses } from "@data/academy/enhanced-courses";
import QuestionRenderer from "@components/academy/questions/QuestionRenderer";

export default function CourseLearnPage() {
	const params = useParams();
	const router = useRouter();
	const [course, setCourse] = useState(null);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [userAnswers, setUserAnswers] = useState(new Map());
	const [showResults, setShowResults] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (params.id) {
			// Try to find enhanced course first, fall back to basic course
			const foundCourse = enhancedCourses.find((c) => c.id === params.id) || courses.find((c) => c.id === params.id);

			if (foundCourse) {
				setCourse(foundCourse);
			} else {
				router.push("/dashboard/academy/courses");
			}
			setLoading(false);
		}
	}, [params.id, router]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!course || !course.questions || course.questions.length === 0) {
		return (
			<div className="text-center py-12">
				<h2 className="text-2xl font-semibold mb-4">Learning content not available</h2>
				<p className="text-muted-foreground mb-6">This course doesn't have interactive content yet.</p>
				<Button asChild>
					<Link href={`/dashboard/academy/courses/${params.id}`}>Back to Course</Link>
				</Button>
			</div>
		);
	}

	const currentQuestion = course.questions[currentQuestionIndex];
	const totalQuestions = course.questions.length;
	const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

	const handleAnswer = (answer) => {
		const newAnswers = new Map(userAnswers);
		newAnswers.set(currentQuestion.id, {
			answer,
			isCorrect: checkAnswer(currentQuestion, answer),
			questionIndex: currentQuestionIndex,
		});
		setUserAnswers(newAnswers);
	};

	const checkAnswer = (question, answer) => {
		switch (question.type) {
			case "multiple-choice":
				return answer === question.correctAnswer;
			case "true-false":
				return answer === question.correctAnswer;
			case "text-input":
				return question.correctAnswers?.some((correct) => answer.toLowerCase().trim() === correct.toLowerCase().trim()) || false;
			case "slider-range":
				const target = question.correctRange;
				return answer >= target.min && answer <= target.max;
			default:
				return false;
		}
	};

	const getCurrentAnswer = () => {
		return userAnswers.get(currentQuestion.id);
	};

	const getScorePercentage = () => {
		const correctAnswers = Array.from(userAnswers.values()).filter((a) => a.isCorrect).length;
		return Math.round((correctAnswers / totalQuestions) * 100);
	};

	const handleNext = () => {
		if (currentQuestionIndex < totalQuestions - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			setShowResults(true);
		}
	};

	const handlePrevious = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1);
		}
	};

	const handleRestart = () => {
		setCurrentQuestionIndex(0);
		setUserAnswers(new Map());
		setShowResults(false);
	};

	const isAnswered = userAnswers.has(currentQuestion.id);
	const canProceed = isAnswered || currentQuestionIndex === totalQuestions - 1;

	if (showResults) {
		const score = getScorePercentage();
		const correctCount = Array.from(userAnswers.values()).filter((a) => a.isCorrect).length;

		return (
			<div className="space-y-8">
				{/* Header */}
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="sm" asChild>
						<Link href={`/dashboard/academy/courses/${params.id}`}>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Course
						</Link>
					</Button>
				</div>

				{/* Results */}
				<Card>
					<CardContent className="p-8 text-center">
						<div className="mb-6">
							<Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
							<h1 className="text-3xl font-bold mb-2">Course Completed!</h1>
							<p className="text-muted-foreground">Great job finishing {course.title}</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
							<div className="text-center">
								<div className="text-3xl font-bold text-green-600 mb-1">{score}%</div>
								<div className="text-sm text-muted-foreground">Final Score</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-blue-600 mb-1">
									{correctCount}/{totalQuestions}
								</div>
								<div className="text-sm text-muted-foreground">Correct Answers</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-purple-600 mb-1">{totalQuestions}</div>
								<div className="text-sm text-muted-foreground">Questions Completed</div>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button onClick={handleRestart} variant="outline">
								<RotateCcw className="w-4 h-4 mr-2" />
								Retake Course
							</Button>
							<Button asChild>
								<Link href={`/dashboard/academy/courses/${params.id}`}>View Course Details</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="sm" asChild>
						<Link href={`/dashboard/academy/courses/${params.id}`}>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Course
						</Link>
					</Button>
					<div>
						<h1 className="text-2xl font-bold">{course.title}</h1>
						<p className="text-muted-foreground">Interactive Learning</p>
					</div>
				</div>
				<div className="text-sm text-muted-foreground">
					Question {currentQuestionIndex + 1} of {totalQuestions}
				</div>
			</div>

			{/* Progress */}
			<Card>
				<CardContent className="p-6">
					<div className="flex justify-between items-center mb-2">
						<span className="font-medium">Progress</span>
						<span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% complete</span>
					</div>
					<Progress value={progressPercentage} className="h-3" />
				</CardContent>
			</Card>

			{/* Question Content */}
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
				{/* Main Question */}
				<div className="lg:col-span-3">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="text-lg">Question {currentQuestionIndex + 1}</CardTitle>
								<Badge variant="outline">{currentQuestion.type}</Badge>
							</div>
						</CardHeader>
						<CardContent className="p-6">
							<QuestionRenderer question={currentQuestion} onAnswer={handleAnswer} isAnswered={isAnswered} userAnswer={getCurrentAnswer()?.answer} />
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Navigation */}
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Navigation</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col gap-3">
								<Button onClick={handlePrevious} disabled={currentQuestionIndex === 0} variant="outline" size="sm">
									<ArrowLeft className="w-4 h-4 mr-2" />
									Previous
								</Button>
								<Button onClick={handleNext} disabled={!canProceed} size="sm">
									{currentQuestionIndex === totalQuestions - 1 ? (
										<>
											<CheckCircle className="w-4 h-4 mr-2" />
											Finish
										</>
									) : (
										<>
											Next
											<ArrowRight className="w-4 h-4 ml-2" />
										</>
									)}
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Question Overview */}
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Questions</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-5 gap-2">
								{course.questions.map((_, index) => {
									const isAnswered = Array.from(userAnswers.keys()).some((key) => course.questions.findIndex((q) => q.id === key) === index);
									const isCurrent = index === currentQuestionIndex;

									return (
										<button key={index} onClick={() => setCurrentQuestionIndex(index)} className={`w-8 h-8 rounded text-xs font-medium transition-colors ${isCurrent ? "bg-primary text-primary-foreground" : isAnswered ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
											{index + 1}
										</button>
									);
								})}
							</div>
						</CardContent>
					</Card>

					{/* Score */}
					{userAnswers.size > 0 && (
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Current Score</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-center">
									<div className="text-2xl font-bold text-green-600 mb-1">{getScorePercentage()}%</div>
									<div className="text-sm text-muted-foreground">{Array.from(userAnswers.values()).filter((a) => a.isCorrect).length} correct</div>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
