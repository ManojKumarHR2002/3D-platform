import React, { useEffect, useState, createContext, useContext } from "react";
import * as THREE from "three";
import Scene from "@classes/Scene";
import {
  loadGLTFModel,
  loadFBXModel,
  setupAnimations,
  setupAnimationLoop,
} from "@utils/ModelRenderUtils";
import AnimationPanel from "../AnimationPanel/AnimationPanel";

export const UIManagerContext = createContext();

export function useUIManager() {
  return useContext(UIManagerContext);
}

export default function CanvasArea({ latestModel, error, setSceneInstance }) {
  const [sceneInstanceLocal, setSceneInstanceLocal] = useState(null);
  const [mixers, setMixers] = useState([]);
  // Animation extraction state
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    const scene = new Scene("myThreeJsCanvas");
    scene.initialize();
    scene.animate();

    const newMixers = [];
    const clock = new THREE.Clock();
    setupAnimationLoop(scene, newMixers, clock);

    setSceneInstanceLocal(scene);
    setMixers(newMixers);
    if (setSceneInstance) setSceneInstance(scene);

    return () => {
      scene.cleanup();
      if (setSceneInstance) setSceneInstance(null);
    };
  }, []);

  // Helper: Extract and prepare animation data for AnimationPanel
  const extractAnimationPanelData = (model, meshOrScene) => {
    if (!model.animations || model.animations.length === 0) return null;
    const mixer = new THREE.AnimationMixer(meshOrScene);
    const actions = model.animations.map((clip) => mixer.clipAction(clip));
    return {
      animations: model.animations,
      mixer,
      actions,
    };
  };

  const loadModelIntoScene = (model) => {
    const position = [0, 0, 0];
    const scale = [0.5, 0.5, 0.5];

    if (model.url.endsWith(".fbx")) {
      loadFBXModel(sceneInstanceLocal.scene, model.url, position, scale).then(
        (fbx) => {
          setupAnimations(fbx, mixers);
          // Extract animations for UI panel
          const animData = extractAnimationPanelData(fbx, fbx);
          setAnimationData(animData);
        }
      );
    } else {
      loadGLTFModel(sceneInstanceLocal.scene, model.url, position, 0, scale).then(
        (gltf) => {
          setupAnimations(gltf, mixers);
          // Extract animations for UI panel
          const animData = extractAnimationPanelData(gltf, gltf.scene);
          setAnimationData(animData);
        }
      );
    }
  };



  useEffect(() => {
    if (latestModel && sceneInstanceLocal) {
      loadModelIntoScene(latestModel);
    }
  }, [latestModel, sceneInstanceLocal]);

  return (
    <UIManagerContext.Provider value={sceneInstanceLocal?.uiManager}>
      <div
        role="main"
        aria-label="Canvas workspace"
        className="flex w-full h-full rounded-lg bg-neutral-600 relative"
        onDragOver={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={async e => {
          e.preventDefault();
          e.stopPropagation();
          const file = e.dataTransfer.files && e.dataTransfer.files[0];
          if (!file) return;
          const ext = file.name.split('.').pop().toLowerCase();
          if (!['glb','gltf','fbx'].includes(ext)) {
            alert('Only GLB, GLTF, or FBX files supported.');
            return;
          }
          // Generate a local URL for the dropped file
          const localUrl = URL.createObjectURL(file);
          const modelObj = { name: file.name, url: localUrl };
          loadModelIntoScene(modelObj);
        }}
      >
        <div className="flex-grow flex justify-center items-center w-full h-full rounded-xl overflow-hidden shadow-2xl">
          <canvas
            id="myThreeJsCanvas"
            className="w-full h-full bg-gray-950 border border-gray-700"
          />
        </div>
        {/* --- Animation Panel (floating, right) --- */}
        {animationData && animationData.animations.length > 0 && (
          <AnimationPanel
            animations={animationData.animations}
            mixer={animationData.mixer}
            actions={animationData.actions}
          />
        )}
        {/* Lighting controls moved to TopBar */}
      </div>
    </UIManagerContext.Provider>
  );
}

