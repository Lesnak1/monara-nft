'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  useAccount, 
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt,
  useBalance,
  useWatchContractEvent
} from 'wagmi';
import { parseEther, formatEther, isAddress } from 'viem';
import { CONTRACT_ADDRESSES, MONAD_TESTNET_CHAIN_ID } from '@/lib/wagmi';

// Gerçek MONARA contract ABI (genişletilmiş)
const MONARA_ABI = [
  {
    inputs: [],
    name: 'neuralGenesis',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'quantumGenesis',
    outputs: [],
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
    name: 'NEURAL_GENESIS_PRICE',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'QUANTUM_GENESIS_PRICE',
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
  {
    inputs: [],
    name: 'currentTokenId',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintingActive',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getRateLimitInfo',
    outputs: [
      { name: 'mintsInCurrentWindow', type: 'uint256' },
      { name: 'windowStart', type: 'uint256' },
      { name: 'lastMint', type: 'uint256' },
      { name: 'canMint', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function',
  },
  // Admin function to enable minting
  {
    inputs: [{ name: 'active', type: 'bool' }],
    name: 'setMintingActive',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  ] as const;

// Deploy edilen contract address - MONARA Monad Testnet
const MONARA_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_MONARA_CONTRACT_ADDRESS || 
  CONTRACT_ADDRESSES[MONAD_TESTNET_CHAIN_ID].MONARA_NFT ||
  '0xa7793FfC44680c03dC18ab0972b2a96A20d82335') as `0x${string}`;

  // Debug contract address source
  console.log('🏭 Contract Configuration:', {
    fromEnv: process.env.NEXT_PUBLIC_MONARA_CONTRACT_ADDRESS,
    fromWagmiConfig: CONTRACT_ADDRESSES[MONAD_TESTNET_CHAIN_ID].MONARA_NFT,
    finalAddress: MONARA_CONTRACT_ADDRESS,
    isValid: MONARA_CONTRACT_ADDRESS.length === 42,
      isDeployedAddress: MONARA_CONTRACT_ADDRESS === '0xa7793FfC44680c03dC18ab0972b2a96A20d82335',
    chainId: process.env.NEXT_PUBLIC_CHAIN_ID || '10143'
  });

  // Force contract ready if we have the correct deployed address
  const isKnownDeployedAddress = MONARA_CONTRACT_ADDRESS === '0xa7793FfC44680c03dC18ab0972b2a96A20d82335';

export interface ContractStats {
  totalSupply: number;
  maxSupply: number;
  mintPrice: string;
  quantumPrice: string;
  userBalance: number;
  isContractReady: boolean;
  mintingActive: boolean;
  isPaused: boolean;
  currentTokenId: number;
  rateLimitInfo?: {
    mintsInCurrentWindow: number;
    windowStart: number;
    lastMint: number;
    canMint: boolean;
  };
}

export function useMonanimalContract() {
  const { address, isConnected } = useAccount();
  const [lastMintedTokenId, setLastMintedTokenId] = useState<number | null>(null);
  const [statsRefreshTrigger, setStatsRefreshTrigger] = useState(0);

  // Force refresh function
  const refreshStats = useCallback(() => {
    setStatsRefreshTrigger(prev => prev + 1);
    console.log('🔄 Manually refreshing contract stats...');
  }, []);

  // User balance
  const { data: balance, error: balanceError, refetch: refetchBalance } = useBalance({
    address,
    chainId: 10143, // Monad Testnet
  });

  // Contract reads with automatic refetch
  const { data: totalSupply, error: totalSupplyError, refetch: refetchTotalSupply } = useReadContract({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    functionName: 'totalSupply',
    chainId: 10143,
    query: {
      refetchInterval: 10000, // Refetch every 10 seconds
      staleTime: 5000, // Consider data stale after 5 seconds
    }
  });

  const { data: maxSupply, error: maxSupplyError } = useReadContract({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    functionName: 'MAX_SUPPLY',
    chainId: 10143,
  });

  const { data: mintPrice, error: mintPriceError } = useReadContract({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    functionName: 'NEURAL_GENESIS_PRICE',
    chainId: 10143,
  });

  const { data: quantumPrice, error: quantumPriceError } = useReadContract({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    functionName: 'QUANTUM_GENESIS_PRICE',
    chainId: 10143,
  });

  const { data: userBalance, error: userBalanceError, refetch: refetchUserBalance } = useReadContract({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000, // Refetch every 10 seconds
    },
    chainId: 10143,
  });

  // Additional contract status checks
  const { data: mintingActive, refetch: refetchMintingActive } = useReadContract({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    functionName: 'mintingActive',
    chainId: 10143,
    query: {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  });

  const { data: isPaused, refetch: refetchPaused } = useReadContract({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    functionName: 'paused',
    chainId: 10143,
    query: {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  });

  const { data: currentTokenId, refetch: refetchCurrentTokenId } = useReadContract({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    functionName: 'currentTokenId',
    chainId: 10143,
    query: {
      refetchInterval: 5000, // Refetch every 5 seconds
    }
  });

  // Rate limit info
  const { data: rateLimitInfo } = useReadContract({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    functionName: 'getRateLimitInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 15000, // Refetch every 15 seconds
    },
    chainId: 10143,
  });

  // Listen to DigitalBeingCreated events for real-time updates
  useWatchContractEvent({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    eventName: 'DigitalBeingCreated',
    chainId: 10143,
    onLogs: (logs) => {
      console.log('🎉 New MONARA minted!', logs);
      
      // Extract token ID from the latest log
      if (logs.length > 0) {
        const latestLog = logs[logs.length - 1] as any;
        if (latestLog.args?.tokenId) {
          const newTokenId = Number(latestLog.args.tokenId);
          setLastMintedTokenId(newTokenId);
          console.log(`✨ MONARA #${newTokenId} has been born!`);
        }
      }

      // Refresh all relevant data immediately
      setTimeout(() => {
        refetchTotalSupply();
        refetchCurrentTokenId();
        refetchUserBalance();
        refetchBalance();
        refreshStats();
      }, 1000); // Small delay to ensure blockchain state is updated
    },
  });

  // Listen to Transfer events for ownership changes
  useWatchContractEvent({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    eventName: 'Transfer',
    chainId: 10143,
    onLogs: (logs) => {
      console.log('🔄 Transfer event detected', logs);
      
      // Check if user is involved in any transfer
      const userInvolved = logs.some(log => {
        const logWithArgs = log as any;
        return (logWithArgs.args?.from === address || logWithArgs.args?.to === address);
      });
      
      if (userInvolved) {
        console.log('👤 User involved in transfer, refreshing balance...');
        setTimeout(() => {
          refetchUserBalance();
          refetchBalance();
        }, 1000);
      }
    },
  });

  // Mint functions
  const {
    data: mintHash,
    isPending: isMintLoading,
    writeContract: mintWrite,
    error: mintError,
    reset: resetMint
  } = useWriteContract();

  const {
    data: quantumHash,
    isPending: isQuantumLoading,
    writeContract: quantumWrite,
    error: quantumError,
    reset: resetQuantum
  } = useWriteContract();

  // Wait for transaction confirmations
  const { isLoading: isMintConfirming, isSuccess: isMintSuccess } = useWaitForTransactionReceipt({
    hash: mintHash,
  });

  const { isLoading: isQuantumConfirming, isSuccess: isQuantumSuccess } = useWaitForTransactionReceipt({
    hash: quantumHash,
  });

  // Auto-refresh stats when transactions complete
  useEffect(() => {
    if (isMintSuccess || isQuantumSuccess) {
      console.log('✅ Transaction confirmed, refreshing stats...');
      setTimeout(() => {
        refetchTotalSupply();
        refetchCurrentTokenId();
        refetchUserBalance();
        refetchBalance();
        refreshStats();
      }, 2000);
    }
  }, [isMintSuccess, isQuantumSuccess, refetchTotalSupply, refetchCurrentTokenId, refetchUserBalance, refetchBalance, refreshStats]);

  // Auto-refresh on statsRefreshTrigger change
  useEffect(() => {
    if (statsRefreshTrigger > 0) {
      refetchTotalSupply();
      refetchCurrentTokenId();
      refetchUserBalance();
      refetchBalance();
      refetchMintingActive();
      refetchPaused();
    }
  }, [statsRefreshTrigger, refetchTotalSupply, refetchCurrentTokenId, refetchUserBalance, refetchBalance, refetchMintingActive, refetchPaused]);

  // Contract validation
  const hasValidAddress = isAddress(MONARA_CONTRACT_ADDRESS);
  const hasContractData = !!(totalSupply || maxSupply || mintPrice);
  const hasNoMajorErrors = !totalSupplyError && !maxSupplyError && !mintPriceError;
  const isContractActive = hasValidAddress && hasContractData && hasNoMajorErrors;
  
  // Log contract status for debugging
  console.log('📊 Contract Connection Status:', {
    address: MONARA_CONTRACT_ADDRESS,
    hasValidAddress,
    hasContractData,
    hasNoMajorErrors,
    isContractActive,
    isKnownDeployedAddress,
    totalSupply: totalSupply?.toString(),
    currentTokenId: currentTokenId?.toString(),
    mintingActive,
    isPaused,
    totalSupplyError: totalSupplyError?.message,
    maxSupplyError: maxSupplyError?.message,
    mintPriceError: mintPriceError?.message
  });
  
  // Contract stats
  const contractStats: ContractStats = {
    totalSupply: totalSupply ? Number(totalSupply) : 0,
    maxSupply: maxSupply ? Number(maxSupply) : 10000,
    mintPrice: mintPrice ? formatEther(mintPrice) : '0.1',
    quantumPrice: quantumPrice ? formatEther(quantumPrice) : '0.25',
    userBalance: userBalance ? Number(userBalance) : 0,
    isContractReady: hasValidAddress || isKnownDeployedAddress, // Valid address or known deployed contract
    mintingActive: mintingActive !== false, // Default to true if undefined
    isPaused: isPaused || false,
    currentTokenId: currentTokenId ? Number(currentTokenId) : 1,
    rateLimitInfo: rateLimitInfo ? {
      mintsInCurrentWindow: Number(rateLimitInfo[0]),
      windowStart: Number(rateLimitInfo[1]),
      lastMint: Number(rateLimitInfo[2]),
      canMint: Boolean(rateLimitInfo[3])
    } : undefined,
  };

  // Check for contract errors
  const contractErrors = {
    balanceError,
    totalSupplyError,
    maxSupplyError,
    mintPriceError,
    quantumPriceError,
    userBalanceError
  };

  // Debug contract stats and errors
  console.log('📊 Contract Stats:', {
    contractAddress: MONARA_CONTRACT_ADDRESS,
    hasValidAddress,
    hasContractData,
    hasNoMajorErrors,
    isContractActive,
    totalSupply: totalSupply?.toString(),
    maxSupply: maxSupply?.toString(),
    mintPriceRaw: mintPrice?.toString(),
    quantumPriceRaw: quantumPrice?.toString(),
    mintPriceFormatted: contractStats.mintPrice,
    quantumPriceFormatted: contractStats.quantumPrice,
    userBalanceRaw: userBalance?.toString(),
    userBalanceFormatted: contractStats.userBalance,
    walletBalance: balance ? formatEther(balance.value) : 'N/A',
    isContractReady: contractStats.isContractReady,
    mintingActive: contractStats.mintingActive,
    isPaused: contractStats.isPaused,
    currentTokenId: contractStats.currentTokenId,
    rateLimitInfo: contractStats.rateLimitInfo,
    errors: contractErrors,
    lastMintedTokenId
  });

  // Log any contract errors
  Object.entries(contractErrors).forEach(([key, error]) => {
    if (error) {
      console.error(`❌ Contract Error (${key}):`, error);
    }
  });

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
      functionName: 'neuralGenesis',
      args: [],
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
      args: [],
      value: parseEther(contractStats.quantumPrice),
    });
  };

  // Check if user has enough balance with detailed logging
  const hasEnoughBalance = (forQuantum = false) => {
    if (!balance || !balance.value) {
      console.log('🚫 No balance data available:', { balance, hasBalance: !!balance });
      return false;
    }
    
    const requiredPrice = forQuantum ? contractStats.quantumPrice : contractStats.mintPrice;
    const requiredAmount = parseEther(requiredPrice);
    const userBalance = balance.value;
    
    console.log('💰 Balance Check:', {
      userBalance: formatEther(userBalance),
      requiredPrice: requiredPrice,
      requiredAmount: formatEther(requiredAmount),
      forQuantum,
      balanceWei: userBalance.toString(),
      requiredWei: requiredAmount.toString(),
      hasEnough: userBalance >= requiredAmount,
      balanceSymbol: balance.symbol,
      balanceDecimals: balance.decimals
    });
    
    // Additional safeguard - check if balance is actually positive
    if (userBalance <= 0n) {
      console.log('🚫 User balance is zero or negative');
      return false;
    }
    
    // Convert to numbers for additional logging
    const userBalanceFloat = parseFloat(formatEther(userBalance));
    const requiredFloat = parseFloat(requiredPrice);
    
    console.log('📊 Numeric comparison:', {
      userBalanceFloat,
      requiredFloat,
      difference: userBalanceFloat - requiredFloat,
      hasEnoughNumeric: userBalanceFloat >= requiredFloat
    });
    
    return userBalance >= requiredAmount;
  };

  // Alternative balance checker for debugging
  const checkBalanceAlternative = (forQuantum = false) => {
    if (!balance?.value) return false;
    
    const priceString = forQuantum ? contractStats.quantumPrice : contractStats.mintPrice;
    const userBalanceString = formatEther(balance.value);
    
    const price = parseFloat(priceString);
    const userBal = parseFloat(userBalanceString);
    
    console.log('🔄 Alternative balance check:', {
      userBalanceString,
      priceString,
      userBal,
      price,
      hasEnough: userBal >= price
    });
    
    return userBal >= price;
  };

  // Simplified balance fetch using MetaMask directly (CORS bypass)
  const fetchBalanceManually = async (): Promise<bigint | null> => {
    if (!address) return null;

    console.log('🔄 Starting simplified balance fetch via MetaMask...');

    // Method 1: Direct MetaMask call (bypasses CORS)
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        console.log('📱 Attempting balance fetch via MetaMask provider...');
        
        const result = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest'],
        });
        
        if (result) {
          const balanceWei = BigInt(result as string);
          const balanceFormatted = formatEther(balanceWei);
          console.log(`✅ MetaMask balance fetch successful: ${balanceFormatted} MON`);
          return balanceWei;
        }
      }
    } catch (metamaskError: any) {
      console.warn('⚠️ MetaMask balance fetch failed:', metamaskError.message);
    }

    // Method 2: Try a single reliable RPC with simpler approach
    try {
      console.log('🔄 Fallback: Trying primary RPC with simplified headers...');
      
      const response = await fetch('https://testnet-rpc.monad.xyz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [address, 'latest'],
          id: 1,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          const balanceWei = BigInt(data.result);
          const balanceFormatted = formatEther(balanceWei);
          console.log(`✅ Direct RPC balance fetch successful: ${balanceFormatted} MON`);
          return balanceWei;
        }
      }
    } catch (rpcError: any) {
      console.warn('⚠️ Direct RPC balance fetch failed:', rpcError.message);
    }

    console.error('❌ All balance fetch methods failed');
    return null;
  };

  // Enhanced balance check with all fallback methods
  const hasEnoughBalanceEnhanced = async (forQuantum = false): Promise<boolean> => {
    console.log('🔍 Starting enhanced balance check...');
    
    const requiredPrice = forQuantum ? contractStats.quantumPrice : contractStats.mintPrice;
    const requiredAmount = parseEther(requiredPrice);
    
    // Method 1: Try wagmi balance
    if (balance?.value) {
      const hasEnough = balance.value >= requiredAmount;
      console.log('💰 Wagmi balance check:', {
        balance: formatEther(balance.value),
        required: requiredPrice,
        hasEnough
      });
      
      if (hasEnough) return true;
    }
    
    // Method 2: Try manual fetch
    const manualBalance = await fetchBalanceManually();
    if (manualBalance) {
      const hasEnough = manualBalance >= requiredAmount;
      console.log('🔄 Manual balance check:', {
        balance: formatEther(manualBalance),
        required: requiredPrice,
        hasEnough
      });
      
      return hasEnough;
    }
    
    console.warn('⚠️ Could not verify balance through any method');
    return false;
  };

  // Get mint status
  const getMintStatus = () => {
    if (isMintLoading || isMintConfirming) return 'minting';
    if (isQuantumLoading || isQuantumConfirming) return 'quantum_minting';
    if (isMintSuccess) return 'mint_success';
    if (isQuantumSuccess) return 'quantum_success';
    return 'idle';
  };

  // Enable minting helper
  const enableMinting = () => {
    resetMint();
    resetQuantum();
  };

  return {
    // Contract data
    contractStats,
    lastMintedTokenId,
    
    // User data
    walletBalance: balance ? formatEther(balance.value) : '0',
    rawBalance: balance,
    
    // Balance checking
    hasEnoughBalance,
    checkBalanceAlternative,
    hasEnoughBalanceEnhanced,
    fetchBalanceManually,
    
    // Minting functions
    mint,
    quantumGenesis,
    
    // Transaction status
    isMintLoading: isMintLoading || isMintConfirming,
    isQuantumLoading: isQuantumLoading || isQuantumConfirming,
    isMintSuccess,
    isQuantumSuccess,
    mintError,
    quantumError,
    getMintStatus,
    enableMinting,
    
    // Manual refresh
    refreshStats,
    
    // Individual refetch functions
    refetchBalance,
    refetchTotalSupply,
    refetchUserBalance,
    refetchCurrentTokenId,
    
    // Errors
    balanceError,
    contractErrors
  };
} 
