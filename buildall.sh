#!/bin/bash

# Exit on error
set -e
rm dist -rf
# Create dist directory if it doesn't exist
mkdir -p dist

# Build for different platforms
echo "🏗️ Building executables..."

# macOS (both arm64 and x64)
echo "Building for macOS..."
bun build ./index.ts --compile --target=bun-darwin-arm64 --outfile=dist/simpleserve-macos-arm64
bun build ./index.ts --compile --target=bun-darwin-x64 --outfile=dist/simpleserve-macos-x64

# Linux (both arm64 and x64)
echo "Building for Linux..."
bun build ./index.ts --compile --target=bun-linux-arm64 --outfile=dist/simpleserve-linux-arm64
bun build ./index.ts --compile --target=bun-linux-x64 --outfile=dist/simpleserve-linux-x64

# Windows (x64)
echo "Building for Windows..."
bun build ./index.ts --compile --target=bun-windows-x64 --outfile=dist/simpleserve-win-x64.exe

# Create checksums
echo "Generating checksums..."
cd dist
sha256sum * > checksums.txt
cd ..

echo "✅ Build complete! Check the dist directory for your executables."
