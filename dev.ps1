# 项目主体位于 app/ 子目录，此脚本作为根目录入口。
$projectRoot = Join-Path $PSScriptRoot "app"

# Force UTF-8 encoding for console and pipeline output.
& chcp 65001 | Out-Null
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[Console]::InputEncoding = $utf8NoBom
[Console]::OutputEncoding = $utf8NoBom
$OutputEncoding = $utf8NoBom

# 启动前清理本项目的旧开发实例（dev-with-sync、astro dev、esbuild 服务进程），
# 避免端口占用 / 多实例并存。
function Stop-StaleDevProcesses {
    param(
        [Parameter(Mandatory = $true)]
        [string]$ProjectPath
    )

    $escaped = [regex]::Escape($ProjectPath)
    $stale = Get-CimInstance Win32_Process | Where-Object {
        $_.Name -in @('node.exe', 'esbuild.exe') -and
        $_.CommandLine -and
        $_.CommandLine -match $escaped -and
        $_.CommandLine -match 'dev-with-sync\.mjs|astro\.mjs\s+dev\b|@esbuild[\\/].*esbuild\.exe\s+--service'
    }

    if (-not $stale) {
        Write-Host "  未发现旧开发实例，直接启动。" -ForegroundColor Gray
        return
    }

    Write-Host "  发现 $($stale.Count) 个旧开发进程，正在停止..." -ForegroundColor Yellow
    foreach ($proc in $stale) {
        Stop-Process -Id $proc.ProcessId -Force -ErrorAction SilentlyContinue
        Write-Host "    已停止 PID $($proc.ProcessId) ($($proc.Name))" -ForegroundColor DarkYellow
    }
    Start-Sleep -Milliseconds 500
}

Write-Host "正在启动开发服务器..." -ForegroundColor Cyan
Stop-StaleDevProcesses -ProjectPath $PSScriptRoot

& node (Join-Path $projectRoot "scripts\dev-with-sync.mjs") @args
exit $LASTEXITCODE
