import {
  Home,
  MapPin,
  Database,
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
  MicOff,
  HardDrive,
  Network,
  FileUp,
  FileDown,
  RefreshCw,
  Shield,
  Share2,
  Radio,
  Clock,
  CheckCircle2,
  Copy,
  Zap,
  FileCheck,
  Download,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  category?: string;
}

// Navigation items organized by category
export const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: <Home className="h-4 w-4" />,
  },
  // Device & Media
  {
    title: "Web Bluetooth",
    href: "/features/web-bluetooth",
    icon: <Bluetooth className="size-4" />,
    category: "Device & Media",
  },
  {
    title: "Screen Wake Lock",
    href: "/features/screen-wake-lock",
    icon: <Power className="size-4" />,
    category: "Device & Media",
  },
  {
    title: "Device Orientation",
    href: "/features/device-orientation",
    icon: <Smartphone className="size-4" />,
    category: "Device & Media",
  },
  {
    title: "Device Motion",
    href: "/features/device-motion",
    icon: <Activity className="size-4" />,
    category: "Device & Media",
  },
  {
    title: "Vibration",
    href: "/features/vibration",
    icon: <Vibrate className="size-4" />,
    category: "Device & Media",
  },
  {
    title: "Geolocation",
    href: "/features/geolocation",
    icon: <MapPin className="size-4" />,
    category: "Device & Media",
  },
  {
    title: "Media Capture",
    href: "/features/media-capture",
    icon: <Camera className="h-4 w-4" />,
    category: "Device & Media",
  },
  {
    title: "Audio Player",
    href: "/features/audio",
    icon: <AudioLines className="size-4" />,
    category: "Device & Media",
  },
  {
    title: "Speech Synthesis",
    href: "/features/speech-synthesis",
    icon: <Mic className="h-4 w-4" />,
    category: "Device & Media",
  },
  {
    title: "Speech Recognition",
    href: "/features/speech-recognition",
    icon: <MicOff className="h-4 w-4" />,
    category: "Device & Media",
  },
  {
    title: "Touch Events",
    href: "/features/touch-events",
    icon: <Smartphone className="h-4 w-4" />,
    category: "Device & Media",
  },
  // Storage & Network
  {
    title: "Local Storage",
    href: "/features/local-storage",
    icon: <HardDrive className="h-4 w-4" />,
    category: "Storage & Network",
  },
  {
    title: "Storage",
    href: "/features/storage",
    icon: <Database className="h-4 w-4" />,
    category: "Storage & Network",
  },
  {
    title: "File Handling",
    href: "/features/file-handling",
    icon: <FileUp className="h-4 w-4" />,
    category: "Storage & Network",
  },
  {
    title: "Network Info",
    href: "/features/network-info",
    icon: <Network className="h-4 w-4" />,
    category: "Storage & Network",
  },
  {
    title: "Protocol Handler",
    href: "/features/protocol-handler",
    icon: <LinkIcon className="h-4 w-4" />,
    category: "Storage & Network",
  },
  {
    title: "Background Fetch",
    href: "/features/background-fetch",
    icon: <FileDown className="h-4 w-4" />,
    category: "Storage & Network",
  },
  {
    title: "Background Sync",
    href: "/features/background-sync",
    icon: <RefreshCw className="h-4 w-4" />,
    category: "Storage & Network",
  },
  {
    title: "Broadcast Updates",
    href: "/features/broadcast",
    icon: <Radio className="h-4 w-4" />,
    category: "Storage & Network",
  },
  {
    title: "Cache Expiration",
    href: "/features/cache-expiration",
    icon: <Clock className="h-4 w-4" />,
    category: "Storage & Network",
  },
  {
    title: "Cacheable Response",
    href: "/features/cacheable-response",
    icon: <CheckCircle2 className="h-4 w-4" />,
    category: "Storage & Network",
  },
  {
    title: "Cache On Demand",
    href: "/features/cache-on-demand",
    icon: <Download className="h-4 w-4" />,
    category: "Storage & Network",
  },
  {
    title: "Copy Response",
    href: "/features/copy-response",
    icon: <Copy className="h-4 w-4" />,
    category: "Storage & Network",
  },
  {
    title: "Navigation Preload",
    href: "/features/navigation-preload",
    icon: <Zap className="h-4 w-4" />,
    category: "Storage & Network",
  },
  {
    title: "Same Response",
    href: "/features/same-response",
    icon: <FileCheck className="h-4 w-4" />,
    category: "Storage & Network",
  },
  // UI & Security
  {
    title: "View Transitions",
    href: "/features/transitions",
    icon: <ArrowRightLeft className="h-4 w-4" />,
    category: "UI & Security",
  },
  {
    title: "Web Auth",
    href: "/features/web-authentication",
    icon: <Shield className="h-4 w-4" />,
    category: "UI & Security",
  },
  {
    title: "Web Share API",
    href: "/features/web-share",
    icon: <Share2 className="h-4 w-4" />,
    category: "UI & Security",
  },
];
