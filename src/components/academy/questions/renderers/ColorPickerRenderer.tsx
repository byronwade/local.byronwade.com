"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Palette } from "lucide-react";
import { ColorPickerQuestion } from "@/types/questions";

interface ColorPickerRendererProps {
	question: ColorPickerQuestion;
	onAnswer: (answer: any) => void;
	isAnswered: boolean;
	userAnswer?: string;
	showFeedback?: boolean;
	disabled?: boolean;
}

export function ColorPickerRenderer({ question, onAnswer, isAnswered, userAnswer, showFeedback = false, disabled = false }: ColorPickerRendererProps) {
	const [selectedColor, setSelectedColor] = useState<string>(userAnswer || "#ffffff");
	const [colorMode, setColorMode] = useState<"picker" | "input">("picker");

	// Convert hex to RGB
	const hexToRgb = (hex: string) => {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
			  }
			: null;
	};

	// Convert RGB to HSL
	const rgbToHsl = (r: number, g: number, b: number) => {
		r /= 255;
		g /= 255;
		b /= 255;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h: number, s: number, l: number;

		l = (max + min) / 2;

		if (max === min) {
			h = s = 0;
		} else {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
				default:
					h = 0;
			}
			h /= 6;
		}

		return {
			h: Math.round(h * 360),
			s: Math.round(s * 100),
			l: Math.round(l * 100),
		};
	};

	// Calculate color difference (simplified Delta E)
	const calculateColorDifference = (color1: string, color2: string) => {
		const rgb1 = hexToRgb(color1);
		const rgb2 = hexToRgb(color2);

		if (!rgb1 || !rgb2) return 100;

		const deltaR = rgb1.r - rgb2.r;
		const deltaG = rgb1.g - rgb2.g;
		const deltaB = rgb1.b - rgb2.b;

		return Math.sqrt(deltaR * deltaR + deltaG * deltaG + deltaB * deltaB);
	};

	const handleColorChange = (color: string) => {
		if (isAnswered || disabled) return;
		setSelectedColor(color);
	};

	const handleSubmit = () => {
		if (isAnswered || disabled) return;

		const colorDifference = calculateColorDifference(selectedColor, question.targetColor);
		const isCorrect = colorDifference <= question.tolerance;

		onAnswer({
			value: selectedColor,
			__isCorrect: isCorrect,
			colorDifference,
		});
	};

	const getColorInfo = (color: string) => {
		const rgb = hexToRgb(color);
		if (!rgb) return { hex: color, rgb: "Invalid", hsl: "Invalid" };

		const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

		return {
			hex: color.toUpperCase(),
			rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
			hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
		};
	};

	const commonColors = ["#FF0000", "#FF8000", "#FFFF00", "#80FF00", "#00FF00", "#00FF80", "#00FFFF", "#0080FF", "#0000FF", "#8000FF", "#FF00FF", "#FF0080", "#000000", "#404040", "#808080", "#C0C0C0", "#FFFFFF", "#800000", "#808000", "#008000", "#008080", "#000080", "#800080", "#8B4513"];

	return (
		<div className="space-y-6">
			{/* Scenario */}
			<Card>
				<CardContent className="p-6">
					<div className="flex items-start space-x-4">
						<Palette className="w-6 h-6 text-blue-500 mt-1" />
						<div>
							<p className="text-lg font-medium text-gray-800 mb-2">{question.scenario}</p>
							<p className="text-sm text-gray-600">Select the color that best matches the requirement. Tolerance: ±{question.tolerance} color units.</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Color Picker Interface */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Picker Side */}
				<Card>
					<CardContent className="p-6 space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="text-lg font-semibold">Color Selection</h3>
							<div className="flex space-x-2">
								<Button variant={colorMode === "picker" ? "default" : "outline"} size="sm" onClick={() => setColorMode("picker")} disabled={isAnswered || disabled}>
									Picker
								</Button>
								<Button variant={colorMode === "input" ? "default" : "outline"} size="sm" onClick={() => setColorMode("input")} disabled={isAnswered || disabled}>
									Input
								</Button>
							</div>
						</div>

						{colorMode === "picker" ? (
							<div className="space-y-4">
								{/* HTML5 Color Picker */}
								<input type="color" value={selectedColor} onChange={(e) => handleColorChange(e.target.value)} disabled={isAnswered || disabled} className="w-full h-20 border-2 border-gray-300 rounded-lg cursor-pointer disabled:cursor-not-allowed" />

								{/* Common Colors Palette */}
								<div>
									<p className="text-sm font-medium text-gray-700 mb-2">Quick Colors:</p>
									<div className="grid grid-cols-6 gap-2">
										{commonColors.map((color) => (
											<button key={color} className={`w-8 h-8 rounded border-2 transition-all duration-200 ${selectedColor.toLowerCase() === color.toLowerCase() ? "border-blue-500 scale-110" : "border-gray-300 hover:border-gray-400"}`} style={{ backgroundColor: color }} onClick={() => handleColorChange(color)} disabled={isAnswered || disabled} title={color} />
										))}
									</div>
								</div>
							</div>
						) : (
							<div className="space-y-4">
								{/* Manual Input */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Hex Color Code:</label>
									<input
										type="text"
										value={selectedColor}
										onChange={(e) => {
											let value = e.target.value;
											if (!value.startsWith("#")) value = "#" + value;
											handleColorChange(value);
										}}
										placeholder="#FFFFFF"
										disabled={isAnswered || disabled}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
									/>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Preview Side */}
				<Card>
					<CardContent className="p-6 space-y-4">
						<h3 className="text-lg font-semibold">Color Preview</h3>

						{/* Color Swatch */}
						<div className="space-y-4">
							<div className="w-full h-32 border-2 border-gray-300 rounded-lg shadow-inner" style={{ backgroundColor: selectedColor }} />

							{/* Color Information */}
							<div className="space-y-2 text-sm">
								{(() => {
									const colorInfo = getColorInfo(selectedColor);
									return (
										<>
											<div className="flex justify-between">
												<span className="font-medium">Hex:</span>
												<span className="font-mono">{colorInfo.hex}</span>
											</div>
											<div className="flex justify-between">
												<span className="font-medium">RGB:</span>
												<span className="font-mono">{colorInfo.rgb}</span>
											</div>
											<div className="flex justify-between">
												<span className="font-medium">HSL:</span>
												<span className="font-mono">{colorInfo.hsl}</span>
											</div>
										</>
									);
								})()}
							</div>

							{/* Preview Image */}
							{question.previewImage && (
								<div className="relative">
									<img src={question.previewImage} alt="Color preview context" className="w-full rounded-lg" />
									<div className="absolute inset-0 rounded-lg opacity-30 mix-blend-multiply" style={{ backgroundColor: selectedColor }} />
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Submit Button */}
			{!isAnswered && (
				<div className="flex justify-center">
					<Button onClick={handleSubmit} size="lg" disabled={disabled}>
						Submit Color Choice
					</Button>
				</div>
			)}

			{/* Feedback */}
			{showFeedback && isAnswered && (
				<Card className="mt-6">
					<CardContent className="p-6">
						<div className="space-y-4">
							<div className="flex items-center space-x-2">
								{(() => {
									const colorDifference = calculateColorDifference(selectedColor, question.targetColor);
									const isCorrect = colorDifference <= question.tolerance;
									return (
										<>
											{isCorrect ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
											<span className={`font-semibold ${isCorrect ? "text-green-700" : "text-red-700"}`}>{isCorrect ? "Excellent Color Match!" : "Color doesn't match closely enough"}</span>
										</>
									);
								})()}
							</div>

							{/* Color Comparison */}
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm font-medium text-gray-700 mb-2">Your Color:</p>
									<div className="w-full h-16 border-2 border-gray-300 rounded-lg" style={{ backgroundColor: selectedColor }} />
									<p className="text-sm text-gray-600 mt-1">{selectedColor.toUpperCase()}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-700 mb-2">Target Color:</p>
									<div className="w-full h-16 border-2 border-gray-300 rounded-lg" style={{ backgroundColor: question.targetColor }} />
									<p className="text-sm text-gray-600 mt-1">{question.targetColor.toUpperCase()}</p>
								</div>
							</div>

							{question.explanation && (
								<div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
									<p className="text-blue-800 font-medium">Explanation:</p>
									<p className="text-blue-700 mt-1">{question.explanation}</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
