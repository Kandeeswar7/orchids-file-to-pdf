import path from 'path';
import fs from 'fs';
import os from 'os';

// Define a stable temp directory
// Use /tmp or OS specific temp + subfolder
const TEMP_ROOT = path.join(os.tmpdir(), 'converty-work');

// Ensure it exists on import (or startup)
if (!fs.existsSync(TEMP_ROOT)) {
    try {
        fs.mkdirSync(TEMP_ROOT, { recursive: true });
        console.log(`[Storage] Created temp root at ${TEMP_ROOT}`);
    } catch (e) {
        console.error(`[Storage] Failed to create temp root at ${TEMP_ROOT}`, e);
    }
}

export const Storage = { 
  getRootDir: () => TEMP_ROOT,

  getInputPath: (jobId: string, ext: string) => {
      // ext should include dot, e.g. .docx
      return path.join(TEMP_ROOT, `${jobId}-input${ext}`);
  },

  getOutputPath: (jobId: string) => {
      return path.join(TEMP_ROOT, `${jobId}.pdf`);
  },
  
  // Write buffer to temp input path
  saveInput: async (jobId: string, buffer: Buffer, originalName: string) => {
      const ext = path.extname(originalName).toLowerCase() || '.dat';
      const inputPath = Storage.getInputPath(jobId, ext);
      await fs.promises.writeFile(inputPath, buffer);
      return inputPath;
  }
};
