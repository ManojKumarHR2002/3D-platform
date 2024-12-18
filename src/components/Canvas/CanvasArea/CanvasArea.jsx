import React from 'react';
import SplitPane from './CanvasComponents/SplitPane';


export default function CanvasArea() {
  const initialState = {
    cameraPosition: [10, 10, 10],
    cameraTarget: [0, 0, 0],
    boxPosition: [0, 0, 0],
    boxRotation: [0, 0, 0],
    lighting: {
      ambientIntensity: 0.5,
      pointLightPosition: [10, 10, 10],
    }
  };

  return (
    <div 
      role="main"
      aria-label="Canvas workspace"
      className="flex mx-5 rounded-lg aspect-square bg-neutral-600 h-[90%] w-[100%] " 
    >
      <SplitPane initialSceneState={initialState} />
    </div>
  );
}