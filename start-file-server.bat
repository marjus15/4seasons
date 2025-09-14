@echo off
echo Starting Lineage 2 File Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if the server file exists
if not exist "windows-file-server.js" (
    echo ERROR: windows-file-server.js not found
    echo Make sure you're running this from the correct directory
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Start the server
echo Starting server...
node windows-file-server.js

REM Keep window open if there's an error
if %errorlevel% neq 0 (
    echo.
    echo Server stopped with error code: %errorlevel%
    pause
)
