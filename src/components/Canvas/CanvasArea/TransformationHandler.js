import { highlightModel } from './ModelHighlighter';
import * as THREE from 'three';

export const setupTransformControls = (
  sceneInstance,
  selectedModel,
  loadedModels,
  isScalingMode,
  isGrabMode,
  isRotateMode,
  activeAxis,
  initialTransform,
  transformFactor,
  initialMousePos,
  setIsScalingMode,
  setIsGrabMode,
  setIsRotateMode,
  setActiveAxis,
  highlightModel 
) => {
  if ((!isScalingMode && !isGrabMode && !isRotateMode) || !selectedModel || !loadedModels[selectedModel] || !sceneInstance) {
    return () => {}; // Return empty cleanup function
  }

  const model = loadedModels[selectedModel];
  
  // Store initial values when starting transformation
  if (initialMousePos.current.x === 0 && initialMousePos.current.y === 0) {
    initialTransform.current = {
      scale: model.scale.clone(),
      position: model.position.clone(),
      rotation: model.rotation.clone(),
      worldPosition: model.getWorldPosition(new THREE.Vector3()),
      worldQuaternion: model.getWorldQuaternion(new THREE.Quaternion())
    };
  }

  const handleMouseMove = (e) => {
    const canvas = document.getElementById("myThreeJsCanvas");
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Initialize mouse position if not set
    if (initialMousePos.current.x === 0 && initialMousePos.current.y === 0) {
      initialMousePos.current = { x: mouseX, y: mouseY };
      return;
    }

    const deltaX = mouseX - initialMousePos.current.x;
    const deltaY = mouseY - initialMousePos.current.y;

    if (isScalingMode) {
      handleScaling(model, deltaX, deltaY, activeAxis, initialTransform, transformFactor);
    } else if (isGrabMode) {
      handleGrabbing(model, deltaX, deltaY, activeAxis, initialTransform, transformFactor, sceneInstance);
    } else if (isRotateMode) {
      handleRotation(model, deltaX, deltaY, activeAxis, initialTransform, transformFactor, sceneInstance);
    }

    // Force highlight update after transformation
    if (selectedModel && highlightModel) {
      highlightModel(selectedModel, loadedModels, sceneInstance);
    }


    // Update mouse position for next frame
    initialMousePos.current = { x: mouseX, y: mouseY };
  };

  const handleMouseUp = () => {
    resetTransformModes();
  };

  const resetTransformModes = () => {
    setIsScalingMode(false);
    setIsGrabMode(false);
    setIsRotateMode(false);
    setActiveAxis(null);
    initialMousePos.current = { x: 0, y: 0 };
  };

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
  window.addEventListener('blur', resetTransformModes); // Reset if window loses focus

  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('blur', resetTransformModes);
  };
};

const handleScaling = (model, deltaX, deltaY, activeAxis, initialTransform, transformFactor) => {
  const movement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  let direction = 1;

  // Determine scaling direction based on axis
  if (activeAxis === 'x') {
    direction = deltaX > 0 ? 1 : -1;
  } else if (activeAxis === 'y') {
    direction = deltaY < 0 ? 1 : -1; // Invert Y for more intuitive scaling
  } else if (activeAxis === 'z') {
    direction = (deltaX + deltaY) > 0 ? 1 : -1;
  } else {
    // Uniform scaling when no axis is selected
    direction = (deltaX + deltaY) > 0 ? 1 : -1;
  }

  const scaleChange = 1 + direction * movement * 0.005;
  const newScale = new THREE.Vector3().copy(initialTransform.current.scale);

  // Handle axis-specific scaling
  if (activeAxis) {
    const worldAxis = new THREE.Vector3();
    if (activeAxis === 'x') worldAxis.set(1, 0, 0);
    else if (activeAxis === 'y') worldAxis.set(0, 1, 0);
    else if (activeAxis === 'z') worldAxis.set(0, 0, 1);

    // Convert world axis to local axis
    const localAxis = worldAxis.clone().applyQuaternion(
      model.quaternion.clone().invert()
    );
    
    const scaleVector = new THREE.Vector3(1, 1, 1).addScaledVector(
      localAxis, 
      (scaleChange - 1)
    );
    newScale.multiply(scaleVector);
  } else {
    // Uniform scaling
    newScale.multiplyScalar(scaleChange);
  }

  // Apply constraints
  newScale.x = THREE.MathUtils.clamp(newScale.x, 0.1, 10);
  newScale.y = THREE.MathUtils.clamp(newScale.y, 0.1, 10);
  newScale.z = THREE.MathUtils.clamp(newScale.z, 0.1, 10);

  // Apply the new scale
  model.scale.copy(newScale);
  transformFactor.current.scale.copy(newScale);
};

const handleGrabbing = (model, deltaX, deltaY, activeAxis, initialTransform, transformFactor, sceneInstance) => {
  const movementX = deltaX * 0.01;
  const movementY = -deltaY * 0.01; // Invert Y for more intuitive movement

  // Calculate movement in world space
  const movement = new THREE.Vector3(movementX, movementY, 0);
  
  // If we have a camera, project the movement according to view
  if (sceneInstance.camera) {
    const camera = sceneInstance.camera;
    
    // Create vectors for camera orientation
    const right = new THREE.Vector3();
    const up = new THREE.Vector3();
    const forward = new THREE.Vector3();
    
    camera.getWorldDirection(forward);
    right.crossVectors(forward, camera.up).normalize();
    up.crossVectors(right, forward).normalize();
    
    // Adjust movement based on camera view
    movement.applyMatrix3(new THREE.Matrix3().set(
      right.x, up.x, forward.x,
      right.y, up.y, forward.y,
      right.z, up.z, forward.z
    ));
  }

  const newPosition = new THREE.Vector3().copy(initialTransform.current.position);

  // Apply movement based on active axis
  if (activeAxis === 'x') {
    newPosition.x += movement.x;
  } else if (activeAxis === 'y') {
    newPosition.y += movement.y;
  } else if (activeAxis === 'z') {
    newPosition.z += (movement.x + movement.y) * 0.5;
  } else {
    // Free movement when no axis is selected
    newPosition.add(movement);
  }

  model.position.copy(newPosition);
  transformFactor.current.position.copy(newPosition);
};

  const handleRotation = (model, deltaX, deltaY, activeAxis, initialTransform, transformFactor, sceneInstance) => {
    const rotationAmount = (deltaX + deltaY) * 0.01;
    const newRotation = new THREE.Euler().copy(initialTransform.current.rotation);

    if (activeAxis === 'x') {
      // Rotate around model's local X axis
      const axis = new THREE.Vector3(1, 0, 0);
      model.rotateOnWorldAxis(axis, rotationAmount);
    } else if (activeAxis === 'y') {
      // Rotate around model's local Y axis
      const axis = new THREE.Vector3(0, 1, 0);
      model.rotateOnWorldAxis(axis, rotationAmount);
    } else if (activeAxis === 'z') {
      // Rotate around model's local Z axis
      const axis = new THREE.Vector3(0, 0, 1);
      model.rotateOnWorldAxis(axis, rotationAmount);
    } else {
      // Free rotation - combine X and Y movement
      // Rotate around world Y axis for horizontal movement
      model.rotateY(deltaX * 0.01);
      // Rotate around world X axis for vertical movement
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(sceneInstance.camera.quaternion);
      model.rotateOnWorldAxis(right, deltaY * 0.01);
    }

    transformFactor.current.rotation.copy(model.rotation);
  };

export const setupKeyboardControls = (
  setIsScalingMode,
  setIsGrabMode,
  setIsRotateMode,
  setActiveAxis,
  selectedModel,
  loadedModels,
  initialTransform,
  isScalingMode,
  isGrabMode,
  isRotateMode
) => {
  const handleKeyDown = (e) => {
    const key = e.key.toLowerCase();

    // Only process if we have a selected model
    if (!selectedModel || !loadedModels[selectedModel]) return;

    // Toggle transformation modes
    if (key === 's' && !isGrabMode && !isRotateMode) {
      setIsScalingMode(prev => {
        const newValue = !prev;
        if (newValue) {
          initialTransform.current.scale.copy(loadedModels[selectedModel].scale);
          setIsGrabMode(false);
          setIsRotateMode(false);
        }
        return newValue;
      });
      e.preventDefault();
    }
    else if (key === 'g' && !isScalingMode && !isRotateMode) {
      setIsGrabMode(prev => {
        const newValue = !prev;
        if (newValue) {
          initialTransform.current.position.copy(loadedModels[selectedModel].position);
          setIsScalingMode(false);
          setIsRotateMode(false);
        }
        return newValue;
      });
      e.preventDefault();
    }
    else if (key === 'r' && !isScalingMode && !isGrabMode) {
      setIsRotateMode(prev => {
        const newValue = !prev;
        if (newValue) {
          initialTransform.current.rotation.copy(loadedModels[selectedModel].rotation);
          setIsScalingMode(false);
          setIsGrabMode(false);
        }
        return newValue;
      });
      e.preventDefault();
    }

    // Set active axis if in a transformation mode
    if (isScalingMode || isGrabMode || isRotateMode) {
      if (key === 'x' || key === 'y' || key === 'z') {
        setActiveAxis(key);
        e.preventDefault();
      }
      else if (key === 'escape') {
        // Cancel transformation and revert to initial state
        const model = loadedModels[selectedModel];
        if (model) {
          if (isScalingMode) model.scale.copy(initialTransform.current.scale);
          else if (isGrabMode) model.position.copy(initialTransform.current.position);
          else if (isRotateMode) model.rotation.copy(initialTransform.current.rotation);
        }

        setIsScalingMode(false);
        setIsGrabMode(false);
        setIsRotateMode(false);
        setActiveAxis(null);
        e.preventDefault();
      }
    }

    // Precision controls
    if (e.shiftKey && (isScalingMode || isGrabMode || isRotateMode)) {
      // Fine-tune transformations when shift is held
      // This would be handled in the mouse move handlers
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
};

// Additional utility functions
export const resetModelTransform = (model) => {
  if (!model) return;
  
  model.scale.set(1, 1, 1);
  model.position.set(0, 0, 0);
  model.rotation.set(0, 0, 0);
};

export const getModelTransformState = (model) => {
  if (!model) return null;
  
  return {
    position: model.position.clone(),
    rotation: model.rotation.clone(),
    scale: model.scale.clone(),
    worldPosition: model.getWorldPosition(new THREE.Vector3()),
    worldQuaternion: model.getWorldQuaternion(new THREE.Quaternion())
  };
};