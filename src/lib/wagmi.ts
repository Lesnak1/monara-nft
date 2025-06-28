import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';

// Monad Testnet Chain Definition
export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
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
    public: {
      http: ['https://testnet-rpc.monad.xyz'],
      webSocket: ['wss://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Monad Explorer', 
      url: 'https://testnet.monadexplorer.com' 
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

// Contract Addresses per Chain
export const CONTRACT_ADDRESSES = {
  [monadTestnet.id]: {
    MONARA_NFT: '0xa7793FfC44680c03dC18ab0972b2a96A20d82335',
  },
} as const;

export const MONAD_TESTNET_CHAIN_ID = monadTestnet.id;

// Wagmi Configuration
export const config = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
});

export { monadTestnet as defaultChain };

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
export const MONAD_TESTNET_RPC = 'https://testnet-rpc.monad.xyz';
export const MONAD_EXPLORER_URL = 'https://testnet.monadexplorer.com';

// Enhanced RPC URLs with fallbacks (removed problematic publicnode endpoint)
export const MONAD_RPC_URLS = [
  'https://testnet-rpc.monad.xyz',
  'https://monad-testnet.rpc.thirdweb.com',
] as const; 