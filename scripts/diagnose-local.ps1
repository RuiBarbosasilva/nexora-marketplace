# Diagnostico local NEXORA — Windows PowerShell
# Seguro por padrao: nao imprime valores do .env, nao cria bancos, nao aplica migracoes.
$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

function Write-Section([string]$Title) {
    Write-Host "`n===== $Title =====" -ForegroundColor Cyan
}

Write-Section "VERSOES"
node --version
npm --version
if (Test-Path "node_modules/.bin/prisma.cmd") {
    npx prisma --version
} else {
    Write-Host "Prisma CLI nao encontrado em node_modules; confira package.json e instale dependencias."
}

Write-Section "CONFIGURACAO SEM SEGREDOS"
$envPath = Join-Path (Get-Location) ".env"
$hasDatabaseUrl = $false
if (Test-Path $envPath) {
    foreach ($line in Get-Content $envPath) {
        if ($line -match '^\s*(?:export\s+)?DATABASE_URL\s*=\s*(.+?)\s*$') {
            $raw = $Matches[1].Trim().Trim('"').Trim("'")
            if ($raw -and $raw -notmatch '^(CHANGE_ME|REPLACE_ME|YOUR_)') {
                $hasDatabaseUrl = $true
            }
            break
        }
    }
}
if ($hasDatabaseUrl) {
    Write-Host "DATABASE_URL declarada no .env: sim (valor oculto)."
} else {
    Write-Warning "DATABASE_URL ausente ou vazia no .env. Nao execute validacao/migracoes ate configurar uma URL local."
}

Write-Section "POSTGRESQL LOCAL"
$service = Get-Service -Name "postgresql-x64-18" -ErrorAction SilentlyContinue
if ($service) {
    Write-Host ("Servico PostgreSQL: " + $service.Status)
} else {
    Write-Host "Servico postgresql-x64-18 nao encontrado; confirme a versao instalada."
}
$port = Test-NetConnection -ComputerName "localhost" -Port 5432 -WarningAction SilentlyContinue
Write-Host ("Porta localhost:5432 acessivel: " + $port.TcpTestSucceeded)

Write-Section "ARQUIVOS E MIGRACOES"
Write-Host ("Schema Prisma existe: " + (Test-Path "prisma/schema.prisma"))
Write-Host ("Pasta de migracoes existe: " + (Test-Path "prisma/migrations"))
Write-Host ("Arquivo .env.example existe: " + (Test-Path ".env.example"))

Write-Section "VALIDACAO PRISMA (SO SE DATABASE_URL ESTIVER CONFIGURADA)"
if ($hasDatabaseUrl -and (Test-Path "node_modules/.bin/prisma.cmd")) {
    npx prisma validate
    if ($LASTEXITCODE -ne 0) { throw "prisma validate falhou; nenhuma migracao foi executada." }
    npx prisma generate
    if ($LASTEXITCODE -ne 0) { throw "prisma generate falhou." }
} else {
    Write-Warning "Etapa ignorada: configure DATABASE_URL e confirme a instalacao do Prisma."
}

Write-Section "CHECKS DO PROJETO"
foreach ($scriptName in @("check", "test", "build")) {
    $scripts = node -e "const p=require('./package.json'); process.stdout.write(p.scripts?.['$scriptName'] ? 'yes' : 'no')"
    if ($scripts -eq "yes") {
        npm run $scriptName
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "npm run $scriptName falhou; consulte o erro acima."
            break
        }
    } else {
        Write-Host "Script npm run $scriptName nao definido; ignorado."
    }
}

Write-Host "`nDiagnostico concluido. Este script nao cria banco, nao altera credenciais e nao executa migracoes." -ForegroundColor Green
