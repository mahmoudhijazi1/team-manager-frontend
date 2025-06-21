@echo off
echo === TeamManager Setup ===
echo.

echo Starting Laravel API server...
start "Laravel API" cmd /k "cd /d ..\team-manager && php artisan serve --port=9010"

timeout /t 3 /nobreak > nul

echo Starting Angular development server...
start "Angular Frontend" cmd /k "ng serve --port=4200"

echo.
echo 🚀 Servers started!
echo 📊 Laravel API: http://localhost:9010/api
echo 🎨 Angular App: http://localhost:4200
echo.
echo Both servers are running in separate windows.
echo Close the command windows to stop the servers.
echo.
pause