import React, { useState, useEffect, useContext } from "react";
import LightTypeSelector from "./LightTypeSelector";
import LightPropertiesPanel from "./LightPropertiesPanel";
import { UIManagerContext } from "../CanvasArea";

export default function LightingControls({ sceneInstance }) {
  const [lightType, setLightType] = useState("directional");
  const [lights, setLights] = useState([]);
  const [selectedLight, setSelectedLight] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const uiManager = useContext(UIManagerContext);

  const addLight = (type) => {
    if (!sceneInstance) return;

    const lightObj = sceneInstance.addLight(type, {
      color: 0xffffff,
      intensity: 1,
      position: [0, 10, 10],
      shadow: true,
    });

    if (lightObj) {
      setLights([...lights, lightObj]);
      setSelectedLight(lightObj);
    }
  };

  const updateLight = (updatedProps) => {
    if (!sceneInstance || !selectedLight) return;

    sceneInstance.updateLight(selectedLight, updatedProps);
    setLights(
      lights.map((l) =>
        l.id === selectedLight.id ? { ...l, ...updatedProps } : l
      )
    );
    setSelectedLight({ ...selectedLight, ...updatedProps });
  };

  const removeLight = (id) => {
    if (!sceneInstance) return;

    const lightToRemove = lights.find((l) => l.id === id);
    if (lightToRemove) {
      sceneInstance.removeLight(lightToRemove);
      setLights(lights.filter((l) => l.id !== id));
      if (selectedLight?.id === id) setSelectedLight(null);
    }
  };

  useEffect(() => {
    if (sceneInstance && lights.length === 0) {
      const ambient = sceneInstance.addLight("ambient", {
        color: 0x404040,
        intensity: 0.5,
      });
      const directional = sceneInstance.addLight("directional", {
        color: 0xffffff,
        intensity: 1,
        position: [10, 32, 64],
        shadow: true,
      });
      setLights([ambient, directional]);
    }
  }, [sceneInstance]);

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-medium">Lighting Controls</h3>
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="text-gray-300 hover:text-white text-lg"
        >
          {isPanelOpen ? "▲" : "▼"}
        </button>
      </div>

      {isPanelOpen && (
        <>
          <LightTypeSelector
            lightType={lightType}
            setLightType={setLightType}
            onAddLight={() => addLight(lightType)}
          />

          {selectedLight && (
            <LightPropertiesPanel
              light={selectedLight}
              onUpdate={updateLight}
              onRemove={() => removeLight(selectedLight.id)}
            />
          )}

          <div className="mt-4">
            <h4 className="text-white mb-2 font-medium">Existing Lights</h4>
            <div className="max-h-40 overflow-y-auto">
              {lights.map((light) => (
                <div
                  key={light.id}
                  className={`p-2 mb-1 cursor-pointer rounded transition-colors ${
                    selectedLight?.id === light.id
                      ? "bg-blue-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={() => setSelectedLight(light)}
                >
                  <div className="flex justify-between items-center">
                    <span className="capitalize">{light.type} Light</span>
                    <span className="text-sm opacity-80">
                      {light.intensity.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
