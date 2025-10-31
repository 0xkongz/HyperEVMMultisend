import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { defineChain } from 'viem';

// Define HyperEVM chain
export const hyperEVM = defineChain({
  id: 998,
  name: 'HyperEVM',
  nativeCurrency: {
    decimals: 18,
    name: 'HyperEVM',
    symbol: 'HYPE',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_HYPEREVM_RPC_URL || 'https://rpc.hyperevm.com'],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_HYPEREVM_RPC_URL || 'https://rpc.hyperevm.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'HyperEVM Explorer',
      url: 'https://explorer.hyperevm.com',
    },
  },
  testnet: false,
});

export const config = getDefaultConfig({
  appName: 'HyperEVM MultiSend',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [hyperEVM],
  transports: {
    [hyperEVM.id]: http(),
  },
  ssr: true,
});
