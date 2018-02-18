@echo off

start "" tsc -w  -p ../support > NUL
webpack-dev-server -d  --inline  --content-base --client-log-level warning --env.dev