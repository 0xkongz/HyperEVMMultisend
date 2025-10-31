@echo off
REM HyperEVM MultiSend - Quick Setup Script for Windows
REM This script helps you set up the environment quickly

echo.
echo ========================================
echo  HyperEVM MultiSend - Quick Setup
echo ========================================
echo.

REM Check if .env exists
if exist .env (
    echo WARNING: .env file already exists!
    set /p "OVERWRITE=Do you want to overwrite it? (y/N): "
    if /i not "%OVERWRITE%"=="y" (
        echo Setup cancelled
        exit /b 1
    )
)

REM Create .env file
echo Creating .env file...
(
echo # Private key for contract deployment (DO NOT COMMIT REAL KEYS^)
echo PRIVATE_KEY=your_private_key_here
echo.
echo # HyperEVM RPC URL
echo HYPEREVM_RPC_URL=https://rpc.hyperliquid.xyz/evm
) > .env

echo .env file created!
echo.

echo Please enter your private key (without 0x prefix^):
echo You can get this from MetaMask -^> Account Details -^> Show Private Key
set /p "PRIVATE_KEY=Private Key: "

REM Update .env with private key
powershell -Command "(Get-Content .env) -replace 'your_private_key_here', '%PRIVATE_KEY%' | Set-Content .env"

echo Private key saved to .env
echo.

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo Dependencies installed!
) else (
    echo Dependencies already installed
)
echo.

REM Compile contracts
echo Compiling smart contracts...
call npm run compile
if errorlevel 1 (
    echo Contract compilation failed
    exit /b 1
)
echo Contracts compiled successfully!
echo.

REM Deploy contract
echo Deploying contract to HyperEVM...
echo Make sure you have HYPE tokens in your wallet for gas fees!
pause

call npm run deploy > deploy_output.txt 2>&1
type deploy_output.txt

REM Try to extract contract address (basic approach for Windows)
findstr /C:"MultiSender deployed to:" deploy_output.txt > contract_line.txt
for /f "tokens=4" %%i in (contract_line.txt) do set CONTRACT_ADDRESS=%%i

if not "%CONTRACT_ADDRESS%"=="" (
    echo.
    echo Contract deployed successfully!
    echo Contract Address: %CONTRACT_ADDRESS%
    echo.

    echo Creating .env.local for frontend...
    (
    echo NEXT_PUBLIC_MULTISENDER_ADDRESS=%CONTRACT_ADDRESS%
    echo NEXT_PUBLIC_HYPEREVM_CHAIN_ID=999
    echo NEXT_PUBLIC_HYPEREVM_RPC_URL=https://rpc.hyperliquid.xyz/evm
    echo NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
    ) > .env.local

    echo .env.local created with contract address!
    echo.
    echo ========================================
    echo  Setup Complete!
    echo ========================================
    echo.
    echo Next steps:
    echo.
    echo 1. Test locally:
    echo    npm run dev
    echo.
    echo 2. Deploy to Vercel:
    echo    - Push to GitHub
    echo    - Import to Vercel
    echo    - Add environment variables from .env.local
    echo.
    echo 3. Visit: http://localhost:3000
    echo.
    echo Your contract: https://hyperevmscan.io/address/%CONTRACT_ADDRESS%

    del contract_line.txt
    del deploy_output.txt
) else (
    echo Could not extract contract address. Check deploy_output.txt
    exit /b 1
)

echo.
pause
