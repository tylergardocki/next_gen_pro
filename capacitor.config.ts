import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'next-gen-pro',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      visible: true,        // Shows the clock/battery bar
      overlaysWebView: false, // Pushes your app down so it doesn't hide behind the bar
      style: 'DARK',        // Makes text white (change to 'LIGHT' if you have a white background)
    },
  },
};

export default config;

