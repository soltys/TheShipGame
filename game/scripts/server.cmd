@echo off
call scripts/_common.cmd
webpack-dev-server -d  --inline  --content-base --client-log-level warning --env.dev