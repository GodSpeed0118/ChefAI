import NetInfo from '@react-native-community/netinfo';
import { StorageService } from './StorageService';

export const SyncService = {
    /**
     * Orchestrates the synchronization of local data with the remote backend
     * (Currently simulated until a specific backend is defined)
     */
    syncData: async () => {
        const state = await NetInfo.fetch();
        if (!state.isConnected || state.isInternetReachable === false) {
            console.log('[SyncService] Skipping sync - offline');
            return;
        }

        console.log('[SyncService] Starting synchronization...');

        try {
            // 1. Sync Pantry
            const pantry = await StorageService.getPantry();
            // Logic would go here to push local changes to Firebase/Supabase

            // 2. Sync Saved Recipes
            const savedRecipes = await StorageService.getSavedRecipes();

            console.log('[SyncService] Synchronization complete!');
        } catch (error) {
            console.error('[SyncService] Sync failed:', error);
        }
    },

    /**
     * Starts a listener for network changes to trigger sync
     */
    init: () => {
        return NetInfo.addEventListener(state => {
            if (state.isConnected && state.isInternetReachable !== false) {
                SyncService.syncData();
            }
        });
    }
};
