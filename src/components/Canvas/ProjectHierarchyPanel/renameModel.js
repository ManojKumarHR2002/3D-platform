import { supabase } from "@src/supabase/Supabase";

export async function renameModel(index, newName, uploadedModels, setEditingIndex, onHierarchyChange, canvasAreaRef) {
  if (!newName.trim()) return;

  const oldName = uploadedModels[index];
  
  // Check if this is a hierarchical path
  const oldNameParts = oldName.split('/');
  const newNameParts = newName.split('/');
  
  // Update in Supabase
  try {
    const { error } = await supabase
      .from("models")
      .update({ name: newName })
      .eq("name", oldName);

    if (error) {
      console.error("Error updating name:", error);
      return;
    }

    // Update locally
    uploadedModels[index] = newName;
    if (onHierarchyChange) {
      onHierarchyChange([...uploadedModels]);
    }

    // Update the model name in CanvasArea's loadedModels
    if (canvasAreaRef?.current?.handleModelRename) {
      canvasAreaRef.current.handleModelRename(oldName, newName);
    }

    // If this was the selected model, update the selection
    if (canvasAreaRef?.current?.updateSelectedModel) {
      canvasAreaRef.current.updateSelectedModel(oldName, newName);
    }

  } catch (error) {
    console.error("Error in rename operation:", error);
  } finally {
    if (setEditingIndex) {
      setEditingIndex(null);
    }
  }
}
