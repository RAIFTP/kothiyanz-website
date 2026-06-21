<#
quick-setup.ps1
Quick helper for local testing: installs npm deps for functions (optional), starts a lightweight static server, and opens key pages.

Usage: Run from repository root in PowerShell:
  .\quick-setup.ps1

It assumes Python is installed for `python -m http.server` and a default browser is available.
#>

Write-Host "Quick setup: starting local server and opening pages..." -ForegroundColor Cyan

# Optional: install functions dependencies if functions directory exists
if (Test-Path "functions\package.json") {
    Write-Host "Installing functions dependencies (optional)..." -ForegroundColor Yellow
    Push-Location functions
    if (Test-Path "package-lock.json") { npm ci } else { npm install }
    Pop-Location
}

# Start Python http.server in background
$port = 8000
Write-Host "Starting static server on http://localhost:$port (use Ctrl+C in this window to stop)..." -ForegroundColor Green
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "python"
$psi.Arguments = "-m http.server $port"
$psi.RedirectStandardOutput = $true
$psi.UseShellExecute = $false
$psi.CreateNoWindow = $true
$process = [System.Diagnostics.Process]::Start($psi)

Start-Sleep -Seconds 1

# Open key pages in default browser
$urls = @(
    "http://localhost:$port/admin.html",
    "http://localhost:$port/waiter.html",
    "http://localhost:$port/kitchen.html",
    "http://localhost:$port/billing.html",
    "http://localhost:$port/test-firestore.html",
    "http://localhost:$port/admin-tools.html"
)
foreach ($u in $urls) { Start-Process $u }

Write-Host "Opened admin/waiter/kitchen/billing/test pages in browser." -ForegroundColor Green
Write-Host "If you need to stop the server, return to this PowerShell window and press Ctrl+C." -ForegroundColor Cyan
