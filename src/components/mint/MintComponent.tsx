'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Sparkles, Zap, Settings, Info, ChevronDown, Loader2 } from 'lucide-react';
import NFTPreview from './NFTPreview';
import { useMonanimalContract } from '@/hooks/useMonanimalContract';
import { useNetwork } from '@/hooks/useNetwork';
import { NetworkSwitcher } from '@/components/NetworkSwitcher';
import { securityUtils, RATE_LIMITS, RateLimitError, ValidationError } from '@/lib/security';

const TRAIT_OPTIONS = {
  coreGeometry: ['Circle', 'Diamond', 'Hexagon', 'Octagon', 'Star', 'Triangle', 'Pentagon', 'Cross'],
  pathwayPattern: ['Linear', 'Curved', 'Spiral', 'Fractal', 'Wave'],
  particleSystem: ['Circles', 'Squares', 'Triangles', 'Diamonds', 'Stars', 'Hexagons'],
  networkDensity: [1, 2, 3, 4, 5],
};

interface MintState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  rateLimitInfo: {
    remaining: number;
    resetTime: number;
  };
}

export default function MintComponent() {
  const { address, isConnected } = useAccount();
  const { isMonadNetwork, switchToMonadTestnet, isSwitching } = useNetwork();
  const {
    contractStats,
    mint, 
    quantumGenesis, 
    isMintLoading, 
    isQuantumLoading, 
    getMintStatus,
    hasEnoughBalance,
    checkBalanceAlternative,
    hasEnoughBalanceEnhanced,
    fetchBalanceManually,
    walletBalance,
    rawBalance,
    balanceError
  } = useMonanimalContract();

  const [selectedTraits, setSelectedTraits] = useState({
    coreGeometry: 0,
    pathwayPattern: 0,
    particleSystem: 0,
    networkDensity: 1,
    mutation: 0,
  });

  const [isQuantumMode, setIsQuantumMode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [mintState, setMintState] = useState<MintState>({
    isLoading: false,
    error: null,
    success: false,
    rateLimitInfo: {
      remaining: RATE_LIMITS.MINT.maxAttempts,
      resetTime: 0,
    },
  });

  const [selectedType, setSelectedType] = useState<'neural' | 'quantum'>('neural');
  const [securityNonce, setSecurityNonce] = useState<string>('');

  // Randomize traits on mount
  useEffect(() => {
    setSelectedTraits({
      coreGeometry: Math.floor(Math.random() * TRAIT_OPTIONS.coreGeometry.length),
      pathwayPattern: Math.floor(Math.random() * TRAIT_OPTIONS.pathwayPattern.length),
      particleSystem: Math.floor(Math.random() * TRAIT_OPTIONS.particleSystem.length),
      networkDensity: Math.floor(Math.random() * TRAIT_OPTIONS.networkDensity.length) + 1,
      mutation: Math.floor(Math.random() * 100),
    });
  }, []);

  // Generate security nonce on mount
  useEffect(() => {
    setSecurityNonce(securityUtils.generateNonce());
  }, []);

  // Update rate limit info
  useEffect(() => {
    if (address) {
      const remaining = securityUtils.getRemainingAttempts(address, RATE_LIMITS.MINT);
      setMintState(prev => ({
        ...prev,
        rateLimitInfo: {
          remaining,
          resetTime: Date.now() + RATE_LIMITS.MINT.windowMs,
        },
      }));
    }
  }, [address]);

  // Security validation before minting
  const validateMintRequest = useCallback((): boolean => {
    try {
      // Check if user is connected
      if (!isConnected || !address) {
        throw new ValidationError('Wallet not connected');
      }

      // Validate mint parameters
      const validation = securityUtils.validateMintParams({
        type: selectedType,
        recipient: address,
      });

      if (!validation.isValid) {
        throw new ValidationError(validation.error || 'Invalid mint parameters');
      }

      // Check rate limiting
      if (!securityUtils.checkRateLimit(address, RATE_LIMITS.MINT)) {
        throw new RateLimitError('Too many mint attempts. Please wait before trying again.');
      }

      // Check contract readiness
      if (!contractStats.isContractReady) {
        throw new ValidationError('Contract not ready. Please wait.');
      }

      // Check supply limits
      if (contractStats.totalSupply && contractStats.maxSupply && contractStats.totalSupply >= contractStats.maxSupply) {
        throw new ValidationError('Maximum supply reached');
      }

      return true;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof RateLimitError) {
        setMintState(prev => ({ ...prev, error: error.message }));
      } else {
        setMintState(prev => ({ ...prev, error: 'Validation failed' }));
      }
      return false;
    }
  }, [isConnected, address, selectedType, contractStats.isContractReady, contractStats.totalSupply, contractStats.maxSupply]);

  const handleMint = useCallback(async () => {
    if (!isConnected || !address) return;
    
    if (!isMonadNetwork) {
      switchToMonadTestnet();
      return;
    }

    try {
      // Security validation
      if (!validateMintRequest()) {
        setMintState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Get mint price for balance validation
      const mintPrice = selectedType === 'neural' ? contractStats.mintPrice : contractStats.quantumPrice;
      if (!mintPrice) {
        throw new Error('Mint price not available');
      }

      // Enhanced balance validation with multiple fallback methods
      const isQuantumMint = selectedType === 'quantum';
      const requiredPrice = selectedType === 'neural' ? contractStats.mintPrice : contractStats.quantumPrice;
      
      console.log('🔍 Starting comprehensive balance validation:', {
        selectedType,
        isQuantumMint,
        requiredPrice,
        walletBalance,
        balanceError: balanceError?.message,
        rawBalance,
        balanceSymbol: rawBalance?.symbol,
        isMonadNetwork,
        rpcEndpoint: 'https://testnet-rpc.monad.xyz'
      });

      // Step 1: Standard wagmi balance check
      const balanceCheck = hasEnoughBalance(isQuantumMint);
      console.log('📊 Method 1 (wagmi):', balanceCheck);
      
      // Step 2: Alternative calculation check
      const alternativeCheck = checkBalanceAlternative(isQuantumMint);
      console.log('📊 Method 2 (alternative):', alternativeCheck);
      
      // Step 3: Enhanced check with manual RPC fallback (PRIMARY METHOD)
      let enhancedCheck = false;
      try {
        console.log('🔄 Attempting enhanced balance check with RPC fallback...');
        setMintState(prev => ({ ...prev, isLoading: true })); // Show loading during balance check
        enhancedCheck = await hasEnoughBalanceEnhanced(isQuantumMint);
        console.log('✅ Enhanced balance check result:', enhancedCheck);
      } catch (enhancedError: any) {
        console.error('❌ Enhanced balance check failed:', enhancedError.message);
        // Don't fail completely, continue with other methods
      }
      
      // Step 4: Manual balance fetch if all methods fail
      let manualCheck = false;
      if (!balanceCheck && !alternativeCheck && !enhancedCheck) {
        console.log('🔄 All methods failed, attempting direct manual balance fetch...');
        try {
          const manualBalance = await fetchBalanceManually();
          if (manualBalance) {
            const requiredAmount = parseEther(requiredPrice);
            manualCheck = manualBalance >= requiredAmount;
            console.log('💰 Manual balance check:', {
              balance: formatEther(manualBalance),
              required: requiredPrice,
              hasEnough: manualCheck
            });
          }
        } catch (manualError: any) {
          console.error('❌ Manual balance fetch failed:', manualError.message);
        }
      }
      
      // Final balance decision with priority order
      const finalBalanceCheck = enhancedCheck || balanceCheck || alternativeCheck || manualCheck;
      
      console.log('📋 Final balance validation summary:', {
        method1_wagmi: balanceCheck,
        method2_alternative: alternativeCheck,
        method3_enhanced: enhancedCheck,
        method4_manual: manualCheck,
        finalDecision: finalBalanceCheck,
        userHasBalance: walletBalance !== '0',
        requiredPrice,
        networkConnected: isMonadNetwork
      });
      
      if (!finalBalanceCheck) {
        // Show user-friendly warning instead of hard error
        console.warn('⚠️ Could not verify balance, but proceeding with optimistic approach');
        
        // Check if we have any balance information at all
        const hasAnyBalanceInfo = walletBalance !== '0' || (rawBalance && rawBalance.value > 0n);
        
        if (!hasAnyBalanceInfo) {
          // Only fail if we're certain there's no balance
          const errorMessage = `Unable to verify MON balance. Please ensure you have ${requiredPrice} MON and try again. Get MON from https://faucet.monad.xyz`;
          console.error('💸 No balance detected:', errorMessage);
          throw new Error(errorMessage);
        } else {
          // Let user proceed with optimistic UI - MetaMask will reject if insufficient
          console.log('🎯 Proceeding with optimistic mint - MetaMask will validate balance');
        }
      }

      console.log(`🚀 Initiating ${selectedType} mint with nonce: ${securityNonce}`);
      console.log(`💰 Price: ${mintPrice} MON`);
      console.log(`👤 Address: ${address}`);

      // Show loading state before mint
      setMintState(prev => ({ ...prev, isLoading: true, error: null }));

      // Execute mint based on type with proper error handling
      try {
        console.log('🔄 Calling mint function, this should trigger MetaMask...');
        
      if (selectedType === 'neural') {
          console.log('🧠 Executing neuralGenesis...');
        await mint();
      } else {
          console.log('⚡ Executing quantumGenesis...');
        await quantumGenesis();
      }

      console.log(`✅ Mint transaction initiated successfully`);
      } catch (mintExecutionError: any) {
        console.error('❌ Mint execution failed:', mintExecutionError);
        
        // Check if error is user rejection vs other issues
        if (mintExecutionError?.message?.includes('rejected') || 
            mintExecutionError?.code === 4001) {
          throw new Error('Transaction rejected by user');
        } else if (mintExecutionError?.message?.includes('insufficient')) {
          throw new Error('Insufficient funds for gas fees');
        } else {
          throw new Error(`Mint execution failed: ${mintExecutionError?.message || 'Unknown error'}`);
        }
      }

      // Update rate limit info
      const remaining = securityUtils.getRemainingAttempts(address!, RATE_LIMITS.MINT);
      setMintState(prev => ({
        ...prev,
        isLoading: false,
        success: true,
        error: null,
        rateLimitInfo: {
          ...prev.rateLimitInfo,
          remaining,
        },
      }));

      // Generate new nonce for next transaction
      setSecurityNonce(securityUtils.generateNonce());

    } catch (error: any) {
      console.error('❌ Mint failed:', error);
      
      let errorMessage = 'Minting failed';
      
      if (error.message?.includes('User rejected')) {
        errorMessage = 'Transaction rejected by user';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for transaction';
      } else if (error.message?.includes('gas')) {
        errorMessage = 'Gas estimation failed. Please try again.';
      } else if (error.message) {
        // Sanitize error message to prevent XSS
        const sanitizedMessage = securityUtils.sanitizeHtml(error.message);
        errorMessage = sanitizedMessage.substring(0, 200); // Limit error message length
      }

      setMintState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        success: false,
      }));
    }
  }, [
    validateMintRequest,
    isMonadNetwork,
    switchToMonadTestnet,
    address,
    selectedType,
    contractStats.isContractReady,
    contractStats.totalSupply,
    contractStats.maxSupply,
    walletBalance,
    contractStats.mintPrice,
    contractStats.quantumPrice,
    mint,
    quantumGenesis,
    securityNonce,
  ]);

  // Clear error after 10 seconds
  useEffect(() => {
    if (mintState.error) {
      const timer = setTimeout(() => {
        setMintState(prev => ({ ...prev, error: null }));
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [mintState.error]);

  // Cleanup rate limit store periodically
  useEffect(() => {
    const interval = setInterval(() => {
      securityUtils.cleanupRateLimit();
    }, 60000); // Clean every minute

    return () => clearInterval(interval);
  }, []);

  const randomizeTraits = () => {
    setSelectedTraits({
      coreGeometry: Math.floor(Math.random() * TRAIT_OPTIONS.coreGeometry.length),
      pathwayPattern: Math.floor(Math.random() * TRAIT_OPTIONS.pathwayPattern.length),
      particleSystem: Math.floor(Math.random() * TRAIT_OPTIONS.particleSystem.length),
      networkDensity: Math.floor(Math.random() * TRAIT_OPTIONS.networkDensity.length) + 1,
      mutation: Math.floor(Math.random() * 100),
    });
  };

  const mintStatus = getMintStatus();
  const isLoading = isMintLoading || isQuantumLoading || isSwitching;

  if (!isConnected) {
  return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 text-center">
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Connect Your Wallet
            </h2>
            <p className="text-white/70 max-w-md mx-auto">
              Connect your wallet to start minting your evolving digital being on Monad Network.
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column - Controls */}
        <div className="space-y-6">
          {/* Network Status - Enhanced */}
          {!isMonadNetwork && (
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-yellow-300 mb-4">Network Setup Required</h3>
              <NetworkSwitcher />
            </div>
          )}

          {/* Contract Status */}
          {isMonadNetwork && !contractStats.isContractReady && (
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-orange-300 mb-2">Contract Not Deployed</h3>
              <p className="text-white/70">
                The MONARA contract hasn't been deployed to Monad Testnet yet. 
                This is a preview of the minting interface.
              </p>
            </div>
          )}

          {/* Enhanced Debug Info */}
          {isMonadNetwork && isConnected && (
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-blue-300 mb-2">Debug Info</h3>
              <div className="space-y-1 text-xs text-white/70">
                <div>Wallet Balance: {walletBalance} MON {balanceError && '⚠️'}</div>
                <div>Neural Genesis Price: {contractStats.mintPrice} MON</div>
                <div>Quantum Genesis Price: {contractStats.quantumPrice} MON</div>
                <div>Contract Ready: {contractStats.isContractReady ? '✅ Yes' : '❌ No'}</div>
                <div>Minting Active: {contractStats.mintingActive ? '✅ Yes' : '❌ No'}</div>
                <div>Contract Paused: {contractStats.isPaused ? '⏸️ Yes' : '▶️ No'}</div>
                <div>Total Supply: {contractStats.totalSupply}</div>
                <div>Current Token ID: {contractStats.currentTokenId}</div>
                {balanceError && (
                  <div className="text-red-400">Balance Error: {balanceError.message}</div>
                )}
                {contractStats.rateLimitInfo && (
                  <div>Rate Limit: {contractStats.rateLimitInfo.mintsInCurrentWindow}/10 (Can Mint: {contractStats.rateLimitInfo.canMint ? 'Yes' : 'No'})</div>
                )}
                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={async () => {
                      console.log('🔄 Manual balance refresh triggered');
                      try {
                        const balance = await fetchBalanceManually();
                        if (balance) {
                          const formattedBalance = formatEther(balance);
                          console.log('✅ Manual refresh successful:', formattedBalance, 'MON');
                          alert(`Balance refreshed: ${formattedBalance} MON`);
                        } else {
                          console.log('❌ Manual refresh failed');
                          alert('Balance refresh failed. Please check network connection.');
                        }
                      } catch (error: any) {
                        console.error('❌ Manual refresh error:', error.message);
                        alert(`Balance refresh error: ${error.message}`);
                      }
                    }}
                    className="text-blue-400 hover:text-blue-300 underline text-xs"
                  >
                    🔄 Refresh Balance Manually
                  </button>
                  <div className="mt-1">
                    <button
                      onClick={() => {
                                                 console.log('🔧 Debug info:', {
                           isConnected,
                           address,
                           walletBalance,
                           contractStats,
                           balanceError: balanceError?.message,
                           rawBalance,
                           balanceValue: rawBalance?.value?.toString(),
                           balanceFormatted: rawBalance?.formatted
                         });
                      }}
                      className="text-gray-400 hover:text-gray-300 underline text-xs"
                    >
                      🔧 Show Debug Info
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Genesis Type Selection */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Genesis Type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedType('neural')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedType === 'neural'
                    ? 'border-purple-500 bg-purple-500 bg-opacity-10'
                    : 'border-white border-opacity-20 hover:border-opacity-30'
                }`}
              >
                <div className="text-left space-y-2">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span className="font-semibold text-white">Neural Genesis</span>
                  </div>
                  <p className="text-sm text-white/70">
                    Standard evolution path with 3% mutation chance
                </p>
                  <p className="text-lg font-bold text-purple-400">
                    {contractStats.mintPrice} MON
                  </p>
                </div>
              </button>

              <button
                onClick={() => setSelectedType('quantum')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedType === 'quantum'
                    ? 'border-emerald-500 bg-emerald-500 bg-opacity-10'
                    : 'border-white border-opacity-20 hover:border-opacity-30'
                }`}
              >
                <div className="text-left space-y-2">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    <span className="font-semibold text-white">Quantum Genesis</span>
                  </div>
                  <p className="text-sm text-white/70">
                    Enhanced evolution with 8% mutation chance
                </p>
                  <p className="text-lg font-bold text-emerald-400">
                    {contractStats.quantumPrice} MON
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Advanced Controls */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-xl font-bold text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Advanced Settings
              </h3>
              <ChevronDown className={`w-5 h-5 text-white/60 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>

            {showAdvanced && (
              <div className="mt-6 space-y-4">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-white/80">
                    Core Geometry
                  </label>
                  <select
                    value={selectedTraits.coreGeometry}
                    onChange={(e) => setSelectedTraits(prev => ({ ...prev, coreGeometry: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                    {TRAIT_OPTIONS.coreGeometry.map((option, index) => (
                      <option key={index} value={index} className="bg-slate-800">
                        {option}
                      </option>
                    ))}
                  </select>
            </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-white/80">
                    Pathway Pattern
                  </label>
                  <select
                    value={selectedTraits.pathwayPattern}
                    onChange={(e) => setSelectedTraits(prev => ({ ...prev, pathwayPattern: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {TRAIT_OPTIONS.pathwayPattern.map((option, index) => (
                      <option key={index} value={index} className="bg-slate-800">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-white/80">
                    Particle System
                        </label>
                  <select
                    value={selectedTraits.particleSystem}
                    onChange={(e) => setSelectedTraits(prev => ({ ...prev, particleSystem: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {TRAIT_OPTIONS.particleSystem.map((option, index) => (
                      <option key={index} value={index} className="bg-slate-800">
                        {option}
                      </option>
                    ))}
                  </select>
                      </div>

                <button
                  onClick={randomizeTraits}
                  className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-colors"
                >
                  🎲 Randomize Traits
                </button>
              </div>
            )}
          </div>

          {/* Mint Button */}
          <div className="space-y-4">
            <button
              onClick={handleMint}
              disabled={
                mintState.isLoading || 
                isMintLoading || 
                isQuantumLoading ||
                !isMonadNetwork || 
                !contractStats.isContractReady || 
                !contractStats.mintingActive ||
                contractStats.isPaused ||
                mintState.rateLimitInfo.remaining <= 0 ||
                !isConnected ||
                !address
              }
              className={`w-full px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                mintState.isLoading || isMintLoading || isQuantumLoading || !isMonadNetwork || !contractStats.isContractReady || mintState.rateLimitInfo.remaining <= 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : selectedType === 'neural'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
                  : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white'
              } ${!(isMintLoading || isQuantumLoading) && isMonadNetwork ? 'hover:scale-105' : ''}`}
            >
              {mintState.isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>
                    {mintStatus === 'minting' ? 'Minting Neural Genesis...' :
                     mintStatus === 'quantum_minting' ? 'Creating Quantum Genesis...' :
                     'Processing...'}
                  </span>
                </div>
              ) : !isConnected ? (
                'Wallet Not Connected'
              ) : !address ? (
                'No Address Found'  
              ) : !isMonadNetwork ? (
                'Switch to Monad Network'
              ) : !contractStats.isContractReady ? (
                'Contract Not Ready'
              ) : !contractStats.mintingActive ? (
                'Minting is Disabled'
              ) : contractStats.isPaused ? (
                'Contract is Paused'
              ) : mintState.rateLimitInfo.remaining <= 0 ? (
                'Rate Limit Reached'
              ) : (
                <>
                  {selectedType === 'neural' ? <Sparkles className="w-5 h-5 mr-2 inline" /> : <Zap className="w-5 h-5 mr-2 inline" />}
                  Mint {selectedType === 'neural' ? 'Neural' : 'Quantum'} Genesis
                  {balanceError && <span className="text-xs ml-2">⚠️ Network Issue</span>}
                </>
              )}
            </button>

            {/* Collection Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-lg font-bold text-white">
                  {contractStats.totalSupply.toLocaleString()}
                </div>
                <div className="text-sm text-white/60">Minted</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-lg font-bold text-white">
                  {(contractStats.maxSupply - contractStats.totalSupply).toLocaleString()}
                </div>
                <div className="text-sm text-white/60">Remaining</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - NFT Preview */}
        <div className="flex justify-center lg:justify-start">
          <div className="w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Preview Your Being
            </h3>
            <NFTPreview
              coreGeometry={selectedTraits.coreGeometry}
              pathwayPattern={selectedTraits.pathwayPattern}
              particleSystem={selectedTraits.particleSystem}
              networkDensity={selectedTraits.networkDensity}
              mutation={selectedTraits.mutation}
              isQuantumGenesis={selectedType === 'quantum'}
              evolutionStage={1}
              className="w-full"
            />
            
            {/* Trait Display */}
            <div className="mt-6 space-y-3">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Evolution Stage</span>
                  <span className="text-white font-medium">Genesis (Stage 1)</span>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Mutation Chance</span>
                  <span className="text-white font-medium">
                    {selectedType === 'quantum' ? '8%' : '3%'}
                  </span>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Network Density</span>
                  <span className="text-white font-medium">
                    {selectedTraits.networkDensity}/5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}