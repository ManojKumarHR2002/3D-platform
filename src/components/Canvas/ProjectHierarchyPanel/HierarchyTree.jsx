import React, { useState, useEffect } from 'react';
import HierarchyTreeNode from './HierarchyTreeNode';
import { buildHierarchy, flattenHierarchy, toggleNodeExpanded, processDragDrop } from './hierarchyUtils';

const HierarchyTree = ({ uploadedModels, selectedModel, onModelClick, onHierarchyChange, canvasAreaRef }) => {
  const [hierarchy, setHierarchy] = useState({ id: 'root', name: 'root', children: [], isExpanded: true });
  const [dragState, setDragState] = useState({ dragging: false, draggedId: null });

  // Build hierarchy when models change
  useEffect(() => {
    if (Array.isArray(uploadedModels) && uploadedModels.length > 0) {
      const newHierarchy = buildHierarchy(uploadedModels);
      setHierarchy(newHierarchy);
    } else {
      setHierarchy({ id: 'root', name: 'root', children: [], isExpanded: true });
    }
  }, [uploadedModels]);

  const handleNodeClick = (nodeId, event) => {
    if (onModelClick) {
      onModelClick(nodeId, event);
    }
  };

  const handleNodeToggle = (nodeId) => {
    const newHierarchy = toggleNodeExpanded(hierarchy, nodeId);
    setHierarchy(newHierarchy);
  };

  const handleDragStart = (e, node) => {
    setDragState({
      dragging: true,
      draggedId: node.id
    });
    e.dataTransfer.setData('text/plain', node.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, targetNode, position) => {
    e.preventDefault();
    
    if (!dragState.dragging) return;
    
    const newHierarchy = processDragDrop(
      hierarchy,
      dragState.draggedId,
      targetNode.id,
      position
    );
    
    setHierarchy(newHierarchy);
    setDragState({ dragging: false, draggedId: null });
    
    // Convert back to flat list for parent component
    const flatModels = flattenHierarchy(newHierarchy);
    if (onHierarchyChange) {
      onHierarchyChange(flatModels);
    }
  };

  return (
    <div className="hierarchy-tree">
      {hierarchy.children.map((node) => (
        <HierarchyTreeNode
          key={node.id}
          node={node}
          selectedModel={selectedModel}
          onNodeClick={handleNodeClick}
          onNodeToggle={handleNodeToggle}
          onStartDrag={handleDragStart}
          onDrop={handleDrop}
          dragState={dragState}
          onRename={onHierarchyChange}
          uploadedModels={uploadedModels}
          canvasAreaRef={canvasAreaRef}
        />
      ))}
    </div>
  );
};

export default HierarchyTree; 