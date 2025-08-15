"use client";

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { 
  RotateCcw, 
  Maximize, 
  Box, 
  Eye,
  Move3D,
  Loader2,
  X
} from "lucide-react";

/**
 * Enhanced 3D Product Viewer with Three.js
 * Features: Interactive rotation, zoom, professional lighting, mobile-optimized controls
 */
export default function Product3DViewer({ 
  productName, 
  productCategory = "product",
  className = "",
  showControls = true,
  autoRotate = false
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);
  const animationIdRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotateEnabled, setAutoRotateEnabled] = useState(autoRotate);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    try {
      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf8fafc); // Light gray background
      sceneRef.current = scene;

      // Camera setup - optimized for product viewing
      const camera = new THREE.PerspectiveCamera(
        45, // Field of view
        1, // Aspect ratio (will be updated)
        0.1,
        1000
      );
      camera.position.set(5, 3, 8);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // Renderer setup with high quality settings
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(400, 400);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      rendererRef.current = renderer;

      // Professional lighting setup
      setupLighting(scene);

      // Create product display
      createProductDisplay(scene);

      // Add to DOM
      mountRef.current.appendChild(renderer.domElement);

      // Handle resize
      const handleResize = () => {
        if (!mountRef.current) return;
        
        const container = mountRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      // Add event listeners
      window.addEventListener('resize', handleResize);
      handleResize();

      // Add mouse/touch controls
      addInteractionControls(renderer.domElement, camera);

      // Start animation loop
      animate();

      setIsLoading(false);

    } catch (err) {
      console.error('3D Viewer initialization error:', err);
      setError('Failed to load 3D viewer');
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Professional lighting setup
  const setupLighting = (scene) => {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    // Main key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(10, 10, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.camera.left = -10;
    keyLight.shadow.camera.right = 10;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    scene.add(keyLight);

    // Fill light (opposite side)
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-10, 5, -5);
    scene.add(fillLight);

    // Rim light (from behind)
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, 10, -10);
    scene.add(rimLight);

    // Bottom bounce light
    const bounceLight = new THREE.DirectionalLight(0x87ceeb, 0.2);
    bounceLight.position.set(0, -10, 0);
    scene.add(bounceLight);
  };

  // Create product display without platform
  const createProductDisplay = (scene) => {
    // Create product representation (rounded cube for now)
    const productGeometry = new THREE.BoxGeometry(2, 2, 2);
    // Round the edges
    const edges = new THREE.EdgesGeometry(productGeometry);
    
    // Main product material - premium look
    const productMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x3b82f6, // Thorbis blue
      metalness: 0.7,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1
    });

    const productMesh = new THREE.Mesh(productGeometry, productMaterial);
    productMesh.position.y = 0;
    productMesh.castShadow = true;
    productMesh.receiveShadow = true;
    meshRef.current = productMesh;
    scene.add(productMesh);

    // Add subtle edge highlighting
    const edgeMaterial = new THREE.LineBasicMaterial({ 
      color: 0x64748b, 
      transparent: true, 
      opacity: 0.3 
    });
    const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
    productMesh.add(edgeLines);

    // Add logo or branding (simple for now)
    const logoGeometry = new THREE.PlaneGeometry(0.8, 0.3);
    const logoMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9
    });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(0, 0, 1.01);
    productMesh.add(logo);
  };

  // Add mouse/touch interaction controls
  const addInteractionControls = (canvas, camera) => {
    let lastX = 0;
    let lastY = 0;

    const handleStart = (clientX, clientY) => {
      isDraggingRef.current = true;
      lastX = clientX;
      lastY = clientY;
      setAutoRotateEnabled(false);
    };

    const handleMove = (clientX, clientY) => {
      if (!isDraggingRef.current || !meshRef.current) return;

      const deltaX = clientX - lastX;
      const deltaY = clientY - lastY;

      // Rotate the product
      meshRef.current.rotation.y += deltaX * 0.01;
      meshRef.current.rotation.x += deltaY * 0.01;

      // Limit vertical rotation
      meshRef.current.rotation.x = Math.max(
        -Math.PI / 3, 
        Math.min(Math.PI / 3, meshRef.current.rotation.x)
      );

      lastX = clientX;
      lastY = clientY;
    };

    const handleEnd = () => {
      isDraggingRef.current = false;
    };

    // Mouse events
    canvas.addEventListener('mousedown', (e) => {
      handleStart(e.clientX, e.clientY);
    });

    canvas.addEventListener('mousemove', (e) => {
      handleMove(e.clientX, e.clientY);
    });

    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseleave', handleEnd);

    // Touch events
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    });

    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleEnd();
    });

    // Zoom with mouse wheel
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoom = e.deltaY > 0 ? 1.1 : 0.9;
      camera.position.multiplyScalar(zoom);
      
      // Limit zoom range
      const distance = camera.position.length();
      if (distance < 4) camera.position.normalize().multiplyScalar(4);
      if (distance > 15) camera.position.normalize().multiplyScalar(15);
    });
  };

  // Animation loop
  const animate = () => {
    animationIdRef.current = requestAnimationFrame(animate);

    if (autoRotateEnabled && meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }

    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  // Control functions
  const resetView = () => {
    if (meshRef.current && cameraRef.current) {
      meshRef.current.rotation.set(0, 0, 0);
      cameraRef.current.position.set(5, 3, 8);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  const toggleAutoRotate = () => {
    setAutoRotateEnabled(!autoRotateEnabled);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (error) {
    return (
      <div className={`bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 ${className}`}>
        <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
          <div className="text-center">
            <Box className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">3D viewer unavailable</p>
            <p className="text-xs mt-1">Fallback to 2D images</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex items-center justify-between">
          <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
            <Move3D className="h-3 w-3 mr-1" />
            3D View
          </Badge>
          
          {showControls && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetView}
                className="h-8 w-8 p-0 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
                title="Reset view"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAutoRotate}
                className={`h-8 w-8 p-0 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 ${
                  autoRotateEnabled ? 'text-blue-600' : ''
                }`}
                title="Auto rotate"
              >
                <Eye className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="h-8 w-8 p-0 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
                title="Fullscreen"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 3D Viewer Container */}
      <div 
        ref={mountRef}
        className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-900' : 'aspect-square'}`}
        style={{ minHeight: isFullscreen ? '100vh' : '400px' }}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 dark:bg-slate-900/80">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-slate-600 dark:text-slate-400">Loading 3D view...</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-3">
          <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
            <span className="hidden sm:inline">Drag to rotate • Scroll to zoom • </span>
            <span className="sm:hidden">Touch to rotate • Pinch to zoom • </span>
            Click controls to reset
          </p>
        </div>
      </div>

      {/* Fullscreen overlay close button */}
      {isFullscreen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-20 h-10 w-10 p-0 bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
