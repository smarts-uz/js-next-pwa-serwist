# Next.js Progressive Web App (PWA)

A comprehensive Progressive Web App built with Next.js and Serwist that demonstrates modern web capabilities and PWA features. This application showcases how web apps can provide native-like experiences with features such as file handling, geolocation, offline support, and more.

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [License](#-license)

## ✨ Features

This PWA demonstrates the following advanced web capabilities:

### Device Features

- **Web Bluetooth**: Connect and interact with Bluetooth devices directly from your browser
- **Screen Wake Lock**: Keep your screen awake and monitor power usage
- **Media Capture**: Access device camera and media features
- **Geolocation**: Access and use device location information
- **Vibration**: Provide haptic feedback
- **Touch Events**: Multi-touch gestures and interactions
- **Speech Recognition**: Convert speech to text in real-time
- **Speech Synthesis**: Text-to-speech capabilities

### Storage & Data

- **Local Storage**: Interactive data persistence in the browser
- **Storage**: Advanced storage solutions
- **File Handling**: Open and save files directly from the web app
  - Support for `.txt` and `.md` files
  - Edit file contents in the browser
  - Save changes back to the original file
  - Create new files and save them to the device

### Network & Sync

- **Network Info**: Monitor network connection status and type
  - Online/offline status detection
  - Connection type identification (wifi, cellular, ethernet)
  - Effective connection type monitoring (4g, 3g, 2g)
  - Bandwidth and latency information
- **Protocol Handler**: Register as a handler for custom protocols (`web+pwa://`)
- **Background Fetch**: Download resources in the background

### Media & UI

- **Audio Player**: Play and control audio content
- **View Transitions**: Smooth page transitions and animations

### Security & Payment

- **Web Auth**: Secure authentication with biometrics
- **Payment Request**: Process payments using various payment methods
- **Web Share API**: Share content with other apps
  - Native sharing experience
  - Share text, URLs, and files
  - Cross-platform compatibility
  - Fallback support for unsupported browsers

### PWA Benefits

- **App-like Experience**: Full-screen experience, home screen installation, and offline functionality
- **Network Independence**: Works offline or on low-quality networks
- **Engagement**: Push notifications for user re-engagement
- **Performance**: Fast loading times and smooth interactions
- **Security**: HTTPS by default and secure data handling
- **Cross-Platform**: One codebase for all devices and platforms

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.x or later
- npm 9.x or later
- A modern web browser (Chrome, Edge, Firefox, or Safari)

## 🔧 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/nextjs-pwa.git
cd nextjs-pwa
```

2. Install dependencies:

```bash
npm install
```

## 🚀 Usage

### Development Mode

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Production Mode

Build and start the production server:

```bash
npm run build
npm start
```

For the best PWA experience, use production mode.

### Testing PWA Features

To fully test PWA features:

1. Build and run the production version
2. Access the application over HTTPS (required for many PWA features)
3. Install the PWA when prompted
4. Test features in both online and offline modes

## 📁 Project Structure

```plaintext
nextjs-pwa/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   ├── features/             # Feature-specific pages
│   │   ├── web-share/       # Web Share API demo
│   │   ├── file-handling/   # File handling demo
│   │   └── ...             # Other feature demos
│   ├── layout.tsx           # Root layout with theme provider
│   ├── page.tsx             # Home page with feature showcase
│   ├── sw.ts                # Service Worker (Serwist)
│   └── manifest.ts          # Web App Manifest
├── components/              # React components
│   ├── ui/                  # UI components (shadcn/ui)
│   ├── WebShareExample.tsx  # Web Share demo component
│   ├── FileHandler.tsx      # File handling component
│   └── ...                  # Other feature components
├── lib/                     # Utility functions
├── public/                  # Static assets
│   ├── icon-192x192.png     # PWA icons
│   └── icon-512x512.png     # PWA icons
├── next.config.js           # Next.js configuration
├── package.json             # Dependencies and scripts
├── README.md                # This file
└── tsconfig.json            # TypeScript configuration
```

## 🔧 Technical Details

### Service Worker

- Built with Serwist for optimal caching and offline support
- Implements navigation preload for faster page loads
- Handles offline fallbacks for document requests
- Supports runtime caching for dynamic content

### Web App Manifest

- Configurable app name and description
- Custom icons for different screen sizes
- App shortcuts for quick access to features
- Protocol handler registration for custom URLs
- File handler registration for text files

### Theme Support

- Dark mode by default
- System theme detection
- Smooth theme transitions
- Persistent theme preferences

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), [Serwist](https://serwist.pages.dev/), and [shadcn/ui](https://ui.shadcn.com/).
