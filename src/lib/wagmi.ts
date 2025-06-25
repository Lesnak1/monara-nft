import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain, createPublicClient, http } from 'viem';

// Gerçek Monad Testnet Chain Definition
export const monadTestnet = defineChain({
  id: 41454,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
      webSocket: ['wss://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://testnet.monadexplorer.com',
    },
  },
  contracts: {
    // Add contract addresses here when deployed
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11', // Standard multicall3 address
      blockCreated: 1, // Update with actual block number
    },
  },
  testnet: true,
});

// Monad Mainnet (Future)
export const monadMainnet = {
  id: 41455,
  name: 'Monad',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: { http: ['https://mainnet-rpc.monad.xyz'] },
    public: { http: ['https://mainnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://explorer.monad.xyz' },
  },
  testnet: false,
} as const;

export const config = getDefaultConfig({
  appName: 'MONARA',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'default-project-id',
  chains: [monadTestnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

// Export chain for use in other components
export { monadTestnet as defaultChain };

// Public client for read operations
export const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
});

// Get current chain info
export const getCurrentChain = () => {
  const chainId = typeof window !== 'undefined' 
    ? (window as { ethereum?: { chainId?: number } })?.ethereum?.chainId 
    : monadTestnet.id;
  
  return chainId === monadMainnet.id ? monadMainnet : monadTestnet;
};

// Chain helper functions
export const isMonadTestnet = (chainId: number) => chainId === monadTestnet.id;
export const isMonadMainnet = (chainId: number) => chainId === monadMainnet.id;
export const isMonadNetwork = (chainId: number) => 
  isMonadTestnet(chainId) || isMonadMainnet(chainId);

// Monad-specific constants
export const MONAD_TESTNET_CHAIN_ID = 10143;
export const MONAD_TESTNET_RPC = 'https://testnet-rpc.monad.xyz';
export const MONAD_EXPLORER_URL = 'https://testnet.monadexplorer.com';

// Contract addresses for Monad Testnet (to be updated when deployed)
export const CONTRACT_ADDRESSES = {
  [MONAD_TESTNET_CHAIN_ID]: {
    MONARA_NFT: '0x0000000000000000000000000000000000000000', // Will be updated after deployment
    MONARA_MARKETPLACE: '0x0000000000000000000000000000000000000000',
  },
  // Local development addresses
  31337: {
    MONARA_NFT: '0x0000000000000000000000000000000000000000',
    MONARA_MARKETPLACE: '0x0000000000000000000000000000000000000000',
  },
} as const; 