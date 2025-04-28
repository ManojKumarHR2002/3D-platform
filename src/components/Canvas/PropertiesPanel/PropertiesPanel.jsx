import React, { useState, useEffect } from 'react';

export default function PropertiesPanel({ 
  uploadedAssets,
  selectedMaterial,
  setSelectedMaterial,
  onAddNewMaterial,
  onUpdateAsset,
  selectedObject,
  sceneObjects,
  updateSceneObjects,
  onObjectDelete,
  onExtractObjectMaterial   // ← NEW
}) {
  const [localAssets, setLocalAssets] = useState([]);
  const [mapSelectorType, setMapSelectorType] = useState(null);
  const [mapSelectorPosition, setMapSelectorPosition] = useState({ x: 0, y: 0 });
  const [textureSearchTerm, setTextureSearchTerm] = useState('');

  useEffect(() => {
    setLocalAssets(uploadedAssets || []);
  }, [uploadedAssets]);

  const filteredTextures = uploadedAssets
    ?.filter(a => a.type === 'image')
    ?.filter(a => a.name.toLowerCase().includes(textureSearchTerm.toLowerCase())) || [];

  // -------------------------
  // Object Properties
  // -------------------------
  const ObjectProperties = () => {
    const obj = sceneObjects?.find(o => o.id === selectedObject);
    if (!obj) return null;

    const updateProp = (prop, value) => {
      const updated = sceneObjects.map(o =>
        o.id === selectedObject ? { ...o, [prop]: value } : o
      );
      updateSceneObjects(updated);
    };

    const handleDeleteObj = () => {
      updateSceneObjects(prev => prev.filter(o => o.id !== selectedObject));
      onObjectDelete();
    };

    return (
      <div className="mt-4 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-sm">Object Properties</h3>
          <button
            onClick={handleDeleteObj}
            className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded"
          >
            Delete Object
          </button>
        </div>

        {['position','rotation','scale'].map(prop => (
          <div key={prop} className="space-y-1">
            <label className="text-xs text-gray-300 capitalize">{prop}</label>
            <div className="flex gap-2">
              {[0,1,2].map(i => (
                <input
                  key={i}
                  type="number"
                  step={prop==='rotation'?0.1:0.01}
                  value={obj[prop][i]}
                  onChange={e => {
                    const arr = [...obj[prop]];
                    arr[i] = parseFloat(e.target.value) || 0;
                    updateProp(prop, arr);
                  }}
                  className="w-full px-2 py-1 text-xs bg-zinc-700 rounded"
                />
              ))}
            </div>
          </div>
        ))}

        {/* ────────── EXTRACT BUTTON ────────── */}
        <div className="mt-4 pt-4 border-t border-zinc-700">
          <h4 className="text-xs text-gray-400 mb-2">Object Material</h4>
          {!obj.material ? (
            <p className="text-xs text-gray-500">No material applied</p>
          ) : (
            <button
              onClick={() => onExtractObjectMaterial(selectedObject)}
              className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              Extract Material
            </button>
          )}
        </div>
      </div>
    );
  };

  // -------------------------
  // Material Properties
  // (your original code, verbatim)
  // -------------------------
  const handleSelect = (asset) => {
    if (asset.type === 'image') {
      const material = {
        ...asset,
        baseColor: '#666666',
        baseMap: null,
        metallic: 0,
        metallicMap: null,
        smoothness: 0.5,
        normalMap: null,
        heightMap: null
      };
      setSelectedMaterial(material);
    } else {
      setSelectedMaterial(asset);
    }
  };

  const updateMaterial = (updated) => {
    setSelectedMaterial(updated);
    onUpdateAsset(updated);
    setLocalAssets(prev =>
      prev.map(a => a.id === updated.id ? updated : a)
    );
  };

  const handleCreateEmptyMaterial = () => {
    const newId = Date.now();
    const newEmpty = {
      id: newId,
      name: `Material ${newId.toString().slice(-4)}`,
      url: null,
      type: 'material',
      baseColor: '#666666',
      baseMap: null,
      metallic: 0,
      metallicMap: null,
      smoothness: 0.5,
      normalMap: null,
      heightMap: null
    };
    setLocalAssets(prev => [...prev, newEmpty]);
    onAddNewMaterial(newEmpty);
    handleSelect(newEmpty);
  };

  const showMapSelector = (e, type) => {
    const rect = e.target.getBoundingClientRect();
    const popupWidth = 280;
    let left = rect.left;
    if (left + popupWidth > window.innerWidth) {
      left = window.innerWidth - popupWidth - 10;
    }
    setMapSelectorPosition({ x: left, y: rect.bottom + window.scrollY });
    setMapSelectorType(type);
    setTextureSearchTerm('');
  };

  const assignMapImage = (img) => {
    if (!selectedMaterial) return;
    const updated = { ...selectedMaterial, [mapSelectorType]: img };
    updateMaterial(updated);
    setMapSelectorType(null);
  };

  const updateBaseColor = (color) => updateMaterial({ ...selectedMaterial, baseColor: color });
  const updateMetallic  = (v) => updateMaterial({ ...selectedMaterial, metallic: parseFloat(v) });
  const updateSmoothness= (v) => updateMaterial({ ...selectedMaterial, smoothness: parseFloat(v) });

  const renderMapSelector = (label, key) => {
    const map = selectedMaterial?.[key];
    return (
      <div className="flex items-center gap-2 mt-2">
        <div
          className="w-6 h-6 rounded border border-gray-500 cursor-pointer relative flex-shrink-0"
          onClick={e => showMapSelector(e, key)}
          style={{ backgroundColor: map ? 'transparent' : '#666666', overflow: 'hidden' }}
        >
          {map ? (
            <img src={map.url} alt={map.name} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">+</div>
          )}
        </div>
        <span className="text-xs text-gray-300">{label}</span>
        {map && (
          <span
            onClick={() => assignMapImage({ ...selectedMaterial, [key]: null })}
            className="text-xs text-gray-400 cursor-pointer hover:text-red-400 ml-auto"
          >×</span>
        )}
      </div>
    );
  };

  const renderSlider = (label, value, onChange, min = 0, max = 1, step = 0.01) => (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 opacity-0" />
        <span className="text-gray-300">{label}</span>
        <span className="text-xs text-gray-400 ml-auto">{value?.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value ?? 0}
        onChange={e => onChange(e.target.value)}
        className="w-full"
      />
    </div>
  );

  return (
    <div 
      className="flex flex-col h-full px-2 pt-2.5 font-medium whitespace-nowrap rounded-xl bg-zinc-900 bg-opacity-80 overflow-hidden"
      style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
    >
      <div className="flex-1 overflow-y-auto pb-4">
        {selectedObject ? (
          <ObjectProperties />
        ) : selectedMaterial ? (
          <div className="mb-4 flex flex-col items-center justify-center">
            <p className="text-white text-sm mb-2">
              Selected {selectedMaterial.type === 'image' ? 'Texture' : 'Material'}
            </p>
            <div className="w-full rounded border border-gray-700 overflow-hidden">
              {selectedMaterial.url ? (
                <img src={selectedMaterial.url} alt={selectedMaterial.name} className="w-full h-24 object-cover" />
              ) : selectedMaterial.baseMap ? (
                <img src={selectedMaterial.baseMap.url} alt={selectedMaterial.baseMap.name} className="w-full h-24 object-cover" />
              ) : (
                <div className="w-full h-24" style={{ backgroundColor: selectedMaterial.baseColor || '#333333' }} />
              )}
            </div>
            <p className="text-xs text-gray-300 mt-2 text-center w-full truncate px-1">{selectedMaterial.name}</p>

            {selectedMaterial.type === 'material' && (
              <div className="mt-3 w-full text-xs text-white space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border border-gray-500 overflow-hidden">
                    <input type="color" value={selectedMaterial.baseColor || '#666666'} onChange={e => updateBaseColor(e.target.value)} className="w-full h-full cursor-pointer" />
                  </div>
                  <span className="text-gray-300">Base Color</span>
                </div>
                {renderMapSelector("Base Map","baseMap")}
                {renderMapSelector("Metallic Map","metallicMap")}
                {!selectedMaterial.metallicMap && renderSlider("Metallic",selectedMaterial.metallic??0,updateMetallic)}
                {renderMapSelector("Normal Map","normalMap")}
                {renderMapSelector("Height Map","heightMap")}
                {renderSlider("Smoothness",selectedMaterial.smoothness??0.5,updateSmoothness)}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-10">
            Select an object or material
          </div>
        )}

        {mapSelectorType && (
          <div
            className="fixed z-50 bg-zinc-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden"
            style={{
              left: `${mapSelectorPosition.x}px`,
              top: `${mapSelectorPosition.y}px`,
              width: '280px',
              maxHeight: '300px',
            }}
          >
            <div className="p-2 border-b border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <p className="text-white text-xs">Select an image for {mapSelectorType}</p>
                <button onClick={() => setMapSelectorType(null)} className="text-gray-400 hover:text-white">×</button>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 mb-2 bg-zinc-700 rounded">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text" value={textureSearchTerm}
                  onChange={e => setTextureSearchTerm(e.target.value)}
                  placeholder="Search textures…"
                  className="flex-1 bg-transparent text-xs text-white focus:outline-none" autoFocus
                />
              </div>
            </div>
            <div className="overflow-y-auto p-2" style={{ height: '220px' }}>
              {filteredTextures.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {filteredTextures.map(img => (
                    <div
                      key={img.id}
                      onClick={() => assignMapImage(img)}
                      className="cursor-pointer border border-gray-600 hover:border-blue-500 rounded"
                    >
                      <img src={img.url} alt={img.name} className="w-full h-14 object-cover rounded" />
                      <p className="text-xs text-gray-300 truncate px-1 mt-1 text-center">{img.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-10">
                  {uploadedAssets.filter(a => a.type==='image').length===0
                    ? "No images available"
                    : "No matching textures found"}
                </p>
              )}
            </div>
          </div>
        )}

        {!selectedObject && (
          <div className="mt-4">
            <button
              onClick={handleCreateEmptyMaterial}
              className="w-full px-3 py-2 text-sm rounded-lg bg-zinc-700 text-white hover:bg-zinc-600"
            >
              + Create New Material
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
