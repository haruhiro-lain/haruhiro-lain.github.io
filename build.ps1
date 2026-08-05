param(
    [switch]$NoPush,
    [switch]$ForceBuild,
    [switch]$ForcePush,
    [switch]$CheckEncoding,
    [switch]$UseUtf8Console,
    [int]$PushRetries = 3,
    [int]$RemoteCheckTimeoutSec = 20,
    [int]$HealthCheckRetries = 12,
    [int]$HealthCheckIntervalSec = 5,
    [string[]]$RegistryMirrors = @(
        "docker.1ms.run",
        "docker.m.daocloud.io",
        "dockerproxy.com"
    )
)
# 项目主体位于 app/ 子目录，此脚本作为根目录入口。
$projectRoot = Join-Path $PSScriptRoot "app"

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
    docker pull $Image | Out-Host
    if ($LASTEXITCODE -eq 0) {
        return $true
    }

    Write-Host "       Docker Hub 拉取失败，尝试镜像源..." -ForegroundColor DarkYellow
    foreach ($candidate in (Get-MirrorImageCandidates -Image $Image)) {
        Write-Host "       尝试 ${candidate}..." -ForegroundColor Gray
        docker pull $candidate | Out-Host
        if ($LASTEXITCODE -eq 0) {
            docker tag $candidate $Image | Out-Host
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
        # 立即异步读取两个输出流，避免输出缓冲区写满后进程与 WaitForExit 互相等待。
        $stdoutTask = $process.StandardOutput.ReadToEndAsync()
        $stderrTask = $process.StandardError.ReadToEndAsync()
        if (-not $process.WaitForExit($TimeoutSeconds * 1000)) {
            $process.Kill()
            $process.WaitForExit()
            return 124
        }

        [void]$stdoutTask.Result
        [void]$stderrTask.Result
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
    $gitFiles = @(git -C $Root -c core.quotepath=false ls-files -co --exclude-standard 2>$null)
    if ($LASTEXITCODE -ne 0) {
        throw "Git 文件列表读取失败，无法计算可靠的源码指纹。"
    }

    $files = @($gitFiles |
        ForEach-Object { $_ -replace '\\', '/' } |
        Where-Object { $_ -and ($_ -notmatch $ignoredPathPattern) } |
        Sort-Object)

    if ($files.Count -eq 0) {
        throw "源码文件列表为空，拒绝生成空指纹。"
    }

    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        $hashedFileCount = 0
        foreach ($relativePath in $files) {
            $relativeFsPath = $relativePath -replace '/', [System.IO.Path]::DirectorySeparatorChar
            $fullPath = [System.IO.Path]::GetFullPath((Join-Path $Root $relativeFsPath))
            if ([System.IO.File]::Exists($fullPath)) {
                $contentBytes = [System.IO.File]::ReadAllBytes($fullPath)
            }
            else {
                # Git 仍会列出工作区中待删除的跟踪文件；删除标记也必须进入指纹。
                $contentBytes = [System.Text.Encoding]::UTF8.GetBytes("<deleted>")
            }

            $pathBytes = [System.Text.Encoding]::UTF8.GetBytes("${relativePath}`n")
            [void]$sha.TransformBlock($pathBytes, 0, $pathBytes.Length, $null, 0)

            [void]$sha.TransformBlock($contentBytes, 0, $contentBytes.Length, $null, 0)

            $separator = [System.Text.Encoding]::UTF8.GetBytes("`n")
            [void]$sha.TransformBlock($separator, 0, $separator.Length, $null, 0)
            $hashedFileCount++
        }

        if ($hashedFileCount -eq 0) {
            throw "没有可读取的源码文件，拒绝生成空指纹。"
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
        docker push $Image | Out-Host
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

function Test-HttpHealth {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Uri,
        [int]$Retries = 12,
        [int]$IntervalSeconds = 5
    )

    for ($attempt = 1; $attempt -le $Retries; $attempt++) {
        try {
            $response = Invoke-WebRequest -Uri $Uri -TimeoutSec 10 -UseBasicParsing
            if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) {
                Write-Host "       HTTP 状态码：$($response.StatusCode)" -ForegroundColor Gray
                return $true
            }
        }
        catch {
            Write-Host "       健康检查未通过（第 ${attempt}/${Retries} 次）。" -ForegroundColor Gray
        }

        if ($attempt -lt $Retries) {
            Start-Sleep -Seconds $IntervalSeconds
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

Write-Host "`n[1/9] 正在检查 Docker 和 Git..." -ForegroundColor Yellow
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "       未找到 Git，部署已中止。" -ForegroundColor Red
    exit 1
}
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "       未找到 Docker CLI，部署已中止。" -ForegroundColor Red
    exit 1
}
git -C $projectRoot rev-parse --is-inside-work-tree 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "       当前项目不是有效的 Git 工作区，部署已中止。" -ForegroundColor Red
    exit 1
}
if (-not (Test-DockerDaemon)) {
    Write-Host "       Docker Engine 未运行，部署已中止。" -ForegroundColor Red
    Write-Host "       请启动 Docker Desktop 后重试：.\build.ps1" -ForegroundColor Gray
    Write-Host "       如已启动，请检查：docker context use desktop-linux" -ForegroundColor Gray
    exit 1
}
Write-Host "       Docker 和 Git 检查通过。" -ForegroundColor Green

Write-Host "`n[2/9] 正在计算源码指纹..." -ForegroundColor Yellow
try {
    $sourceHash = Get-SourceFingerprint -Root $projectRoot
}
catch {
    Write-Host "       源码指纹计算失败：$_" -ForegroundColor Red
    exit 1
}
$localContentTag = "${imageName}:${sourceHash}"
$latestTag = "${imageName}:latest"
$remoteContentTag = "${dockerHubUser}/${imageName}:${sourceHash}"
$remoteLatestTag = "${dockerHubUser}/${imageName}:latest"
Write-Host "       源码指纹：${sourceHash}" -ForegroundColor Green

Write-Host "`n[3/9] 正在检查基础镜像..." -ForegroundColor Yellow
$nodeExists = Test-LocalImage -Image "node:22-alpine"
$nginxExists = Test-LocalImage -Image "nginx:alpine"
if (-not $nodeExists -or -not $nginxExists) {
    $pullNodeOk = $nodeExists
    $pullNginxOk = $nginxExists
    if (-not $nodeExists) {
        $pullNodeOk = Pull-ImageWithFallback -Image "node:22-alpine"
    }
    if (-not $nginxExists) {
        $pullNginxOk = Pull-ImageWithFallback -Image "nginx:alpine"
    }
    if (-not $pullNodeOk -or -not $pullNginxOk) {
        Write-Host "       Docker Hub 和已配置镜像源均不可达，部署已中止。" -ForegroundColor Red
        Write-Host '.\build.ps1 -RegistryMirrors docker.1ms.run,mirror.example.com' -ForegroundColor Gray
        exit 1
    }
}
Write-Host "       基础镜像已就绪。" -ForegroundColor Green

Write-Host "`n[4/9] 正在检查或构建本地镜像..." -ForegroundColor Yellow
if ((Test-LocalImage -Image $localContentTag) -and -not $ForceBuild) {
    Write-Host "       当前源码对应的镜像已存在，跳过构建。" -ForegroundColor Yellow
    docker tag $localContentTag $latestTag
    if ($LASTEXITCODE -ne 0) {
        Write-Host "       本地 latest 标签更新失败，部署已中止。" -ForegroundColor Red
        exit $LASTEXITCODE
    }
}
else {
    $buildArguments = @("build")
    if ($ForceBuild) {
        $buildArguments += "--pull"
    }
    $buildArguments += @(
        "--label", "org.opencontainers.image.revision=${sourceHash}",
        "-t", $localContentTag,
        "-t", $latestTag,
        "-f", (Join-Path $PSScriptRoot "docker\Dockerfile"),
        $PSScriptRoot
    )
    & docker @buildArguments
    if ($LASTEXITCODE -ne 0) {
        Write-Host "       镜像构建失败；旧容器未受影响。" -ForegroundColor Red
        exit $LASTEXITCODE
    }
}
if (-not (Test-LocalImage -Image $localContentTag)) {
    Write-Host "       构建后的镜像检查失败；旧容器未受影响。" -ForegroundColor Red
    exit 1
}
Write-Host "       本地构建成功：${localContentTag}" -ForegroundColor Green

Write-Host "`n[5/9] 正在发布 Docker Hub 镜像..." -ForegroundColor Yellow
$dockerHubStatus = "已跳过（-NoPush）"
if ($NoPush) {
    Write-Host "       已跳过 Docker Hub 推送（-NoPush）。" -ForegroundColor Gray
}
else {
    docker tag $localContentTag $remoteContentTag
    if ($LASTEXITCODE -ne 0) {
        Write-Host "       远端指纹标签创建失败，部署已中止。" -ForegroundColor Red
        exit $LASTEXITCODE
    }
    docker tag $localContentTag $remoteLatestTag
    if ($LASTEXITCODE -ne 0) {
        Write-Host "       远端 latest 标签创建失败，部署已中止。" -ForegroundColor Red
        exit $LASTEXITCODE
    }

    $remoteContentExists = $false
    if (-not $ForcePush) {
        $remoteContentExists = Test-RemoteImage -Image $remoteContentTag -TimeoutSeconds $RemoteCheckTimeoutSec
    }
    if ($remoteContentExists) {
        Write-Host "       远端指纹标签已存在，跳过该标签推送。" -ForegroundColor Yellow
    }
    elseif (-not (Push-ImageWithRetry -Image $remoteContentTag -Retries $PushRetries)) {
        Write-Host "       指纹标签推送失败；远程发布已中止，旧容器未受影响。" -ForegroundColor Red
        exit 1
    }

    # 即使指纹标签已存在，也始终更新 latest，供 NAS 等环境拉取当前版本。
    if (-not (Push-ImageWithRetry -Image $remoteLatestTag -Retries $PushRetries)) {
        Write-Host "       latest 推送失败；远程发布已中止，旧容器未受影响。" -ForegroundColor Red
        exit 1
    }
    $dockerHubStatus = "成功（${remoteLatestTag} -> ${sourceHash}）"
    Write-Host "       Docker Hub 推送成功：${remoteLatestTag}" -ForegroundColor Green
}

Write-Host "`n[6/9] 正在替换本地容器..." -ForegroundColor Yellow
$exactNameFilter = 'name=^/{0}$' -f [Regex]::Escape($containerName)
$existingContainer = @(docker ps -a -q --filter $exactNameFilter 2>$null)
if ($LASTEXITCODE -ne 0) {
    Write-Host "       旧容器检查失败，部署已中止。" -ForegroundColor Red
    exit $LASTEXITCODE
}
if ($existingContainer.Count -gt 0) {
    docker stop $containerName | Out-Host
    if ($LASTEXITCODE -ne 0) {
        Write-Host "       旧容器停止失败，部署已中止。" -ForegroundColor Red
        exit $LASTEXITCODE
    }
    docker rm $containerName | Out-Host
    if ($LASTEXITCODE -ne 0) {
        Write-Host "       旧容器删除失败，部署已中止。" -ForegroundColor Red
        exit $LASTEXITCODE
    }
    Write-Host "       旧容器已停止并删除。" -ForegroundColor Gray
}
else {
    Write-Host "       没有同名旧容器需要清理。" -ForegroundColor Gray
}

docker run -d `
    --name $containerName `
    -p "${hostPort}:80" `
    --restart unless-stopped `
    $localContentTag | Out-Host
if ($LASTEXITCODE -ne 0) {
    Write-Host "       新容器启动失败，部署未完成。" -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "       本地容器启动成功。" -ForegroundColor Green

Write-Host "`n[7/9] 正在执行 HTTP 健康检查..." -ForegroundColor Yellow
$healthUrl = "http://localhost:${hostPort}/"
if (-not (Test-HttpHealth -Uri $healthUrl -Retries $HealthCheckRetries -IntervalSeconds $HealthCheckIntervalSec)) {
    Write-Host "       HTTP 健康检查失败，部署未完成。" -ForegroundColor Red
    Write-Host "       请检查：docker logs ${containerName}" -ForegroundColor Gray
    exit 1
}
Write-Host "       HTTP 健康检查通过。" -ForegroundColor Green

Write-Host "`n[8/9] 正在处理 Cloudflare 缓存..." -ForegroundColor Yellow
$cfToken = $env:CF_API_TOKEN
$cfZone = $env:CF_ZONE_ID
$siteUrl = $env:SITE_URL
$cloudflareStatus = "已跳过（环境变量未完整设置）"
if ($cfToken -and $cfZone -and $siteUrl) {
    $headers = @{ "Authorization" = "Bearer $cfToken"; "Content-Type" = "application/json" }
    $body = '{"purge_everything":true}'
    try {
        $purgeResult = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$cfZone/purge_cache" `
            -Method Post -Headers $headers -Body $body -TimeoutSec 10
        if (-not $purgeResult.success) {
            throw "Cloudflare API 返回 success=false"
        }
        Write-Host "       Cloudflare 缓存清理完成。" -ForegroundColor Green

        $warmUrls = @(
            "$siteUrl/",
            "$siteUrl/learning/",
            "$siteUrl/life/",
            "$siteUrl/archives",
            "$siteUrl/about"
        )
        $warmFailureCount = 0
        foreach ($url in $warmUrls) {
            try {
                $null = Invoke-WebRequest -Uri $url -TimeoutSec 10 -UseBasicParsing
            }
            catch {
                $warmFailureCount++
            }
        }
        if ($warmFailureCount -eq 0) {
            $cloudflareStatus = "缓存清理及预热完成"
            Write-Host "       Cloudflare 缓存预热完成。" -ForegroundColor Green
        }
        else {
            $cloudflareStatus = "缓存已清理，${warmFailureCount} 个地址预热失败"
            Write-Host "       ${warmFailureCount} 个地址预热失败。" -ForegroundColor DarkYellow
        }
    }
    catch {
        $cloudflareStatus = "处理失败：$($_.Exception.Message)"
        Write-Host "       Cloudflare 缓存处理失败：$_" -ForegroundColor DarkYellow
    }
}
else {
    Write-Host "       已跳过 Cloudflare（未设置 CF_API_TOKEN、CF_ZONE_ID、SITE_URL）。" -ForegroundColor Gray
}

Write-Host "`n[9/9] 部署完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  本地构建：成功（${localContentTag}）" -ForegroundColor Green
Write-Host "  Docker Hub：${dockerHubStatus}" -ForegroundColor $(if ($NoPush) { "Gray" } else { "Green" })
Write-Host "  本地容器：启动成功" -ForegroundColor Green
Write-Host "  HTTP 健康检查：通过" -ForegroundColor Green
Write-Host "  Cloudflare：${cloudflareStatus}" -ForegroundColor Gray
Write-Host "  访问地址：http://localhost:${hostPort}" -ForegroundColor White
Write-Host "  停止容器：docker stop ${containerName}" -ForegroundColor Gray
Write-Host "  查看日志：docker logs ${containerName}" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan
