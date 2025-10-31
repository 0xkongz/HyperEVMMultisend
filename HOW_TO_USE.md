# How to Use HyperEVM MultiSend

This guide will help you use the HyperEVM MultiSend application to send tokens to multiple addresses.

## Quick Start

1. **Visit the Application**
   - Go to your deployed URL (or http://localhost:3000 for local development)

2. **Connect Your Wallet**
   - Click "Connect Wallet" in the top right
   - Select your wallet (MetaMask, WalletConnect, etc.)
   - Approve the connection

3. **Choose Token Type**
   - **Native Token**: Send HyperEVM native tokens (HYPE)
   - **ERC20 Token**: Send any ERC20 token

## Sending Native Tokens

### Method 1: Different Amounts

1. Select "Native Token (HYPE)"
2. Keep "Send equal amount" unchecked
3. Click "+ Add" to add more recipients
4. Enter each recipient's address and amount
5. Review the total amount
6. Click "Send Tokens"
7. Confirm the transaction in your wallet

### Method 2: Equal Amounts

1. Select "Native Token (HYPE)"
2. Check "Send equal amount to all recipients"
3. Enter the amount to send to each recipient
4. Add recipient addresses (only addresses, no amounts needed)
5. Review the total amount
6. Click "Send Tokens"
7. Confirm the transaction in your wallet

## Sending ERC20 Tokens

### Setup

1. Select "ERC20 Token"
2. Enter the ERC20 token contract address
3. Wait for the token symbol to appear (confirms valid token)

### Step 1: Approve

Before sending ERC20 tokens, you must approve the MultiSender contract:

1. Add your recipients and amounts
2. Click "Approve Token"
3. Confirm the approval transaction in your wallet
4. Wait for confirmation

### Step 2: Send

1. Once approved, click "Send Tokens"
2. Confirm the send transaction in your wallet
3. Wait for confirmation

## Bulk Send with CSV

You can upload a CSV file to quickly add multiple recipients:

### CSV Format

```csv
address,amount
0x1234567890123456789012345678901234567890,1.5
0x2345678901234567890123456789012345678901,2.0
0x3456789012345678901234567890123456789012,0.5
```

### Steps

1. Prepare your CSV file in the format above
2. Click "Import CSV"
3. Select your CSV file
4. Recipients will be automatically added
5. Review the data
6. Proceed to send

### CSV Tips

- First line can be a header (address,amount) or data
- Use one recipient per line
- Amounts should be in regular units (not wei)
- Maximum 200 recipients

## Examples

### Example 1: Send 1 HYPE to 3 addresses

```
Recipient 1: 0xABCD...1234, Amount: 1.0
Recipient 2: 0xEFGH...5678, Amount: 1.0
Recipient 3: 0xIJKL...9012, Amount: 1.0
Total: 3.0 HYPE
```

### Example 2: Send different amounts of USDC

```
Token Address: 0xUSDCAddress...
Recipient 1: 0xABCD...1234, Amount: 100
Recipient 2: 0xEFGH...5678, Amount: 250
Recipient 3: 0xIJKL...9012, Amount: 50
Total: 400 USDC
```

### Example 3: Airdrop 0.1 HYPE to 10 addresses

```
Check "Send equal amount to all recipients"
Amount per recipient: 0.1
Add 10 recipient addresses
Total: 1.0 HYPE
```

## Tips and Best Practices

### Gas Optimization

- The contract is optimized for batch sending
- Sending to 100 addresses costs much less than 100 individual transactions
- Consider batching in groups of 50-100 for optimal gas usage

### Address Validation

- The app validates addresses automatically
- Invalid addresses will be highlighted
- Double-check addresses before sending (transactions are irreversible!)

### Amount Formatting

- Use decimal notation (e.g., 1.5, not 1500000000000000000)
- The app handles wei conversion automatically
- For tokens with different decimals, the app reads the token contract

### Transaction Monitoring

- Transaction hash is displayed after submission
- You can view the transaction in HyperEVM explorer
- Wait for confirmation before closing the page

### Troubleshooting

**Transaction Fails**
- Check you have enough tokens for the total amount
- Check you have enough native tokens for gas
- Ensure all addresses are valid

**ERC20 Transfer Fails**
- Make sure you approved enough tokens
- Check token balance is sufficient
- Some tokens have transfer fees or restrictions

**Wallet Connection Issues**
- Refresh the page
- Try a different wallet
- Check you're on the HyperEVM network

## Safety Checklist

Before sending:
- [ ] Double-check all recipient addresses
- [ ] Verify amounts are correct
- [ ] Confirm total amount matches expectations
- [ ] Ensure you have enough balance
- [ ] Have enough native tokens for gas fees

## Use Cases

### Airdrops
Send tokens to community members, early supporters, or NFT holders.

### Payroll
Pay team members or contributors in cryptocurrency.

### Refunds
Return funds to multiple users at once.

### Rewards Distribution
Distribute rewards from staking, games, or competitions.

### Gift Distribution
Send holiday or promotional gifts to multiple recipients.

## Limits

- Maximum 200 recipients per transaction
- Amount limits depend on your wallet balance
- Gas limits may vary based on network congestion

## Support

Need help?
- Check the FAQ in the repository
- Review error messages in the browser console
- Verify transaction details on block explorer
- Contact support through GitHub issues

---

**Happy Multi-Sending!** 🚀
