param(
    [switch]$All,
    [switch]$NoPush,
    [string[]]$RegistryMirrors = @(
        "docker.1ms.run",
        "docker.m.daocloud.io",
        "dockerproxy.com"
    )
)
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
$dockerHubUser = "haruhirolain"  # 改成你的 Docker Hub 用户名

function Get-MirrorImageCandidates {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Image
    )

    $candidates = New-Object System.Collections.Generic.List[string]
    foreach ($mirror in $RegistryMirrors) {
        $normalizedMirror = $mirror.Trim().TrimEnd("/")
        if (-not $normalizedMirror) {
            continue
        }

        $candidates.Add("${normalizedMirror}/${Image}")

        # Official Docker Hub images also live under library/* in the registry API.
        if ($Image -notmatch "/") {
            $candidates.Add("${normalizedMirror}/library/${Image}")
        }
    }

    return $candidates
}

function Pull-ImageWithFallback {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Image
    )

    Write-Host "       Pulling ${Image}..." -ForegroundColor Gray
    docker pull $Image
    if ($LASTEXITCODE -eq 0) {
        return $true
    }

    Write-Host "       Docker Hub pull failed, trying registry mirrors..." -ForegroundColor DarkYellow
    foreach ($candidate in (Get-MirrorImageCandidates -Image $Image)) {
        Write-Host "       Trying ${candidate}..." -ForegroundColor Gray
        docker pull $candidate
        if ($LASTEXITCODE -eq 0) {
            docker tag $candidate $Image
            if ($LASTEXITCODE -eq 0) {
                Write-Host "       Tagged ${candidate} as ${Image}." -ForegroundColor Green
                return $true
            }
        }
    }

    return $false
}
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Astro Blog - Docker Build & Run" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Stop and remove old container (if exists)
$existing = docker ps -a -q -f "name=$containerName" 2>$null
if ($existing) {
    Write-Host "`n[1/7] Stopping and removing old container..." -ForegroundColor Yellow
    docker stop $containerName 2>$null | Out-Null
    docker rm $containerName 2>$null | Out-Null
    Write-Host "       Old container cleaned." -ForegroundColor Green
}
else {
    Write-Host "`n[1/4] No old container to clean." -ForegroundColor Gray
}

# 2. Ensure base images are cached locally
Write-Host "`n[2/5] Checking base images..." -ForegroundColor Yellow
$nodeExists = docker images -q node:22-alpine 2>$null
$nginxExists = docker images -q nginx:alpine 2>$null
if (-not $nodeExists -or -not $nginxExists) {
    Write-Host "       Base images missing, pulling..." -ForegroundColor Gray
    $pullNodeOk = $true
    $pullNginxOk = $true
    if (-not $nodeExists) {
        $pullNodeOk = Pull-ImageWithFallback -Image "node:22-alpine"
    }
    if (-not $nginxExists) {
        $pullNginxOk = Pull-ImageWithFallback -Image "nginx:alpine"
    }
    if (-not $pullNodeOk -or -not $pullNginxOk) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "  Failed to pull base images." -ForegroundColor Red
        Write-Host "  Docker Hub and configured mirrors are unreachable." -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        Write-Host ""
        Write-Host "  Possible solutions:" -ForegroundColor Yellow
        Write-Host "  1. Check Clash Verge: make sure Allow LAN is ON" -ForegroundColor Gray
        Write-Host "  2. Check Clash Verge: switch to a node that can reach Docker Hub" -ForegroundColor Gray
        Write-Host "  3. Or pass another mirror to this script:" -ForegroundColor Gray
        Write-Host '.\run.ps1 -all -RegistryMirrors docker.1ms.run,mirror.example.com' -ForegroundColor DarkYellow
        Write-Host "  4. Or add a registry mirror to Docker Engine settings:" -ForegroundColor Gray
        Write-Host '     "registry-mirrors": ["https://docker.1ms.run"]' -ForegroundColor DarkYellow
        Write-Host ""
        exit 1
    }
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

# 4. Push to Docker Hub
if ($NoPush) {
    Write-Host "`n[4/7] Skipping Docker Hub push (-NoPush)." -ForegroundColor Gray
}
else {
    Write-Host "`n[4/7] Pushing to Docker Hub..." -ForegroundColor Yellow
    $remoteTag = "${dockerHubUser}/${imageName}:latest"
    docker tag "${imageName}:latest" $remoteTag
    docker push $remoteTag
    if ($LASTEXITCODE -ne 0) {
        Write-Host "       Push failed (not logged in or network issue)." -ForegroundColor DarkYellow
        Write-Host "       Run: docker login && docker push ${remoteTag}" -ForegroundColor Gray
    }
    else {
        Write-Host "       Pushed: ${remoteTag}" -ForegroundColor Green
    }
}

# 5. Run container
Write-Host "`n[5/7] Starting container..." -ForegroundColor Yellow
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

# 6. Purge Cloudflare cache + warm up
$cfToken = $env:CF_API_TOKEN
$cfZone = $env:CF_ZONE_ID
$siteUrl = $env:SITE_URL
if ($cfToken -and $cfZone -and $siteUrl) {
    Write-Host "`n[6/7] Purging Cloudflare cache..." -ForegroundColor Yellow
    $headers = @{ "Authorization" = "Bearer $cfToken"; "Content-Type" = "application/json" }
    $body = '{"purge_everything":true}'
    try {
        Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$cfZone/purge_cache" `
            -Method Post -Headers $headers -Body $body -TimeoutSec 10 | Out-Null
        Write-Host "       Cache purged." -ForegroundColor Green
    }
    catch {
        Write-Host "       Purge failed: $_" -ForegroundColor DarkYellow
    }

    Write-Host "       Warming cache..." -ForegroundColor Yellow
    $warmUrls = @(
        "$siteUrl/",
        "$siteUrl/learning/",
        "$siteUrl/life/",
        "$siteUrl/archives",
        "$siteUrl/about"
    )
    foreach ($url in $warmUrls) {
        try {
            $null = Invoke-WebRequest -Uri $url -TimeoutSec 10 -UseBasicParsing
        }
        catch {}
    }
    Write-Host "       Cache warmed." -ForegroundColor Green
}
else {
    Write-Host "`n[6/7] Skipping Cloudflare (set CF_API_TOKEN, CF_ZONE_ID, SITE_URL env vars)." -ForegroundColor Gray
}

# 7. Done
Write-Host "`n[7/7] Deployment complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  URL: http://localhost:${hostPort}" -ForegroundColor White
Write-Host "  Stop: docker stop ${containerName}" -ForegroundColor Gray
Write-Host "  Logs: docker logs ${containerName}" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan
