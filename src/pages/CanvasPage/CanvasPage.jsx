import React from 'react';
import CanvasWrapper from '@components/Canvas/CanvasWrapper';
import EnvironmentSettings from '@components/Canvas/EnvironmentSettings';
import PropertiesPanel from "@components/Canvas/PropertiesPanel";



export default function CanvasPage() {
  return (
    <div className="relative w-screen h-screen bg-zinc-800">
      <CanvasWrapper />

      <div className="absolute top-4 left-4 z-50">
        <EnvironmentSettings />
      </div>

      <div className="absolute top-4 right-4 z-50">
        <PropertiesPanel />
      </div>
    </div>
  );
}
