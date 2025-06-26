// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DataTypes
 * @dev Shared data structures for MONARA ecosystem
 */
library DataTypes {
    
    /**
     * @dev Represents the traits of a digital being
     */
    struct TraitData {
        uint8 coreGeometry;      // 0-7: Circle, Diamond, Hexagon, Octagon, Star, Triangle, Pentagon, Cross
        uint8 pathwayPattern;    // 0-4: Linear, Curved, Spiral, Fractal, Wave
        uint8 particleSystem;    // 0-5: Dots, Squares, Triangles, Diamonds, Stars, Hexagons
        uint8 networkDensity;    // 0-3: Sparse, Medium, Dense, Ultra-Dense
        uint8 processingAura;    // 0-6: Pulse, Shimmer, Wave, Ripple, Storm, Vortex, None
        uint8 environment;       // 0-4: Void, Matrix, Cloud, Quantum, Cyber
        uint8 mutation;          // 0-255: Mutation level (0 = none, 255 = maximum)
        uint32 birthTimestamp;   // Block timestamp when minted
        bool isQuantumGenesis;   // Special quantum type (8% chance)
    }
    
    /**
     * @dev Full digital being representation
     */
    struct DigitalBeing {
        uint256 id;
        address owner;
        TraitData traits;
        uint8 evolutionStage;    // 1-4: Spark, Pulse, Flow, Nexus
        string customName;       // Optional custom name
        uint256 lastEvolution;   // Timestamp of last evolution
        uint256 experiencePoints;
    }
    
    /**
     * @dev Rendering parameters for SVG generation
     */
    struct RenderParams {
        uint8 coreGeometry;
        uint8 pathwayPattern;
        uint8 particleSystem;
        uint8 networkDensity;
        uint8 processingAura;
        uint8 environment;
        uint8 mutation;
        uint8 evolutionStage;
        bool isQuantumGenesis;
        uint256 seed;
        string customName;
    }
    
    /**
     * @dev Contract statistics
     */
    struct ContractStats {
        uint256 totalSupply;
        uint256 neuralMinted;
        uint256 quantumMinted;
        uint256 totalEvolutions;
        uint256 averageEvolutionTime;
    }
} 