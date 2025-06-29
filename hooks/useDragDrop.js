"use client";

import { useState, useCallback, useRef } from "react";

export const useDragDrop = (onFileUpload, acceptedTypes = null) => {
	const [isDraggingOver, setIsDraggingOver] = useState(false);
	const dragCounter = useRef(0);

	const handleDragEvents = useCallback((e, isEntering) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDraggingOver(isEntering);
	}, []);

	const handleDrop = useCallback(
		(e) => {
			e.preventDefault();
			e.stopPropagation();
			dragCounter.current = 0;
			setIsDraggingOver(false);

			if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
				const files = Array.from(e.dataTransfer.files);

				// Filter files by accepted types if specified
				const filteredFiles = acceptedTypes ? files.filter((file) => acceptedTypes.some((type) => file.type.startsWith(type))) : files;

				if (filteredFiles.length > 0) {
					onFileUpload(filteredFiles);
				}
				e.dataTransfer.clearData();
			}
		},
		[onFileUpload, acceptedTypes]
	);

	const handlePaste = useCallback(
		(e) => {
			const items = e.clipboardData.items;
			const files = [];

			for (let i = 0; i < items.length; i++) {
				if (items[i].kind === "file") {
					const file = items[i].getAsFile();
					if (file) {
						// Filter by accepted types if specified
						if (!acceptedTypes || acceptedTypes.some((type) => file.type.startsWith(type))) {
							files.push(file);
						}
					}
				}
			}

			if (files.length > 0) {
				e.preventDefault();
				onFileUpload(files);
			}
		},
		[onFileUpload, acceptedTypes]
	);

	const handleDragOver = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const handleDragEnter = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
		dragCounter.current++;
		setIsDraggingOver(true);
	}, []);

	const handleDragLeave = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
		dragCounter.current--;

		// Only set dragging to false when we've completely left the container
		if (dragCounter.current === 0) {
			setIsDraggingOver(false);
		}
	}, []);

	return {
		isDraggingOver,
		handleDragEvents,
		handleDrop,
		handlePaste,
		dragHandlers: {
			onDragEnter: handleDragEnter,
			onDragLeave: handleDragLeave,
			onDragOver: handleDragOver,
			onDrop: handleDrop,
			onPaste: handlePaste,
		},
	};
};
