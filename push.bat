@echo off
REM Simple Git Push Script
REM Usage: push.bat "your commit message"

setlocal enabledelayedexpansion

if "%1"=="" (
    set message=Update files
) else (
    set message=%1
)

git add .
git commit -m "!message!"
git push

echo.
echo Push to GitHub complete!
pause
