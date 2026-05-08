$projectRoot = $PSScriptRoot

# Force UTF-8 encoding for console and pipeline output.
& chcp 65001 | Out-Null
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[Console]::InputEncoding = $utf8NoBom
[Console]::OutputEncoding = $utf8NoBom
$OutputEncoding = $utf8NoBom

$mutexName = "Local\AstroBlog.DevWithSync"
$createdNew = $false
$mutex = [System.Threading.Mutex]::new($true, $mutexName, [ref]$createdNew)

if (-not $createdNew) {
	Write-Warning "Another start.ps1 instance is already running. Stop it before starting a new one."
	exit 1
}

try {
	& node (Join-Path $projectRoot "scripts\dev-with-sync.mjs")
	exit $LASTEXITCODE
}
finally {
	$mutex.ReleaseMutex()
	$mutex.Dispose()
}
