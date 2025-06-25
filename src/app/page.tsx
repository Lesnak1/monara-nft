'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Zap, Activity, Users, ArrowRight, TrendingUp } from 'lucide-react';
import { useMonadStats } from '@/hooks/useMonadStats';
import { useMonanimalContract } from '@/hooks/useMonanimalContract';
import { Header } from '@/components/layout/Header';

const stages = ['Spark', 'Pulse', 'Flow', 'Nexus'];

function NetworkStats() {
  const { stats, isLoading } = useMonadStats();

  const networkStats = [
    {
      icon: '⚡',
      label: 'Network TPS',
      value: isLoading ? '...' : `${stats.tps.toLocaleString()}`,
      description: 'Current transactions per second',
      color: 'from-purple-500 to-blue-600'
    },
    {
      icon: '💎',
      label: 'Gas Price',
      value: isLoading ? '...' : `${stats.gasPrice} Gwei`,
      description: 'Current gas price on Monad',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: '🔄',
      label: 'Block Time',
      value: `${stats.avgBlockTime}s`,
      description: 'Lightning-fast finality',
      color: 'from-cyan-500 to-teal-600'
    },
    {
      icon: '🛠️',
      label: 'EVM Compatible',
      value: '100%',
      description: 'Full Ethereum compatibility',
      color: 'from-teal-500 to-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {networkStats.map((stat, index) => (
        <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 group hover:scale-105 transition-all duration-300 hover:bg-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">{stat.icon}</div>
            <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${stat.color} bg-opacity-20 border border-white/10`}>
              <span className="text-xs font-medium text-white/80">Live</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
              {stat.value}
            </div>
            <div className="text-sm font-medium text-white/90 mb-1">
              {stat.label}
            </div>
            <div className="text-xs text-white/60">
              {stat.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatsCard({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center group hover:scale-105 transition-all duration-300 hover:bg-white/10">
      <div className="text-2xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
        {value}
      </div>
      <div className="text-sm font-medium text-white/80 mb-2">
        {title}
      </div>
      <div className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
        {change}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 group hover:scale-105 transition-all duration-300 hover:bg-white/10">
      <div className="flex items-center space-x-4 mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-emerald-500/20 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-white">
          {title}
        </h3>
      </div>
      <p className="text-white/70 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function HomePage() {
  const [currentStage, setCurrentStage] = useState(3);
  const { contractStats } = useMonanimalContract();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % stages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header />
      
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-6xl mx-auto space-y-16">
          {/* Hero Section */}
          <section className="text-center space-y-8 opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-emerald-400 bg-clip-text text-transparent">
                  MONARA
                </span>
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-white/90">
                Evolving Digital Beings on Monad
              </h2>
              <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
                Experience the future of NFTs with Neural Networks that evolve, adapt, and transcend 
                through computational stages on Monad&apos;s lightning-fast blockchain.
              </p>
            </div>

            {/* Evolution Stage Indicator */}
            <div className="flex justify-center mb-12">
              <div className="w-full max-w-md">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="text-sm text-white/60 mb-2">Current Stage:</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                    {stages[currentStage]}
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
                    />
                  </div>
                  <div className="text-sm text-white/60">
                    {currentStage + 1} of {stages.length} stages
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/mint" className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-200 hover:scale-105">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Minting
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/gallery" className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all duration-200 hover:scale-105">
                <Users className="w-5 h-5 mr-2" />
                Explore Gallery
              </Link>
            </div>
          </section>

          {/* Live Network Stats */}
          <section className="space-y-8 opacity-0 animate-[slideUp_1s_ease-out_0.2s_forwards]">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  Powered by Monad Network
                </span>
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Built on the fastest EVM blockchain with parallel execution and instant finality
              </p>
            </div>
            
            <NetworkStats />
          </section>

          {/* Collection Stats */}
          <section className="space-y-8 opacity-0 animate-[slideUp_1s_ease-out_0.4s_forwards]">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                Collection Status
              </h2>
              <p className="text-white/70">
                {contractStats.isContractReady ? 'Live on Monad Testnet' : 'Preparing for Genesis Launch'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatsCard 
                title="Total Beings" 
                value={contractStats.totalSupply.toLocaleString()} 
                change={contractStats.isContractReady ? `${(contractStats.totalSupply / contractStats.maxSupply * 100).toFixed(1)}% Minted` : 'Genesis Launch'} 
              />
              <StatsCard 
                title="Max Supply" 
                value={contractStats.maxSupply.toLocaleString()} 
                change="Limited Genesis" 
              />
              <StatsCard 
                title="Mint Price" 
                value={`${contractStats.mintPrice} MON`} 
                change="Neural Genesis" 
              />
              <StatsCard 
                title="Quantum Price" 
                value={`${contractStats.quantumPrice} MON`} 
                change="Enhanced Evolution" 
              />
            </div>
          </section>

          {/* Key Features */}
          <section className="space-y-8 opacity-0 animate-[slideUp_1s_ease-out_0.6s_forwards]">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                Revolutionary Features
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Experience the next generation of NFTs with cutting-edge technology
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Zap className="w-6 h-6 text-purple-400" />}
                title="Neural Evolution"
                description="Digital beings that evolve through computational stages, developing unique characteristics over time."
              />
              <FeatureCard
                icon={<Activity className="w-6 h-6 text-emerald-400" />}
                title="On-Chain Rendering"
                description="Fully on-chain SVG generation powered by neural network algorithms and geometric patterns."
              />
              <FeatureCard
                icon={<TrendingUp className="w-6 h-6 text-blue-400" />}
                title="Parallel Execution"
                description="Leveraging Monad's parallel processing for instant minting and ultra-low gas fees."
              />
              <FeatureCard
                icon={<Sparkles className="w-6 h-6 text-pink-400" />}
                title="Quantum Genesis"
                description="Enhanced minting with higher mutation rates and special evolutionary pathways."
              />
              <FeatureCard
                icon={<Users className="w-6 h-6 text-cyan-400" />}
                title="Community Driven"
                description="Decentralized evolution influenced by community interactions and network effects."
              />
              <FeatureCard
                icon={<ArrowRight className="w-6 h-6 text-yellow-400" />}
                title="Future Adaptive"
                description="Smart contracts designed to evolve with new features and capabilities over time."
              />
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center space-y-8 opacity-0 animate-[fadeIn_1s_ease-out_0.8s_forwards]">
            <div className="bg-gradient-to-r from-purple-900/20 to-emerald-900/20 rounded-3xl p-8 md:p-12 border border-white/10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Begin Your Journey?
              </h2>
              <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                Join the evolution on Monad&apos;s revolutionary blockchain. Mint your first Digital Being and watch it evolve.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/mint" className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-200 hover:scale-105">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Minting Now
                </Link>
                <Link href="/about" className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all duration-200 hover:scale-105">
                  Learn More
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
