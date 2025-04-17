import React, { useState, useRef } from 'react';
import ObjectsCard from './ObjectsCard';
import AssetsCard from './AssetsCard';

export default function ProjectHierarchyPanel({ 
  handleUpload, 
  uploading, 
  uploadProgress, 
  uploadedAssets,
  onSelectImage
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('objects');
  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col h-full px-2 py-6 text-sm rounded-xl bg-zinc-900 bg-opacity-80 text-white text-opacity-80">
      {/* 1. Project Header */}
      <div className="flex gap-5 justify-between mr-2.5 w-full font-medium max-md:ml-2.5">
        <div className="flex gap-2">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/.../icon.png"
            className="object-contain shrink-0 my-auto w-1.5 aspect-[0.67]"
            alt="Project icon"
          />
          <div>Project 1</div>
        </div>
        <button className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/.../settings.png"
            className="object-contain shrink-0 my-auto w-3.5 aspect-[1.56]"
            alt=""
          />
        </button>
      </div>

      <div className="shrink-0 mt-3.5 h-px border border-solid border-neutral-700" />

      {/* 2. Tabs */}
      <div className="flex self-start mt-3.5 whitespace-nowrap max-md:ml-1 w-[100%]">
        <button
          className={`px-5 py-2.5 w-[50%] font-semibold rounded-xl ${
            selectedTab === 'objects' ? 'bg-zinc-700' : 'bg-transparent'
          } shadow-[0px_2px_4px_rgba(0,0,0,0.1)] `}
          onClick={() => setSelectedTab('objects')}
        >
          Objects
        </button>
        <button
          className={`px-5 py-2.5 w-[50%] font-semibold rounded-xl ${
            selectedTab === 'assets' ? 'bg-zinc-700' : 'bg-transparent'
          } shadow-[0px_2px_4px_rgba(0,0,0,0.1)] `}
          onClick={() => setSelectedTab('assets')}
        >
          Assets
        </button>
      </div>

      <div className="shrink-0 mt-3.5 h-px border border-solid border-neutral-700" />

      {/* 3. Search */}
      <div className="flex w-[100%] gap-3.5 px-2.5 py-2 mt-4 mr-2.5 text-xs text-center whitespace-nowrap rounded-md bg-zinc-700 shadow-[0px_2px_4px_rgba(0,0,0,0.12)] text-white text-opacity-80 max-md:ml-2.5">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/.../search.png"
          className="object-contain shrink-0 self-start w-2.5 aspect-square"
          alt="Search icon"
        />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="grow shrink w-[145px] bg-transparent border-none focus:outline-none"
          placeholder="Search"
          aria-label="Search canvas items"
        />
      </div>

      {/* 4. Content Area */}
      <div className="flex-grow my-3.5">
        {selectedTab === 'objects' && <ObjectsCard />}
        {selectedTab === 'assets' && (
          <AssetsCard 
            uploadedAssets={uploadedAssets} 
            onSelectImage={onSelectImage}
          />
        )}
      </div>

      {/* 5. Navigation Buttons + File Input */}
      <div>
        <div className="shrink-0 h-px border border-solid border-neutral-700 max-md:mt-10" />
        <nav className="flex flex-col gap-3" aria-label="Canvas navigation">
          <button className="flex w-[100%] gap-5 self-start mt-3 pl-5 py-2 max-md:ml-2.5 rounded-lg bg-transparent focus:bg-zinc-700">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/.../assets.png"
              className="object-contain shrink-0 self-start aspect-[1.07] w-[15px]"
              alt=""
            />
            <span>My Assets</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />

          <button 
            onClick={triggerFileInput}
            disabled={uploading}
            className="flex w-[100%] gap-5 self-start pl-5 py-2 max-md:ml-2.5 rounded-lg bg-transparent focus:bg-zinc-700"
          >
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/.../import.png"
              className="object-contain ml-1 shrink-0 self-start aspect-[0.6] w-[9px]"
              alt=""
            />
            <span>{uploading ? `Uploading... ${uploadProgress}%` : "Import"}</span>
          </button>

          <button className="flex w-[100%] gap-5 self-start pl-5 py-2 max-md:ml-2.5 rounded-lg bg-transparent focus:bg-zinc-700">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/.../help.png"
              className="object-contain shrink-0 self-start aspect-[0.87] w-[13px]"
              alt=""
            />
            <span>Help & feedback</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
