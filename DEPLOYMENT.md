# Deployment Guide

This guide will help you deploy the HyperEVM MultiSend application to production.

## Prerequisites

- Node.js 18+ installed
- A wallet with HyperEVM tokens for contract deployment
- Vercel account (free tier works)
- WalletConnect Project ID (optional, for better wallet support)

## Step 1: Deploy Smart Contract

### 1.1 Configure Environment

Create a `.env` file in the project root:

```bash
PRIVATE_KEY=your_private_key_here
HYPEREVM_RPC_URL=https://rpc.hyperevm.com
```

**Important:** Never commit your `.env` file. It's already in `.gitignore`.

### 1.2 Install Dependencies

```bash
npm install
```

### 1.3 Compile Contract

```bash
npm run compile
```

This will compile the MultiSender.sol contract and generate artifacts.

### 1.4 Deploy to HyperEVM

```bash
npm run deploy
```

The script will output the deployed contract address. **Save this address!**

Example output:
```
Deploying MultiSender contract to HyperEVM...
Deploying with account: 0x1234...
MultiSender deployed to: 0xABCD1234...

✅ Deployment successful!
Contract address: 0xABCD1234...
```

### 1.5 Verify Contract (Optional)

If HyperEVM supports contract verification, you can verify your contract:

```bash
npx hardhat verify --network hyperevm <CONTRACT_ADDRESS>
```

## Step 2: Configure Frontend

### 2.1 Update Environment Variables

Update your `.env.example` or create `.env.local`:

```bash
NEXT_PUBLIC_MULTISENDER_ADDRESS=0xYourDeployedContractAddress
NEXT_PUBLIC_HYPEREVM_CHAIN_ID=998
NEXT_PUBLIC_HYPEREVM_RPC_URL=https://rpc.hyperevm.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

Get a WalletConnect Project ID (optional but recommended):
1. Go to https://cloud.walletconnect.com
2. Create a new project
3. Copy the Project ID

### 2.2 Test Locally

```bash
npm run dev
```

Open http://localhost:3000 and test:
1. Connect your wallet
2. Try sending tokens to multiple addresses
3. Test both native and ERC20 token sending

## Step 3: Deploy to Vercel

### 3.1 Push to GitHub

If you haven't already:

```bash
git add .
git commit -m "Initial commit: HyperEVM MultiSend app"
git push origin main
```

### 3.2 Deploy on Vercel

#### Option A: Via Vercel Dashboard

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `NEXT_PUBLIC_MULTISENDER_ADDRESS`: Your deployed contract address
   - `NEXT_PUBLIC_HYPEREVM_CHAIN_ID`: 998
   - `NEXT_PUBLIC_HYPEREVM_RPC_URL`: https://rpc.hyperevm.com
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Your WalletConnect Project ID
5. Click "Deploy"

#### Option B: Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts and add environment variables when asked.

### 3.3 Add Environment Variables

In Vercel Dashboard:
1. Go to your project
2. Navigate to Settings → Environment Variables
3. Add all `NEXT_PUBLIC_*` variables
4. Redeploy if needed

## Step 4: Post-Deployment

### 4.1 Test Production Site

Visit your Vercel URL and test:
- [ ] Wallet connection works
- [ ] Contract interaction works
- [ ] Native token sending works
- [ ] ERC20 token sending works (if you have test tokens)
- [ ] CSV upload works
- [ ] UI looks correct on mobile and desktop

### 4.2 Configure Custom Domain (Optional)

In Vercel Dashboard:
1. Go to Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### 4.3 Monitor

- Check Vercel Analytics for traffic
- Monitor transaction success rate
- Check for any error reports

## Troubleshooting

### Contract Deployment Fails

- Check you have enough HyperEVM tokens for gas
- Verify RPC URL is correct
- Ensure private key is valid

### Frontend Can't Connect to Contract

- Double-check `NEXT_PUBLIC_MULTISENDER_ADDRESS` is set correctly
- Verify the contract is deployed on the correct network
- Check browser console for errors

### Transactions Fail

- Ensure users have enough tokens for gas
- Check if ERC20 token approval was successful
- Verify recipient addresses are valid

### WalletConnect Issues

- Verify your Project ID is correct
- Check if the domain is whitelisted in WalletConnect dashboard
- Try clearing browser cache

## Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] Private keys are never committed
- [ ] Contract has been reviewed for security issues
- [ ] Frontend validates all user inputs
- [ ] Smart contract address is hardcoded in frontend, not user input

## Updating the Contract

If you need to update the contract:

1. Deploy new contract version
2. Update `NEXT_PUBLIC_MULTISENDER_ADDRESS` in Vercel
3. Redeploy frontend
4. Notify users of the new contract address

## Support

For issues:
- Check the GitHub repository issues
- Review HyperEVM documentation
- Check Vercel deployment logs

---

**Congratulations!** Your HyperEVM MultiSend app is now live!
