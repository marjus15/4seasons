@echo off
echo Creating test files for Lineage 2 Updater...
echo.

REM Create test directory if it doesn't exist
if not exist "C:\lineage2-updates" (
    mkdir "C:\lineage2-updates"
    echo Created directory: C:\lineage2-updates
)

REM Navigate to the directory
cd /d "C:\lineage2-updates"

REM Create test files
echo Creating test update files...

echo This is a test Lineage 2 client update file > lineage2-client-update-v1.2.exe
echo This is a test patch file for Lineage 2 > lineage2-patch-v1.2.1.exe
echo This is a test maps update file > lineage2-maps-update.exe
echo This is a test launcher update > lineage2-launcher-update.exe

echo.
echo Test files created successfully!
echo.
echo Files in C:\lineage2-updates:
dir *.exe
echo.
echo Now you can start your server with:
echo node windows-file-server.js
echo.
pause
