export function handleDragStart(e, index, uploadedModels, setDraggedObject) {
    setDraggedObject({ index, name: uploadedModels[index] });
    e.dataTransfer.setData("text/plain", index.toString());
  }
  
  export function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  }
  
  export function handleDragLeave(e) {
    e.currentTarget.classList.remove("drag-over");
  }
  
  export function handleDrop(e, targetIndex, draggedObject, uploadedModels, onHierarchyChange) {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
  
    if (draggedObject && draggedObject.index !== targetIndex) {
      const newModels = [...uploadedModels];
      const [draggedItem] = newModels.splice(draggedObject.index, 1);
      newModels.splice(targetIndex, 0, draggedItem);
  
      if (onHierarchyChange) {
        onHierarchyChange(newModels);
      }
    }
  }
  