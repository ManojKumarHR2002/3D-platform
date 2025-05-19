import React, { useState } from "react";
import CanvasWrapper from "@components/Canvas/CanvasWrapper";
import { saveProject } from "../../services/MyProjects.js";
import TopBar from "@components/Canvas/TopBar/TopBar";

 // Ensure correct path

export default function CanvasPage() {
  const [saving, setSaving] = useState(false);
  const [sceneInstance, setSceneInstance] = useState(null);

  const handleSave = async () => {
    setSaving(true);
    if (!sceneInstance) {
      alert("No scene loaded to save!");
      setSaving(false);
      return;
    }

    // Serialize the scene
    const sceneData = sceneInstance.serialize ? sceneInstance.serialize() : null;

    const newProject = {
      id: Date.now(),
      title: `Project ${new Date().toLocaleTimeString()}`,
      description: "Edited just now",
      imgSrc: "https://st.depositphotos.com/1020070/1925/v/450/depositphotos_19252165-stock-illustration-heraldry-eagle-symbol-such-a.jpg", // Placeholder, replace with actual screenshot if possible
      sceneData,
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
      <TopBar sceneInstance={sceneInstance} onSave={handleSave} saving={saving} />
      <CanvasWrapper setSceneInstance={setSceneInstance} />
    </div>
  );
}
