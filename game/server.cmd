@echo off
call npm link ../core
call npm link ../base
webpack-dev-server -d  --inline  --content-base --client-log-level warning --env.dev