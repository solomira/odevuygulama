# PowerShell script to create minimal placeholder PNG assets
# Run with: powershell -ExecutionPolicy Bypass -File scripts/create-assets.ps1

# Minimal valid 1x1 PNG in base64
$pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
$pngBytes = [System.Convert]::FromBase64String($pngBase64)

# Ensure assets directory exists
$assetsDir = "assets"
if (-not (Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir | Out-Null
}

# Create placeholder files
$assets = @("icon.png", "adaptive-icon.png", "splash.png")

foreach ($asset in $assets) {
    $filePath = Join-Path $assetsDir $asset
    [System.IO.File]::WriteAllBytes($filePath, $pngBytes)
    Write-Host "Created: $filePath"
}

Write-Host ""
Write-Host "Placeholder assets created successfully!"
Write-Host "NOTE: These are minimal placeholders. Replace with actual app icons before production."
Write-Host ""
Write-Host "Required sizes:"
Write-Host "  - icon.png: 1024x1024px"
Write-Host "  - adaptive-icon.png: 1024x1024px"
Write-Host "  - splash.png: 1284x2778px"









