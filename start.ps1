Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Starting Queen Clozet Dev Server & Opening Browser" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path "node_modules")) {
    Write-Host "node_modules directory not found. Installing dependencies..." -ForegroundColor Yellow
    npm.cmd install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies." -ForegroundColor Red
        exit $LASTEXITCODE
    }
}

Write-Host "Starting development server..." -ForegroundColor Green
npm.cmd run start
