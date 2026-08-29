# run-mcp-probe.ps1 — full MCP handshake probe for the GitHub server (and optionally context7).
$ErrorActionPreference = 'Continue'

# 1. Token from Git Credential Manager
$tmp = Join-Path $env:TEMP 'cred-in.txt'
Set-Content -Path $tmp -Value 'protocol=https','host=github.com','' -Encoding ASCII
$raw = cmd /c "git credential fill < `"$tmp`"" 2>&1
Remove-Item $tmp -ErrorAction SilentlyContinue
$tok = $null
foreach ($line in @($raw)) { if ("$line" -match '^password=(.+)$') { $tok = $Matches[1] } }
if ($tok) { Write-Output ("TOKEN_OK len=" + $tok.Length) } else { Write-Output 'TOKEN_MISSING'; exit 10 }

# 2. Is the token itself valid on api.github.com?
try {
    $h = @{ Authorization = "Bearer $tok"; 'User-Agent' = 'mcp-probe' }
    $r = Invoke-WebRequest -Uri 'https://api.github.com/user' -Headers $h -TimeoutSec 20 -UseBasicParsing
    Write-Output "TOKEN_VALID status=$($r.StatusCode)"
} catch {
    Write-Output "TOKEN_CHECK_FAIL: $($_.Exception.Message)"
}

# 3. Probe the github MCP server exactly the way an MCP client would
$probe = Join-Path $PSScriptRoot 'probe-mcp.mjs'
$exe = Join-Path $env:USERPROFILE '.mcp-servers\github-mcp-server\github-mcp-server.exe'
$env:GH_PAT = $tok
Write-Output '=== GITHUB MCP PROBE (max 150s) ==='
node $probe $exe stdio
Write-Output "GITHUB_PROBE_EXIT=$LASTEXITCODE"
Remove-Item Env:\GH_PAT -ErrorAction SilentlyContinue
Write-Output 'PROBE_SCRIPT_DONE'