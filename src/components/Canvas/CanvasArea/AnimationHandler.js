/**
 * Sets up animation loop for updating shader time and outline effects
 * @param {Object} sceneInstance - The THREE.js scene instance
 * @param {string} selectedModel - Currently selected model name
 * @param {Object} loadedModels - Dictionary of loaded models
 * @returns {Function} Cleanup function to cancel animation frame
 */
export const setupAnimationLoop = (sceneInstance, selectedModel, loadedModels) => {
  let animationFrameId;
  const startTime = Date.now();
  
  const updateTime = () => {
    const currentTime = (Date.now() - startTime) / 1000; // Convert to seconds
    
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
  
  // Return cleanup function
  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}; 
