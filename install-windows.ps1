# Build Weft on Windows from source — one command. No Warp login, no account, no API keys.
#
#   irm https://raw.githubusercontent.com/black12-ag/weft/master/install-windows.ps1 | iex
#
# Run in PowerShell. Requires Git and Visual Studio Build Tools (the dep script installs the rest).
$ErrorActionPreference = "Stop"

# Weft's exact feature set — `skip_login` is what removes Warp's sign-in.
$FEATURES = "gui,skip_login,agent_mode,agent_harness,profiles_design_revamp"
$REPO = "https://github.com/black12-ag/weft"

Write-Host "==> Weft Windows builder"

# 1. Get the source (skip the clone if you're already inside the repo).
if ((Test-Path "Cargo.toml") -and (Test-Path "app")) {
  Write-Host "==> Using the current checkout"
} else {
  Write-Host "==> Cloning $REPO"
  git clone $REPO weft
  Set-Location weft
}

# 2. Build dependencies. Weft needs Rust + cargo deps, PLUS the native toolchain
#    (VS Build Tools, CMake, LLVM/libclang, protoc) — the same pieces Warp's
#    bootstrap installs. We install them directly (not via bootstrap.ps1, which
#    also does an interactive gcloud login Weft doesn't need).
Write-Host "==> Installing Rust + cargo build deps"
if (Test-Path "script/windows/install_build_deps.ps1") {
  powershell -ExecutionPolicy Bypass -File "script/windows/install_build_deps.ps1"
}

Write-Host "==> Installing native toolchain (VS Build Tools, CMake, LLVM, protoc) — this can take a while"
$wg = @('-e', '--accept-package-agreements', '--accept-source-agreements')
winget install @wg --id Microsoft.VisualStudio.2022.BuildTools --override '--passive --wait --norestart --add Microsoft.VisualStudio.Workload.VCTools --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64 --add Microsoft.VisualStudio.Component.Windows11SDK.22621 --includeRecommended'
winget install @wg --id Kitware.CMake
winget install @wg --id LLVM.LLVM
winget install @wg --id Google.Protobuf

# Pick up the freshly-installed tools' PATH without opening a new shell.
$env:Path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path', 'User')

if (-not (Get-Command cargo -ErrorAction SilentlyContinue)) {
  Write-Host "!! Rust not found. Install it from https://rustup.rs (or 'winget install Rustlang.Rustup'), then re-run this script." -ForegroundColor Yellow
  exit 1
}

# 3. Build.
Write-Host "==> Building Weft (release) — this takes a while the first time"
Write-Host "   (If this fails saying a tool/linker/protoc is missing, close PowerShell, open a NEW window, cd into the 'weft' folder, and run: cargo build --release --bin warp-oss --features $FEATURES  — the freshly-installed tools need a new PATH.)" -ForegroundColor DarkGray
cargo build --release --bin warp-oss --features $FEATURES

$bin = Join-Path (Get-Location) "target\release\warp-oss.exe"
Write-Host ""
Write-Host "Done! Launch Weft with:" -ForegroundColor Green
Write-Host "     $bin"
Write-Host ""
Write-Host "That .exe IS Weft — no packaging needed. (Weft's no-login build comes"
Write-Host "from the explicit skip_login feature above; do not use the oss bundler,"
Write-Host "which drops it.)"
