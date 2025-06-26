// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Strings.sol";
import "./ColorLib.sol";

/**
 * @title PathwayLib
 * @dev Library for generating neural pathway patterns
 */
library PathwayLib {
    using Strings for uint256;
    using ColorLib for uint8;

    /**
     * @dev Generate neural pathways based on pattern type
     */
    function generatePathways(uint8 pathwayPattern, uint8 evolutionStage, uint8 networkDensity) external pure returns (string memory) {
        if (pathwayPattern == 0) { // Linear
            return _generateLinearPathways(evolutionStage, networkDensity);
        } else if (pathwayPattern == 1) { // Curved
            return _generateCurvedPathways(evolutionStage, networkDensity);
        } else if (pathwayPattern == 2) { // Spiral
            return _generateSpiralPathways(evolutionStage, networkDensity);
        } else if (pathwayPattern == 3) { // Fractal
            return _generateFractalPathways(evolutionStage, networkDensity);
        } else { // Wave
            return _generateWavePathways(evolutionStage, networkDensity);
        }
    }

    /**
     * @dev Generate linear pathway patterns
     */
    function _generateLinearPathways(uint8 evolutionStage, uint8 networkDensity) private pure returns (string memory) {
        uint256 pathCount = _getPathwayCount(evolutionStage, networkDensity);
        string memory color = evolutionStage.getEvolutionColor();
        string memory paths = "";
        
        for (uint256 i = 0; i < pathCount; i++) {
            uint256 x1 = (i * 47 + 25) % 350 + 25;
            uint256 y1 = (i * 73 + 25) % 350 + 25;
            uint256 x2 = ((i + 1) * 47 + 25) % 350 + 25;
            uint256 y2 = ((i + 1) * 73 + 25) % 350 + 25;
            
            paths = string(abi.encodePacked(
                paths,
                '<line x1="', x1.toString(), '" y1="', y1.toString(), 
                '" x2="', x2.toString(), '" y2="', y2.toString(), 
                '" stroke="', color, '" stroke-width="1" opacity="0.6">',
                evolutionStage > 1 ? '<animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite"/>' : '',
                '</line>'
            ));
        }
        
        return string(abi.encodePacked('<g class="linear-pathways">', paths, '</g>'));
    }

    /**
     * @dev Generate curved pathway patterns
     */
    function _generateCurvedPathways(uint8 evolutionStage, uint8 networkDensity) private pure returns (string memory) {
        uint256 pathCount = _getPathwayCount(evolutionStage, networkDensity);
        string memory color = evolutionStage.getEvolutionColor();
        string memory paths = "";
        
        for (uint256 i = 0; i < pathCount; i++) {
            uint256 x1 = (i * 61 + 50) % 300 + 50;
            uint256 y1 = (i * 83 + 50) % 300 + 50;
            uint256 x2 = ((i + 2) * 61 + 50) % 300 + 50;
            uint256 y2 = ((i + 2) * 83 + 50) % 300 + 50;
            int256 offsetX = i % 2 == 0 ? int256(30) : int256(-30);
            int256 offsetY = i % 3 == 0 ? int256(30) : int256(-30);
            uint256 cx = (x1 + x2) / 2 + uint256(offsetX);
            uint256 cy = (y1 + y2) / 2 + uint256(offsetY);
            
            paths = string(abi.encodePacked(
                paths,
                '<path d="M', x1.toString(), ',', y1.toString(), 
                ' Q', cx.toString(), ',', cy.toString(), 
                ' ', x2.toString(), ',', y2.toString(), 
                '" fill="none" stroke="', color, '" stroke-width="1.5" opacity="0.7">',
                evolutionStage > 2 ? '<animate attributeName="stroke-dasharray" values="0,100;50,50;100,0" dur="4s" repeatCount="indefinite"/>' : '',
                '</path>'
            ));
        }
        
        return string(abi.encodePacked('<g class="curved-pathways">', paths, '</g>'));
    }

    /**
     * @dev Generate spiral pathway patterns
     */
    function _generateSpiralPathways(uint8 evolutionStage, uint8 networkDensity) private pure returns (string memory) {
        string memory color = evolutionStage.getEvolutionColor();
        uint256 spiralCount = networkDensity + 1;
        string memory spirals = "";
        
        for (uint256 s = 0; s < spiralCount; s++) {
            int256 offsetX = s % 2 == 0 ? int256(s * 30) : -int256(s * 30);
            int256 offsetY = s % 3 == 0 ? int256(s * 20) : -int256(s * 20);
            uint256 centerX = 200 + uint256(offsetX);
            uint256 centerY = 200 + uint256(offsetY);
            uint256 radius = 30 + s * 20;
            
            // Generate spiral path points
            string memory pathData = string(abi.encodePacked('M', centerX.toString(), ',', centerY.toString()));
            
            for (uint256 i = 0; i < 36; i++) { // 10-degree increments
                uint256 angle = i * 10;
                uint256 r = radius * i / 36;
                uint256 x = centerX + uint256((int256(r) * _cos(angle)) / 1000);
                uint256 y = centerY + uint256((int256(r) * _sin(angle)) / 1000);
                
                pathData = string(abi.encodePacked(pathData, ' L', x.toString(), ',', y.toString()));
            }
            
            spirals = string(abi.encodePacked(
                spirals,
                '<path d="', pathData, '" fill="none" stroke="', color, '" stroke-width="2" opacity="0.5">',
                evolutionStage > 3 ? '<animateTransform attributeName="transform" type="rotate" values="0 200 200;360 200 200" dur="8s" repeatCount="indefinite"/>' : '',
                '</path>'
            ));
        }
        
        return string(abi.encodePacked('<g class="spiral-pathways">', spirals, '</g>'));
    }

    /**
     * @dev Generate fractal pathway patterns
     */
    function _generateFractalPathways(uint8 evolutionStage, uint8 networkDensity) private pure returns (string memory) {
        string memory color = evolutionStage.getEvolutionColor();
        uint256 depth = networkDensity + 2; // Fractal depth
        
        return string(abi.encodePacked(
            '<g class="fractal-pathways">',
            _generateFractalBranch(200, 150, 200, 250, depth, color, evolutionStage),
            _generateFractalBranch(150, 200, 250, 200, depth, color, evolutionStage),
            _generateFractalBranch(170, 170, 230, 230, depth, color, evolutionStage),
            _generateFractalBranch(230, 170, 170, 230, depth, color, evolutionStage),
            '</g>'
        ));
    }

    /**
     * @dev Generate a single fractal branch
     */
    function _generateFractalBranch(uint256 x1, uint256 y1, uint256 x2, uint256 y2, uint256 depth, string memory color, uint8 evolutionStage) private pure returns (string memory) {
        if (depth == 0) return "";
        
        string memory branch = string(abi.encodePacked(
            '<line x1="', x1.toString(), '" y1="', y1.toString(), 
            '" x2="', x2.toString(), '" y2="', y2.toString(), 
            '" stroke="', color, '" stroke-width="', depth.toString(), '" opacity="0.6"/>'
        ));
        
        if (depth > 1) {
            uint256 midX = (x1 + x2) / 2;
            uint256 midY = (y1 + y2) / 2;
            uint256 offsetX = (y2 - y1) / 3; // Perpendicular offset
            uint256 offsetY = (x1 - x2) / 3;
            
            branch = string(abi.encodePacked(
                branch,
                _generateFractalBranch(midX, midY, midX + offsetX, midY + offsetY, depth - 1, color, evolutionStage),
                _generateFractalBranch(midX, midY, midX - offsetX, midY - offsetY, depth - 1, color, evolutionStage)
            ));
        }
        
        return branch;
    }

    /**
     * @dev Generate wave pathway patterns
     */
    function _generateWavePathways(uint8 evolutionStage, uint8 networkDensity) private pure returns (string memory) {
        string memory color = evolutionStage.getEvolutionColor();
        uint256 waveCount = networkDensity + 2;
        string memory waves = "";
        
        for (uint256 w = 0; w < waveCount; w++) {
            uint256 amplitude = 20 + w * 10;
            uint256 frequency = w + 1;
            uint256 yOffset = 100 + w * 50;
            
            string memory wavePath = "M50,";
            wavePath = string(abi.encodePacked(wavePath, yOffset.toString()));
            
            // Generate wave points
            for (uint256 x = 50; x <= 350; x += 10) {
                uint256 y = yOffset + uint256((int256(amplitude) * _sin((x - 50) * frequency * 180 / 300)) / 1000);
                wavePath = string(abi.encodePacked(wavePath, " L", x.toString(), ",", y.toString()));
            }
            
            waves = string(abi.encodePacked(
                waves,
                '<path d="', wavePath, '" fill="none" stroke="', color, '" stroke-width="2" opacity="0.7">',
                evolutionStage > 1 ? '<animate attributeName="d" values="' : '',
                evolutionStage > 1 ? wavePath : '',
                evolutionStage > 1 ? '" dur="3s" repeatCount="indefinite"/>' : '',
                '</path>'
            ));
        }
        
        return string(abi.encodePacked('<g class="wave-pathways">', waves, '</g>'));
    }

    /**
     * @dev Get pathway count based on evolution stage and network density
     */
    function _getPathwayCount(uint8 evolutionStage, uint8 networkDensity) private pure returns (uint256) {
        uint256 baseCount = 3 + evolutionStage * 2; // 3-11 base pathways
        uint256 densityMultiplier = networkDensity + 1; // 1-4x multiplier
        return baseCount * densityMultiplier;
    }

    /**
     * @dev Approximated cosine function (scaled by 1000)
     */
    function _cos(uint256 angle) private pure returns (int256) {
        angle = angle % 360;
        if (angle <= 90) {
            return int256(1000 - (angle * angle * 5) / 1000); // Approximation
        } else if (angle <= 180) {
            return -int256(1000 - ((180 - angle) * (180 - angle) * 5) / 1000);
        } else if (angle <= 270) {
            return -int256(1000 - ((angle - 180) * (angle - 180) * 5) / 1000);
        } else {
            return int256(1000 - ((360 - angle) * (360 - angle) * 5) / 1000);
        }
    }

    /**
     * @dev Approximated sine function (scaled by 1000)
     */
    function _sin(uint256 angle) private pure returns (int256) {
        return _cos((angle + 270) % 360);
    }
} 