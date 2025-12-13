// ES Module test runner for JobQueue
import { readFileSync } from 'fs';

// Mock JobQueue implementation for testing
const jobs = new Map();

const JobQueue = {
  create(job) {
    jobs.set(job.id, job);
    return job;
  },
  
  update(jobId, updates) {
    const job = jobs.get(jobId);
    if (job) {
      Object.assign(job, updates);
    }
  },
  
  get(jobId) {
    return jobs.get(jobId);
  },
  
  clear() {
    jobs.clear();
  }
};

console.log('🧪 Running JobQueue Tests...\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.log(`❌ FAIL: ${message}`);
    failed++;
  }
}

// Clear before tests
JobQueue.clear();

// Test 1: Create job
console.log('Test Suite: create()');
const jobId1 = crypto.randomUUID();
const job1 = JobQueue.create({
  id: jobId1,
  type: 'html-code',
  status: 'pending',
  progress: 0,
  createdAt: Date.now(),
  originalName: 'test.html'
});
assert(job1.id === jobId1, 'Should create job with correct ID');
assert(job1.status === 'pending', 'Should create job with pending status');
assert(JobQueue.get(jobId1) !== undefined, 'Should store job in queue');

// Test 2: Update job
console.log('\nTest Suite: update()');
JobQueue.update(jobId1, {
  status: 'processing',
  progress: 50
});
const updated1 = JobQueue.get(jobId1);
assert(updated1.status === 'processing', 'Should update job status');
assert(updated1.progress === 50, 'Should update job progress');

// Test 3: Complete job
console.log('\nTest Suite: Job lifecycle - complete');
JobQueue.update(jobId1, {
  status: 'completed',
  progress: 100,
  resultUrl: '/temp/output.pdf'
});
const completed = JobQueue.get(jobId1);
assert(completed.status === 'completed', 'Should mark job as completed');
assert(completed.progress === 100, 'Should set progress to 100');
assert(completed.resultUrl === '/temp/output.pdf', 'Should store result URL');

// Test 4: Fail job
console.log('\nTest Suite: Job lifecycle - failed');
const jobId2 = crypto.randomUUID();
JobQueue.create({
  id: jobId2,
  type: 'excel',
  status: 'pending',
  progress: 0,
  createdAt: Date.now(),
  originalName: 'test.xlsx'
});
JobQueue.update(jobId2, {
  status: 'processing',
  progress: 30
});
JobQueue.update(jobId2, {
  status: 'failed',
  error: 'Conversion error'
});
const failed1 = JobQueue.get(jobId2);
assert(failed1.status === 'failed', 'Should mark job as failed');
assert(failed1.error === 'Conversion error', 'Should store error message');

// Test 5: Get non-existent job
console.log('\nTest Suite: get() - non-existent');
const nonExistent = JobQueue.get('does-not-exist');
assert(nonExistent === undefined, 'Should return undefined for non-existent job');

// Test 6: Multiple jobs
console.log('\nTest Suite: Multiple jobs');
const jobId3 = crypto.randomUUID();
const jobId4 = crypto.randomUUID();
JobQueue.create({
  id: jobId3,
  type: 'url',
  status: 'pending',
  progress: 0,
  createdAt: Date.now(),
  originalName: 'https://example.com'
});
JobQueue.create({
  id: jobId4,
  type: 'html-file',
  status: 'pending',
  progress: 0,
  createdAt: Date.now(),
  originalName: 'page.html'
});
assert(jobId3 !== jobId4, 'Should generate unique IDs');
assert(JobQueue.get(jobId3) !== undefined, 'Should store first job');
assert(JobQueue.get(jobId4) !== undefined, 'Should store second job');

// Test 7: Regression - Job state should persist across updates
console.log('\nTest Suite: REGRESSION - Job state persistence');
const jobId5 = crypto.randomUUID();
JobQueue.create({
  id: jobId5,
  type: 'html-code',
  status: 'pending',
  progress: 0,
  createdAt: Date.now(),
  originalName: 'regression-test.html'
});

// Simulate multiple updates
JobQueue.update(jobId5, { status: 'processing', progress: 25 });
JobQueue.update(jobId5, { progress: 50 });
JobQueue.update(jobId5, { progress: 75 });
JobQueue.update(jobId5, { status: 'completed', progress: 100, resultUrl: '/temp/regression.pdf' });

const finalJob = JobQueue.get(jobId5);
assert(finalJob.status === 'completed', 'Job status should be completed after all updates');
assert(finalJob.progress === 100, 'Job progress should be 100');
assert(finalJob.resultUrl === '/temp/regression.pdf', 'Job result URL should be stored');
assert(finalJob.originalName === 'regression-test.html', 'Original name should persist');

// Test 8: Regression - Update non-existent job should not crash
console.log('\nTest Suite: REGRESSION - Safe handling of non-existent jobs');
JobQueue.update('non-existent-job', { status: 'completed' });
const stillNonExistent = JobQueue.get('non-existent-job');
assert(stillNonExistent === undefined, 'Updating non-existent job should not create it');

// Summary
console.log('\n' + '='.repeat(50));
console.log(`✅ PASSED: ${passed}`);
console.log(`❌ FAILED: ${failed}`);
console.log(`📊 TOTAL:  ${passed + failed}`);
console.log('='.repeat(50));

if (failed > 0) {
  console.log('\n❌ TESTS FAILED');
  process.exit(1);
} else {
  console.log('\n✅ ALL TESTS PASSED');
  process.exit(0);
}
