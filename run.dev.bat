@echo off
cd be
start "" "%~dp0be\run.development.bat"

cd ..
cd fe
start "" "%~dp0fe\run.development.bat"