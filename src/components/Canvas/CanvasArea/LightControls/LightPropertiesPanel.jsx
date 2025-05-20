import React from "react";

export default function LightPropertiesPanel({ light, onUpdate, onRemove }) {
  const handleChange = (property, value) => {
    onUpdate({ [property]: value });
  };

  const handlePositionChange = (axis, value) => {
    const newPosition = [...light.position];
    newPosition[axis] = parseFloat(value) || 0;
    onUpdate({ position: newPosition });
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg mb-4 border border-gray-600 relative">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-gray-400 hover:text-white text-lg"
      >
        ×
      </button>

      <h3 className="text-white mb-3 font-medium">
        {light.type.charAt(0).toUpperCase() + light.type.slice(1)} Light
      </h3>

      <div className="space-y-3">
        <div>
          <label className="block text-gray-300 mb-1 text-sm">Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={`#${light.color.toString(16).padStart(6, "0")}`}
              onChange={(e) =>
                handleChange("color", parseInt(e.target.value.slice(1), 16))
              }
              className="h-8 w-12 cursor-pointer"
            />
            <span className="text-gray-400 text-xs">
              #{light.color.toString(16).padStart(6, "0")}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-1 text-sm">
            Intensity: {light.intensity.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={light.intensity}
            onChange={(e) =>
              handleChange("intensity", parseFloat(e.target.value))
            }
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {light.type !== "ambient" && (
          <>
            <div className="flex items-center justify-between">
              <label className="text-gray-300 text-sm">Cast Shadows</label>
              <input
                type="checkbox"
                checked={light.castShadow !== false}
                onChange={(e) => handleChange("castShadow", e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded"
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-gray-300 text-sm font-medium">Position</h4>
              <div className="grid grid-cols-3 gap-2">
                {["X", "Y", "Z"].map((axis, idx) => (
                  <div key={axis}>
                    <label className="block text-gray-400 text-xs mb-1">
                      {axis}
                    </label>
                    <input
                      type="number"
                      value={light.position[idx]}
                      onChange={(e) =>
                        handlePositionChange(idx, e.target.value)
                      }
                      className="w-full bg-gray-600 text-white p-1 rounded text-sm border border-gray-500"
                      step="0.1"
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
