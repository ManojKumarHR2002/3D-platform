import { v4 as uuidv4 } from "uuid";
import { supabase } from "@src/supabase/Supabase";
import { uploadModelToDB } from "@src/utils/uploadModelToDB";


/**
 * Handles file uploads to Supabase.
 * 
 * @param {Function} setError - Function to set upload errors.
 * @param {Function} setUploading - Function to toggle uploading state.
 * @param {Function} setUploadProgress - Function to update upload progress.
 * @param {Function} setLatestModel - Function to update latest uploaded model.
 * @returns {Function} - Function to handle file selection or drag-and-drop uploads.
 */
export const createFileUploader = (setError, setUploading, setUploadProgress, setLatestModel) => {
  return async (file = null) => {
    if (!file) {
      // Open file picker only if no file is provided (for button uploads)
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".gltf,.fbx,.glb";
      input.onchange = async (e) => handleUpload(e.target.files?.[0]);
      input.click();
    } else {
      // If file is provided (drag-and-drop), upload it directly
      await handleUpload(file);
    }
  };

  async function handleUpload(file) {
    if (!file) return;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!["gltf", "fbx", "glb"].includes(fileExtension)) {
      setError("Please select a GLTF, GLB, or FBX file.");
      return;
    }

    try {
      setError(null);
      setUploading(true);
      setUploadProgress(0);

      const fileName = `${uuidv4()}.${fileExtension}`;
      const bucketName = import.meta.env.VITE_SUPABASE_BUCKET_NAME;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage.from(bucketName).upload(fileName, file, {
        cacheControl: "3600",
        upsert: false, // Prevent overwriting existing files
      });

      if (error) throw error;

       // Generate a signed URL for the uploaded file
       const { data: signedUrlData, error: signedUrlError } = await supabase.storage
       .from(bucketName)
       .createSignedUrl(fileName, 3600); // URL valid for 3600 seconds (1 hour)

     if (signedUrlError) throw signedUrlError;

     // Update the latest model with the signed URL
     setLatestModel({ name: file.name, url: signedUrlData.signedUrl });
    
     // Save model details to Supabase database
    await uploadModelToDB(file.name, signedUrlData.signedUrl);

   } catch (error) {
     setError(error.message); // Handle errors
   } finally {
     setUploading(false); // Stop uploading state
     setUploadProgress(0);
  }
}
};
