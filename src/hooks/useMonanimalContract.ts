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
  '0xd181dF3D2E8B8AB21bd49EFAf655a3AeFdd7c459') as `0x${string}`;

  // Debug contract address source
  console.log('🏭 Contract Configuration:', {
    fromEnv: process.env.NEXT_PUBLIC_MONARA_CONTRACT_ADDRESS,
    fromWagmiConfig: CONTRACT_ADDRESSES[MONAD_TESTNET_CHAIN_ID].MONARA_NFT,
    finalAddress: MONARA_CONTRACT_ADDRESS,
    isValid: MONARA_CONTRACT_ADDRESS.length === 42,
    isDeployedAddress: MONARA_CONTRACT_ADDRESS === '0xd181dF3D2E8B8AB21bd49EFAf655a3AeFdd7c459',
    chainId: process.env.NEXT_PUBLIC_CHAIN_ID || '10143'
  });

  // Force contract ready if we have the correct deployed address
  const isKnownDeployedAddress = MONARA_CONTRACT_ADDRESS === '0xd181dF3D2E8B8AB21bd49EFAf655a3AeFdd7c459';

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

  // User balance
  const { data: balance, error: balanceError } = useBalance({
    address,
    chainId: 10143, // Monad Testnet
  });

  // Contract reads
  const { data: totalSupply, error: totalSupplyError } = useReadContract({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    functionName: 'totalSupply',
    chainId: 10143,
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

  const { data: userBalance, error: userBalanceError } = useReadContract({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
    chainId: 10143,
  });

  // Additional contract status checks
  const { data: mintingActive } = useReadContract({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    functionName: 'mintingActive',
    chainId: 10143,
  });

  const { data: isPaused } = useReadContract({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    functionName: 'paused',
    chainId: 10143,
  });

  const { data: currentTokenId } = useReadContract({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    functionName: 'currentTokenId',
    chainId: 10143,
  });

  const { data: rateLimitInfo } = useReadContract({
    address: MONARA_CONTRACT_ADDRESS,
    abi: MONARA_ABI,
    functionName: 'getRateLimitInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
    chainId: 10143,
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

  // Contract readiness check
  const hasValidAddress = MONARA_CONTRACT_ADDRESS && 
    MONARA_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000' &&
    MONARA_CONTRACT_ADDRESS.length === 42;
  
  const hasContractData = totalSupply !== undefined || maxSupply !== undefined || mintPrice !== undefined;
  const hasNoMajorErrors = !totalSupplyError && !maxSupplyError && !mintPriceError;
  const isContractActive = mintingActive !== false && !isPaused; // Default to true if undefined
  
  console.log('🔍 Contract Readiness Check:', {
    hasValidAddress,
    hasContractData,
    hasNoMajorErrors,
    isContractActive,
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
    errors: contractErrors
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
          id: 1
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          const balanceWei = BigInt(data.result);
          const balanceFormatted = formatEther(balanceWei);
          console.log(`✅ Simple RPC balance fetch successful: ${balanceFormatted} MON`);
          return balanceWei;
        }
      }
    } catch (rpcError: any) {
      console.warn('⚠️ Simple RPC fetch failed:', rpcError.message);
    }

    // Method 3: Return null and let optimistic UI handle it
    console.log('❌ All balance fetch methods failed, returning null');
    return null;
  };

  // Enhanced balance checker with comprehensive fallback support
  const hasEnoughBalanceEnhanced = async (forQuantum = false): Promise<boolean> => {
    console.log('🔍 Enhanced balance check started:', { forQuantum, connected: isConnected, address });
    
    // Step 1: Try wagmi hook balance first
    if (balance?.value) {
      try {
        const result = hasEnoughBalance(forQuantum);
        if (result) {
          console.log('✅ Balance check passed via wagmi hook');
          return true;
        }
        console.log('📊 Wagmi balance insufficient, trying manual methods...');
      } catch (wagmiError: any) {
        console.warn('⚠️ Wagmi balance check error:', wagmiError.message);
      }
    } else {
      console.log('📊 No wagmi balance data, trying manual fetch...');
    }

    // Step 2: Manual balance fetch with comprehensive error handling
    try {
      console.log('🔄 Attempting manual balance fetch...');
      const manualBalance = await fetchBalanceManually();
      
      if (manualBalance !== null && manualBalance !== undefined) {
        const requiredPrice = forQuantum ? contractStats.quantumPrice : contractStats.mintPrice;
        const requiredAmount = parseEther(requiredPrice);
        const hasEnough = manualBalance >= requiredAmount;
        
        console.log('📊 Manual balance check result:', {
          manualBalance: formatEther(manualBalance),
          requiredPrice,
          hasEnough,
          balanceWei: manualBalance.toString(),
          requiredWei: requiredAmount.toString()
        });
        
        return hasEnough;
      } else {
        console.log('❌ Manual balance fetch returned null');
      }
    } catch (manualError: any) {
      console.warn('⚠️ Manual balance fetch error:', manualError.message);
      
      // Step 3: Try simplified balance check as last resort
      try {
        console.log('🔄 Trying simplified balance check as fallback...');
        
        // Use window.ethereum directly if available
        if (typeof window !== 'undefined' && window.ethereum && address) {
          const result = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [address, 'latest'],
          });
          
          if (result) {
            const simplifiedBalance = BigInt(result as string);
            const requiredPrice = forQuantum ? contractStats.quantumPrice : contractStats.mintPrice;
            const requiredAmount = parseEther(requiredPrice);
            const hasEnough = simplifiedBalance >= requiredAmount;
            
            console.log('📊 Simplified balance check result:', {
              balance: formatEther(simplifiedBalance),
              required: requiredPrice,
              hasEnough
            });
            
            return hasEnough;
          }
        }
      } catch (simplifiedError: any) {
        console.warn('⚠️ Simplified balance check also failed:', simplifiedError.message);
      }
    }

    // Don't fail completely - let optimistic UI handle it
    console.log('⚠️ All balance check methods failed, returning false but allowing optimistic proceed');
    return false;
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

  // Admin function to enable minting
  const {
    writeContract: enableMintingWrite,
    isPending: isEnablingMinting,
    error: enableMintingError,
  } = useWriteContract();

  const enableMinting = () => {
    enableMintingWrite({
      address: MONARA_CONTRACT_ADDRESS,
      abi: MONARA_ABI,
      functionName: 'setMintingActive',
      args: [true],
    });
  };

  return {
    // Contract data
    contractStats,
    
    // User data
    userBalance: contractStats.userBalance,
    walletBalance: balance ? formatEther(balance.value) : '0',
    hasEnoughBalance,
    checkBalanceAlternative,
    hasEnoughBalanceEnhanced,
    fetchBalanceManually,
    
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
    
    // Debug
    rawBalance: balance,
    balanceError,
    
    // Admin functions
    enableMinting,
    isEnablingMinting,
    enableMintingError,
  };
} 
