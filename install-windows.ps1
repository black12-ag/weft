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

# 2. Build dependencies (Rust + build tools + protoc). Warp's script handles most of it.
Write-Host "==> Installing build dependencies"
if (Test-Path "script/windows/install_build_deps.ps1") {
  powershell -ExecutionPolicy Bypass -File "script/windows/install_build_deps.ps1"
}
if (-not (Get-Command cargo -ErrorAction SilentlyContinue)) {
  Write-Host "!! Rust not found. Install it from https://rustup.rs (or 'winget install Rustlang.Rustup'), then re-run this script." -ForegroundColor Yellow
  exit 1
}
if (-not (Get-Command protoc -ErrorAction SilentlyContinue)) {
  Write-Host "==> Installing protoc"
  winget install --silent --accept-package-agreements --accept-source-agreements Google.Protobuf 2>$null
}

# 3. Build.
Write-Host "==> Building Weft (release) — this takes a while the first time"
cargo build --release --bin warp-oss --features $FEATURES

$bin = Join-Path (Get-Location) "target\release\warp-oss.exe"
Write-Host ""
Write-Host "Done! Launch Weft with:" -ForegroundColor Green
Write-Host "     $bin"
Write-Host ""
Write-Host "(Optional) build a Windows installer (.exe) instead:"
Write-Host "     powershell -ExecutionPolicy Bypass -File script/windows/bundle.ps1 -CHANNEL oss -FEATURES `"$FEATURES`""
