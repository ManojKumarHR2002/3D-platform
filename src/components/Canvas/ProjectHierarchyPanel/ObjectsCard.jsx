import React, { useState } from "react";
import { supabase } from "@src/supabase/Supabase";

export default function ObjectsCard({ uploadedModels }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newName, setNewName] = useState("");

  // Handle double-click to start renaming
  const handleDoubleClick = (index, currentName) => {
    setEditingIndex(index);
    setNewName(currentName);
  };

  // Handle input change
  const handleChange = (e) => {
    setNewName(e.target.value);
  };

  // Handle saving name change
  const handleRename = async (index) => {
    if (!newName.trim()) return;
    
    const modelName = uploadedModels[index]; // Get the original model name

    // Update in Supabase
    const { error } = await supabase
      .from("models")
      .update({ name: newName })
      .eq("name", modelName); // Match by model name

    if (error) {
      console.error("Error updating name:", error);
    } else {
      // Update locally
      uploadedModels[index] = newName;
    }

    setEditingIndex(null);
  };

  // Handle Enter key or blur event to save
  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") handleRename(index);
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
        {uploadedModels.length > 0 ? (
          uploadedModels.map((model, index) => (
            <div key={index} className="mt-1">
              {editingIndex === index ? (
                <input
                  type="text"
                  className="bg-transparent border-b border-white outline-none text-white"
                  value={newName}
                  autoFocus
                  onChange={handleChange}
                  onBlur={() => handleRename(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ) : (
                <span
                  onDoubleClick={() => handleDoubleClick(index, model)}
                  className="cursor-pointer"
                >
                  {model}
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-xs mt-2">No models uploaded</div>
        )}
      </div>
    </div>
  );
}
