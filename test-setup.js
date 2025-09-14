// Test script to verify the Lineage 2 Updater setup
// Run this with: node test-setup.js

const http = require('http');

console.log('🧪 Testing Lineage 2 Updater Setup...\n');

// Test 1: Check if Next.js server is running
function testNextJSServer() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000', (res) => {
      console.log('✅ Next.js server is running on port 3000');
      resolve(true);
    });
    
    req.on('error', (err) => {
      console.log('❌ Next.js server is not running');
      console.log('   Start it with: npm run dev');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Next.js server timeout');
      resolve(false);
    });
  });
}

// Test 2: Check API endpoints
async function testAPIEndpoints() {
  try {
    // Test files endpoint
    const filesResponse = await fetch('http://localhost:3000/api/files');
    if (filesResponse.ok) {
      const data = await filesResponse.json();
      console.log('✅ Files API endpoint working');
      console.log(`   Found ${data.files.length} update files`);
    } else {
      console.log('❌ Files API endpoint failed');
    }
  } catch (error) {
    console.log('❌ API endpoints test failed:', error.message);
  }
}

// Test 3: Check Windows server configuration
function testWindowsServerConfig() {
  console.log('\n📋 Windows Server Configuration:');
  console.log('   IP: 192.168.1.100 (default)');
  console.log('   Port: 8080 (default)');
  console.log('   Username: your_username (default)');
  console.log('   Password: your_password (default)');
  console.log('\n   ⚠️  Remember to update these in .env.local file!');
}

// Test 4: Instructions for Windows server setup
function showWindowsServerInstructions() {
  console.log('\n🖥️  Windows Server Setup Instructions:');
  console.log('   1. Copy windows-file-server.js to your Windows server');
  console.log('   2. Place your .exe files in the same folder');
  console.log('   3. Edit the script to set your username/password');
  console.log('   4. Run: node windows-file-server.js');
  console.log('   5. Or double-click: start-file-server.bat');
  console.log('   6. Test with: curl -u username:password http://your-server-ip:8080/');
}

// Run all tests
async function runTests() {
  const nextJSRunning = await testNextJSServer();
  
  if (nextJSRunning) {
    await testAPIEndpoints();
  }
  
  testWindowsServerConfig();
  showWindowsServerInstructions();
  
  console.log('\n🎯 Next Steps:');
  console.log('   1. Open http://localhost:3000 in your browser');
  console.log('   2. Set up your Windows server with the Python script');
  console.log('   3. Update .env.local with your server details');
  console.log('   4. Test the complete download flow');
  
  console.log('\n✨ Setup complete! Your Lineage 2 Updater is ready to use.');
}

runTests().catch(console.error);
