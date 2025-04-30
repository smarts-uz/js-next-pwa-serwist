import { icons } from "@/lib/icons";
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Smarts PWA Features Demo",
    short_name: "PWA Demo",
    description:
      "Explore and test modern Progressive Web App capabilities with real-world examples",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#121212",
    display_override: ["window-controls-overlay"],
    lang: "en-US",
    orientation: "portrait",
    icons,
    categories: ["productivity", "utilities"],
    screenshots: [
      {
        src: "/screenshots/desktop-home.png",
        sizes: "1440x900",
        type: "image/png",
      },
      {
        src: "/screenshots/desktop-storage.png",
        sizes: "1440x900",
        type: "image/png",
      },
      {
        src: "/screenshots/mobile-home.png",
        sizes: "420x900",
        type: "image/png",
      },
      {
        src: "/screenshots/mobile-storage.png",
        sizes: "420x900",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "File Handling",
        short_name: "Files",
        description: "Open and save files directly from the web app",
        url: "/features/file-handling",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Local",
        short_name: "Local",
        description: "Manage",
        url: "/features/local-storage",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
    ],
    protocol_handlers: [
      {
        protocol: "web+pwa",
        url: "/features/protocol-handler?url=%s",
      },
    ],
    file_handlers: [
      {
        action: "/features/file-handling",
        accept: [
          {
            "text/plain": [".txt"],
          },
        ],
      },
      {
        action: "/features/file-handling",
        accept: {
          // @ts-ignore
          "application/pdf": [".pdf"],
        },
        icons: [
          {
            src: "./icons/pdf-file.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        launch_type: "single-client",
      },
    ],
    share_target: {
      action: "/features/share-target",
      text: "text",
      url: "url",
      enctype: "application/x-www-form-urlencoded",
      files: [
        {
          name: "lists",
          accept: ["text/csv", ".csv", "text/plain", ".txt"],
        },
      ],
    },
  };
}
