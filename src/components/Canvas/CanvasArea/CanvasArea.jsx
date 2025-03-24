import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import Scene from "@classes/Scene"; 
import { createFileUploader } from "@utils/UploadUtilis"; 
import { loadGLTFModel, loadFBXModel, setupAnimations, setupAnimationLoop as setupModelAnimationLoop } from "@utils/ModelRenderUtils"; 
import { highlightModel } from "./ModelHighlighter";
import { loadModelIntoScene } from "./ModelLoader";
import { setupDragDropHandlers } from "./DragDropHandler";
import { setupCanvasClickHandler } from "./CanvasClickHandler";
import { setupAnimationLoop } from "./AnimationHandler";

const CanvasArea = forwardRef(({ latestModel, error, setUploadedModels, setUploading, setUploadProgress, setError, uploadedModels }, ref) => {
  const [sceneInstance, setSceneInstance] = useState(null);
  const [mixers, setMixers] = useState([]);
  const [loadedModels, setLoadedModels] = useState({});
  const [selectedModel, setSelectedModel] = useState(null);

  // Neon Edge Outline Shader - Only highlights model edges
  const neonOutlineShader = {
    uniforms: {
      diffuse: { value: new THREE.Color(0x00ff00) },
      opacity: { value: 1.0 },
      glowIntensity: { value: 1.5 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;
      
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        
        vWorldPosition = worldPosition.xyz;
        vViewPosition = -mvPosition.xyz;
        vNormal = normalize(normalMatrix * normal);
        
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 diffuse;
      uniform float opacity;
      uniform float glowIntensity;
      
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;
      
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        
        // Calculate view-independent edge factor
        float edgeFactor = 1.0 - abs(dot(normal, viewDir));
        
        // Calculate surface curvature using derivatives
        vec3 dFdxPos = dFdx(vWorldPosition);
        vec3 dFdyPos = dFdy(vWorldPosition);
        vec3 xnormal = normalize(cross(dFdxPos, normal));
        vec3 ynormal = normalize(cross(dFdyPos, normal));
        float curvature = abs(dot(xnormal, ynormal));
        
        // Combine edge detection methods
        float edge = max(
          step(0.3, edgeFactor),           // View-dependent edges
          step(0.2, 1.0 - curvature)       // Geometric edges
        );
        
        // Smooth transition for edge
        float smoothEdge = smoothstep(0.0, 0.8, edge);
        
        // Discard non-edge fragments
        if (smoothEdge < 0.1) {
          discard;
        }
        
        // Calculate final color with edge intensity
        vec3 finalColor = diffuse * glowIntensity;
        float finalOpacity = opacity * smoothEdge;
        
        gl_FragColor = vec4(finalColor, finalOpacity);
      }
    `
  };

  // Animation time for the neon effect
  const [time, setTime] = useState(0);
  
  // Update shader time parameter for animations
  useEffect(() => {
    let animationFrameId;
    let startTime = Date.now();
    
    const updateTime = () => {
      const currentTime = (Date.now() - startTime) / 1000; // Convert to seconds
      setTime(currentTime);
      
      // Update view matrix for all highlighted models
      if (selectedModel && loadedModels[selectedModel]) {
        const model = loadedModels[selectedModel];
        model.traverse((child) => {
          if (child.userData.outlineMesh && child.userData.outlineMesh.material.uniforms) {
            // Update view matrix uniform if it exists
            if (child.userData.outlineMesh.material.uniforms.viewMatrix) {
              child.userData.outlineMesh.material.uniforms.viewMatrix.value.copy(sceneInstance.camera.matrixWorldInverse);
            }
          }
        });
      }
      
      animationFrameId = requestAnimationFrame(updateTime);
    };
    
    if (sceneInstance) {
      animationFrameId = requestAnimationFrame(updateTime);
    }
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [selectedModel, loadedModels, sceneInstance]);

  // Update loaded models callback
  const updateLoadedModels = (modelName, modelObject) => {
    setLoadedModels(prev => ({
      ...prev,
      [modelName]: modelObject
    }));
  };

  // Function to highlight model (wrapper)
  const highlightModelWrapper = (modelName) => {
    console.log('CanvasArea - highlightModel called with:', modelName);
    highlightModel(modelName, loadedModels, sceneInstance);
    setSelectedModel(modelName);
  };

  // Function to load model (wrapper)
  const loadModelWrapper = (model) => {
    return loadModelIntoScene(
      model, 
      sceneInstance, 
      mixers, 
      updateLoadedModels
    );
  };

  // Expose highlight function via ref
  useImperativeHandle(ref, () => ({
    highlightModel: (modelName) => {
      console.log('Highlighting model:', modelName);
      highlightModelWrapper(modelName);
    }
  }));

  // Initialize scene
  useEffect(() => {
    const test = new Scene("myThreeJsCanvas"); 
    test.initialize(); 
    test.animate(); 

    const newMixers = [];
    const clock = new THREE.Clock(); 
    setupModelAnimationLoop(test, newMixers, clock);

    setSceneInstance(test);
    setMixers(newMixers);

    // Setup canvas click handler
    const cleanupClickHandler = setupCanvasClickHandler(() => highlightModelWrapper(null));

    return () => {
      cleanupClickHandler();
    };
  }, []);

  // Setup animation loop for shader updates
  useEffect(() => {
    if (!sceneInstance) return;
    
    const cleanupAnimation = setupAnimationLoop(sceneInstance, selectedModel, loadedModels);
    
    return cleanupAnimation;
  }, [selectedModel, loadedModels, sceneInstance]);
  
  // Setup drag and drop handlers
  useEffect(() => {
    if (!sceneInstance) return;
    
    const cleanupDragDrop = setupDragDropHandlers(
      sceneInstance,
      loadModelWrapper,
      setUploadedModels,
      setError,
      setUploading,
      setUploadProgress
    );
    
    return cleanupDragDrop;
  }, [sceneInstance]);

  // Load latest model when it changes
  useEffect(() => {
    if (latestModel) {
      loadModelWrapper(latestModel);
    }
  }, [latestModel]);

  return (
    <div
      id="canvasContainer"
      role="main"
      aria-label="Canvas workspace"
      className="flex w-full h-full rounded-lg bg-neutral-600"
    >
      <div className="flex-grow flex justify-center items-center w-full h-full rounded-xl overflow-hidden shadow-2xl">
        <canvas
          id="myThreeJsCanvas"
          className="w-full h-full bg-gray-950 border border-gray-700"
        />
      </div>
    </div>
  );
});

export default CanvasArea;
