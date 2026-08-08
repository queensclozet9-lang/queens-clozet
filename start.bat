@echo off
title Starting Queen Clozet
echo ===================================================
echo   Starting Queen Clozet Dev Server ^& Opening Browser
echo ===================================================
echo.

if not exist node_modules (
    echo node_modules folder not found. Installing dependencies...
    call npm.cmd install
    if errorlevel 1 (
        echo Failed to install dependencies. Please check your network or npm setup.
        pause
        exit /b 1
    )
)

echo Starting development server...
call npm.cmd run start
if errorlevel 1 (
    echo.
    echo npm run start failed. Trying npx vite dev --open...
    call npx.cmd vite dev --open
)
pause
