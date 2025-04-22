import React, { useState } from "react";
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
  const [uploadedAssets, setUploadedAssets] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    const imageFiles = Array.from(files).filter(file => 
      file.type.match('image.*')
    );

    if (imageFiles.length > 0) {
      const newImages = [];
      imageFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          newImages.push({
            url: event.target.result,
            name: file.name,
            type: 'image',
            id: Date.now() + index
          });

          if (index === imageFiles.length - 1) {
            setUploadedAssets(prev => [...prev, ...newImages]);
            setUploading(false);
          }
        };
        reader.readAsDataURL(file);
      });
    }

    const modelFiles = Array.from(files).filter(file => 
      file.name.match(/\.(gltf|glb|fbx)$/i)
    );
    if (modelFiles.length > 0) {
      const modelUploader = createFileUploader(
        setError,
        setUploading,
        setUploadProgress,
        setLatestModel
      );
      modelUploader({ target: { files: modelFiles } });
    }
  };

  const handleImageSelect = (asset) => {
    if (asset.type === 'image') {
      const material = {
        ...asset,
        baseColor: '#666666',
        baseMap: null,
        metallicMap: null,
        smoothness: 0.5,
        normalMap: null,
        heightMap: null
      };
      setSelectedMaterial(material);
    } else {
      setSelectedMaterial(asset);
    }
  };

  const handleUpdateAsset = (updatedAsset) => {
    setUploadedAssets(prev => 
      prev.map(asset => 
        asset.id === updatedAsset.id ? updatedAsset : asset
      )
    );
    if (selectedMaterial?.id === updatedAsset.id) {
      setSelectedMaterial(updatedAsset);
    }
  };

  const handleAddNewMaterial = (material) => {
    setUploadedAssets(prev => [...prev, material]);
  };

  return (
    <div className="flex w-screen h-screen bg-zinc-800">
      <div className="w-[15%] my-5 ml-5">
        <ProjectHierarchyPanel 
          handleUpload={handleFileUpload} 
          uploading={uploading} 
          uploadProgress={uploadProgress}
          uploadedAssets={uploadedAssets}
          onSelectImage={handleImageSelect}
        />
      </div>

      <div className="flex flex-col gap-5 w-[70%] items-center justify-center my-5 mx-5">
        <TopBar />
        <CanvasArea latestModel={latestModel} error={error} selectedMaterial={selectedMaterial} />
      </div>

      <div className="w-[15%] my-5 mr-5">
        <PropertiesPanel 
          uploadedAssets={uploadedAssets}
          selectedMaterial={selectedMaterial}
          setSelectedMaterial={setSelectedMaterial}
          onAddNewMaterial={handleAddNewMaterial}
          onUpdateAsset={handleUpdateAsset}
        />
      </div>
    </div>
  );
}
