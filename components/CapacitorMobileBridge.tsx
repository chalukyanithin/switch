"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Network } from "@capacitor/network";

export default function CapacitorMobileBridge() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run on native Capacitor platforms (Android / iOS)
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    // 1. Configure Native Status Bar
    const configureStatusBar = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Dark }); // White text/icons
        await StatusBar.setBackgroundColor({ color: "#2463D3" }); // Switch Blue
      } catch (err) {
        console.warn("StatusBar setup error:", err);
      }
    };

    // 2. Hide Native Splash Screen after web UI has mounted
    const hideSplash = async () => {
      try {
        await SplashScreen.hide({ fadeOutDuration: 300 });
      } catch (err) {
        console.warn("SplashScreen hide error:", err);
      }
    };

    configureStatusBar();
    hideSplash();

    // 3. Android Hardware Back Button Handling
    const backButtonHandler = CapApp.addListener("backButton", ({ canGoBack }) => {
      if (pathname === "/" || pathname === "/login") {
        CapApp.exitApp();
      } else {
        router.back();
      }
    });

    // 4. Network Status Monitoring
    const networkListener = Network.addListener("networkStatusChange", (status) => {
      if (!status.connected) {
        console.warn("[Switch Mobile] Device is currently offline");
      }
    });

    return () => {
      backButtonHandler.then((h) => h.remove()).catch(() => {});
      networkListener.then((h) => h.remove()).catch(() => {});
    };
  }, [pathname, router]);

  return null;
}
