'use client';

import React from 'react';
import { Background } from "@/components/Background";
import Link from 'next/link';
import { 
  Book, 
  Code, 
  Zap, 
  ExternalLink, 
  Copy, 
  CheckCircle,
  ArrowRight,
  Database,
  Shield,
  Sparkles,
  Brain,
  Clock
} from 'lucide-react';
import { useState } from 'react';

export default function DocumentationPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeBlocks = {
    addNetwork: `{
  "chainId": "0x279f",
  "chainName": "Monad Testnet",
  "nativeCurrency": {
    "name": "MON",
    "symbol": "MON",
    "decimals": 18
  },
  "rpcUrls": ["https://testnet-rpc.monad.xyz"],
  "blockExplorerUrls": ["https://testnet.monadexplorer.com"]
}`,
    mintNFT: `import { useContractWrite } from 'wagmi';

const { write: mintNFT } = useContractWrite({
  address: '0xd181dF3D2E8B8AB21bd49EFAf655a3AeFdd7c459',
  abi: MONARA_ABI,
  functionName: 'neuralGenesis',
  value: parseEther('0.1'), // 0.1 MON
});

// Call mint function
mintNFT?.();`,
    readContract: `import { useContractRead } from 'wagmi';

const { data: totalSupply } = useContractRead({
  address: '0xd181dF3D2E8B8AB21bd49EFAf655a3AeFdd7c459',
  abi: MONARA_ABI,
  functionName: 'totalSupply',
});

console.log('Total Supply:', totalSupply?.toString());`,
    svgGeneration: `const { data: svgData } = useContractRead({
  address: '0xd181dF3D2E8B8AB21bd49EFAf655a3AeFdd7c459',
  abi: MONARA_ABI,
  functionName: 'generateSVG',
  args: [BigInt(tokenId)],
});

// SVG is generated entirely on-chain!
console.log('Generated SVG:', svgData);`
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm font-medium border border-purple-500/30">
            <Book className="w-4 h-4 mr-2" />
            Developer Documentation
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-teal-400 bg-clip-text text-transparent">
            MONARA Docs
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Complete developer guide for building with MONARA. Learn how to integrate evolving NFTs, 
            interact with smart contracts, and create next-generation dApps on Monad Network.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <a href="#getting-started" className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Getting Started</h3>
            <p className="text-white/60 text-sm">Quick setup and basic integration</p>
          </a>

          <a href="#smart-contracts" className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Code className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Smart Contracts</h3>
            <p className="text-white/60 text-sm">Contract interfaces and ABIs</p>
          </a>

          <a href="#api-reference" className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">API Reference</h3>
            <p className="text-white/60 text-sm">REST APIs and GraphQL endpoints</p>
          </a>

          <a href="#examples" className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Code Examples</h3>
            <p className="text-white/60 text-sm">Working examples and tutorials</p>
          </a>
        </div>

        {/* Getting Started Section */}
        <section id="getting-started" className="mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 lg:p-12">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Getting Started</h2>
            </div>

            <div className="space-y-8">
              {/* Step 1: Network Setup */}
              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">1</span>
                  Add Monad Testnet to MetaMask
                </h3>
                <p className="text-white/70 mb-4">
                  First, add the Monad Testnet to your MetaMask wallet. You can add it manually or use our automated setup.
                </p>
                
                <div className="bg-black/30 rounded-xl p-4 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Network Configuration</span>
                    <button
                      onClick={() => copyToClipboard(codeBlocks.addNetwork, 'addNetwork')}
                      className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
                    >
                      {copiedCode === 'addNetwork' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span className="text-sm">{copiedCode === 'addNetwork' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="text-sm text-white/80 overflow-x-auto">
                    <code>{codeBlocks.addNetwork}</code>
                  </pre>
                </div>
              </div>

              {/* Step 2: Get Test Tokens */}
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">2</span>
                  Get Test MON Tokens
                </h3>
                <p className="text-white/70 mb-4">
                  You'll need MON tokens to mint NFTs. Get free testnet tokens from the official faucet.
                </p>
                
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link 
                    href="https://faucet.monad.xyz" 
                    target="_blank"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                  >
                    <span>Visit Faucet</span>
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
                  
                  <div className="flex items-center space-x-2 text-white/60">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Usually takes 1-2 minutes</span>
                  </div>
                </div>
              </div>

              {/* Step 3: Start Building */}
              <div className="border-l-4 border-teal-500 pl-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">3</span>
                  Start Building
                </h3>
                <p className="text-white/70 mb-4">
                  Install the required dependencies and start building your MONARA-powered dApp.
                </p>
                
                <div className="bg-black/30 rounded-xl p-4">
                  <pre className="text-sm text-white/80">
                    <code>{`npm install wagmi viem @rainbow-me/rainbowkit
npm install @tanstack/react-query`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Smart Contracts Section */}
        <section id="smart-contracts" className="mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 lg:p-12">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Smart Contracts</h2>
            </div>

            <div className="space-y-8">
              {/* Contract Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-black/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Contract Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Address:</span>
                      <code className="text-purple-300">0xd181...c459</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Network:</span>
                      <span className="text-white">Monad Testnet</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Standard:</span>
                      <span className="text-white">ERC-721</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Max Supply:</span>
                      <span className="text-white">10,000</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Key Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Brain className="w-4 h-4 text-purple-400" />
                      <span className="text-white/80 text-sm">On-chain SVG generation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-white/80 text-sm">Time-based evolution</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="text-white/80 text-sm">Mutation system</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span className="text-white/80 text-sm">Rate limiting & security</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Examples */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Code Examples</h3>
                
                {/* Mint NFT */}
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Minting an NFT</h4>
                  <div className="bg-black/30 rounded-xl p-4 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/60 text-sm">React Hook Example</span>
                      <button
                        onClick={() => copyToClipboard(codeBlocks.mintNFT, 'mintNFT')}
                        className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
                      >
                        {copiedCode === 'mintNFT' ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        <span className="text-sm">{copiedCode === 'mintNFT' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="text-sm text-white/80 overflow-x-auto">
                      <code>{codeBlocks.mintNFT}</code>
                    </pre>
                  </div>
                </div>

                {/* Read Contract */}
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Reading Contract Data</h4>
                  <div className="bg-black/30 rounded-xl p-4 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/60 text-sm">Reading Total Supply</span>
                      <button
                        onClick={() => copyToClipboard(codeBlocks.readContract, 'readContract')}
                        className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
                      >
                        {copiedCode === 'readContract' ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        <span className="text-sm">{copiedCode === 'readContract' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="text-sm text-white/80 overflow-x-auto">
                      <code>{codeBlocks.readContract}</code>
                    </pre>
                  </div>
                </div>

                {/* SVG Generation */}
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">On-Chain SVG Generation</h4>
                  <div className="bg-black/30 rounded-xl p-4 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/60 text-sm">Generate NFT Artwork</span>
                      <button
                        onClick={() => copyToClipboard(codeBlocks.svgGeneration, 'svgGeneration')}
                        className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
                      >
                        {copiedCode === 'svgGeneration' ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        <span className="text-sm">{copiedCode === 'svgGeneration' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="text-sm text-white/80 overflow-x-auto">
                      <code>{codeBlocks.svgGeneration}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* API Reference Section */}
        <section id="api-reference" className="mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 lg:p-12">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">API Reference</h2>
            </div>

            <div className="space-y-8">
              <p className="text-white/70 text-lg">
                MONARA provides REST APIs for accessing NFT metadata, images, and animations. 
                All endpoints are publicly accessible and optimized for performance.
              </p>

              {/* Base URL */}
              <div className="bg-black/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Base URL</h3>
                <code className="text-purple-300 bg-black/40 px-4 py-2 rounded-lg">
                  https://monara-nft.vercel.app/api
                </code>
              </div>

              {/* Endpoints */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Endpoints</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* NFT Image */}
                  <div className="bg-black/20 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm font-mono">GET</span>
                      <code className="text-white">/nft/{'{tokenId}'}/image</code>
                    </div>
                    <p className="text-white/70 mb-4">Returns the SVG image for a specific NFT token.</p>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-white/60">Response:</span> <code className="text-purple-300">image/svg+xml</code></div>
                      <div><span className="text-white/60">Cache:</span> <span className="text-white/80">1 hour</span></div>
                    </div>
                  </div>

                  {/* NFT Animation */}
                  <div className="bg-black/20 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm font-mono">GET</span>
                      <code className="text-white">/nft/{'{tokenId}'}/animation</code>
                    </div>
                    <p className="text-white/70 mb-4">Returns the animated SVG for a specific NFT token.</p>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-white/60">Response:</span> <code className="text-purple-300">image/svg+xml</code></div>
                      <div><span className="text-white/60">Cache:</span> <span className="text-white/80">1 hour</span></div>
                    </div>
                  </div>

                  {/* NFT Metadata */}
                  <div className="bg-black/20 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm font-mono">GET</span>
                      <code className="text-white">/nft/{'{tokenId}'}/metadata</code>
                    </div>
                    <p className="text-white/70 mb-4">Returns complete metadata for a specific NFT token.</p>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-white/60">Response:</span> <code className="text-purple-300">application/json</code></div>
                      <div><span className="text-white/60">Cache:</span> <span className="text-white/80">1 hour</span></div>
                    </div>
                  </div>

                  {/* OG Image */}
                  <div className="bg-black/20 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm font-mono">GET</span>
                      <code className="text-white">/og</code>
                    </div>
                    <p className="text-white/70 mb-4">Generates dynamic Open Graph images for social sharing.</p>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-white/60">Response:</span> <code className="text-purple-300">image/png</code></div>
                      <div><span className="text-white/60">Size:</span> <span className="text-white/80">1200×630</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Examples Section */}
        <section id="examples" className="mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 lg:p-12">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-orange-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Code Examples</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Quick Start Example</h3>
                <p className="text-white/70">
                  Complete example showing how to integrate MONARA into your React application.
                </p>
                
                <Link 
                  href="https://github.com/leknax/monara-examples" 
                  target="_blank"
                  className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors"
                >
                  <span>View on GitHub</span>
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Advanced Integration</h3>
                <p className="text-white/70">
                  Advanced examples including custom evolution tracking, batch operations, and more.
                </p>
                
                <Link 
                  href="https://github.com/leknax/monara-advanced" 
                  target="_blank"
                  className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
                >
                  <span>Advanced Examples</span>
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-teal-900/50 backdrop-blur-sm rounded-3xl border border-white/10 p-12">
            <h2 className="text-3xl font-bold text-white mb-6">Need Help?</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
              Join our community or reach out directly. We're here to help you build amazing things with MONARA.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
              >
                <span>Contact Support</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link 
                href="https://discord.gg/monara" 
                target="_blank"
                className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors"
              >
                <span>Join Discord</span>
                <ExternalLink className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 