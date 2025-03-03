import React, { useState } from "react";
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
  const [uploadedModels, setUploadedModels] = useState([]); // Store model names

  const handleUpload = createFileUploader(
    setError,
    setUploading,
    setUploadProgress,
    (model) => {
      setLatestModel(model);
      setUploadedModels((prev) => [...prev, model.name]); // Store model name
    }
  );

  return (
    <div className="flex w-screen h-screen bg-zinc-800">
      {/* Left Panel */}
      <div className="w-[15%] my-5 ml-5">
        <ProjectHierarchyPanel
          handleUpload={handleUpload}
          uploading={uploading}
          uploadProgress={uploadProgress}
          uploadedModels={uploadedModels}
        />
      </div>

      {/* Center Content */}
      <div className="flex flex-col gap-5 w-[70%] items-center justify-center my-5 mx-5">
        <TopBar />
        <CanvasArea
          latestModel={latestModel}
          error={error}
          setUploadedModels={setUploadedModels}
          setUploading={setUploading} 
          setUploadProgress={setUploadProgress} 
          setError={setError} 
        />
      </div>

      {/* Right Panel */}
      <div className="w-[15%] my-5 mr-5">
        <PropertiesPanel />
      </div>
    </div>
  );
}
