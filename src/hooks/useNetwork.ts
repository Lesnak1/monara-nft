'use client';

import { useChainId, useSwitchChain } from 'wagmi';

export interface NetworkInfo {
  id: number;
  name: string;
  isSupported: boolean;
  isTestnet: boolean;
  color: string;
  icon: string;
  rpcUrl: string;
  blockExplorer: string;
}

export const SUPPORTED_NETWORKS: Record<number, NetworkInfo> = {
  // Hardhat Local Network
  31337: {
    id: 31337,
    name: 'Hardhat Local',
    isSupported: true,
    isTestnet: true,
    color: 'bg-gray-500',
    icon: '🔨',
    rpcUrl: 'http://localhost:8545',
    blockExplorer: 'http://localhost:8545'
  },
  // Monad Testnet - Güncel bilgiler (ChainID: 10143)
  10143: {
    id: 10143,
    name: 'Monad Testnet',
    isSupported: true,
    isTestnet: true,
    color: 'bg-purple-500',
    icon: '🔮',
    rpcUrl: 'https://testnet-rpc.monad.xyz',
    blockExplorer: 'https://testnet.monadexplorer.com'
  },
  // Ethereum Mainnet (karşılaştırma için)
  1: {
    id: 1,
    name: 'Ethereum',
    isSupported: false,
    isTestnet: false,
    color: 'bg-blue-500',
    icon: 'Ξ',
    rpcUrl: 'https://mainnet.infura.io',
    blockExplorer: 'https://etherscan.io'
  },
  // Sepolia (test için)
  11155111: {
    id: 11155111,
    name: 'Sepolia',
    isSupported: false,
    isTestnet: true,
    color: 'bg-orange-500',
    icon: '🧪',
    rpcUrl: 'https://sepolia.infura.io',
    blockExplorer: 'https://sepolia.etherscan.io'
  }
};

export function useNetwork() {
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const currentNetwork = (() => {
    const network = SUPPORTED_NETWORKS[chainId];
    if (network) {
      return {
        id: network.id,
        name: network.name,
        isTestnet: network.isTestnet,
        isSupported: network.isSupported,
        nativeCurrency: { 
          name: 'MON', 
          symbol: 'MON', 
          decimals: 18 
        },
        blockExplorer: network.blockExplorer,
        rpcUrl: network.rpcUrl
      };
    }

    // Bilinmeyen network'ler için fallback
    return {
      id: chainId,
      name: 'Unsupported Network',
      isTestnet: true,
      isSupported: false,
      nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
      blockExplorer: '',
      rpcUrl: ''
    };
  })();

  const isMonadNetwork = chainId === 10143; // Monad Testnet Chain ID
  const isSupported = isMonadNetwork;
  const isWrongNetwork = !isMonadNetwork;

  const switchToMonadTestnet = () => {
    switchChain({ chainId: 10143 });
  };

  const switchToHardhatLocal = () => {
    switchChain({ chainId: 31337 });
  };

  const switchToMonad = () => {
    // Şimdilik testnet'e yönlendir çünkü mainnet henüz aktif değil
    switchChain({ chainId: 10143 });
  };

  const getNetworkStatus = () => {
    if (chainId === 10143) {
      return {
        status: 'connected',
        message: 'Connected to Monad Testnet',
        color: 'text-green-600 dark:text-green-400'
      };
    }
    
    if (chainId === 31337) {
      return {
        status: 'connected',
        message: 'Connected to Hardhat Local',
        color: 'text-green-600 dark:text-green-400'
      };
    }
    
    if (chainId === 1) {
      return {
        status: 'wrong',
        message: 'Switch to Monad Testnet',
        color: 'text-yellow-600 dark:text-yellow-400'
      };
    }
    
    return {
      status: 'unsupported',
      message: 'Unsupported Network',
      color: 'text-red-600 dark:text-red-400'
    };
  };

  // Monad-specific network capabilities
  const getNetworkCapabilities = () => {
    if (isMonadNetwork) {
      return {
        hasParallelExecution: true,
        averageBlockTime: 0.5, // 500ms
        maxTPS: 10000,
        isEVMCompatible: true,
        supportsBFTConsensus: true,
      };
    }
    
    return {
      hasParallelExecution: false,
      averageBlockTime: 12, // Ethereum average
      maxTPS: 15,
      isEVMCompatible: true,
      supportsBFTConsensus: false,
    };
  };

  return {
    chainId,
    currentNetwork,
    isSupported,
    isMonadNetwork,
    isWrongNetwork,
    isSwitching,
    switchToMonadTestnet,
    switchToHardhatLocal,
    switchToMonad,
    switchChain,
    getNetworkStatus,
    getNetworkCapabilities,
    SUPPORTED_NETWORKS
  };
} 