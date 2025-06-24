// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/SVGRenderer.sol";

contract SVGRendererTest is Test {
    SVGRenderer public renderer;
    
    function setUp() public {
        renderer = new SVGRenderer();
    }
    
    function testBasicRendering() public {
        SVGRenderer.MonanimalTraits memory traits = SVGRenderer.MonanimalTraits({
            body: 0,
            eyes: 0,
            mouth: 0,
            accessory: 0,
            background: 0
        });
        
        SVGRenderer.EvolutionData memory evolution = SVGRenderer.EvolutionData({
            birthTime: block.timestamp,
            lastUpdate: block.timestamp,
            level: 0
        });
        
        string memory svg = renderer.renderSVG(1, traits, evolution);
        
        // Test that SVG contains expected elements
        assertTrue(bytes(svg).length > 0);
        assertEq(bytes(svg)[0], 0x3C); // '<' character
    }
    
    function testEvolutionLevels() public view {
        // Test newborn (less than 1 day)
        uint256 level = renderer.calculateEvolutionLevel(block.timestamp);
        assertEq(level, 0);
        
        // Test young (1+ days old)
        level = renderer.calculateEvolutionLevel(block.timestamp - 2 days);
        assertEq(level, 1);
        
        // Test mature (7+ days old)
        level = renderer.calculateEvolutionLevel(block.timestamp - 14 days);
        assertEq(level, 2);
        
        // Test ancient (30+ days old)
        level = renderer.calculateEvolutionLevel(block.timestamp - 60 days);
        assertEq(level, 3);
    }
    
    function testRandomTraitGeneration() public view {
        SVGRenderer.MonanimalTraits memory traits = renderer.generateRandomTraits(12345);
        
        // Ensure all traits are within valid ranges
        assertTrue(traits.body < 5);
        assertTrue(traits.eyes < 5);
        assertTrue(traits.mouth < 5);
        assertTrue(traits.accessory < 5);
        assertTrue(traits.background < 5);
    }
    
    function testPreviewFunction() public view {
        SVGRenderer.MonanimalTraits memory traits = SVGRenderer.MonanimalTraits({
            body: 1,
            eyes: 2,
            mouth: 1,
            accessory: 1,
            background: 2
        });
        
        string memory svg = renderer.previewSVG(traits);
        assertTrue(bytes(svg).length > 0);
    }
    
    function testTraitNames() public view {
        assertEq(renderer.getBodyName(0), "Cosmic Cube");
        assertEq(renderer.getEyeName(1), "Galaxy Swirl");
        assertEq(renderer.getMouthName(2), "Stellar Surprise");
        assertEq(renderer.getAccessoryName(3), "Space Helmet");
        assertEq(renderer.getBackgroundName(4), "Interdimensional");
        assertEq(renderer.getEvolutionName(1), "Young");
    }
    
    function testMetadataGeneration() public view {
        SVGRenderer.MonanimalTraits memory traits = SVGRenderer.MonanimalTraits({
            body: 0,
            eyes: 1,
            mouth: 2,
            accessory: 0,
            background: 1
        });
        
        SVGRenderer.EvolutionData memory evolution = SVGRenderer.EvolutionData({
            birthTime: block.timestamp - 5 days,
            lastUpdate: block.timestamp,
            level: 1
        });
        
        string memory metadata = renderer.generateMetadata(1, "Test Monanimal", traits, evolution);
        
        // Should start with data:application/json;base64,
        assertTrue(bytes(metadata).length > 30);
    }
} 