import React from 'react';

export default function PropertiesPanel() {
  return (
    <div className="flex flex-col h-full px-2 pt-2.5 font-medium whitespace-nowrap rounded-xl bg-zinc-900 bg-opacity-80 pb-[753px] max-md:pb-24">
      <div className="flex gap-5 justify-between max-md:mr-2.5 max-md:ml-2">
        <div 
          role="status" 
          aria-label="User profile"
          className="px-2 my-auto text-base bg-red-400 h-[25px] rounded-[30px] shadow-[0px_2px_4px_rgba(0,0,0,0.12)] text-white text-opacity-90 w-[25px]">
          R
        </div>
        <button 
          className="px-4 py-1.5 text-sm rounded-xl bg-neutral-700 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] text-white text-opacity-80 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
          Share
        </button>
      </div>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/aceccc27edd557321cd1a5766d2bebbec88ed4213c6137b72e38c97448156ee7?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
        className="object-contain mt-3 w-52 rounded-none"
        alt="Properties panel content"
      />
    </div>
  );
}