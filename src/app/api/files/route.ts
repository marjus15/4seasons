import { NextRequest, NextResponse } from 'next/server';

// Configuration for your Windows server
const SERVER_CONFIG = {
  host: process.env.WINDOWS_SERVER_IP || 'localhost',
  port: process.env.WINDOWS_SERVER_PORT || '8080',
  username: process.env.WINDOWS_SERVER_USERNAME || 'admin',
  password: process.env.WINDOWS_SERVER_PASSWORD || 'password123',
  basePath: '/'
};

// Function to fetch files from Windows server
async function fetchFilesFromServer() {
  try {
    const serverUrl = `http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}/api/files`;
    const auth = Buffer.from(`${SERVER_CONFIG.username}:${SERVER_CONFIG.password}`).toString('base64');
    
    const response = await fetch(serverUrl, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'User-Agent': 'Lineage2-Updater/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }

    // Parse the JSON response
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Server returned error');
    }
    
    return data.files;
  } catch (error) {
    console.error('Error fetching files from server:', error);
    throw error;
  }
}


export async function GET(request: NextRequest) {
  try {
    // Fetch files dynamically from Windows server
    const files = await fetchFilesFromServer();
    
    return NextResponse.json({
      success: true,
      files: files,
      server: {
        host: SERVER_CONFIG.host,
        port: SERVER_CONFIG.port,
        basePath: SERVER_CONFIG.basePath
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('File listing error:', error);
    
    // Return error response with fallback
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch files from server',
      details: error instanceof Error ? error.message : 'Unknown error',
      fallback: {
        message: 'Server might be offline or unreachable',
        suggestion: 'Check if your Windows file server is running on the correct port'
      }
    }, { status: 500 });
  }
}
