// CanvasWrapper.jsx
import React, { useState } from "react";
import CanvasArea from "./CanvasArea/CanvasArea";
import ProjectHierarchyPanel from "./ProjectHierarchyPanel/ProjectHierarchyPanel";
import { createFileUploader } from "@utils/uploadUtilis";
import TopBar from "./TopBar/TopBar";
import PropertiesPanel from "./PropertiesPanel/PropertiesPanel";

export default function CanvasWrapper() {
  // State
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [latestModel, setLatestModel] = useState(null);
  const [error, setError] = useState(null);

  const [uploadedAssets, setUploadedAssets] = useState([]); // textures + materials
  const [sceneObjects, setSceneObjects] = useState([]);     // primitives & models

  const [selectedObject, setSelectedObject]     = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  // 1) File upload (images + 3D) — exactly as before
  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    setUploadProgress(0);

    // image files
    const imageFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (imageFiles.length) {
      const newImgs = [];
      imageFiles.forEach((file, idx) => {
        const reader = new FileReader();
        reader.onload = ev => {
          newImgs.push({ id: Date.now()+idx, name: file.name, type: "image", url: ev.target.result });
          if (newImgs.length === imageFiles.length) {
            setUploadedAssets(prev => [...prev, ...newImgs]);
            setUploading(false);
          }
        };
        reader.readAsDataURL(file);
      });
    }

    // 3D model files
    const modelFiles = Array.from(files).filter(f => /\.(gltf|glb|fbx)$/i.test(f.name));
    if (modelFiles.length) {
      const uploader = createFileUploader(
        setError,
        setUploading,
        setUploadProgress,
        setLatestModel
      );
      uploader({ target: { files: modelFiles } });
    }
  };

  // 2) Select asset (texture or material) in Assets tab
  const handleImageSelect = (asset) => {
    if (asset.type === "image") {
      const mat = {
        ...asset,
        baseColor: "#666666",
        baseMap: null,
        metallicMap: null,
        smoothness: 0.5,
        normalMap: null,
        heightMap: null
      };
      setSelectedMaterial(mat);
      setSelectedObject(null);
    } else {
      setSelectedMaterial(asset);
      setSelectedObject(null);
    }
  };

  // 3) Update an existing material
  const handleUpdateAsset = (updated) => {
    setUploadedAssets(prev => prev.map(a => a.id === updated.id ? updated : a));
    if (selectedMaterial?.id === updated.id) {
      setSelectedMaterial(updated);
    }
  };

  // 4) + Create new empty material
  const handleAddNewMaterial = (mat) => {
    setUploadedAssets(prev => [...prev, mat]);
  };

  // 5) Delete asset
  const handleDeleteAsset = (assetId) => {
    setUploadedAssets(prev => prev.filter(a => a.id !== assetId));
    setSceneObjects(prev =>
      prev.map(o => o.material?.id === assetId ? { ...o, material: null } : o)
    );
    if (selectedMaterial?.id === assetId) {
      setSelectedMaterial(null);
    }
  };

  // 6) + Add primitive object
  const handleCreateObject = (type) => {
    const rand = () => (Math.random() - 0.5) * 3;
    const obj = {
      id: Date.now(),
      type,
      position: [rand(), rand(), rand()],
      rotation: [0,0,0],
      scale: [1,1,1],
      material: null
    };
    setSceneObjects(prev => [...prev, obj]);
  };

  // 7) Apply material via drag/drop in CanvasArea
  const handleApplyMaterial = (objectId, material) => {
    setSceneObjects(prev =>
      prev.map(o => o.id === objectId ? { ...o, material } : o)
    );
  };

  // ───────────── NEW ─────────────
  // 8) Select object (canvas OR left‐panel icon)
  const handleSelectObject = (objectId) => {
    setSelectedObject(objectId);
    setSelectedMaterial(null);
  };

  // 9) Extract that object's material into Assets & show it
  const handleExtractObjectMaterial = (objectId) => {
    const obj = sceneObjects.find(o => o.id === objectId);
    if (!obj?.material) return;
    const mat = obj.material;
    setUploadedAssets(prev =>
      prev.some(a => a.id === mat.id) ? prev : [...prev, mat]
    );
    setSelectedMaterial(mat);
    setSelectedObject(null);
  };
  // ──────────────────────────────────

  return (
    <div className="flex w-screen h-screen bg-zinc-800">
      {/* Left: ProjectHierarchyPanel */}
      <div className="w-[15%] my-5 ml-5">
        <ProjectHierarchyPanel
          handleUpload={handleFileUpload}
          uploading={uploading}
          uploadProgress={uploadProgress}
          uploadedAssets={uploadedAssets}
          sceneObjects={sceneObjects}
          onSelectImage={handleImageSelect}
          onCreateObject={handleCreateObject}
          onDeleteAsset={handleDeleteAsset}
          onSelectObject={handleSelectObject}
        />                    
      </div>

      {/* Center: CanvasArea */}
      <div className="flex flex-col gap-5 w-[70%] items-center justify-center my-5 mx-5">
        <TopBar />
        <CanvasArea
          latestModel={latestModel}
          error={error}
          sceneObjects={sceneObjects}
          selectedObject={selectedObject}
          onObjectSelect={handleSelectObject}
          onApplyMaterial={handleApplyMaterial}
        />
      </div>

      {/* Right: PropertiesPanel */}
      <div className="w-[15%] my-5 mr-5">
        <PropertiesPanel
          uploadedAssets={uploadedAssets}
          selectedMaterial={selectedMaterial}
          setSelectedMaterial={setSelectedMaterial}
          onAddNewMaterial={handleAddNewMaterial}
          onUpdateAsset={handleUpdateAsset}
          selectedObject={selectedObject}
          sceneObjects={sceneObjects}
          updateSceneObjects={setSceneObjects}
          onObjectDelete={() => setSelectedObject(null)}
          onExtractObjectMaterial={handleExtractObjectMaterial}  
        />
      </div>
    </div>
  );
}
