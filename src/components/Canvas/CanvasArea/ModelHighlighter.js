import * as THREE from "three";
import { neonOutlineShader } from "./Shaders";

/**
 * Applies or removes edge highlight effect to a model
 * @param {string} modelName - Name of the model to highlight, null to deselect
 * @param {Object} loadedModels - Dictionary of loaded models
 * @param {Object} sceneInstance - The THREE.js scene instance
 */
export const highlightModel = (modelName, loadedModels, sceneInstance) => {
  console.log('ModelHighlighter - highlightModel called with:', modelName);
  
  Object.entries(loadedModels).forEach(([name, model]) => {
    console.log('Processing model:', name, 'Selected:', modelName === name);
    if (model) {
      const traverseModel = (node) => {
        if (node.isMesh) {
          // If this is the selected model, add outline
          if (modelName === name) {
            // Store original material if not already stored
            if (!node.userData.originalMaterial) {
              node.userData.originalMaterial = node.material.clone();
            }
            
            if (!node.userData.outlineMesh) {
              // Create outline geometry with slight offset
              const outlineGeometry = node.geometry.clone();
              
              // Create a new mesh for the outline effect
              const outlineMaterial = new THREE.ShaderMaterial({
                uniforms: {
                  diffuse: { value: new THREE.Color(0x00ff00) },
                  opacity: { value: 0.8 },
                  glowIntensity: { value: 1.2 }
                },
                vertexShader: neonOutlineShader.vertexShader,
                fragmentShader: neonOutlineShader.fragmentShader,
                side: THREE.BackSide,
                transparent: true,
                depthWrite: false,
                derivatives: true  // Enable derivatives for curvature calculation
              });

              const outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);
              
              // Scale slightly larger for the outline effect
              outlineMesh.scale.multiplyScalar(1.05);
              
              // Match the position and rotation
              outlineMesh.position.copy(node.position);
              outlineMesh.rotation.copy(node.rotation);
              outlineMesh.quaternion.copy(node.quaternion);
              
              // Add to the same parent
              node.parent.add(outlineMesh);
              
              // Store reference to outline mesh
              node.userData.outlineMesh = outlineMesh;
            }
            
            // Ensure the original node is visible
            node.visible = true;
            node.material = node.userData.originalMaterial;
            
          } else {
            // For non-selected models, remove any outline
            if (node.userData.outlineMesh) {
              node.parent.remove(node.userData.outlineMesh);
              node.userData.outlineMesh = null;
            }
            
            // Restore original material if needed
            if (node.userData.originalMaterial) {
              node.material = node.userData.originalMaterial;
            }
          }
        }
        
        // Process all children
        if (node.children) {
          node.children.forEach(traverseModel);
        }
      };
      
      traverseModel(model);
    }
  });

  if (sceneInstance?.renderer) {
    console.log('Rendering scene after highlight update');
    sceneInstance.renderer.render(sceneInstance.scene, sceneInstance.camera);
  }
}; 