@echo off
cd be
start "" "%~dp0be\run.product.bat"

cd ..
cd fe
start "" "%~dp0fe\run.product.bat"