"use client";
import { Question, UserAnswer } from "@types/academy/questions";
import { MultipleChoiceRenderer } from "./renderers/MultipleChoiceRenderer";
import { TextInputRenderer } from "./renderers/TextInputRenderer";
import { EssayRenderer } from "./renderers/EssayRenderer";
import { FillInBlankRenderer } from "./renderers/FillInBlankRenderer";
import { DragDropCanvasRenderer } from "./renderers/DragDropCanvasRenderer";
import { SliderRangeRenderer } from "./renderers/SliderRangeRenderer";
import { ImageHotspotRenderer } from "./renderers/ImageHotspotRenderer";
import { TimelineBuilderRenderer } from "./renderers/TimelineBuilderRenderer";
import { WordMatchingRenderer } from "./renderers/WordMatchingRenderer";
import { TrueFalseRenderer } from "./renderers/TrueFalseRenderer";
import { SentenceOrderingRenderer } from "./renderers/SentenceOrderingRenderer";
import { DragDropCategorizeRenderer } from "./renderers/DragDropCategorizeRenderer";
import { DragDropSequenceRenderer } from "./renderers/DragDropSequenceRenderer";
import { ColorPickerRenderer } from "./renderers/ColorPickerRenderer";
import { ImageAnnotationRenderer } from "./renderers/ImageAnnotationRenderer";
import { ImageComparisonRenderer } from "./renderers/ImageComparisonRenderer";
import { FlowchartBuilderRenderer } from "./renderers/FlowchartBuilderRenderer";
import { Model3DInteractionRenderer } from "./renderers/Model3DInteractionRenderer";
import { DiagramLabelingRenderer } from "./renderers/DiagramLabelingRenderer";
import { DrawingWhiteboardRenderer, CodeEditorRenderer, AudioIdentificationRenderer, VideoTimestampRenderer, FormulaBuilderRenderer } from "./renderers/PlaceholderRenderers";
import { PuzzleSliderRenderer } from "./renderers/PuzzleSliderRenderer";
import { VirtualLabRenderer } from "./renderers/VirtualLabRenderer";
import { MemoryMatchRenderer } from "./renderers/MemoryMatchRenderer";
import { SortingGameRenderer } from "./renderers/SortingGameRenderer";
import { CrosswordPuzzleRenderer } from "./renderers/CrosswordPuzzleRenderer";
import { Model3DAssemblyRenderer } from "./renderers/Model3DAssemblyRenderer";
import { Scene3DExplorationRenderer } from "./renderers/Scene3DExplorationRenderer";
import { Anatomy3DRenderer } from "./renderers/Anatomy3DRenderer";
import { Physics3DSimulationRenderer } from "./renderers/Physics3DSimulationRenderer";
import { Architecture3DRenderer } from "./renderers/Architecture3DRenderer";

interface QuestionRendererProps {
	question: Question;
	onAnswer: (answer: any) => void;
	isAnswered: boolean;
	userAnswer?: any;
	showFeedback?: boolean;
	disabled?: boolean;
}

export default function QuestionRenderer({ question, onAnswer, isAnswered, userAnswer, showFeedback = false, disabled = false }: QuestionRendererProps) {
	const commonProps = {
		question,
		onAnswer,
		isAnswered,
		userAnswer,
		showFeedback,
		disabled,
	};

	// Render different question types based on the type field
	switch (question.type) {
		case "multiple-choice":
			return <MultipleChoiceRenderer {...commonProps} question={question} />;

		case "true-false":
			return <TrueFalseRenderer {...commonProps} question={question} />;

		case "text-input":
			return <TextInputRenderer {...commonProps} question={question} />;

		case "essay":
			return <EssayRenderer {...commonProps} question={question} />;

		case "fill-in-blank":
			return <FillInBlankRenderer {...commonProps} question={question} />;

		case "sentence-ordering":
			return <SentenceOrderingRenderer {...commonProps} question={question} />;

		case "word-matching":
			return <WordMatchingRenderer {...commonProps} question={question} />;

		case "image-hotspot":
			return <ImageHotspotRenderer {...commonProps} question={question} />;

		case "image-annotation":
			return <ImageAnnotationRenderer {...commonProps} question={question} />;

		case "image-comparison":
			return <ImageComparisonRenderer {...commonProps} question={question} />;

		case "drag-drop-canvas":
			return <DragDropCanvasRenderer {...commonProps} question={question} />;

		case "drag-drop-categorize":
			return <DragDropCategorizeRenderer {...commonProps} question={question} />;

		case "drag-drop-sequence":
			return <DragDropSequenceRenderer {...commonProps} question={question} />;

		case "drawing-whiteboard":
			return <DrawingWhiteboardRenderer {...commonProps} question={question} />;

		case "diagram-labeling":
			return <DiagramLabelingRenderer {...commonProps} question={question} />;

		case "slider-range":
			return <SliderRangeRenderer {...commonProps} question={question} />;

		case "color-picker":
			return <ColorPickerRenderer {...commonProps} question={question} />;

		case "audio-identification":
			return <AudioIdentificationRenderer {...commonProps} question={question} />;

		case "video-timestamp":
			return <VideoTimestampRenderer {...commonProps} question={question} />;

		case "code-editor":
			return <CodeEditorRenderer {...commonProps} question={question} />;

		case "formula-builder":
			return <FormulaBuilderRenderer {...commonProps} question={question} />;

		case "timeline-builder":
			return <TimelineBuilderRenderer {...commonProps} question={question} />;

		case "flowchart-builder":
			return <FlowchartBuilderRenderer {...commonProps} question={question} />;

		case "3d-model-interaction":
			return <Model3DInteractionRenderer {...commonProps} question={question} />;

		case "puzzle-slider":
			return <PuzzleSliderRenderer {...commonProps} question={question} />;

		case "virtual-lab":
			return <VirtualLabRenderer {...commonProps} question={question} />;

		case "memory-match":
			return <MemoryMatchRenderer {...commonProps} question={question} />;

		case "sorting-game":
			return <SortingGameRenderer {...commonProps} question={question} />;

		case "crossword-puzzle":
			return <CrosswordPuzzleRenderer {...commonProps} question={question} />;

		case "3d-model-assembly":
			return <Model3DAssemblyRenderer {...commonProps} question={question} />;

		case "3d-scene-exploration":
			return <Scene3DExplorationRenderer {...commonProps} question={question} />;

		case "3d-anatomy":
			return <Anatomy3DRenderer {...commonProps} question={question} />;

		case "3d-physics-simulation":
			return <Physics3DSimulationRenderer {...commonProps} question={question} />;

		case "3d-architecture":
			return <Architecture3DRenderer {...commonProps} question={question} />;

		// Add more cases as we implement more question types
		default:
			return (
				<div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
					<p className="text-red-600 font-medium">Question type &quot;{(question as any).type}&quot; not yet implemented</p>
					<p className="text-red-500 text-sm mt-2">This question type is supported but the renderer component needs to be created.</p>
				</div>
			);
	}
}
