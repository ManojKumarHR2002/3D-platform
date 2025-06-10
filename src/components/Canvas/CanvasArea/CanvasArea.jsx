import React, { useEffect, useState } from "react";
import * as THREE from "three";
import Scene from "@classes/Scene";
import { loadGLTFModel, loadFBXModel, setupAnimations,setupAnimationLoop } from "@utils/ModelRenderUtils"; // Corrected path
import { createFileUploader } from "@utils/UploadUtils";

export default function CanvasArea({ latestModel,error }) {

  const [sceneInstance, setSceneInstance] = useState(null); // Store the 3D scene instance
  const [mixers, setMixers] = useState([]); // Store animation mixers

  // Initialize scene and animation loop
  useEffect(() => {
    const test = new Scene("myThreeJsCanvas");
    test.initialize();
    test.animate();

    const newMixers = [];
    const clock = new THREE.Clock();
    // setupAnimationLoop(test, newMixers, clock);

    const frameRef={id:null};
    setupAnimationLoop(test,newMixers,clock,frameRef);

    setSceneInstance(test);
    setMixers(newMixers);

    const canvas = document.getElementById("myThreeJsCanvas");
    canvas.addEventListener("click", onClick, false);

    return () => {
      canvas.removeEventListener("click", onClick);
      cancelAnimationFrame(frameRef.id);
      if (test)test.dispose();
    }
  }, []);

  // Click Handler for Selection
  const onClick = (event) => {
    if (!sceneInstance) return;

    const canvas = sceneInstance.renderer.domElement;
    const rect = canvas.getBoundingClientRect();

    // Normalize mouse position
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, sceneInstance.camera);

    const intersects = raycaster.current.intersectObjects(sceneInstance.scene.children, true);

    if (intersects.length > 0) {
      const intersected = intersects[0].object;
      const modelId = intersected.userData.modelId;

      if (modelId) {
        dispatch(setSelectedObjectId(modelId));
        console.log("Selected model ID:", modelId);

        // Highlight logic (optional)
        highlightSelectedObject(intersected);
      }
    }
  };

  // Optional: Simple highlight effect
  const highlightSelectedObject = (object) => {
    object.traverse((child) => {
      if (child.isMesh) {
        child.material.emissive = new THREE.Color(0x4444ff); // light blue glow
        child.material.emissiveIntensity = 0.6;
      }
    });
  };


  // Load model into scene based on file type
  const loadModelIntoScene = (model) => {
    const position = [0, 0, 0];
    const scale = [0.5, 0.5, 0.5];

    if (!sceneInstance) return;

    if (model.url.endsWith(".fbx")) {
      loadFBXModel(sceneInstance.scene, model.url, position, scale,model.id).then((fbx) =>
        setupAnimations(fbx, mixers)
      );
    } else {
      loadGLTFModel(sceneInstance.scene, model.url, position, 0, scale,model.id).then((gltf) =>
        setupAnimations(gltf, mixers)
      );
    }
  };

  useEffect(() => {
    if (latestModel) {
      loadModelIntoScene(latestModel);
    }
  }, [latestModel]); // Runs when latestModel changes

  return (
    <div
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
  
}






















