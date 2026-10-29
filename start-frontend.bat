@echo off
title RecallMe - React Vite Frontend
cd /d "%~dp0"
set "PATH=%~dp0..\nodejs;%PATH%"
echo ========================================================
echo           Starting RecallMe React Frontend
echo ========================================================
npm.cmd run dev
pause
