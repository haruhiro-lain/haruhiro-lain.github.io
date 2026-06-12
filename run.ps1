$projectRoot = $PSScriptRoot

# Force UTF-8 encoding for console output.
& chcp 65001 | Out-Null
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[Console]::InputEncoding = $utf8NoBom
[Console]::OutputEncoding = $utf8NoBom
$OutputEncoding = $utf8NoBom

$imageName = "astro-blog"
$containerName = "astro-blog"
$hostPort = 18080

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Astro Blog - Docker Build & Run" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Stop and remove old container (if exists)
$existing = docker ps -a -q -f "name=$containerName" 2>$null
if ($existing) {
    Write-Host "`n[1/4] Stopping and removing old container..." -ForegroundColor Yellow
    docker stop $containerName 2>$null | Out-Null
    docker rm $containerName 2>$null | Out-Null
    Write-Host "       Old container cleaned." -ForegroundColor Green
}
else {
    Write-Host "`n[1/4] No old container to clean." -ForegroundColor Gray
}

# 2. Pre-pull base images (BuildKit needs them cached)
Write-Host "`n[2/5] Pulling base images..." -ForegroundColor Yellow
docker pull node:22-alpine 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nFailed to pull node:22-alpine, aborted." -ForegroundColor Red
    exit $LASTEXITCODE
}
docker pull nginx:alpine 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nFailed to pull nginx:alpine, aborted." -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "       Base images ready." -ForegroundColor Green

# 3. Build image
Write-Host "`n[3/5] Building Docker image..." -ForegroundColor Yellow
docker build -t "${imageName}:latest" -f (Join-Path $projectRoot "docker\Dockerfile") $projectRoot
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nBuild failed, aborted." -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "       Image built successfully." -ForegroundColor Green

# 4. Run container
Write-Host "`n[4/5] Starting container..." -ForegroundColor Yellow
docker run -d `
    --name $containerName `
    -p "${hostPort}:80" `
    --restart unless-stopped `
    "${imageName}:latest"
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nStart failed, aborted." -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "       Container started." -ForegroundColor Green

# 5. Done
Write-Host "`n[5/5] Deployment complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  URL: http://localhost:${hostPort}" -ForegroundColor White
Write-Host "  Stop: docker stop ${containerName}" -ForegroundColor Gray
Write-Host "  Logs: docker logs ${containerName}" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan
