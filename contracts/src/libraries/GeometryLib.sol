// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Strings.sol";
import "./ColorLib.sol";

/**
 * @title GeometryLib
 * @dev Library for generating geometric shapes and mathematical functions
 */
library GeometryLib {
    using Strings for uint256;
    using ColorLib for uint8;

    /**
     * @dev Generate neural core based on geometry type and evolution stage
     */
    function generateCore(uint8 coreGeometry, uint8 evolutionStage) external pure returns (string memory) {
        string memory color = evolutionStage.getEvolutionColor();
        uint256 size = 15 + evolutionStage * 3; // Base size 15, grows with evolution
        
        if (coreGeometry == 0) { // Circle
            return _generateCircleCore(size, color, evolutionStage);
        } else if (coreGeometry == 1) { // Diamond
            return _generateDiamondCore(size, color, evolutionStage);
        } else if (coreGeometry == 2) { // Hexagon
            return _generateHexagonCore(size, color, evolutionStage);
        } else if (coreGeometry == 3) { // Octagon
            return _generateOctagonCore(size, color, evolutionStage);
        } else if (coreGeometry == 4) { // Star
            return _generateStarCore(size, color, evolutionStage);
        } else if (coreGeometry == 5) { // Triangle
            return _generateTriangleCore(size, color, evolutionStage);
        } else if (coreGeometry == 6) { // Pentagon
            return _generatePentagonCore(size, color, evolutionStage);
        } else { // Cross
            return _generateCrossCore(size, color, evolutionStage);
        }
    }

    /**
     * @dev Generate circle core
     */
    function _generateCircleCore(uint256 size, string memory color, uint8 evolutionStage) private pure returns (string memory) {
        return string(abi.encodePacked(
            '<circle cx="200" cy="200" r="', size.toString(), '" fill="url(#coreGrad)" stroke="', color, '" stroke-width="2" filter="url(#glow)">',
            evolutionStage > 2 ? '<animate attributeName="r" values="' : '',
            evolutionStage > 2 ? size.toString() : '',
            evolutionStage > 2 ? ';' : '',
            evolutionStage > 2 ? (size + 5).toString() : '',
            evolutionStage > 2 ? ';' : '',
            evolutionStage > 2 ? size.toString() : '',
            evolutionStage > 2 ? '" dur="4s" repeatCount="indefinite"/>' : '',
            '</circle>'
        ));
    }

    /**
     * @dev Generate diamond core
     */
    function _generateDiamondCore(uint256 size, string memory color, uint8 evolutionStage) private pure returns (string memory) {
        uint256 centerX = 200;
        uint256 centerY = 200;
        
        return string(abi.encodePacked(
            '<polygon points="',
            centerX.toString(), ',', (centerY - size).toString(), ' ',
            (centerX + size).toString(), ',', centerY.toString(), ' ',
            centerX.toString(), ',', (centerY + size).toString(), ' ',
            (centerX - size).toString(), ',', centerY.toString(),
            '" fill="url(#coreGrad)" stroke="', color, '" stroke-width="2" filter="url(#glow)">',
            evolutionStage > 2 ? '<animateTransform attributeName="transform" type="rotate" values="0 200 200;360 200 200" dur="8s" repeatCount="indefinite"/>' : '',
            '</polygon>'
        ));
    }

    /**
     * @dev Generate hexagon core
     */
    function _generateHexagonCore(uint256 size, string memory color, uint8 evolutionStage) private pure returns (string memory) {
        uint256 centerX = 200;
        uint256 centerY = 200;
        
        // Calculate hexagon points
        uint256 cos30 = (size * 866) / 1000; // cos(30°) ≈ 0.866
        uint256 sin30 = size / 2; // sin(30°) = 0.5
        
        return string(abi.encodePacked(
            '<polygon points="',
            (centerX + size).toString(), ',', centerY.toString(), ' ',
            (centerX + cos30).toString(), ',', (centerY + sin30).toString(), ' ',
            (centerX - cos30).toString(), ',', (centerY + sin30).toString(), ' ',
            (centerX - size).toString(), ',', centerY.toString(), ' ',
            (centerX - cos30).toString(), ',', (centerY - sin30).toString(), ' ',
            (centerX + cos30).toString(), ',', (centerY - sin30).toString(),
            '" fill="url(#coreGrad)" stroke="', color, '" stroke-width="2" filter="url(#glow)">',
            evolutionStage > 1 ? '<animateTransform attributeName="transform" type="rotate" values="0 200 200;120 200 200;240 200 200;360 200 200" dur="6s" repeatCount="indefinite"/>' : '',
            '</polygon>'
        ));
    }

    /**
     * @dev Generate octagon core
     */
    function _generateOctagonCore(uint256 size, string memory color, uint8 /* evolutionStage */) private pure returns (string memory) {
        uint256 centerX = 200;
        uint256 centerY = 200;
        uint256 offset = (size * 707) / 1000; // cos(45°) ≈ 0.707
        
        return string(abi.encodePacked(
            '<polygon points="',
            (centerX + size).toString(), ',', centerY.toString(), ' ',
            (centerX + offset).toString(), ',', (centerY + offset).toString(), ' ',
            centerX.toString(), ',', (centerY + size).toString(), ' ',
            (centerX - offset).toString(), ',', (centerY + offset).toString(), ' ',
            (centerX - size).toString(), ',', centerY.toString(), ' ',
            (centerX - offset).toString(), ',', (centerY - offset).toString(), ' ',
            centerX.toString(), ',', (centerY - size).toString(), ' ',
            (centerX + offset).toString(), ',', (centerY - offset).toString(),
            '" fill="url(#coreGrad)" stroke="', color, '" stroke-width="2" filter="url(#glow)"/>'
        ));
    }

    /**
     * @dev Generate star core
     */
    function _generateStarCore(uint256 size, string memory color, uint8 evolutionStage) private pure returns (string memory) {
        uint256 centerX = 200;
        uint256 centerY = 200;
        uint256 innerSize = size / 2;
        
        return string(abi.encodePacked(
            '<polygon points="',
            centerX.toString(), ',', (centerY - size).toString(), ' ',
            (centerX + innerSize/2).toString(), ',', (centerY - innerSize/2).toString(), ' ',
            (centerX + size).toString(), ',', centerY.toString(), ' ',
            (centerX + innerSize/2).toString(), ',', (centerY + innerSize/2).toString(), ' ',
            centerX.toString(), ',', (centerY + size).toString(), ' ',
            (centerX - innerSize/2).toString(), ',', (centerY + innerSize/2).toString(), ' ',
            (centerX - size).toString(), ',', centerY.toString(), ' ',
            (centerX - innerSize/2).toString(), ',', (centerY - innerSize/2).toString(),
            '" fill="url(#coreGrad)" stroke="', color, '" stroke-width="2" filter="url(#glow)">',
            evolutionStage > 3 ? '<animateTransform attributeName="transform" type="rotate" values="0 200 200;720 200 200" dur="10s" repeatCount="indefinite"/>' : '',
            '</polygon>'
        ));
    }

    /**
     * @dev Generate triangle core
     */
    function _generateTriangleCore(uint256 size, string memory color, uint8 /* evolutionStage */) private pure returns (string memory) {
        uint256 centerX = 200;
        uint256 centerY = 200;
        uint256 height = (size * 866) / 1000; // Equilateral triangle height
        
        return string(abi.encodePacked(
            '<polygon points="',
            centerX.toString(), ',', (centerY - height).toString(), ' ',
            (centerX + size).toString(), ',', (centerY + height/2).toString(), ' ',
            (centerX - size).toString(), ',', (centerY + height/2).toString(),
            '" fill="url(#coreGrad)" stroke="', color, '" stroke-width="2" filter="url(#glow)"/>'
        ));
    }

    /**
     * @dev Generate pentagon core
     */
    function _generatePentagonCore(uint256 size, string memory color, uint8 /* evolutionStage */) private pure returns (string memory) {
        uint256 centerX = 200;
        uint256 centerY = 200;
        
        // Pentagon points (simplified calculation)
        return string(abi.encodePacked(
            '<polygon points="',
            centerX.toString(), ',', (centerY - size).toString(), ' ',
            (centerX + (size * 951) / 1000).toString(), ',', (centerY - (size * 309) / 1000).toString(), ' ',
            (centerX + (size * 588) / 1000).toString(), ',', (centerY + (size * 809) / 1000).toString(), ' ',
            (centerX - (size * 588) / 1000).toString(), ',', (centerY + (size * 809) / 1000).toString(), ' ',
            (centerX - (size * 951) / 1000).toString(), ',', (centerY - (size * 309) / 1000).toString(),
            '" fill="url(#coreGrad)" stroke="', color, '" stroke-width="2" filter="url(#glow)"/>'
        ));
    }

    /**
     * @dev Generate cross core
     */
    function _generateCrossCore(uint256 size, string memory color, uint8 /* evolutionStage */) private pure returns (string memory) {
        uint256 centerX = 200;
        uint256 centerY = 200;
        uint256 thickness = size / 3;
        
        return string(abi.encodePacked(
            '<g fill="url(#coreGrad)" stroke="', color, '" stroke-width="2" filter="url(#glow)">',
            '<rect x="', (centerX - thickness/2).toString(), '" y="', (centerY - size).toString(), '" width="', thickness.toString(), '" height="', (size * 2).toString(), '"/>',
            '<rect x="', (centerX - size).toString(), '" y="', (centerY - thickness/2).toString(), '" width="', (size * 2).toString(), '" height="', thickness.toString(), '"/>',
            '</g>'
        ));
    }

    /**
     * @dev Calculate distance between two points
     */
    function distance(uint256 x1, uint256 y1, uint256 x2, uint256 y2) external pure returns (uint256) {
        uint256 dx = x1 > x2 ? x1 - x2 : x2 - x1;
        uint256 dy = y1 > y2 ? y1 - y2 : y2 - y1;
        return sqrt(dx * dx + dy * dy);
    }

    /**
     * @dev Integer square root using Babylonian method
     */
    function sqrt(uint256 x) public pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }

    /**
     * @dev Convert uint256 to string with toString
     */
    function toString(uint256 value) external pure returns (string memory) {
        return value.toString();
    }
} 