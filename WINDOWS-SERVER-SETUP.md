# Windows Server Setup Guide

This guide will help you set up the Node.js file server on your Windows machine to serve Lineage 2 update files.

## 📋 Prerequisites

- ✅ Node.js installed on your Windows server
- ✅ Your Lineage 2 update files (.exe files)

## 🚀 Quick Setup

### Step 1: Prepare Your Files

1. **Create a folder** for your update files (e.g., `C:\lineage2-updates\`)
2. **Copy your .exe files** into this folder
3. **Copy these files** to the same folder:
   - `windows-file-server.js`
   - `start-file-server.bat` (optional, for easy startup)

### Step 2: Configure the Server

1. **Open `windows-file-server.js`** in a text editor
2. **Find the CONFIG section** (around line 20):
   ```javascript
   const CONFIG = {
     PORT: 8080,
     USERNAME: "admin", // ← Change this
     PASSWORD: "password123", // ← Change this
     DIRECTORY: __dirname,
     ALLOWED_EXTENSIONS: [".exe", ".zip", ".rar", ".7z"],
   };
   ```
3. **Change the username and password** to your preferred credentials
4. **Save the file**

### Step 3: Start the Server

#### Option A: Using Command Prompt

1. **Open Command Prompt** as Administrator
2. **Navigate to your folder**:
   ```cmd
   cd C:\lineage2-updates
   ```
3. **Start the server**:
   ```cmd
   node windows-file-server.js
   ```

#### Option B: Using the Batch File (Easier)

1. **Double-click** `start-file-server.bat`
2. The server will start automatically

### Step 4: Verify It's Working

1. **Open your web browser**
2. **Go to**: `http://localhost:8080`
3. **Enter your username and password** when prompted
4. **You should see** a list of your update files

## 🔧 Configuration Options

### Change Port

If port 8080 is already in use, change it in the CONFIG:

```javascript
const CONFIG = {
  PORT: 8081, // ← Change to a different port
  // ... rest of config
};
```

### Add More File Types

To allow other file types, add them to ALLOWED_EXTENSIONS:

```javascript
ALLOWED_EXTENSIONS: ['.exe', '.zip', '.rar', '.7z', '.msi', '.dmg'],
```

### Change Directory

To serve files from a different folder:

```javascript
DIRECTORY: 'C:\\path\\to\\your\\files',
```

## 🌐 Network Access

### Allow External Access

1. **Open Windows Firewall**:

   - Press `Win + R`, type `wf.msc`, press Enter
   - Click "Inbound Rules" → "New Rule"
   - Select "Port" → "TCP" → "Specific local ports" → Enter your port (8080)
   - Allow the connection

2. **Find your server's IP address**:

   ```cmd
   ipconfig
   ```

   Look for "IPv4 Address" (e.g., 192.168.1.100)

3. **Test from another computer**:
   - Open browser on another computer
   - Go to: `http://YOUR-SERVER-IP:8080`
   - Enter your credentials

## 🧪 Testing

### Test with curl (if available)

```bash
# Test server access
curl -u username:password http://your-server-ip:8080/

# Test file download
curl -u username:password http://your-server-ip:8080/your-file.exe -o test.exe
```

### Test with PowerShell

```powershell
# Test server access
$cred = Get-Credential
Invoke-WebRequest -Uri "http://your-server-ip:8080/" -Credential $cred
```

## 🔒 Security Tips

1. **Use strong passwords**
2. **Change default credentials**
3. **Only allow necessary file types**
4. **Consider using HTTPS in production**
5. **Regularly update Node.js**

## 🐛 Troubleshooting

### "Port already in use"

- Change the PORT in CONFIG to a different number (e.g., 8081, 8082)
- Or stop the service using that port

### "Cannot access from other computers"

- Check Windows Firewall settings
- Verify your server's IP address
- Make sure the port is open

### "Authentication failed"

- Double-check username and password in CONFIG
- Make sure you're using the correct credentials

### "File not found"

- Verify the file exists in the directory
- Check file permissions
- Make sure the file extension is allowed

## 🚀 Running as a Service (Advanced)

To run the server automatically when Windows starts:

1. **Install PM2** (Process Manager):

   ```cmd
   npm install -g pm2
   ```

2. **Start with PM2**:

   ```cmd
   pm2 start windows-file-server.js --name "lineage2-server"
   ```

3. **Save PM2 configuration**:
   ```cmd
   pm2 save
   pm2 startup
   ```

## 📝 File Structure Example

```
C:\lineage2-updates\
├── windows-file-server.js
├── start-file-server.bat
├── lineage2-client-update-v1.2.exe
├── lineage2-patch-v1.2.1.exe
├── lineage2-maps-update.exe
└── ... (other update files)
```

## ✅ Success Checklist

- [ ] Node.js is installed
- [ ] Server files are in the correct folder
- [ ] Update files (.exe) are in the same folder
- [ ] Username and password are configured
- [ ] Server starts without errors
- [ ] Can access server from browser
- [ ] Can see list of files
- [ ] Firewall allows the port
- [ ] Can access from other computers on network

Your Lineage 2 file server is now ready! 🎉
