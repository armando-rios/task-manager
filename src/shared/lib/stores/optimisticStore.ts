/**
 * Optimistic ID Store
 * Manages mapping between optimistic (client-generated) IDs and real server IDs.
 * Used during optimistic UI updates to track temporary IDs until server confirms.
 * @module stores/optimisticStore
 */

import { map } from "nanostores";

/**
 * Map of optimistic client IDs to real server IDs.
 * Key: optimisticId, Value: realId
 */
const $optimisticIdMap = map<Record<string, string>>({});

/**
 * Register a mapping between an optimistic ID and a real server ID.
 * Called after server confirms the operation and returns the real ID.
 */
export function registerOptimisticId(
  optimisticId: string,
  realId: string,
): void {
  const current = $optimisticIdMap.get();
  $optimisticIdMap.set({ ...current, [optimisticId]: realId });
}

/**
 * Clear a mapping after it no longer needs to be tracked.
 * Called when the operation is fully confirmed and synced.
 */
export function clearOptimisticId(optimisticId: string): void {
  const current = $optimisticIdMap.get();
  const { [optimisticId]: _, ...rest } = current;
  $optimisticIdMap.set(rest);
}
