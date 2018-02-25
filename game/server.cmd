@echo off

start "" tsc -w  -p ../core > NUL
start "" tsc -w  -p ../base > NUL
webpack-dev-server -d  --inline  --content-base --client-log-level warning --env.dev