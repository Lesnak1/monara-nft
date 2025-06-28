// Monad Network Configuration
export const MONAD_TESTNET = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    public: { http: ['https://testnet-rpc.monad.xyz'] },
    default: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet-explorer.monad.xyz' },
  },
} as const;

// Contract Addresses (Update after deployment)
export const CONTRACT_ADDRESSES = {
  MONARA: '0xa7793FfC44680c03dC18ab0972b2a96A20d82335' as `0x${string}`,
} as const;

// MONARA Contract ABI
export const MONARA_ABI = [
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol", 
    "outputs": [{"type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_SUPPLY",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "NEURAL_PRICE",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "QUANTUM_PRICE",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "address"}],
    "name": "balanceOf",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256"}],
    "name": "getDigitalBeing",
    "outputs": [{
      "type": "tuple",
      "components": [
        {"name": "coreGeometry", "type": "uint8"},
        {"name": "pathwayPattern", "type": "uint8"},
        {"name": "particleSystem", "type": "uint8"},
        {"name": "networkDensity", "type": "uint8"},
        {"name": "processingAura", "type": "uint8"},
        {"name": "environment", "type": "uint8"},
        {"name": "mutation", "type": "uint8"},
        {"name": "birthTimestamp", "type": "uint256"},
        {"name": "isQuantumGenesis", "type": "bool"}
      ]
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256"}],
    "name": "getEvolutionStage",
    "outputs": [{"type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintNeuralGenesis",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintQuantumGenesis",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "from", "type": "address"},
      {"indexed": true, "name": "to", "type": "address"},
      {"indexed": true, "name": "tokenId", "type": "uint256"}
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "tokenId", "type": "uint256"},
      {"indexed": false, "name": "isQuantumGenesis", "type": "bool"},
      {"indexed": false, "name": "mutation", "type": "uint8"}
    ],
    "name": "DigitalBeingCreated",
    "type": "event"
  }
] as const;

// Trait mappings for display
export const TRAIT_NAMES = {
  coreGeometry: ['Circle', 'Diamond', 'Hexagon', 'Octagon', 'Star', 'Triangle', 'Pentagon', 'Cross'],
  pathwayPattern: ['Linear', 'Curved', 'Spiral', 'Fractal', 'Wave'],
  particleSystem: ['Dots', 'Squares', 'Triangles', 'Diamonds', 'Stars', 'Hexagons'],
  networkDensity: ['Sparse', 'Medium', 'Dense', 'Ultra-Dense'],
  processingAura: ['Pulse', 'Shimmer', 'Wave', 'Static', 'Burst', 'Gradient', 'None'],
  environment: ['Void', 'Matrix', 'Cloud', 'Quantum', 'Cyber'],
  evolutionStage: ['Initialization', 'Processing', 'Learning', 'Transcendence']
} as const;

// Price formatting helper
export const formatPrice = (wei: bigint): string => {
  const ether = Number(wei) / 1e18;
  return `${ether} MON`;
};

// Rarity calculations
export const calculateRarity = (mutation: number): string => {
  if (mutation === 0) return 'Common';
  if (mutation <= 50) return 'Uncommon';
  if (mutation <= 100) return 'Rare';
  if (mutation <= 150) return 'Epic';
  if (mutation <= 200) return 'Legendary';
  return 'Mythic';
};

// Evolution time helpers
export const EVOLUTION_TIMES = {
  STAGE_2: 7 * 24 * 60 * 60, // 1 week in seconds
  STAGE_3: 28 * 24 * 60 * 60, // 4 weeks in seconds
  STAGE_4: 84 * 24 * 60 * 60, // 12 weeks in seconds
} as const;

// Simplified ABI for frontend interactions
export const MONANIMAL_ABI = [
  // Read functions
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function getEvolutionLevel(uint256 tokenId) view returns (uint256)',
  'function getLastEvolutionUpdate(uint256 tokenId) view returns (uint256)',
  'function tokenName(uint256 tokenId) view returns (string)',
  'function customMintPrice() view returns (uint256)',
  'function randomMintPrice() view returns (uint256)',
  'function MAX_SUPPLY() view returns (uint256)',
  'function MAX_PER_ADDRESS() view returns (uint256)',
  
  // Write functions
  'function mintCustom(uint8 body, uint8 eyes, uint8 mouth, uint8 accessory, uint8 background, string name) payable returns (uint256)',
  'function mintRandom() payable returns (uint256)',
  'function updateEvolutionLevel(uint256 tokenId) external',
  'function setTokenName(uint256 tokenId, string name) external',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'event MonanimalMinted(address indexed owner, uint256 indexed tokenId, string name)',
  'event EvolutionUpdated(uint256 indexed tokenId, uint256 newLevel)',
] as const;

export const SVG_RENDERER_ABI = [
  'function generateSVG(uint256 tokenId, (uint8,uint8,uint8,uint8,uint8) traits, uint256 evolutionLevel) view returns (string)',
  'function generateMetadata(uint256 tokenId, (uint8,uint8,uint8,uint8,uint8) traits, uint256 evolutionLevel, string name) view returns (string)',
  'function previewTraits((uint8,uint8,uint8,uint8,uint8) traits) view returns (string)',
] as const;

// Type definitions for contract interactions
export interface NFTTraits {
  coreGeometry: number;
  pathwayPattern: number;
  particleSystem: number;
  networkDensity: number;
  processingAura: number;
  environment: number;
  mutation: number;
  birthTimestamp: bigint;
  isQuantumGenesis: boolean;
}

export interface DigitalBeing {
  id: bigint;
  owner: string;
  traits: NFTTraits;
  evolutionStage: number;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
  tokenURI: string;
}

// Contract addresses - will be set after deployment
export const MONARA_CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_MONARA_CONTRACT_ADDRESS ||
  CONTRACT_ADDRESSES.MONARA ||
  '0x0000000000000000000000000000000000000000'
) as `0x${string}`;

export const MONAD_TESTNET_CHAIN_ID = 10143;
export const MONAD_MAINNET_CHAIN_ID = 41455; // Future mainnet chain ID 