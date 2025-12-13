import { JobQueue } from '../queue';
import { Job } from '../types';

describe('JobQueue', () => {
  beforeEach(() => {
    // Clear all jobs before each test
    JobQueue['jobs'] = new Map();
  });

  describe('create', () => {
    it('should create a new job with pending status', () => {
      const jobData: Job = {
        id: 'test-job-1',
        type: 'html-code',
        status: 'pending',
        progress: 0,
        createdAt: Date.now(),
        originalName: 'test.html'
      };

      const job = JobQueue.create(jobData);

      expect(job).toEqual(jobData);
      expect(JobQueue.get('test-job-1')).toEqual(jobData);
    });

    it('should generate unique IDs for multiple jobs', () => {
      const job1 = JobQueue.create({
        id: crypto.randomUUID(),
        type: 'excel',
        status: 'pending',
        progress: 0,
        createdAt: Date.now(),
        originalName: 'test1.xlsx'
      });

      const job2 = JobQueue.create({
        id: crypto.randomUUID(),
        type: 'html-file',
        status: 'pending',
        progress: 0,
        createdAt: Date.now(),
        originalName: 'test2.html'
      });

      expect(job1.id).not.toBe(job2.id);
      expect(JobQueue.get(job1.id)).toBeDefined();
      expect(JobQueue.get(job2.id)).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update job status and progress', () => {
      const jobId = 'test-job-2';
      JobQueue.create({
        id: jobId,
        type: 'url',
        status: 'pending',
        progress: 0,
        createdAt: Date.now(),
        originalName: 'https://example.com'
      });

      JobQueue.update(jobId, {
        status: 'processing',
        progress: 50
      });

      const job = JobQueue.get(jobId);
      expect(job?.status).toBe('processing');
      expect(job?.progress).toBe(50);
    });

    it('should update job to completed with result URL', () => {
      const jobId = 'test-job-3';
      JobQueue.create({
        id: jobId,
        type: 'html-code',
        status: 'pending',
        progress: 0,
        createdAt: Date.now(),
        originalName: 'code.html'
      });

      JobQueue.update(jobId, {
        status: 'completed',
        progress: 100,
        resultUrl: '/temp/test-output.pdf'
      });

      const job = JobQueue.get(jobId);
      expect(job?.status).toBe('completed');
      expect(job?.progress).toBe(100);
      expect(job?.resultUrl).toBe('/temp/test-output.pdf');
    });

    it('should update job to failed with error message', () => {
      const jobId = 'test-job-4';
      JobQueue.create({
        id: jobId,
        type: 'excel',
        status: 'pending',
        progress: 0,
        createdAt: Date.now(),
        originalName: 'test.xlsx'
      });

      JobQueue.update(jobId, {
        status: 'failed',
        error: 'Conversion failed: Invalid file format'
      });

      const job = JobQueue.get(jobId);
      expect(job?.status).toBe('failed');
      expect(job?.error).toBe('Conversion failed: Invalid file format');
    });

    it('should not update non-existent job', () => {
      JobQueue.update('non-existent-id', {
        status: 'completed',
        progress: 100
      });

      expect(JobQueue.get('non-existent-id')).toBeUndefined();
    });
  });

  describe('get', () => {
    it('should return job by ID', () => {
      const jobId = 'test-job-5';
      const jobData: Job = {
        id: jobId,
        type: 'html-file',
        status: 'processing',
        progress: 75,
        createdAt: Date.now(),
        originalName: 'document.html'
      };

      JobQueue.create(jobData);

      const retrieved = JobQueue.get(jobId);
      expect(retrieved).toEqual(jobData);
    });

    it('should return undefined for non-existent job', () => {
      const job = JobQueue.get('does-not-exist');
      expect(job).toBeUndefined();
    });
  });

  describe('Job lifecycle', () => {
    it('should handle complete job lifecycle: pending → processing → completed', () => {
      const jobId = crypto.randomUUID();
      
      // Create job
      const job = JobQueue.create({
        id: jobId,
        type: 'html-code',
        status: 'pending',
        progress: 0,
        createdAt: Date.now(),
        originalName: 'test.html'
      });
      expect(job.status).toBe('pending');
      expect(job.progress).toBe(0);

      // Start processing
      JobQueue.update(jobId, {
        status: 'processing',
        progress: 10
      });
      let updated = JobQueue.get(jobId);
      expect(updated?.status).toBe('processing');
      expect(updated?.progress).toBe(10);

      // Progress update
      JobQueue.update(jobId, {
        progress: 50
      });
      updated = JobQueue.get(jobId);
      expect(updated?.progress).toBe(50);

      // Complete
      JobQueue.update(jobId, {
        status: 'completed',
        progress: 100,
        resultUrl: '/temp/output.pdf'
      });
      updated = JobQueue.get(jobId);
      expect(updated?.status).toBe('completed');
      expect(updated?.progress).toBe(100);
      expect(updated?.resultUrl).toBe('/temp/output.pdf');
    });

    it('should handle failure in job lifecycle: pending → processing → failed', () => {
      const jobId = crypto.randomUUID();
      
      JobQueue.create({
        id: jobId,
        type: 'excel',
        status: 'pending',
        progress: 0,
        createdAt: Date.now(),
        originalName: 'data.xlsx'
      });

      JobQueue.update(jobId, {
        status: 'processing',
        progress: 30
      });

      JobQueue.update(jobId, {
        status: 'failed',
        error: 'LibreOffice conversion error'
      });

      const job = JobQueue.get(jobId);
      expect(job?.status).toBe('failed');
      expect(job?.error).toBe('LibreOffice conversion error');
    });
  });
});
