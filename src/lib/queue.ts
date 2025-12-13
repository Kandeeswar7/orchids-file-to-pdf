import { ConversionJob } from './types';

// In-memory store for jobs
// Note: In a production serverless environment, this should be Redis or a database.
const jobs = new Map<string, ConversionJob>();

export const JobQueue = {
  create: (job: ConversionJob) => {
    jobs.set(job.id, job);
    return job;
  },

  get: (id: string) => {
    return jobs.get(id);
  },

  update: (id: string, updates: Partial<ConversionJob>) => {
    const job = jobs.get(id);
    if (!job) return null;
    const updatedJob = { ...job, ...updates };
    jobs.set(id, updatedJob);
    return updatedJob;
  },

  list: () => {
    return Array.from(jobs.values());
  }
};
