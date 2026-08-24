#!/usr/bin/env bash
# Install Weft on macOS with NO Gatekeeper warning — free, no Apple certificate.
# Downloads the latest DMG, copies Weft to /Applications, and removes the
# quarantine flag so it opens cleanly on first launch.
#
#   curl -fsSL https://raw.githubusercontent.com/black12-ag/weft/master/install-mac.sh | bash
set -euo pipefail

URL="https://github.com/black12-ag/weft/releases/latest/download/Weft.dmg"
TMP="$(mktemp -d)"
DMG="$TMP/Weft.dmg"

echo "==> Downloading Weft..."
curl -L --fail "$URL" -o "$DMG"

echo "==> Mounting the disk image..."
MOUNT="$(hdiutil attach "$DMG" -nobrowse -quiet | grep -o '/Volumes/.*' | head -1)"
trap 'hdiutil detach "$MOUNT" -quiet >/dev/null 2>&1 || true; rm -rf "$TMP"' EXIT

echo "==> Installing to /Applications..."
rm -rf "/Applications/Weft.app"
cp -R "$MOUNT/Weft.app" "/Applications/"

echo "==> Removing the quarantine flag (so it opens with no warning)..."
xattr -dr com.apple.quarantine "/Applications/Weft.app" 2>/dev/null || true

echo ""
echo "✅ Done! Open Weft from your Applications folder — no security warning."
