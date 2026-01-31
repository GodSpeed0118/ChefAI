import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import type { Auth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let authInstance: Auth | null = null;
let initPromise: Promise<Auth> | null = null;

const initializeAuthWithPersistence = async (): Promise<Auth> => {
    if (authInstance) {
        return authInstance;
    }
    
    if (initPromise) {
        return initPromise;
    }

    initPromise = (async () => {
        try {
            // Try to get existing auth instance first
            authInstance = getAuth(app);
            console.log('Using existing Auth instance');
            return authInstance;
        } catch (error) {
            console.log('Creating new Auth instance with AsyncStorage persistence');
            try {
                authInstance = initializeAuth(app, {
                    persistence: getReactNativePersistence(AsyncStorage)
                });
                return authInstance;
            } catch (initError) {
                console.error('Failed to initialize auth:', initError);
                // Return a minimal auth object to prevent complete failure
                // This allows the app to at least load in Expo Go
                throw initError;
            }
        }
    })();

    return initPromise;
};

export const getAuthInstance = (): Auth | null => {
    return authInstance;
};

export const getAuthInstanceAsync = (): Promise<Auth> => {
    return initializeAuthWithPersistence();
};

// Try to initialize immediately
initializeAuthWithPersistence().catch((error) => {
    console.error('Auth initialization failed:', error);
});

// Export auth instance (will be null initially but populated after initialization)
export const auth = authInstance as Auth;
export default app;