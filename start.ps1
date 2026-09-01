$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $projectRoot 'backend'
$frontend = Join-Path $projectRoot 'frontend'

Write-Host 'Preparing AI Trip Planner...' -ForegroundColor Cyan

if (-not (Get-Command py -ErrorAction SilentlyContinue)) {
    throw 'Python is required. Install Python 3.11 or 3.12 and run this script again.'
}
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { throw 'Node.js is required.' }
    npm install --global pnpm
}

$venv = Join-Path $backend '.venv'
if (-not (Test-Path (Join-Path $venv 'Scripts\python.exe'))) {
    py -m venv $venv
}
$python = Join-Path $venv 'Scripts\python.exe'
& $python -m pip install -r (Join-Path $backend 'requirements.txt')
pnpm --dir $frontend install

Write-Host 'Starting API at http://localhost:8000 and UI at http://localhost:5173' -ForegroundColor Green
Start-Process -FilePath $python -ArgumentList '-m','uvicorn','app.main:app','--reload','--host','127.0.0.1','--port','8000' -WorkingDirectory $backend -WindowStyle Hidden
pnpm --dir $frontend dev
