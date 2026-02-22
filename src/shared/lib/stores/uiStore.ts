/**
 * UI Store
 * Manages UI-related state (sync status, errors, offline mode)
 * @module stores/uiStore
 */

import { atom } from "nanostores";

/** Indicates if a sync operation is in progress */
export const $isSyncing = atom<boolean>(false);

/** Last sync error if any */
export const $lastSyncError = atom<string | null>(null);

/** Offline mode indicator */
export const $offlineMode = atom<boolean>(false);
