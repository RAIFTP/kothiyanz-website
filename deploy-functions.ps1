<#
deploy-functions.ps1
Run these commands in PowerShell to deploy Cloud Functions (assumes Firebase CLI installed and logged in).

Edit the values below before running: set $projectId, $adminSecret, $twilioSid, $twilioToken, $twilioFrom
#>

$projectId = Read-Host "Enter Firebase project id (e.g. my-project)"
$adminSecret = Read-Host "Enter ADMIN secret (choose a strong secret)"
$twilioSid = Read-Host "Enter Twilio Account SID (optional)"
$twilioToken = Read-Host "Enter Twilio Auth Token (optional)"
$twilioFrom = Read-Host "Enter Twilio 'from' (e.g. whatsapp:+1415...) (optional)"

Write-Host "Setting Firebase project to $projectId" -ForegroundColor Cyan
firebase use $projectId

Write-Host "Setting function config values..." -ForegroundColor Cyan
firebase functions:config:set kothiyanz.admin_secret="$adminSecret"
if ($twilioSid -ne '') { firebase functions:config:set twilio.sid="$twilioSid" }
if ($twilioToken -ne '') { firebase functions:config:set twilio.token="$twilioToken" }
if ($twilioFrom -ne '') { firebase functions:config:set twilio.from="$twilioFrom" }

Write-Host "Installing functions deps and deploying..." -ForegroundColor Yellow
Push-Location functions
npm install
Pop-Location

firebase deploy --only functions

Write-Host "Deployment complete. Note the function URLs in the output." -ForegroundColor Green
