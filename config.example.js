// Windows Server Configuration
// Copy this file to config.js and fill in your actual values

module.exports = {
  // Your Windows server IP address
  WINDOWS_SERVER_IP: '192.168.1.100',
  
  // Port where your file server is running (default: 8080)
  WINDOWS_SERVER_PORT: '8080',
  
  // Username for basic authentication
  WINDOWS_SERVER_USERNAME: 'your_username',
  
  // Password for basic authentication
  WINDOWS_SERVER_PASSWORD: 'your_password',
  
  // Base path where your .exe files are stored on the server
  BASE_PATH: '/mylineage/updater/'
};
