/**
 * DO NOT ADD FIREBASE OR AUTH LOGIC HERE
 * This file must remain stateless and permission-agnostic.
 * It strictly handles local in-memory job referencing.
 */
export interface JobResult {
  id: string;
  blobUrl: string;
  filename: string;
  fileType?: string; // added for history
  fileSize?: number; // added for history
  timestamp: number;
  downloadUrl?: string; // added for history
}

const STORAGE_KEY_PREFIX = "converty_history_";
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export const JobStore = {
  // Save a job result (and persist to history if uid is provided)
  set: (
    id: string,
    blobUrl: string,
    filename: string,
    uid?: string, // optional uid for persistence
    metadata?: { fileType: string; fileSize: number; downloadUrl: string }
  ) => {
    const entry: JobResult = {
      id,
      blobUrl,
      filename,
      timestamp: Date.now(),
      ...metadata,
    };

    // 1. In-memory (for immediate preview)
    // We don't persist blobUrls to localStorage as they are session-specific
    // but we can persist metadata.

    // 2. LocalStorage Persistence (if uid present)
    if (uid) {
      try {
        const key = `${STORAGE_KEY_PREFIX}${uid}`;
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        
        // Add new item at the beginning
        const updated = [entry, ...existing];
        
        // Prune older than 24h
        const now = Date.now();
        const pruned = updated.filter(
          (item: JobResult) => now - item.timestamp < TTL_MS
        );
        
        // Safety limit (e.g., last 50 items) to prevent quota issues
        const safeList = pruned.slice(0, 50);

        localStorage.setItem(key, JSON.stringify(safeList));
      } catch (e) {
        console.warn("Failed to save history to localStorage", e);
      }
    }
  },

  // Get in-memory blob URL (for Preview page)
  getBlobUrl: (id: string): string | null => {
    // In a real app we might cache blobs in memory map
    // For now, allow retrieving if we just set it in this session context
    // This part depends on how you want strictly in-memory previews to work across components.
    // If you need cross-component blob passing, a Context or global Map is needed.
    // Re-instating the simple Map for in-memory session blobs:
    return activeSessionBlobs.get(id) || null;
  },

  // Get History for a user (Filtered by TTL)
  getHistory: (uid: string): JobResult[] => {
    try {
      const key = `${STORAGE_KEY_PREFIX}${uid}`;
      const raw = localStorage.getItem(key);
      if (!raw) return [];

      const list = JSON.parse(raw) as JobResult[];
      const now = Date.now();

      // Filter expired
      const valid = list.filter((item) => now - item.timestamp < TTL_MS);

      // If we filtered anything out, update storage to clean up
      if (valid.length < list.length) {
        localStorage.setItem(key, JSON.stringify(valid));
      }

      return valid;
    } catch (e) {
      console.error("Error reading history", e);
      return [];
    }
  },

  // Delete a job from history and memory
  delete: (id: string, uid?: string) => {
    // 1. Remove from in-memory blobs
    activeSessionBlobs.delete(id);

    // 2. Remove from LocalStorage if uid provided
    if (uid) {
      try {
        const key = `${STORAGE_KEY_PREFIX}${uid}`;
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        const updated = existing.filter((item: JobResult) => item.id !== id);
        localStorage.setItem(key, JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to delete from history", e);
      }
    }
  },
};

// Global in-memory map for the current session's blob URLs (not persisted)
const activeSessionBlobs = new Map<string, string>();

// Hook into set to update the map
const originalSet = JobStore.set;
JobStore.set = (id, blobUrl, filename, uid, metadata) => {
  activeSessionBlobs.set(id, blobUrl);
  originalSet(id, blobUrl, filename, uid, metadata);
};

