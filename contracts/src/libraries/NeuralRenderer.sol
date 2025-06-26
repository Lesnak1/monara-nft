// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GeometryLib.sol";
import "./ColorLib.sol";
import "./PathwayLib.sol";
import "./DataTypes.sol";

/**
 * @title NeuralRenderer
 * @dev Library for generating SVG representations of neural networks
 */
library NeuralRenderer {
    using GeometryLib for uint256;
    using ColorLib for uint8;
    using PathwayLib for uint8;

    struct RenderParams {
        uint8 coreGeometry;
        uint8 pathwayPattern;
        uint8 particleSystem;
        uint8 networkDensity;
        uint8 processingAura;
        uint8 environment;
        uint8 mutation;
        uint8 evolutionStage;
    }

    /**
     * @dev Generate complete neural network SVG
     */
    function generateNeuralNetwork(
        uint8 coreGeometry,
        uint8 pathwayPattern,
        uint8 particleSystem,
        uint8 networkDensity,
        uint8 processingAura,
        uint8 environment,
        uint8 mutation,
        uint8 evolutionStage
    ) external pure returns (string memory) {
        RenderParams memory params = RenderParams({
            coreGeometry: coreGeometry,
            pathwayPattern: pathwayPattern,
            particleSystem: particleSystem,
            networkDensity: networkDensity,
            processingAura: processingAura,
            environment: environment,
            mutation: mutation,
            evolutionStage: evolutionStage
        });

        return string(abi.encodePacked(
            _generateSVGHeader(),
            _generateDefinitions(params),
            _generateEnvironment(params),
            _generateNeuralPathways(params),
            _generateParticleSystem(params),
            _generateNeuralCore(params),
            _generateProcessingAura(params),
            _generateMutationEffects(params),
            _generateSVGFooter()
        ));
    }

    /**
     * @dev Generate SVG header with viewbox
     */
    function _generateSVGHeader() private pure returns (string memory) {
        return '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">';
    }

    /**
     * @dev Generate SVG definitions (gradients, patterns, filters)
     */
    function _generateDefinitions(RenderParams memory params) private pure returns (string memory) {
        return string(abi.encodePacked(
            '<defs>',
            _generateGradients(params),
            _generatePatterns(params),
            _generateFilters(params),
            '</defs>'
        ));
    }

    /**
     * @dev Generate color gradients based on evolution stage
     */
    function _generateGradients(RenderParams memory params) private pure returns (string memory) {
        string memory primaryColor = params.evolutionStage.getEvolutionColor();
        string memory secondaryColor = params.evolutionStage.getSecondaryColor();
        
        return string(abi.encodePacked(
            '<radialGradient id="coreGrad">',
            '<stop offset="0%" stop-color="', primaryColor, '" stop-opacity="0.9"/>',
            '<stop offset="100%" stop-color="', secondaryColor, '" stop-opacity="0.4"/>',
            '</radialGradient>',
            '<linearGradient id="pathwayGrad" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="', primaryColor, '" stop-opacity="0.7"/>',
            '<stop offset="100%" stop-color="', secondaryColor, '" stop-opacity="0.3"/>',
            '</linearGradient>'
        ));
    }

    /**
     * @dev Generate background patterns
     */
    function _generatePatterns(RenderParams memory params) private pure returns (string memory) {
        uint256 gridSize = _getGridSize(params.networkDensity);
        string memory strokeColor = params.evolutionStage.getEvolutionColor();
        
        return string(abi.encodePacked(
            '<pattern id="grid" width="', gridSize.toString(), '" height="', gridSize.toString(), '" patternUnits="userSpaceOnUse">',
            '<path d="M ', gridSize.toString(), ' 0 L 0 0 0 ', gridSize.toString(), '" fill="none" stroke="', strokeColor, '" stroke-width="0.5" opacity="0.2"/>',
            '</pattern>'
        ));
    }

    /**
     * @dev Generate SVG filters for effects
     */
    function _generateFilters(RenderParams memory /* params */) private pure returns (string memory) {
        return string(abi.encodePacked(
            '<filter id="glow">',
            '<feGaussianBlur stdDeviation="3" result="coloredBlur"/>',
            '<feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>',
            '</filter>',
            '<filter id="pulse">',
            '<feGaussianBlur stdDeviation="2" result="blur"/>',
            '<feColorMatrix in="blur" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"/>',
            '</filter>'
        ));
    }

    /**
     * @dev Generate environment background
     */
    function _generateEnvironment(RenderParams memory params) private pure returns (string memory) {
        if (params.environment == 0) { // Void
            return '<rect width="400" height="400" fill="#0a0a0f"/>';
        } else if (params.environment == 1) { // Matrix
            return string(abi.encodePacked(
                '<rect width="400" height="400" fill="#000"/>',
                '<rect width="400" height="400" fill="url(#grid)"/>'
            ));
        } else if (params.environment == 2) { // Cloud
            return '<rect width="400" height="400" fill="url(#cloudGrad)"/>';
        } else if (params.environment == 3) { // Quantum
            return '<rect width="400" height="400" fill="url(#quantumField)"/>';
        } else { // Cyber
            return '<rect width="400" height="400" fill="url(#cyberspace)"/>';
        }
    }

    /**
     * @dev Generate neural pathways
     */
    function _generateNeuralPathways(RenderParams memory params) private pure returns (string memory) {
        return PathwayLib.generatePathways(params.pathwayPattern, params.evolutionStage, params.networkDensity);
    }

    /**
     * @dev Generate particle system
     */
    function _generateParticleSystem(RenderParams memory params) private pure returns (string memory) {
        uint256 particleCount = _getParticleCount(params.evolutionStage, params.networkDensity);
        string memory particles = "";
        
        for (uint256 i = 0; i < particleCount; i++) {
            particles = string(abi.encodePacked(
                particles,
                _generateSingleParticle(params, i)
            ));
        }
        
        return string(abi.encodePacked(
            '<g class="particles">',
            particles,
            '</g>'
        ));
    }

    /**
     * @dev Generate single particle element
     */
    function _generateSingleParticle(RenderParams memory params, uint256 index) private pure returns (string memory) {
        uint256 x = (index * 73 + 50) % 350 + 25; // Pseudo-random X
        uint256 y = (index * 91 + 50) % 350 + 25; // Pseudo-random Y
        string memory color = params.evolutionStage.getEvolutionColor();
        
        if (params.particleSystem == 0) { // Dots
            return string(abi.encodePacked(
                '<circle cx="', x.toString(), '" cy="', y.toString(), '" r="2" fill="', color, '" opacity="0.7">',
                '<animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" repeatCount="indefinite"/>',
                '</circle>'
            ));
        } else if (params.particleSystem == 1) { // Squares
            return string(abi.encodePacked(
                '<rect x="', (x-2).toString(), '" y="', (y-2).toString(), '" width="4" height="4" fill="', color, '" opacity="0.6">',
                '<animateTransform attributeName="transform" type="rotate" values="0 ', x.toString(), ' ', y.toString(), ';360 ', x.toString(), ' ', y.toString(), '" dur="6s" repeatCount="indefinite"/>',
                '</rect>'
            ));
        } else { // Default to triangles
            return string(abi.encodePacked(
                '<polygon points="', x.toString(), ',', (y-3).toString(), ' ', (x+3).toString(), ',', (y+2).toString(), ' ', (x-3).toString(), ',', (y+2).toString(), '" fill="', color, '" opacity="0.8"/>'
            ));
        }
    }

    /**
     * @dev Generate neural core
     */
    function _generateNeuralCore(RenderParams memory params) private pure returns (string memory) {
        return GeometryLib.generateCore(params.coreGeometry, params.evolutionStage);
    }

    /**
     * @dev Generate processing aura
     */
    function _generateProcessingAura(RenderParams memory params) private pure returns (string memory) {
        if (params.processingAura == 6) return ""; // None
        
        string memory color = params.evolutionStage.getEvolutionColor();
        uint256 radius = 30 + params.evolutionStage * 10;
        
        if (params.processingAura == 0) { // Pulse
            return string(abi.encodePacked(
                '<circle cx="200" cy="200" r="', radius.toString(), '" fill="none" stroke="', color, '" stroke-width="2" opacity="0.4">',
                '<animate attributeName="r" values="', (radius-10).toString(), ';', (radius+20).toString(), ';', (radius-10).toString(), '" dur="2s" repeatCount="indefinite"/>',
                '<animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite"/>',
                '</circle>'
            ));
        } else if (params.processingAura == 1) { // Shimmer
            return string(abi.encodePacked(
                '<circle cx="200" cy="200" r="', radius.toString(), '" fill="none" stroke="', color, '" stroke-width="1" opacity="0.3" filter="url(#glow)"/>'
            ));
        } else { // Wave
            return string(abi.encodePacked(
                '<circle cx="200" cy="200" r="', radius.toString(), '" fill="none" stroke="', color, '" stroke-width="2" opacity="0.5">',
                '<animate attributeName="stroke-dasharray" values="0,', (radius*6).toString(), ';', (radius*3).toString(), ',', (radius*3).toString(), ';0,', (radius*6).toString(), '" dur="3s" repeatCount="indefinite"/>',
                '</circle>'
            ));
        }
    }

    /**
     * @dev Generate mutation effects
     */
    function _generateMutationEffects(RenderParams memory params) private pure returns (string memory) {
        if (params.mutation == 0) return "";
        
        // Special mutation effects based on mutation type
        if (params.mutation <= 50) { // Quantum Entanglement
            return '<g class="quantum-entangle"><circle cx="150" cy="150" r="20" fill="none" stroke="#ff00ff" stroke-width="1" opacity="0.5"/><circle cx="250" cy="250" r="20" fill="none" stroke="#ff00ff" stroke-width="1" opacity="0.5"/></g>';
        } else if (params.mutation <= 100) { // Neural Fusion
            return '<g class="neural-fusion"><path d="M100,100 Q200,150 300,100 Q200,250 100,300" fill="none" stroke="#00ffff" stroke-width="2" opacity="0.6"/></g>';
        } else { // Data Storm
            return '<g class="data-storm" opacity="0.4"><rect width="400" height="400" fill="url(#noisePattern)"/></g>';
        }
    }

    /**
     * @dev Generate SVG footer
     */
    function _generateSVGFooter() private pure returns (string memory) {
        return '</svg>';
    }

    /**
     * @dev Helper function to get grid size based on network density
     */
    function _getGridSize(uint8 density) private pure returns (uint256) {
        if (density == 0) return 50; // Sparse
        if (density == 1) return 30; // Medium
        if (density == 2) return 20; // Dense
        return 15; // Ultra-Dense
    }

    /**
     * @dev Helper function to get particle count based on stage and density
     */
    function _getParticleCount(uint8 stage, uint8 density) private pure returns (uint256) {
        uint256 baseCount = 5 + stage * 10; // 5-45 base particles
        uint256 densityMultiplier = density + 1; // 1-4x multiplier
        return baseCount * densityMultiplier;
    }
} 