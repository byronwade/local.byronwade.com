// Comprehensive Question Type System - Supports 20+ Interactive Question Types

export type QuestionType =
	// Text-based Questions
	| "multiple-choice"
	| "true-false"
	| "text-input"
	| "essay"
	| "fill-in-blank"
	| "word-matching"
	| "sentence-ordering"

	// Visual & Interactive Questions
	| "image-hotspot"
	| "image-annotation"
	| "drag-drop-canvas"
	| "drag-drop-categorize"
	| "drag-drop-sequence"
	| "drawing-whiteboard"
	| "diagram-labeling"
	| "slider-range"
	| "color-picker"

	// Media Questions
	| "audio-identification"
	| "video-timestamp"
	| "image-comparison"

	// Interactive Components
	| "code-editor"
	| "formula-builder"
	| "timeline-builder"
	| "flowchart-builder"
	| "3d-model-interaction"

	// Games & Puzzles
	| "puzzle-slider"
	| "memory-match"
	| "sorting-game"
	| "crossword-puzzle"
	| "maze-navigation"
	| "music-sequence"
	| "pattern-recognition"
	| "virtual-keyboard"

	// Virtual Environments
	| "virtual-lab"

	// 3D Immersive Questions
	| "3d-model-assembly"
	| "3d-scene-exploration"
	| "3d-anatomy"
	| "3d-physics-simulation"
	| "3d-architecture";

// Base question interface
export interface BaseQuestion {
	id: string;
	type: QuestionType;
	title: string;
	description?: string;
	points: number;
	timeLimit?: number; // in seconds
	explanation: string;
	hints?: string[];
	tags?: string[];
	difficulty: "easy" | "medium" | "hard";
	metadata?: Record<string, any>;
}

// Answer validation interface
export interface AnswerValidation {
	correctAnswer: any;
	partialCredit?: boolean;
	caseSensitive?: boolean;
	tolerance?: number; // for numeric answers
	acceptableVariations?: string[]; // for text answers
	rubric?: GradingRubric[];
}

export interface GradingRubric {
	criteria: string;
	points: number;
	description: string;
}

// Specific question type interfaces
export interface MultipleChoiceQuestion extends BaseQuestion {
	type: "multiple-choice";
	options: {
		id: string;
		text: string;
		isCorrect: boolean;
		explanation?: string;
	}[];
	allowMultiple?: boolean;
	randomizeOrder?: boolean;
}

export interface TextInputQuestion extends BaseQuestion {
	type: "text-input";
	placeholder?: string;
	maxLength?: number;
	validation: AnswerValidation;
}

export interface EssayQuestion extends BaseQuestion {
	type: "essay";
	minWords?: number;
	maxWords?: number;
	rubric: GradingRubric[];
	sampleAnswer?: string;
}

export interface FillInBlankQuestion extends BaseQuestion {
	type: "fill-in-blank";
	template: string; // Text with {{blank}} placeholders
	blanks: {
		id: string;
		correctAnswers: string[];
		placeholder?: string;
	}[];
}

export interface DragDropCanvasQuestion extends BaseQuestion {
	type: "drag-drop-canvas";
	canvas: {
		width: number;
		height: number;
		backgroundImage?: string;
		gridSize?: number;
	};
	draggableItems: {
		id: string;
		content: string;
		type: "text" | "image" | "icon";
		src?: string;
	}[];
	dropZones: {
		id: string;
		x: number;
		y: number;
		width: number;
		height: number;
		acceptsItems: string[]; // draggableItem ids
		label?: string;
	}[];
	correctPlacements: {
		itemId: string;
		zoneId: string;
	}[];
}

export interface DrawingWhiteboardQuestion extends BaseQuestion {
	type: "drawing-whiteboard";
	canvas: {
		width: number;
		height: number;
		backgroundImage?: string;
	};
	tools: ("pen" | "eraser" | "shapes" | "text")[];
	expectedElements?: {
		type: "line" | "circle" | "rectangle" | "text";
		approximate: boolean;
		description: string;
	}[];
}

export interface ImageHotspotQuestion extends BaseQuestion {
	type: "image-hotspot";
	image: {
		src: string;
		width: number;
		height: number;
		alt: string;
	};
	hotspots: {
		id: string;
		x: number;
		y: number;
		radius: number;
		isCorrect: boolean;
		feedback: string;
	}[];
	maxSelections?: number;
}

export interface SliderRangeQuestion extends BaseQuestion {
	type: "slider-range";
	slider: {
		min: number;
		max: number;
		step: number;
		unit: string;
		correctValue: number;
		tolerance: number;
	};
}

export interface CodeEditorQuestion extends BaseQuestion {
	type: "code-editor";
	language: "javascript" | "python" | "html" | "css" | "sql";
	starterCode?: string;
	expectedOutput?: string;
	testCases?: {
		input: any;
		expectedOutput: any;
		description: string;
	}[];
}

export interface TimelineBuilderQuestion extends BaseQuestion {
	type: "timeline-builder";
	events: {
		id: string;
		title: string;
		description: string;
		date?: string; // if pre-positioned
	}[];
	correctOrder: string[]; // event ids in correct chronological order
}

export interface AudioIdentificationQuestion extends BaseQuestion {
	type: "audio-identification";
	audioSrc: string;
	duration: number;
	options: {
		id: string;
		text: string;
		isCorrect: boolean;
	}[];
}

export interface VideoTimestampQuestion extends BaseQuestion {
	type: "video-timestamp";
	videoSrc: string;
	question: string;
	correctTimestamps: {
		start: number; // in seconds
		end: number;
		description: string;
	}[];
}

export interface DiagramLabelingQuestion extends BaseQuestion {
	type: "diagram-labeling";
	diagram: {
		src: string;
		width: number;
		height: number;
	};
	labels: {
		id: string;
		text: string;
	}[];
	labelPoints: {
		id: string;
		x: number;
		y: number;
		correctLabelId: string;
	}[];
}

export interface FormulaBuilderQuestion extends BaseQuestion {
	type: "formula-builder";
	components: {
		id: string;
		symbol: string;
		type: "operator" | "variable" | "constant" | "function";
	}[];
	correctFormula: string; // LaTeX format
	variables?: {
		[key: string]: {
			description: string;
			unit?: string;
		};
	};
}

export interface WordMatchingQuestion extends BaseQuestion {
	type: "word-matching";
	leftColumn: {
		id: string;
		text: string;
	}[];
	rightColumn: {
		id: string;
		text: string;
	}[];
	correctMatches: {
		leftId: string;
		rightId: string;
	}[];
}

export interface TrueFalseQuestion extends BaseQuestion {
	type: "true-false";
	statement: string;
	correctAnswer: boolean;
	trueExplanation: string;
	falseExplanation: string;
}

export interface SentenceOrderingQuestion extends BaseQuestion {
	type: "sentence-ordering";
	sentences: {
		id: string;
		text: string;
		order: number;
	}[];
	correctOrder: string[]; // sentence ids in correct order
}

export interface ImageAnnotationQuestion extends BaseQuestion {
	type: "image-annotation";
	image: {
		src: string;
		width: number;
		height: number;
		alt: string;
	};
	annotations: {
		id: string;
		x: number;
		y: number;
		label: string;
		description?: string;
	}[];
	userCanAddAnnotations?: boolean;
	maxAnnotations?: number;
}

export interface DragDropCategorizeQuestion extends BaseQuestion {
	type: "drag-drop-categorize";
	items: {
		id: string;
		content: string;
		category: string;
		type: "text" | "image";
		src?: string;
	}[];
	categories: {
		id: string;
		name: string;
		description?: string;
		color?: string;
	}[];
	correctCategorization: {
		itemId: string;
		categoryId: string;
	}[];
}

export interface DragDropSequenceQuestion extends BaseQuestion {
	type: "drag-drop-sequence";
	items: {
		id: string;
		content: string;
		type: "text" | "image";
		src?: string;
	}[];
	correctSequence: string[]; // item ids in correct order
	sequenceType: "chronological" | "procedural" | "alphabetical" | "numerical";
}

export interface ColorPickerQuestion extends BaseQuestion {
	type: "color-picker";
	scenario: string;
	targetColor: string; // hex color
	tolerance: number; // color matching tolerance
	colorSpace: "hex" | "rgb" | "hsl";
	previewImage?: string; // optional image to show color on
}

export interface ImageComparisonQuestion extends BaseQuestion {
	type: "image-comparison";
	images: {
		id: string;
		src: string;
		alt: string;
	}[];
	differences: {
		id: string;
		imageId: string;
		x: number;
		y: number;
		radius: number;
		description: string;
	}[];
	maxFinds?: number;
	timeLimit?: number;
}

export interface FlowchartBuilderQuestion extends BaseQuestion {
	type: "flowchart-builder";
	nodes: {
		id: string;
		type: "start" | "process" | "decision" | "end";
		content: string;
	}[];
	connections: {
		fromId: string;
		toId: string;
		label?: string;
	}[];
	correctFlowchart: {
		nodeId: string;
		x: number;
		y: number;
	}[];
}

export interface Model3DInteractionQuestion extends BaseQuestion {
	type: "3d-model-interaction";
	modelSrc: string;
	interactionType: "rotate" | "highlight" | "assemble";
	targets: {
		id: string;
		name: string;
		description: string;
		coordinates?: { x: number; y: number; z: number };
	}[];
	correctInteractions: string[]; // target ids
}

export interface PuzzleSliderQuestion extends BaseQuestion {
	type: "puzzle-slider";
	puzzle: {
		imageSrc: string;
		rows: number;
		cols: number;
		width: number;
		height: number;
	};
	maxMoves?: number;
	timeLimit?: number;
}

export interface VirtualLabQuestion extends BaseQuestion {
	type: "virtual-lab";
	labType: "chemistry" | "physics" | "biology" | "plumbing";
	equipment: {
		id: string;
		name: string;
		type: "tool" | "material" | "container";
		properties: Record<string, any>;
	}[];
	procedures: {
		id: string;
		step: string;
		requiredEquipment: string[];
		result?: string;
	}[];
	expectedResults: string[];
}

export interface MemoryMatchQuestion extends BaseQuestion {
	type: "memory-match";
	cards: {
		id: string;
		content: string;
		type: "text" | "image";
		src?: string;
		matchGroup: string;
	}[];
	maxAttempts?: number;
	showTime?: number; // milliseconds to show cards initially
}

export interface SortingGameQuestion extends BaseQuestion {
	type: "sorting-game";
	items: {
		id: string;
		content: string;
		value: number | string;
		type: "text" | "image";
		src?: string;
	}[];
	sortCriteria: "numerical" | "alphabetical" | "chronological" | "size" | "custom";
	sortOrder: "ascending" | "descending";
	customOrder?: string[]; // for custom sort criteria
}

export interface CrosswordPuzzleQuestion extends BaseQuestion {
	type: "crossword-puzzle";
	grid: {
		width: number;
		height: number;
		cells: {
			x: number;
			y: number;
			letter?: string;
			isBlocked?: boolean;
			number?: number;
		}[];
	};
	clues: {
		id: string;
		number: number;
		direction: "across" | "down";
		clue: string;
		answer: string;
		startX: number;
		startY: number;
	}[];
}

export interface MazeNavigationQuestion extends BaseQuestion {
	type: "maze-navigation";
	maze: {
		width: number;
		height: number;
		start: { x: number; y: number };
		end: { x: number; y: number };
		walls: { x: number; y: number }[];
		collectibles?: { x: number; y: number; id: string; points: number }[];
	};
	maxMoves?: number;
	requiredCollectibles?: string[];
}

export interface MusicSequenceQuestion extends BaseQuestion {
	type: "music-sequence";
	sequence: {
		id: string;
		note: string;
		duration: number;
		frequency?: number;
	}[];
	userCanPlay: boolean;
	playbackSpeed: number;
	maxAttempts?: number;
}

export interface PatternRecognitionQuestion extends BaseQuestion {
	type: "pattern-recognition";
	patterns: {
		id: string;
		sequence: (string | number)[];
		type: "numeric" | "color" | "shape" | "letter";
	}[];
	missingElements: {
		patternId: string;
		position: number;
		options: (string | number)[];
		correctAnswer: string | number;
	}[];
}

export interface VirtualKeyboardQuestion extends BaseQuestion {
	type: "virtual-keyboard";
	targetText: string;
	keyboardLayout: "qwerty" | "dvorak" | "azerty" | "custom";
	customKeys?: {
		key: string;
		position: { row: number; col: number };
		width?: number;
	}[];
	typingChallenge: {
		timeLimit?: number;
		accuracyRequired: number; // percentage
		wpmRequired?: number;
	};
}

export interface Model3DAssemblyQuestion extends BaseQuestion {
	type: "3d-model-assembly";
	scene: {
		backgroundColor: string;
		lighting: "ambient" | "directional" | "point" | "mixed";
	};
	components: {
		id: string;
		name: string;
		modelUrl?: string;
		geometry: "box" | "sphere" | "cylinder" | "custom";
		material: {
			color: string;
			type: "basic" | "standard" | "physical";
			roughness?: number;
			metalness?: number;
		};
		dimensions: { width: number; height: number; depth: number };
		targetPosition: { x: number; y: number; z: number };
		targetRotation: { x: number; y: number; z: number };
		connectionPoints?: { x: number; y: number; z: number }[];
	}[];
	assemblyOrder: string[];
	tolerance: number; // Position tolerance for correct placement
	showWireframe?: boolean;
	allowFreeRotation?: boolean;
}

export interface Scene3DExplorationQuestion extends BaseQuestion {
	type: "3d-scene-exploration";
	scene: {
		environmentUrl?: string;
		backgroundColor: string;
		fog?: { color: string; near: number; far: number };
	};
	camera: {
		position: { x: number; y: number; z: number };
		lookAt: { x: number; y: number; z: number };
		controls: "orbit" | "fly" | "first-person";
		restrictions?: {
			minDistance?: number;
			maxDistance?: number;
			minPolarAngle?: number;
			maxPolarAngle?: number;
		};
	};
	objects: {
		id: string;
		name: string;
		description: string;
		position: { x: number; y: number; z: number };
		geometry: "box" | "sphere" | "cylinder" | "plane" | "custom";
		material: {
			color?: string;
			texture?: string;
			emissive?: string;
		};
		isTarget: boolean;
		hidden?: boolean;
		animation?: {
			type: "rotation" | "position" | "scale";
			duration: number;
			repeat: boolean;
		};
	}[];
	findTargets: string[]; // object IDs to find
	timeLimit?: number;
	hintSystem?: {
		enabled: boolean;
		maxHints: number;
		hintCooldown: number; // seconds
	};
}

export interface Anatomy3DQuestion extends BaseQuestion {
	type: "3d-anatomy";
	anatomyType: "human" | "animal" | "plant" | "mechanical";
	model: {
		baseModelUrl?: string;
		scale: number;
		position: { x: number; y: number; z: number };
		defaultView: "front" | "back" | "side" | "top" | "isometric";
	};
	bodyParts: {
		id: string;
		name: string;
		description: string;
		position: { x: number; y: number; z: number };
		color: string;
		system: string; // "skeletal", "muscular", "nervous", etc.
		isVisible: boolean;
		isTarget: boolean;
		connectedTo?: string[]; // IDs of connected parts
	}[];
	interactionMode: "identify" | "assemble" | "systems" | "quiz";
	showSystems: string[]; // Which body systems to display
	labelingRequired: boolean;
	crossSection?: {
		enabled: boolean;
		plane: "x" | "y" | "z";
		position: number;
		animated: boolean;
	};
}

export interface Physics3DSimulationQuestion extends BaseQuestion {
	type: "3d-physics-simulation";
	simulation: {
		gravity: { x: number; y: number; z: number };
		timeScale: number;
		damping: number;
		substeps: number;
	};
	environment: {
		floor: boolean;
		walls?: { front: boolean; back: boolean; left: boolean; right: boolean };
		boundaries: { width: number; height: number; depth: number };
	};
	objects: {
		id: string;
		name: string;
		type: "dynamic" | "static" | "kinematic";
		geometry: "box" | "sphere" | "cylinder" | "custom";
		material: {
			color: string;
			roughness: number;
			metalness: number;
		};
		physics: {
			mass: number;
			restitution: number; // bounciness
			friction: number;
			initialVelocity?: { x: number; y: number; z: number };
			initialPosition: { x: number; y: number; z: number };
		};
		dimensions: { width: number; height: number; depth: number };
	}[];
	challenge: {
		type: "trajectory" | "collision" | "balance" | "timing";
		description: string;
		successCondition: {
			targetObject: string;
			condition: "position" | "velocity" | "contact" | "stability";
			threshold: number;
			duration?: number; // seconds to maintain condition
		};
	};
	tools?: {
		addForce: boolean;
		addTorque: boolean;
		adjustMass: boolean;
		resetSimulation: boolean;
	};
	maxAttempts?: number;
	timeLimit?: number;
}

export interface Architecture3DQuestion extends BaseQuestion {
	type: "3d-architecture";
	buildingType: "house" | "bridge" | "tower" | "complex" | "custom";
	blueprint: {
		dimensions: { width: number; height: number; depth: number };
		floors: number;
		foundationType: "slab" | "basement" | "crawlspace" | "piers";
	};
	components: {
		id: string;
		name: string;
		category: "structural" | "plumbing" | "electrical" | "hvac" | "finishing";
		geometry: "box" | "cylinder" | "custom";
		material: {
			type: "wood" | "steel" | "concrete" | "brick" | "pipe" | "wire";
			color: string;
			texture?: string;
		};
		dimensions: { width: number; height: number; depth: number };
		requiredPosition: { x: number; y: number; z: number };
		requiredRotation: { x: number; y: number; z: number };
		prerequisites?: string[]; // Component IDs that must be placed first
		cost?: number;
		specifications?: Record<string, any>;
	}[];
	buildingPhases: {
		phaseId: string;
		name: string;
		description: string;
		requiredComponents: string[];
		allowedComponents: string[];
		constraints?: {
			maxComponents?: number;
			budgetLimit?: number;
			timeLimit?: number;
		};
	}[];
	currentPhase: string;
	validationRules: {
		structural: boolean;
		codeCompliance: boolean;
		functionality: boolean;
	};
	viewModes: {
		xray: boolean;
		blueprint: boolean;
		layers: string[];
	};
}

// Union type for all question types
export type Question =
	| MultipleChoiceQuestion
	| TextInputQuestion
	| EssayQuestion
	| FillInBlankQuestion
	| DragDropCanvasQuestion
	| DrawingWhiteboardQuestion
	| ImageHotspotQuestion
	| SliderRangeQuestion
	| CodeEditorQuestion
	| TimelineBuilderQuestion
	| AudioIdentificationQuestion
	| VideoTimestampQuestion
	| DiagramLabelingQuestion
	| FormulaBuilderQuestion
	| WordMatchingQuestion
	| TrueFalseQuestion
	| SentenceOrderingQuestion
	| ImageAnnotationQuestion
	| DragDropCategorizeQuestion
	| DragDropSequenceQuestion
	| ColorPickerQuestion
	| ImageComparisonQuestion
	| FlowchartBuilderQuestion
	| Model3DInteractionQuestion
	| PuzzleSliderQuestion
	| VirtualLabQuestion
	| MemoryMatchQuestion
	| SortingGameQuestion
	| CrosswordPuzzleQuestion
	| MazeNavigationQuestion
	| MusicSequenceQuestion
	| PatternRecognitionQuestion
	| VirtualKeyboardQuestion
	| Model3DAssemblyQuestion
	| Scene3DExplorationQuestion
	| Anatomy3DQuestion
	| Physics3DSimulationQuestion
	| Architecture3DQuestion;

// User answer interface
export interface UserAnswer {
	questionId: string;
	answer: any;
	timestamp: Date;
	timeSpent: number; // in seconds
	isCorrect: boolean;
	partialCredit?: number; // 0-1
	feedback?: string;
}

// Question result interface
export interface QuestionResult {
	question: Question;
	userAnswer: UserAnswer;
	maxPoints: number;
	earnedPoints: number;
	feedback: string;
}
