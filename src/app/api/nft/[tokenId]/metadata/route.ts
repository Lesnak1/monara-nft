import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { MONARA_ABI } from '@/lib/contracts/MONARA';

// Monad Testnet configuration
const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
      webSocket: ['wss://testnet-rpc.monad.xyz'],
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz'],
      webSocket: ['wss://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://testnet.monadexplorer.com' },
  },
};

const MONARA_CONTRACT_ADDRESS = '0xa7793FfC44680c03dC18ab0972b2a96A20d82335';

// Create public client with retry
const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http('https://testnet-rpc.monad.xyz', {
    timeout: 10000,
    retryCount: 3,
    retryDelay: 1000,
  }),
});

interface TokenMetadata {
  name: string;
  description: string;
  image: string;
  animation_url: string;
  external_url: string;
  background_color: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
    max_value?: number;
    display_type?: string;
  }>;
  properties: {
    evolution_stage: number;
    max_evolution_stage: number;
    rarity_score: number;
    is_quantum: boolean;
    birth_timestamp: number;
    neural_complexity: number;
    contract_address: string;
    chain_id: number;
    network: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  try {
    const { tokenId } = await params;
    
    console.log(`📋 Metadata API called for token ID: ${tokenId}`);
    
    if (!tokenId || isNaN(Number(tokenId))) {
      console.error(`❌ Invalid token ID: ${tokenId}`);
      return NextResponse.json(
        { error: 'Invalid token ID' },
        { status: 400 }
      );
    }

    // Get base URL for dynamic links with fallback
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 
                   (host ? `${protocol}://${host}` : 'https://monara-nft.vercel.app');

    console.log(`🌐 Using base URL: ${baseURL}`);

    const numericTokenId = BigInt(tokenId);
    
    // First, check if token exists
    let tokenExists = false;
    let tokenOwner = '';
    
    try {
      const owner = await publicClient.readContract({
        address: MONARA_CONTRACT_ADDRESS,
        abi: MONARA_ABI,
        functionName: 'ownerOf',
        args: [numericTokenId],
      });
      
      if (owner && owner !== '0x0000000000000000000000000000000000000000') {
        tokenExists = true;
        tokenOwner = owner as string;
        console.log(`✅ Token ${tokenId} exists, owner: ${owner}`);
      }
    } catch (existsError) {
      const errorMessage = existsError instanceof Error ? existsError.message : 'Unknown error';
      console.warn(`⚠️ Could not check token existence for ${tokenId}: ${errorMessage}`);
    }

    // Try to get actual metadata from contract
    try {
      console.log(`🔄 Attempting to fetch contract metadata for token ${tokenId}...`);
      
      const contractMetadata = await publicClient.readContract({
        address: MONARA_CONTRACT_ADDRESS,
        abi: MONARA_ABI,
        functionName: 'generateMetadata',
        args: [numericTokenId],
      });

      if (contractMetadata && typeof contractMetadata === 'string' && contractMetadata.trim() !== '') {
        console.log(`✅ Got contract metadata for token ${tokenId}, length: ${contractMetadata.length}`);
        
        try {
          // Parse the contract metadata and override URLs
          const parsedMetadata = JSON.parse(contractMetadata) as TokenMetadata;
          
          // Override URLs to use correct base URL
          const correctedMetadata: TokenMetadata = {
            ...parsedMetadata,
            image: `${baseURL}/api/nft/${tokenId}/image`,
            animation_url: `${baseURL}/api/nft/${tokenId}/animation`,
            external_url: `${baseURL}/nft/${tokenId}`,
          };

          return NextResponse.json(correctedMetadata, {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'public, max-age=3600',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET',
              'Access-Control-Allow-Headers': 'Content-Type',
              'X-Token-ID': tokenId,
              'X-Source': 'contract',
            },
          });
        } catch (parseError) {
          const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown error';
          console.error(`❌ Failed to parse contract metadata for token ${tokenId}:`, errorMessage);
        }
      }
    } catch (contractError) {
      const errorMessage = contractError instanceof Error ? contractError.message : 'Unknown error';
      console.warn(`⚠️ Contract metadata fetch failed for token ${tokenId}:`, errorMessage);
    }

    // Generate enhanced fallback metadata
    console.log(`🔄 Generating fallback metadata for token ${tokenId}`);
    
    // Determine genesis type based on token ID pattern
    const isQuantumGenesis = (parseInt(tokenId) % 5) === 0; // Every 5th token is quantum
    
    // Generate consistent traits based on token ID
    const seed = parseInt(tokenId);
    const coreGeometries = ["Neural Web", "Quantum Circuit", "Data Matrix", "Synaptic Mesh", "Digital Neuron"];
    const environments = ["Cyberspace", "Neural Network", "Quantum Realm", "Data Stream", "Digital Void"];
    const evolutionStages = ["Genesis", "Spark", "Pulse", "Flow"];
    
    const rarityScore = 100 + (seed % 200); // 100-299 range
    const age = Math.floor((Date.now() - 1640995200000) / (1000 * 60 * 60 * 24)); // Days since Jan 1, 2022
    
    const fallbackMetadata: TokenMetadata = {
      name: `MONARA #${tokenId}`,
      description: `🧠 Evolving Digital Being on Monad Network

This MONARA represents a unique neural network visualization that evolves through computational stages on Monad's lightning-fast blockchain. Each being develops distinct characteristics through mathematical algorithms and parallel processing.

**Current Stage:** ${evolutionStages[0]} (1/4)
**Genesis Type:** ${isQuantumGenesis ? 'Quantum Genesis ⚡' : 'Neural Genesis 🧬'}
**Network:** Monad Testnet
**Contract:** ${MONARA_CONTRACT_ADDRESS}

Each MONARA embodies the mathematical beauty of parallel computation, with neural pathways that represent the intersection of art, technology, and consciousness.

${tokenExists ? `**Owner:** ${tokenOwner}` : '**Status:** Initializing...'}`,

      image: `${baseURL}/api/nft/${tokenId}/image`,
      animation_url: `${baseURL}/api/nft/${tokenId}/animation`,
      external_url: `${baseURL}/nft/${tokenId}`,
      background_color: "1a1a2e",
      
      attributes: [
        {
          trait_type: "Evolution Stage",
          value: evolutionStages[0]
        },
        {
          trait_type: "Stage Progress", 
          value: 1,
          max_value: 4,
          display_type: "number"
        },
        {
          trait_type: "Core Geometry", 
          value: coreGeometries[seed % coreGeometries.length]
        },
        {
          trait_type: "Genesis Type",
          value: isQuantumGenesis ? "Quantum" : "Neural"
        },
        {
          trait_type: "Environment",
          value: environments[seed % environments.length]
        },
        {
          trait_type: "Neural Complexity",
          value: (seed % 10) + 1,
          max_value: 10,
          display_type: "number"
        },
        {
          trait_type: "Rarity Score",
          value: rarityScore,
          display_type: "number"
        },
        {
          trait_type: "Age (Days)",
          value: Math.max(0, age),
          display_type: "number"
        },
        {
          trait_type: "Evolution Progress",
          value: 25,
          display_type: "boost_percentage"
        },
        {
          trait_type: "Token ID",
          value: parseInt(tokenId),
          display_type: "number"
        },
        {
          trait_type: "Network",
          value: "Monad Testnet"
        },
        {
          trait_type: "Chain ID",
          value: 10143,
          display_type: "number"
        }
      ],
      
      properties: {
        evolution_stage: 1,
        max_evolution_stage: 4,
        rarity_score: rarityScore,
        is_quantum: isQuantumGenesis,
        birth_timestamp: Math.floor(Date.now() / 1000),
        neural_complexity: (seed % 10) + 1,
        contract_address: MONARA_CONTRACT_ADDRESS,
        chain_id: 10143,
        network: "Monad Testnet"
      }
    };

    console.log(`✅ Generated fallback metadata for token ${tokenId}`);

    return NextResponse.json(fallbackMetadata, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600', // 10 minutes cache for fallback
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Token-ID': tokenId,
        'X-Source': 'fallback',
        'X-Token-Exists': tokenExists.toString(),
      },
    });

  } catch (error) {
    const resolvedParams = await params;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`💥 Metadata API Error for token ${resolvedParams.tokenId}:`, errorMessage);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate metadata',
        details: errorMessage,
        tokenId: resolvedParams.tokenId
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'X-Error': 'metadata-generation-failed',
        }
      }
    );
  }
} 