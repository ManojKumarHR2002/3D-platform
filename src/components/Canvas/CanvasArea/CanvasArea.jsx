import React, { useEffect, useState, createContext, useContext } from "react";
import * as THREE from "three";
import Scene from "@classes/Scene";
import {
  loadGLTFModel,
  loadFBXModel,
  setupAnimations,
  setupAnimationLoop,
} from "@utils/ModelRenderUtils";
import LightingControls from "./LightControls/LightingControls";

export const UIManagerContext = createContext();

export function useUIManager() {
  return useContext(UIManagerContext);
}

export default function CanvasArea({ latestModel, error }) {
  const [sceneInstance, setSceneInstance] = useState(null);
  const [mixers, setMixers] = useState([]);

  useEffect(() => {
    const scene = new Scene("myThreeJsCanvas");
    scene.initialize();
    scene.animate();

    const newMixers = [];
    const clock = new THREE.Clock();
    setupAnimationLoop(scene, newMixers, clock);

    setSceneInstance(scene);
    setMixers(newMixers);

    return () => {
      scene.cleanup();
    };
  }, []);

  const loadModelIntoScene = (model) => {
    const position = [0, 0, 0];
    const scale = [0.5, 0.5, 0.5];

    if (model.url.endsWith(".fbx")) {
      loadFBXModel(sceneInstance.scene, model.url, position, scale).then(
        (fbx) => setupAnimations(fbx, mixers)
      );
    } else {
      loadGLTFModel(sceneInstance.scene, model.url, position, 0, scale).then(
        (gltf) => setupAnimations(gltf, mixers)
      );
    }
  };

  useEffect(() => {
    if (latestModel && sceneInstance) {
      loadModelIntoScene(latestModel);
    }
  }, [latestModel]);

  return (
    <UIManagerContext.Provider value={sceneInstance?.uiManager}>
      <div
        role="main"
        aria-label="Canvas workspace"
        className="flex w-full h-full rounded-lg bg-neutral-600 relative"
      >
        <div className="flex-grow flex justify-center items-center w-full h-full rounded-xl overflow-hidden shadow-2xl">
          <canvas
            id="myThreeJsCanvas"
            className="w-full h-full bg-gray-950 border border-gray-700"
          />
        </div>

        {sceneInstance && (
          <div className="absolute top-4 right-4 w-80 z-10">
            <LightingControls sceneInstance={sceneInstance} />
          </div>
        )}
      </div>
    </UIManagerContext.Provider>
  );
}
