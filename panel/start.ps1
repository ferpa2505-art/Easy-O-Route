# Starts the Easy-O-Route panel (http://localhost:8090) without installing the CLI.
# It asks for the OmniRoute token with hidden input and keeps it only in the memory of this
# process: nothing is written to a file or to a permanent Windows variable.
#
# Usage:  .\start.ps1
#         .\start.ps1 -Port 8091 -OmniUrl http://localhost:20128
param(
  [int]$Port = 8090,
  [string]$OmniUrl = "http://localhost:20128"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js was not found. Install it from https://nodejs.org and run this script again." -ForegroundColor Red
  exit 1
}

if (-not $env:OMNIROUTE_TOKEN) {
  $secure = Read-Host "OmniRoute token (oma_live_...) - press Enter to skip" -AsSecureString
  $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  try { $plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) }
  finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
  if ($plain) { $env:OMNIROUTE_TOKEN = $plain }
  else { Write-Host "No token: paste it in the panel (Connect OmniRoute) if OmniRoute asks for one." -ForegroundColor Yellow }
}

$env:PORT = "$Port"
$env:OMNIROUTE_URL = $OmniUrl
Set-Location $PSScriptRoot
Start-Process "http://localhost:$Port" | Out-Null
node server.js
