// Test script to verify dynamic file fetching
// Run this with: node test-dynamic-files.js

const http = require('http');

console.log('🧪 Testing Dynamic File Fetching...\n');

// Test the Windows server API endpoint
function testWindowsServerAPI() {
  return new Promise((resolve) => {
    const auth = Buffer.from('admin:password123').toString('base64');
    
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/files',
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'User-Agent': 'Test-Script/1.0'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.success) {
            console.log('✅ Windows Server API working!');
            console.log(`   Found ${jsonData.files.length} files:`);
            jsonData.files.forEach(file => {
              console.log(`   • ${file.name} (${file.size}) - ${file.description}`);
            });
            resolve(true);
          } else {
            console.log('❌ Windows Server API returned error:', jsonData.error);
            resolve(false);
          }
        } catch (error) {
          console.log('❌ Failed to parse JSON response');
          console.log('   Response:', data.substring(0, 200) + '...');
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Windows Server API not accessible');
      console.log('   Error:', error.message);
      console.log('   Make sure your Windows server is running on port 8080');
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.log('❌ Windows Server API timeout');
      resolve(false);
    });

    req.end();
  });
}

// Test the Next.js API endpoint
function testNextJSAPI() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/api/files', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.success) {
            console.log('✅ Next.js API working!');
            console.log(`   Found ${jsonData.files.length} files:`);
            jsonData.files.forEach(file => {
              console.log(`   • ${file.name} (${file.size}) - ${file.description}`);
            });
            resolve(true);
          } else {
            console.log('❌ Next.js API returned error:', jsonData.error);
            resolve(false);
          }
        } catch (error) {
          console.log('❌ Failed to parse Next.js API response');
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Next.js API not accessible');
      console.log('   Error:', error.message);
      console.log('   Make sure your Next.js app is running on port 3000');
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.log('❌ Next.js API timeout');
      resolve(false);
    });
  });
}

// Run all tests
async function runTests() {
  console.log('🔍 Testing Windows Server API...');
  const windowsServerWorking = await testWindowsServerAPI();
  
  console.log('\n🔍 Testing Next.js API...');
  const nextJSApiWorking = await testNextJSApi();
  
  console.log('\n📋 Summary:');
  console.log(`   Windows Server API: ${windowsServerWorking ? '✅ Working' : '❌ Not working'}`);
  console.log(`   Next.js API: ${nextJSApiWorking ? '✅ Working' : '❌ Not working'}`);
  
  if (windowsServerWorking && nextJSApiWorking) {
    console.log('\n🎉 Dynamic file fetching is working perfectly!');
    console.log('   Your Next.js app will now automatically show files from your Windows server');
  } else {
    console.log('\n⚠️  Some issues detected. Check the errors above.');
  }
}

runTests().catch(console.error);
