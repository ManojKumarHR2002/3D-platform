import React, { useState } from "react";
import { renameModel } from "./renameModel";
import HierarchyTree from "./HierarchyTree";
import './ProjectHierarchyPanel.css';

export default function ObjectsCard({ uploadedModels, onHierarchyChange, highlightModel, selectedModel, canvasAreaRef }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newName, setNewName] = useState("");

  console.log('ObjectsCard - Received uploadedModels:', uploadedModels);
  console.log('ObjectsCard - Selected model:', selectedModel);

  const handleModelClick = (modelName, event) => {
    console.log('Model clicked:', modelName);
    console.log('Current selected model:', selectedModel);
    
    // If already selected, deselect it
    if (selectedModel === modelName) {
      console.log('Deselecting model:', modelName);
      highlightModel(null);
    } else {
      console.log('Selecting model:', modelName);
      highlightModel(modelName);
    }
    
    event.stopPropagation(); // Prevent event from bubbling to canvas
  };

  return (
    <div className="p-4 bg-zinc-800 rounded-lg h-[100%]">
      <div className="flex gap-5 justify-between">
        <div className="flex gap-2">
          <div>Scene 1</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/6c6df1dbc5f96b387b979a0bdc6231f6da9bd81497f448e9cb103d1ac2d6bdce?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
            className="object-contain shrink-0 my-auto w-1.5 aspect-[0.67]"
            alt="Scene indicator"
          />
        </div>
        <button
          aria-label="Scene options"
          className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg"
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/364c46597119570f620ea40d2c71b0c4853b10d551264e876cde24ab4c33c023?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
            className="object-contain shrink-0 my-auto aspect-square w-[13px]"
            alt=""
          />
        </button>
      </div>

      <div className="mt-3 text-white text-opacity-70 text-xs">
        {Array.isArray(uploadedModels) && uploadedModels.length > 0 ? (
          <HierarchyTree
            uploadedModels={uploadedModels}
            selectedModel={selectedModel}
            onModelClick={handleModelClick}
            onHierarchyChange={onHierarchyChange}
            canvasAreaRef={canvasAreaRef}
          />
        ) : (
          <div className="text-gray-500 text-xs mt-2">No models uploaded</div>
        )}
      </div>
    </div>
  );
}
