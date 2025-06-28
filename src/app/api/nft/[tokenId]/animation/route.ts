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

// Create public client for reading contract data
const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http('https://testnet-rpc.monad.xyz'),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  try {
    const { tokenId } = await params;
    
    if (!tokenId || isNaN(Number(tokenId))) {
      return NextResponse.json(
        { error: 'Invalid token ID' },
        { status: 400 }
      );
    }

    // Get SVG from contract and add animations
    try {
      const svg = await publicClient.readContract({
        address: MONARA_CONTRACT_ADDRESS,
        abi: MONARA_ABI,
        functionName: 'generateSVG',
        args: [BigInt(tokenId)],
      });

      if (!svg || typeof svg !== 'string') {
        throw new Error('No SVG returned from contract');
      }

      // Enhance SVG with animations
      const animatedSVG = addAnimationsToSVG(svg, tokenId);

      // Return animated SVG with proper headers for MetaMask
      return new NextResponse(animatedSVG, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });

    } catch (contractError: any) {
      console.error('Contract read error:', contractError);
      
      // Fallback: Generate an animated placeholder SVG
      const animatedPlaceholderSVG = generateAnimatedPlaceholderSVG(tokenId);
      
      return new NextResponse(animatedPlaceholderSVG, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=300', // Shorter cache for fallback
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

  } catch (error: any) {
    console.error('API Error:', error);
    
    // Return a minimal error SVG
    const { tokenId: errorTokenId } = await params;
    const errorSVG = generateErrorSVG(errorTokenId);
    
    return new NextResponse(errorSVG, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Add animations to existing SVG
function addAnimationsToSVG(svg: string, tokenId: string): string {
  // Basic animation enhancement
  const animations = `
    <defs>
      <style>
        .pulse { animation: pulse 2s ease-in-out infinite alternate; }
        .rotate { animation: rotate 20s linear infinite; }
        .float { animation: float 3s ease-in-out infinite alternate; }
        .glow { animation: glow 4s ease-in-out infinite alternate; }
        
        @keyframes pulse {
          from { opacity: 0.6; }
          to { opacity: 1; }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          from { transform: translateY(0px); }
          to { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          from { filter: brightness(1); }
          to { filter: brightness(1.3); }
        }
      </style>
    </defs>
  `;
  
  // Insert animations after opening SVG tag
  const enhancedSVG = svg.replace(
    /<svg[^>]*>/,
    (match) => match + animations
  );
  
  return enhancedSVG;
}

// Generate animated placeholder SVG
function generateAnimatedPlaceholderSVG(tokenId: string): string {
  const colors = [
    '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899'
  ];
  
  const colorIndex = parseInt(tokenId) % colors.length;
  const primaryColor = colors[colorIndex];
  const secondaryColor = colors[(colorIndex + 1) % colors.length];
  
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#1a1a2e" stop-opacity="1"/>
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <style>
          .pulse { animation: pulse 2s ease-in-out infinite alternate; }
          .rotate { animation: rotate 10s linear infinite; }
          .float { animation: float 3s ease-in-out infinite alternate; }
          .sparkle { animation: sparkle 4s ease-in-out infinite; }
          
          @keyframes pulse {
            from { opacity: 0.4; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1.05); }
          }
          
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes float {
            from { transform: translateY(0px); }
            to { transform: translateY(-15px); }
          }
          
          @keyframes sparkle {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        </style>
      </defs>
      
      <rect width="400" height="400" fill="url(#bg)"/>
      
      <!-- Animated Neural Network Pattern -->
      <g filter="url(#glow)">
        <!-- Rotating Core Node -->
        <g class="rotate" style="transform-origin: 200px 200px;">
          <circle cx="200" cy="200" r="30" fill="none" stroke="${primaryColor}" stroke-width="2" class="pulse"/>
          <circle cx="200" cy="200" r="15" fill="${primaryColor}" opacity="0.6"/>
        </g>
        
        <!-- Floating Connection Lines -->
        <g class="float">
          <path d="M 200 170 Q 150 120 100 100" stroke="${secondaryColor}" stroke-width="1.5" fill="none" opacity="0.7"/>
          <path d="M 200 230 Q 250 280 300 300" stroke="${secondaryColor}" stroke-width="1.5" fill="none" opacity="0.7"/>
          <path d="M 170 200 Q 120 150 80 200" stroke="${secondaryColor}" stroke-width="1.5" fill="none" opacity="0.7"/>
          <path d="M 230 200 Q 280 250 320 200" stroke="${secondaryColor}" stroke-width="1.5" fill="none" opacity="0.7"/>
        </g>
        
        <!-- Sparkling Nodes -->
        <circle cx="100" cy="100" r="8" fill="${primaryColor}" opacity="0.8" class="sparkle"/>
        <circle cx="300" cy="300" r="8" fill="${primaryColor}" opacity="0.8" class="sparkle" style="animation-delay: 1s;"/>
        <circle cx="80" cy="200" r="8" fill="${primaryColor}" opacity="0.8" class="sparkle" style="animation-delay: 2s;"/>
        <circle cx="320" cy="200" r="8" fill="${primaryColor}" opacity="0.8" class="sparkle" style="animation-delay: 3s;"/>
        
        <!-- Particle Effects -->
        <g class="rotate" style="transform-origin: 200px 200px; animation-duration: 15s;">
          <circle cx="160" cy="160" r="3" fill="${secondaryColor}" opacity="0.6" class="pulse" style="animation-delay: 0.5s;"/>
          <circle cx="240" cy="160" r="3" fill="${secondaryColor}" opacity="0.6" class="pulse" style="animation-delay: 1.5s;"/>
          <circle cx="240" cy="240" r="3" fill="${secondaryColor}" opacity="0.6" class="pulse" style="animation-delay: 2.5s;"/>
          <circle cx="160" cy="240" r="3" fill="${secondaryColor}" opacity="0.6" class="pulse" style="animation-delay: 3.5s;"/>
        </g>
      </g>
      
      <!-- Animated Title -->
      <text x="200" y="350" text-anchor="middle" fill="${primaryColor}" font-family="Arial, sans-serif" font-size="16" font-weight="bold" class="pulse">
        MONARA #${tokenId}
      </text>
      
      <!-- Stage Indicator -->
      <text x="200" y="370" text-anchor="middle" fill="${secondaryColor}" font-family="Arial, sans-serif" font-size="12" class="float">
        Evolving Neural Being
      </text>
      
      <!-- Evolution Progress Ring -->
      <circle cx="200" cy="200" r="45" fill="none" stroke="${primaryColor}" stroke-width="1" opacity="0.3" class="pulse" style="animation-delay: 1s;"/>
    </svg>
  `;
}

// Generate error SVG for when everything fails
function generateErrorSVG(tokenId: string): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <defs>
        <style>
          .blink { animation: blink 1s ease-in-out infinite; }
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
          }
        </style>
      </defs>
      
      <rect width="400" height="400" fill="#1a1a2e"/>
      <circle cx="200" cy="200" r="50" fill="none" stroke="#EF4444" stroke-width="3" class="blink"/>
      <text x="200" y="280" text-anchor="middle" fill="#EF4444" font-family="Arial, sans-serif" font-size="16">
        MONARA #${tokenId}
      </text>
      <text x="200" y="300" text-anchor="middle" fill="#EF4444" font-family="Arial, sans-serif" font-size="12" class="blink">
        Loading...
      </text>
    </svg>
  `;
} 