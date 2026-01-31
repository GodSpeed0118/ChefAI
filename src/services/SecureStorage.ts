import * as SecureStore from 'expo-secure-store';

const SECURE_KEYS = {
    AUTH_TOKEN: 'chef_ai_auth_token',
    REMEMBER_ME: 'chef_ai_remember_me',
};

export const SecureStorage = {
    async setItem(key: string, value: string): Promise<void> {
        try {
            await SecureStore.setItemAsync(key, value);
        } catch (error) {
            console.error('Error saving to secure storage:', error);
        }
    },

    async getItem(key: string): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync(key);
        } catch (error) {
            console.error('Error reading from secure storage:', error);
            return null;
        }
    },

    async removeItem(key: string): Promise<void> {
        try {
            await SecureStore.deleteItemAsync(key);
        } catch (error) {
            console.error('Error removing from secure storage:', error);
        }
    },

    async saveAuthToken(token: string) {
        await this.setItem(SECURE_KEYS.AUTH_TOKEN, token);
    },

    async getAuthToken() {
        return await this.getItem(SECURE_KEYS.AUTH_TOKEN);
    },

    async clearAuth() {
        await this.removeItem(SECURE_KEYS.AUTH_TOKEN);
    }
};
