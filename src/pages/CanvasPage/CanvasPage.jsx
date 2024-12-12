import React from 'react';
import ProjectHierarchyPanel from '../../components/Canvas/ProjectHierarchyPanel/ProjectHierarchyPanel';
import TopBar from '../../components/Canvas/TopBar/TopBar';
import CanvasArea from '../../components/Canvas/CanvasArea/CanvasArea';
import PropertiesPanel from '../../components/Canvas/PropertiesPanel/PropertiesPanel';

export default function CanvasPage() {
  return (
    <div className="flex w-screen h-screen bg-zinc-800">
      {/* Project Hierarchy Panel */}
      <div className="flex-shrink-0 w-[15%] my-5 ml-5">
        <ProjectHierarchyPanel />
      </div>

      {/* Center Content with TopBar and CanvasArea */}
      <div className="flex flex-col w-full items-center justify-center my-5">
        <TopBar />
        <div className="flex-grow">
          <CanvasArea />
        </div>
      </div>

      {/* Properties Panel */}
      <div className="flex-shrink-0 w-[15%] my-5 mr-5">
        <PropertiesPanel />
      </div>
    </div>
  );
}
