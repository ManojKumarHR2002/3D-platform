import React, { useEffect, useState } from "react";
import * as THREE from "three";
import Scene from "@classes/Scene";
import { loadGLTFModel, loadFBXModel, setupAnimations,setupAnimationLoop } from "@utils/ModelRenderUtils"; // Corrected path
import { createFileUploader } from "@utils/uploadUtilis";

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
    setupAnimationLoop(test, newMixers, clock);

    setSceneInstance(test);
    setMixers(newMixers);
  }, []);


  // Load model into scene based on file type
  const loadModelIntoScene = (model) => {
    const position = [0, 0, 0];
    const scale = [0.5, 0.5, 0.5];

    if (model.url.endsWith(".fbx")) {
      loadFBXModel(sceneInstance.scene, model.url, position, scale).then((fbx) =>
        setupAnimations(fbx, mixers)
      );
    } else {
      loadGLTFModel(sceneInstance.scene, model.url, position, 0, scale).then((gltf) =>
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






















