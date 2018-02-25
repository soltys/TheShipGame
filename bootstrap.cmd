@echo off

SET root=%cd%

git lfs pull

cd base
call npm install
call npm link ../core
cd /D %root%

cd game
call npm install
call npm link ../core
call npm link ../base
cd /D %root%
