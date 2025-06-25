'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { useMonadStats } from '@/hooks/useMonadStats';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Gerçek Monad NFT koleksiyonu için placeholder data
interface DigitalBeingData {
  id: string;
  name: string;
  stage: string;
  owner: string;
  price: string;
  rarity: string;
  image: string;
  blockMinted: number;
  evolutionTime: string;
}

const sampleDigitalBeings: DigitalBeingData[] = [
  {
    id: '1',
    name: 'MONARA Genesis #001',
    stage: 'Nexus',
    owner: '0xMonad...7f3a',
    price: '0.25 MON',
    rarity: 'Legendary',
    image: '/placeholder-nft.png',
    blockMinted: 23150000,
    evolutionTime: '127 days'
  },
  {
    id: '2', 
    name: 'Neural Entity #042',
    stage: 'Flow',
    owner: '0xTest...8b2c',
    price: '0.18 MON',
    rarity: 'Epic',
    image: '/placeholder-nft.png',
    blockMinted: 23155000,
    evolutionTime: '89 days'
  },
  {
    id: '3',
    name: 'Digital Consciousness #127',
    stage: 'Pulse',
    owner: '0xDev...4d5e',
    price: '0.12 MON',
    rarity: 'Rare',
    image: '/placeholder-nft.png',
    blockMinted: 23160000,
    evolutionTime: '45 days'
  },
  {
    id: '4',
    name: 'Quantum Being #089',
    stage: 'Spark',
    owner: '0xUser...3a1b',
    price: '0.08 MON',
    rarity: 'Common',
    image: '/placeholder-nft.png',
    blockMinted: 23165000,
    evolutionTime: '12 days'
  }
];

function StatsCard({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div className="card text-center group hover:scale-105 transition-all duration-300">
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

function NFTCard({ nft }: { nft: DigitalBeingData }) {
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Nexus': return 'text-emerald-400 bg-emerald-400/10';
      case 'Flow': return 'text-purple-400 bg-purple-400/10';
      case 'Pulse': return 'text-blue-400 bg-blue-400/10';
      case 'Spark': return 'text-orange-400 bg-orange-400/10';
      default: return 'text-purple-400 bg-purple-400/10';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'text-yellow-400 bg-yellow-400/10';
      case 'Epic': return 'text-purple-400 bg-purple-400/10';
      case 'Rare': return 'text-blue-400 bg-blue-400/10';
      case 'Common': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="card group hover:scale-105 transition-all duration-300">
      {/* NFT Image */}
      <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-emerald-500/20 rounded-xl mb-4 flex items-center justify-center border border-white/10">
        <div className="text-6xl">🔮</div>
      </div>
      
      {/* NFT Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">
            {nft.name}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(nft.rarity)}`}>
            {nft.rarity}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded-full ${getStageColor(nft.stage)}`}>
            {nft.stage} Stage
          </span>
          <span className="text-xs text-white/60">
            {nft.evolutionTime}
          </span>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div>
            <div className="text-xs text-white/60">Owner</div>
            <div className="text-xs font-medium text-white/80">{nft.owner}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/60">Price</div>
            <div className="text-sm font-bold text-white">{nft.price}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const { stats } = useMonadStats();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('');

  return (
    <>
      <Header />
      
      <main className="main-content">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <section className="text-center space-y-4 fade-in">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="gradient-text">Digital Beings Gallery</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Explore the evolving collection of Neural Beings on Monad Network. Each being is unique and continues to evolve.
            </p>
          </section>

          {/* Gallery Stats */}
          <section className="slide-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatsCard title="Total Beings" value="0" change="New!" />
              <StatsCard title="Evolved Today" value="0" change="0%" />
              <StatsCard title="Floor Price" value="0.1 MON" change="Genesis" />
              <StatsCard title="Network TPS" value={`${stats.tps}`} change="Live" />
            </div>
          </section>

          {/* Search and Filters */}
          <section className="slide-up">
            <div className="card">
              <div className="grid md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search beings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Stage Filter */}
                <div className="relative">
                  <FunnelIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                  <select
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                  >
                    <option value="">All Evolution Stages</option>
                    <option value="Spark">Spark Stage</option>
                    <option value="Pulse">Pulse Stage</option>
                    <option value="Flow">Flow Stage</option>
                    <option value="Nexus">Nexus Stage</option>
                  </select>
                </div>

                {/* Rarity Filter */}
                <div className="relative">
                  <FunnelIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                  <select
                    value={selectedRarity}
                    onChange={(e) => setSelectedRarity(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                  >
                    <option value="">All Rarities</option>
                    <option value="Common">Common</option>
                    <option value="Rare">Rare</option>
                    <option value="Epic">Epic</option>
                    <option value="Legendary">Legendary</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* NFT Grid */}
          <section className="slide-up">
            {sampleDigitalBeings.length === 0 ? (
              <div className="card text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🌟</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Genesis Collection Coming Soon
                </h3>
                <p className="text-white/70 max-w-md mx-auto mb-8">
                  The first MONARA beings are waiting to be born. Be among the first to mint a Neural Being on Monad Network.
                </p>
                <a 
                  href="/mint" 
                  className="btn btn-primary text-lg px-8 py-4"
                >
                  Create First Being
                </a>
              </div>
            ) : (
              <div className="nft-grid">
                {sampleDigitalBeings.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </div>
            )}
          </section>

          {/* Launch Banner */}
          <section className="slide-up">
            <div className="card text-center">
              <h2 className="text-3xl font-bold gradient-text mb-4">
                Ready to Join the Evolution?
              </h2>
              <p className="text-white/70 max-w-xl mx-auto mb-8">
                Create your own evolving Neural Being and watch it develop through the stages of digital consciousness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/mint" className="btn btn-primary text-lg px-8 py-4">
                  Start Creating
                </a>
                <a href="/about" className="btn btn-secondary text-lg px-8 py-4">
                  Learn More
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
} 