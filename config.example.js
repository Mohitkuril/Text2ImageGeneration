// Configuration file for API tokens
// Copy this file to 'config.js' and add your actual tokens

const CONFIG = {
  // Get your Hugging Face token from: https://huggingface.co/settings/tokens
  HUGGING_FACE_TOKEN: "YOUR_HUGGING_FACE_TOKEN_HERE",
  
  // Optional: Add other API configurations here
  // OPENAI_API_KEY: "YOUR_OPENAI_KEY_HERE",
  // STABILITY_API_KEY: "YOUR_STABILITY_KEY_HERE"
};

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else {
  window.CONFIG = CONFIG;
}