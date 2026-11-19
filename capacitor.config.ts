import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor Configuration for Switch
 * 
 * Supports both:
 * 1. Hosted Next.js Server (Recommended for full SSR, Server Actions, & Route Handlers)
 *    Set CAPACITOR_SERVER_URL in your environment or below.
 *    For Android Emulator local dev: http://10.0.2.2:3000
 *    For physical phone local dev: http://<YOUR_LOCAL_IP>:3000 (e.g. http://192.168.1.5:3000)
 *    For production: https://your-switch-domain.com
 * 
 * 2. Fallback Web Directory: 'public'
 */
const serverUrl = process.env.CAPACITOR_SERVER_URL;

const config: CapacitorConfig = {
  appId: 'com.switchsocial.app',
  appName: 'Switch',
  webDir: 'public',
  server: {
    // Connect to Next.js dev server over hotspot / local Wi-Fi
    url: process.env.CAPACITOR_SERVER_URL || 'http://10.199.208.209:3000',
    // Allow HTTP during development
    cleartext: true,
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#2463D3',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#2463D3',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
