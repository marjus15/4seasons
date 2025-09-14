import { NextRequest, NextResponse } from 'next/server';

// Configuration for your Windows server
const SERVER_CONFIG = {
  host: process.env.WINDOWS_SERVER_IP , // Your server IP (localhost for testing)
  port: process.env.WINDOWS_SERVER_PORT , // Port for file server
  username: process.env.WINDOWS_SERVER_USERNAME ,
  password: process.env.WINDOWS_SERVER_PASSWORD ,
  basePath: '/' // Base path where your .exe files are stored
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('file');
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    // Validate filename to prevent directory traversal attacks
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    // Construct the URL to your Windows server
    const fileUrl = `http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}${SERVER_CONFIG.basePath}${filename}`;
    
    // Create basic auth header
    const auth = Buffer.from(`${SERVER_CONFIG.username}:${SERVER_CONFIG.password}`).toString('base64');
    
    // Fetch the file from your Windows server
    const response = await fetch(fileUrl, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'User-Agent': 'Lineage2-Updater/1.0'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ 
        error: `Failed to fetch file: ${response.status} ${response.statusText}` 
      }, { status: response.status });
    }

    // Get the file content
    const fileBuffer = await response.arrayBuffer();
    
    // Return the file as a download
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
