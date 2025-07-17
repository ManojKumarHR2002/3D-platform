import { useEffect, useState } from "react";
import { useObjectStore } from "../../store/objectStore";

export default function PropertiesPanel() {
  const selectedObject = useObjectStore((state) => state.selectedObject);
  const updateObject = useObjectStore((state) => state.updateObject);
  const deleteObject = useObjectStore((state) => state.deleteObject);
  const duplicateObject = useObjectStore((state) => state.duplicateObject);

  const [properties, setProperties] = useState({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  });

  useEffect(() => {
    if (selectedObject) {
      setProperties({
        position: selectedObject.position || { x: 0, y: 0, z: 0 },
        rotation: selectedObject.rotation || { x: 0, y: 0, z: 0 },
        scale: selectedObject.scale || { x: 1, y: 1, z: 1 },
      });
    }
  }, [selectedObject]);

  const handleChange = (group, axis, value) => {
    const updated = {
      ...properties,
      [group]: {
        ...properties[group],
        [axis]: parseFloat(value),
      },
    };
    setProperties(updated);
    if (selectedObject) {
      updateObject(selectedObject.id, updated);
    }
  };

  const handleDelete = () => {
    if (selectedObject) {
      deleteObject(selectedObject.id);
    }
  };

  const handleDuplicate = () => {
    if (selectedObject) {
      duplicateObject(selectedObject.id);
    }
  };

  if (!selectedObject) return null;

  return (
    <div className="absolute right-4 top-4 bg-white/90 p-4 rounded shadow-md w-64 z-20">
      <h2 className="text-lg font-semibold mb-2">Object Properties</h2>

      {["position", "rotation", "scale"].map((group) => (
        <div key={group} className="mb-4">
          <label className="block font-medium capitalize">{group}</label>
          <div className="flex gap-2 mt-1">
            {["x", "y", "z"].map((axis) => (
              <input
                key={axis}
                type="number"
                step="0.1"
                value={properties[group][axis]}
                onChange={(e) => handleChange(group, axis, e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-2 mt-2">
        <button
          onClick={handleDelete}
          className="w-1/2 bg-red-500 text-white py-1 rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
        <button
          onClick={handleDuplicate}
          className="w-1/2 bg-blue-500 text-white py-1 rounded hover:bg-blue-600 transition"
        >
          Duplicate
        </button>
      </div>
    </div>
  );
}
