import React, { useState, useRef } from "react";
import CanvasArea from "./CanvasArea/CanvasArea";
import ProjectHierarchyPanel from "./ProjectHierarchyPanel/ProjectHierarchyPanel";
import { createFileUploader } from "@utils/UploadUtilis";
import TopBar from "./TopBar/TopBar";
import PropertiesPanel from "./PropertiesPanel/PropertiesPanel";

export default function CanvasWrapper() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [latestModel, setLatestModel] = useState(null);
  const [error, setError] = useState(null);
  const [uploadedModels, setUploadedModels] = useState([]);
  const canvasAreaRef = useRef(null);

  console.log('CanvasWrapper - Current uploadedModels:', uploadedModels);

  const handleUpload = createFileUploader(
    setError,
    setUploading,
    setUploadProgress,
    (model) => {
      console.log('CanvasWrapper - Upload complete, model:', model);
      setLatestModel(model);
      setUploadedModels((prev) => {
        console.log('CanvasWrapper - Previous uploadedModels:', prev);
        const newModels = Array.isArray(prev) ? [...prev, model.name] : [model.name];
        console.log('CanvasWrapper - New uploadedModels:', newModels);
        return newModels;
      });
    }
  );

  const handleModelsChange = (newModels) => {
    console.log('CanvasWrapper - Models changed:', newModels);
    setUploadedModels(newModels);
  };

  return (
    <div className="flex w-screen h-screen bg-zinc-800">
      {/* Left Panel */}
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
        />
      </div>

      {/* Center Content */}
      <div className="flex flex-col gap-5 w-[70%] items-center justify-center my-5 mx-5">
        <TopBar />
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
