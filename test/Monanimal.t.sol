// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Monanimal.sol";
import "../src/SVGRenderer.sol";

contract MonanimalTest is Test {
    Monanimal public monanimal;
    SVGRenderer public renderer;
    
    address public owner = address(1);
    address public user1 = address(2);
    address public user2 = address(3);
    
    function setUp() public {
        vm.startPrank(owner);
        renderer = new SVGRenderer();
        monanimal = new Monanimal(address(renderer));
        vm.stopPrank();
        
        // Give users some ETH
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
    }
    
    function testDeployment() public view {
        assertEq(monanimal.name(), "Monanimal");
        assertEq(monanimal.symbol(), "MONA");
        assertEq(monanimal.owner(), owner);
        assertEq(address(monanimal.renderer()), address(renderer));
        assertEq(monanimal.MAX_SUPPLY(), 10000);
        assertEq(monanimal.mintPrice(), 0.01 ether);
    }
    
    function testBasicMinting() public {
        SVGRenderer.MonanimalTraits memory traits = SVGRenderer.MonanimalTraits({
            body: 0,
            eyes: 1,
            mouth: 2,
            accessory: 0,
            background: 1
        });
        
        vm.startPrank(user1);
        monanimal.mintMonanimal{value: 0.01 ether}(traits, "Test Monanimal");
        vm.stopPrank();
        
        assertEq(monanimal.totalSupply(), 1);
        assertEq(monanimal.ownerOf(1), user1);
        assertEq(monanimal.totalMinted(), 1);
        assertEq(monanimal.addressMintCount(user1), 1);
        
        // Check stored data
        (
            SVGRenderer.MonanimalTraits memory storedTraits,
            SVGRenderer.EvolutionData memory evolution,
            string memory name,
            uint256 currentLevel
        ) = monanimal.getTokenData(1);
        
        assertEq(storedTraits.body, 0);
        assertEq(storedTraits.eyes, 1);
        assertEq(storedTraits.mouth, 2);
        assertEq(name, "Test Monanimal");
        assertEq(currentLevel, 0); // Newborn
        assertEq(evolution.birthTime, block.timestamp);
    }
    
    function testRandomMinting() public {
        vm.startPrank(user1);
        monanimal.mintRandomMonanimal{value: 0.005 ether}("Random Monanimal");
        vm.stopPrank();
        
        assertEq(monanimal.totalSupply(), 1);
        assertEq(monanimal.ownerOf(1), user1);
        
        // Check that traits were generated
        (
            SVGRenderer.MonanimalTraits memory traits,
            ,
            string memory name,
        ) = monanimal.getTokenData(1);
        
        assertTrue(traits.body < 5);
        assertTrue(traits.eyes < 5);
        assertTrue(traits.mouth < 5);
        assertTrue(traits.accessory < 5);
        assertTrue(traits.background < 5);
        assertEq(name, "Random Monanimal");
    }
    
    function testMintingLimits() public {
        SVGRenderer.MonanimalTraits memory traits = SVGRenderer.MonanimalTraits({
            body: 0, eyes: 0, mouth: 0, accessory: 0, background: 0
        });
        
        vm.startPrank(user1);
        
        // Mint maximum allowed per address
        for (uint256 i = 0; i < 5; i++) {
            monanimal.mintMonanimal{value: 0.01 ether}(traits, "Test");
        }
        
        // Should revert on 6th mint
        vm.expectRevert(Monanimal.MaxMintPerAddressExceeded.selector);
        monanimal.mintMonanimal{value: 0.01 ether}(traits, "Test");
        
        vm.stopPrank();
        
        assertEq(monanimal.addressMintCount(user1), 5);
        assertEq(monanimal.remainingMints(user1), 0);
        assertFalse(monanimal.canMint(user1));
    }
    
    function testInsufficientPayment() public {
        SVGRenderer.MonanimalTraits memory traits = SVGRenderer.MonanimalTraits({
            body: 0, eyes: 0, mouth: 0, accessory: 0, background: 0
        });
        
        vm.startPrank(user1);
        
        // Should revert with insufficient payment
        vm.expectRevert(Monanimal.InsufficientPayment.selector);
        monanimal.mintMonanimal{value: 0.005 ether}(traits, "Test");
        
        // Should also revert for random mint with insufficient payment
        vm.expectRevert(Monanimal.InsufficientPayment.selector);
        monanimal.mintRandomMonanimal{value: 0.002 ether}("Test");
        
        vm.stopPrank();
    }
    
    function testInvalidTraits() public {
        SVGRenderer.MonanimalTraits memory traits = SVGRenderer.MonanimalTraits({
            body: 5, // Invalid - should be 0-4
            eyes: 0,
            mouth: 0,
            accessory: 0,
            background: 0
        });
        
        vm.startPrank(user1);
        vm.expectRevert(Monanimal.InvalidTraitValues.selector);
        monanimal.mintMonanimal{value: 0.01 ether}(traits, "Test");
        vm.stopPrank();
    }
    
    function testInvalidNames() public {
        SVGRenderer.MonanimalTraits memory traits = SVGRenderer.MonanimalTraits({
            body: 0, eyes: 0, mouth: 0, accessory: 0, background: 0
        });
        
        vm.startPrank(user1);
        
        // Empty name should revert
        vm.expectRevert(Monanimal.EmptyName.selector);
        monanimal.mintMonanimal{value: 0.01 ether}(traits, "");
        
        // Too long name should revert
        vm.expectRevert(Monanimal.NameTooLong.selector);
        monanimal.mintMonanimal{value: 0.01 ether}(traits, "This name is way too long and exceeds the 32 character limit");
        
        vm.stopPrank();
    }
    
    function testEvolutionMechanics() public {
        SVGRenderer.MonanimalTraits memory traits = SVGRenderer.MonanimalTraits({
            body: 0, eyes: 0, mouth: 0, accessory: 0, background: 0
        });
        
        vm.startPrank(user1);
        monanimal.mintMonanimal{value: 0.01 ether}(traits, "Test");
        vm.stopPrank();
        
        // Initially should be level 0 (newborn)
        assertEq(monanimal.getEvolutionLevel(1), 0);
        
        // Fast forward 2 days
        vm.warp(block.timestamp + 2 days);
        assertEq(monanimal.getEvolutionLevel(1), 1); // Young
        
        // Fast forward 10 days total
        vm.warp(block.timestamp + 8 days);
        assertEq(monanimal.getEvolutionLevel(1), 2); // Mature
        
        // Fast forward 35 days total
        vm.warp(block.timestamp + 25 days);
        assertEq(monanimal.getEvolutionLevel(1), 3); // Ancient
    }
    
    function testUpdateEvolution() public {
        SVGRenderer.MonanimalTraits memory traits = SVGRenderer.MonanimalTraits({
            body: 0, eyes: 0, mouth: 0, accessory: 0, background: 0
        });
        
        vm.startPrank(user1);
        monanimal.mintMonanimal{value: 0.01 ether}(traits, "Test");
        
        // Fast forward time
        vm.warp(block.timestamp + 10 days);
        
        // Update evolution manually
        vm.expectEmit(true, false, false, true);
        emit Monanimal.MonanimalEvolved(1, 0, 2);
        monanimal.updateEvolution(1);
        
        vm.stopPrank();
    }
    
    function testNameChanging() public {
        SVGRenderer.MonanimalTraits memory traits = SVGRenderer.MonanimalTraits({
            body: 0, eyes: 0, mouth: 0, accessory: 0, background: 0
        });
        
        vm.startPrank(user1);
        monanimal.mintMonanimal{value: 0.01 ether}(traits, "Original Name");
        
        // Change name
        vm.expectEmit(true, false, false, true);
        emit Monanimal.NameChanged(1, "New Name");
        monanimal.changeName(1, "New Name");
        
        // Verify name changed
        (, , string memory name, ) = monanimal.getTokenData(1);
        assertEq(name, "New Name");
        
        vm.stopPrank();
        
        // Non-owner shouldn't be able to change name
        vm.startPrank(user2);
        vm.expectRevert(Monanimal.NotTokenOwner.selector);
        monanimal.changeName(1, "Hacker Name");
        vm.stopPrank();
    }
    
    function testTokenURI() public {
        SVGRenderer.MonanimalTraits memory traits = SVGRenderer.MonanimalTraits({
            body: 0, eyes: 1, mouth: 2, accessory: 0, background: 1
        });
        
        vm.startPrank(user1);
        monanimal.mintMonanimal{value: 0.01 ether}(traits, "Test Monanimal");
        vm.stopPrank();
        
        string memory tokenURI = monanimal.tokenURI(1);
        
        // Should start with data:application/json;base64,
        assertTrue(bytes(tokenURI).length > 30);
        assertEq(bytes(tokenURI)[0], 0x64); // 'd' from "data:"
    }
    
    function testGetTokenSVG() public {
        SVGRenderer.MonanimalTraits memory traits = SVGRenderer.MonanimalTraits({
            body: 0, eyes: 1, mouth: 2, accessory: 0, background: 1
        });
        
        vm.startPrank(user1);
        monanimal.mintMonanimal{value: 0.01 ether}(traits, "Test");
        vm.stopPrank();
        
        string memory svg = monanimal.getTokenSVG(1);
        assertTrue(bytes(svg).length > 0);
        assertEq(bytes(svg)[0], 0x3C); // '<' character
    }
    
    function testTokensOfOwner() public {
        SVGRenderer.MonanimalTraits memory traits = SVGRenderer.MonanimalTraits({
            body: 0, eyes: 0, mouth: 0, accessory: 0, background: 0
        });
        
        vm.startPrank(user1);
        
        // Mint 3 tokens
        for (uint256 i = 0; i < 3; i++) {
            monanimal.mintMonanimal{value: 0.01 ether}(traits, "Test");
        }
        
        vm.stopPrank();
        
        uint256[] memory tokens = monanimal.tokensOfOwner(user1);
        assertEq(tokens.length, 3);
        assertEq(tokens[0], 1);
        assertEq(tokens[1], 2);
        assertEq(tokens[2], 3);
    }
    
    function testOwnerFunctions() public {
        // Test price setting
        vm.startPrank(owner);
        monanimal.setMintPrice(0.02 ether);
        assertEq(monanimal.mintPrice(), 0.02 ether);
        
        // Test pausing
        monanimal.setPaused(true);
        vm.stopPrank();
        
        // Should revert when paused
        SVGRenderer.MonanimalTraits memory traits = SVGRenderer.MonanimalTraits({
            body: 0, eyes: 0, mouth: 0, accessory: 0, background: 0
        });
        
        vm.startPrank(user1);
        vm.expectRevert("Pausable: paused");
        monanimal.mintMonanimal{value: 0.02 ether}(traits, "Test");
        vm.stopPrank();
        
        // Unpause
        vm.startPrank(owner);
        monanimal.setPaused(false);
        vm.stopPrank();
        
        // Should work now
        vm.startPrank(user1);
        monanimal.mintMonanimal{value: 0.02 ether}(traits, "Test");
        vm.stopPrank();
        
        assertEq(monanimal.totalSupply(), 1);
    }
    
    function testEmergencyMint() public {
        SVGRenderer.MonanimalTraits memory traits = SVGRenderer.MonanimalTraits({
            body: 1, eyes: 2, mouth: 3, accessory: 1, background: 2
        });
        
        vm.startPrank(owner);
        monanimal.emergencyMint(user1, traits, "Emergency Mint");
        vm.stopPrank();
        
        assertEq(monanimal.ownerOf(1), user1);
        assertEq(monanimal.totalSupply(), 1);
        
        (, , string memory name, ) = monanimal.getTokenData(1);
        assertEq(name, "Emergency Mint");
    }
    
    function testWithdraw() public {
        SVGRenderer.MonanimalTraits memory traits = SVGRenderer.MonanimalTraits({
            body: 0, eyes: 0, mouth: 0, accessory: 0, background: 0
        });
        
        // Mint some tokens to generate revenue
        vm.startPrank(user1);
        monanimal.mintMonanimal{value: 0.01 ether}(traits, "Test 1");
        monanimal.mintMonanimal{value: 0.01 ether}(traits, "Test 2");
        vm.stopPrank();
        
        uint256 contractBalance = address(monanimal).balance;
        assertEq(contractBalance, 0.02 ether);
        
        uint256 ownerBalanceBefore = owner.balance;
        
        vm.startPrank(owner);
        monanimal.withdraw();
        vm.stopPrank();
        
        assertEq(address(monanimal).balance, 0);
        assertEq(owner.balance, ownerBalanceBefore + 0.02 ether);
    }
    
    function testNonExistentToken() public {
        vm.expectRevert(Monanimal.TokenDoesNotExist.selector);
        monanimal.tokenURI(999);
        
        vm.expectRevert(Monanimal.TokenDoesNotExist.selector);
        monanimal.getTokenSVG(999);
        
        vm.expectRevert(Monanimal.TokenDoesNotExist.selector);
        monanimal.getEvolutionLevel(999);
    }
    
    function testUnauthorizedAccess() public {
        // Non-owner trying to set price
        vm.startPrank(user1);
        vm.expectRevert();
        monanimal.setMintPrice(0.5 ether);
        
        // Non-owner trying to pause
        vm.expectRevert();
        monanimal.setPaused(true);
        
        // Non-owner trying emergency mint
        SVGRenderer.MonanimalTraits memory traits = SVGRenderer.MonanimalTraits({
            body: 0, eyes: 0, mouth: 0, accessory: 0, background: 0
        });
        vm.expectRevert();
        monanimal.emergencyMint(user1, traits, "Unauthorized");
        
        vm.stopPrank();
    }
} 