import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shift Income Report Calculator",
    short_name: "Shift Calc",
    description: "Taxi shift settlement calculator",
    start_url: "/",
    display: "standalone",
    background_color: "#2b2b2c",
    theme_color: "#2b2b2c",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}