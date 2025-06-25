'use client';

import { useState, useEffect, useMemo } from 'react';

interface NFTPreviewProps {
  coreGeometry?: number;
  pathwayPattern?: number;
  particleSystem?: number;
  networkDensity?: number;
  mutation?: number;
  isQuantumGenesis?: boolean;
  evolutionStage?: number;
  className?: string;
}

export default function NFTPreview({
  coreGeometry = 0,
  pathwayPattern = 0,
  particleSystem = 0,
  networkDensity = 0,
  mutation = 0,
  isQuantumGenesis = false,
  evolutionStage = 1,
  className = "",
}: NFTPreviewProps) {
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 120); // 12 saniye döngü
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Generate colors based on traits and evolution
  const colors = useMemo(() => {
    const baseHue = (coreGeometry * 45 + pathwayPattern * 72 + evolutionStage * 20) % 360;
    const saturation = 60 + (networkDensity * 10);
    const lightness = 45 + (evolutionStage * 8);
    
    // Quantum Genesis gets enhanced colors
    const quantumBoost = isQuantumGenesis ? 20 : 0;
    
    return {
      primary: `hsl(${baseHue}, ${saturation + quantumBoost}%, ${lightness}%)`,
      secondary: `hsl(${(baseHue + 60) % 360}, ${saturation + quantumBoost}%, ${lightness + 10}%)`,
      accent: `hsl(${(baseHue + 120) % 360}, ${80 + quantumBoost}%, ${60}%)`,
      glow: isQuantumGenesis ? `hsl(${baseHue}, 90%, 70%)` : `hsl(${baseHue}, 60%, 50%)`,
    };
  }, [coreGeometry, pathwayPattern, networkDensity, evolutionStage, isQuantumGenesis]);

  // Generate core geometry with enhanced designs - Optimized size
  const renderCore = () => {
    const size = 25 + evolutionStage * 4; // Smaller base size
    const centerX = 100; // Half of original
    const centerY = 100; // Half of original
    const pulse = Math.sin(animationFrame * 0.1) * 2; // Smaller pulse
    
    const coreProps = {
      fill: colors.primary,
      stroke: colors.glow,
      strokeWidth: isQuantumGenesis ? 2 : 1.5,
      opacity: 0.85,
      filter: 'url(#glow)',
    };
    
    switch (coreGeometry) {
      case 1: // Diamond
        return (
          <polygon
            points={`${centerX},${centerY-size-pulse} ${centerX+size+pulse},${centerY} ${centerX},${centerY+size+pulse} ${centerX-size-pulse},${centerY}`}
            {...coreProps}
          />
        );
      case 2: // Hexagon
        const hexPoints = Array.from({ length: 6 }, (_, i) => {
          const angle = (i * 60 - 90) * Math.PI / 180;
          const radius = size + pulse;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          return `${x},${y}`;
        }).join(' ');
        return <polygon points={hexPoints} {...coreProps} />;
      case 3: // Octagon
        const octPoints = Array.from({ length: 8 }, (_, i) => {
          const angle = (i * 45 - 90) * Math.PI / 180;
          const radius = size + pulse;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          return `${x},${y}`;
        }).join(' ');
        return <polygon points={octPoints} {...coreProps} />;
      case 4: // Star
        const starPoints = Array.from({ length: 10 }, (_, i) => {
          const angle = (i * 36 - 90) * Math.PI / 180;
          const radius = i % 2 === 0 ? size + pulse : (size + pulse) * 0.4;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          return `${x},${y}`;
        }).join(' ');
        return <polygon points={starPoints} {...coreProps} />;
      case 5: // Triangle
        const triPoints = Array.from({ length: 3 }, (_, i) => {
          const angle = (i * 120 - 90) * Math.PI / 180;
          const radius = size + pulse;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          return `${x},${y}`;
        }).join(' ');
        return <polygon points={triPoints} {...coreProps} />;
      case 6: // Pentagon
        const pentPoints = Array.from({ length: 5 }, (_, i) => {
          const angle = (i * 72 - 90) * Math.PI / 180;
          const radius = size + pulse;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          return `${x},${y}`;
        }).join(' ');
        return <polygon points={pentPoints} {...coreProps} />;
      case 7: // Cross
        const crossSize = size + pulse;
        const crossThickness = crossSize * 0.3;
        return (
          <g {...coreProps}>
            <rect 
              x={centerX - crossThickness/2} 
              y={centerY - crossSize} 
              width={crossThickness} 
              height={crossSize * 2} 
              {...coreProps}
            />
            <rect 
              x={centerX - crossSize} 
              y={centerY - crossThickness/2} 
              width={crossSize * 2} 
              height={crossThickness} 
              {...coreProps}
            />
          </g>
        );
      default: // Circle
        return (
          <circle
            cx={centerX}
            cy={centerY}
            r={size + pulse}
            {...coreProps}
          />
        );
    }
  };

  // Generate enhanced pathway patterns - Optimized size
  const renderPathways = () => {
    const paths = [];
    const centerX = 100;
    const centerY = 100;
    const pathCount = 3 + networkDensity;
    
    for (let i = 0; i < pathCount; i++) {
      const baseAngle = (i * 360 / pathCount);
      const animatedAngle = baseAngle + (animationFrame * 1.5);
      const angle = animatedAngle * Math.PI / 180;
      const startRadius = 35 + evolutionStage * 2.5; // Smaller radius
      const endRadius = 65 + evolutionStage * 5; // Smaller radius
      
      const startX = centerX + startRadius * Math.cos(angle);
      const startY = centerY + startRadius * Math.sin(angle);
      const endX = centerX + endRadius * Math.cos(angle);
      const endY = centerY + endRadius * Math.sin(angle);
      
      let pathD = '';
      
      switch (pathwayPattern) {
        case 1: // Curved
          const controlX = centerX + (startRadius + endRadius) / 2 * Math.cos(angle + 0.8);
          const controlY = centerY + (startRadius + endRadius) / 2 * Math.sin(angle + 0.8);
          pathD = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
          break;
        case 2: // Spiral
          const spiralSteps = 10; // Reduced steps
          let spiralPath = `M ${startX} ${startY}`;
          for (let step = 1; step <= spiralSteps; step++) {
            const t = step / spiralSteps;
            const spiralAngle = angle + t * Math.PI * 1.5;
            const spiralRadius = startRadius + (endRadius - startRadius) * t;
            const x = centerX + spiralRadius * Math.cos(spiralAngle);
            const y = centerY + spiralRadius * Math.sin(spiralAngle);
            spiralPath += ` L ${x} ${y}`;
          }
          pathD = spiralPath;
          break;
        case 3: // Fractal
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;
          const offsetX = Math.cos(angle + Math.PI/2) * 10; // Smaller offset
          const offsetY = Math.sin(angle + Math.PI/2) * 10;
          pathD = `M ${startX} ${startY} L ${midX + offsetX} ${midY + offsetY} L ${endX} ${endY}`;
          break;
        case 4: // Wave
          const waveSteps = 8; // Reduced steps
          let wavePath = `M ${startX} ${startY}`;
          for (let step = 1; step <= waveSteps; step++) {
            const t = step / waveSteps;
            const waveX = startX + (endX - startX) * t;
            const waveY = startY + (endY - startY) * t + Math.sin(t * Math.PI * 3) * 8; // Smaller wave
            wavePath += ` L ${waveX} ${waveY}`;
          }
          pathD = wavePath;
          break;
        default: // Straight
          pathD = `M ${startX} ${startY} L ${endX} ${endY}`;
      }
      
      paths.push(
        <path
          key={i}
          d={pathD}
          stroke={colors.secondary}
          strokeWidth={isQuantumGenesis ? 2 : 1.5}
          fill="none"
          opacity={0.7}
          filter="url(#glow)"
        />
      );
    }
    
    return paths;
  };

  // Generate particle systems - Optimized count and size
  const renderParticles = () => {
    const particles = [];
    const particleCount = 8 + (networkDensity * 2); // Reduced particle count
    const centerX = 100;
    const centerY = 100;
    
    const particleTypes = ['circle', 'square', 'triangle', 'diamond', 'star', 'hexagon'];
    const currentType = particleTypes[particleSystem % particleTypes.length];
    
    for (let i = 0; i < particleCount; i++) {
      const baseAngle = (i * 360 / particleCount);
      const orbitRadius = 80 + (i % 3) * 10; // Smaller orbit
      const speed = 0.5 + (i % 4) * 0.3;
      const animatedAngle = baseAngle + (animationFrame * speed);
      const angle = animatedAngle * Math.PI / 180;
      
      const x = centerX + orbitRadius * Math.cos(angle);
      const y = centerY + orbitRadius * Math.sin(angle);
      const size = 1.5 + (i % 3) * 0.5; // Smaller particles
      
      const particleProps = {
        fill: colors.accent,
        opacity: 0.6 + Math.sin(animationFrame * 0.05 + i) * 0.2,
        filter: 'url(#particleGlow)',
      };
      
      switch (currentType) {
        case 'square':
          particles.push(
            <rect
              key={i}
              x={x - size}
              y={y - size}
              width={size * 2}
              height={size * 2}
              {...particleProps}
            />
          );
          break;
        case 'triangle':
          const triPoints = `${x},${y-size} ${x+size},${y+size} ${x-size},${y+size}`;
          particles.push(
            <polygon
              key={i}
              points={triPoints}
              {...particleProps}
            />
          );
          break;
        case 'diamond':
          const diamondPoints = `${x},${y-size} ${x+size},${y} ${x},${y+size} ${x-size},${y}`;
          particles.push(
            <polygon
              key={i}
              points={diamondPoints}
              {...particleProps}
            />
          );
          break;
        case 'star':
          const starPoints = Array.from({ length: 10 }, (_, j) => {
            const starAngle = (j * 36) * Math.PI / 180;
            const radius = j % 2 === 0 ? size : size * 0.4;
            const px = x + radius * Math.cos(starAngle);
            const py = y + radius * Math.sin(starAngle);
            return `${px},${py}`;
          }).join(' ');
          particles.push(
            <polygon
              key={i}
              points={starPoints}
              {...particleProps}
            />
          );
          break;
        case 'hexagon':
          const hexPoints = Array.from({ length: 6 }, (_, j) => {
            const hexAngle = (j * 60) * Math.PI / 180;
            const px = x + size * Math.cos(hexAngle);
            const py = y + size * Math.sin(hexAngle);
            return `${px},${py}`;
          }).join(' ');
          particles.push(
            <polygon
              key={i}
              points={hexPoints}
              {...particleProps}
            />
          );
          break;
        default: // circle
          particles.push(
            <circle
              key={i}
              cx={x}
              cy={y}
              r={size}
              {...particleProps}
            />
          );
      }
    }
    
    return particles;
  };

  return (
    <div className={`relative bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 overflow-hidden ${className}`}>
      {/* NFT Container - Responsive size */}
      <div className="relative w-full aspect-square max-w-xs sm:max-w-sm mx-auto">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          style={{ background: 'radial-gradient(circle, rgba(131,110,249,0.1) 0%, rgba(32,0,82,0.2) 100%)' }}
        >
          {/* SVG Filters for enhanced visual effects */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <filter id="particleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Quantum Genesis Special Effects */}
            {isQuantumGenesis && (
              <filter id="quantumGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                <feColorMatrix values="1 0 1 0 0  0 1 1 0 0  1 0 1 0 0  0 0 0 1 0"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            )}
            
            {/* Gradient definitions */}
            <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={colors.primary} stopOpacity="0.8"/>
              <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.2"/>
            </radialGradient>
          </defs>
          
          {/* Background gradient */}
          <circle cx="100" cy="100" r="100" fill="url(#centerGradient)" opacity="0.3"/>
          
          {/* Render particles first (background layer) */}
          {renderParticles()}
          
          {/* Render pathways */}
          {renderPathways()}
          
          {/* Render core geometry (foreground) */}
          {renderCore()}
          
          {/* Mutation indicator */}
          {mutation > 50 && (
            <text x="100" y="190" textAnchor="middle" fill={colors.accent} fontSize="8" fontWeight="bold">
              MUTATED
            </text>
          )}
          
          {/* Quantum Genesis indicator */}
          {isQuantumGenesis && (
            <text x="100" y="15" textAnchor="middle" fill="#FFD700" fontSize="6" fontWeight="bold">
              QUANTUM GENESIS
            </text>
          )}
          
          {/* Evolution stage indicator */}
          <text x="15" y="190" fill={colors.secondary} fontSize="6" fontWeight="bold">
            STAGE {evolutionStage}
          </text>
        </svg>
      </div>
      
      {/* Info Panel - Compact */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <div className="flex items-center justify-between text-xs">
          <div className="text-purple-300">
            Neural Network
          </div>
          <div className="flex items-center gap-2">
            {isQuantumGenesis && (
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs">
                Quantum
              </span>
            )}
            {mutation > 50 && (
              <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs">
                Mutated
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 