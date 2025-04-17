import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
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
  const [isScalingMode, setIsScalingMode] = useState(false);
  const [isGrabMode, setIsGrabMode] = useState(false);
  const [isRotateMode, setIsRotateMode] = useState(false);
  const [activeAxis, setActiveAxis] = useState(null);

  const initialTransform = useRef({
    scale: new THREE.Vector3(1, 1, 1),
    position: new THREE.Vector3(),
    rotation: new THREE.Euler()
  });
  const transformFactor = useRef({
    scale: new THREE.Vector3(1, 1, 1),
    position: new THREE.Vector3(),
    rotation: new THREE.Euler()
  });
  const initialMousePos = useRef({ x: 0, y: 0 });

 // Add these methods to the useImperativeHandle in CanvasArea.jsx
useImperativeHandle(ref, () => ({
  highlightModel: (modelName) => highlightModelWrapper(modelName),
  getScene: () => sceneInstance?.scene,
  addPrimitiveToScene: (mesh) => {
    if (!sceneInstance?.scene) return;
    sceneInstance.scene.add(mesh);
    updateLoadedModels(mesh.name, mesh);
    setUploadedModels(prev => [...prev, mesh.name]);
    highlightModelWrapper(mesh.name);
  },
  handleModelRename: (oldName, newName) => {
    setLoadedModels(prev => {
      const model = prev[oldName];
      if (!model) return prev;
      
      const newModels = { ...prev };
      delete newModels[oldName];
      newModels[newName] = model;
      return newModels;
    });
  },
  updateSelectedModel: (oldName, newName) => {
    setSelectedModel(prev => prev === oldName ? newName : prev);
  }
}));

  const updateLoadedModels = (modelName, modelObject) => {
    setLoadedModels(prev => ({
      ...prev,
      [modelName]: modelObject
    }));
  };

  const highlightModelWrapper = (modelName) => {
    highlightModel(modelName, loadedModels, sceneInstance);
    setSelectedModel(modelName);
  };

  const loadModelWrapper = (model) => {
    return loadModelIntoScene(
      model,
      sceneInstance,
      mixers,
      updateLoadedModels
    );
  };

  // Mouse movement handler for transformations
  useEffect(() => {
    if ((!isScalingMode && !isGrabMode && !isRotateMode) || !selectedModel || !loadedModels[selectedModel] || !sceneInstance) return;

    const handleMouseMove = (e) => {
      const canvas = document.getElementById("myThreeJsCanvas");
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (initialMousePos.current.x === 0 && initialMousePos.current.y === 0) {
        initialMousePos.current = { x: mouseX, y: mouseY };
        return;
      }

      const deltaX = mouseX - initialMousePos.current.x;
      const deltaY = mouseY - initialMousePos.current.y;
      const model = loadedModels[selectedModel];

      if (isScalingMode) {
        const movement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        let direction = 1;

        if (activeAxis === 'x') {
          direction = deltaX > 0 ? 1 : -1;
        } else if (activeAxis === 'y') {
          direction = deltaY < 0 ? 1 : -1;
        } else if (activeAxis === 'z') {
          direction = (deltaX + deltaY) > 0 ? 1 : -1;
        } else {
          direction = (deltaX + deltaY) > 0 ? 1 : -1;
        }

        const scaleChange = 1 + direction * movement * 0.005;
        const newScale = new THREE.Vector3().copy(initialTransform.current.scale);

        const worldAxis = new THREE.Vector3();
        if (activeAxis === 'x') worldAxis.set(1, 0, 0);
        else if (activeAxis === 'y') worldAxis.set(0, 1, 0);
        else if (activeAxis === 'z') worldAxis.set(0, 0, 1);

        if (activeAxis) {
          const localAxis = worldAxis.clone().applyQuaternion(model.quaternion.clone().invert());
          const scaleVector = new THREE.Vector3(1, 1, 1).addScaledVector(localAxis, (scaleChange - 1));
          newScale.multiply(scaleVector);
        } else {
          newScale.multiplyScalar(scaleChange);
        }

        newScale.x = THREE.MathUtils.clamp(newScale.x, 0.1, 10);
        newScale.y = THREE.MathUtils.clamp(newScale.y, 0.1, 10);
        newScale.z = THREE.MathUtils.clamp(newScale.z, 0.1, 10);

        model.scale.copy(newScale);
        transformFactor.current.scale.copy(newScale);
      }
      else if (isGrabMode) {
        const movementX = deltaX * 0.01;
        const movementY = -deltaY * 0.01;
        const newPosition = new THREE.Vector3().copy(initialTransform.current.position);

        if (activeAxis === 'x') newPosition.x += movementX;
        else if (activeAxis === 'y') newPosition.y += movementY;
        else if (activeAxis === 'z') newPosition.z += (movementX + movementY) * 0.5;
        else {
          newPosition.x += movementX;
          newPosition.y += movementY;
        }

        model.position.copy(newPosition);
        transformFactor.current.position.copy(newPosition);
      }
      else if (isRotateMode) {
        const rotationAmount = (deltaX + deltaY) * 0.01;
        const newRotation = new THREE.Euler().copy(initialTransform.current.rotation);

        if (activeAxis === 'x') newRotation.x += rotationAmount;
        else if (activeAxis === 'y') newRotation.y += rotationAmount;
        else if (activeAxis === 'z') newRotation.z += rotationAmount;
        else {
          newRotation.y += deltaX * 0.01;
          newRotation.x += deltaY * 0.01;
        }

        model.rotation.copy(newRotation);
        transformFactor.current.rotation.copy(newRotation);
      }
    };

    const handleMouseUp = () => {
      setIsScalingMode(false);
      setIsGrabMode(false);
      setIsRotateMode(false);
      setActiveAxis(null);
      initialMousePos.current = { x: 0, y: 0 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isScalingMode, isGrabMode, isRotateMode, activeAxis, selectedModel, loadedModels, sceneInstance]);

  // Keyboard controls for transformations
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (!selectedModel) return;

      if (key === 's' && !isGrabMode && !isRotateMode) {
        setIsScalingMode(!isScalingMode);
        setIsGrabMode(false);
        setIsRotateMode(false);
        if (!isScalingMode) {
          initialTransform.current.scale.copy(loadedModels[selectedModel].scale);
        }
        e.preventDefault();
      }
      else if (key === 'g' && !isScalingMode && !isRotateMode) {
        setIsGrabMode(!isGrabMode);
        setIsScalingMode(false);
        setIsRotateMode(false);
        if (!isGrabMode) {
          initialTransform.current.position.copy(loadedModels[selectedModel].position);
        }
        e.preventDefault();
      }
      else if (key === 'r' && !isScalingMode && !isGrabMode) {
        setIsRotateMode(!isRotateMode);
        setIsScalingMode(false);
        setIsGrabMode(false);
        if (!isRotateMode) {
          initialTransform.current.rotation.copy(loadedModels[selectedModel].rotation);
        }
        e.preventDefault();
      }

      if (isScalingMode || isGrabMode || isRotateMode) {
        if (key === 'x' || key === 'y' || key === 'z') {
          setActiveAxis(key);
          e.preventDefault();
        }
        else if (key === 'escape') {
          const model = loadedModels[selectedModel];
          if (isScalingMode) model.scale.copy(initialTransform.current.scale);
          else if (isGrabMode) model.position.copy(initialTransform.current.position);
          else if (isRotateMode) model.rotation.copy(initialTransform.current.rotation);

          setIsScalingMode(false);
          setIsGrabMode(false);
          setIsRotateMode(false);
          setActiveAxis(null);
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isScalingMode, isGrabMode, isRotateMode, selectedModel, loadedModels]);

  // Scene initialization and other effects remain the same...
  useEffect(() => {
    const test = new Scene("myThreeJsCanvas");
    test.initialize();
    test.animate();

    const newMixers = [];
    const clock = new THREE.Clock();
    setupModelAnimationLoop(test, newMixers, clock);

    setSceneInstance(test);
    setMixers(newMixers);

    if (!test) return;

    const cleanupClickHandler = setupCanvasClickHandler(test, setSelectedModel);
    return () => cleanupClickHandler();
  }, []);

  useEffect(() => {
    if (!sceneInstance) return;
    const cleanupAnimation = setupAnimationLoop(sceneInstance, selectedModel, loadedModels);
    return cleanupAnimation;
  }, [selectedModel, loadedModels, sceneInstance]);

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
        {(isScalingMode || isGrabMode || isRotateMode) && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded">
            {isScalingMode ? "Scaling Mode" : isGrabMode ? "Move Mode" : "Rotation Mode"}
            {activeAxis && ` (${activeAxis.toUpperCase()} axis)`}
            <div className="text-xs mt-1">
              {isScalingMode && "Press X/Y/Z to scale along axis | ESC to cancel"}
              {isGrabMode && "Press X/Y/Z to move along axis | ESC to cancel"}
              {isRotateMode && "Press X/Y/Z to rotate around axis | ESC to cancel"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default CanvasArea;
