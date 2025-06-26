// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ColorLib
 * @dev Library for managing colors based on evolution stages and traits
 */
library ColorLib {

    /**
     * @dev Get primary color based on evolution stage
     */
    function getEvolutionColor(uint8 evolutionStage) internal pure returns (string memory) {
        if (evolutionStage == 1) { // Initialization - Purple (Monad brand)
            return "#836EF9";
        } else if (evolutionStage == 2) { // Processing - Electric Blue
            return "#00BFFF";
        } else if (evolutionStage == 3) { // Learning - Neon Green
            return "#39FF14";
        } else { // Transcendence - Golden
            return "#FFD700";
        }
    }

    /**
     * @dev Get secondary color based on evolution stage
     */
    function getSecondaryColor(uint8 evolutionStage) internal pure returns (string memory) {
        if (evolutionStage == 1) { // Initialization
            return "#200052"; // Deep purple
        } else if (evolutionStage == 2) { // Processing
            return "#0066CC"; // Deep blue
        } else if (evolutionStage == 3) { // Learning
            return "#00CC00"; // Green
        } else { // Transcendence
            return "#FF8C00"; // Dark orange
        }
    }

    /**
     * @dev Get accent color based on mutation type
     */
    function getMutationColor(uint8 mutation) external pure returns (string memory) {
        if (mutation == 0) {
            return "#FFFFFF"; // No mutation - white
        } else if (mutation <= 50) {
            return "#FF00FF"; // Quantum mutations - magenta
        } else if (mutation <= 100) {
            return "#00FFFF"; // Neural mutations - cyan
        } else if (mutation <= 150) {
            return "#FF4500"; // Data mutations - red-orange
        } else if (mutation <= 200) {
            return "#9400D3"; // Void mutations - violet
        } else {
            return "#DC143C"; // Rare mutations - crimson
        }
    }

    /**
     * @dev Get environment color scheme
     */
    function getEnvironmentColors(uint8 environment) external pure returns (string memory, string memory) {
        if (environment == 0) { // Void
            return ("#0A0A0F", "#1A1A2E");
        } else if (environment == 1) { // Matrix
            return ("#000000", "#00FF00");
        } else if (environment == 2) { // Cloud
            return ("#E6E6FA", "#4169E1");
        } else if (environment == 3) { // Quantum
            return ("#2F0A4F", "#7209B7");
        } else { // Cyber
            return ("#0F0F23", "#FF073A");
        }
    }

    /**
     * @dev Convert HSL to RGB hex color
     */
    function hslToHex(uint256 h, uint256 s, uint256 l) internal pure returns (string memory) {
        // Normalize values
        h = h % 360;
        s = s > 100 ? 100 : s;
        l = l > 100 ? 100 : l;
        
        uint256 c = (100 - abs(int256(2 * l) - 100)) * s / 100;
        uint256 x = c * (100 - abs(int256((h / 60) % 2) * 100 - 100)) / 100;
        uint256 m = l - c / 2;
        
        uint256 r;
        uint256 g;
        uint256 b;
        
        if (h < 60) {
            r = c + m;
            g = x + m;
            b = m;
        } else if (h < 120) {
            r = x + m;
            g = c + m;
            b = m;
        } else if (h < 180) {
            r = m;
            g = c + m;
            b = x + m;
        } else if (h < 240) {
            r = m;
            g = x + m;
            b = c + m;
        } else if (h < 300) {
            r = x + m;
            g = m;
            b = c + m;
        } else {
            r = c + m;
            g = m;
            b = x + m;
        }
        
        // Convert to 0-255 range
        r = (r * 255) / 100;
        g = (g * 255) / 100;
        b = (b * 255) / 100;
        
        return string(abi.encodePacked(
            "#",
            _toHexString(r),
            _toHexString(g),
            _toHexString(b)
        ));
    }

    /**
     * @dev Generate dynamic color based on time and traits
     */
    function getDynamicColor(uint256 seed, uint256 timestamp, uint8 evolutionStage) external pure returns (string memory) {
        // Time-based hue shift
        uint256 timeShift = (timestamp / 3600) % 360; // Changes every hour
        
        // Trait-based modifications
        uint256 hue = (seed % 360 + timeShift + evolutionStage * 30) % 360;
        uint256 saturation = 70 + (seed % 30); // 70-100%
        uint256 lightness = 40 + evolutionStage * 10; // 40-80%
        
        return hslToHex(hue, saturation, lightness);
    }

    /**
     * @dev Get color palette for specific particle system
     */
    function getParticleColors(uint8 particleSystem, uint8 evolutionStage) internal pure returns (string memory, string memory, string memory) {
        string memory primary = getEvolutionColor(evolutionStage);
        
        if (particleSystem == 0) { // Dots
            return (primary, "#FFFFFF", getSecondaryColor(evolutionStage));
        } else if (particleSystem == 1) { // Squares
            return (primary, getSecondaryColor(evolutionStage), "#FF8C00");
        } else if (particleSystem == 2) { // Triangles
            return (primary, "#FF1493", getSecondaryColor(evolutionStage));
        } else if (particleSystem == 3) { // Diamonds
            return (primary, "#00CED1", "#FFD700");
        } else if (particleSystem == 4) { // Stars
            return (primary, "#FFFF00", "#FF69B4");
        } else { // Hexagons
            return (primary, "#32CD32", getSecondaryColor(evolutionStage));
        }
    }

    /**
     * @dev Convert uint to 2-digit hex string
     */
    function _toHexString(uint256 value) private pure returns (string memory) {
        if (value == 0) return "00";
        
        bytes memory buffer = new bytes(2);
        buffer[1] = _getHexChar(value % 16);
        buffer[0] = _getHexChar(value / 16);
        
        return string(buffer);
    }

    /**
     * @dev Get hex character for value 0-15
     */
    function _getHexChar(uint256 value) private pure returns (bytes1) {
        if (value < 10) {
            return bytes1(uint8(48 + value)); // '0' to '9'
        } else {
            return bytes1(uint8(87 + value)); // 'a' to 'f'
        }
    }

    /**
     * @dev Calculate absolute value
     */
    function abs(int256 x) private pure returns (uint256) {
        return x >= 0 ? uint256(x) : uint256(-x);
    }
} 