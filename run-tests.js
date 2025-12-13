// Simple test runner for queue.test.ts
const { JobQueue } = require('./src/lib/queue');

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

function assertEquals(actual, expected, message) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.log(`❌ FAIL: ${message}`);
    console.log(`   Expected: ${JSON.stringify(expected)}`);
    console.log(`   Actual: ${JSON.stringify(actual)}`);
    failed++;
  }
}

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

// Summary
console.log('\n' + '='.repeat(50));
console.log(`✅ PASSED: ${passed}`);
console.log(`❌ FAILED: ${failed}`);
console.log(`📊 TOTAL:  ${passed + failed}`);
console.log('='.repeat(50));

if (failed > 0) {
  process.exit(1);
}
