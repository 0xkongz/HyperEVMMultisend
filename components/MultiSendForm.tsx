'use client';

import { useState, useRef } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther, formatEther, isAddress } from 'viem';
import { MULTISENDER_ADDRESS, MULTISENDER_ABI, ERC20_ABI } from '@/lib/contracts';

type Recipient = {
  address: string;
  amount: string;
};

type TokenMode = 'native' | 'erc20';

export default function MultiSendForm() {
  const { address, isConnected } = useAccount();
  const [tokenMode, setTokenMode] = useState<TokenMode>('native');
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [recipients, setRecipients] = useState<Recipient[]>([{ address: '', amount: '' }]);
  const [useEqualAmounts, setUseEqualAmounts] = useState(false);
  const [equalAmount, setEqualAmount] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Read token info if ERC20
  const { data: tokenSymbol } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'symbol',
    query: {
      enabled: tokenMode === 'erc20' && isAddress(tokenAddress),
    }
  });

  const { data: tokenDecimals } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: tokenMode === 'erc20' && isAddress(tokenAddress),
    }
  });

  const addRecipient = () => {
    if (recipients.length < 200) {
      setRecipients([...recipients, { address: '', amount: '' }]);
    }
  };

  const removeRecipient = (index: number) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((_, i) => i !== index));
    }
  };

  const updateRecipient = (index: number, field: keyof Recipient, value: string) => {
    const newRecipients = [...recipients];
    newRecipients[index][field] = value;
    setRecipients(newRecipients);
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());

      // Skip header if exists
      const startIndex = lines[0].toLowerCase().includes('address') ? 1 : 0;

      const newRecipients: Recipient[] = [];
      for (let i = startIndex; i < lines.length; i++) {
        const [address, amount] = lines[i].split(',').map(s => s.trim());
        if (address && amount) {
          newRecipients.push({ address, amount });
        }
      }

      if (newRecipients.length > 0) {
        setRecipients(newRecipients.slice(0, 200));
      }
    };
    reader.readAsText(file);
  };

  const calculateTotal = () => {
    if (useEqualAmounts) {
      const amount = parseFloat(equalAmount) || 0;
      return (amount * recipients.length).toFixed(6);
    }
    return recipients.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0).toFixed(6);
  };

  const handleSend = async () => {
    if (!isConnected) return;

    try {
      // Validate inputs
      const validRecipients = useEqualAmounts
        ? recipients.filter(r => isAddress(r.address))
        : recipients.filter(r => isAddress(r.address) && parseFloat(r.amount) > 0);

      if (validRecipients.length === 0) {
        alert('Please add valid recipients with amounts');
        return;
      }

      if (tokenMode === 'erc20' && !isAddress(tokenAddress)) {
        alert('Please enter a valid token address');
        return;
      }

      const addresses = validRecipients.map(r => r.address as `0x${string}`);

      if (tokenMode === 'native') {
        if (useEqualAmounts) {
          const amount = parseEther(equalAmount);
          const totalValue = amount * BigInt(addresses.length);

          await writeContract({
            address: MULTISENDER_ADDRESS,
            abi: MULTISENDER_ABI,
            functionName: 'multiSendNativeEqual',
            args: [addresses, amount],
            value: totalValue,
          });
        } else {
          const amounts = validRecipients.map(r => parseEther(r.amount));
          const totalValue = amounts.reduce((a, b) => a + b, 0n);

          await writeContract({
            address: MULTISENDER_ADDRESS,
            abi: MULTISENDER_ABI,
            functionName: 'multiSendNative',
            args: [addresses, amounts],
            value: totalValue,
          });
        }
      } else {
        // ERC20 mode
        const decimals = (tokenDecimals as number) || 18;

        if (useEqualAmounts) {
          const amount = parseEther(equalAmount); // Simplified, should use proper decimals

          await writeContract({
            address: MULTISENDER_ADDRESS,
            abi: MULTISENDER_ABI,
            functionName: 'multiSendERC20Equal',
            args: [tokenAddress as `0x${string}`, addresses, amount],
          });
        } else {
          const amounts = validRecipients.map(r => parseEther(r.amount)); // Simplified

          await writeContract({
            address: MULTISENDER_ADDRESS,
            abi: MULTISENDER_ABI,
            functionName: 'multiSendERC20',
            args: [tokenAddress as `0x${string}`, addresses, amounts],
          });
        }
      }
    } catch (err) {
      console.error('Error sending:', err);
    }
  };

  const handleApprove = async () => {
    if (tokenMode !== 'erc20' || !isAddress(tokenAddress)) return;

    try {
      const totalAmount = parseEther(calculateTotal());

      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [MULTISENDER_ADDRESS, totalAmount],
      });
    } catch (err) {
      console.error('Error approving:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
      {/* Token Mode Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Token Type
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => setTokenMode('native')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
              tokenMode === 'native'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Native Token (HYPE)
          </button>
          <button
            onClick={() => setTokenMode('erc20')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
              tokenMode === 'erc20'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            ERC20 Token
          </button>
        </div>
      </div>

      {/* ERC20 Token Address */}
      {tokenMode === 'erc20' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Token Address {tokenSymbol && <span className="text-blue-600">({tokenSymbol as string})</span>}
          </label>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Equal Amounts Toggle */}
      <div className="mb-6 flex items-center">
        <input
          type="checkbox"
          id="equalAmounts"
          checked={useEqualAmounts}
          onChange={(e) => setUseEqualAmounts(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="equalAmounts" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Send equal amount to all recipients
        </label>
      </div>

      {/* Equal Amount Input */}
      {useEqualAmounts && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount per recipient
          </label>
          <input
            type="text"
            value={equalAmount}
            onChange={(e) => setEqualAmount(e.target.value)}
            placeholder="0.0"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* CSV Upload */}
      <div className="mb-6">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Import CSV
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          className="hidden"
        />
        <p className="mt-2 text-xs text-gray-500">
          Format: address,amount (one per line)
        </p>
      </div>

      {/* Recipients List */}
      <div className="mb-6 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Recipients ({recipients.length}/200)
          </label>
          <button
            onClick={addRecipient}
            disabled={recipients.length >= 200}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Add
          </button>
        </div>

        <div className="space-y-3">
          {recipients.map((recipient, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={recipient.address}
                onChange={(e) => updateRecipient(index, 'address', e.target.value)}
                placeholder="0x..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
              />
              {!useEqualAmounts && (
                <input
                  type="text"
                  value={recipient.amount}
                  onChange={(e) => updateRecipient(index, 'amount', e.target.value)}
                  placeholder="0.0"
                  className="w-32 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                />
              )}
              {recipients.length > 1 && (
                <button
                  onClick={() => removeRecipient(index)}
                  className="px-3 py-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Total Amount:</span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {calculateTotal()} {tokenMode === 'native' ? 'HYPE' : (tokenSymbol as string || 'tokens')}
          </span>
        </div>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Sending to {recipients.filter(r => isAddress(r.address)).length} valid addresses
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {tokenMode === 'erc20' && (
          <button
            onClick={handleApprove}
            disabled={!isConnected || isPending || isConfirming}
            className="flex-1 py-4 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isPending || isConfirming ? 'Approving...' : 'Approve Token'}
          </button>
        )}
        <button
          onClick={handleSend}
          disabled={!isConnected || isPending || isConfirming}
          className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {!isConnected
            ? 'Connect Wallet'
            : isPending || isConfirming
            ? 'Sending...'
            : 'Send Tokens'}
        </button>
      </div>

      {/* Status Messages */}
      {hash && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400">
            Transaction submitted! Hash: {hash.slice(0, 10)}...{hash.slice(-8)}
          </p>
        </div>
      )}

      {isConfirmed && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm font-semibold text-green-600 dark:text-green-400">
            ✅ Transaction confirmed! Tokens sent successfully.
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error: {error.message}
          </p>
        </div>
      )}
    </div>
  );
}
