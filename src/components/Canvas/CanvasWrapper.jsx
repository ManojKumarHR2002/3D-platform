import React, { useState } from "react";
import CanvasArea from "../CanvasArea/CanvasArea";
import ProjectHierarchyPanel from "../ProjectHierarchyPanel/ProjectHierarchyPanel";
import { createFileUploader } from "@utils/uploadUtilis";

export default function CanvasWrapper() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [latestModel, setLatestModel] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = createFileUploader(
    setError,
    setUploading,
    setUploadProgress,
    setLatestModel
  );

  return (
    <div className="flex">
      <ProjectHierarchyPanel handleUpload={handleUpload} uploading={uploading} uploadProgress={uploadProgress} />
      <CanvasArea latestModel={latestModel} />
    </div>
  );
}
