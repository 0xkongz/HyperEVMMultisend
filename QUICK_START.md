# 🚀 Quick Start Guide - Deploy in 10 Minutes

This is a streamlined guide to get your MultiSend app deployed quickly on your local machine.

## ✅ What You Need

1. **HYPE Tokens** - For gas fees (0.01-0.1 HYPE is enough)
2. **Private Key** - From MetaMask or your wallet
3. **Node.js 18+** - Download from https://nodejs.org
4. **10 minutes** - That's all!

---

## 📝 Step-by-Step Instructions

### 1️⃣ Clone the Repository (if you haven't)

```bash
git clone https://github.com/0xkongz/HyperEVMMultisend.git
cd HyperEVMMultisend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

Wait 2-3 minutes for installation to complete.

### 3️⃣ Set Up Environment Variables

Create a `.env` file:

```bash
# On macOS/Linux:
cp .env.example .env

# On Windows:
copy .env.example .env
```

Edit `.env` and add your private key:

```env
PRIVATE_KEY=your_private_key_here_without_0x
HYPEREVM_RPC_URL=https://rpc.hyperliquid.xyz/evm
```

**How to get your private key from MetaMask:**
1. Open MetaMask → Click 3 dots → Account Details
2. Click "Show Private Key"
3. Enter your password
4. Copy the key (without the 0x prefix)

### 4️⃣ Compile Contracts

```bash
npm run compile
```

You should see: ✅ "Compiled 1 Solidity file successfully"

### 5️⃣ Deploy to HyperEVM

```bash
npm run deploy
```

**SAVE THE CONTRACT ADDRESS!** You'll see something like:

```
✅ Deployment successful!
Contract address: 0xABCD1234...
```

### 6️⃣ Configure Frontend

Create `.env.local`:

```bash
# On macOS/Linux:
cat > .env.local << 'EOF'
NEXT_PUBLIC_MULTISENDER_ADDRESS=0xYOUR_CONTRACT_ADDRESS_FROM_STEP_5
NEXT_PUBLIC_HYPEREVM_CHAIN_ID=999
NEXT_PUBLIC_HYPEREVM_RPC_URL=https://rpc.hyperliquid.xyz/evm
EOF

# On Windows, create the file manually with these contents
```

Replace `0xYOUR_CONTRACT_ADDRESS_FROM_STEP_5` with your actual contract address.

### 7️⃣ Test Locally

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

**Quick test:**
1. Click "Connect Wallet"
2. Add your address as recipient
3. Enter 0.001 HYPE
4. Click "Send Tokens"
5. Confirm in MetaMask

### 8️⃣ Deploy to Vercel

**Via Vercel Dashboard (Easiest):**

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Ready for production"
   git push
   ```

2. Go to https://vercel.com
3. Click "New Project" → Import your repo
4. Add environment variables:
   - `NEXT_PUBLIC_MULTISENDER_ADDRESS` = Your contract address
   - `NEXT_PUBLIC_HYPEREVM_CHAIN_ID` = `999`
   - `NEXT_PUBLIC_HYPEREVM_RPC_URL` = `https://rpc.hyperliquid.xyz/evm`
5. Click "Deploy"

**Via Vercel CLI (Alternative):**

```bash
npm install -g vercel
vercel login
vercel
# Follow prompts and add env variables
```

---

## 🎉 Done!

Your app is now live! Share it with:

- **Your URL:** https://your-app.vercel.app
- **Contract:** https://hyperevmscan.io/address/YOUR_CONTRACT

---

## 🆘 Common Issues

**"npm install" fails:**
```bash
# Clear cache and retry
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**"Transaction failed":**
- Check you have HYPE tokens for gas
- Verify you're on HyperEVM network (Chain ID 999)
- Try with a smaller amount first

**"Can't connect wallet":**
- Add HyperEVM to MetaMask:
  - Network Name: HyperEVM
  - RPC: https://rpc.hyperliquid.xyz/evm
  - Chain ID: 999
  - Symbol: HYPE

**Contract deployment fails:**
- Check private key is correct (without 0x)
- Ensure you have HYPE tokens
- Verify RPC URL is accessible

---

## 💡 Pro Tips

1. **Test First:** Use small amounts (0.001 HYPE) for testing
2. **CSV Format:** Create CSV with format: `address,amount`
3. **Gas Savings:** More recipients = more savings (up to 200)
4. **Monitor:** Check transactions at https://hyperevmscan.io

---

## 📞 Need Help?

- Check `DEPLOYMENT_STEPS.md` for detailed guide
- Review `HOW_TO_USE.md` for usage instructions
- Check `CONTRACTS.md` for contract documentation

---

## 🔐 Security Checklist

- [ ] `.env` is in `.gitignore` ✅
- [ ] Never commit private keys ✅
- [ ] Test with small amounts first ✅
- [ ] Verify contract address before sharing ✅

---

**You're all set! Happy multi-sending! 🚀**
