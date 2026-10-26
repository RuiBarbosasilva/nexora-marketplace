# Checklist de validação local

Execute na branch `feat/core-foundation`, após preservar as alterações locais:

```powershell
Set-Location "C:\nexora-marketplace"
git status --short
git fetch origin
git diff -- package.json package-lock.json
npm ci
npm audit --audit-level=high
npm run check
npm test
npm run build
```

Se `npm ci` falhar porque o `package-lock.json` não existe ou não corresponde a `package.json`, não apague arquivos locais para forçar a instalação. Primeiro revise as alterações e gere o lockfile com a versão de Node/npm esperada; depois repita os comandos.

Não publique logs contendo tokens, senhas ou variáveis de ambiente. Só considere validação concluída quando cada comando terminar com código de saída zero e o CI correspondente estiver visível no GitHub.
