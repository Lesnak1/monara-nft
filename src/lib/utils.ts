import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Trait names mapping
export const TRAIT_NAMES = {
  coreGeometry: ['Circle', 'Diamond', 'Hexagon', 'Octagon', 'Star', 'Triangle', 'Pentagon', 'Cross'],
  pathwayPattern: ['Linear', 'Curved', 'Spiral', 'Fractal', 'Wave'],
  particleSystem: ['Dots', 'Squares', 'Triangles', 'Diamonds', 'Stars', 'Hexagons'],
  networkDensity: ['Sparse', 'Light', 'Medium', 'Dense', 'Ultra Dense'],
  processingAura: ['None', 'Subtle', 'Moderate', 'Intense', 'Extreme'],
  environment: ['Void', 'Cosmic', 'Digital', 'Quantum', 'Neural', 'Matrix'],
  evolutionStage: ['Initialization', 'Processing', 'Learning', 'Transcendence']
};

export const EVOLUTION_LEVELS = {
  0: 'Newborn',
  1: 'Young',
  2: 'Mature',
  3: 'Ancient',
} as const;

// Helper functions
export function getTraitName(trait: keyof typeof TRAIT_NAMES, value: number): string {
  const names = TRAIT_NAMES[trait];
  return names[value] || `Unknown ${trait}`;
}

export function getEvolutionName(stage: number): string {
  return TRAIT_NAMES.evolutionStage[stage - 1] || 'Unknown Stage';
}

export function formatEvolutionTime(timestamp: bigint): string {
  const now = Date.now();
  const then = Number(timestamp) * 1000;
  const diff = now - then;
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days > 0) return `${days} days ago`;
  if (hours > 0) return `${hours} hours ago`;
  if (minutes > 0) return `${minutes} minutes ago`;
  return 'Just now';
}

export function formatPrice(priceWei: bigint): string {
  if (priceWei === BigInt(0)) return 'Free';
  const mon = Number(priceWei) / 1e18;
  return `${mon.toFixed(3)} MON`;
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTokenAmount(amount: bigint, decimals: number = 18): string {
  const divisor = BigInt(10 ** decimals);
  const wholePart = amount / divisor;
  const fractionalPart = amount % divisor;
  
  if (fractionalPart === 0n) {
    return wholePart.toString();
  }
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const trimmedFractional = fractionalStr.replace(/0+$/, '');
  
  return `${wholePart}.${trimmedFractional}`;
}

export function parseTokenAmount(amount: string, decimals: number = 18): bigint {
  const [whole, fractional = ''] = amount.split('.');
  const fractionalPadded = fractional.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole + fractionalPadded);
}

export function getRandomTraits(): { body: number; eyes: number; mouth: number; accessory: number; background: number } {
  return {
    body: Math.floor(Math.random() * 5),
    eyes: Math.floor(Math.random() * 5),
    mouth: Math.floor(Math.random() * 5),
    accessory: Math.floor(Math.random() * 5),
    background: Math.floor(Math.random() * 5),
  };
}

// Animation and visual helpers
export function getEvolutionGradient(stage: number): string {
  const gradients = [
    'from-slate-500 to-purple-500',     // Initialization
    'from-purple-500 to-blue-500',     // Processing
    'from-blue-500 to-emerald-500',    // Learning
    'from-emerald-500 to-yellow-500'   // Transcendence
  ];
  return gradients[stage - 1] || gradients[0];
}

export function getEvolutionBorderColor(stage: number): string {
  const colors = [
    'border-slate-400',    // Initialization
    'border-purple-400',   // Processing
    'border-blue-400',     // Learning
    'border-emerald-400'   // Transcendence
  ];
  return colors[stage - 1] || colors[0];
}

// Validate trait values
export function validateTraits(traits: Record<string, unknown>): boolean {
  const requiredTraits = ['body', 'eyes', 'mouth', 'accessory', 'background'];
  
  for (const trait of requiredTraits) {
    const value = traits[trait];
    if (typeof value !== 'number' || value < 0 || value > 4) {
      return false;
    }
  }
  
  return true;
} 