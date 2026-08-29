# fix-github-mcp-name.ps1 — rename local stdio entry "github" -> "github-local"
# Reason: the key "github" collides with Cline's official marketplace entry
# (remote OAuth), causing Cline to attempt OAuth against api.githubcopilot.com
# and fail with "Incompatible auth server: does not support dynamic client
# registration". A unique name forces Cline to use the stdio binary + PAT.
$ErrorActionPreference = 'Stop'
$cfgPath = Join-Path $env:APPDATA 'Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
Copy-Item $cfgPath "$cfgPath.bak-$stamp" -Force
Write-Output "BACKUP: $cfgPath.bak-$stamp"

$cfg = Get-Content $cfgPath -Raw | ConvertFrom-Json
$props = @($cfg.mcpServers.PSObject.Properties)
$gh = $props | Where-Object { $_.Name -eq 'github' }
if (-not $gh) { Write-Output 'NO_LOCAL_GITHUB_ENTRY (nothing to rename)'; exit 0 }

# Remove old key, re-add identical value under the new key
$cfg.mcpServers.PSObject.Properties.Remove('github')
$cfg.mcpServers | Add-Member -MemberType NoteProperty -Name 'github-local' -Value $gh.Value -Force
$cfg | ConvertTo-Json -Depth 10 | Set-Content $cfgPath -Encoding UTF8

# Verify
$check = Get-Content $cfgPath -Raw | ConvertFrom-Json
Write-Output 'SERVERS_NOW:'
@($check.mcpServers.PSObject.Properties) | ForEach-Object {
    $v = $_.Value
    $tok = if ($v.env -and $v.env.GITHUB_PERSONAL_ACCESS_TOKEN) { 'tok=True' } else { 'tok=False' }
    $url = if ($v.url) { " url=$($v.url)" } else { '' }
    Write-Output ("- {0}: cmd={1} disabled={2} {3}{4}" -f $_.Name, $v.command, $v.disabled, $tok, $url)
}
Write-Output 'RENAME_DONE'