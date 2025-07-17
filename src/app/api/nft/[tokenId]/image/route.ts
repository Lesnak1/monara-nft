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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  try {
    const { tokenId } = await params;
    
    console.log(`🖼️ Image API called for token ID: ${tokenId}`);
    
    if (!tokenId || isNaN(Number(tokenId))) {
      console.error(`❌ Invalid token ID: ${tokenId}`);
      return NextResponse.json(
        { error: 'Invalid token ID' },
        { status: 400 }
      );
    }

    const numericTokenId = BigInt(tokenId);
    console.log(`🔍 Fetching SVG for token ID: ${numericTokenId}`);

    // First, check if token exists
    try {
      const exists = await publicClient.readContract({
        address: MONARA_CONTRACT_ADDRESS,
        abi: MONARA_ABI,
        functionName: 'ownerOf',
        args: [numericTokenId],
      });
      
      if (!exists || exists === '0x0000000000000000000000000000000000000000') {
        console.log(`⚠️ Token ${tokenId} does not exist or has no owner`);
        // Return placeholder for non-existent tokens
        const placeholderSVG = generatePlaceholderSVG(tokenId);
        return new NextResponse(placeholderSVG, {
          status: 200,
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=300',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
      
      console.log(`✅ Token ${tokenId} exists, owner: ${exists}`);
    } catch (existsError) {
      const errorMessage = existsError instanceof Error ? existsError.message : 'Unknown error';
      console.warn(`⚠️ Could not check token existence: ${errorMessage}`);
      // Continue anyway, might be a network issue
    }

    // Try to get SVG from contract
    try {
      console.log(`🔄 Calling generateSVG for token ${tokenId}...`);
      
      const svg = await publicClient.readContract({
        address: MONARA_CONTRACT_ADDRESS,
        abi: MONARA_ABI,
        functionName: 'generateSVG',
        args: [numericTokenId],
      });

      if (!svg || typeof svg !== 'string' || svg.trim() === '') {
        throw new Error('Empty or invalid SVG returned from contract');
      }

      console.log(`✅ Got SVG from contract for token ${tokenId}, length: ${svg.length}`);

      // Validate SVG content
      if (!svg.includes('<svg') || !svg.includes('</svg>')) {
        throw new Error('Invalid SVG format');
      }

      // Return SVG with proper headers for MetaMask and browsers
      return new NextResponse(svg, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
          'X-Token-ID': tokenId,
          'X-Source': 'contract',
        },
      });

    } catch (contractError) {
      const errorMessage = contractError instanceof Error ? contractError.message : 'Unknown error';
      console.error(`❌ Contract read error for token ${tokenId}:`, errorMessage);
      
      // Detailed error logging
      if (contractError instanceof Error) {
        console.error(`Error message: ${contractError.message}`);
        if ('cause' in contractError && contractError.cause) {
          console.error(`Error cause: ${contractError.cause}`);
        }
      }
      
      // Return placeholder SVG instead of error
      console.log(`🔄 Returning placeholder SVG for token ${tokenId}`);
      const placeholderSVG = generatePlaceholderSVG(tokenId);
      
      return new NextResponse(placeholderSVG, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=300',
          'Access-Control-Allow-Origin': '*',
          'X-Token-ID': tokenId,
          'X-Source': 'placeholder',
          'X-Error': 'contract-unavailable',
        },
      });
    }

  } catch (error) {
    const resolvedParams = await params;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`💥 API Error for token ${resolvedParams.tokenId}:`, errorMessage);
    
    // Return a functional error SVG instead of JSON error
    const errorSVG = generateErrorSVG(resolvedParams.tokenId);
    
    return new NextResponse(errorSVG, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Access-Control-Allow-Origin': '*',
        'X-Error': 'api-error',
      },
    });
  }
}

// Generate enhanced placeholder SVG
function generatePlaceholderSVG(tokenId: string): string {
  const colors = [
    '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899',
    '#06B6D4', '#84CC16', '#F97316', '#A855F7'
  ];
  
  const colorIndex = parseInt(tokenId) % colors.length;
  const primaryColor = colors[colorIndex];
  const secondaryColor = colors[(colorIndex + 2) % colors.length];
  const accentColor = colors[(colorIndex + 4) % colors.length];
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <defs>
    <radialGradient id="bg-${tokenId}" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.4"/>
      <stop offset="70%" stop-color="#1a1a2e" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#0d0d1a" stop-opacity="1"/>
    </radialGradient>
    <filter id="glow-${tokenId}">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <linearGradient id="line-${tokenId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${secondaryColor}" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="${accentColor}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0.4"/>
    </linearGradient>
  </defs>
  
  <rect width="400" height="400" fill="url(#bg-${tokenId})"/>
  
  <!-- Neural Network Pattern -->
  <g filter="url(#glow-${tokenId})">
    <!-- Central Node -->
    <circle cx="200" cy="200" r="35" fill="none" stroke="${primaryColor}" stroke-width="2.5" opacity="0.9"/>
    <circle cx="200" cy="200" r="20" fill="${primaryColor}" opacity="0.7"/>
    <circle cx="200" cy="200" r="8" fill="${accentColor}" opacity="0.9"/>
    
    <!-- Connection Network -->
    <path d="M 200 165 Q 140 110 80 120 Q 60 130 70 150" stroke="url(#line-${tokenId})" stroke-width="2" fill="none" opacity="0.7"/>
    <path d="M 200 235 Q 260 290 320 280 Q 340 270 330 250" stroke="url(#line-${tokenId})" stroke-width="2" fill="none" opacity="0.7"/>
    <path d="M 165 200 Q 110 140 100 80 Q 110 60 130 70" stroke="url(#line-${tokenId})" stroke-width="2" fill="none" opacity="0.7"/>
    <path d="M 235 200 Q 290 260 330 300 Q 350 320 370 310" stroke="url(#line-${tokenId})" stroke-width="2" fill="none" opacity="0.7"/>
    
    <!-- Outer Nodes -->
    <circle cx="70" cy="150" r="12" fill="${secondaryColor}" opacity="0.8"/>
    <circle cx="330" cy="250" r="12" fill="${secondaryColor}" opacity="0.8"/>
    <circle cx="130" cy="70" r="10" fill="${accentColor}" opacity="0.8"/>
    <circle cx="370" cy="310" r="10" fill="${accentColor}" opacity="0.8"/>
    
    <!-- Additional Neural Pathways -->
    <path d="M 150 150 Q 120 180 90 210" stroke="${primaryColor}" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M 250 250 Q 280 220 310 190" stroke="${primaryColor}" stroke-width="1.5" fill="none" opacity="0.5"/>
    
    <!-- Small connecting nodes -->
    <circle cx="90" cy="210" r="6" fill="${primaryColor}" opacity="0.6"/>
    <circle cx="310" cy="190" r="6" fill="${primaryColor}" opacity="0.6"/>
  </g>
  
  <!-- Animated pulse effect -->
  <circle cx="200" cy="200" r="25" fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.5">
    <animate attributeName="r" values="25;35;25" dur="3s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.5;0.2;0.5" dur="3s" repeatCount="indefinite"/>
  </circle>
  
  <!-- Text Labels -->
  <text x="200" y="340" text-anchor="middle" fill="${primaryColor}" font-family="Arial, sans-serif" font-size="18" font-weight="bold">
    MONARA #${tokenId}
  </text>
  <text x="200" y="365" text-anchor="middle" fill="${secondaryColor}" font-family="Arial, sans-serif" font-size="14" opacity="0.8">
    Genesis Stage • Loading...
  </text>
  
  <!-- Corner decoration -->
  <path d="M 10 10 L 30 10 L 30 30" stroke="${accentColor}" stroke-width="2" fill="none" opacity="0.6"/>
  <path d="M 390 10 L 370 10 L 370 30" stroke="${accentColor}" stroke-width="2" fill="none" opacity="0.6"/>
  <path d="M 10 390 L 30 390 L 30 370" stroke="${accentColor}" stroke-width="2" fill="none" opacity="0.6"/>
  <path d="M 390 390 L 370 390 L 370 370" stroke="${accentColor}" stroke-width="2" fill="none" opacity="0.6"/>
</svg>`;
}

// Generate error SVG for when everything fails
function generateErrorSVG(tokenId: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <defs>
    <radialGradient id="error-bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#EF4444" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#1a1a2e" stop-opacity="1"/>
    </radialGradient>
  </defs>
  
  <rect width="400" height="400" fill="url(#error-bg)"/>
  <circle cx="200" cy="200" r="60" fill="none" stroke="#EF4444" stroke-width="3" opacity="0.8"/>
  <circle cx="200" cy="200" r="35" fill="none" stroke="#EF4444" stroke-width="2" opacity="0.6"/>
  
  <!-- Loading animation -->
  <circle cx="200" cy="200" r="45" fill="none" stroke="#EF4444" stroke-width="2" opacity="0.4" stroke-dasharray="10,5">
    <animateTransform attributeName="transform" type="rotate" values="0 200 200;360 200 200" dur="2s" repeatCount="indefinite"/>
  </circle>
  
  <text x="200" y="290" text-anchor="middle" fill="#EF4444" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
    MONARA #${tokenId}
  </text>
  <text x="200" y="315" text-anchor="middle" fill="#EF4444" font-family="Arial, sans-serif" font-size="12" opacity="0.8">
    Loading Neural Data...
  </text>
</svg>`;
} 