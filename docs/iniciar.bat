@echo off
cd /d "%~dp0"
where py >nul 2>nul && (py -3 servidor.py & exit /b)
where python >nul 2>nul && (python servidor.py & exit /b)
where node >nul 2>nul && (node servidor.js & exit /b)
echo Python ou Node nao encontrado. Instale um dos dois.
pause