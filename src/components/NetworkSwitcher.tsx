'use client';

import { useState } from 'react';
import { useNetwork } from '@/hooks/useNetwork';
import { AlertTriangle, Plus, Check, ExternalLink } from 'lucide-react';

// Güncel Monad Testnet bilgileri
const MONAD_TESTNET_PARAMS = {
  chainId: '0x279f', // 10143 in hex
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: ['https://testnet-rpc.monad.xyz'],
  blockExplorerUrls: ['https://testnet.monadexplorer.com'],
  iconUrls: [], // optional
};

export function NetworkSwitcher() {
  const { isMonadNetwork, currentNetwork } = useNetwork();
  const [isAdding, setIsAdding] = useState(false);
  const [showAddSuccess, setShowAddSuccess] = useState(false);

  const addMonadNetwork = async () => {
    if (!window.ethereum) {
      alert('MetaMask not detected. Please install MetaMask first.');
      return;
    }

    setIsAdding(true);

    try {
      // Add network to MetaMask
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [MONAD_TESTNET_PARAMS],
      });

      setShowAddSuccess(true);
      setTimeout(() => setShowAddSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to add Monad network:', error);
      
      if (error && typeof error === 'object' && 'code' in error && error.code === 4001) {
        // User rejected the request
        alert('Network addition cancelled by user.');
              } else if (error && typeof error === 'object' && 'code' in error && error.code === -32602) {
        // Network already exists, try switching
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: MONAD_TESTNET_PARAMS.chainId }],
          });
          setShowAddSuccess(true);
          setTimeout(() => setShowAddSuccess(false), 3000);
        } catch (switchError) {
          console.error('Failed to switch to Monad network:', switchError);
          alert('Failed to switch to Monad network. Please try manually.');
        }
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        alert(`Failed to add Monad network: ${errorMessage}`);
      }
    } finally {
      setIsAdding(false);
    }
  };

  const switchNetwork = async () => {
    if (!window.ethereum) {
      alert('MetaMask not detected.');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MONAD_TESTNET_PARAMS.chainId }],
      });
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 4902) {
        // Network not added yet, add it
        await addMonadNetwork();
      } else {
        console.error('Failed to switch network:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        alert(`Failed to switch network: ${errorMessage}`);
      }
    }
  };

  if (isMonadNetwork) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
        <Check className="w-4 h-4 text-green-400" />
        <span className="text-green-300 text-sm font-medium">
          Connected to Monad Testnet
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Current Network Warning */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <AlertTriangle className="w-4 h-4 text-yellow-400" />
        <span className="text-yellow-300 text-sm">
          Currently on: {currentNetwork.name}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {/* Add Network Button */}
        <button
          onClick={addMonadNetwork}
          disabled={isAdding}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg font-medium transition-all duration-200"
        >
          {isAdding ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Adding to MetaMask...</span>
            </>
          ) : showAddSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Network Added!</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add Monad Testnet to MetaMask</span>
            </>
          )}
        </button>

        {/* Switch Network Button */}
        <button
          onClick={switchNetwork}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200"
        >
          <span>Switch to Monad Testnet</span>
        </button>
      </div>

      {/* Network Details */}
      <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg">
        <h4 className="text-sm font-medium text-white mb-2">Network Details:</h4>
        <div className="space-y-1 text-xs text-gray-300">
          <div className="flex justify-between">
            <span>Chain ID:</span>
            <span className="font-mono">10143 (0x279f)</span>
          </div>
          <div className="flex justify-between">
            <span>Currency:</span>
            <span>MON</span>
          </div>
          <div className="flex justify-between">
            <span>RPC URL:</span>
            <span className="font-mono">testnet-rpc.monad.xyz</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Explorer:</span>
            <a 
              href="https://testnet.monadexplorer.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-blue-400 hover:text-blue-300"
            >
              <span>View</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Faucet Link */}
      <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-blue-300 text-sm">Need MON tokens?</span>
          <a
            href="https://faucet.monad.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
          >
            <span>Get Testnet MON</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
} 