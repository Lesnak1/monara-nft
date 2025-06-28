'use client';

import React, { useState } from 'react';
import { AlertTriangle, Shield, CheckCircle, ExternalLink, Copy, RefreshCw } from 'lucide-react';

export function AuthorizationGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const steps = [
    {
      title: 'Open MetaMask Extension',
      description: 'Click on the MetaMask extension icon in your browser',
      icon: Shield,
      action: 'Click the MetaMask fox icon in your browser toolbar'
    },
    {
      title: 'Go to Settings',
      description: 'Click on your account avatar, then select "Settings"',
      icon: Shield,
      action: 'Avatar → Settings → Connections'
    },
    {
      title: 'Manage Connected Sites',
      description: 'Find "Connected sites" or "Permissions" section',
      icon: Shield,
      action: 'Look for site permissions or connected sites'
    },
    {
      title: 'Add This Site',
      description: 'Add localhost:3000 to trusted sites or manually connect',
      icon: CheckCircle,
      action: (
        <div className="space-y-2">
          <p>Add this URL to trusted sites:</p>
          <div className="flex items-center space-x-2 bg-white/10 p-2 rounded">
            <code className="text-purple-300">{siteUrl}</code>
            <button
              onClick={copyToClipboard}
              className="p-1 hover:bg-white/10 rounded"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )
    },
    {
      title: 'Refresh & Connect',
      description: 'Refresh this page and try connecting again',
      icon: RefreshCw,
      action: (
        <button
          onClick={() => window.location.reload()}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Page</span>
        </button>
      )
    }
  ];

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <AlertTriangle className="w-6 h-6 text-yellow-400" />
        <h3 className="text-lg font-semibold text-yellow-300">
          Wallet Authorization Required
        </h3>
      </div>

      {/* Description */}
      <p className="text-yellow-200/80">
        Your wallet needs to authorize this website. Follow these steps to connect securely:
      </p>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div
              key={index}
              className={`flex items-start space-x-4 p-4 rounded-lg border transition-all cursor-pointer ${
                isActive 
                  ? 'bg-yellow-500/20 border-yellow-500/40' 
                  : isCompleted
                  ? 'bg-green-500/10 border-green-500/20'
                  : 'bg-white/5 border-white/10'
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <div className={`p-2 rounded-lg ${
                isActive 
                  ? 'bg-yellow-500/20' 
                  : isCompleted
                  ? 'bg-green-500/20'
                  : 'bg-white/10'
              }`}>
                <Icon className={`w-5 h-5 ${
                  isActive 
                    ? 'text-yellow-400' 
                    : isCompleted
                    ? 'text-green-400'
                    : 'text-white/60'
                }`} />
              </div>
              
              <div className="flex-1 space-y-2">
                <h4 className={`font-medium ${
                  isActive ? 'text-yellow-300' : isCompleted ? 'text-green-300' : 'text-white'
                }`}>
                  {step.title}
                </h4>
                <p className="text-white/70 text-sm">
                  {step.description}
                </p>
                {isActive && (
                  <div className="text-sm text-yellow-200/80">
                    {typeof step.action === 'string' ? step.action : step.action}
                  </div>
                )}
              </div>
              
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                isCompleted 
                  ? 'border-green-500 bg-green-500' 
                  : isActive
                  ? 'border-yellow-500'
                  : 'border-white/20'
              }`}>
                {isCompleted && <CheckCircle className="w-4 h-4 text-white" />}
                {isActive && <div className="w-2 h-2 bg-yellow-500 rounded-full" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-yellow-500/20">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          Previous
        </button>
        
        <span className="text-sm text-white/60">
          Step {currentStep + 1} of {steps.length}
        </span>
        
        <button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          Next
        </button>
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-yellow-500/20">
        <h4 className="text-sm font-medium text-yellow-300 mb-3">Quick Solutions:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Page</span>
          </button>
          
          <a
            href="https://docs.metamask.io/guide/getting-started.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>MetaMask Help</span>
          </a>
        </div>
      </div>
    </div>
  );
} 