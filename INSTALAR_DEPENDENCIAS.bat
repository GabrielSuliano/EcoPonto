@echo off
setlocal
title EcoPonto - Instalar dependencias

echo.
echo ==========================================
echo  EcoPonto - Instalador de dependencias
echo ==========================================
echo.

set "BASE_DIR=%~dp0"
set "APP_DIR=%BASE_DIR%"

if exist "%APP_DIR%package.json" goto :found_project

if exist "%BASE_DIR%EcoPonto\package.json" (
  set "APP_DIR=%BASE_DIR%EcoPonto\"
  goto :found_project
)

if exist "%BASE_DIR%EcoPonto\EcoPonto\package.json" (
  set "APP_DIR=%BASE_DIR%EcoPonto\EcoPonto\"
  goto :found_project
)

echo ERRO: Nao encontrei o package.json do projeto.
echo.
echo Abra ou extraia a pasta completa do EcoPonto e tente de novo.
echo.
pause
exit /b 1

:found_project
cd /d "%APP_DIR%"

where node >nul 2>nul
if errorlevel 1 (
  echo ERRO: Node.js nao encontrado.
  echo.
  echo Instale o Node.js LTS e rode este arquivo novamente:
  echo https://nodejs.org/
  echo.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo ERRO: npm nao encontrado.
  echo.
  echo Reinstale o Node.js LTS marcando a opcao do npm.
  echo.
  pause
  exit /b 1
)

echo Pasta do projeto:
echo %CD%
echo.
echo Versoes encontradas:
node --version
call npm --version
echo.
echo Instalando dependencias. Aguarde...
echo.

call npm install
if errorlevel 1 (
  echo.
  echo ERRO: npm install falhou.
  echo.
  echo Confira se voce tem internet e se o Node.js LTS esta instalado.
  echo Depois execute este arquivo novamente.
  echo.
  pause
  exit /b 1
)

echo.
echo Dependencias instaladas com sucesso.
echo Agora voce pode rodar:
echo npm start
echo.
pause
