import React, { useState,useEffect } from "react";
import CanvasArea from "./CanvasArea/CanvasArea";
import ProjectHierarchyPanel from "./ProjectHierarchyPanel/ProjectHierarchyPanel";
import { createFileUploader } from "@utils/uploadUtilis";


import TopBar from './TopBar/TopBar';
import PropertiesPanel from './PropertiesPanel/PropertiesPanel';

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


  

  console.log("handleUpload function created"); // Check if this gets logged


  return (
    
    <div className="flex w-screen h-screen bg-zinc-800">
          {/* Project Hierarchy Panel */}
          <div className=" w-[15%] my-5 ml-5">
          <ProjectHierarchyPanel handleUpload={handleUpload} uploading={uploading} uploadProgress={uploadProgress} />
          </div>
    
          {/* Center Content with TopBar and CanvasArea */}
          <div className="flex flex-col gap-5 w-[70%] items-center justify-center my-5 mx-5 ">
            <TopBar />
            <CanvasArea latestModel={latestModel} error={error}/>
            {/* <div className="flex-grow">
              
            </div> */}
          </div>
    
          {/* Properties Panel */}
          <div className=" w-[15%] my-5 mr-5">
            <PropertiesPanel />
          </div>
        </div>
    
  );
}
