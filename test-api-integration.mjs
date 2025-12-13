// Integration test for conversion API
import http from 'http';

console.log('🧪 Running API Integration Tests...\n');

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

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: data ? {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(data))
      } : {}
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  // Test 1: Create HTML conversion job
  console.log('Test Suite: POST /api/convert/html');
  try {
    const createRes = await makeRequest('POST', '/api/convert/html', {
      html: '<h1>Integration Test</h1><p>Testing job creation</p>'
    });
    
    assert(createRes.status === 200, 'Should return 200 on job creation');
    assert(createRes.data.jobId !== undefined, 'Should return jobId');
    
    const jobId = createRes.data.jobId;
    console.log(`   Job ID: ${jobId}`);

    // Test 2: Check job status
    console.log('\nTest Suite: GET /api/convert/status/:jobId');
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait for processing
    
    const statusRes = await makeRequest('GET', `/api/convert/status/${jobId}`);
    assert(statusRes.status === 200, 'Should return 200 on status check');
    assert(statusRes.data.id === jobId, 'Should return correct job ID');
    assert(['pending', 'processing', 'completed', 'failed'].includes(statusRes.data.status), 
           'Should have valid status');
    
    console.log(`   Status: ${statusRes.data.status}`);
    console.log(`   Progress: ${statusRes.data.progress}%`);

    // Test 3: Wait for completion
    console.log('\nTest Suite: Job Lifecycle - Wait for completion');
    let finalStatus = statusRes.data;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (finalStatus.status !== 'completed' && finalStatus.status !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const checkRes = await makeRequest('GET', `/api/convert/status/${jobId}`);
      finalStatus = checkRes.data;
      attempts++;
    }
    
    assert(finalStatus.status === 'completed', 'Job should complete successfully');
    assert(finalStatus.progress === 100, 'Progress should be 100 when completed');
    assert(finalStatus.resultUrl !== undefined, 'Should have result URL');
    
    console.log(`   Final Status: ${finalStatus.status}`);
    console.log(`   Result URL: ${finalStatus.resultUrl}`);

    // Test 4: Download file
    if (finalStatus.status === 'completed') {
      console.log('\nTest Suite: GET /api/convert/download/:jobId');
      const downloadRes = await makeRequest('GET', `/api/convert/download/${jobId}`);
      
      assert(downloadRes.status === 200, 'Should return 200 on download');
      assert(downloadRes.data.length > 0, 'Should return file content');
      assert(downloadRes.headers['content-type'] !== undefined, 'Should have Content-Type header');
      
      console.log(`   Content-Type: ${downloadRes.headers['content-type']}`);
      console.log(`   Content-Length: ${downloadRes.data.length} bytes`);
    }

    // Test 5: Non-existent job
    console.log('\nTest Suite: GET /api/convert/status/:jobId - non-existent');
    const notFoundRes = await makeRequest('GET', '/api/convert/status/non-existent-job-id');
    assert(notFoundRes.status === 404, 'Should return 404 for non-existent job');

    // Test 6: REGRESSION - Multiple concurrent jobs
    console.log('\nTest Suite: REGRESSION - Multiple concurrent jobs');
    const job1Promise = makeRequest('POST', '/api/convert/html', {
      html: '<h1>Job 1</h1>'
    });
    const job2Promise = makeRequest('POST', '/api/convert/html', {
      html: '<h1>Job 2</h1>'
    });
    
    const [job1Res, job2Res] = await Promise.all([job1Promise, job2Promise]);
    
    assert(job1Res.data.jobId !== job2Res.data.jobId, 'Jobs should have unique IDs');
    assert(job1Res.status === 200 && job2Res.status === 200, 'Both jobs should be created');
    
    console.log(`   Job 1 ID: ${job1Res.data.jobId}`);
    console.log(`   Job 2 ID: ${job2Res.data.jobId}`);

    // Verify both jobs are tracked independently
    await new Promise(resolve => setTimeout(resolve, 500));
    const [check1, check2] = await Promise.all([
      makeRequest('GET', `/api/convert/status/${job1Res.data.jobId}`),
      makeRequest('GET', `/api/convert/status/${job2Res.data.jobId}`)
    ]);
    
    assert(check1.data.id === job1Res.data.jobId, 'Job 1 should maintain identity');
    assert(check2.data.id === job2Res.data.jobId, 'Job 2 should maintain identity');

  } catch (error) {
    console.error(`\n❌ Test error: ${error.message}`);
    failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`✅ PASSED: ${passed}`);
  console.log(`❌ FAILED: ${failed}`);
  console.log(`📊 TOTAL:  ${passed + failed}`);
  console.log('='.repeat(50));

  if (failed > 0) {
    console.log('\n❌ INTEGRATION TESTS FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ ALL INTEGRATION TESTS PASSED');
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
