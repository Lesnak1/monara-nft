'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { 
  ArrowLeft, 
  ExternalLink, 
  Copy, 
  Share2, 
  Heart,
  Sparkles,
  Zap,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { useMonanimalContract } from '@/hooks/useMonanimalContract';
import { MONARA_KNOWN_ASSET } from '@/lib/knownAssets';

interface NFTData {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  animation_url: string;
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
    display_type?: string;
    max_value?: number;
  }>;
  owner?: string;
  isQuantum?: boolean;
  evolutionStage?: number;
  rarityScore?: number;
  birthTimestamp?: number;
}

export default function NFTDetailPage() {
  const params = useParams();
  const tokenId = params?.tokenId as string;
  const { address } = useAccount();
  const { contractStats } = useMonanimalContract();
  
  const [nftData, setNftData] = useState<NFTData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (tokenId) {
      loadNFTData();
    }
  }, [tokenId]);

  const loadNFTData = async () => {
    try {
      setLoading(true);
      setError(null);

      // For demo purposes, generate sample data
      // In production, this would fetch from contract or API
      const sampleData: NFTData = {
        tokenId,
        name: `MONARA #${tokenId}`,
        description: `🧠 Evolving Digital Being on Monad Network\n\nThis MONARA represents a unique neural network visualization that evolves over time. Each being develops distinct characteristics through computational processes on Monad's lightning-fast blockchain.\n\nStage: ${Math.floor(Math.random() * 4) + 1}/4\nGenesis Type: ${Math.random() > 0.8 ? 'Quantum Genesis ⚡' : 'Neural Genesis 🧬'}\n\nEach MONARA represents the mathematical beauty of parallel computation, evolving through neural network visualizations.`,
        image: `/api/nft/${tokenId}/image`,
        animation_url: `/api/nft/${tokenId}/animation`,
        external_url: `${window.location.origin}/nft/${tokenId}`,
        attributes: [
          { trait_type: 'Evolution Stage', value: Math.random() > 0.5 ? 'Processing' : 'Learning' },
          { trait_type: 'Core Geometry', value: ['Circle', 'Hexagon', 'Star', 'Diamond'][Math.floor(Math.random() * 4)] },
          { trait_type: 'Genesis Type', value: Math.random() > 0.8 ? 'Quantum' : 'Neural' },
          { trait_type: 'Environment', value: ['Matrix', 'Quantum', 'Cyber', 'Void'][Math.floor(Math.random() * 4)] },
          { trait_type: 'Rarity Score', value: Math.floor(Math.random() * 150) + 100 },
          { trait_type: 'Age (Days)', value: Math.floor(Math.random() * 30) },
          { display_type: 'boost_percentage', trait_type: 'Evolution Progress', value: Math.floor(Math.random() * 100) },
          { display_type: 'number', trait_type: 'Token ID', value: parseInt(tokenId) }
        ],
        owner: address || '0x742d35cc6ba427dc800d3c52f18b3e62b27a6138',
        isQuantum: Math.random() > 0.8,
        evolutionStage: Math.floor(Math.random() * 4) + 1,
        rarityScore: Math.floor(Math.random() * 150) + 100,
        birthTimestamp: Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
      };

      setNftData(sampleData);
    } catch (err: any) {
      setError(err.message || 'Failed to load NFT data');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareNFT = () => {
    if (navigator.share && nftData) {
      navigator.share({
        title: nftData.name,
        text: nftData.description.split('\n')[0],
        url: window.location.href
      });
    } else if (nftData) {
      copyToClipboard(window.location.href);
    }
  };

  const getTraitRarity = (traitType: string, value: string | number) => {
    // Simulate rarity calculation
    const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
    return rarities[Math.floor(Math.random() * rarities.length)];
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Epic': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'Rare': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Uncommon': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-teal-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/70">Loading MONARA #{tokenId}...</p>
        </div>
      </div>
    );
  }

  if (error || !nftData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-teal-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <span className="text-red-400 text-xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-white">NFT Not Found</h2>
          <p className="text-white/70">{error || `MONARA #${tokenId} does not exist or hasn't been minted yet.`}</p>
          <Link href="/gallery" className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-teal-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/gallery" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Gallery
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={shareNFT}
                className="inline-flex items-center px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button className="inline-flex items-center px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                <Heart className="w-4 h-4 mr-2" />
                Favorite
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - NFT Display */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
              {/* NFT Image/Animation */}
              <div className="aspect-square relative">
                <iframe
                  src={nftData.animation_url}
                  className="w-full h-full border-0"
                  title={nftData.name}
                  sandbox="allow-scripts"
                />
                
                {/* Overlay Info */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  {nftData.isQuantum && (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-medium border border-yellow-500/30">
                      ⚡ Quantum Genesis
                    </span>
                  )}
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                    Stage {nftData.evolutionStage}/4
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-6 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => copyToClipboard(nftData.external_url)}
                    className="flex items-center justify-center px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                  >
                    {copied ? (
                      <>
                        <span className="w-4 h-4 mr-2">✓</span>
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </>
                    )}
                  </button>
                  <a
                    href={`https://testnet.monadexplorer.com/address/${MONARA_KNOWN_ASSET.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Explorer
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - NFT Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-white">{nftData.name}</h1>
                  <div className="flex items-center space-x-2">
                    {nftData.isQuantum ? (
                      <Zap className="w-6 h-6 text-yellow-400" />
                    ) : (
                      <Sparkles className="w-6 h-6 text-purple-400" />
                    )}
                  </div>
                </div>
                
                <p className="text-white/70 whitespace-pre-line">{nftData.description}</p>
                
                {/* Owner Info */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <p className="text-sm text-white/60">Owned by</p>
                    <p className="text-white font-medium">
                      {nftData.owner === address ? 'You' : `${nftData.owner?.slice(0, 6)}...${nftData.owner?.slice(-4)}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/60">Collection</p>
                    <p className="text-white font-medium">MONARA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-xl font-bold text-white">{nftData.rarityScore}</div>
                <div className="text-sm text-white/60">Rarity Score</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-xl font-bold text-white">
                  {Math.floor((Date.now() - (nftData.birthTimestamp || Date.now())) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-white/60">Days Old</div>
              </div>
            </div>

            {/* Attributes */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-400" />
                Attributes
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {nftData.attributes.map((attr, index) => {
                  if (attr.display_type) return null; // Skip special display types for now
                  
                  const rarity = getTraitRarity(attr.trait_type, attr.value);
                  
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border ${getRarityColor(rarity)} transition-all hover:scale-105`}
                    >
                      <div className="text-sm opacity-80 mb-1">{attr.trait_type}</div>
                      <div className="font-semibold">{attr.value}</div>
                      <div className="text-xs mt-1 opacity-60">{rarity}</div>
                    </div>
                  );
                })}
              </div>

              {/* Special Attributes */}
              <div className="mt-6 space-y-3">
                {nftData.attributes
                  .filter(attr => attr.display_type)
                  .map((attr, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <span className="text-white/80">{attr.trait_type}</span>
                      <span className="text-white font-medium">
                        {attr.display_type === 'boost_percentage' ? `${attr.value}%` : attr.value}
                        {attr.max_value && ` / ${attr.max_value}`}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Collection Info */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Collection Details</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Contract Address</span>
                  <button
                    onClick={() => copyToClipboard(MONARA_KNOWN_ASSET.address)}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {MONARA_KNOWN_ASSET.address.slice(0, 6)}...{MONARA_KNOWN_ASSET.address.slice(-4)}
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Token Standard</span>
                  <span className="text-white">ERC-721</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Blockchain</span>
                  <span className="text-white">Monad Testnet</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Total Supply</span>
                  <span className="text-white">{contractStats.totalSupply.toLocaleString()} / {contractStats.maxSupply.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 