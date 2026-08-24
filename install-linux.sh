#!/usr/bin/env bash
# Build Weft on Linux from source — one command. No Warp login, no account, no API keys.
#
#   curl -fsSL https://raw.githubusercontent.com/black12-ag/weft/master/install-linux.sh | bash
#
# Works on Debian/Ubuntu, Fedora/RHEL, and Arch (uses Warp's own dependency installer).
set -euo pipefail

# Weft's exact feature set — `skip_login` is what removes Warp's sign-in.
FEATURES="gui,skip_login,agent_mode,agent_harness,profiles_design_revamp"
REPO="https://github.com/black12-ag/weft"

echo "==> Weft Linux builder"

# 1. Get the source (skip the clone if you're already inside the repo).
if [ -f Cargo.toml ] && [ -d app ]; then
  echo "==> Using the current checkout"
else
  echo "==> Cloning $REPO"
  git clone "$REPO" weft
  cd weft
fi

# 2. Rust toolchain.
if ! command -v cargo >/dev/null 2>&1; then
  echo "==> Installing Rust (rustup)"
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
  # shellcheck disable=SC1091
  . "$HOME/.cargo/env"
fi

# 3. System build dependencies (Warp's script handles apt/dnf/pacman).
echo "==> Installing build dependencies (may prompt for sudo)"
bash script/linux/install_build_deps || echo "!! dep install had issues — continuing; install anything cargo reports missing"
command -v protoc >/dev/null 2>&1 || {
  echo "==> Installing protoc"
  sudo apt-get install -y protobuf-compiler 2>/dev/null \
    || sudo dnf install -y protobuf-compiler 2>/dev/null \
    || sudo pacman -S --noconfirm protobuf 2>/dev/null || true
}

# 4. Build.
echo "==> Building Weft (release) — this takes a while the first time"
cargo build --release --bin warp-oss --features "$FEATURES"

BIN="$(pwd)/target/release/warp-oss"
echo ""
echo "✅ Done! Launch Weft with:"
echo "     $BIN"
echo ""
echo "(Optional) build an installable .deb / .rpm / AppImage instead:"
echo "     bash script/linux/bundle -c oss --packages deb,rpm,appimage --features \"$FEATURES\""
