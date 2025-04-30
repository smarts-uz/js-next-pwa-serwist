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
  RefreshCcw,
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
  Database,
  InfoIcon,
  Tag,
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
  // Device Features
  {
    title: "Web Bluetooth",
    href: "/features/web-bluetooth",
    icon: <Bluetooth className="size-4" />,
    category: "Device Features",
  },
  {
    title: "Screen Wake Lock",
    href: "/features/screen-wake-lock",
    icon: <Power className="size-4" />,
    category: "Device Features",
  },
  {
    title: "Device Orientation",
    href: "/features/device-orientation",
    icon: <Smartphone className="size-4" />,
    category: "Device Features",
  },
  {
    title: "Device Motion",
    href: "/features/device-motion",
    icon: <Activity className="size-4" />,
    category: "Device Features",
  },
  {
    title: "Vibration",
    href: "/features/vibration",
    icon: <Vibrate className="size-4" />,
    category: "Device Features",
  },
  {
    title: "Geolocation",
    href: "/features/geolocation",
    icon: <MapPin className="size-4" />,
    category: "Device Features",
  },
  {
    title: "Media Capture",
    href: "/features/media-capture",
    icon: <Camera className="h-4 w-4" />,
    category: "Device Features",
  },
  {
    title: "Touch Events",
    href: "/features/touch-events",
    icon: <Hand className="h-4 w-4" />,
    category: "Device Features",
  },
  {
    title: "Speech Recognition",
    href: "/features/speech-recognition",
    icon: <Mic className="h-4 w-4" />,
    category: "Device Features",
  },
  {
    title: "Speech Synthesis",
    href: "/features/speech-synthesis",
    icon: <Volume2 className="h-4 w-4" />,
    category: "Device Features",
  },
  // Storage & Data
  {
    title: "Local Storage",
    href: "/features/local-storage",
    icon: <Database className="h-4 w-4" />,
    category: "Storage & Data",
  },
  {
    title: "Storage",
    href: "/features/storage",
    icon: <Package className="h-4 w-4" />,
    category: "Storage & Data",
  },
  {
    title: "File Handling",
    href: "/features/file-handling",
    icon: <FileText className="h-4 w-4" />,
    category: "Storage & Data",
  },
  // Network & Sync
  {
    title: "Network Info",
    href: "/features/network-info",
    icon: <Wifi className="h-4 w-4" />,
    category: "Network & Sync",
  },
  {
    title: "Protocol Handler",
    href: "/features/protocol-handler",
    icon: <LinkIcon className="h-4 w-4" />,
    category: "Network & Sync",
  },
  {
    title: "Background Fetch",
    href: "/features/background-fetch",
    icon: <CloudCog className="h-4 w-4" />,
    category: "Network & Sync",
  },
  {
    title: "Background Sync",
    href: "/features/background-sync",
    icon: <RefreshCw className="h-4 w-4" />,
    category: "Network & Sync",
  },
  {
    title: "Periodic Background Sync",
    href: "/features/periodic-background-sync",
    icon: <RefreshCcw className="h-4 w-4" />,
    category: "Network & Sync",
  },
  {
    title: "Broadcast Updates",
    href: "/features/broadcast",
    icon: <Radio className="h-4 w-4" />,
    category: "Network & Sync",
  },
  {
    title: "Cache Expiration",
    href: "/features/cache-expiration",
    icon: <Clock className="h-4 w-4" />,
    category: "Network & Sync",
  },
  {
    title: "Cacheable Response",
    href: "/features/cacheable-response",
    icon: <CheckCircle2 className="h-4 w-4" />,
    category: "Network & Sync",
  },
  {
    title: "Cache On Demand",
    href: "/features/cache-on-demand",
    icon: <Download className="h-4 w-4" />,
    category: "Network & Sync",
  },
  {
    title: "Copy Response",
    href: "/features/copy-response",
    icon: <Copy className="h-4 w-4" />,
    category: "Network & Sync",
  },
  {
    title: "Navigation Preload",
    href: "/features/navigation-preload",
    icon: <Zap className="h-4 w-4" />,
    category: "Network & Sync",
  },
  {
    title: "Same Response",
    href: "/features/same-response",
    icon: <FileCheck className="h-4 w-4" />,
    category: "Network & Sync",
  },
  // Media & UI
  {
    title: "Audio Player",
    href: "/features/audio",
    icon: <AudioLines className="size-4" />,
    category: "Media & UI",
  },
  {
    title: "View Transitions",
    href: "/features/transitions",
    icon: <ArrowRightLeft className="h-4 w-4" />,
    category: "Media & UI",
  },
  {
    title: "Badge API",
    href: "/features/badge",
    icon: <Tag className="h-4 w-4" />,
    category: "Media & UI",
  },
  // Security
  {
    title: "Web Auth",
    href: "/features/web-authentication",
    icon: <Lock className="h-4 w-4" />,
    category: "Security",
  },
  {
    title: "Web Share API",
    href: "/features/web-share",
    icon: <Share className="h-4 w-4" />,
    category: "Security",
  },
  {
    title: "Share Target",
    href: "/features/share-target",
    icon: <InfoIcon className="h-4 w-4" />,
    category: "Security",
  },
];
