#!/bin/bash
# Build + package + install Weft (release) on macOS.
# Produces Weft.dmg and installs Weft.app to /Applications.
set -euo pipefail

cd "$(dirname "$0")"

FEATURES="gui,skip_login,agent_mode,agent_harness,profiles_design_revamp"

export DEVELOPER_DIR="${DEVELOPER_DIR:-/Applications/Xcode.app/Contents/Developer}"
export CARGO_NET_GIT_FETCH_WITH_CLI=true
export CARGO_NET_RETRY=20
export CARGO_INCREMENTAL=0   # incremental caches grow to tens of GB on this repo
command -v cargo >/dev/null || { echo "Rust is required: https://rustup.rs"; exit 1; }
command -v protoc >/dev/null || export PROTOC="${PROTOC:-$HOME/.local/protoc/bin/protoc}"
cargo bundle --help >/dev/null 2>&1 || cargo install cargo-bundle

echo "==> Building Weft (release — this takes a while)"
cargo build --release --bin warp-oss --features "$FEATURES"

echo "==> Packaging app + DMG"
(cd app && cargo bundle --release --bin warp-oss --features "$FEATURES")

APP="target/release/bundle/osx/Weft.app"
./script/macos/add_framework_rpath "$APP/Contents/MacOS/warp-oss"
codesign --force --deep --options runtime --sign "-" "$APP" \
  --entitlements script/Debug-Entitlements.plist

DMG="target/release/bundle/dmg/Weft.dmg"
[ -f "$DMG" ] && cp "$DMG" ./Weft.dmg && echo "==> DMG: $(pwd)/Weft.dmg"

echo "==> Installing to /Applications"
pkill -f "Weft.app/Contents/MacOS/warp-oss" 2>/dev/null || true
rm -rf /Applications/Weft.app
cp -R "$APP" /Applications/
xattr -dr com.apple.quarantine /Applications/Weft.app 2>/dev/null || true

echo "==> Done. Launch /Applications/Weft.app"
