# HyperEVM MultiSend

A decentralized application for sending tokens to multiple addresses in a single transaction on HyperEVM.

## Features

- 🚀 Send native HyperEVM tokens to multiple addresses
- 💰 Send ERC20 tokens to multiple addresses
- 📊 CSV import for bulk operations
- 💳 Support for different amounts per recipient
- 🔐 Secure smart contract with reentrancy protection
- 🎨 Modern, responsive UI built with Next.js and Tailwind CSS
- 🔌 Easy wallet connection with RainbowKit

## Smart Contract

The MultiSender contract is deployed on HyperEVM and allows:
- Batch sending of native tokens
- Batch sending of ERC20 tokens
- Gas optimization for large batches
- Owner withdrawal of stuck tokens (if any)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask or another Web3 wallet
- HyperEVM testnet/mainnet tokens

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Smart Contract Deployment

1. Create a `.env` file with your configuration:
```
PRIVATE_KEY=your_private_key
HYPEREVM_RPC_URL=https://rpc.hyperevm.network
```

2. Deploy the contract:
```bash
npm run compile
npm run deploy
```

## Usage

1. Connect your wallet
2. Choose between Native Token or ERC20 token transfer
3. Enter recipient addresses and amounts (or upload CSV)
4. Review transaction details
5. Confirm and send

## CSV Format

For bulk operations, use this CSV format:
```
address,amount
0x1234...,1.5
0x5678...,2.0
```

## Technology Stack

- **Smart Contracts**: Solidity
- **Frontend**: Next.js 14, React 18, TypeScript
- **Web3**: ethers.js v6, wagmi, RainbowKit
- **Styling**: Tailwind CSS
- **Deployment**: Vercel-ready

## License

MIT
