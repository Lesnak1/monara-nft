'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Sparkles, Zap, Settings, Info, ChevronDown, Loader2 } from 'lucide-react';
import NFTPreview from './NFTPreview';
import { useMonanimalContract } from '@/hooks/useMonanimalContract';
import { useNetwork } from '@/hooks/useNetwork';

const TRAIT_OPTIONS = {
  coreGeometry: ['Circle', 'Diamond', 'Hexagon', 'Octagon', 'Star', 'Triangle', 'Pentagon', 'Cross'],
  pathwayPattern: ['Linear', 'Curved', 'Spiral', 'Fractal', 'Wave'],
  particleSystem: ['Circles', 'Squares', 'Triangles', 'Diamonds', 'Stars', 'Hexagons'],
  networkDensity: [1, 2, 3, 4, 5],
};

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
    hasEnoughBalance 
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

  const randomizeTraits = () => {
    setSelectedTraits({
      coreGeometry: Math.floor(Math.random() * TRAIT_OPTIONS.coreGeometry.length),
      pathwayPattern: Math.floor(Math.random() * TRAIT_OPTIONS.pathwayPattern.length),
      particleSystem: Math.floor(Math.random() * TRAIT_OPTIONS.particleSystem.length),
      networkDensity: Math.floor(Math.random() * TRAIT_OPTIONS.networkDensity.length) + 1,
      mutation: Math.floor(Math.random() * 100),
    });
  };

  const handleMint = async () => {
    if (!isConnected || !address) return;
    
    if (!isMonadNetwork) {
      switchToMonadTestnet();
      return;
    }

    try {
      if (isQuantumMode) {
        await quantumGenesis();
      } else {
        await mint();
      }
    } catch (error) {
      console.error('Mint error:', error);
    }
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
          {/* Network Status */}
          {!isMonadNetwork && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Info className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-300 font-medium">Switch to Monad Testnet</span>
                </div>
                <button
                  onClick={switchToMonadTestnet}
                  disabled={isSwitching}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {isSwitching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Switch'}
                </button>
              </div>
            </div>
          )}

          {/* Genesis Type Selection */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Genesis Type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setIsQuantumMode(false)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  !isQuantumMode
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
                onClick={() => setIsQuantumMode(true)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isQuantumMode
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
              disabled={isLoading || !isMonadNetwork || !hasEnoughBalance(isQuantumMode)}
              className={`w-full px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                isQuantumMode
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white'
                  : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
              } ${!isLoading && isMonadNetwork ? 'hover:scale-105' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>
                    {mintStatus === 'minting' ? 'Minting Neural Genesis...' :
                     mintStatus === 'quantum_minting' ? 'Creating Quantum Genesis...' :
                     'Processing...'}
                  </span>
                </div>
              ) : !isMonadNetwork ? (
                'Switch to Monad Network'
              ) : !hasEnoughBalance(isQuantumMode) ? (
                `Insufficient Balance (${isQuantumMode ? contractStats.quantumPrice : contractStats.mintPrice} MON required)`
              ) : (
                <>
                  {isQuantumMode ? <Zap className="w-5 h-5 mr-2 inline" /> : <Sparkles className="w-5 h-5 mr-2 inline" />}
                  Mint {isQuantumMode ? 'Quantum' : 'Neural'} Genesis
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
              isQuantumGenesis={isQuantumMode}
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
                    {isQuantumMode ? '8%' : '3%'}
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