import React, { useRef, useState } from 'react';
import { isParentOf } from './hierarchyUtils';
import { renameModel } from './renameModel';

const ChevronIcon = ({ expanded }) => (
  <svg viewBox="0 0 6 10" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.4 0L0 1.4L3.6 5L0 8.6L1.4 10L6.4 5L1.4 0Z" />
  </svg>
);

const HierarchyTreeNode = ({
  node,
  selectedModel,
  level = 0,
  onNodeClick,
  onNodeToggle,
  onStartDrag,
  onDragOver,
  onDragLeave,
  onDrop,
  dragState,
  onRename,
  uploadedModels,
  canvasAreaRef
}) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [draggedAsChild, setDraggedAsChild] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);
  const nodeRef = useRef(null);
  const indent = level * 12;
  const hasChildren = node.children && node.children.length > 0;
  
  const handleArrowClick = (e) => {
    e.stopPropagation();
    onNodeToggle(node.id);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    
    if (!dragState.dragging) return;
    
    // Prevent dropping on itself or its children
    if (node.id === dragState.draggedId || isParentOf(dragState.draggedId, node.id)) {
      setIsDraggedOver(false);
      return;
    }
    
    setIsDraggedOver(true);
    
    // Determine if we're dragging as a child based on cursor position
    const rect = nodeRef.current.getBoundingClientRect();
    const mouseY = e.clientY;
    const threshold = rect.height / 3;
    
    // Top third: drop before, middle: drop as child, bottom: drop after
    if (mouseY > rect.top + threshold && mouseY < rect.bottom - threshold) {
      setDraggedAsChild(true);
    } else {
      setDraggedAsChild(false);
    }
    
    if (onDragOver) {
      onDragOver(e, node);
    }
  };
  
  const handleDragLeave = (e) => {
    setIsDraggedOver(false);
    setDraggedAsChild(false);
    
    if (onDragLeave) {
      onDragLeave(e);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    
    if (!dragState.dragging) return;
    
    // Prevent dropping on itself or its children
    if (node.id === dragState.draggedId || isParentOf(dragState.draggedId, node.id)) {
      setIsDraggedOver(false);
      setDraggedAsChild(false);
      return;
    }
    
    const position = draggedAsChild ? 'into' : 'before';
    
    if (onDrop) {
      onDrop(e, node, position);
    }
    
    setIsDraggedOver(false);
    setDraggedAsChild(false);
  };
  
  const handleDragStart = (e) => {
    e.stopPropagation();
    
    if (onStartDrag) {
      onStartDrag(e, node);
    }
  };

  const handleRename = async () => {
    if (!editName.trim() || editName === node.name) {
      setIsEditing(false);
      return;
    }

    // Find the index of the model in the flat list
    if (uploadedModels) {
      const index = uploadedModels.findIndex(m => m === node.fullPath);
      if (index !== -1) {
        // Call the rename function
        await renameModel(
          index,
          // For nested objects, we just rename the last part
          node.fullPath.split('/').slice(0, -1).concat(editName).join('/'),
          uploadedModels,
          () => setIsEditing(false),
          onRename,
          canvasAreaRef
        );
      }
    }

    setIsEditing(false);
  };
  
  return (
    <div>
      <div
        ref={nodeRef}
        className={`hierarchy-item ${selectedModel === node.fullPath ? 'bg-zinc-700 rounded' : ''} ${isDraggedOver ? 'drag-over' : ''} ${draggedAsChild ? 'drag-as-child' : ''}`}
        style={{ paddingLeft: `${indent}px` }}
        onClick={(e) => !isEditing && onNodeClick(node.fullPath, e)}
        draggable={!isEditing}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="hierarchy-item-content">
          {hasChildren ? (
            <div
              className={`hierarchy-arrow ${node.isExpanded ? 'expanded' : ''}`}
              onClick={handleArrowClick}
            >
              <ChevronIcon expanded={node.isExpanded} />
            </div>
          ) : (
            <div className="hierarchy-item-placeholder"></div>
          )}
          
          {isEditing ? (
            <input
              type="text"
              className="bg-transparent border-b border-white outline-none text-white px-1"
              value={editName}
              autoFocus
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") {
                  setIsEditing(false);
                  setEditName(node.name);
                }
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span 
              className="cursor-pointer hover:text-white"
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (node.isModel) {
                  setIsEditing(true);
                  setEditName(node.name);
                }
              }}
            >
              {node.name}
            </span>
          )}
        </div>
      </div>
      
      {hasChildren && node.isExpanded && (
        <div className="hierarchy-child-container">
          {node.children.map((child) => (
            <HierarchyTreeNode
              key={child.id}
              node={child}
              selectedModel={selectedModel}
              level={level + 1}
              onNodeClick={onNodeClick}
              onNodeToggle={onNodeToggle}
              onStartDrag={onStartDrag}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              dragState={dragState}
              onRename={onRename}
              uploadedModels={uploadedModels}
              canvasAreaRef={canvasAreaRef}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HierarchyTreeNode; 