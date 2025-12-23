export interface JobResult {
  id: string;
  blobUrl: string;
  filename: string;
  timestamp: number;
}

// In-memory store for the client session
// This persists as long as the tab is open / app is loaded
const resultStore = new Map<string, JobResult>();

export const JobStore = {
  set: (id: string, blobUrl: string, filename: string) => {
    resultStore.set(id, {
      id,
      blobUrl,
      filename,
      timestamp: Date.now()
    });
  },

  get: (id: string) => {
    return resultStore.get(id);
  },

  has: (id: string) => {
    return resultStore.has(id);
  }
};
