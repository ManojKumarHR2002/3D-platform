import { v4 as uuidv4 } from 'uuid';

/**
 * @param {Function} setError - State setter to update any error messages.
 * @param {Function} setUploading - State setter to toggle the uploading state.
 * @param {Function} setUploadProgress - State setter to update the upload progress percentage.
 * @param {Function} setLatestModel - State setter to set the latest uploaded model with its name and URL.
 * @returns {Function} - The function that opens the file input and handles file upload.
 */
export const createFileUploader = (
  setError,
  setUploading,
  setUploadProgress,
  setLatestModel
) => {
  return async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.gltf,.fbx,.glb'; // Accept only GLTF, GLB, or FBX files

    console.log("Creating file input...");


    input.onchange = async (e) => {
      
      const file = e.target.files?.[0];
      if (!file) return;
      const fileExtension = file.name.split('.').pop()?.toLowerCase(); // Get the file extension
      if (!['gltf', 'fbx', 'glb'].includes(fileExtension)) {
        setError('Please select a GLTF, GLB, or FBX file'); // Error if the file type is invalid
        return;
      }

      try {
        setError(null); // Reset any previous errors
        setUploading(true); // Start uploading
        // Simulate upload progress for local file (instant)
        setUploadProgress(100);
        // Generate a local URL for the file
        const localUrl = URL.createObjectURL(file);
        setLatestModel({ name: file.name, url: localUrl });
      } catch (error) {
        setError(error.message); // Handle errors
      } finally {
        setUploading(false); // Stop uploading state
        setUploadProgress(0);
      }
    };

    input.click(); // Trigger the file input click event to open the file picker
    console.log("File input clicked!");

  };
};
