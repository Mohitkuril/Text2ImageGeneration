// Configuration - Load token from config file or use placeholder
let token = null;

// Try to load token from config file
if (typeof CONFIG !== 'undefined' && CONFIG.HUGGING_FACE_TOKEN && CONFIG.HUGGING_FACE_TOKEN !== "YOUR_HUGGING_FACE_TOKEN_HERE") {
  token = CONFIG.HUGGING_FACE_TOKEN;
}
const inputTxt = document.getElementById("input-field");
const image = document.getElementById("image-el");
const button = document.getElementById("button");
const downloadButton = document.getElementById("download-button");
const loadingOverlay = document.getElementById("loading-overlay");
const errorMessage = document.getElementById("error-message");
const errorText = document.getElementById("error-text");
const successMessage = document.getElementById("success-message");
const successText = document.getElementById("success-text");

let currentImageURL;

// Function to show error message
function showError(message) {
  errorText.textContent = message;
  errorMessage.classList.add("show");
  setTimeout(() => {
    errorMessage.classList.remove("show");
  }, 5000);
}

// Function to show success message
function showSuccess(message) {
  successText.textContent = message;
  successMessage.classList.add("show");
  setTimeout(() => {
    successMessage.classList.remove("show");
  }, 3000);
}

// Function to hide all messages
function hideMessages() {
  errorMessage.classList.remove("show");
  successMessage.classList.remove("show");
}

// Alternative API function using a different service
async function queryAlternativeAPI(prompt) {
  try {
    // Using Pollinations AI API which is CORS-friendly
    const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&model=flux&enhance=true`, {
      method: 'GET',
    });

    if (response.ok) {
      const result = await response.blob();
      if (result.size > 0) {
        console.log('Success with Pollinations API');
        return result;
      }
    }
    throw new Error('Pollinations API failed');
  } catch (error) {
    console.error('Pollinations API error:', error);
    throw error;
  }
}

// Function to call the Hugging Face API with CORS workaround
async function query(prompt) {
  // First try the alternative API that doesn't have CORS issues
  try {
    console.log('Trying Pollinations API (CORS-friendly)...');
    const result = await queryAlternativeAPI(prompt);
    return result;
  } catch (error) {
    console.log('Pollinations API failed, trying Hugging Face...');
  }

  // List of Hugging Face models to try (only if token is provided)
  const models = [
    "runwayml/stable-diffusion-v1-5",
    "CompVis/stable-diffusion-v1-4"
  ];

  // Only try Hugging Face if a valid token is provided
  if (token && token.startsWith('hf_')) {
    for (let i = 0; i < models.length; i++) {
      try {
        console.log(`Trying Hugging Face model: ${models[i]}`);
        
        const response = await fetch(`https://api-inference.huggingface.co/models/${models[i]}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ 
            inputs: prompt,
            parameters: {
              num_inference_steps: 20,
              guidance_scale: 7.5,
              width: 512,
              height: 512
            }
          }),
        });

        if (response.ok) {
          const result = await response.blob();
          if (result.size > 0 && result.type.startsWith('image/')) {
            console.log(`Success with Hugging Face model: ${models[i]}`);
            return result;
          }
        } else if (response.status === 503) {
          console.log(`Model ${models[i]} is loading, trying next...`);
          continue;
        } else {
          const errorData = await response.text();
          console.log(`Error with model ${models[i]}:`, response.status, errorData);
        }
      } catch (error) {
        console.error(`Network error with model ${models[i]}:`, error);
      }
    }
  } else {
    console.log('No valid Hugging Face token provided, skipping HF models');
  }

  // If all APIs fail, provide helpful error message
  throw new Error("Unable to generate image. This might be due to:\n• CORS restrictions when running from file:// protocol\n• API rate limits or temporary unavailability\n\nTo fix CORS issues:\n1. Run a local server (python -m http.server 8000)\n2. Or use Live Server extension in VS Code\n3. Then access via http://localhost:8000");
}

// Show the loading overlay
function showLoading() {
  loadingOverlay.style.display = "flex";
  button.disabled = true;
  button.textContent = "Generating...";
}

// Hide the loading overlay
function hideLoading() {
  loadingOverlay.style.display = "none";
  button.disabled = false;
  button.textContent = "Generate";
}

// Validate input
function validateInput(prompt) {
  if (!prompt) {
    showError("Please enter a description to generate an image.");
    return false;
  }
  
  if (prompt.length < 3) {
    showError("Please enter a more detailed description (at least 3 characters).");
    return false;
  }
  
  if (prompt.length > 500) {
    showError("Description is too long. Please keep it under 500 characters.");
    return false;
  }
  
  return true;
}

// Handle button click to generate image
button.addEventListener("click", async function () {
  const prompt = inputTxt.value.trim();
  
  // Hide any previous messages
  hideMessages();
  
  // Validate input
  if (!validateInput(prompt)) {
    return;
  }

  showLoading();

  try {
    const response = await query(prompt);
    
    if (response) {
      // Revoke the previous URL to avoid memory leaks
      if (currentImageURL) {
        URL.revokeObjectURL(currentImageURL);
      }

      // Set new URL and update image
      currentImageURL = URL.createObjectURL(response);
      image.src = currentImageURL;

      // Show download button
      downloadButton.style.display = "block";

      image.onload = () => {
        hideLoading();
        image.classList.add("opacity-100");
        showSuccess("Image generated successfully!");
      };

      image.onerror = () => {
        hideLoading();
        showError("Failed to load the generated image. Please try again.");
      };
    }
  } catch (error) {
    hideLoading();
    console.error("Generation error:", error);
    showError(error.message || "Failed to generate image. Please try again.");
  }
});

// Function to trigger the download of the generated image
function downloadImage() {
  if (currentImageURL) {
    const link = document.createElement("a");
    link.href = currentImageURL;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess("Image downloaded successfully!");
  } else {
    showError("No image available to download. Please generate an image first.");
  }
}

// Set up download button click event
downloadButton.addEventListener("click", downloadImage);

// Allow Enter key to trigger generation
inputTxt.addEventListener("keypress", function(event) {
  if (event.key === "Enter" && !button.disabled) {
    button.click();
  }
});

// Clear messages when user starts typing
inputTxt.addEventListener("input", function() {
  hideMessages();
});