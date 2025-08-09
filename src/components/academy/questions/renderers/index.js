/**
 * Academy Question Renderers - Complete Export Index
 * All 30+ question types and renderers for the Academy system
 */

// Core Question Types
export { MultipleChoiceRenderer } from "./multiple-choice-renderer";
export { TrueFalseRenderer } from "./true-false-renderer";
export { TextInputRenderer } from "./text-input-renderer";
export { EssayRenderer } from "./essay-renderer";

// Interactive & Advanced Types
export { FillInBlankRenderer } from "./fill-in-blank-renderer";
export { SentenceOrderingRenderer } from "./sentence-ordering-renderer";
export { WordMatchingRenderer } from "./word-matching-renderer";
export { SliderRangeRenderer } from "./slider-range-renderer";
export { ColorPickerRenderer } from "./color-picker-renderer";

// Drag & Drop Interactions
export { DragDropCanvasRenderer } from "./drag-drop-canvas-renderer";
export { DragDropCategorizeRenderer } from "./drag-drop-categorize-renderer";
export { DragDropSequenceRenderer } from "./drag-drop-sequence-renderer";

// Image & Visual Interactions
export { ImageHotspotRenderer } from "./image-hotspot-renderer";
export { ImageAnnotationRenderer } from "./image-annotation-renderer";
export { ImageComparisonRenderer } from "./image-comparison-renderer";
export { DiagramLabelingRenderer } from "./diagram-labeling-renderer";

// Builders & Creators
export { TimelineBuilderRenderer } from "./timeline-builder-renderer";
export { FlowchartBuilderRenderer } from "./flowchart-builder-renderer";

// 3D & Immersive Learning
export { Model3DInteractionRenderer } from "./model3-d-interaction-renderer";
export { Model3DAssemblyRenderer } from "./model3-d-assembly-renderer";
export { Scene3DExplorationRenderer } from "./scene3-d-exploration-renderer";
export { Anatomy3DRenderer } from "./anatomy3-d-renderer";
export { Physics3DSimulationRenderer } from "./physics3-d-simulation-renderer";
export { Architecture3DRenderer } from "./architecture3-d-renderer";

// Games & Engagement
export { PuzzleSliderRenderer } from "./puzzle-slider-renderer";
export { MemoryMatchRenderer } from "./memory-match-renderer";
export { SortingGameRenderer } from "./sorting-game-renderer";
export { CrosswordPuzzleRenderer } from "./crossword-puzzle-renderer";

// Simulation & Labs
export { VirtualLabRenderer } from "./virtual-lab-renderer";

// Specialized Renderers (from PlaceholderRenderers)
export { DrawingWhiteboardRenderer, CodeEditorRenderer, AudioIdentificationRenderer, VideoTimestampRenderer, FormulaBuilderRenderer } from "./placeholder-renderers";

// Main Question Renderer Component
export { default as QuestionRenderer } from "../question-renderer";

/**
 * Complete list of available question types:
 *
 * Basic Types:
 * - multiple-choice
 * - true-false
 * - text-input
 * - essay
 *
 * Interactive Types:
 * - fill-in-blank
 * - sentence-ordering
 * - word-matching
 * - slider-range
 * - color-picker
 *
 * Drag & Drop:
 * - drag-drop-canvas
 * - drag-drop-categorize
 * - drag-drop-sequence
 *
 * Visual & Image:
 * - image-hotspot
 * - image-annotation
 * - image-comparison
 * - diagram-labeling
 *
 * Builders:
 * - timeline-builder
 * - flowchart-builder
 * - drawing-whiteboard
 * - code-editor
 * - formula-builder
 *
 * 3D & Immersive:
 * - 3d-model-interaction
 * - 3d-model-assembly
 * - 3d-scene-exploration
 * - 3d-anatomy
 * - 3d-physics-simulation
 * - 3d-architecture
 *
 * Games & Puzzles:
 * - puzzle-slider
 * - memory-match
 * - sorting-game
 * - crossword-puzzle
 *
 * Media & Specialized:
 * - audio-identification
 * - video-timestamp
 * - virtual-lab
 *
 * Total: 30+ different question renderer types
 */
