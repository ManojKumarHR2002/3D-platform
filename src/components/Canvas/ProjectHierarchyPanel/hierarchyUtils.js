// Utility functions for working with hierarchical data in the project panel

/**
 * Transforms a flat array of models into a hierarchical structure
 * using naming patterns to detect parent-child relationships
 * (e.g., "Car/Wheel" would make "Wheel" a child of "Car")
 */
export function buildHierarchy(models) {
  const hierarchy = {
    id: 'root',
    name: 'root',
    children: [],
    isExpanded: true
  };

  if (!Array.isArray(models) || models.length === 0) {
    return hierarchy;
  }

  // First pass: create nodes for all models
  models.forEach(modelName => {
    const pathParts = modelName.split('/');
    let currentLevel = hierarchy;
    
    // For each part of the path, create or find the node
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      const isLastPart = i === pathParts.length - 1;
      const fullPath = pathParts.slice(0, i + 1).join('/');
      
      // Look for existing node at this level
      let existingNode = currentLevel.children.find(child => child.name === part);
      
      if (!existingNode) {
        // Create a new node if it doesn't exist
        const newNode = {
          id: fullPath,
          name: part,
          fullPath: fullPath,
          isModel: isLastPart,
          children: [],
          isExpanded: true,
        };
        
        currentLevel.children.push(newNode);
        existingNode = newNode;
      } else if (isLastPart) {
        // If this is the leaf node (actual model), mark it as a model
        existingNode.isModel = true;
      }
      
      // Move to the next level in the hierarchy
      currentLevel = existingNode;
    }
  });
  
  return hierarchy;
}

/**
 * Returns a flat list of all models from a hierarchy
 */
export function flattenHierarchy(hierarchy) {
  const result = [];
  
  function traverse(node) {
    if (node.isModel) {
      result.push(node.fullPath);
    }
    
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => traverse(child));
    }
  }
  
  if (hierarchy && hierarchy.children) {
    hierarchy.children.forEach(child => traverse(child));
  }
  
  return result;
}

/**
 * Updates the expanded state of a node in the hierarchy
 */
export function toggleNodeExpanded(hierarchy, nodeId) {
  const newHierarchy = { ...hierarchy };
  
  function findAndToggle(node) {
    if (node.id === nodeId) {
      return {
        ...node,
        isExpanded: !node.isExpanded
      };
    }
    
    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: node.children.map(child => findAndToggle(child))
      };
    }
    
    return node;
  }
  
  return findAndToggle(newHierarchy);
}

/**
 * Helper to check if node is a parent of another node
 */
export function isParentOf(parentId, childId) {
  if (parentId === childId) return false;
  return childId.startsWith(parentId + '/');
}

/**
 * Processes a drag and drop operation to update the hierarchy
 */
export function processDragDrop(hierarchy, draggedId, targetId, position = 'into') {
  // Clone the hierarchy to avoid mutations
  const newHierarchy = JSON.parse(JSON.stringify(hierarchy));
  
  // Extract the dragged node
  let draggedNode = null;
  let draggedNodeParentChildren = null;
  
  const findDraggedNode = (node, parent = null) => {
    if (node.id === draggedId) {
      draggedNode = { ...node };
      if (parent) {
        draggedNodeParentChildren = parent.children;
      }
      return true;
    }
    
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        if (findDraggedNode(node.children[i], node)) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  findDraggedNode(newHierarchy);
  
  if (!draggedNode || !draggedNodeParentChildren) {
    return hierarchy; // Could not find node, return original
  }
  
  // Remove the dragged node from its original location
  const draggedIndex = draggedNodeParentChildren.findIndex(child => child.id === draggedId);
  if (draggedIndex !== -1) {
    draggedNodeParentChildren.splice(draggedIndex, 1);
  }
  
  // Find the target node
  let targetNode = null;
  
  const findTargetNode = (node) => {
    if (node.id === targetId) {
      targetNode = node;
      return true;
    }
    
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        if (findTargetNode(node.children[i])) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  findTargetNode(newHierarchy);
  
  if (!targetNode) {
    return hierarchy; // Could not find target, return original
  }
  
  // Update the dragged node's path
  const updateNodePaths = (node, newParentPath = '') => {
    const oldPath = node.fullPath;
    const oldPathBase = oldPath.split('/').pop();
    
    const newPath = newParentPath ? `${newParentPath}/${oldPathBase}` : oldPathBase;
    node.fullPath = newPath;
    node.id = newPath;
    
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => updateNodePaths(child, newPath));
    }
    
    return node;
  };
  
  // Process based on position
  if (position === 'into') {
    // Add as a child of target
    const updatedDraggedNode = updateNodePaths(draggedNode, targetNode.fullPath);
    targetNode.children.push(updatedDraggedNode);
    targetNode.isExpanded = true; // Expand the target to show the new child
  } else {
    // Find target's parent
    let targetParent = null;
    let targetParentChildren = null;
    
    const findTargetParent = (node) => {
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          if (node.children[i].id === targetId) {
            targetParent = node;
            targetParentChildren = node.children;
            return true;
          }
          if (findTargetParent(node.children[i])) {
            return true;
          }
        }
      }
      return false;
    };
    
    findTargetParent(newHierarchy);
    
    if (targetParent && targetParentChildren) {
      // Update path based on the target's parent
      const updatedDraggedNode = updateNodePaths(draggedNode, targetParent.fullPath);
      
      // Find the target index
      const targetIndex = targetParentChildren.findIndex(child => child.id === targetId);
      
      // Insert before or after based on position
      const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
      targetParentChildren.splice(insertIndex, 0, updatedDraggedNode);
    }
  }
  
  return newHierarchy;
} 