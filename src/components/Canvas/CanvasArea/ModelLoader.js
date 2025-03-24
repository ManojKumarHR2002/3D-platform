import { loadGLTFModel, loadFBXModel, setupAnimations } from "@utils/ModelRenderUtils";

/**
 * Loads a 3D model into the scene
 * @param {Object} model - The model data
 * @param {Object} sceneInstance - The THREE.js scene instance
 * @param {Array} mixers - Animation mixers array
 * @param {Function} updateLoadedModels - Callback to update loaded models state
 * @returns {Promise<void>}
 */
export const loadModelIntoScene = async (
  model, 
  sceneInstance, 
  mixers, 
  updateLoadedModels
) => {
  if (!sceneInstance || !model) {
    console.log('Cannot load model - missing scene or model:', { hasScene: !!sceneInstance, hasModel: !!model });
    return;
  }
  
  console.log('Loading model into scene:', model);
  const position = [0, 0, 0]; 
  const scale = [0.5, 0.5, 0.5]; 

  try {
    const loadedModel = await (model.url.endsWith(".fbx")
      ? loadFBXModel(sceneInstance.scene, model.url, position, scale)
      : loadGLTFModel(sceneInstance.scene, model.url, position, 0, scale));

    console.log('Model loaded successfully:', model.name, loadedModel);
    
    setupAnimations(loadedModel, mixers);
    
    // Store both the gltf object and its scene
    updateLoadedModels(model.name, model.url.endsWith(".fbx") ? loadedModel : loadedModel.scene);

    console.log('Rendering scene after model load');
    sceneInstance.renderer.render(sceneInstance.scene, sceneInstance.camera);
    
    return loadedModel;
  } catch (error) {
    console.error('Error loading model:', error);
    return null;
  }
}; 