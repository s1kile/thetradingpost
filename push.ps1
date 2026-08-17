# Simple Git Push Script
# Usage: ./push.ps1 "your commit message"
# Or just: ./push.ps1 for default message

param(
    [string]$Message = "Update files"
)

# Stage all changes
git add .

# Commit with message
git commit -m $Message

# Push to GitHub
git push

Write-Host "✓ Changes pushed to GitHub!" -ForegroundColor Green
