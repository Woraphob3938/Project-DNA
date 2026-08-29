# =============================================================================
# setup-mcp-servers.ps1 — Install Context7 + GitHub MCP servers into Cline
# - Pulls the GitHub token live from Git Credential Manager (no secrets stored)
# - Backs up cline_mcp_settings.json before editing
# - Adds "context7" (npx stdio) and "github" (release binary stdio)
# - Verifies both servers with a JSON-RPC initialize handshake
# Re-runnable at any time.
# =============================================================================
$ErrorActionPreference = 'Continue'

# --- 1. Get GitHub token from Git Credential Manager -------------------------
$tmp = Join-Path $env:TEMP 'cred-in.txt'
Set-Content -Path $tmp -Value 'protocol=https','host=github.com','' -Encoding ASCII
$raw = cmd /c "git credential fill < `"$tmp`"" 2>&1
Remove-Item $tmp -ErrorAction SilentlyContinue

$tok = $null
$diag = @()
foreach ($line in @($raw)) {
    $s = "$line"
    if ($s -match '^password=(.+)$') { $tok = $Matches[1] }
    elseif ($s -match '^username=(.+)$') { $diag += "USERNAME=$($Matches[1])" }
    elseif ($s.Trim()) { $diag += "RAW: $s" }
}
if ($tok) {
    $diag += ("TOKEN_OK len=" + $tok.Length + " prefix=" + $tok.Substring(0,4) + "...")
} else {
    $diag += "NO_TOKEN"
}
$diag | ForEach-Object { Write-Output $_ }

if (-not $tok) { Write-Output 'RESULT: ABORT_NO_TOKEN'; exit 10 }

# --- 2. Update Cline MCP settings -------------------------------------------
$cfgPath = Join-Path $env:APPDATA 'Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
Copy-Item $cfgPath "$cfgPath.bak-$stamp" -Force
Write-Output "BACKUP: $cfgPath.bak-$stamp"

$cfg = Get-Content $cfgPath -Raw | ConvertFrom-Json
$npx = 'C:\Program Files\nodejs\npx.cmd'
$exe = Join-Path $env:USERPROFILE '.mcp-servers\github-mcp-server\github-mcp-server.exe'

$context7 = [pscustomobject]@{
    command     = 'cmd'
    args        = @('/c', $npx, '-y', '@upstash/context7-mcp')
    env         = [pscustomobject]@{}
    disabled    = $false
    autoApprove = @()
}
$github = [pscustomobject]@{
    command     = $exe
    args        = @('stdio')
    env         = [pscustomobject]@{ GITHUB_PERSONAL_ACCESS_TOKEN = $tok }
    disabled    = $false
    autoApprove = @()
}
$cfg.mcpServers | Add-Member -MemberType NoteProperty -Name 'context7' -Value $context7 -Force
$cfg.mcpServers | Add-Member -MemberType NoteProperty -Name 'github' -Value $github -Force
$cfg | ConvertTo-Json -Depth 10 | Set-Content $cfgPath -Encoding UTF8

Write-Output 'SERVERS_NOW:'
@((Get-Content $cfgPath -Raw | ConvertFrom-Json).mcpServers.PSObject.Properties.Name) |
    ForEach-Object { Write-Output " - $_" }
Write-Output ("GH_TOKEN_IN_CONFIG=" + [bool]((Get-Content $cfgPath -Raw) -match 'GITHUB_PERSONAL_ACCESS_TOKEN'))

# --- 3. Handshake verification ------------------------------------------------
function Test-StdioServer([string]$fileName, [string]$argList, [hashtable]$envVars, [string]$label) {
    Write-Output "--- $label TEST ---"
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $fileName
    $psi.Arguments = $argList
    $psi.UseShellExecute = $false
    $psi.RedirectStandardInput = $true
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    if ($envVars) {
        foreach ($k in $envVars.Keys) { $psi.EnvironmentVariables[$k] = $envVars[$k] }
    }
    $p = [System.Diagnostics.Process]::Start($psi)
    $init = '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"probe","version":"1.0"}}}'
    try {
        $p.StandardInput.WriteLine($init)
        $p.StandardInput.Flush()
        $t = $p.StandardOutput.ReadLineAsync()
        if ($t.Wait(90000) -and $t.Result) {
            $line = $t.Result
            $head = $line.Substring(0, [Math]::Min(180, $line.Length))
            if ($line -match '"serverInfo"') { Write-Output "HANDSHAKE_OK: $head" }
            else { Write-Output "RESPONSE: $head" }
        } else {
            Write-Output ("HANDSHAKE_TIMEOUT exited=" + $p.HasExited)
        }
    } catch {
        Write-Output "HANDSHAKE_ERROR: $_"
    }
    if ($p -and -not $p.HasExited) { $p.Kill() }
}

Test-StdioServer 'cmd.exe' '/c ""C:\Program Files\nodejs\npx.cmd" -y @upstash/context7-mcp"' $null 'CONTEXT7'
Test-StdioServer $exe 'stdio' @{ GITHUB_PERSONAL_ACCESS_TOKEN = $tok } 'GITHUB'

Write-Output 'RESULT: DONE'