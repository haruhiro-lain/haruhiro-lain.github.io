$projectRoot = $PSScriptRoot

# Force UTF-8 encoding for console and pipeline output.
& chcp 65001 | Out-Null
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[Console]::InputEncoding = $utf8NoBom
[Console]::OutputEncoding = $utf8NoBom
$OutputEncoding = $utf8NoBom

& node (Join-Path $projectRoot "scripts\dev-with-sync.mjs") @args
exit $LASTEXITCODE
