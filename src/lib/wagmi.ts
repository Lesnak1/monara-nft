import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain, createPublicClient, http, fallback } from 'viem';

// Güncel Monad Testnet Chain Definition (ChainID: 10143)
export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: [
        'https://testnet-rpc.monad.xyz',
        'https://monad-testnet.rpc.thirdweb.com',
      ],
      webSocket: ['wss://testnet-rpc.monad.xyz'],
    },
    public: {
      http: [
        'https://testnet-rpc.monad.xyz',
        'https://monad-testnet.rpc.thirdweb.com',
      ],
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
  id: 1,
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

// Enhanced transport configuration with retry logic and CORS handling
const createRobustTransport = () => {
  return fallback([
    http('https://testnet-rpc.monad.xyz', {
      timeout: 10_000,
      retryCount: 3,
      retryDelay: 1000,
      fetchOptions: {
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      },
    }),
    http('https://monad-testnet.rpc.thirdweb.com', {
      timeout: 10_000,
      retryCount: 2,
      retryDelay: 1000,
      fetchOptions: {
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
              },
      }),
    ]);
};

export const config = getDefaultConfig({
  appName: 'MONARA',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'default-project-id',
  chains: [monadTestnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
  transports: {
    [monadTestnet.id]: createRobustTransport(),
  },
});

// Export chain for use in other components
export { monadTestnet as defaultChain };

// Public client for read operations with robust transport
export const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: createRobustTransport(),
});

// Enhanced public client with better error handling
export const createRobustPublicClient = () => {
  return createPublicClient({
    chain: monadTestnet,
    transport: createRobustTransport(),
    pollingInterval: 4_000, // Poll every 4 seconds instead of default 2
  });
};

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

// Enhanced RPC URLs with fallbacks (removed problematic publicnode endpoint)
export const MONAD_RPC_URLS = [
  'https://testnet-rpc.monad.xyz',
  'https://monad-testnet.rpc.thirdweb.com',
] as const;

// Contract addresses for Monad Testnet (DEPLOYED)
export const CONTRACT_ADDRESSES = {
  [MONAD_TESTNET_CHAIN_ID]: {
    MONARA_NFT: '0xa7793FfC44680c03dC18ab0972b2a96A20d82335', // ✅ DEPLOYED - Monad Testnet
    MONARA_MARKETPLACE: '0x0000000000000000000000000000000000000000',
  },
  // Local development addresses
  31337: {
    MONARA_NFT: '0xa7793FfC44680c03dC18ab0972b2a96A20d82335', // Use same address for local testing
    MONARA_MARKETPLACE: '0x0000000000000000000000000000000000000000',
  },
} as const; 