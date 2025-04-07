
import React, { useState } from "react";
import CanvasWrapper from "@components/Canvas/CanvasWrapper";
import { saveProject } from "../../services/MyProjects.js";

 // Ensure correct path

export default function CanvasPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    
    const newProject = {
      id: Date.now(),
      title: `Project ${new Date().toLocaleTimeString()}`,
      description: "Edited just now",
      imgSrc: "https://st.depositphotos.com/1020070/1925/v/450/depositphotos_19252165-stock-illustration-heraldry-eagle-symbol-such-a.jpg", // Placeholder, replace with actual screenshot if possible
    };

    try {
      await saveProject(newProject);
      alert("Project saved successfully!");
    } catch (error) {
      console.error("Failed to save project:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex w-screen h-screen bg-zinc-800">
      <button
        onClick={handleSave}
        className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save"}
      </button>
      <CanvasWrapper />
    </div>
  );
}
