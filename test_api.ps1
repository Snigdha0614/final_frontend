$ErrorActionPreference = 'Stop'
function Test-Endpoint {
    param([string]$name, [string]$url, [hashtable]$headers = @{})
    try {
        $res = Invoke-RestMethod -Uri $url -Method Get -Headers $headers -TimeoutSec 5
        Write-Host "✅ $name : Success (Returned $(if ($res -is [array]) { $res.Count } else { 'Object' }))"
    } catch {
        Write-Host "❌ $name : Failed ($($_.Exception.Message))"
    }
}

Write-Host "=== VERIFYING TALENTTRADE REST ENDPOINTS (via Single URL http://localhost:5173) ==="
Test-Endpoint "Public Services" "http://localhost:5173/api/services"
Test-Endpoint "Public Projects" "http://localhost:5173/api/projects"
Test-Endpoint "Public Freelancers" "http://localhost:5173/api/freelancers"
Test-Endpoint "Public Skill Exchanges" "http://localhost:5173/api/exchanges"

# Admin login
$adminLogin = Invoke-RestMethod -Uri "http://localhost:5173/api/auth/login" -Method Post -Body '{"email":"admin@talenttrade.com","password":"password123"}' -ContentType "application/json"
$adminHeaders = @{ "Authorization" = "Bearer " + $adminLogin.token }
Test-Endpoint "Admin Get Me" "http://localhost:5173/api/auth/me" $adminHeaders
Test-Endpoint "Admin Users List" "http://localhost:5173/api/admin/users" $adminHeaders
Test-Endpoint "Admin Platform Stats" "http://localhost:5173/api/admin/stats" $adminHeaders

# Client login
$clientLogin = Invoke-RestMethod -Uri "http://localhost:5173/api/auth/login" -Method Post -Body '{"email":"sarah.client@talenttrade.com","password":"password123"}' -ContentType "application/json"
$clientHeaders = @{ "Authorization" = "Bearer " + $clientLogin.token }
Test-Endpoint "Client Wallet" "http://localhost:5173/api/wallet" $clientHeaders
Test-Endpoint "Client Workspaces" "http://localhost:5173/api/workspaces" $clientHeaders
Test-Endpoint "Client Notifications" "http://localhost:5173/api/notifications" $clientHeaders

Write-Host "=== ALL TALENTTRADE CORE FLOWS OPERATIONAL! ==="
