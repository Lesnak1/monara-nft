'use client';

import React, { useState } from 'react';
import { Background } from "@/components/Background";
import Link from 'next/link';
import { 
  Database, 
  Code, 
  Copy, 
  CheckCircle,
  ExternalLink,
  ArrowRight,
  Server,
  Zap,
  Image,
  FileText,
  Play,
  Globe,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function APIReferencePage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const examples = {
    imageEndpoint: `curl -X GET "https://monara-nft.vercel.app/api/nft/1/image" \\
  -H "Accept: image/svg+xml"`,
    animationEndpoint: `curl -X GET "https://monara-nft.vercel.app/api/nft/1/animation" \\
  -H "Accept: image/svg+xml"`,
    metadataEndpoint: `curl -X GET "https://monara-nft.vercel.app/api/nft/1/metadata" \\
  -H "Accept: application/json"`,
    ogEndpoint: `curl -X GET "https://monara-nft.vercel.app/api/og?title=MONARA%20NFT&description=Evolving%20Digital%20Beings"`,
    jsExample: `// Using fetch API
const fetchNFTData = async (tokenId) => {
  try {
    const response = await fetch(\`https://monara-nft.vercel.app/api/nft/\${tokenId}/metadata\`);
    const metadata = await response.json();
    
    console.log('NFT Metadata:', metadata);
    return metadata;
  } catch (error) {
    console.error('Error fetching NFT data:', error);
  }
};

// Get SVG image
const fetchNFTImage = async (tokenId) => {
  const response = await fetch(\`https://monara-nft.vercel.app/api/nft/\${tokenId}/image\`);
  const svgText = await response.text();
  return svgText;
};`,
    reactExample: `import { useState, useEffect } from 'react';

const NFTViewer = ({ tokenId }) => {
  const [metadata, setMetadata] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNFTData = async () => {
      try {
        // Fetch metadata
        const metaResponse = await fetch(\`/api/nft/\${tokenId}/metadata\`);
        const metaData = await metaResponse.json();
        setMetadata(metaData);

        // Set image URL
        setImageUrl(\`/api/nft/\${tokenId}/image\`);
      } catch (error) {
        console.error('Error loading NFT:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNFTData();
  }, [tokenId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="nft-viewer">
      <h2>{metadata?.name}</h2>
      <img src={imageUrl} alt={metadata?.name} />
      <p>{metadata?.description}</p>
    </div>
  );
};`
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm font-medium border border-blue-500/30">
            <Database className="w-4 h-4 mr-2" />
            API Reference
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
            MONARA API
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Complete REST API reference for accessing MONARA NFT data. Get metadata, images, animations, 
            and more with our high-performance endpoints optimized for modern applications.
          </p>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Server className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Base URL</h3>
                <code className="text-green-400 text-sm">monara-nft.vercel.app</code>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Rate Limit</h3>
                <span className="text-white/70 text-sm">100 requests/minute</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Authentication</h3>
                <span className="text-white/70 text-sm">Public API - No auth required</span>
              </div>
            </div>
          </div>
        </div>

        {/* Endpoints Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <Code className="w-8 h-8 mr-3 text-blue-400" />
            API Endpoints
          </h2>

          <div className="space-y-8">
            {/* NFT Image Endpoint */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
              <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm font-mono">GET</span>
                    <code className="text-xl font-semibold text-white">/api/nft/{'{tokenId}'}/image</code>
                  </div>
                  
                  <p className="text-white/70 mb-6">
                    Returns the on-chain generated SVG image for a specific NFT token. The image is dynamically 
                    created based on the token's unique properties and current evolution state.
                  </p>

                  {/* Parameters */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Parameters</h4>
                    <div className="bg-black/20 rounded-xl p-4">
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <code className="text-purple-300">tokenId</code>
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">required</span>
                        </div>
                        <span className="text-white/60 text-sm">integer</span>
                      </div>
                      <p className="text-white/60 text-sm mt-1">The unique identifier of the NFT token (1-10000)</p>
                    </div>
                  </div>

                  {/* Response */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Response</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">200</span>
                        <code className="text-white/80">image/svg+xml</code>
                        <span className="text-white/60 text-sm">- SVG image data</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-sm">404</span>
                        <code className="text-white/80">application/json</code>
                        <span className="text-white/60 text-sm">- Token not found</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Code Example */}
                <div className="lg:w-1/2">
                  <div className="bg-black/30 rounded-xl p-4 relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white/60 text-sm">cURL Example</span>
                      <button
                        onClick={() => copyToClipboard(examples.imageEndpoint, 'imageEndpoint')}
                        className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
                      >
                        {copiedCode === 'imageEndpoint' ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        <span className="text-sm">{copiedCode === 'imageEndpoint' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="text-sm text-white/80 overflow-x-auto">
                      <code>{examples.imageEndpoint}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* NFT Animation Endpoint */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
              <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm font-mono">GET</span>
                    <code className="text-xl font-semibold text-white">/api/nft/{'{tokenId}'}/animation</code>
                  </div>
                  
                  <p className="text-white/70 mb-6">
                    Returns the animated SVG version with neural network visualizations and evolution effects. 
                    Features dynamic particle systems and morphing geometries.
                  </p>

                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Play className="w-4 h-4 text-yellow-400" />
                      <span className="text-white/80 text-sm">Animated</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span className="text-white/80 text-sm">Interactive</span>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/2">
                  <div className="bg-black/30 rounded-xl p-4 relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white/60 text-sm">cURL Example</span>
                      <button
                        onClick={() => copyToClipboard(examples.animationEndpoint, 'animationEndpoint')}
                        className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
                      >
                        {copiedCode === 'animationEndpoint' ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        <span className="text-sm">{copiedCode === 'animationEndpoint' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="text-sm text-white/80 overflow-x-auto">
                      <code>{examples.animationEndpoint}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* NFT Metadata Endpoint */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
              <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm font-mono">GET</span>
                    <code className="text-xl font-semibold text-white">/api/nft/{'{tokenId}'}/metadata</code>
                  </div>
                  
                  <p className="text-white/70 mb-6">
                    Returns complete ERC-721 compatible metadata including name, description, attributes, 
                    and links to image and animation resources.
                  </p>

                  {/* Response Schema */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Response Schema</h4>
                    <div className="bg-black/20 rounded-xl p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <code className="text-purple-300">name</code>
                        <span className="text-white/60">string</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="text-purple-300">description</code>
                        <span className="text-white/60">string</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="text-purple-300">image</code>
                        <span className="text-white/60">string (URL)</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="text-purple-300">animation_url</code>
                        <span className="text-white/60">string (URL)</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="text-purple-300">attributes</code>
                        <span className="text-white/60">array</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="text-purple-300">external_url</code>
                        <span className="text-white/60">string (URL)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/2">
                  <div className="bg-black/30 rounded-xl p-4 relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white/60 text-sm">cURL Example</span>
                      <button
                        onClick={() => copyToClipboard(examples.metadataEndpoint, 'metadataEndpoint')}
                        className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
                      >
                        {copiedCode === 'metadataEndpoint' ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        <span className="text-sm">{copiedCode === 'metadataEndpoint' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="text-sm text-white/80 overflow-x-auto">
                      <code>{examples.metadataEndpoint}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* OG Image Endpoint */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
              <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm font-mono">GET</span>
                    <code className="text-xl font-semibold text-white">/api/og</code>
                  </div>
                  
                  <p className="text-white/70 mb-6">
                    Generates dynamic Open Graph images for social media sharing. Perfect for Twitter cards, 
                    Facebook posts, and Discord embeds with customizable text overlays.
                  </p>

                  {/* Query Parameters */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Query Parameters</h4>
                    <div className="bg-black/20 rounded-xl p-4 space-y-3 text-sm">
                      <div className="border-b border-white/10 pb-2">
                        <div className="flex items-center justify-between">
                          <code className="text-purple-300">title</code>
                          <span className="text-white/60">string (optional)</span>
                        </div>
                        <p className="text-white/60 text-xs mt-1">Custom title text (default: "MONARA")</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <code className="text-purple-300">description</code>
                          <span className="text-white/60">string (optional)</span>
                        </div>
                        <p className="text-white/60 text-xs mt-1">Custom description text</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/2">
                  <div className="bg-black/30 rounded-xl p-4 relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white/60 text-sm">cURL Example</span>
                      <button
                        onClick={() => copyToClipboard(examples.ogEndpoint, 'ogEndpoint')}
                        className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
                      >
                        {copiedCode === 'ogEndpoint' ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        <span className="text-sm">{copiedCode === 'ogEndpoint' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="text-sm text-white/80 overflow-x-auto">
                      <code>{examples.ogEndpoint}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Code Examples Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <Code className="w-8 h-8 mr-3 text-purple-400" />
            Code Examples
          </h2>

          <div className="space-y-8">
            {/* JavaScript Example */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
              <h3 className="text-xl font-semibold text-white mb-4">JavaScript / TypeScript</h3>
              <div className="bg-black/30 rounded-xl p-4 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/60 text-sm">Vanilla JavaScript</span>
                  <button
                    onClick={() => copyToClipboard(examples.jsExample, 'jsExample')}
                    className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
                  >
                    {copiedCode === 'jsExample' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span className="text-sm">{copiedCode === 'jsExample' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="text-sm text-white/80 overflow-x-auto">
                  <code>{examples.jsExample}</code>
                </pre>
              </div>
            </div>

            {/* React Example */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
              <h3 className="text-xl font-semibold text-white mb-4">React Component</h3>
              <div className="bg-black/30 rounded-xl p-4 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/60 text-sm">React Hook Example</span>
                  <button
                    onClick={() => copyToClipboard(examples.reactExample, 'reactExample')}
                    className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
                  >
                    {copiedCode === 'reactExample' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span className="text-sm">{copiedCode === 'reactExample' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="text-sm text-white/80 overflow-x-auto">
                  <code>{examples.reactExample}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Error Handling Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <AlertCircle className="w-8 h-8 mr-3 text-red-400" />
            Error Handling
          </h2>

          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">HTTP Status Codes</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm font-mono">200</span>
                    <span className="text-white/80">Success - Request completed successfully</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-sm font-mono">400</span>
                    <span className="text-white/80">Bad Request - Invalid parameters</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-sm font-mono">404</span>
                    <span className="text-white/80">Not Found - Token doesn't exist</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-sm font-mono">429</span>
                    <span className="text-white/80">Rate Limited - Too many requests</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-sm font-mono">500</span>
                    <span className="text-white/80">Server Error - Internal error occurred</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Best Practices</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                    <span className="text-white/80">Always check HTTP status codes</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                    <span className="text-white/80">Implement retry logic for 5xx errors</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                    <span className="text-white/80">Cache responses when appropriate</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                    <span className="text-white/80">Respect rate limits (100/min)</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                    <span className="text-white/80">Use appropriate Accept headers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-teal-900/50 backdrop-blur-sm rounded-3xl border border-white/10 p-12">
            <h2 className="text-3xl font-bold text-white mb-6">Need API Support?</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
              Questions about our API? Found a bug? Want to request a new feature? 
              We're here to help you build amazing applications with MONARA.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/documentation" 
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                <span>View Documentation</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link 
                href="/contact" 
                className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors"
              >
                <span>Contact Support</span>
                <ExternalLink className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 