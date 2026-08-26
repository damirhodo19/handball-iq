import type { ExpoConfig, ConfigContext } from 'expo/config';

/**
 * Handball IQ 2.0 — Closed Beta configuration.
 * Preview builds must not depend on Metro or local .env at runtime once EAS env is set.
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Handball IQ',
  slug: 'handball-iq',
  version: '0.9.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'handballiq',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.llhprojects.handballiq',
    buildNumber: '1',
    infoPlist: {
      CFBundleDisplayName: 'Handball IQ',
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: 'com.llhprojects.handballiq',
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/images/icon.png',
      backgroundColor: '#0B1220',
    },
  },
  web: {
    bundler: 'metro',
    output: 'single',
    favicon: './assets/images/favicon.png',
  },
  plugins: ['expo-router', 'expo-font', 'expo-web-browser'],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    appEnv: process.env.APP_ENV ?? 'development',
    eas: {
      projectId: process.env.EAS_PROJECT_ID ?? 'b62f785f-a9ff-4f78-8c81-b6c69b547e4f',
    },
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: 'https://u.expo.dev/b62f785f-a9ff-4f78-8c81-b6c69b547e4f',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
});
