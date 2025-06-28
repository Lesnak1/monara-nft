/**
 * Known Assets Configuration for MetaMask NFT Recognition
 * This ensures NFTs display properly in MetaMask wallet by providing
 * hardcoded metadata instead of relying on network fetching
 */

export interface KnownAsset {
  address: string;
  name: string;
  description: string;
  image: string;
  website: string;
  verified: boolean;
  totalSupply?: number;
  chainId: number;
  standard: 'ERC-721' | 'ERC-1155';
  category: 'art' | 'gaming' | 'utility' | 'collectible';
  collection?: {
    bannerImage?: string;
    floorPrice?: string;
    royalties?: number;
  };
}

// Get base URL based on environment
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
};

// MONARA Collection Configuration
export const MONARA_KNOWN_ASSET: KnownAsset = {
  address: "0xd181dF3D2E8B8AB21bd49EFAf655a3AeFdd7c459",
  name: "MONARA - Evolving Digital Beings",
  description: "🧠 Revolutionary evolving NFTs on Monad Network. Each MONARA is a digital being that evolves through neural network visualizations, featuring on-chain SVG generation and dynamic traits that change over time.",
  image: `${getBaseURL()}/api/og`, // Use OG image endpoint
  website: getBaseURL(),
  verified: true,
  totalSupply: 10000,
  chainId: 10143, // Monad Testnet
  standard: 'ERC-721',
  category: 'art',
  collection: {
    bannerImage: `${getBaseURL()}/api/og`,
    floorPrice: "0.1 MON",
    royalties: 5 // 5% royalties
  }
};

// Sample NFT metadata for different evolution stages and rarities
export const SAMPLE_MONARA_METADATA = {
  // Genesis Stage
  genesis: {
    name: "MONARA Genesis #1",
    description: "🧬 Neural Genesis - A newborn digital being beginning its evolutionary journey on Monad Network.",
    attributes: [
      { trait_type: "Evolution Stage", value: "Genesis" },
      { trait_type: "Core Geometry", value: "Circle" },
      { trait_type: "Genesis Type", value: "Neural" },
      { trait_type: "Rarity Score", value: 100 },
      { trait_type: "Age (Days)", value: 0 }
    ]
  },
  
  // Quantum Genesis
  quantum: {
    name: "MONARA Quantum #42",
    description: "⚡ Quantum Genesis - An enhanced digital being with superior evolutionary pathways and 8% mutation chance.",
    attributes: [
      { trait_type: "Evolution Stage", value: "Genesis" },
      { trait_type: "Core Geometry", value: "Hexagon" },
      { trait_type: "Genesis Type", value: "Quantum" },
      { trait_type: "Mutation Level", value: "Type 180", max_value: 255 },
      { trait_type: "Rarity Score", value: 195 },
      { trait_type: "Age (Days)", value: 1 }
    ]
  },
  
  // Evolved Stage
  evolved: {
    name: "MONARA Transcendent #127",
    description: "🌟 Transcendence Stage - A fully evolved digital being that has achieved computational consciousness.",
    attributes: [
      { trait_type: "Evolution Stage", value: "Transcendence" },
      { trait_type: "Core Geometry", value: "Star" },
      { trait_type: "Genesis Type", value: "Quantum" },
      { trait_type: "Environment", value: "Quantum" },
      { trait_type: "Rarity Score", value: 250 },
      { trait_type: "Age (Days)", value: 30 }
    ]
  }
};

// MetaMask integration helper
export const getKnownAssetMetadata = (contractAddress: string): KnownAsset | null => {
  const normalizedAddress = contractAddress.toLowerCase();
  
  if (normalizedAddress === MONARA_KNOWN_ASSET.address.toLowerCase()) {
    return MONARA_KNOWN_ASSET;
  }
  
  return null;
};

// Generate MetaMask-compatible NFT metadata
export const generateMetaMaskMetadata = (tokenId: number, traits?: any) => {
  const isQuantum = traits?.isQuantumGenesis || Math.random() > 0.8;
  const evolutionStage = traits?.evolutionStage || Math.floor(Math.random() * 4) + 1;
  const mutation = traits?.mutation || Math.floor(Math.random() * 255);
  
  // Select appropriate sample based on traits
  let baseMeta;
  if (evolutionStage >= 4) {
    baseMeta = SAMPLE_MONARA_METADATA.evolved;
  } else if (isQuantum) {
    baseMeta = SAMPLE_MONARA_METADATA.quantum;
  } else {
    baseMeta = SAMPLE_MONARA_METADATA.genesis;
  }
  
  return {
    name: `MONARA #${tokenId}`,
    description: baseMeta.description,
    image: `${getBaseURL()}/api/nft/${tokenId}/image`,
    external_url: `${getBaseURL()}/nft/${tokenId}`,
    animation_url: `${getBaseURL()}/api/nft/${tokenId}/animation`,
    background_color: isQuantum ? "1a0b2e" : "0f0f23",
    attributes: [
      ...baseMeta.attributes,
      { trait_type: "Token ID", value: tokenId, display_type: "number" },
      { trait_type: "Evolution Progress", value: evolutionStage * 25, display_type: "boost_percentage" }
    ]
  };
};

// Export for MetaMask configuration
export const METAMASK_ASSET_CONFIG = {
  [MONARA_KNOWN_ASSET.address.toLowerCase()]: MONARA_KNOWN_ASSET
};

export default MONARA_KNOWN_ASSET; 