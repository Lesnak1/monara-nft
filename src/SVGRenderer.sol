// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./libraries/MonanimalParts.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title SVGRenderer
 * @dev Renders complete SVG images for Monanimal NFTs by combining parts
 */
contract SVGRenderer {
    using Strings for uint256;

    /**
     * @dev Struct to hold Monanimal genes/traits
     */
    struct MonanimalTraits {
        uint8 body;      // 0-4: Body type
        uint8 eyes;      // 0-4: Eye type  
        uint8 mouth;     // 0-4: Mouth type
        uint8 accessory; // 0-4: Accessory type
        uint8 background; // 0-4: Background type
    }

    /**
     * @dev Struct to hold evolution data
     */
    struct EvolutionData {
        uint256 birthTime;    // When the NFT was minted
        uint256 lastUpdate;   // Last time metadata was updated
        uint256 level;        // Evolution level (0-3)
    }

    /**
     * @dev Main render function that creates complete SVG
     * @param tokenId The token ID (used for random elements)
     * @param traits The selected traits for this Monanimal
     * @param evolution Evolution data for dynamic effects
     * @return Complete SVG as string
     */
    function renderSVG(
        uint256 tokenId,
        MonanimalTraits memory traits,
        EvolutionData memory evolution
    ) public view returns (string memory) {
        // Calculate current evolution level based on age
        uint256 currentEvolutionLevel = calculateEvolutionLevel(evolution.birthTime);
        
        // Generate pseudo-random seed from tokenId for additional effects
        uint256 seed = uint256(keccak256(abi.encodePacked(tokenId, block.difficulty)));
        
        return string.concat(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style="background-color: black;">',
            _renderBackground(traits.background, seed),
            _renderEvolutionEffects(currentEvolutionLevel),
            _renderBody(traits.body),
            _renderEyes(traits.eyes),
            _renderMouth(traits.mouth),
            _renderAccessory(traits.accessory),
            _renderSparkles(currentEvolutionLevel),
            '</svg>'
        );
    }

    /**
     * @dev Calculates evolution level based on age
     * @param birthTime When the NFT was born
     * @return Evolution level (0=newborn, 1=young, 2=mature, 3=ancient)
     */
    function calculateEvolutionLevel(uint256 birthTime) public view returns (uint256) {
        uint256 age = block.timestamp - birthTime;
        
        if (age < 1 days) {
            return 0; // Newborn (less than 1 day)
        } else if (age < 7 days) {
            return 1; // Young (1-7 days)
        } else if (age < 30 days) {
            return 2; // Mature (1-4 weeks)
        } else {
            return 3; // Ancient (over 1 month)
        }
    }

    /**
     * @dev Generate complete metadata JSON for tokenURI
     * @param tokenId The token ID
     * @param name The NFT name
     * @param traits The Monanimal traits
     * @param evolution Evolution data
     * @return Base64 encoded JSON metadata
     */
    function generateMetadata(
        uint256 tokenId,
        string memory name,
        MonanimalTraits memory traits,
        EvolutionData memory evolution
    ) external view returns (string memory) {
        string memory svgImage = renderSVG(tokenId, traits, evolution);
        string memory base64Image = Base64.encode(bytes(svgImage));
        
        uint256 evolutionLevel = calculateEvolutionLevel(evolution.birthTime);
        string memory evolutionName = getEvolutionName(evolutionLevel);
        
        string memory json = string.concat(
            '{"name": "', name, '",',
            '"description": "', _generateDescription(evolutionLevel), '",',
            '"image": "data:image/svg+xml;base64,', base64Image, '",',
            '"attributes": [',
            _generateAttributes(traits, evolutionLevel),
            ']}'
        );
        
        return string.concat(
            "data:application/json;base64,",
            Base64.encode(bytes(json))
        );
    }

    // ============================
    // INTERNAL RENDERING FUNCTIONS
    // ============================

    function _renderBackground(uint8 bgType, uint256 seed) internal pure returns (string memory) {
        // Add some randomness to background based on seed
        uint8 variation = uint8(seed % 3);
        return MonanimalParts.getBackground((bgType + variation) % 5);
    }

    function _renderEvolutionEffects(uint256 evolutionLevel) internal pure returns (string memory) {
        return MonanimalParts.getEvolutionAura(evolutionLevel);
    }

    function _renderBody(uint8 bodyType) internal pure returns (string memory) {
        return MonanimalParts.getBody(bodyType);
    }

    function _renderEyes(uint8 eyeType) internal pure returns (string memory) {
        return MonanimalParts.getEyes(eyeType);
    }

    function _renderMouth(uint8 mouthType) internal pure returns (string memory) {
        return MonanimalParts.getMouth(mouthType);
    }

    function _renderAccessory(uint8 accessoryType) internal pure returns (string memory) {
        return MonanimalParts.getAccessory(accessoryType);
    }

    function _renderSparkles(uint256 evolutionLevel) internal pure returns (string memory) {
        if (evolutionLevel > 0) {
            return MonanimalParts.getSparkles();
        }
        return "";
    }

    // ============================
    // METADATA HELPER FUNCTIONS
    // ============================

    function _generateDescription(uint256 evolutionLevel) internal pure returns (string memory) {
        string memory baseDesc = "A mystical Monanimal from the cosmic realm, embodying the spirit of the Monad ecosystem. ";
        
        if (evolutionLevel == 0) {
            return string.concat(baseDesc, "This young being has just emerged from the cosmic void.");
        } else if (evolutionLevel == 1) {
            return string.concat(baseDesc, "Growing in power and wisdom, this being shows signs of cosmic awakening.");
        } else if (evolutionLevel == 2) {
            return string.concat(baseDesc, "A mature cosmic entity with significant spiritual energy.");
        } else {
            return string.concat(baseDesc, "An ancient being of immense cosmic power and wisdom.");
        }
    }

    function _generateAttributes(
        MonanimalTraits memory traits,
        uint256 evolutionLevel
    ) internal pure returns (string memory) {
        return string.concat(
            '{"trait_type": "Body", "value": "', getBodyName(traits.body), '"},',
            '{"trait_type": "Eyes", "value": "', getEyeName(traits.eyes), '"},',
            '{"trait_type": "Mouth", "value": "', getMouthName(traits.mouth), '"},',
            '{"trait_type": "Accessory", "value": "', getAccessoryName(traits.accessory), '"},',
            '{"trait_type": "Background", "value": "', getBackgroundName(traits.background), '"},',
            '{"trait_type": "Evolution", "value": "', getEvolutionName(evolutionLevel), '"},',
            '{"trait_type": "Evolution Level", "value": ', evolutionLevel.toString(), ', "max_value": 3}'
        );
    }

    // ============================
    // TRAIT NAME FUNCTIONS
    // ============================

    function getBodyName(uint8 bodyType) public pure returns (string memory) {
        string[5] memory names = ["Cosmic Cube", "Stellar Oval", "Galactic Rectangle", "Quantum Wave", "Solar Prism"];
        return names[bodyType % 5];
    }

    function getEyeName(uint8 eyeType) public pure returns (string memory) {
        string[5] memory names = ["Cosmic Vision", "Galaxy Swirl", "Star Sight", "Third Eye", "Ethereal Glow"];
        return names[eyeType % 5];
    }

    function getMouthName(uint8 mouthType) public pure returns (string memory) {
        string[5] memory names = ["Joyful Cosmos", "Cosmic Sorrow", "Stellar Surprise", "Neutral Space", "Wave Dimension"];
        return names[mouthType % 5];
    }

    function getAccessoryName(uint8 accessoryType) public pure returns (string memory) {
        string[5] memory names = ["None", "Cosmic Crown", "Monad Crystal", "Space Helmet", "Galaxy Wings"];
        return names[accessoryType % 5];
    }

    function getBackgroundName(uint8 bgType) public pure returns (string memory) {
        string[5] memory names = ["Dark Void", "Purple Nebula", "Galaxy Swirl", "Cosmic Ocean", "Interdimensional"];
        return names[bgType % 5];
    }

    function getEvolutionName(uint256 evolutionLevel) public pure returns (string memory) {
        string[4] memory names = ["Newborn", "Young", "Mature", "Ancient"];
        return names[evolutionLevel % 4];
    }

    // ============================
    // UTILITY FUNCTIONS
    // ============================

    /**
     * @dev Creates a random set of traits based on a seed
     * @param seed Random seed for trait generation
     * @return Random traits struct
     */
    function generateRandomTraits(uint256 seed) external pure returns (MonanimalTraits memory) {
        return MonanimalTraits({
            body: uint8(uint256(keccak256(abi.encode(seed, "body"))) % 5),
            eyes: uint8(uint256(keccak256(abi.encode(seed, "eyes"))) % 5),
            mouth: uint8(uint256(keccak256(abi.encode(seed, "mouth"))) % 5),
            accessory: uint8(uint256(keccak256(abi.encode(seed, "accessory"))) % 5),
            background: uint8(uint256(keccak256(abi.encode(seed, "background"))) % 5)
        });
    }

    /**
     * @dev Preview function for frontend - generates SVG without storing data
     * @param traits The traits to preview
     * @return SVG string for preview
     */
    function previewSVG(MonanimalTraits memory traits) external pure returns (string memory) {
        return string.concat(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style="background-color: black;">',
            MonanimalParts.getBackground(traits.background),
            MonanimalParts.getBody(traits.body),
            MonanimalParts.getEyes(traits.eyes),
            MonanimalParts.getMouth(traits.mouth),
            MonanimalParts.getAccessory(traits.accessory),
            '</svg>'
        );
    }
} 