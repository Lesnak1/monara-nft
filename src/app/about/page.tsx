'use client';

import { Header } from '@/components/layout/Header';
import { useMonadStats } from '@/hooks/useMonadStats';
import { Activity, Zap, Users, TrendingUp, Sparkles, Shield } from 'lucide-react';
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

export default function AboutPage() {
  const { stats, isLoading } = useMonadStats();

  return (
    <>
      <Header />
      
      <main className="main-content">
        <div className="w-full max-w-6xl mx-auto space-y-16">
          {/* Hero Section */}
          <section className="text-center space-y-8 fade-in">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="gradient-text">About MONARA</span>
              </h1>
              <h2 className="text-xl md:text-2xl font-semibold text-white/90">
                The Future of Evolving Digital Beings
              </h2>
              <p className="text-lg text-white/70 max-w-4xl mx-auto leading-relaxed">
                MONARA represents a revolutionary approach to NFTs, where each digital being is not static 
                but a living, evolving entity that grows and changes through neural computational stages on 
                the Monad Network.
              </p>
            </div>
          </section>

          {/* Live Network Stats */}
          <section className="space-y-8 slide-up">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold gradient-text mb-4">
                Live Network Performance
              </h2>
              <p className="text-white/70">
                Real-time metrics from Monad Network powering MONARA
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatsCard
                title="Network TPS"
                value={isLoading ? '...' : `${stats.tps.toLocaleString()}`}
                description="Current transactions per second"
                icon="⚡"
              />
              <StatsCard
                title="Gas Price"
                value={isLoading ? '...' : `${stats.gasPrice} Gwei`}
                description="Current gas price"
                icon="💎"
              />
              <StatsCard
                title="Block Time"
                value={`${stats.avgBlockTime}s`}
                description="Block confirmation time"
                icon="🔄"
              />
              <StatsCard
                title="EVM Compatible"
                value="100%"
                description="Full Ethereum compatibility"
                icon="🛠️"
              />
            </div>
          </section>

          {/* Vision & Mission */}
          <section className="space-y-8 slide-up">
            <div className="text-center">
              <h2 className="text-3xl font-bold gradient-text mb-8">
                Our Vision
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">
                  🧠 Neural Evolution
                </h3>
                <p className="text-white/70 leading-relaxed">
                  We believe that digital art should evolve just like biological organisms. 
                  MONARA beings progress through four distinct stages: Spark, Pulse, Flow, and Nexus, 
                  each representing a deeper level of digital consciousness.
                </p>
              </div>
              
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">
                  ⚡ Monad-Powered
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Built on Monad Network, the fastest EVM blockchain with 10,000+ TPS and 0.5s block times. 
                  Experience instant minting, evolution, and trading with near-zero gas fees.
                </p>
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section className="space-y-8 slide-up">
            <div className="text-center">
              <h2 className="text-3xl font-bold gradient-text mb-4">
                Key Features
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                What makes MONARA unique in the NFT space
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Activity className="w-6 h-6 text-purple-400" />}
                title="Dynamic Evolution"
                description="Each MONARA being evolves through 4 stages, developing unique neural pathways and visual characteristics over time based on computational algorithms."
              />
              <FeatureCard
                icon={<Zap className="w-6 h-6 text-emerald-400" />}
                title="On-Chain SVG"
                description="Fully on-chain generated SVG artwork that changes as your being evolves. No IPFS dependency, completely decentralized and permanent."
              />
              <FeatureCard
                icon={<TrendingUp className="w-6 h-6 text-blue-400" />}
                title="Quantum Genesis"
                description="Premium genesis type with 8% mutation chance and enhanced evolutionary potential for unique trait development."
              />
              <FeatureCard
                icon={<Sparkles className="w-6 h-6 text-cyan-400" />}
                title="Neural Networks"
                description="Advanced AI algorithms determine evolution patterns, creating truly unique and unpredictable development paths."
              />
              <FeatureCard
                icon={<Users className="w-6 h-6 text-pink-400" />}
                title="Community Driven"
                description="Join a community of digital consciousness enthusiasts building the future of AI-powered NFTs and decentralized art."
              />
              <FeatureCard
                icon={<Shield className="w-6 h-6 text-orange-400" />}
                title="Provable Rarity"
                description="All traits and evolution paths are mathematically verifiable on-chain, ensuring true rarity and authenticity."
              />
            </div>
          </section>

          {/* Evolution Stages */}
          <section className="space-y-8 slide-up">
            <div className="text-center">
              <h2 className="text-3xl font-bold gradient-text mb-4">
                Evolution Stages
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                The four stages of digital consciousness development
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center group">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-lg font-bold text-white mb-2">Stage 1: Spark</h3>
                <p className="text-sm text-white/70 mb-3">Initial neural formation and basic pattern recognition</p>
                <div className="text-xs text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full">
                  0-7 days
                </div>
              </div>
              
              <div className="card text-center group">
                <div className="text-4xl mb-4">💫</div>
                <h3 className="text-lg font-bold text-white mb-2">Stage 2: Pulse</h3>
                <p className="text-sm text-white/70 mb-3">Enhanced processing and pathway optimization</p>
                <div className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">
                  1-4 weeks
                </div>
              </div>
              
              <div className="card text-center group">
                <div className="text-4xl mb-4">🌊</div>
                <h3 className="text-lg font-bold text-white mb-2">Stage 3: Flow</h3>
                <p className="text-sm text-white/70 mb-3">Complex neural networks and adaptive learning</p>
                <div className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                  1-3 months
                </div>
              </div>
              
              <div className="card text-center group">
                <div className="text-4xl mb-4">🔮</div>
                <h3 className="text-lg font-bold text-white mb-2">Stage 4: Nexus</h3>
                <p className="text-sm text-white/70 mb-3">Transcendent intelligence and quantum awareness</p>
                <div className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-full">
                  3+ months
                </div>
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section className="space-y-8 slide-up">
            <div className="text-center">
              <h2 className="text-3xl font-bold gradient-text mb-4">
                Technical Architecture
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Built with cutting-edge blockchain technology and AI algorithms
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="text-2xl mr-3">⛓️</span>
                  Blockchain Layer
                </h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                    Smart Contracts on Monad Network
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                    On-chain SVG generation (no IPFS)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                    ERC-721 compliant NFTs
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                    Gas-optimized minting process
                  </li>
                </ul>
              </div>
              
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="text-2xl mr-3">🧠</span>
                  AI & Algorithms
                </h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                    Neural network trait generation
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                    Time-based evolution algorithms
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                    Quantum probability mutations
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                    Procedural art generation
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Roadmap */}
          <section className="space-y-8 slide-up">
            <div className="text-center">
              <h2 className="text-3xl font-bold gradient-text mb-4">
                Roadmap
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                The future evolution of MONARA ecosystem
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                    ✓
                  </div>
                  <h3 className="text-lg font-bold text-white">Phase 1: Genesis</h3>
                </div>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• Smart contract deployment</li>
                  <li>• Basic minting functionality</li>
                  <li>• Initial evolution mechanics</li>
                  <li>• Community launch</li>
                </ul>
              </div>
              
              <div className="card">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-white">Phase 2: Enhancement</h3>
                </div>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• Advanced trait combinations</li>
                  <li>• Staking for evolution boosts</li>
                  <li>• Community governance</li>
                  <li>• Marketplace integration</li>
                </ul>
              </div>
              
              <div className="card">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-white">Phase 3: Ecosystem</h3>
                </div>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• Cross-chain compatibility</li>
                  <li>• AI-powered interactions</li>
                  <li>• Gaming integrations</li>
                  <li>• Virtual exhibitions</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center space-y-8 slide-up">
            <div className="card">
              <h2 className="text-3xl font-bold gradient-text mb-4">
                Ready to Create Your Digital Being?
              </h2>
              <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                Join the future of NFTs and watch your digital consciousness evolve on Monad Network.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/mint" className="btn btn-primary text-lg px-8 py-4">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Creating
                </Link>
                <Link href="/gallery" className="btn btn-secondary text-lg px-8 py-4">
                  <Users className="w-5 h-5 mr-2" />
                  Explore Gallery
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
} 