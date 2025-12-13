// Test conversion API
const http = require('http');

const testHtmlConversion = () => {
  const data = JSON.stringify({
    html: '<h1>Test HTML</h1><p>This is a test document with some content.</p><ul><li>Item 1</li><li>Item 2</li></ul>'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/convert/html',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    
    res.on('data', (chunk) => {
      body += chunk;
    });
    
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Response:', body);
      
      try {
        const result = JSON.parse(body);
        if (result.jobId) {
          console.log('\n✅ Job created:', result.jobId);
          console.log('📊 Now checking job status...\n');
          
          // Check status after 2 seconds
          setTimeout(() => checkJobStatus(result.jobId), 2000);
        }
      } catch (e) {
        console.error('Failed to parse response:', e);
      }
    });
  });

  req.on('error', (e) => {
    console.error('Request error:', e);
  });

  req.write(data);
  req.end();
};

const checkJobStatus = (jobId) => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/convert/status/${jobId}`,
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let body = '';
    
    res.on('data', (chunk) => {
      body += chunk;
    });
    
    res.on('end', () => {
      console.log('Status Check Response:', body);
      
      try {
        const job = JSON.parse(body);
        console.log('\n📋 Job Details:');
        console.log('  ID:', job.id);
        console.log('  Status:', job.status);
        console.log('  Progress:', job.progress + '%');
        console.log('  Result URL:', job.resultUrl);
        
        if (job.status === 'completed') {
          console.log('\n✅ Conversion completed!');
          console.log('🔗 Download URL: http://localhost:3000/api/convert/download/' + jobId);
        } else if (job.status === 'failed') {
          console.log('\n❌ Conversion failed:', job.error);
        } else {
          console.log('\n⏳ Still processing... checking again in 2s');
          setTimeout(() => checkJobStatus(jobId), 2000);
        }
      } catch (e) {
        console.error('Failed to parse status response:', e);
      }
    });
  });

  req.on('error', (e) => {
    console.error('Status check error:', e);
  });

  req.end();
};

console.log('🧪 Testing HTML to PDF Conversion...\n');
testHtmlConversion();
