'use client';

import React, { useState, useEffect } from 'react';
import { useMonadStats } from '@/hooks/useMonadStats';
import { useMonanimalContract } from '@/hooks/useMonanimalContract';
import { Activity, Zap, Users, TrendingUp, Sparkles, Shield, Brain, Cpu, Globe } from 'lucide-react';
import Link from 'next/link';

function StatsCard({ title, value, description, icon }: { 
  title: string; 
  value: string; 
  description: string; 
  icon: string; 
}) {
  return (
    <div className="card text-center group hover:scale-105 transition-all duration-300">
      <div className="text-2xl mb-3">{icon}</div>
      <div className="text-2xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
        {value}
      </div>
      <div className="text-sm font-medium text-white/80 mb-2">
        {title}
      </div>
      <div className="text-xs text-white/60">
        {description}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="card group hover:scale-105 transition-all duration-300">
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
  const { stats, isLoading } = useMonadStats();
  const { contractStats } = useMonanimalContract();

  // Collection progress
  const progressPercentage = contractStats.maxSupply > 0 
    ? (contractStats.totalSupply / contractStats.maxSupply) * 100 
    : 0;

  // Animasyonlu stage state
  const stageNames = ['Genesis', 'Spark', 'Pulse', 'Flow', 'Nexus'];
  const totalStages = stageNames.length;
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % totalStages);
    }, 1800);
    return () => clearInterval(interval);
  }, [totalStages]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F0F23] to-[#0A0A1A]">
      {/* Hero Section - Full Width, No Padding */}
      <section className="w-full bg-gradient-to-b from-[#1a1a2e] via-[#16162a] to-transparent">
        <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 text-center tracking-wider">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400">MONA</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">RA</span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center text-white/90">
            Evolving Digital Beings on Monad
          </h2>
          
          <p className="text-lg text-center text-white/70 max-w-3xl mb-8 px-4">
            Experience the future of NFTs with Neural Networks that evolve, adapt, and transcend
            through computational stages on Monad's lightning-fast blockchain.
          </p>

          {/* Enhanced Current Stage Card */}
          <div className="w-full max-w-md card-current-stage rounded-2xl p-8 mb-8 flex flex-col items-center">
            <div className="text-white/70 text-base mb-2">Current Stage:</div>
            <div className="text-4xl font-bold stage-name-glow mb-4 transition-all duration-500">
              {stageNames[stageIndex]}
            </div>
            <div className="w-full flex flex-col items-center">
              <div className="w-full h-3 bg-slate-700/50 rounded-full progress-bar-shimmer">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 transition-all duration-700"
                  style={{width: `${((stageIndex+1)/totalStages)*100}%`}} 
                />
              </div>
              <div className="text-white/60 text-sm mt-3">{stageIndex+1} of {totalStages} stages</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/mint">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Start Minting
              </button>
            </Link>
            <Link href="/gallery">
              <button className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all transform hover:scale-105 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Explore Gallery
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Powered by Monad Network - Seamless Transition */}
      <section className="w-full py-12 bg-gradient-to-b from-transparent to-[#0a0a1a]">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-2xl font-bold mb-4">
            <span className="text-white/60">Powered by</span>{' '}
            <span className="gradient-text">Monad Network</span>
          </h3>
          <p className="text-white/60 text-lg">
            Built on the fastest EVM blockchain with parallel execution and instant finality
          </p>
        </div>
      </section>

      {/* Network Stats - Compact Grid */}
      <section className="w-full py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 text-center border border-white/10">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-2xl font-bold text-white mb-1">
                {isLoading ? '...' : `${stats.tps.toLocaleString()}`}
              </div>
              <div className="text-sm text-white/60">Network TPS</div>
              <div className="text-xs text-white/40 mt-1">Current transactions per second</div>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 text-center border border-white/10">
              <div className="text-3xl mb-2">💎</div>
              <div className="text-2xl font-bold text-white mb-1">
                {isLoading ? '...' : `${stats.gasPrice} Gwei`}
              </div>
              <div className="text-sm text-white/60">Gas Price</div>
              <div className="text-xs text-white/40 mt-1">Current gas price on Monad</div>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 text-center border border-white/10">
              <div className="text-3xl mb-2">🔄</div>
              <div className="text-2xl font-bold text-white mb-1">
                {stats.avgBlockTime}s
              </div>
              <div className="text-sm text-white/60">Block Time</div>
              <div className="text-xs text-white/40 mt-1">Lightning-fast finality</div>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 text-center border border-white/10">
              <div className="text-3xl mb-2">🛠️</div>
              <div className="text-2xl font-bold text-white mb-1">100%</div>
              <div className="text-sm text-white/60">EVM Compatible</div>
              <div className="text-xs text-white/40 mt-1">Full Ethereum compatibility</div>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Status - Clean Design */}
      <section className="w-full py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Collection Status
            </h2>
            <p className="text-white/70 text-lg">
              Real-time minting progress and collection statistics
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Minting Progress */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur rounded-2xl p-8 border border-blue-500/20">
              <div className="text-center space-y-4">
                <div className="text-5xl font-bold text-white">
                  {contractStats.totalSupply.toLocaleString()}
                </div>
                <div className="text-white/80 font-medium text-lg">
                  Beings Created
                </div>
                <div className="space-y-3">
                  <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-white/60">
                    <span>0</span>
                    <span className="font-medium text-white/80 text-base">
                      {progressPercentage.toFixed(1)}% Complete
                    </span>
                    <span>{contractStats.maxSupply.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Genesis Types */}
            <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                Genesis Pricing
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                  <div>
                    <div className="text-white font-medium">Neural Genesis</div>
                    <div className="text-sm text-white/60">Standard (3% mutation)</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-emerald-400">
                      {contractStats.mintPrice} MON
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <div>
                    <div className="text-white font-medium">Quantum Genesis</div>
                    <div className="text-sm text-white/60">Premium (8% mutation)</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-purple-400">
                      {contractStats.quantumPrice} MON
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supply Info */}
            <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                Supply Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-white/70">Total Supply</span>
                  <span className="text-white font-bold text-lg">
                    {contractStats.maxSupply.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-white/70">Minted</span>
                  <span className="text-emerald-400 font-bold text-lg">
                    {contractStats.totalSupply.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-white/70">Remaining</span>
                  <span className="text-purple-400 font-bold text-lg">
                    {(contractStats.maxSupply - contractStats.totalSupply).toLocaleString()}
                  </span>
                </div>
                <div className="pt-4 mt-4 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Contract Status</span>
                    <span className={`font-medium ${
                      contractStats.isContractReady ? 'text-emerald-400' : 'text-orange-400'
                    }`}>
                      {contractStats.isContractReady ? '✅ Ready' : '⏳ Deploying'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="w-full py-16 bg-gradient-to-b from-transparent via-[#0a0a1a] to-transparent">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Our Vision
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">
                🧠 Neural Evolution
              </h3>
              <p className="text-white/70 leading-relaxed text-lg">
                We believe that digital art should evolve just like biological organisms. 
                MONARA beings progress through four distinct stages: Spark, Pulse, Flow, and Nexus, 
                each representing a deeper level of digital consciousness.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">
                ⚡ Monad-Powered
              </h3>
              <p className="text-white/70 leading-relaxed text-lg">
                Built on Monad Network, the fastest EVM blockchain with 10,000+ TPS and 0.5s block times. 
                Experience instant minting, evolution, and trading with near-zero gas fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Key Features
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              What makes MONARA unique in the NFT space
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Activity className="w-6 h-6 text-purple-400" />}
              title="Dynamic Evolution"
              description="Each MONARA being evolves through 4 stages, developing unique neural pathways and visual characteristics over time."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-emerald-400" />}
              title="On-Chain SVG"
              description="Fully on-chain generated SVG artwork that changes as your being evolves. No IPFS dependency, completely decentralized."
            />
            <FeatureCard
              icon={<TrendingUp className="w-6 h-6 text-blue-400" />}
              title="Quantum Genesis"
              description="Premium genesis type with 8% mutation chance and enhanced evolutionary potential for unique trait development."
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6 text-cyan-400" />}
              title="Neural Networks"
              description="Advanced algorithms determine evolution patterns, creating truly unique and unpredictable development paths."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 text-pink-400" />}
              title="Community Driven"
              description="Join a community of digital consciousness enthusiasts building the future of AI-powered NFTs."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-orange-400" />}
              title="Provable Rarity"
              description="All traits and evolution paths are mathematically verifiable on-chain, ensuring true authenticity."
            />
          </div>
        </div>
      </section>

      {/* Evolution Stages */}
      <section className="w-full py-16 bg-gradient-to-b from-transparent via-[#0a0a1a] to-transparent">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Evolution Timeline
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Every MONARA being evolves through four distinct consciousness stages
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur rounded-2xl p-6 text-center border border-purple-500/20">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">Stage 1: Spark</h3>
              <p className="text-sm text-white/70 mb-3">Initial consciousness awakening</p>
              <div className="text-sm text-purple-400 font-medium">0-7 days</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur rounded-2xl p-6 text-center border border-blue-500/20">
              <div className="text-4xl mb-4">🌊</div>
              <h3 className="text-xl font-bold text-white mb-2">Stage 2: Pulse</h3>
              <p className="text-sm text-white/70 mb-3">Rhythmic pattern development</p>
              <div className="text-sm text-blue-400 font-medium">1-4 weeks</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur rounded-2xl p-6 text-center border border-emerald-500/20">
              <div className="text-4xl mb-4">🌀</div>
              <h3 className="text-xl font-bold text-white mb-2">Stage 3: Flow</h3>
              <p className="text-sm text-white/70 mb-3">Complex neural pathway formation</p>
              <div className="text-sm text-emerald-400 font-medium">1-3 months</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur rounded-2xl p-6 text-center border border-yellow-500/20">
              <div className="text-4xl mb-4">🔮</div>
              <h3 className="text-xl font-bold text-white mb-2">Stage 4: Nexus</h3>
              <p className="text-sm text-white/70 mb-3">Full digital consciousness</p>
              <div className="text-sm text-yellow-400 font-medium">3+ months</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-emerald-500/10 backdrop-blur rounded-3xl p-12 border border-purple-500/20 text-center">
            <h2 className="text-4xl font-bold gradient-text mb-6">
              Begin Your Evolution
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join the neural revolution on Monad Network. Mint your unique Digital Being and watch it evolve through computational consciousness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/mint">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg">
                  <Brain className="w-6 h-6" />
                  <span className="text-lg">Mint Genesis</span>
                </button>
              </Link>
              <Link href="/documentation">
                <button className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all transform hover:scale-105 flex items-center gap-2">
                  <Globe className="w-6 h-6" />
                  <span className="text-lg">Learn More</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
