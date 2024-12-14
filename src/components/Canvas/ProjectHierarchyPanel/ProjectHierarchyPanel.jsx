import React, { useState } from 'react';
import ObjectsCard from './ObjectsCard';
import AssetsCard from './AssetsCard';

export default function ProjectHierarchyPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('objects'); // Default to 'objects'

  return (
    <div className="flex flex-col h-full px-2 py-6 text-sm rounded-xl bg-zinc-900 bg-opacity-80 text-white text-opacity-80">
      <div className="flex gap-5 justify-between mr-2.5 w-full font-medium max-md:ml-2.5">
        <div className="flex gap-2">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/19ed00cf02cda9f87586dc8c51ccbdb2dee9c6cc1068980ec9e48b3899211658?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
            className="object-contain shrink-0 my-auto w-1.5 aspect-[0.67]"
            alt="Project icon"
          />
          <div>Project 1</div>
        </div>
        <button
          aria-label="Project settings"
          className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg"
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/b2e1bc97696e0ff981b4a4a5320b9944ad77c6c152c4d725142583e872c1de21?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
            className="object-contain shrink-0 my-auto w-3.5 aspect-[1.56]"
            alt=""
          />
        </button>
      </div>
      <div className="shrink-0 mt-3.5 h-px border border-solid border-neutral-700" />
      <div className="flex gap-10 self-start mt-3.5 whitespace-nowrap max-md:ml-1">
        <button
          className={`px-5 py-2.5 font-semibold rounded-xl ${
            selectedTab === 'objects' ? 'bg-neutral-700' : 'bg-transparent'
          } shadow-[0px_2px_4px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50`}
          onClick={() => setSelectedTab('objects')}
        >
          Objects
        </button>
        <button
          className={`px-5 py-2.5 font-semibold rounded-xl ${
            selectedTab === 'assets' ? 'bg-neutral-700' : 'bg-transparent'
          } shadow-[0px_2px_4px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50`}
          onClick={() => setSelectedTab('assets')}
        >
          Assets
        </button>
      </div>
      <div className="shrink-0 mt-3.5 h-px border border-solid border-neutral-700" />
      <div className="mt-3.5">
        {selectedTab === 'objects' && <ObjectsCard />}
        {selectedTab === 'assets' && <AssetsCard />}
      </div>
      <div className="absolute bottom-10">
        <div className="shrink-0 h-px border border-solid border-neutral-700 max-md:mt-10" />
        <nav className="flex flex-col gap-6" aria-label="Canvas navigation">
          <button className="flex gap-5 self-start mt-5 ml-5 max-md:ml-2.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/1fa831e6b7eee84d8a4bda26e64ee90d59c6143c030f8acfda0266085c11350e?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
              className="object-contain shrink-0 self-start aspect-[1.07] w-[15px]"
              alt=""
            />
            <span>My Assets</span>
          </button>
          <button className="flex gap-5 self-start ml-5 max-md:ml-2.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/27e5c33d3ec441cada5422455c24a8483dc87593c9290749f6427246aee7decc?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
              className="object-contain shrink-0 self-start aspect-[0.6] w-[9px]"
              alt=""
            />
            <span>Import</span>
          </button>
          <button className="flex gap-5 self-start ml-5 max-md:ml-2.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/ce1a1673260eaf1e4a4f81c2caacf861adfe83d92aa5f08414c0d5d172a3268a?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
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
