param(
    [switch]$All,
    [switch]$NoPush,
    [switch]$ForceBuild,
    [switch]$ForcePush,
    [switch]$CheckEncoding,
    [switch]$UseUtf8Console,
    [int]$PushRetries = 3,
    [int]$RemoteCheckTimeoutSec = 20,
    [string[]]$RegistryMirrors = @(
        "docker.1ms.run",
        "docker.m.daocloud.io",
        "dockerproxy.com"
    )
)
$projectRoot = $PSScriptRoot

# Windows PowerShell 5.1 的控制台常用系统默认编码，强制 UTF-8 反而可能乱码。
if ($UseUtf8Console) {
    $consoleEncoding = [System.Text.UTF8Encoding]::new($false)
}
else {
    $consoleEncoding = [System.Text.Encoding]::Default
}
[Console]::InputEncoding = $consoleEncoding
[Console]::OutputEncoding = $consoleEncoding
$OutputEncoding = $consoleEncoding

$imageName = "astro-blog"
$containerName = "astro-blog"
$hostPort = 18080
$dockerHubUser = "haruhirolain"  # Docker Hub 用户名

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

        # Docker Hub 官方镜像在 Registry API 中也可以通过 library/* 访问。
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

    Write-Host "       正在拉取 ${Image}..." -ForegroundColor Gray
    docker pull $Image
    if ($LASTEXITCODE -eq 0) {
        return $true
    }

    Write-Host "       Docker Hub 拉取失败，尝试镜像源..." -ForegroundColor DarkYellow
    foreach ($candidate in (Get-MirrorImageCandidates -Image $Image)) {
        Write-Host "       尝试 ${candidate}..." -ForegroundColor Gray
        docker pull $candidate
        if ($LASTEXITCODE -eq 0) {
            docker tag $candidate $Image
            if ($LASTEXITCODE -eq 0) {
                Write-Host "       已将 ${candidate} 标记为 ${Image}。" -ForegroundColor Green
                return $true
            }
        }
    }

    return $false
}

function Test-DockerDaemon {
    docker info 2>$null | Out-Null
    return ($LASTEXITCODE -eq 0)
}

function Test-LocalImage {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Image
    )

    docker image inspect $Image 2>$null | Out-Null
    return ($LASTEXITCODE -eq 0)
}

function Join-ProcessArguments {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Arguments
    )

    return (($Arguments | ForEach-Object {
        if ($_ -match '[\s"]') {
            '"' + ($_ -replace '"', '\"') + '"'
        }
        else {
            $_
        }
    }) -join " ")
}

function Invoke-DockerQuiet {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Arguments,
        [int]$TimeoutSeconds = 20
    )

    $processInfo = [System.Diagnostics.ProcessStartInfo]::new()
    $processInfo.FileName = "docker"
    $processInfo.UseShellExecute = $false
    $processInfo.RedirectStandardOutput = $true
    $processInfo.RedirectStandardError = $true
    $processInfo.CreateNoWindow = $true
    $processInfo.Arguments = Join-ProcessArguments -Arguments $Arguments

    $process = [System.Diagnostics.Process]::Start($processInfo)
    try {
        if (-not $process.WaitForExit($TimeoutSeconds * 1000)) {
            $process.Kill()
            return 124
        }

        return $process.ExitCode
    }
    finally {
        $process.Dispose()
    }
}

function Test-RemoteImage {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Image,
        [int]$TimeoutSeconds = 20
    )

    Write-Host "       正在检查远端镜像：${Image}" -ForegroundColor Gray
    $exitCode = Invoke-DockerQuiet -Arguments @("manifest", "inspect", $Image) -TimeoutSeconds $TimeoutSeconds
    if ($exitCode -eq 124) {
        Write-Host "       远端镜像检查超时，继续执行推送。" -ForegroundColor DarkYellow
        return $false
    }

    return ($exitCode -eq 0)
}

function Get-SourceFingerprint {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Root
    )

    $ignoredPathPattern = '^(node_modules|dist|TEMP|\.git|\.astro|\.idea|\.vscode)(/|$)|^(build|run)\.ps1$'
    $files = git -C $Root -c core.quotepath=false ls-files -co --exclude-standard |
        ForEach-Object { $_ -replace '\\', '/' } |
        Where-Object { $_ -and ($_ -notmatch $ignoredPathPattern) } |
        Sort-Object

    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        foreach ($relativePath in $files) {
            try {
                $relativeFsPath = $relativePath -replace '/', [System.IO.Path]::DirectorySeparatorChar
                $fullPath = [System.IO.Path]::GetFullPath((Join-Path $Root $relativeFsPath))
                if (-not [System.IO.File]::Exists($fullPath)) {
                    continue
                }

                $contentBytes = [System.IO.File]::ReadAllBytes($fullPath)
            }
            catch {
                Write-Host "       跳过无法读取的指纹路径：${relativePath}" -ForegroundColor DarkYellow
                continue
            }

            $pathBytes = [System.Text.Encoding]::UTF8.GetBytes("${relativePath}`n")
            [void]$sha.TransformBlock($pathBytes, 0, $pathBytes.Length, $null, 0)

            [void]$sha.TransformBlock($contentBytes, 0, $contentBytes.Length, $null, 0)

            $separator = [System.Text.Encoding]::UTF8.GetBytes("`n")
            [void]$sha.TransformBlock($separator, 0, $separator.Length, $null, 0)
        }

        [void]$sha.TransformFinalBlock([byte[]]::new(0), 0, 0)
        return (($sha.Hash | ForEach-Object { $_.ToString("x2") }) -join "").Substring(0, 12)
    }
    finally {
        $sha.Dispose()
    }
}

function Push-ImageWithRetry {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Image,
        [int]$Retries = 3
    )

    for ($attempt = 1; $attempt -le $Retries; $attempt++) {
        Write-Host "       正在推送 ${Image}（第 ${attempt}/${Retries} 次）..." -ForegroundColor Gray
        docker push $Image
        if ($LASTEXITCODE -eq 0) {
            return $true
        }

        if ($attempt -lt $Retries) {
            $delay = [Math]::Min(20, 5 * $attempt)
            Write-Host "       推送失败，${delay} 秒后重试..." -ForegroundColor DarkYellow
            Start-Sleep -Seconds $delay
        }
    }

    return $false
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Astro 博客 - Docker 构建与运行" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($CheckEncoding) {
    Write-Host ""
    Write-Host "编码自检：中文输出正常。" -ForegroundColor Green
    Write-Host "当前控制台输入编码：$([Console]::InputEncoding.WebName)" -ForegroundColor Gray
    Write-Host "当前控制台输出编码：$([Console]::OutputEncoding.WebName)" -ForegroundColor Gray
    exit 0
}

if (-not (Test-DockerDaemon)) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  Docker Engine 未运行。" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Docker CLI 无法连接到 Docker Desktop Linux Engine：" -ForegroundColor Yellow
    Write-Host "  npipe:////./pipe/dockerDesktopLinuxEngine" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  请启动 Docker Desktop，并等待状态显示为 Engine running。" -ForegroundColor Gray
    Write-Host "  然后重试：" -ForegroundColor Gray
    Write-Host "     .\build.ps1 -all" -ForegroundColor DarkYellow
    Write-Host ""
    Write-Host "  如果 Docker Desktop 已经打开，请检查当前 Docker context：" -ForegroundColor Gray
    Write-Host "     docker context ls" -ForegroundColor DarkYellow
    Write-Host "     docker context use desktop-linux" -ForegroundColor DarkYellow
    Write-Host ""
    exit 1
}

# 1. 停止并删除旧容器（如果存在）
$existing = docker ps -a -q -f "name=$containerName" 2>$null
if ($existing) {
    Write-Host "`n[1/7] 正在停止并删除旧容器..." -ForegroundColor Yellow
    docker stop $containerName 2>$null | Out-Null
    docker rm $containerName 2>$null | Out-Null
    Write-Host "       旧容器已清理。" -ForegroundColor Green
}
else {
    Write-Host "`n[1/4] 没有需要清理的旧容器。" -ForegroundColor Gray
}

# 2. 确认基础镜像已在本地缓存
Write-Host "`n[2/5] 正在检查基础镜像..." -ForegroundColor Yellow
$nodeExists = docker images -q node:22-alpine 2>$null
$nginxExists = docker images -q nginx:alpine 2>$null
if (-not $nodeExists -or -not $nginxExists) {
    Write-Host "       基础镜像缺失，开始拉取..." -ForegroundColor Gray
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
        Write-Host "  基础镜像拉取失败。" -ForegroundColor Red
        Write-Host "  Docker Hub 和已配置镜像源均不可达。" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        Write-Host ""
        Write-Host "  可尝试：" -ForegroundColor Yellow
        Write-Host "  1. 检查 Clash Verge：确认 Allow LAN 已开启。" -ForegroundColor Gray
        Write-Host "  2. 检查 Clash Verge：切换到可访问 Docker Hub 的节点。" -ForegroundColor Gray
        Write-Host "  3. 或在执行脚本时传入其他镜像源：" -ForegroundColor Gray
        Write-Host '.\build.ps1 -all -RegistryMirrors docker.1ms.run,mirror.example.com' -ForegroundColor DarkYellow
        Write-Host "  4. 或在 Docker Engine 设置中添加 registry mirror：" -ForegroundColor Gray
        Write-Host '     "registry-mirrors": ["https://docker.1ms.run"]' -ForegroundColor DarkYellow
        Write-Host ""
        exit 1
    }
}
Write-Host "       基础镜像已就绪。" -ForegroundColor Green

$sourceHash = Get-SourceFingerprint -Root $projectRoot
$localContentTag = "${imageName}:${sourceHash}"
$latestTag = "${imageName}:latest"
$remoteContentTag = "${dockerHubUser}/${imageName}:${sourceHash}"
$remoteLatestTag = "${dockerHubUser}/${imageName}:latest"
Write-Host "       源码指纹：${sourceHash}" -ForegroundColor Gray

# 3. 构建镜像
if ((Test-LocalImage -Image $localContentTag) -and -not $ForceBuild) {
    Write-Host "`n[3/5] 当前源码对应的镜像已存在，跳过构建。" -ForegroundColor Yellow
    docker tag $localContentTag $latestTag
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n将缓存镜像标记为 latest 失败，已中止。" -ForegroundColor Red
        exit $LASTEXITCODE
    }
}
else {
    Write-Host "`n[3/5] 正在构建 Docker 镜像..." -ForegroundColor Yellow
    docker build `
        --label "org.opencontainers.image.revision=${sourceHash}" `
        -t $localContentTag `
        -t $latestTag `
        -f (Join-Path $projectRoot "docker\Dockerfile") `
        $projectRoot
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n构建失败，已中止。" -ForegroundColor Red
        exit $LASTEXITCODE
    }
    Write-Host "       镜像构建成功。" -ForegroundColor Green
}

# 4. 推送到 Docker Hub
if ($NoPush) {
    Write-Host "`n[4/7] 已跳过 Docker Hub 推送（-NoPush）。" -ForegroundColor Gray
}
elseif ((-not $ForcePush) -and (Test-RemoteImage -Image $remoteContentTag -TimeoutSeconds $RemoteCheckTimeoutSec)) {
    Write-Host "`n[4/7] 远端镜像 ${remoteContentTag} 已存在，跳过推送。" -ForegroundColor Yellow
}
else {
    Write-Host "`n[4/7] 正在推送到 Docker Hub..." -ForegroundColor Yellow
    docker tag $localContentTag $remoteContentTag
    docker tag $localContentTag $remoteLatestTag

    Write-Host "       内容标签：${remoteContentTag}" -ForegroundColor Gray
    $contentPushOk = Push-ImageWithRetry -Image $remoteContentTag -Retries $PushRetries
    $latestPushOk = $false
    if ($contentPushOk) {
        Write-Host "       最新标签：${remoteLatestTag}" -ForegroundColor Gray
        $latestPushOk = Push-ImageWithRetry -Image $remoteLatestTag -Retries $PushRetries
    }

    if (-not $contentPushOk -or -not $latestPushOk) {
        Write-Host "       推送失败（可能未登录或网络异常）。" -ForegroundColor DarkYellow
        Write-Host "       请执行：docker login，然后重试推送 ${remoteContentTag} 和 ${remoteLatestTag}" -ForegroundColor Gray
    }
    else {
        Write-Host "       已推送：${remoteContentTag}" -ForegroundColor Green
        Write-Host "       已推送：${remoteLatestTag}" -ForegroundColor Green
    }
}

# 5. 启动容器
Write-Host "`n[5/7] 正在启动容器..." -ForegroundColor Yellow
docker run -d `
    --name $containerName `
    -p "${hostPort}:80" `
    --restart unless-stopped `
    "${imageName}:latest"
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n容器启动失败，已中止。" -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "       容器已启动。" -ForegroundColor Green

# 6. 清理 Cloudflare 缓存并预热
$cfToken = $env:CF_API_TOKEN
$cfZone = $env:CF_ZONE_ID
$siteUrl = $env:SITE_URL
if ($cfToken -and $cfZone -and $siteUrl) {
    Write-Host "`n[6/7] 正在清理 Cloudflare 缓存..." -ForegroundColor Yellow
    $headers = @{ "Authorization" = "Bearer $cfToken"; "Content-Type" = "application/json" }
    $body = '{"purge_everything":true}'
    try {
        Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$cfZone/purge_cache" `
            -Method Post -Headers $headers -Body $body -TimeoutSec 10 | Out-Null
        Write-Host "       缓存已清理。" -ForegroundColor Green
    }
    catch {
        Write-Host "       缓存清理失败：$_" -ForegroundColor DarkYellow
    }

    Write-Host "       正在预热缓存..." -ForegroundColor Yellow
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
    Write-Host "       缓存预热完成。" -ForegroundColor Green
}
else {
    Write-Host "`n[6/7] 已跳过 Cloudflare（未设置 CF_API_TOKEN、CF_ZONE_ID、SITE_URL 环境变量）。" -ForegroundColor Gray
}

# 7. 完成
Write-Host "`n[7/7] 部署完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  访问地址：http://localhost:${hostPort}" -ForegroundColor White
Write-Host "  停止容器：docker stop ${containerName}" -ForegroundColor Gray
Write-Host "  查看日志：docker logs ${containerName}" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan
