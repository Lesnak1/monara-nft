'use client';

import React, { useState } from 'react';
import { Background } from "@/components/Background";
import Link from 'next/link';
import { 
  Shield, 
  Code, 
  Copy, 
  CheckCircle,
  ExternalLink,
  ArrowRight,
  Cpu,
  Database,
  Zap,
  Globe,
  Lock,
  FileText,
  Network,
  Eye,
  Download,
  Settings,
  BookOpen,
  Users,
  Activity
} from 'lucide-react';

export default function SmartContractPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const contractAddress = "0xa7793FfC44680c03dC18ab0972b2a96A20d82335";

  const abiExample = `[
  {
    "inputs": [],
    "name": "neuralGenesis",
    "outputs": [{"type": "uint256", "name": "tokenId"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "quantumGenesis", 
    "outputs": [{"type": "uint256", "name": "tokenId"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "tokenId"}],
    "name": "evolve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "tokenId"}],
    "name": "generateSVG",
    "outputs": [{"type": "string", "name": ""}],
    "stateMutability": "view",
    "type": "function"
  }
]`;

  const deploymentScript = `// Deploy MONARA Contract
// Foundry deployment script

pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MONARA.sol";

contract DeployMONARA is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        MONARA monara = new MONARA();
        
        console.log("MONARA deployed to:", address(monara));
        
        vm.stopBroadcast();
    }
}`;

  const interactionExample = `import { useContractWrite, useContractRead } from 'wagmi';

const MONARA_ADDRESS = '0xa7793FfC44680c03dC18ab0972b2a96A20d82335';

// Mint Neural Genesis (0.1 MON)
const { write: mintNeural } = useContractWrite({
  address: MONARA_ADDRESS,
  abi: MONARA_ABI,
  functionName: 'neuralGenesis',
  value: parseEther('0.1'),
});

// Mint Quantum Genesis (0.25 MON)  
const { write: mintQuantum } = useContractWrite({
  address: MONARA_ADDRESS,
  abi: MONARA_ABI,
  functionName: 'quantumGenesis',
  value: parseEther('0.25'),
});

// Read total supply
const { data: totalSupply } = useContractRead({
  address: MONARA_ADDRESS,
  abi: MONARA_ABI,
  functionName: 'totalSupply',
});

// Get token SVG
const { data: tokenSVG } = useContractRead({
  address: MONARA_ADDRESS,
  abi: MONARA_ABI,
  functionName: 'generateSVG',
  args: [BigInt(tokenId)],
});`;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-orange-500/20 rounded-full text-orange-300 text-sm font-medium border border-orange-500/30">
            <Shield className="w-4 h-4 mr-2" />
            Smart Contract
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
            MONARA Contract
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Explore the MONARA smart contract on Monad Testnet. Fully on-chain SVG generation, 
            evolution mechanics, and neural network visualizations - all verifiable and transparent.
          </p>
        </div>

        {/* Contract Overview */}
        <section className="mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <Cpu className="w-8 h-8 mr-3 text-orange-400" />
              Contract Overview
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Contract Details */}
              <div className="space-y-6">
                <div className="bg-black/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Contract Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Address:</span>
                      <div className="flex items-center space-x-2">
                        <code className="text-orange-300 bg-black/40 px-2 py-1 rounded">{contractAddress}</code>
                        <button
                          onClick={() => copyToClipboard(contractAddress, 'address')}
                          className="text-white/60 hover:text-white transition-colors"
                        >
                          {copiedCode === 'address' ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Network:</span>
                      <span className="text-white">Monad Testnet</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Chain ID:</span>
                      <span className="text-white">10159</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Standard:</span>
                      <span className="text-white">ERC-721</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Max Supply:</span>
                      <span className="text-white">10,000 NFTs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Compiler:</span>
                      <span className="text-white">Solidity 0.8.20</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Pricing</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span className="text-white/80">Neural Genesis</span>
                      </div>
                      <span className="text-blue-300 font-semibold">0.1 MON</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                        <span className="text-white/80">Quantum Genesis</span>
                      </div>
                      <span className="text-purple-300 font-semibold">0.25 MON</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="text-white/80">Evolution</span>
                      </div>
                      <span className="text-green-300 font-semibold">Free</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="space-y-6">
                <div className="bg-black/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Key Features</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Database className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="text-white font-medium">On-Chain SVG Generation</h4>
                        <p className="text-white/60 text-sm">Complete artwork generation stored on blockchain</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Activity className="w-5 h-5 text-purple-400 mt-0.5" />
                      <div>
                        <h4 className="text-white font-medium">Evolution Mechanics</h4>
                        <p className="text-white/60 text-sm">Time-based evolution and mutation system</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Network className="w-5 h-5 text-green-400 mt-0.5" />
                      <div>
                        <h4 className="text-white font-medium">Neural Networks</h4>
                        <p className="text-white/60 text-sm">Dynamic neural pathway visualizations</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Lock className="w-5 h-5 text-red-400 mt-0.5" />
                      <div>
                        <h4 className="text-white font-medium">Rate Limiting</h4>
                        <p className="text-white/60 text-sm">Built-in protection against spam minting</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Security Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span className="text-white/80 text-sm">OpenZeppelin contracts</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span className="text-white/80 text-sm">Reentrancy protection</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span className="text-white/80 text-sm">Access control patterns</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span className="text-white/80 text-sm">Gas optimization</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href={`https://testnet.monadexplorer.com/address/${contractAddress}`}
                target="_blank"
                className="flex items-center justify-center space-x-3 bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-xl transition-colors"
              >
                <Eye className="w-5 h-5" />
                <span>View on Explorer</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
              
              <Link 
                href="/documentation"
                className="flex items-center justify-center space-x-3 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span>Documentation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link 
                href="/mint"
                className="flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors"
              >
                <Zap className="w-5 h-5" />
                <span>Mint NFT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Main Functions */}
        <section className="mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <Code className="w-8 h-8 mr-3 text-blue-400" />
              Main Functions
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Minting Functions */}
              <div className="space-y-6">
                <div className="bg-black/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm font-mono mr-3">payable</span>
                    neuralGenesis()
                  </h3>
                  <p className="text-white/70 mb-4">
                    Mints a Neural Genesis NFT with blue-themed neural network patterns. 
                    Costs 0.1 MON and creates unique AI-inspired artwork.
                  </p>
                  <div className="bg-black/40 rounded-lg p-3">
                    <code className="text-sm text-green-300">
                      function neuralGenesis() external payable returns (uint256)
                    </code>
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm font-mono mr-3">payable</span>
                    quantumGenesis()
                  </h3>
                  <p className="text-white/70 mb-4">
                    Mints a Quantum Genesis NFT with advanced purple quantum-inspired designs. 
                    Premium option at 0.25 MON with enhanced visual complexity.
                  </p>
                  <div className="bg-black/40 rounded-lg p-3">
                    <code className="text-sm text-green-300">
                      function quantumGenesis() external payable returns (uint256)
                    </code>
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm font-mono mr-3">free</span>
                    evolve(tokenId)
                  </h3>
                  <p className="text-white/70 mb-4">
                    Triggers evolution for an existing NFT. Free function that updates 
                    the visual representation based on time and random factors.
                  </p>
                  <div className="bg-black/40 rounded-lg p-3">
                    <code className="text-sm text-green-300">
                      function evolve(uint256 tokenId) external
                    </code>
                  </div>
                </div>
              </div>

              {/* View Functions */}
              <div className="space-y-6">
                <div className="bg-black/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-sm font-mono mr-3">view</span>
                    generateSVG(tokenId)
                  </h3>
                  <p className="text-white/70 mb-4">
                    Returns the complete SVG artwork for a token. All generation 
                    happens on-chain using mathematical algorithms and randomness.
                  </p>
                  <div className="bg-black/40 rounded-lg p-3">
                    <code className="text-sm text-blue-300">
                      function generateSVG(uint256 tokenId) external view returns (string)
                    </code>
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-sm font-mono mr-3">view</span>
                    tokenURI(tokenId)
                  </h3>
                  <p className="text-white/70 mb-4">
                    Standard ERC-721 function returning metadata URI. 
                    Points to our API endpoints for JSON metadata.
                  </p>
                  <div className="bg-black/40 rounded-lg p-3">
                    <code className="text-sm text-blue-300">
                      function tokenURI(uint256 tokenId) external view returns (string)
                    </code>
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-sm font-mono mr-3">view</span>
                    totalSupply()
                  </h3>
                  <p className="text-white/70 mb-4">
                    Returns the current total number of minted NFTs. 
                    Useful for tracking collection progress and rarity.
                  </p>
                  <div className="bg-black/40 rounded-lg p-3">
                    <code className="text-sm text-blue-300">
                      function totalSupply() external view returns (uint256)
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABI Section */}
        <section className="mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-purple-400" />
              Contract ABI
            </h2>

            <p className="text-white/70 mb-6">
              Application Binary Interface (ABI) for integrating with the MONARA smart contract. 
              Use this to interact with the contract from your dApp or scripts.
            </p>

            <div className="bg-black/30 rounded-xl p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60">Contract ABI (Partial)</span>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => copyToClipboard(abiExample, 'abi')}
                    className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
                  >
                    {copiedCode === 'abi' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span className="text-sm">{copiedCode === 'abi' ? 'Copied!' : 'Copy ABI'}</span>
                  </button>
                  <Link 
                    href="/api/contract/abi"
                    className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Download Full ABI</span>
                  </Link>
                </div>
              </div>
              <pre className="text-sm text-white/80 overflow-x-auto max-h-96">
                <code>{abiExample}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Integration Examples */}
        <section className="mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <Settings className="w-8 h-8 mr-3 text-green-400" />
              Integration Examples
            </h2>

            <div className="space-y-8">
              {/* Wagmi Integration */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">React + Wagmi Integration</h3>
                <div className="bg-black/30 rounded-xl p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/60">React Hooks Example</span>
                    <button
                      onClick={() => copyToClipboard(interactionExample, 'interaction')}
                      className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
                    >
                      {copiedCode === 'interaction' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span className="text-sm">{copiedCode === 'interaction' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="text-sm text-white/80 overflow-x-auto">
                    <code>{interactionExample}</code>
                  </pre>
                </div>
              </div>

              {/* Deployment Script */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Foundry Deployment Script</h3>
                <div className="bg-black/30 rounded-xl p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/60">Foundry Script</span>
                    <button
                      onClick={() => copyToClipboard(deploymentScript, 'deployment')}
                      className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
                    >
                      {copiedCode === 'deployment' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span className="text-sm">{copiedCode === 'deployment' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="text-sm text-white/80 overflow-x-auto">
                    <code>{deploymentScript}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community & Support */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-orange-900/50 via-red-900/50 to-pink-900/50 backdrop-blur-sm rounded-3xl border border-white/10 p-12">
            <h2 className="text-3xl font-bold text-white mb-6">Join the Developer Community</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
              Connect with other developers building on MONARA. Share experiences, get help, 
              and collaborate on the future of evolving NFTs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="https://github.com/leknax/monara" 
                target="_blank"
                className="inline-flex items-center px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
              >
                <Code className="w-5 h-5 mr-2" />
                <span>View Source Code</span>
                <ExternalLink className="w-5 h-5 ml-2" />
              </Link>
              
              <Link 
                href="https://discord.gg/monara" 
                target="_blank"
                className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
              >
                <Users className="w-5 h-5 mr-2" />
                <span>Join Discord</span>
                <ExternalLink className="w-5 h-5 ml-2" />
              </Link>
              
              <Link 
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors"
              >
                <span>Get Support</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 