/**
 * Debounced Inline Edit Hook
 * Provides debounced optimistic updates for inline editing of entities
 * @module hooks/useInlineEdit
 */

import { useCallback, useRef } from "react";
import { actions } from "astro:actions";
import { updateProjectInStore } from "../stores/appStore";
import { showToast } from "../toast";

interface OriginalValue {
  id: string;
  field: string;
  value: string;
}

interface InlineEditOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for debounced inline editing with optimistic updates
 * @returns edit function and cancel function
 */
export function useInlineEdit() {
  // Store original values for potential rollback
  const originalValuesRef = useRef<Map<string, OriginalValue>>(new Map());
  // Store timeout ID for cancellation
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Edit a field with debounced server sync
   * @param id - Entity ID
   * @param field - Field name being edited
   * @param newValue - New value for the field
   * @param currentEntity - Current entity state (for rollback)
   */
  const edit = useCallback(
    (
      id: string,
      field: string,
      newValue: string,
      currentEntity: Record<string, unknown>,
      options?: InlineEditOptions,
    ) => {
      const key = `${id}-${field}`;

      // 1. Save original value on first edit
      if (!originalValuesRef.current.has(key)) {
        const originalValue = currentEntity[field];
        originalValuesRef.current.set(key, {
          id,
          field,
          value: typeof originalValue === "string" ? originalValue : "",
        });
      }

      // 2. Optimistic update immediately
      updateProjectInStore({ id, [field]: newValue });

      // 3. Debounce server call (500ms)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        const original = originalValuesRef.current.get(key);

        try {
          // Use project update action - field is dynamically passed
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const updateData = { id, [field]: newValue } as any;
          const result = await actions.projects.update(updateData);
          const resultData = result.data as
            | { success: boolean; project: unknown }
            | undefined;

          if (!resultData?.success) {
            throw new Error("Failed to update");
          }

          // 4. On success: Clear original value
          originalValuesRef.current.delete(key);
          showToast.success("Updated");
          options?.onSuccess?.();
        } catch (error) {
          // 5. On error: Rollback to original, show toast
          if (original) {
            updateProjectInStore({ id, [field]: original.value });
          }
          showToast.error(
            error instanceof Error ? error.message : "Failed to update",
          );
          options?.onError?.(
            error instanceof Error ? error : new Error("Failed to update"),
          );

          // Clear the stored original since we've rolled back
          originalValuesRef.current.delete(key);
        }
      }, 500);
    },
    [],
  );

  /**
   * Cancel any pending edit and restore original values
   */
  const cancel = useCallback(() => {
    // 6. cancel(): Clear timeout, restore original value
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Restore all original values that were saved
    originalValuesRef.current.forEach((original) => {
      updateProjectInStore({
        id: original.id,
        [original.field]: original.value,
      });
    });

    // Clear the map
    originalValuesRef.current.clear();
  }, []);

  return { edit, cancel };
}
