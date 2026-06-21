@echo off
title منصة ذكاء الاحتياج التدريبي
cd /d C:\nif\mangment

echo.
echo تشغيل منصة ذكاء الاحتياج التدريبي...
echo سيتم فتح المتصفح تلقائيا بعد لحظات.
echo.

start "Training Intelligence Preview" cmd /k "corepack pnpm dlx vite@5.4.21 --host 127.0.0.1 --port 8025 training-intelligence-preview"
timeout /t 5 /nobreak >nul
start "" "http://localhost:8025"
