import React, { useState, useRef } from "react";
import CanvasArea from "./CanvasArea/CanvasArea";
import ProjectHierarchyPanel from "./ProjectHierarchyPanel/ProjectHierarchyPanel";
import { createFileUploader } from "@utils/UploadUtilis";
import TopBar from "./TopBar/TopBar";
import PropertiesPanel from "./PropertiesPanel/PropertiesPanel";
import * as THREE from "three";

export default function CanvasWrapper() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [latestModel, setLatestModel] = useState(null);
  const [error, setError] = useState(null);
  const [uploadedModels, setUploadedModels] = useState([]);
  const canvasAreaRef = useRef(null);

  // const handleCreateObject = (type) => {
  //   if (!canvasAreaRef.current?.addPrimitiveToScene) {
  //     console.error("CanvasArea ref or addPrimitiveToScene not available");
  //     return;
  //   }

  //   let geometry;
  //   const material = new THREE.MeshStandardMaterial({ 
  //     color: new THREE.Color(Math.random() * 0xffffff),
  //     metalness: 0.1,
  //     roughness: 0.5
  //   });

  //   switch (type) {
  //     case 'cube':
  //       geometry = new THREE.BoxGeometry(1, 1, 1);
  //       break;
  //     case 'sphere':
  //       geometry = new THREE.SphereGeometry(0.5, 32, 32);
  //       break;
  //     case 'plane':
  //       geometry = new THREE.PlaneGeometry(1, 1);
  //       geometry.rotateX(-Math.PI / 2);
  //       break;
  //     case 'cylinder':
  //       geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
  //       break;
  //     default:
  //       return;
  //   }

  //   const mesh = new THREE.Mesh(geometry, material);
  //   const modelName = `${type}_${Date.now()}`;
  //   mesh.name = modelName;

  //   canvasAreaRef.current.addPrimitiveToScene(mesh);
  // };
  const handleCreateObject = (type) => {
    if (!canvasAreaRef.current?.addPrimitiveToScene) {
      console.error("CanvasArea ref or addPrimitiveToScene not available");
      return;
    }
  
    let geometry;
    const material = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color(Math.random() * 0xffffff),
      metalness: 0.1,
      roughness: 0.5
    });
  
    switch (type) {
      case 'cube':
        geometry = new THREE.BoxGeometry(1, 1, 1);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(0.5, 32, 32);
        break;
      case 'plane':
        geometry = new THREE.PlaneGeometry(1, 1);
        geometry.rotateX(-Math.PI / 2);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        break;
      default:
        return;
    }
  
    // Create a group to hold the mesh (similar to loaded models)
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(geometry, material);
    
    // Add mesh to the group
    group.add(mesh);
    
    const modelName = `${type}_${Date.now()}`;
    group.name = modelName;
    mesh.name = `${modelName}_mesh`;
  
    canvasAreaRef.current.addPrimitiveToScene(group);
  };

  const handleUpload = createFileUploader(
    setError,
    setUploading,
    setUploadProgress,
    (model) => {
      setLatestModel(model);
      setUploadedModels((prev) => {
        const newModels = Array.isArray(prev) ? [...prev, model.name] : [model.name];
        return newModels;
      });
    }
  );

  const handleModelsChange = (newModels) => {
    setUploadedModels(newModels);
  };

  return (
    <div className="flex w-screen h-screen bg-zinc-800">
<div className="w-[15%] my-5 ml-5">
  <ProjectHierarchyPanel
    handleUpload={handleUpload}
    uploading={uploading}
    uploadProgress={uploadProgress}
    uploadedModels={uploadedModels}
    onModelsChange={handleModelsChange}
    onHighlight={(modelName) => {
      if (canvasAreaRef.current?.highlightModel) {
        canvasAreaRef.current.highlightModel(modelName);
      }
    }}
    canvasAreaRef={canvasAreaRef}  // Add this line
  />
</div>

      {/* Center Content */}
      <div className="flex flex-col gap-5 w-[70%] items-center justify-center my-5 mx-5">
        <TopBar onCreateObject={handleCreateObject} />
        <CanvasArea
          ref={canvasAreaRef}
          latestModel={latestModel}
          error={error}
          setUploadedModels={setUploadedModels}
          setUploading={setUploading}
          setUploadProgress={setUploadProgress}
          setError={setError}
          uploadedModels={uploadedModels}
        />
      </div>

      {/* Right Panel */}
      <div className="w-[15%] my-5 mr-5">
        <PropertiesPanel />
      </div>
    </div>
  );
}
