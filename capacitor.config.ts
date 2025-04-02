import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tailmateconnect',
  appName: 'TailMate Connect',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    FirebaseMessaging: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config; 