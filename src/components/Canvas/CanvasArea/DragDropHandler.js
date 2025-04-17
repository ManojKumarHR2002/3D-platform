import { createFileUploader } from "@utils/UploadUtilis";

/**
 * Sets up drag and drop handlers for the canvas container
 * @param {Object} sceneInstance - The THREE.js scene instance
 * @param {Function} loadModelIntoScene - Function to load model into scene
 * @param {Function} setUploadedModels - State setter for uploaded models
 * @param {Function} setError - State setter for error messages
 * @param {Function} setUploading - State setter for upload status
 * @param {Function} setUploadProgress - State setter for upload progress
 * @returns {Function} Cleanup function to remove event listeners
 */
export const setupDragDropHandlers = (
  sceneInstance,
  loadModelIntoScene,
  setUploadedModels,
  setError,
  setUploading,
  setUploadProgress
) => {
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!sceneInstance) return;

    const file = event.dataTransfer.files[0];
    if (!file) return;

    const canvasContainer = document.getElementById("canvasContainer");
    if (!canvasContainer.contains(event.target)) return;

    const localUrl = URL.createObjectURL(file);
    const modelName = file.name;
    
    // Add to uploaded models immediately with local URL
    loadModelIntoScene({ 
      name: modelName, 
      url: localUrl 
    });

    setUploadedModels((prev) => [...prev, modelName]);

    const uploadFile = createFileUploader(
      setError,
      setUploading,
      setUploadProgress,
      (uploadedModel) => {
        console.log("Uploaded Model URL:", uploadedModel.url);
        loadModelIntoScene(uploadedModel);

        setUploadedModels((prev) =>
          prev.map((name) => (name === modelName ? uploadedModel.name : name))
        );
      }
    );

    await uploadFile(file);
  };

  const preventDefault = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  document.addEventListener("dragover", preventDefault);
  document.addEventListener("drop", preventDefault);

  const canvasContainer = document.getElementById("canvasContainer");
  if (canvasContainer) {
    canvasContainer.addEventListener("dragover", handleDragOver);
    canvasContainer.addEventListener("drop", handleDrop);
  }

  // Return cleanup function
  return () => {
    document.removeEventListener("dragover", preventDefault);
    document.removeEventListener("drop", preventDefault);

    if (canvasContainer) {
      canvasContainer.removeEventListener("dragover", handleDragOver);
      canvasContainer.removeEventListener("drop", handleDrop);
    }
  };
}; 
