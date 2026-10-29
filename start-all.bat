@echo off
title RecallMe - Full Stack Launcher
cd /d "%~dp0"
echo Starting Backend (Port 5000)...
start "RecallMe Backend" cmd /c "start-backend.bat"
timeout /t 2 /nobreak >nul
echo Starting Frontend (Port 5173)...
start "RecallMe Frontend" cmd /c "start-frontend.bat"
echo.
echo Both Frontend and Backend are starting up!
echo Visit: http://localhost:5173
