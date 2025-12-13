const http = require('http');

const jobId = '6f5602cc-3932-4291-bbe3-9336ec7de207';

console.log(`🔗 Testing download for job: ${jobId}\n`);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: `/api/convert/download/${jobId}`,
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = [];
  
  res.on('data', (chunk) => {
    data.push(chunk);
  });
  
  res.on('end', () => {
    const buffer = Buffer.concat(data);
    console.log('\n✅ Download successful!');
    console.log('📦 Size:', buffer.length, 'bytes');
    console.log('📄 Content-Type:', res.headers['content-type']);
    console.log('💾 Content-Disposition:', res.headers['content-disposition']);
    console.log('\n📝 First 200 chars of content:');
    console.log(buffer.toString('utf8').substring(0, 200));
  });
});

req.on('error', (e) => {
  console.error('❌ Download failed:', e);
});

req.end();
