import { Queue } from 'bullmq';
import IORedis from 'ioredis';

// Connection string or default to local
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null // Required by BullMQ
});

export const conversionQueue = new Queue('conversion-queue', {
  connection
});

export const JobQueue = {
  add: async (jobData: any, priority: number = 0, jobId?: string) => {
    // Priority: Higher number = Higher priority
    return await conversionQueue.add('convert-job', jobData, {
      jobId, // Use the provided UUID
      priority,
      removeOnComplete: { count: 100 }, // Keep last 100
      removeOnFail: { count: 100 }
    });
  },
  
  get: async (jobId: string) => {
    return await conversionQueue.getJob(jobId);
  }
};
