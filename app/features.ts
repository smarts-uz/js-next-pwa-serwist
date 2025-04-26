import {
  MapPin,
  LinkIcon,
  ArrowRightLeft,
  Camera,
  Vibrate,
  AudioLines,
  Bluetooth,
  Power,
  Smartphone,
  Activity,
  Mic,
  RefreshCw,
  Radio,
  Clock,
  CheckCircle2,
  Copy,
  Zap,
  FileCheck,
  Download,
  FileText,
  Package,
  CloudCog,
  Lock,
  Share,
  Hand,
  Volume2,
  Wifi,
  Bell,
  Shield,
  Server,
} from "lucide-react";

// Web API feature categories and items
export const featureCategories = [
  {
    title: "Device Features",
    features: [
      {
        title: "Web Bluetooth",
        description:
          "Connect and interact with Bluetooth devices directly from your browser",
        icon: Bluetooth,
        href: "/features/web-bluetooth",
      },
      {
        title: "Screen Wake Lock",
        description: "Keep your screen awake and monitor power usage",
        icon: Power,
        href: "/features/screen-wake-lock",
      },
      {
        title: "Device Orientation",
        description: "Detect device orientation changes and positioning",
        icon: Smartphone,
        href: "/features/device-orientation",
      },
      {
        title: "Device Motion",
        description: "Track acceleration and rotation rate of the device",
        icon: Activity,
        href: "/features/device-motion",
      },
      {
        title: "Vibration",
        description: "Provide haptic feedback",
        icon: Vibrate,
        href: "/features/vibration",
      },
      {
        title: "Geolocation",
        description: "Access and use device location information",
        icon: MapPin,
        href: "/features/geolocation",
      },
      {
        title: "Media Capture",
        description: "Access device camera and media features",
        icon: Camera,
        href: "/features/media-capture",
      },
      {
        title: "Touch Events",
        description: "Multi-touch gestures and interactions",
        icon: Hand,
        href: "/features/touch-events",
      },
      {
        title: "Speech Recognition",
        description: "Convert speech to text in real-time",
        icon: Mic,
        href: "/features/speech-recognition",
      },
      {
        title: "Speech Synthesis",
        description: "Text-to-speech capabilities",
        icon: Volume2,
        href: "/features/speech-synthesis",
      },
    ],
  },
  {
    title: "Storage & Data",
    features: [
      {
        title: "Storage",
        description: "Advanced storage solutions",
        icon: Package,
        href: "/features/storage",
      },
      {
        title: "File Handling",
        description: "Open and save files directly from the web app",
        icon: FileText,
        href: "/features/file-handling",
      },
    ],
  },
  {
    title: "Network & Sync",
    features: [
      {
        title: "Network Info",
        description: "Monitor network connection status and type",
        icon: Wifi,
        href: "/features/network-info",
      },
      {
        title: "Protocol Handler",
        description: "Register as a handler for custom protocols",
        icon: LinkIcon,
        href: "/features/protocol-handler",
      },
      {
        title: "Background Fetch",
        description: "Download resources in the background",
        icon: CloudCog,
        href: "/features/background-fetch",
      },
      {
        title: "Background Sync",
        description: "Defer actions until user has stable connectivity",
        icon: RefreshCw,
        href: "/features/background-sync",
      },
      {
        title: "Broadcast Updates",
        description: "Communicate between tabs or service workers",
        icon: Radio,
        href: "/features/broadcast",
      },
      {
        title: "Cache Expiration",
        description: "Set expiration dates for cached content",
        icon: Clock,
        href: "/features/cache-expiration",
      },
      {
        title: "Cacheable Response",
        description: "Define which responses should be cached",
        icon: CheckCircle2,
        href: "/features/cacheable-response",
      },
      {
        title: "Cache On Demand",
        description: "Cache resources on user request for offline use",
        icon: Download,
        href: "/features/cache-on-demand",
      },
      {
        title: "Copy Response",
        description: "Create copies of request responses for future use",
        icon: Copy,
        href: "/features/copy-response",
      },
      {
        title: "Navigation Preload",
        description:
          "Speed up service worker activation with preloaded content",
        icon: Zap,
        href: "/features/navigation-preload",
      },
      {
        title: "Same Response",
        description: "Return the same response for multiple requests",
        icon: FileCheck,
        href: "/features/same-response",
      },
    ],
  },
  {
    title: "Media & UI",
    features: [
      {
        title: "Audio Player",
        description: "Play and control audio content",
        icon: AudioLines,
        href: "/features/audio",
      },
      {
        title: "View Transitions",
        description: "Smooth page transitions and animations",
        icon: ArrowRightLeft,
        href: "/features/transitions",
      },
    ],
  },
  {
    title: "Security",
    features: [
      {
        title: "Web Auth",
        description: "Secure authentication with biometrics",
        icon: Lock,
        href: "/features/web-authentication",
      },
      {
        title: "Web Share API",
        description: "Share content with other apps",
        icon: Share,
        href: "/features/web-share",
      },
    ],
  },
];

export const benefits = [
  {
    title: "App-like Experience",
    description:
      "PWAs provide a full-screen experience, can be installed on the home screen, and work offline like native apps.",
    icon: Smartphone,
  },
  {
    title: "Network Independence",
    description:
      "PWAs work offline or on low-quality networks, ensuring a consistent user experience.",
    icon: Wifi,
  },
  {
    title: "Engagement",
    description:
      "Push notifications help re-engage users with timely, relevant content.",
    icon: Bell,
  },
  {
    title: "Performance",
    description:
      "Fast loading times and smooth interactions with service workers and caching.",
    icon: Zap,
  },
  {
    title: "Security",
    description:
      "HTTPS by default and secure data handling with modern web standards.",
    icon: Shield,
  },
  {
    title: "Cross-Platform",
    description: "One codebase that works across all devices and platforms.",
    icon: Server,
  },
];
