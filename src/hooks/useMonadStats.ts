'use client';

import { useState, useEffect } from 'react';

export interface MonadStats {
  tps: number;
  blockHeight: number;
  validators: number;
  totalTransactions: bigint;
  avgBlockTime: number;
  gasPrice: number;
  networkName: string;
  chainId: number;
  activeAccounts: number;
  totalStake: string;
  burnedMON: string;
  timestamp?: number;
  error?: string;
}

export function useMonadStats() {
  const [stats, setStats] = useState<MonadStats>({
    tps: 0,
    blockHeight: 0,
    validators: 0,
    totalTransactions: 0n,
    avgBlockTime: 0.5,
    gasPrice: 0,
    networkName: 'Monad Testnet',
    chainId: 10143,
    activeAccounts: 0,
    totalStake: '0',
    burnedMON: '0',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stats from our API route
  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 Fetching Monad stats from API...');

      const response = await fetch('/api/network-stats', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Add timeout with AbortController for better browser compatibility
        signal: (() => {
          const controller = new AbortController();
          setTimeout(() => controller.abort(), 10000); // 10 second timeout
          return controller.signal;
        })(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('✅ Network stats received:', data);

      setStats({
        tps: data.tps,
        blockHeight: data.blockHeight,
        validators: data.validators,
        totalTransactions: BigInt(data.totalTransactions),
        avgBlockTime: data.avgBlockTime,
        gasPrice: data.gasPrice,
        networkName: data.networkName,
        chainId: data.chainId,
        activeAccounts: data.activeAccounts,
        totalStake: data.totalStake,
        burnedMON: data.burnedMON,
        timestamp: data.timestamp,
        error: data.error,
      });

      if (data.error) {
        console.warn('⚠️ Using fallback data:', data.error);
      }

    } catch (err: any) {
      console.error('❌ Failed to fetch network stats:', err);
      setError('Failed to fetch network stats');
      
      // Fallback to realistic testnet data
      setStats(prev => ({
        ...prev,
        tps: 250 + Math.floor(Math.random() * 100),
        blockHeight: 5847392 + Math.floor(Math.random() * 100),
        validators: 150 + Math.floor(Math.random() * 50),
        totalTransactions: BigInt(25847392 + Math.floor(Math.random() * 1000)),
        gasPrice: 52 + Math.floor(Math.random() * 10),
        activeAccounts: 15847 + Math.floor(Math.random() * 100),
        totalStake: '150.5M MON',
        burnedMON: '24.8K MON',
        error: 'Using fallback data - API unavailable',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Real-time updates every 5 seconds
    const interval = setInterval(() => {
      fetchStats();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const refresh = () => {
    fetchStats();
  };

  return {
    stats,
    isLoading,
    error,
    refresh,
  };
} 
