cd ..\contracts
RMDIR "ignition/deployments" /S /Q
::call npm run deploy:sep
call npm run deploy:dev
pause