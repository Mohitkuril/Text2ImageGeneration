const token = "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";
const inputTxt = document.getElementById("input-field");
const image = document.getElementById("image-el");
const button = document.getElementById("button");
const loadingOverlay = document.getElementById("loading-overlay");

// Function to call the Hugging Face API
async function query(prompt) {
  try {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/ZB-Tech/Text-to-Image",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.blob();
    return result;
  } catch (error) {
    console.error("An error occurred:", error);
    alert("Failed to generate the image. Please try again.");
    hideLoading();
  }
}

// Show the loading overlay
function showLoading() {
  loadingOverlay.style.display = "flex";
}

// Hide the loading overlay
function hideLoading() {
  loadingOverlay.style.display = "none";
}

// Handle button click to generate image
button.addEventListener("click", async function () {
  const prompt = inputTxt.value.trim();
  if (!prompt) {
    alert("Please enter some text to generate an image.");
    return;
  }

  showLoading();

  const response = await query(prompt);
  if (response) {
    const objectURL = URL.createObjectURL(response);
    image.src = objectURL;

    image.onload = () => {
      hideLoading();
      image.classList.add("opacity-100");
    };
  }
});

const downloadButton = document.getElementById("download-button");
let currentImageURL;

// Function to trigger the download of the generated image
function downloadImage() {
  if (currentImageURL) {
    const link = document.createElement("a");
    link.href = currentImageURL;
    link.download = "generated-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert("No image available to download!");
  }
}
button.addEventListener("click", async function () {
  const prompt = inputTxt.value.trim();
  if (!prompt) {
    alert("Please enter some text to generate an image.");
    return;
  }

  showLoading();

  const response = await query(prompt);
  if (response) {
    // Revoke the previous URL to avoid memory leaks
    if (currentImageURL) URL.revokeObjectURL(currentImageURL);

    // Set new URL and update image
    currentImageURL = URL.createObjectURL(response);
    image.src = currentImageURL;

    // Enable download button and set up download link
    downloadButton.style.display = "block"; // Make the button visible

    image.onload = () => {
      hideLoading();
      image.classList.add("opacity-100");
    };
  }
});

// Set up download button click event
downloadButton.addEventListener("click", downloadImage);