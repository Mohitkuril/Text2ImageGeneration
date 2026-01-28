# Text-to-Image Generator

A responsive AI-powered text-to-image generator that works across all screen sizes with proper error handling.

## Features

✅ **Responsive Design** - Works on mobile, tablet, and desktop  
✅ **Proper Error Handling** - No more alert boxes, clean UI messages  
✅ **Multiple AI Models** - Fallback system for reliability  
✅ **Download Support** - Save generated images  
✅ **CORS-Friendly** - Uses alternative APIs to avoid browser restrictions  
✅ **Secure Token Management** - No hardcoded API keys

## Quick Start

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd Text2ImageGeneration
```

### 2. Configure API Token (Optional)
```bash
# Copy the example config
cp config.example.js config.js

# Edit config.js and add your Hugging Face token
# Get token from: https://huggingface.co/settings/tokens
```

### 3. Run the Application

#### Option A: Python Server (Recommended)
```bash
python server.py
```
Then open http://localhost:8000

#### Option B: Use Live Server (VS Code)
1. Install "Live Server" extension in VS Code
2. Right-click on `Index.html`
3. Select "Open with Live Server"

#### Option C: Use Node.js Server
```bash
npx http-server . -p 8000 --cors
```

## API Configuration

The app works with multiple AI services:

1. **Pollinations AI** (primary) - No API key needed, works out of the box
2. **Hugging Face** (optional) - Requires free API token for additional models

### Getting Hugging Face Token:
1. Go to [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Create a new token with "Read" permissions
3. Copy the token to `config.js`

## Security Features

- ✅ **No hardcoded tokens** - Uses configuration files
- ✅ **Gitignore protection** - API keys never committed to git
- ✅ **Fallback system** - Works without any API keys
- ✅ **GitHub push protection** - Prevents accidental token exposure

## Why Use a Server?

Running directly from file system (`file://`) causes CORS errors with most APIs. The app includes:
- **Pollinations AI API** - CORS-friendly alternative
- **Hugging Face API** - Fallback with multiple models
- **Automatic fallback** - Tries multiple services for reliability

## Browser Support

- ✅ Chrome/Edge 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Mobile browsers

## Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 481px - 768px  
- **Desktop**: 769px - 1200px
- **Large Desktop**: 1200px+
- **Ultra-wide**: 1600px+

## Troubleshooting

**CORS Errors**: Use one of the server options above  
**No Images Generated**: Check browser console for API errors  
**Mobile Issues**: Ensure you're using HTTPS or localhost  
**GitHub Push Blocked**: Make sure no API tokens are in your code

## File Structure

```
├── Index.html          # Main HTML file
├── script.js           # JavaScript logic
├── style.css           # Responsive styles
├── server.py           # Python development server
├── config.example.js   # Example configuration
├── .gitignore          # Git ignore file
├── bg.jpg              # Background image
├── brainicon.ico       # Favicon
└── README.md           # This file
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Make sure no API tokens are in your code
4. Commit your changes
5. Push to the branch
6. Create a Pull Request