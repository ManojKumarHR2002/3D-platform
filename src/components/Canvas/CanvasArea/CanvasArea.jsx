// src/components/Canvas/CanvasArea/CanvasArea.jsx

import React, { useEffect, useState } from "react";
import * as THREE from "three";
import Scene from "@classes/Scene";
import {
  loadGLTFModel,
  loadFBXModel,
  setupAnimations,
  setupAnimationLoop,
} from "@utils/ModelRenderUtils";
import { useDispatch } from "react-redux";
import { setSceneInstance as setSceneInStore } from "@store/slices/sceneSlice";

export default function CanvasArea({ latestModel }) {
  const [sceneInstance, setSceneInstance] = useState(null);
  const [mixers, setMixers] = useState([]);
  const [isLocal, setIsLocal] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const test = new Scene("myThreeJsCanvas", dispatch); // pass dispatch
    test.initialize();
    test.start();

    const newMixers = [];
    const clock = new THREE.Clock();
    setupAnimationLoop(test, newMixers, clock);

    setSceneInstance(test);
    dispatch(setSceneInStore(test));
    setMixers(newMixers);

    return () => {
      if (test) test.dispose();
    };
  }, []);

  const loadModelIntoScene = (model) => {
    const position = [0, 0, 0];
    const scale = [0.5, 0.5, 0.5];
    if (!sceneInstance) return;

    if (model.url.endsWith(".fbx")) {
      loadFBXModel(sceneInstance.scene, model.url, position, scale, model.id).then(
        (fbx) => setupAnimations(fbx, mixers)
      );
    } else {
      loadGLTFModel(sceneInstance.scene, model.url, position, 0, scale, model.id).then(
        (gltf) => setupAnimations(gltf, mixers)
      );
    }
  };

  useEffect(() => {
    if (latestModel) {
      loadModelIntoScene(latestModel);
    }
  }, [latestModel]);

  const toggleTransformSpace = () => {
    if (!sceneInstance) return;
    const newSpace = isLocal ? "world" : "local";
    sceneInstance.setTransformSpace(newSpace);
    setIsLocal(!isLocal);
  };

  return (
    <div role="main" className="flex w-full h-full rounded-lg bg-neutral-600">
      <div className="flex-grow flex justify-center items-center w-full h-full rounded-xl overflow-hidden shadow-2xl">
        <div className="relative w-full h-full">
          <div className="absolute top-4 left-4 z-10 flex gap-4">
            <button
              onClick={toggleTransformSpace}
              className="bg-neutral-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              {isLocal ? "Global" : "Local"}
            </button>
            <button
              onClick={toggleTransformSpace}
              className="bg-neutral-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              Mode
            </button>
            <button
              onClick={toggleTransformSpace}
              className="bg-neutral-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              Next
            </button>
          </div>

          <canvas id="myThreeJsCanvas" className="w-full h-full bg-gray-950" />
        </div>
      </div>
    </div>
  );
}
