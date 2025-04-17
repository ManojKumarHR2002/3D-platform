/**
 * Sets up click handler for the canvas
 * @param {Function} highlightModel - Function to handle model highlighting
 * @returns {Function} Cleanup function to remove event listener
 */
export const setupCanvasClickHandler = (highlightModel) => {
  const canvas = document.getElementById("myThreeJsCanvas");
  
  const handleCanvasClick = (event) => {
    if (event.target === canvas) {
      highlightModel(null);
    }
  };
  
  if (canvas) {
    canvas.addEventListener('click', handleCanvasClick);
  }
  
  // Return cleanup function
  return () => {
    if (canvas) {
      canvas.removeEventListener('click', handleCanvasClick);
    }
  };
}; 
