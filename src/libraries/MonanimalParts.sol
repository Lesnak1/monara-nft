// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title MonanimalParts
 * @dev Library containing SVG parts for Monanimal NFTs inspired by Monad lore
 */
library MonanimalParts {
    // ============================
    // BODY PARTS (Galaxy/Cosmic themed)
    // ============================
    
    function getBody(uint8 bodyType) internal pure returns (string memory) {
        if (bodyType == 0) {
            return '<rect x="50" y="60" width="100" height="120" rx="20" fill="#6366f1" stroke="#4f46e5" stroke-width="2"/>';
        } else if (bodyType == 1) {
            return '<ellipse cx="100" cy="120" rx="50" ry="60" fill="#8b5cf6" stroke="#7c3aed" stroke-width="2"/>';
        } else if (bodyType == 2) {
            return '<rect x="45" y="55" width="110" height="130" rx="25" fill="#ec4899" stroke="#db2777" stroke-width="2"/>';
        } else if (bodyType == 3) {
            return '<path d="M50 60 Q100 40 150 60 L150 180 Q100 200 50 180 Z" fill="#10b981" stroke="#059669" stroke-width="2"/>';
        } else {
            return '<rect x="50" y="60" width="100" height="120" rx="15" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>';
        }
    }

    // ============================
    // EYES (Cosmic/Mystical themed)
    // ============================
    
    function getEyes(uint8 eyeType) internal pure returns (string memory) {
        if (eyeType == 0) {
            // Simple cosmic eyes
            return '<circle cx="80" cy="90" r="8" fill="white"/><circle cx="80" cy="90" r="4" fill="#1e40af"/>'
                   '<circle cx="120" cy="90" r="8" fill="white"/><circle cx="120" cy="90" r="4" fill="#1e40af"/>';
        } else if (eyeType == 1) {
            // Galaxy swirl eyes
            return '<circle cx="80" cy="90" r="10" fill="#312e81"/><path d="M75 90 Q80 85 85 90 Q80 95 75 90" fill="#6366f1"/>'
                   '<circle cx="120" cy="90" r="10" fill="#312e81"/><path d="M115 90 Q120 85 125 90 Q120 95 115 90" fill="#6366f1"/>';
        } else if (eyeType == 2) {
            // Star eyes
            return '<polygon points="80,82 82,88 88,88 83,92 85,98 80,94 75,98 77,92 72,88 78,88" fill="#fbbf24"/>'
                   '<polygon points="120,82 122,88 128,88 123,92 125,98 120,94 115,98 117,92 112,88 118,88" fill="#fbbf24"/>';
        } else if (eyeType == 3) {
            // Mystical third eye
            return '<circle cx="80" cy="90" r="6" fill="#7c3aed"/><circle cx="120" cy="90" r="6" fill="#7c3aed"/>'
                   '<circle cx="100" cy="75" r="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/>';
        } else {
            // Glowing eyes
            return '<circle cx="80" cy="90" r="8" fill="#06ffa5" opacity="0.8"/><circle cx="80" cy="90" r="3" fill="white"/>'
                   '<circle cx="120" cy="90" r="8" fill="#06ffa5" opacity="0.8"/><circle cx="120" cy="90" r="3" fill="white"/>';
        }
    }

    // ============================
    // MOUTH (Expressions)
    // ============================
    
    function getMouth(uint8 mouthType) internal pure returns (string memory) {
        if (mouthType == 0) {
            return '<path d="M85 115 Q100 125 115 115" stroke="#374151" stroke-width="2" fill="none"/>'; // Happy
        } else if (mouthType == 1) {
            return '<path d="M85 125 Q100 115 115 125" stroke="#374151" stroke-width="2" fill="none"/>'; // Sad
        } else if (mouthType == 2) {
            return '<circle cx="100" cy="120" r="8" fill="#374151"/>'; // Surprised
        } else if (mouthType == 3) {
            return '<rect x="90" y="118" width="20" height="4" fill="#374151"/>'; // Neutral
        } else {
            return '<path d="M85 115 Q90 120 95 115 Q100 125 105 115 Q110 120 115 115" stroke="#374151" stroke-width="2" fill="none"/>'; // Wavy
        }
    }

    // ============================
    // ACCESSORIES (Monad themed)
    // ============================
    
    function getAccessory(uint8 accessoryType) internal pure returns (string memory) {
        if (accessoryType == 0) {
            return ""; // None
        } else if (accessoryType == 1) {
            // Cosmic crown
            return '<polygon points="85,45 95,35 105,35 115,45 110,50 90,50" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/>'
                   '<circle cx="95" cy="40" r="2" fill="#06ffa5"/><circle cx="105" cy="40" r="2" fill="#06ffa5"/>';
        } else if (accessoryType == 2) {
            // Monad crystal
            return '<polygon points="100,30 110,40 100,50 90,40" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1" opacity="0.8"/>';
        } else if (accessoryType == 3) {
            // Space helmet
            return '<circle cx="100" cy="70" r="35" fill="none" stroke="#e5e7eb" stroke-width="2" opacity="0.6"/>';
        } else {
            // Galaxy wings
            return '<path d="M50 80 Q30 70 40 100 Q50 90 50 80" fill="#6366f1" opacity="0.7"/>'
                   '<path d="M150 80 Q170 70 160 100 Q150 90 150 80" fill="#6366f1" opacity="0.7"/>';
        }
    }

    // ============================
    // BACKGROUND EFFECTS
    // ============================
    
    function getBackground(uint8 bgType) internal pure returns (string memory) {
        if (bgType == 0) {
            return '<rect width="200" height="200" fill="#0f172a"/>'; // Dark space
        } else if (bgType == 1) {
            return '<rect width="200" height="200" fill="#1e1b4b"/>'; // Deep purple
        } else if (bgType == 2) {
            return '<defs><radialGradient id="galaxy" cx="50%" cy="50%" r="50%">'
                   '<stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#1e1b4b"/></radialGradient></defs>'
                   '<rect width="200" height="200" fill="url(#galaxy)"/>'; // Galaxy gradient
        } else if (bgType == 3) {
            return '<rect width="200" height="200" fill="#0c4a6e"/>'; // Cosmic blue
        } else {
            return '<defs><linearGradient id="cosmic" x1="0%" y1="0%" x2="100%" y2="100%">'
                   '<stop offset="0%" stop-color="#7c3aed"/><stop offset="50%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#06b6d4"/></gradientLinear></defs>'
                   '<rect width="200" height="200" fill="url(#cosmic)"/>'; // Cosmic gradient
        }
    }

    // ============================
    // SPARKLE EFFECTS (for evolution)
    // ============================
    
    function getSparkles() internal pure returns (string memory) {
        return '<circle cx="30" cy="40" r="1" fill="#fbbf24" opacity="0.8">'
               '<animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/></circle>'
               '<circle cx="170" cy="60" r="1.5" fill="#06ffa5" opacity="0.8">'
               '<animate attributeName="opacity" values="0.2;0.9;0.2" dur="3s" repeatCount="indefinite"/></circle>'
               '<circle cx="160" cy="150" r="1" fill="#ec4899" opacity="0.8">'
               '<animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite"/></circle>'
               '<circle cx="40" cy="140" r="1.2" fill="#8b5cf6" opacity="0.8">'
               '<animate attributeName="opacity" values="0.1;0.8;0.1" dur="4s" repeatCount="indefinite"/></circle>';
    }

    // ============================
    // EVOLUTION AURA (based on age)
    // ============================
    
    function getEvolutionAura(uint256 evolutionLevel) internal pure returns (string memory) {
        if (evolutionLevel == 0) {
            return ""; // No aura for newborns
        } else if (evolutionLevel == 1) {
            // Young - soft glow
            return '<circle cx="100" cy="120" r="80" fill="none" stroke="#06ffa5" stroke-width="1" opacity="0.3"/>';
        } else if (evolutionLevel == 2) {
            // Mature - stronger glow
            return '<circle cx="100" cy="120" r="85" fill="none" stroke="#8b5cf6" stroke-width="2" opacity="0.5"/>'
                   '<circle cx="100" cy="120" r="75" fill="none" stroke="#06ffa5" stroke-width="1" opacity="0.3"/>';
        } else {
            // Ancient - powerful aura
            return '<circle cx="100" cy="120" r="90" fill="none" stroke="#fbbf24" stroke-width="3" opacity="0.7"/>'
                   '<circle cx="100" cy="120" r="80" fill="none" stroke="#8b5cf6" stroke-width="2" opacity="0.5"/>'
                   '<circle cx="100" cy="120" r="70" fill="none" stroke="#06ffa5" stroke-width="1" opacity="0.3"/>';
        }
    }
} 