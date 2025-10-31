# 🚀 HyperEVM MultiSend - Deployment Guide

This guide will walk you through deploying your MultiSend application to HyperEVM and Vercel.

## 📋 Prerequisites

Before starting, make sure you have:

- [ ] Node.js 18+ installed
- [ ] A wallet with HYPE tokens (for gas fees)
- [ ] Your wallet's private key
- [ ] Git installed
- [ ] A Vercel account (free tier works)

## 🔍 HyperEVM Network Details

```
Network Name: HyperEVM
RPC URL: https://rpc.hyperliquid.xyz/evm
Chain ID: 999
Currency Symbol: HYPE
Block Explorer: https://hyperevmscan.io
```

---

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages for both the smart contracts and frontend.

---

## Step 2: Configure Environment Variables

### Create `.env` file for contract deployment:

```bash
cp .env.example .env
```

Then edit `.env` and add your private key:

```bash
PRIVATE_KEY=your_actual_private_key_without_0x_prefix
HYPEREVM_RPC_URL=https://rpc.hyperliquid.xyz/evm
```

**⚠️ IMPORTANT:** Never commit this file! It's already in `.gitignore`.

### How to get your private key:

**MetaMask:**
1. Open MetaMask
2. Click the 3 dots menu
3. Account Details → Show Private Key
4. Enter password and copy the key

---

## Step 3: Compile Smart Contracts

```bash
npm run compile
```

You should see:
```
Compiled 1 Solidity file successfully
```

---

## Step 4: Deploy to HyperEVM

Make sure you have HYPE tokens in your wallet for gas fees (around 0.01-0.1 HYPE should be enough).

```bash
npm run deploy
```

**Expected output:**
```
Deploying MultiSender contract to HyperEVM...
Deploying with account: 0xYourAddress...
Account balance: X.XX ETH
MultiSender deployed to: 0xCONTRACT_ADDRESS_HERE

✅ Deployment successful!

Contract address: 0xCONTRACT_ADDRESS_HERE
Owner: 0xYourAddress...

Add this address to your frontend configuration:
NEXT_PUBLIC_MULTISENDER_ADDRESS=0xCONTRACT_ADDRESS_HERE
```

**📝 SAVE THE CONTRACT ADDRESS!** You'll need it for the next step.

---

## Step 5: Configure Frontend

Create `.env.local` for the frontend:

```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_MULTISENDER_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
NEXT_PUBLIC_HYPEREVM_CHAIN_ID=999
NEXT_PUBLIC_HYPEREVM_RPC_URL=https://rpc.hyperliquid.xyz/evm
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
EOF
```

Replace `0xYOUR_DEPLOYED_CONTRACT_ADDRESS` with the actual contract address from Step 4.

### Optional: Get WalletConnect Project ID (recommended)

1. Go to https://cloud.walletconnect.com
2. Sign up/Login
3. Create a new project
4. Copy the Project ID
5. Add it to `.env.local`

---

## Step 6: Test Locally

```bash
npm run dev
```

Open http://localhost:3000

### Test checklist:
- [ ] Page loads correctly
- [ ] "Connect Wallet" button appears
- [ ] Can connect MetaMask
- [ ] Can switch between Native/ERC20 modes
- [ ] Can add recipients
- [ ] Can import CSV

### Test a transaction (optional):
1. Connect your wallet
2. Add a test recipient address (can be your own)
3. Enter a small amount (e.g., 0.001 HYPE)
4. Click "Send Tokens"
5. Confirm in MetaMask
6. Wait for transaction to complete

---

## Step 7: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Update configuration for deployment"
   git push origin claude/multisender-hyperevm-app-011CUfKoo5AFMH9Bs7JWr1Qz
   ```

2. **Go to Vercel:**
   - Visit https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Build Settings:**
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variables:**
   Click "Environment Variables" and add:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_MULTISENDER_ADDRESS` | Your contract address |
   | `NEXT_PUBLIC_HYPEREVM_CHAIN_ID` | `999` |
   | `NEXT_PUBLIC_HYPEREVM_RPC_URL` | `https://rpc.hyperliquid.xyz/evm` |
   | `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Your WalletConnect ID (optional) |

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Your app will be live!

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts and add environment variables when asked
```

---

## Step 8: Post-Deployment Testing

### Test your production site:

1. Visit your Vercel URL (e.g., `your-app.vercel.app`)
2. Connect wallet
3. Send a test transaction
4. Verify on HyperEVM Explorer: https://hyperevmscan.io

### Checklist:
- [ ] Site loads on desktop
- [ ] Site loads on mobile
- [ ] Wallet connects successfully
- [ ] Can add/remove recipients
- [ ] CSV upload works
- [ ] Test transaction succeeds
- [ ] Transaction appears on block explorer

---

## Step 9: Add Custom Domain (Optional)

In Vercel Dashboard:
1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `multisend.yourdomain.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

---

## 🎉 Congratulations!

Your HyperEVM MultiSend app is now live!

### Share these links:
- **Live App:** https://your-app.vercel.app
- **Contract:** https://hyperevmscan.io/address/YOUR_CONTRACT_ADDRESS
- **GitHub:** Your repository URL

---

## 📊 Monitoring & Maintenance

### Monitor your app:
- Vercel Analytics: Track usage and performance
- HyperEVM Explorer: Monitor contract transactions
- Vercel Logs: Debug any errors

### Common Issues:

**Build fails on Vercel:**
- Check environment variables are set correctly
- Verify all dependencies are in package.json
- Check Vercel logs for specific errors

**Transactions fail:**
- Verify contract address is correct
- Check user has enough HYPE for gas
- Ensure ERC20 approval was successful
- Verify recipient addresses are valid

**Wallet won't connect:**
- Check MetaMask is on HyperEVM network (Chain ID 999)
- Clear browser cache
- Try different wallet

---

## 🔐 Security Reminders

- [ ] `.env` file is in `.gitignore`
- [ ] Private keys never committed to GitHub
- [ ] Contract ownership is secure
- [ ] Environment variables set in Vercel only

---

## 📞 Need Help?

- Check the error logs in Vercel
- Review HyperEVM documentation
- Check MetaMask console for errors
- Review transaction on https://hyperevmscan.io

---

## 🚀 Next Steps

- Set up monitoring and analytics
- Share with your community
- Collect feedback
- Consider adding features like:
  - Token allowance checker
  - Transaction history
  - Gas estimation
  - Multiple wallet support

**Your MultiSend app is ready to help users save time and gas fees!** 🎊
