#!/bin/bash

# HyperEVM MultiSend - Quick Setup Script
# This script helps you set up the environment quickly

set -e

echo "🚀 HyperEVM MultiSend - Quick Setup"
echo "===================================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled"
        exit 1
    fi
fi

# Create .env file
echo "📝 Creating .env file..."
cat > .env << 'EOF'
# Private key for contract deployment (DO NOT COMMIT REAL KEYS)
PRIVATE_KEY=your_private_key_here

# HyperEVM RPC URL
HYPEREVM_RPC_URL=https://rpc.hyperliquid.xyz/evm
EOF

echo "✅ .env file created!"
echo ""

# Ask for private key
echo "🔑 Please enter your private key (without 0x prefix):"
echo "   You can get this from MetaMask → Account Details → Show Private Key"
read -sp "Private Key: " PRIVATE_KEY
echo ""

# Update .env with private key
sed -i "s/your_private_key_here/$PRIVATE_KEY/" .env

echo "✅ Private key saved to .env"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed!"
else
    echo "✅ Dependencies already installed"
fi
echo ""

# Compile contracts
echo "🔨 Compiling smart contracts..."
if npm run compile; then
    echo "✅ Contracts compiled successfully!"
else
    echo "❌ Contract compilation failed"
    exit 1
fi
echo ""

# Deploy contract
echo "🚀 Deploying contract to HyperEVM..."
echo "   Make sure you have HYPE tokens in your wallet for gas fees!"
read -p "Press Enter to continue or Ctrl+C to cancel..."

if npm run deploy > deploy_output.txt 2>&1; then
    cat deploy_output.txt

    # Extract contract address
    CONTRACT_ADDRESS=$(grep -oP 'MultiSender deployed to: \K0x[a-fA-F0-9]{40}' deploy_output.txt)

    if [ -n "$CONTRACT_ADDRESS" ]; then
        echo ""
        echo "🎉 Contract deployed successfully!"
        echo "📍 Contract Address: $CONTRACT_ADDRESS"
        echo ""

        # Create .env.local
        echo "📝 Creating .env.local for frontend..."
        cat > .env.local << EOF
NEXT_PUBLIC_MULTISENDER_ADDRESS=$CONTRACT_ADDRESS
NEXT_PUBLIC_HYPEREVM_CHAIN_ID=999
NEXT_PUBLIC_HYPEREVM_RPC_URL=https://rpc.hyperliquid.xyz/evm
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
EOF

        echo "✅ .env.local created with contract address!"
        echo ""
        echo "🌟 Setup complete! Next steps:"
        echo ""
        echo "1. Test locally:"
        echo "   npm run dev"
        echo ""
        echo "2. Deploy to Vercel:"
        echo "   - Push to GitHub"
        echo "   - Import to Vercel"
        echo "   - Add environment variables from .env.local"
        echo ""
        echo "3. Visit: http://localhost:3000"
        echo ""
        echo "📄 Your contract: https://hyperevmscan.io/address/$CONTRACT_ADDRESS"

        rm deploy_output.txt
    else
        echo "⚠️  Could not extract contract address. Check deploy_output.txt"
        exit 1
    fi
else
    cat deploy_output.txt
    echo "❌ Deployment failed! Please check the error above."
    exit 1
fi
