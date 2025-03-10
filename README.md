Next.js Progressive Web App (PWA)

A comprehensive Progressive Web App built with Next.js that demonstrates modern web capabilities and PWA features. This application showcases how web apps can provide native-like experiences with features such as file handling, geolocation, offline support, push notifications, and more.

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [PWA Features in Detail](#-pwa-features-in-detail)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

## ✨ Features

This PWA demonstrates the following advanced web capabilities:

### 1. File Handling

- Open files directly from the device's file system
- Edit file contents in the browser
- Save changes back to the original file
- Create new files and save them to the device
- Register as a file handler for specific file types

### 2. Geolocation Services

- Access device location (latitude, longitude)
- Display additional data like altitude, heading, and speed
- Real-time location tracking with watch functionality
- Accuracy information and error handling
- Integration with map services

### 3. Interactive Local Storage

- Visual interface to view all items in localStorage
- Add, edit, and delete functionality
- Size monitoring to track storage usage
- Data persistence across browser sessions
- Storage limit handling

### 4. Network Information

- Online/offline status detection with real-time updates
- Connection type identification (wifi, cellular, ethernet)
- Effective connection type monitoring (4g, 3g, 2g)
- Bandwidth and latency information
- Data-saving mode detection

### 5. Offline Functionality

- Service worker for caching essential assets
- Offline fallback page when content isn't cached
- Background sync for data submitted while offline
- Visual indicators for online/offline status
- Seamless transition between online and offline states

### 6. Protocol Handling

- Registration as a handler for custom URL protocols
- Processing of incoming protocol URLs
- Testing interface for protocol handling
- Integration with other applications via custom protocols
- Deep linking capabilities

### 7. Push Notifications

- Firebase Cloud Messaging integration
- Permission request and management
- Subscription to notification topics
- Test notification sending functionality
- Background notification handling via service worker

## 🚀 Demo

Visit the live demo at: [https://nextjs-pwa-example.vercel.app](https://nextjs-pwa-example.vercel.app)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.x or later
- npm 9.x or later
- A modern web browser (Chrome, Edge, Firefox, or Safari)
- Firebase account (for push notifications)

## 🔧 Installation

1. Clone the repository:

```shellscript
git clone https://github.com/yourusername/nextjs-pwa.git
cd nextjs-pwa
```

2. Install dependencies:

```shellscript
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:

```plaintext
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
NEXT_PUBLIC_VAPID_KEY=your_vapid_public_key
```

## ⚙️ Configuration

### Firebase Setup (for Push Notifications)

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Add a web app to your Firebase project
3. Enable Firebase Cloud Messaging
4. Generate VAPID keys for web push notifications
5. Update the `.env.local` file with your Firebase configuration

### Service Worker

The service worker is configured to:

- Cache essential assets for offline use
- Provide a network-first strategy with cache fallback
- Handle push notifications
- Implement background sync

You can customize the caching strategy in `public/sw.js`.

### Web App Manifest

The `public/manifest.json` file contains the PWA configuration including:

- App name and description
- Icons for different sizes
- Theme colors
- Display mode
- Shortcuts for quick access
- Protocol handlers
- File handlers

## 🚀 Usage

### Development Mode

Run the development server:

```shellscript
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Note: Some PWA features like service workers may not work properly in development mode.

### Production Mode

Build and start the production server:

```shellscript
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

## 🔍 PWA Features in Detail

### File Handling

The File System Access API allows the app to interact with files on the user's device:

```javascript
// Open a file
const [handle] = await window.showOpenFilePicker();
const file = await handle.getFile();
const content = await file.text();

// Save a file
const writable = await handle.createWritable();
await writable.write(content);
await writable.close();
```

File handling requires a secure context (HTTPS) and is currently best supported in Chromium-based browsers.

### Geolocation

The app uses the Geolocation API to access the user's location:

```javascript
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    // Use the coordinates
  },
  (error) => {
    // Handle errors
  },
);
```

For real-time tracking, the app uses `watchPosition`:

```javascript
const watchId = navigator.geolocation.watchPosition((position) => {
  // Update with new position
});

// Later, to stop watching:
navigator.geolocation.clearWatch(watchId);
```

### Local Storage

The app provides a visual interface for localStorage operations:

```javascript
// Add an item
localStorage.setItem("key", "value");

// Get an item
const value = localStorage.getItem("key");

// Remove an item
localStorage.removeItem("key");

// Clear all items
localStorage.clear();
```

The app also monitors storage usage and available space.

### Network Information

The Network Information API provides details about the user's connection:

```javascript
if (navigator.connection) {
  const { type, effectiveType, downlink, rtt, saveData } = navigator.connection;
  // Use connection information
}

// Listen for changes
navigator.connection.addEventListener("change", updateConnectionInfo);
```

Basic online/offline detection uses:

```javascript
window.addEventListener("online", handleOnline);
window.addEventListener("offline", handleOffline);
```

### Protocol Handling

The app registers as a handler for custom protocols:

```javascript
navigator.registerProtocolHandler(
  "web+pwa",
  `${window.location.origin}/features/protocol-handler?url=%s`,
  "Next.js PWA",
);
```

This allows other applications to launch the PWA with custom data.

### Push Notifications

The app uses Firebase Cloud Messaging for push notifications:

```javascript
// Request permission
const permission = await Notification.requestPermission();

// Get FCM token
const token = await getToken(messaging, {
  vapidKey: "YOUR_VAPID_KEY",
});

// Send to server for subscription
await fetch("/api/push-notifications", {
  method: "POST",
  body: JSON.stringify({ token }),
});
```

The service worker handles incoming push messages:

```javascript
self.addEventListener("push", (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, data.options);
});
```

## 📁 Project Structure

```plaintext
nextjs-pwa/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   ├── features/             # Feature-specific pages
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── offline/page.tsx      # Offline fallback page
├── components/               # React components
│   ├── ui/                   # UI components (shadcn/ui)
│   ├── FileHandler.tsx       # File handling component
│   ├── GeolocationDisplay.tsx # Geolocation component
│   └── ...                   # Other feature components
├── lib/                      # Utility functions
│   ├── firebase.ts           # Firebase configuration
│   └── pwa-utils.ts          # PWA utilities
├── public/                   # Static assets
│   ├── icon-192x192.png      # PWA icons
│   ├── icon-512x512.png      # PWA icons
│   ├── manifest.json         # Web App Manifest
│   └── sw.js                 # Service Worker
├── .env.local                # Environment variables (not in repo)
├── next.config.js            # Next.js configuration
├── package.json              # Dependencies and scripts
├── README.md                 # This file
└── tsconfig.json             # TypeScript configuration
```

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

### Other Hosting Providers

1. Build the application:

```shellscript
npm run build
```

2. Deploy the `.next` folder and `public` directory to your hosting provider
3. Ensure your server is configured to:

4. Serve over HTTPS
5. Set correct MIME types for service worker and manifest
6. Set appropriate cache headers

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please ensure your code follows the project's style and includes appropriate tests.

## ❓ Troubleshooting

### Common Issues

1. **Service worker not registering**

1. Ensure you're using HTTPS or localhost
1. Check for console errors
1. Verify the service worker path is correct

1. **Push notifications not working**

1. Verify Firebase configuration
1. Check that permission has been granted
1. Ensure the VAPID key is correct

1. **File handling not working**

1. File System Access API requires Chrome/Edge or other Chromium-based browsers
1. Must be served over HTTPS
1. User must interact with the page before using the API

1. **PWA not installable**

1. Verify manifest.json is correctly formatted
1. Ensure icons are available and properly sized
1. Check that the service worker is registered successfully

### Getting Help

If you encounter issues not covered here:

1. Check the [Issues](https://github.com/yourusername/nextjs-pwa/issues) section
2. Search for similar problems in the Next.js or PWA communities
3. Open a new issue with detailed information about your problem

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), and [shadcn/ui](https://ui.shadcn.com/).
