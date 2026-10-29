@echo off
title RecallMe - Express AI Backend
cd /d "%~dp0"
set "PATH=%~dp0..\nodejs;%PATH%"
cd backend
echo ========================================================
echo           Starting RecallMe AI & SQLite Backend
echo ========================================================
node server.js
pause
