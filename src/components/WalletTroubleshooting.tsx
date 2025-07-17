'use client';

import React, { useState } from 'react';
import { 
  ExclamationTriangleIcon, 
  WifiIcon, 
  CogIcon, 
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface TroubleshootingStep {
  id: string;
  title: string;
  description: string;
  action?: string;
  completed?: boolean;
}

const troubleshootingSteps: TroubleshootingStep[] = [
  {
    id: 'wallet-installed',
    title: 'Check if MetaMask is installed',
    description: 'Make sure you have MetaMask or another Web3 wallet extension installed in your browser.',
    action: 'Install MetaMask'
  },
  {
    id: 'wallet-unlocked',
    title: 'Unlock your wallet',
    description: 'Your wallet must be unlocked and accessible to connect to the dApp.',
    action: 'Unlock Wallet'
  },
  {
    id: 'network-correct',
    title: 'Switch to Monad Testnet',
    description: 'Ensure your wallet is connected to the Monad Testnet network.',
    action: 'Switch Network'
  },
  {
    id: 'permissions',
    title: 'Grant permissions',
    description: 'Allow the website to connect to your wallet when prompted.',
    action: 'Connect Wallet'
  },
  {
    id: 'refresh',
    title: 'Refresh the page',
    description: 'If connections issues persist, try refreshing the page.',
    action: 'Refresh Page'
  }
];

interface WalletTroubleshootingProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletTroubleshooting({ isOpen, onClose }: WalletTroubleshootingProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const executeAction = (stepId: string) => {
    switch (stepId) {
      case 'wallet-installed':
        window.open('https://metamask.io/download/', '_blank');
        break;
      case 'wallet-unlocked':
        if (typeof window !== 'undefined' && window.ethereum) {
          window.ethereum.request({ method: 'eth_requestAccounts' });
        }
        break;
      case 'refresh':
        window.location.reload();
        break;
      default:
        break;
    }
    toggleStep(stepId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-2xl bg-gray-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Wallet Connection Issues?
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <p className="text-gray-300 text-sm mb-4">
              Follow these steps to resolve common wallet connection issues:
            </p>
            
            {troubleshootingSteps.map((step, index) => (
              <div key={step.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {completedSteps.has(step.id) ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-gray-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-400">{index + 1}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white mb-1">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-400 mb-2">
                      {step.description}
                    </p>
                    
                    {step.action && (
                      <button
                        onClick={() => executeAction(step.id)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
                      >
                        {step.action}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Common Issues */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h4 className="text-sm font-medium text-blue-400 mb-2">
              Still having issues?
            </h4>
            <div className="text-xs text-gray-300 space-y-1">
              <p>• Make sure you're using a supported browser (Chrome, Firefox, Edge)</p>
              <p>• Disable ad blockers that might interfere with Web3 connections</p>
              <p>• Try connecting with a different wallet if available</p>
              <p>• Clear your browser cache and cookies</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletTroubleshooting;