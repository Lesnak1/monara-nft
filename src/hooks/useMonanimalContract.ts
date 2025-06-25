'use client';

import { useEffect, useState } from 'react';
import { 
  useAccount, 
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt,
  useBalance 
} from 'wagmi';
import { parseEther, formatEther } from 'viem';

// Gerçek MONARA contract ABI (özet)
const MONARA_ABI = [
  {
    inputs: [{ name: 'to', type: 'address' }],
    name: 'mint',
    outputs: [{ name: 'tokenId', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'to', type: 'address' }],
    name: 'quantumGenesis',
    outputs: [{ name: 'tokenId', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_SUPPLY',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintPrice',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'quantumPrice',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Deploy edilen contract address - MONARA Monad Testnet
const MONARA_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MONARA_CONTRACT_ADDRESS as `0x${string}` || 
  '0xa7793FfC44680c03dC18ab0972b2a96A20d82335';

export interface ContractStats {
  totalSupply: number;
  maxSupply: number;
  mintPrice: string;
  quantumPrice: string;
  userBalance: number;
  isContractReady: boolean;
}

export function useMonanimalContract() {
  const { address, isConnected } = useAccount();
  const [lastMintedTokenId, setLastMintedTokenId] = useState<number | null>(null);

  // User balance
  const { data: balance } = useBalance({
    address,
    chainId: 41454, // Monad Testnet
  });

  // Contract reads
  const { data: totalSupply } = useReadContract({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    functionName: 'totalSupply',
    chainId: 41454,
  });

  const { data: maxSupply } = useReadContract({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    functionName: 'MAX_SUPPLY',
    chainId: 41454,
  });

  const { data: mintPrice } = useReadContract({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    functionName: 'mintPrice',
    chainId: 41454,
  });

  const { data: quantumPrice } = useReadContract({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    functionName: 'quantumPrice',
    chainId: 41454,
  });

  const { data: userBalance } = useReadContract({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
    chainId: 41454,
  });

  // Contract writes
  const {
    data: mintData,
    writeContract: mintWrite,
    isPending: isMintLoading,
    error: mintError,
  } = useWriteContract();

  const {
    data: quantumData,
    writeContract: quantumWrite,
    isPending: isQuantumLoading,
    error: quantumError,
  } = useWriteContract();

  // Transaction confirmations
  const { isLoading: isMintConfirming } = useWaitForTransactionReceipt({
    hash: mintData,
  });

  const { isLoading: isQuantumConfirming } = useWaitForTransactionReceipt({
    hash: quantumData,
  });

  // Contract stats
  const contractStats: ContractStats = {
    totalSupply: totalSupply ? Number(totalSupply) : 0,
    maxSupply: maxSupply ? Number(maxSupply) : 10000,
    mintPrice: mintPrice ? formatEther(mintPrice) : '0.1',
    quantumPrice: quantumPrice ? formatEther(quantumPrice) : '0.25',
    userBalance: userBalance ? Number(userBalance) : 0,
    isContractReady: MONARA_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
  };

  // Mint functions
  const mint = () => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    if (!contractStats.isContractReady) {
      throw new Error('Contract not deployed yet');
    }

    mintWrite({
      address: MONARA_CONTRACT_ADDRESS,
      abi: MONARA_ABI,
      functionName: 'mint',
      args: [address],
      value: parseEther(contractStats.mintPrice),
    });
  };

  const quantumGenesis = () => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    if (!contractStats.isContractReady) {
      throw new Error('Contract not deployed yet');
    }

    quantumWrite({
      address: MONARA_CONTRACT_ADDRESS,
      abi: MONARA_ABI,
      functionName: 'quantumGenesis',
      args: [address],
      value: parseEther(contractStats.quantumPrice),
    });
  };

  // Check if user has enough balance
  const hasEnoughBalance = (forQuantum = false) => {
    if (!balance) return false;
    
    const requiredAmount = parseEther(forQuantum ? contractStats.quantumPrice : contractStats.mintPrice);
    return balance.value >= requiredAmount;
  };

  // Get mint status
  const getMintStatus = () => {
    if (isMintLoading || isMintConfirming) return 'minting';
    if (isQuantumLoading || isQuantumConfirming) return 'quantum_minting';
    if (mintError || quantumError) return 'error';
    if (mintData && !isMintConfirming) return 'success';
    if (quantumData && !isQuantumConfirming) return 'quantum_success';
    return 'idle';
  };

  return {
    // Contract data
    contractStats,
    
    // User data
    userBalance: contractStats.userBalance,
    walletBalance: balance ? formatEther(balance.value) : '0',
    hasEnoughBalance,
    
    // Mint functions
    mint,
    quantumGenesis,
    
    // Transaction states
    isMintLoading: isMintLoading || isMintConfirming,
    isQuantumLoading: isQuantumLoading || isQuantumConfirming,
    mintError,
    quantumError,
    getMintStatus,
    
    // Transaction data
    lastMintTx: mintData || quantumData,
    lastMintedTokenId,
    
    // Utils
    isConnected,
    address,
  };
} 
