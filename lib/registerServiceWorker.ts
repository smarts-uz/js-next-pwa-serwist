"use client";

declare const confirmUpdate: () => boolean;
import { Serwist } from "@serwist/window";

export async function registerSW() {
  if (!("serviceWorker" in navigator)) return;

  const serwist = new Serwist("/sw.js", { scope: "/", type: "classic" });
  const handleWaiting = () => {
    console.log(
      "A new service worker has installed, but it can't activate until all tabs running the current version have fully unloaded."
    );

    serwist.addEventListener("controlling", location.reload);
    if (confirmUpdate()) {
      serwist.messageSkipWaiting();
    }
  };

  serwist.addEventListener("waiting", handleWaiting);

  void serwist.register();

  return () => {
    serwist.removeEventListener("waiting", handleWaiting);
  };
}
