# Lineage 2 Server Updater

A Next.js web application for downloading Lineage 2 server updates from a Windows server.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Server Settings

Create a `.env.local` file in the root directory:

```env
WINDOWS_SERVER_IP=192.168.1.100
WINDOWS_SERVER_PORT=8080
WINDOWS_SERVER_USERNAME=your_username
WINDOWS_SERVER_PASSWORD=your_password
```

### 3. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the updater interface.

## 🖥️ Windows Server Setup

### Option 1: Node.js HTTP Server (Recommended for Testing)

1. **Install Node.js** on your Windows server (if not already installed)
2. **Copy the `windows-file-server.js` script** to your server
3. **Place your .exe files** in the same folder as the script
4. **Edit the script** to change username/password:
   ```javascript
   const CONFIG = {
     USERNAME: "your_username",
     PASSWORD: "your_password",
     // ... other config
   };
   ```
5. **Run the server**:
   ```bash
   node windows-file-server.js
   ```
   Or double-click `start-file-server.bat` for easy startup

### Option 2: IIS (Internet Information Services)

1. **Enable IIS** on your Windows server
2. **Create a virtual directory** pointing to your update files folder
3. **Enable Basic Authentication**
4. **Configure CORS** to allow your Next.js app to access files

### Option 3: Apache/Nginx

For production use, consider setting up Apache or Nginx with proper authentication and CORS configuration.

## 📁 File Structure

```
mylineage/updater/
├── lineage2-client-update-v1.2.exe
├── lineage2-patch-v1.2.1.exe
├── lineage2-maps-update.exe
└── ... (other update files)
```

## 🔧 Configuration

### Environment Variables

| Variable                  | Description                       | Default         |
| ------------------------- | --------------------------------- | --------------- |
| `WINDOWS_SERVER_IP`       | IP address of your Windows server | `192.168.1.100` |
| `WINDOWS_SERVER_PORT`     | Port where file server is running | `8080`          |
| `WINDOWS_SERVER_USERNAME` | Username for authentication       | `your_username` |
| `WINDOWS_SERVER_PASSWORD` | Password for authentication       | `your_password` |

### API Endpoints

- `GET /api/files` - List available update files
- `GET /api/download?file=filename.exe` - Download a specific file

## 🧪 Testing

### 1. Test the File Server

```bash
# Test if your Windows server is accessible
curl -u username:password http://your-server-ip:8080/

# Test downloading a file
curl -u username:password http://your-server-ip:8080/lineage2-client-update-v1.2.exe -o test.exe
```

**Or test in browser:**

- Open `http://your-server-ip:8080/` in your browser
- Enter your username and password when prompted
- You should see a list of available files

### 2. Test the Next.js App

1. Start the development server: `npm run dev`
2. Open http://localhost:3000
3. Check if files are listed correctly
4. Try downloading a file

### 3. Test from Different Network

- Access your Next.js app from a different computer on the network
- Ensure the Windows server is accessible from that computer
- Test the complete download flow

## 🔒 Security Considerations

1. **Use HTTPS** in production
2. **Strong passwords** for server authentication
3. **Firewall rules** to restrict access
4. **Regular updates** of server software
5. **File validation** before serving

## 🚀 Deployment

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to fetch files"**

   - Check if Windows server is running
   - Verify IP address and port
   - Check firewall settings

2. **"Authentication failed"**

   - Verify username and password
   - Check if basic auth is enabled on server

3. **"Download failed"**

   - Check file permissions on Windows server
   - Verify file exists in the directory
   - Check CORS settings

4. **Files not showing**
   - Update the `AVAILABLE_FILES` array in `/src/app/api/files/route.ts`
   - Or implement dynamic file listing

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

## 📝 Customization

### Adding New Files

1. Add files to your Windows server directory
2. Update the `AVAILABLE_FILES` array in `/src/app/api/files/route.ts`
3. Or implement dynamic file scanning

### Styling

The app uses Tailwind CSS. Modify `/src/app/page.tsx` to change the appearance.

### File Types

Currently configured for .exe files, but can be modified to support other file types.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes. Make sure to comply with Lineage 2's terms of service.
"# 4seasons" 
