# Smart Contract Documentation

## MultiSender Contract

The MultiSender contract allows users to send native tokens or ERC20 tokens to multiple addresses in a single transaction.

### Contract Address

**HyperEVM Mainnet:** TBD (deploy using `npm run deploy`)

### Features

- ✅ Send native HyperEVM tokens to multiple addresses
- ✅ Send ERC20 tokens to multiple addresses
- ✅ Support for different amounts per recipient
- ✅ Support for equal amounts to all recipients
- ✅ Up to 200 recipients per transaction
- ✅ Automatic refund of excess native tokens
- ✅ Reentrancy protection
- ✅ Emergency withdrawal functions for owner

### Contract Functions

#### multiSendNative

```solidity
function multiSendNative(
    address[] calldata recipients,
    uint256[] calldata amounts
) external payable
```

Send native tokens to multiple addresses with different amounts.

**Parameters:**
- `recipients`: Array of recipient addresses
- `amounts`: Array of amounts (in wei) to send to each recipient

**Requirements:**
- Arrays must have the same length
- Must send enough native tokens to cover total amount
- Maximum 200 recipients
- All addresses must be valid (non-zero)
- All amounts must be greater than 0

**Example:**
```javascript
await multiSender.multiSendNative(
  ['0xAddr1', '0xAddr2'],
  [parseEther('1.0'), parseEther('2.0')],
  { value: parseEther('3.0') }
);
```

#### multiSendNativeEqual

```solidity
function multiSendNativeEqual(
    address[] calldata recipients,
    uint256 amount
) external payable
```

Send the same amount of native tokens to multiple addresses.

**Parameters:**
- `recipients`: Array of recipient addresses
- `amount`: Amount (in wei) to send to each recipient

**Requirements:**
- Must send enough native tokens (amount × number of recipients)
- Maximum 200 recipients
- All addresses must be valid
- Amount must be greater than 0

**Example:**
```javascript
await multiSender.multiSendNativeEqual(
  ['0xAddr1', '0xAddr2', '0xAddr3'],
  parseEther('1.0'),
  { value: parseEther('3.0') }
);
```

#### multiSendERC20

```solidity
function multiSendERC20(
    address token,
    address[] calldata recipients,
    uint256[] calldata amounts
) external
```

Send ERC20 tokens to multiple addresses with different amounts.

**Parameters:**
- `token`: ERC20 token contract address
- `recipients`: Array of recipient addresses
- `amounts`: Array of amounts to send to each recipient

**Requirements:**
- Caller must approve this contract to spend tokens first
- Arrays must have the same length
- Maximum 200 recipients
- All addresses must be valid
- All amounts must be greater than 0

**Example:**
```javascript
// First approve
await tokenContract.approve(multiSenderAddress, parseEther('3.0'));

// Then send
await multiSender.multiSendERC20(
  tokenAddress,
  ['0xAddr1', '0xAddr2'],
  [parseEther('1.0'), parseEther('2.0')]
);
```

#### multiSendERC20Equal

```solidity
function multiSendERC20Equal(
    address token,
    address[] calldata recipients,
    uint256 amount
) external
```

Send the same amount of ERC20 tokens to multiple addresses.

**Parameters:**
- `token`: ERC20 token contract address
- `recipients`: Array of recipient addresses
- `amount`: Amount to send to each recipient

**Requirements:**
- Caller must approve this contract to spend tokens first
- Maximum 200 recipients
- All addresses must be valid
- Amount must be greater than 0

**Example:**
```javascript
// First approve
await tokenContract.approve(multiSenderAddress, parseEther('3.0'));

// Then send
await multiSender.multiSendERC20Equal(
  tokenAddress,
  ['0xAddr1', '0xAddr2', '0xAddr3'],
  parseEther('1.0')
);
```

### Owner Functions

#### emergencyWithdrawNative

```solidity
function emergencyWithdrawNative() external onlyOwner
```

Allows the owner to withdraw any native tokens stuck in the contract.

#### emergencyWithdrawERC20

```solidity
function emergencyWithdrawERC20(address token) external onlyOwner
```

Allows the owner to withdraw any ERC20 tokens stuck in the contract.

#### transferOwnership

```solidity
function transferOwnership(address newOwner) external onlyOwner
```

Transfer ownership of the contract to a new address.

### Events

#### NativeTokensSent

```solidity
event NativeTokensSent(
    address indexed sender,
    uint256 totalAmount,
    uint256 recipientCount
)
```

Emitted when native tokens are sent to multiple addresses.

#### ERC20TokensSent

```solidity
event ERC20TokensSent(
    address indexed sender,
    address indexed token,
    uint256 totalAmount,
    uint256 recipientCount
)
```

Emitted when ERC20 tokens are sent to multiple addresses.

#### OwnershipTransferred

```solidity
event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
)
```

Emitted when contract ownership is transferred.

### Security Features

1. **Reentrancy Protection**: Uses a reentrancy guard to prevent reentrancy attacks
2. **Input Validation**: Validates all addresses and amounts
3. **Recipient Limit**: Maximum 200 recipients to prevent gas issues
4. **Excess Refund**: Automatically refunds excess native tokens
5. **Owner Controls**: Emergency withdrawal functions for stuck tokens
6. **No Arbitrary Calls**: Contract only calls known, safe functions

### Gas Optimization

- Uses `calldata` for array parameters
- Minimizes storage operations
- Batch transfers in a single transaction
- Optimized loop structures

### Testing

Before deployment, test the contract thoroughly:

```bash
# Compile contracts
npx hardhat compile

# Run tests (if tests are created)
npx hardhat test

# Deploy to local network for testing
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### Upgrading

This contract is not upgradeable. To upgrade:

1. Deploy a new version of the contract
2. Update the frontend to use the new contract address
3. Migrate any necessary state (if applicable)

### License

MIT License - See LICENSE file for details.

## Support

For issues with the smart contract:
- Review the code in `/contracts/MultiSender.sol`
- Check transaction logs for error messages
- Ensure proper gas limits for large batches
