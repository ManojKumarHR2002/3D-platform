import React from "react";

export default function AssetsCard({ uploadedAssets, onSelectImage }) {
  const handleDelete = (e, assetId) => {
    e.stopPropagation();
    // Add your delete logic here
  };

  const scrollbarHideStyle = {
    msOverflowStyle: 'none',  // IE and Edge
    scrollbarWidth: 'none',   // Firefox
    '&::-webkit-scrollbar': { 
      display: 'none'         // Chrome, Safari and Opera
    }
  };

  return (
    <div 
      className="p-4 bg-zinc-800 rounded-lg h-64 overflow-y-auto" 
      style={scrollbarHideStyle}
    >
      {uploadedAssets && uploadedAssets.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {uploadedAssets.map((asset) => (
            <div 
              key={asset.id} 
              className="relative group cursor-pointer"
              onClick={() => onSelectImage(asset)}
            >
              <div className="relative aspect-square overflow-hidden rounded-lg">
                {asset.url ? (
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full"
                    style={{ backgroundColor: asset.baseColor || '#666666' }}
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => handleDelete(e, asset.id)}
                    className="text-white text-xs bg-red-500 hover:bg-red-600 rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-300 truncate" title={asset.name}>
                {asset.name}
                {asset.type === 'material' && (
                  <span className="block text-xs text-gray-400">Material</span>
                )}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No assets to display.</p>
      )}
    </div>
  );
}
