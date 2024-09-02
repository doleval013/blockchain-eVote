cd ..\..\contracts
RMDIR "ignition/deployments" /S /Q
call npm install
call npm run deploy:sep
pause