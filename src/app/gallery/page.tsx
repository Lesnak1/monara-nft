'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Background } from "@/components/Background";
import { ClientWrapper } from "@/components/ClientWrapper";
import { useMonanimalContract } from '@/hooks/useMonanimalContract';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Sparkles, 
  Zap, 
  Activity, 
  TrendingUp,
  RefreshCw,
  Eye,
  ExternalLink
} from 'lucide-react';

interface NFTData {
  tokenId: number;
  name: string;
  owner: string;
  image: string;
  animation_url: string;
  external_url: string;
  stage: string;
  genesis_type: 'Neural' | 'Quantum';
  rarity_score: number;
  age_days: number;
  traits: {
    geometry: string;
    environment: string;
    evolution_stage: string;
  };
}

const EVOLUTION_STAGES = ['All', 'Spark', 'Pulse', 'Flow', 'Nexus'];
const GENESIS_TYPES = ['All', 'Neural', 'Quantum'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'rarity_high', label: 'Highest Rarity' },
  { value: 'rarity_low', label: 'Lowest Rarity' },
  { value: 'token_id', label: 'Token ID' }
];

function GalleryPage() {
  const { 
    contractStats, 
    lastMintedTokenId, 
    refreshStats 
  } = useMonanimalContract();
  
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Load NFTs from contract
  useEffect(() => {
    loadNFTs();
  }, [contractStats.totalSupply, lastMintedTokenId]);

  const loadNFTs = async () => {
    try {
      setLoading(true);
      setError(null);

      const totalSupply = contractStats.totalSupply;
      console.log(`📊 Loading gallery with ${totalSupply} tokens`);
      
      if (totalSupply === 0) {
        console.log('🔍 No tokens minted yet, showing empty gallery');
        setNfts([]);
        setFilteredNfts([]);
        setLoading(false);
        return;
      }

      // Sadece minted olan token'lar için metadata fetch
      const nftPromises = [];
      for (let i = 1; i <= totalSupply; i++) {
        nftPromises.push(
          fetch(`/api/nft/${i}/metadata`)
            .then(async (res) => {
              if (!res.ok) {
                console.warn(`⚠️ Metadata fetch failed for token ${i}: ${res.status}`);
                return null;
              }
              const data = await res.json();
              
              return {
                tokenId: i,
                name: data.name,
                owner: data.properties?.owner || data.owner || '',
                image: data.image,
                animation_url: data.animation_url,
                external_url: data.external_url,
                stage: data.attributes?.find((a:any) => a.trait_type === 'Evolution Stage')?.value || 'Genesis',
                genesis_type: data.attributes?.find((a:any) => a.trait_type === 'Genesis Type')?.value === 'Quantum' ? 'Quantum' : 'Neural',
                rarity_score: data.attributes?.find((a:any) => a.trait_type === 'Rarity Score')?.value || 100,
                age_days: data.attributes?.find((a:any) => a.trait_type === 'Age (Days)')?.value || 0,
                traits: {
                  geometry: data.attributes?.find((a:any) => a.trait_type === 'Core Geometry')?.value || 'Neural Web',
                  environment: data.attributes?.find((a:any) => a.trait_type === 'Environment')?.value || 'Cyberspace',
                  evolution_stage: data.attributes?.find((a:any) => a.trait_type === 'Evolution Stage')?.value || 'Genesis',
                },
              };
            })
            .catch((err) => {
              console.error(`❌ Error loading token ${i}:`, err);
              return null;
            })
        );
      }

      const loadedNfts = (await Promise.all(nftPromises)).filter(Boolean) as NFTData[];
      console.log(`✅ Loaded ${loadedNfts.length} NFTs successfully`);
      setNfts(loadedNfts);
    } catch (err: any) {
      console.error('💥 Failed to load NFTs:', err);
      setError('Failed to load NFT collection. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...nfts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(nft => 
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.tokenId.toString().includes(searchTerm)
      );
    }

    // Stage filter
    if (selectedStage !== 'All') {
      filtered = filtered.filter(nft => nft.stage === selectedStage);
    }

    // Type filter
    if (selectedType !== 'All') {
      filtered = filtered.filter(nft => nft.genesis_type === selectedType);
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.tokenId - a.tokenId);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.tokenId - b.tokenId);
        break;
      case 'rarity_high':
        filtered.sort((a, b) => b.rarity_score - a.rarity_score);
        break;
      case 'rarity_low':
        filtered.sort((a, b) => a.rarity_score - b.rarity_score);
        break;
      case 'token_id':
        filtered.sort((a, b) => a.tokenId - b.tokenId);
        break;
    }

    setFilteredNfts(filtered);
  }, [nfts, searchTerm, selectedStage, selectedType, sortBy]);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Nexus': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Flow': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'Pulse': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Spark': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getRarityColor = (score: number) => {
    if (score >= 200) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    if (score >= 175) return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    if (score >= 150) return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    if (score >= 125) return 'text-green-400 bg-green-400/10 border-green-400/20';
    return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  };

  const getRarityLabel = (score: number) => {
    if (score >= 200) return 'Legendary';
    if (score >= 175) return 'Epic';
    if (score >= 150) return 'Rare';
    if (score >= 125) return 'Uncommon';
    return 'Common';
  };

  const NFTCard = ({ nft }: { nft: NFTData }) => (
    <Link href={`/nft/${nft.tokenId}`} className="group">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl">
      {/* NFT Image */}
        <div className="aspect-square relative bg-gradient-to-br from-purple-900/20 to-teal-900/20">
          <iframe
            src={nft.animation_url}
            className="w-full h-full border-0"
            title={nft.name}
            sandbox="allow-scripts"
          />
          
          {/* Overlay */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            {nft.genesis_type === 'Quantum' && (
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg text-xs font-medium border border-yellow-500/30">
                ⚡ Quantum
              </span>
            )}
            <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStageColor(nft.stage)}`}>
              {nft.stage}
            </span>
          </div>

          {/* View overlay on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span className="font-medium">View Details</span>
            </div>
          </div>
      </div>
      
      {/* NFT Info */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">
            {nft.name}
          </h3>
            <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getRarityColor(nft.rarity_score)}`}>
              {getRarityLabel(nft.rarity_score)}
          </span>
        </div>
        
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-white/60 text-xs">Geometry</div>
              <div className="text-white/90">{nft.traits.geometry}</div>
            </div>
            <div>
              <div className="text-white/60 text-xs">Environment</div>
              <div className="text-white/90">{nft.traits.environment}</div>
            </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div>
              <div className="text-white/60 text-xs">Owner</div>
              <div className="text-white/90 text-sm font-mono">{nft.owner}</div>
          </div>
          <div className="text-right">
              <div className="text-white/60 text-xs">Rarity</div>
              <div className="text-white font-bold">{nft.rarity_score}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-teal-400 bg-clip-text text-transparent">
            MONARA Gallery
            </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Explore the evolving collection of Digital Beings on Monad Network. Each MONARA is unique and continues to evolve through neural computation.
            </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">{contractStats.totalSupply}</div>
            <div className="text-white/60">Total Beings</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">{contractStats.maxSupply}</div>
            <div className="text-white/60">Max Supply</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">{contractStats.mintPrice} MON</div>
            <div className="text-white/60">Floor Price</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {lastMintedTokenId ? `#${lastMintedTokenId}` : 'None'}
            </div>
            <div className="text-white/60">Latest Mint</div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {/* Search */}
                <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input
                    type="text"
                placeholder="Search NFTs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Stage Filter */}
                  <select
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
              {EVOLUTION_STAGES.map(stage => (
                <option key={stage} value={stage} className="bg-gray-900 text-white">
                  {stage} {stage !== 'All' && 'Stage'}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              {GENESIS_TYPES.map(type => (
                <option key={type} value={type} className="bg-gray-900 text-white">
                  {type} {type !== 'All' && 'Genesis'}
                </option>
              ))}
                  </select>

            {/* Sort */}
                  <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-900 text-white">
                  {option.label}
                </option>
              ))}
                  </select>

            {/* View Toggle & Refresh */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                {viewMode === 'grid' ? <List className="w-5 h-5 text-white" /> : <Grid3X3 className="w-5 h-5 text-white" />}
              </button>
              
              <button
                onClick={() => {
                  refreshStats();
                  loadNFTs();
                }}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-center text-white/60">
            Showing {filteredNfts.length} of {nfts.length} Digital Beings
                </div>
              </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white/70">Loading MONARA collection...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-red-400 text-xl">⚠️</span>
            </div>
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={loadNFTs}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredNfts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
              {nfts.length === 0 ? 'No Digital Beings Yet' : 'No Results Found'}
                </h3>
            <p className="text-white/70 mb-6">
              {nfts.length === 0 
                ? 'Be the first to mint a MONARA and start the neural evolution!'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {nfts.length === 0 && (
              <Link
                  href="/mint" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105"
                >
                <Sparkles className="w-5 h-5 mr-2" />
                Mint First MONARA
              </Link>
            )}
              </div>
            ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredNfts.map((nft) => (
              <NFTCard key={nft.tokenId} nft={nft} />
                ))}
              </div>
            )}
              </div>
            </div>
  );
} 

export default GalleryPage; 