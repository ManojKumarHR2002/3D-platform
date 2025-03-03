import React, { useEffect, useState } from "react";
import * as THREE from "three";
import Scene from "@classes/Scene"; 
import { createFileUploader } from "@utils/UploadUtilis"; // Utility function to handle file uploads
import { loadGLTFModel, loadFBXModel, setupAnimations, setupAnimationLoop } from "@utils/ModelRenderUtils"; // Utilities for loading and animating 3D models


export default function CanvasArea({ latestModel, error, setUploadedModels, setUploading, setUploadProgress, setError }) {
  const [sceneInstance, setSceneInstance] = useState(null); // Store the 3D scene instance
  const [mixers, setMixers] = useState([]);// Store animation mixers

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

   // Load model into scene
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

  // Load the latest uploaded model into the scene when updated
  useEffect(() => {
    if (latestModel) {
      loadModelIntoScene(latestModel);
    }
  }, [latestModel]);

  // Drag-and-Drop Handlers with Supabase Upload
  useEffect(() => {
    const canvasContainer = document.getElementById("canvasContainer"); // Get the canvas container element

    // Handles visual effect when dragging over the canvas
    const handleDragOver = (event) => {
      event.preventDefault(); // Prevents default behavior (which may open the file in the browser)
      event.stopPropagation(); // Stops event from bubbling up to prevent interference with other elements
    };

    // Handles the file drop event
    const handleDrop = async (event) => {
      event.preventDefault();
      event.stopPropagation(); // Ensures drop event only applies inside canvasContainer

      if (!sceneInstance) return; // Prevents execution if scene is not yet initialized

      const file = event.dataTransfer.files[0]; // Retrieves the first dropped file
      if (!file) return; // If no file is found, exit

      // Restrict drop area only to canvas (prevents unintended uploads elsewhere)
      if (!canvasContainer.contains(event.target)) return;

      // Load the model locally first for instant feedback
      const localUrl = URL.createObjectURL(file);
      const modelName = file.name;
      loadModelIntoScene({ name: modelName, url: localUrl });

      // Immediately update project hierarchy with the new model
      setUploadedModels((prev) => [...prev, modelName]);

      // Asynchronously upload the file to Supabase
      const uploadFile = createFileUploader(
        setError, // Handles errors during upload
        setUploading, // Updates UI state during upload
        setUploadProgress, // Displays upload progress
        (uploadedModel) => {
          console.log("Uploaded Model URL:", uploadedModel.url);
          loadModelIntoScene(uploadedModel); // Loads the model from the uploaded URL once available

          // Update the project hierarchy to reflect the uploaded model
          setUploadedModels((prev) =>
            prev.map((name) => (name === modelName ? uploadedModel.name : name))
          );
        }
      );

      await uploadFile(file); // Triggers the file upload
    };

    // Prevents default browser behavior that would open the file instead of handling it in-app
    const preventDefault = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    // Apply global event listeners to prevent accidental file openings
    document.addEventListener("dragover", preventDefault);
    document.addEventListener("drop", preventDefault);

    if (canvasContainer) {
      canvasContainer.addEventListener("dragover", handleDragOver);
      canvasContainer.addEventListener("drop", handleDrop);
    }

    // Cleanup event listeners when component unmounts
    return () => {
      document.removeEventListener("dragover", preventDefault);
      document.removeEventListener("drop", preventDefault);

      if (canvasContainer) {
        canvasContainer.removeEventListener("dragover", handleDragOver);
        canvasContainer.removeEventListener("drop", handleDrop);
      }
    };
  }, [sceneInstance]);

  // JSX structure for the Three.js canvas area
  return (
    <div
      id="canvasContainer"
      role="main"
      aria-label="Canvas workspace"
      className="flex w-full h-full rounded-lg bg-neutral-600"
    >
      {/* Container for the Three.js canvas */}
      <div className="flex-grow flex justify-center items-center w-full h-full rounded-xl overflow-hidden shadow-2xl">
        <canvas
          id="myThreeJsCanvas"
          className="w-full h-full bg-gray-950 border border-gray-700"
        />
      </div>
    </div>
  );
}
