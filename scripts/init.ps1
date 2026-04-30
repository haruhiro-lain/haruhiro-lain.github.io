# 1. 初始化
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
Clear-Host

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Astro 自动化部署 (Git 稳健版)   " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 2. 代理设置
$ProxyPort = Read-Host "请输入代理端口 (如 10811，若不使用请直接回车)"
if ($ProxyPort) {
    $ProxyUrl = "http://127.0.0.1:$ProxyPort"
    $env:HTTP_PROXY = $ProxyUrl
    $env:HTTPS_PROXY = $ProxyUrl
    # 让 Git 也使用这个代理
    git config --global http.proxy $ProxyUrl
    git config --global https.proxy $ProxyUrl
    Write-Host "🚀 代理已同步至环境变量与 Git" -ForegroundColor Magenta
}

$ProjectName = "Astro-Blog"

# --- 步骤 1: 检查环境 ---
Write-Host "`n[1/4] 正在检查环境..." -ForegroundColor Yellow
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 未检测到 Git，请先安装 Git 客户端。" -ForegroundColor Red
    exit
}

# --- 步骤 2: 使用 Git 直接克隆官方模板 ---
Write-Host "`n[2/4] 正在通过 Git 克隆官方博客模板..." -ForegroundColor Yellow

# 如果文件夹已存在，先删除（防止冲突）
if (Test-Path $ProjectName) { Remove-Item -Recurse -Force $ProjectName }

# 只克隆 astro 仓库中的 blog 示例部分 (使用 sparse-checkout 提高速度)
try {
    git clone --depth 1 --filter=blob:none --sparse https://github.com/withastro/astro.git $ProjectName
    Push-Location $ProjectName
    git sparse-checkout set examples/blog
    # 移动文件到根目录
    Move-Item -Path "examples/blog/*" -Destination "." -Force
    Remove-Item -Path "examples" -Recurse -Force
    Pop-Location
    Write-Host "✅ 模板下载成功！" -ForegroundColor Green
} catch {
    Write-Host "❌ Git 克隆失败，请检查网络。" -ForegroundColor Red
    exit
}

# --- 步骤 3: 安装依赖与插件 ---
Set-Location $ProjectName
Write-Host "`n[3/4] 正在安装 Node.js 依赖与 Astro 插件..." -ForegroundColor Yellow

# 执行安装
npm install
npm install -D knip
npx astro add sitemap mdx tailwind --yes

# --- 步骤 4: 初始化目录 ---
Write-Host "`n[4/4] 正在初始化内容集合目录..." -ForegroundColor Yellow
$Folders = @("src/content/projects", "src/content/interview", "src/content/algorithms", "src/content/life")
foreach ($folder in $Folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        Write-Host "  + 已新建: ${folder}" -ForegroundColor Gray
    }
}

# --- 结束 ---
# 运行结束后清理 Git 代理配置（可选，如果你平时不需要它全局走代理）
git config --global --unset http.proxy
git config --global --unset https.proxy

Write-Host "`n✅ 全部就绪！" -ForegroundColor Green
# code .