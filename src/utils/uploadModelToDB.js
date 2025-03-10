import { supabase } from "@src/supabase/Supabase";

/**
 * Uploads model metadata to Supabase database.
 * 
 * @param {string} name - Model name.
 * @param {string} url - Public URL of the uploaded model.
 * @returns {Promise<void>}
 */
export const uploadModelToDB = async (name, url) => {
  try {
    const { error } = await supabase.from("models").insert([
      { name, url, uploaded_at: new Date().toISOString() },
    ]);

    if (error) {
      console.error("Error inserting model into DB:", error);
      throw new Error("Failed to save model data.");
    }
  } catch (error) {
    console.error("Database upload error:", error);
  }
};
