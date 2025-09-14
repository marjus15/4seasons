/**
 * Node.js HTTP File Server for Windows
 * This script creates a basic HTTP server to serve your Lineage 2 update files.
 * 
 * Requirements:
 * - Node.js installed on your Windows server
 * - Place this script in the folder containing your .exe files
 * 
 * Usage:
 * 1. Place your .exe files in the same folder as this script
 * 2. Run: node windows-file-server.js
 * 3. The server will start on http://localhost:8080
 * 4. Access files at: http://your-server-ip:8080/filename.exe
 * 
 * Security Note:
 * This is a basic server for testing. For production, consider using:
 * - IIS (Internet Information Services)
 * - Apache HTTP Server
 * - Nginx
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuration
const CONFIG = {
  PORT: 8080,
  USERNAME: 'admin',        // Change this to your desired username
  PASSWORD: 'password123',  // Change this to your desired password
  DIRECTORY: __dirname,     // Serve files from the same directory as this script
  ALLOWED_EXTENSIONS: ['.exe', '.zip', '.rar', '.7z'], // Allowed file extensions
};

// MIME types for different file extensions
const MIME_TYPES = {
  '.exe': 'application/octet-stream',
  '.zip': 'application/zip',
  '.rar': 'application/x-rar-compressed',
  '.7z': 'application/x-7z-compressed',
  '.txt': 'text/plain',
  '.html': 'text/html',
  '.json': 'application/json'
};

class FileServer {
  constructor() {
    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });
  }

  // Basic authentication check
  checkAuth(req) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return false;
    }

    try {
      const credentials = Buffer.from(authHeader.slice(6), 'base64').toString('utf-8');
      const [username, password] = credentials.split(':');
      return username === CONFIG.USERNAME && password === CONFIG.PASSWORD;
    } catch (error) {
      return false;
    }
  }

  // Send authentication required response
  sendAuthRequired(res) {
    res.writeHead(401, {
      'WWW-Authenticate': 'Basic realm="Lineage 2 Updater"',
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type'
    });
    res.end('<h1>401 Unauthorized</h1><p>Authentication required</p>');
  }

  // Get file extension
  getFileExtension(filename) {
    return path.extname(filename).toLowerCase();
  }

  // Check if file extension is allowed
  isAllowedFile(filename) {
    const ext = this.getFileExtension(filename);
    return CONFIG.ALLOWED_EXTENSIONS.includes(ext);
  }

  // Get MIME type for file
  getMimeType(filename) {
    const ext = this.getFileExtension(filename);
    return MIME_TYPES[ext] || 'application/octet-stream';
  }

  // Handle API files endpoint
  handleApiFiles(res) {
    try {
      const files = fs.readdirSync(CONFIG.DIRECTORY)
        .filter(file => {
          const filePath = path.join(CONFIG.DIRECTORY, file);
          return fs.statSync(filePath).isFile() && this.isAllowedFile(file);
        })
        .map(file => {
          const filePath = path.join(CONFIG.DIRECTORY, file);
          const stats = fs.statSync(filePath);
          const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
          
          // Extract version from filename if possible
          const versionMatch = file.match(/v?(\d+\.\d+(?:\.\d+)?)/);
          const version = versionMatch ? versionMatch[1] : '1.0';
          
          // Generate description based on filename
          const description = this.generateDescription(file);
          
          return {
            name: file,
            size: `${sizeMB} MB`,
            version: version,
            description: description,
            date: stats.mtime.toISOString().split('T')[0], // YYYY-MM-DD format
            modified: stats.mtime.toISOString(),
            extension: this.getFileExtension(file),
            bytes: stats.size
          };
        });

      const response = {
        success: true,
        files: files,
        count: files.length,
        server: {
          host: CONFIG.host || 'localhost',
          port: CONFIG.PORT,
          directory: CONFIG.DIRECTORY
        },
        timestamp: new Date().toISOString()
      };

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type'
      });
      res.end(JSON.stringify(response, null, 2));
    } catch (error) {
      console.error('API files error:', error);
      res.writeHead(500, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({
        success: false,
        error: 'Error reading directory',
        details: error.message
      }));
    }
  }

  // Generate description based on filename
  generateDescription(filename) {
    const lowerName = filename.toLowerCase();
    
    if (lowerName.includes('client')) {
      return 'Main client update with new features and improvements';
    } else if (lowerName.includes('patch')) {
      return 'Bug fixes and stability improvements';
    } else if (lowerName.includes('map')) {
      return 'New maps and areas update';
    } else if (lowerName.includes('launcher')) {
      return 'Launcher update with new features';
    } else if (lowerName.includes('update')) {
      return 'Complete server update package';
    } else {
      return 'Lineage 2 server update file';
    }
  }

  // Handle directory listing
  handleDirectoryListing(res) {
    try {
      const files = fs.readdirSync(CONFIG.DIRECTORY)
        .filter(file => {
          const filePath = path.join(CONFIG.DIRECTORY, file);
          return fs.statSync(filePath).isFile() && this.isAllowedFile(file);
        })
        .map(file => {
          const filePath = path.join(CONFIG.DIRECTORY, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            size: stats.size,
            modified: stats.mtime.toISOString(),
            extension: this.getFileExtension(file)
          };
        });

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Lineage 2 Update Files</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #1a1a1a; color: #fff; }
            h1 { color: #4CAF50; }
            .file-list { background: #2a2a2a; padding: 20px; border-radius: 8px; }
            .file-item { padding: 10px; border-bottom: 1px solid #444; }
            .file-item:last-child { border-bottom: none; }
            .file-name { font-weight: bold; color: #4CAF50; }
            .file-size { color: #888; }
            .file-date { color: #666; }
          </style>
        </head>
        <body>
          <h1>Lineage 2 Update Files</h1>
          <div class="file-list">
            <h2>Available Files (${files.length})</h2>
            ${files.map(file => `
              <div class="file-item">
                <div class="file-name">${file.name}</div>
                <div class="file-size">Size: ${(file.size / 1024 / 1024).toFixed(2)} MB</div>
                <div class="file-date">Modified: ${new Date(file.modified).toLocaleString()}</div>
              </div>
            `).join('')}
          </div>
          <p><em>Use your updater application to download these files.</em></p>
          <p><a href="/api/files" style="color: #4CAF50;">View JSON API</a></p>
        </body>
        </html>
      `;

      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(html);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error reading directory');
    }
  }

  // Handle file download
  handleFileDownload(filePath, res) {
    try {
      const stats = fs.statSync(filePath);
      const filename = path.basename(filePath);
      const mimeType = this.getMimeType(filename);

      res.writeHead(200, {
        'Content-Type': mimeType,
        'Content-Length': stats.size,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type'
      });

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      fileStream.on('error', (error) => {
        console.error('File stream error:', error);
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error reading file');
        }
      });

    } catch (error) {
      console.error('File download error:', error);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    }
  }

  // Main request handler
  handleRequest(req, res) {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type'
      });
      res.end();
      return;
    }

    // Check authentication
    if (!this.checkAuth(req)) {
      this.sendAuthRequired(res);
      return;
    }

    // Parse URL
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Handle API endpoint for JSON file list
    if (pathname === '/api/files' || pathname === '/api/files.json') {
      this.handleApiFiles(res);
      return;
    }

    // Handle root path - show directory listing
    if (pathname === '/' || pathname === '') {
      this.handleDirectoryListing(res);
      return;
    }

    // Handle file requests
    const requestedFile = pathname.slice(1); // Remove leading slash
    const filePath = path.join(CONFIG.DIRECTORY, requestedFile);

    // Security check - prevent directory traversal
    if (!filePath.startsWith(CONFIG.DIRECTORY)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Access denied');
      return;
    }

    // Check if file exists and is allowed
    try {
      const stats = fs.statSync(filePath);
      if (!stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not a file');
        return;
      }

      if (!this.isAllowedFile(requestedFile)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('File type not allowed');
        return;
      }

      this.handleFileDownload(filePath, res);

    } catch (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    }
  }

  // Start the server
  start() {
    this.server.listen(CONFIG.PORT, () => {
      console.log('🚀 Lineage 2 File Server Started!');
      console.log('================================');
      console.log(`📁 Directory: ${CONFIG.DIRECTORY}`);
      console.log(`🌐 Port: ${CONFIG.PORT}`);
      console.log(`👤 Username: ${CONFIG.USERNAME}`);
      console.log(`🔑 Password: ${CONFIG.PASSWORD}`);
      console.log(`🔗 URL: http://localhost:${CONFIG.PORT}`);
      console.log('================================');
      
      // List available files
      try {
        const files = fs.readdirSync(CONFIG.DIRECTORY)
          .filter(file => {
            const filePath = path.join(CONFIG.DIRECTORY, file);
            return fs.statSync(filePath).isFile() && this.isAllowedFile(file);
          });

        if (files.length > 0) {
          console.log('\n📋 Available Files:');
          files.forEach(file => {
            const filePath = path.join(CONFIG.DIRECTORY, file);
            const stats = fs.statSync(filePath);
            const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
            console.log(`   • ${file} (${sizeMB} MB)`);
          });
        } else {
          console.log('\n⚠️  No update files found in directory');
          console.log('   Add .exe files to this folder to serve them');
        }
      } catch (error) {
        console.error('Error reading directory:', error.message);
      }

      console.log('\n🛑 Press Ctrl+C to stop the server');
      console.log('================================\n');
    });

    this.server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${CONFIG.PORT} is already in use`);
        console.error('   Try changing the PORT in the CONFIG object');
      } else {
        console.error('❌ Server error:', error.message);
      }
      process.exit(1);
    });
  }

  // Graceful shutdown
  stop() {
    console.log('\n🛑 Shutting down server...');
    this.server.close(() => {
      console.log('✅ Server stopped');
      process.exit(0);
    });
  }
}

// Create and start the server
const fileServer = new FileServer();

// Handle graceful shutdown
process.on('SIGINT', () => {
  fileServer.stop();
});

process.on('SIGTERM', () => {
  fileServer.stop();
});

// Start the server
fileServer.start();
