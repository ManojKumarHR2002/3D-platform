import React, { useState } from "react";
import LightingControls from "../CanvasArea/LightControls/LightingControls";

export default function TopBar({ sceneInstance, onSave, saving }) {
  const [showLightingControls, setShowLightingControls] = useState(false);

  // Debug: Log when Save is clicked
  const handleSaveClick = () => {
    if (onSave) {
      onSave();
    } else {
      alert("Save handler not connected!");
    }
  };

  return (
    <div className="fixed top-0 left-0 z-50 flex justify-center pointer-events-none w-full">
      <div
        className="flex gap-4 items-center py-2.5 px-4 mt-6 w-auto max-w-4xl text-sm whitespace-nowrap rounded-xl bg-zinc-900 bg-opacity-80 text-white text-opacity-80 shadow-lg pointer-events-auto justify-center mx-auto min-w-[320px]"
        style={{ minWidth: 320 }}
      >
        {/* Left Section */}
        <button
          className="flex gap-2 px-3 py-2.5 rounded-xl bg-neutral-700 shadow focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          aria-label="Layout options"
        >
          <div>Layout</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/d2eb087205cfeda836c0ae1ed6f5e192cb387d015722cb3cf30f89304fc70ef4?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
            className="object-contain shrink-0 my-auto aspect-[1.5] w-[9px]"
            alt=""
          />
        </button>
        <div className="shrink-0 my-auto w-0 h-5 border-2 border-solid border-neutral-700" />
        <div className="relative">
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-2xl shadow focus:outline-none"
            aria-label="Lighting Controls"
            onClick={() => setShowLightingControls((prev) => !prev)}
            title="Lighting Controls"
          >
            +
          </button>
          {showLightingControls && (
            <div className="absolute left-0 mt-2 z-50">
              <LightingControls sceneInstance={sceneInstance} />
            </div>
          )}
        </div>
        <div className="shrink-0 my-auto w-0 h-5 border-2 border-solid border-neutral-700" />
        <button
          className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg"
          aria-label="Canvas tools"
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/ea4eede0e2d8973889d0149becc9d113f66c62766659c4fb67273b519da8803c?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
            className="object-contain shrink-0 rounded-none aspect-[1.06] w-[35px]"
            alt=""
          />
        </button>
        <div className="shrink-0 my-auto w-0 h-5 border-2 border-solid border-neutral-700" />
        {/* Center Section */}
        <button
          className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg p-2.5"
          aria-label="Undo"
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/7bb9edc5cbb83b04994ecf380b1eb689cdda54822b763f4a21e82113e7976ba4?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
            className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
            alt=""
          />
        </button>
        <div className="shrink-0 self-stretch my-auto w-0 h-5 border-2 border-solid border-neutral-700" />
        <button
          className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg p-2.5"
          aria-label="Redo"
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/f793412b018bf2e9007fb91d6732105045de4fd3563acdb13398cde43fc4156d?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
            className="object-contain shrink-0 self-stretch my-auto aspect-[1.21] w-[23px]"
            alt=""
          />
        </button>
        <div className="shrink-0 self-stretch my-auto w-0 h-5 border-2 border-solid border-neutral-700" />
        {/* Visibility Toggle Button */}
        <button
          className="flex gap-1 items-center px-5 py-2.5 rounded-xl bg-neutral-700 shadow focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 min-w-[90px] text-base font-medium"
          aria-label="Toggle Object Visibility"
          onClick={() => {
            if (sceneInstance && sceneInstance.getSelectedObject) {
              const obj = sceneInstance.getSelectedObject();
              if (obj && obj.setVisible) {
                obj.setVisible(!obj.isVisible());
                if (sceneInstance.render) sceneInstance.render();
              }
            } else {
              alert("No object selected or visibility toggle not available.");
            }
          }}
        >
          <span className="material-icons" style={{ fontSize: 16 }}>
            {sceneInstance &&
            sceneInstance.getSelectedObject &&
            sceneInstance.getSelectedObject() &&
            sceneInstance.getSelectedObject().isVisible()
              ? "visibility"
              : "visibility_off"}
          </span>
          <span className="ml-2"></span>
        </button>
        <div className="shrink-0 self-stretch my-auto w-0 h-5 border-2 border-solid border-neutral-700" />
        {/* Right Section */}
        <button
          className="px-5 py-2.5 rounded-xl bg-neutral-700 shadow focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 min-w-[90px]"
          onClick={handleSaveClick}
          disabled={saving}
          style={{
            opacity: saving ? 0.6 : 1,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <div className="shrink-0 self-stretch my-auto w-0 h-5 border-2 border-solid border-neutral-700" />
        <button className="px-5 py-2.5 rounded-xl bg-neutral-700 shadow focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 min-w-[90px]">
          Export
        </button>
      </div>
    </div>
  );
}
