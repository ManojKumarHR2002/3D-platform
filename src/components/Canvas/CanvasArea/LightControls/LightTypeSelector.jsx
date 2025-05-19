import React from "react";

export default function LightTypeSelector({
  lightType,
  setLightType,
  onAddLight,
}) {
  return (
    <div className="flex gap-2 mb-4">
      <select
        value={lightType}
        onChange={(e) => setLightType(e.target.value)}
        className="bg-gray-700 text-white p-2 rounded flex-grow border border-gray-600 focus:border-blue-500 focus:outline-none"
      >
        <option value="ambient">Ambient</option>
        <option value="directional">Directional</option>
        <option value="point">Point</option>
        <option value="spot">Spot</option>
      </select>
      <button
        onClick={onAddLight}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center p-0 transition-colors"
        aria-label="Add Light"
        style={{ fontSize: 24, lineHeight: 1 }}
      >
        <span style={{ display: 'block', width: '100%', textAlign: 'center', fontWeight: 'bold' }}>+</span>
      </button>
    </div>
  );
}
