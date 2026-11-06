# Instala suites y tema en %USERPROFILE%\.claude\skills (Claude Code).
#   powershell -ExecutionPolicy Bypass -File skills\install.ps1 codigo artcraft tema-personalizado\grupo34-pitb-antioquia
param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Items)
$Here = Split-Path -Parent $MyInvocation.MyCommand.Path
$Dest = if ($env:DEST) { $env:DEST } else { Join-Path $env:USERPROFILE ".claude\skills" }
New-Item -ItemType Directory -Force -Path $Dest | Out-Null
if (-not $Items) { Write-Host "uso: install.ps1 codigo|artcraft|tema-personalizado\<tema> ..."; exit 1 }
foreach ($item in $Items) {
  switch ($item) { "codigo" { $src = Join-Path $Here "suite-codigo" } "artcraft" { $src = Join-Path $Here "suite-artcraft" } default { $src = Join-Path $Here $item } }
  if (Test-Path (Join-Path $src "SKILL.md")) { $dirs = @(Get-Item $src) }
  else { $dirs = Get-ChildItem $src -Directory | Where-Object { $_.Name -notlike "_*" -and $_.Name -notlike "*-workspace" } }
  foreach ($d in $dirs) {
    if (-not (Test-Path (Join-Path $d.FullName "SKILL.md"))) { continue }
    $target = Join-Path $Dest $d.Name
    if (Test-Path $target) { Remove-Item -Recurse -Force $target }
    Copy-Item -Recurse $d.FullName $target
    $ev = Join-Path $target "evals"; if (Test-Path $ev) { Remove-Item -Recurse -Force $ev }
    Write-Host "✓ $($d.Name) -> $target"
  }
}
Write-Host "Reinicia tu agente para que cargue las skills."
