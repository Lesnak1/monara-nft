import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';
import { 
  injected, 
  walletConnect, 
  metaMask, 
  coinbaseWallet 
} from '@wagmi/connectors';

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

// Get WalletConnect project ID from environment or use a default for demo
const getWalletConnectProjectId = () => {
  return process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id-here';
};

// Wagmi Configuration with Connectors
export const config = createConfig({
  chains: [monadTestnet],
  connectors: [
    // Injected wallets (MetaMask, Trust Wallet, etc.)
    injected({
      target: 'metaMask',
    }),
    injected({
      target: 'trustWallet',
    }),
    injected(),
    
    // MetaMask connector
    metaMask({
      dappMetadata: {
        name: 'MONARA - Neural Beings',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com',
        iconUrl: typeof window !== 'undefined' ? `${window.location.origin}/favicon.ico` : 'https://your-domain.com/favicon.ico',
      },
    }),
    
    // Coinbase Wallet
    coinbaseWallet({
      appName: 'MONARA - Neural Beings',
      appLogoUrl: typeof window !== 'undefined' ? `${window.location.origin}/favicon.ico` : 'https://your-domain.com/favicon.ico',
    }),
    
    // WalletConnect
    walletConnect({
      projectId: getWalletConnectProjectId(),
      metadata: {
        name: 'MONARA - Neural Beings',
        description: 'Premium AI-Generated NFT Collection on Monad Blockchain',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com',
        icons: [typeof window !== 'undefined' ? `${window.location.origin}/favicon.ico` : 'https://your-domain.com/favicon.ico'],
      },
      showQrModal: true,
    }),
  ],
  transports: {
    [monadTestnet.id]: http(),
  },
  ssr: true,
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