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

  return (
    <div
      role="main"
      aria-label="Canvas workspace"
      className="flex  mx-5 rounded-lg aspect-square bg-neutral-600 h-[90%] w-[100%]"
    >
      <div className="flex grow justify-center items-center w-full h-full rounded-xl overflow-hidden shadow-2xl">
          <canvas
            id="myThreeJsCanvas"
            className="bg-gray-950 border border-gray-700"
          />
        </div>
      <div className=" bg-gradient-to-b from-gray-900 to-gray-800 text-white flex grow flex-col items-center py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">3D Model Viewer</h1>

        {/* Canvas for 3D scene */}
        

        <div className="w-full max-w-5xl space-y-6">
          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}



          {/* Latest uploaded model */}
          {latestModel && (
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Latest Uploaded Model</h3>
              <div className="flex justify-between items-center gap-4 bg-gray-900 p-4 rounded-lg">
                <span className="truncate text-sm text-gray-300">
                  {latestModel.name}
                </span>
                <button
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  onClick={() => loadModelIntoScene(latestModel)}
                >
                  Load Model
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}






















