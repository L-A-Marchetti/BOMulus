# USAGE : .\win-build.ps1 -version "<version>"
param (
    [string]$version
)

# Check if the version is provided.
if (-not $version) {
    Write-Host "Please provide a version name."
    exit 1
}

# Define paths.
$buildDir = "build\BOMulus-win-$version"
$binDestination = "$buildDir\bin"
$glibDestination = "$buildDir\share\glib-2.0"
$iconsDestination = "$buildDir\share\icons"
$assetsDestination = "$buildDir\assets"

# Execute Go build.
$env:CGO_ENABLED=1; go build -ldflags "-H windowsgui" -o "$buildDir\BOMulus.exe" cmd\BOMulus\main.go

# Check if compilation succeed.
if ($LASTEXITCODE -ne 0) {
    Write-Host "The compilation failed. Stopping the script."
    exit 1
}

# Exécute les commandes robocopy
robocopy "\tools\msys64\mingw64\bin" $binDestination *dll
robocopy "\tools\msys64\mingw64\share\glib-2.0" $glibDestination /E
robocopy "\tools\msys64\mingw64\share\icons" $iconsDestination /E
robocopy "assets\" $assetsDestination /E

Write-Host "Compilation and copying completed successfully for version $version."
