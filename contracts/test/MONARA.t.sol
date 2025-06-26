// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MONARA.sol";

contract MONARATest is Test {
    MONARA public monara;
    address public owner = makeAddr("owner");
    address public user1 = makeAddr("user1");
    address public user2 = makeAddr("user2");
    
    uint256 constant NEURAL_GENESIS_PRICE = 0.1 ether;
    uint256 constant QUANTUM_GENESIS_PRICE = 0.25 ether;

    function setUp() public {
        vm.prank(owner);
        monara = new MONARA("MONARA", "MNRA", owner);
    }

    /*//////////////////////////////////////////////////////////////
                            MINTING TESTS
    //////////////////////////////////////////////////////////////*/

    function testNeuralGenesis() public {
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        
        monara.neuralGenesis{value: NEURAL_GENESIS_PRICE}();
        
        assertEq(monara.ownerOf(1), user1);
        assertEq(monara.balanceOf(user1), 1);
        assertEq(monara.totalSupply(), 1);
        assertEq(monara.currentTokenId(), 2);
    }

    function testQuantumGenesis() public {
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        
        monara.quantumGenesis{value: QUANTUM_GENESIS_PRICE}();
        
        assertEq(monara.ownerOf(1), user1);
        assertEq(monara.balanceOf(user1), 1);
        assertEq(monara.totalSupply(), 1);
        
        // Check if quantum genesis is recorded
        (,,,,,,, uint32 birthTimestamp, bool isQuantumGenesis) = monara.digitalBeings(1);
        assertTrue(isQuantumGenesis);
        assertGt(birthTimestamp, 0);
    }

    function testMintFailsWithInsufficientPayment() public {
        vm.deal(user1, 0.05 ether);
        vm.prank(user1);
        
        vm.expectRevert(MONARA.InsufficientPayment.selector);
        monara.neuralGenesis{value: 0.05 ether}();
    }

    function testMintFailsWhenInactive() public {
        vm.prank(owner);
        monara.setMintingActive(false);
        
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        
        vm.expectRevert(MONARA.MintingNotActive.selector);
        monara.neuralGenesis{value: NEURAL_GENESIS_PRICE}();
    }

    function testMultipleMints() public {
        vm.deal(user1, 2 ether);
        vm.deal(user2, 2 ether);
        
        // User1 mints neural genesis
        vm.prank(user1);
        monara.neuralGenesis{value: NEURAL_GENESIS_PRICE}();
        
        // User2 mints quantum genesis
        vm.prank(user2);
        monara.quantumGenesis{value: QUANTUM_GENESIS_PRICE}();
        
        assertEq(monara.totalSupply(), 2);
        assertEq(monara.ownerOf(1), user1);
        assertEq(monara.ownerOf(2), user2);
    }

    /*//////////////////////////////////////////////////////////////
                           EVOLUTION TESTS
    //////////////////////////////////////////////////////////////*/

    function testEvolutionStages() public {
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        monara.neuralGenesis{value: NEURAL_GENESIS_PRICE}();
        
        // Initially stage 1
        assertEq(monara.getEvolutionStage(1), 1);
        
        // Skip to stage 2 time
        vm.warp(block.timestamp + 1 weeks);
        assertEq(monara.getEvolutionStage(1), 2);
        
        // Skip to stage 3 time
        vm.warp(block.timestamp + 3 weeks);
        assertEq(monara.getEvolutionStage(1), 3);
        
        // Skip to stage 4 time
        vm.warp(block.timestamp + 8 weeks);
        assertEq(monara.getEvolutionStage(1), 4);
    }

    function testCheckEvolution() public {
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        monara.neuralGenesis{value: NEURAL_GENESIS_PRICE}();
        
        vm.expectEmit(true, false, false, true);
        emit MONARA.EvolutionStageReached(1, 1);
        
        monara.checkEvolution(1);
    }

    function testEvolutionWithNonexistentToken() public {
        vm.expectRevert(MONARA.TokenDoesNotExist.selector);
        monara.getEvolutionStage(999);
    }

    /*//////////////////////////////////////////////////////////////
                            METADATA TESTS
    //////////////////////////////////////////////////////////////*/

    function testGenerateSVG() public {
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        monara.neuralGenesis{value: NEURAL_GENESIS_PRICE}();
        
        string memory svg = monara.generateSVG(1);
        assertTrue(bytes(svg).length > 0);
        
        // Check if SVG contains expected elements
        assertTrue(_contains(svg, "<svg"));
        assertTrue(_contains(svg, "</svg>"));
    }

    function testGenerateMetadata() public {
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        monara.neuralGenesis{value: NEURAL_GENESIS_PRICE}();
        
        string memory metadata = monara.generateMetadata(1);
        assertTrue(bytes(metadata).length > 0);
        
        // Check if metadata contains expected fields
        assertTrue(_contains(metadata, "MONARA #1"));
        assertTrue(_contains(metadata, "attributes"));
        assertTrue(_contains(metadata, "image"));
    }

    function testTokenURI() public {
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        monara.neuralGenesis{value: NEURAL_GENESIS_PRICE}();
        
        string memory tokenURI = monara.tokenURI(1);
        assertTrue(bytes(tokenURI).length > 0);
        assertTrue(_contains(tokenURI, "data:application/json;base64,"));
    }

    /*//////////////////////////////////////////////////////////////
                            ADMIN TESTS
    //////////////////////////////////////////////////////////////*/

    function testAdminMint() public {
        vm.prank(owner);
        monara.adminMint(user1, 5);
        
        assertEq(monara.balanceOf(user1), 5);
        assertEq(monara.totalSupply(), 5);
        assertEq(monara.currentTokenId(), 6);
    }

    function testAdminMintFailsFromNonOwner() public {
        vm.prank(user1);
        vm.expectRevert("Ownable: caller is not the owner");
        monara.adminMint(user1, 1);
    }

    function testSetMintingActive() public {
        vm.prank(owner);
        monara.setMintingActive(false);
        
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        vm.expectRevert(MONARA.MintingNotActive.selector);
        monara.neuralGenesis{value: NEURAL_GENESIS_PRICE}();
        
        vm.prank(owner);
        monara.setMintingActive(true);
        
        vm.prank(user1);
        monara.neuralGenesis{value: NEURAL_GENESIS_PRICE}();
        assertEq(monara.totalSupply(), 1);
    }

    function testWithdraw() public {
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        monara.neuralGenesis{value: NEURAL_GENESIS_PRICE}();
        
        uint256 contractBalance = address(monara).balance;
        uint256 ownerBalanceBefore = owner.balance;
        
        vm.prank(owner);
        monara.withdraw();
        
        assertEq(address(monara).balance, 0);
        assertEq(owner.balance, ownerBalanceBefore + contractBalance);
    }

    /*//////////////////////////////////////////////////////////////
                            FUZZING TESTS
    //////////////////////////////////////////////////////////////*/

    function testFuzzMintPrices(uint256 payment) public {
        vm.assume(payment <= type(uint128).max);
        vm.deal(user1, payment);
        
        vm.prank(user1);
        
        if (payment >= NEURAL_GENESIS_PRICE) {
            monara.neuralGenesis{value: payment}();
            assertEq(monara.ownerOf(1), user1);
        } else {
            vm.expectRevert(MONARA.InsufficientPayment.selector);
            monara.neuralGenesis{value: payment}();
        }
    }

    function testFuzzQuantumMintPrices(uint256 payment) public {
        vm.assume(payment <= type(uint128).max);
        vm.deal(user1, payment);
        
        vm.prank(user1);
        
        if (payment >= QUANTUM_GENESIS_PRICE) {
            monara.quantumGenesis{value: payment}();
            assertEq(monara.ownerOf(1), user1);
        } else {
            vm.expectRevert(MONARA.InsufficientPayment.selector);
            monara.quantumGenesis{value: payment}();
        }
    }

    function testFuzzEvolutionStages(uint256 timeOffset) public {
        vm.assume(timeOffset <= 365 days);
        
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        monara.neuralGenesis{value: NEURAL_GENESIS_PRICE}();
        
        vm.warp(block.timestamp + timeOffset);
        
        uint8 stage = monara.getEvolutionStage(1);
        assertTrue(stage >= 1 && stage <= 4);
        
        if (timeOffset >= 12 weeks) {
            assertEq(stage, 4);
        } else if (timeOffset >= 4 weeks) {
            assertEq(stage, 3);
        } else if (timeOffset >= 1 weeks) {
            assertEq(stage, 2);
        } else {
            assertEq(stage, 1);
        }
    }

    /*//////////////////////////////////////////////////////////////
                           HELPER FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function _contains(string memory haystack, string memory needle) private pure returns (bool) {
        bytes memory haystackBytes = bytes(haystack);
        bytes memory needleBytes = bytes(needle);
        
        if (needleBytes.length > haystackBytes.length) {
            return false;
        }
        
        for (uint256 i = 0; i <= haystackBytes.length - needleBytes.length; i++) {
            bool found = true;
            for (uint256 j = 0; j < needleBytes.length; j++) {
                if (haystackBytes[i + j] != needleBytes[j]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                return true;
            }
        }
        
        return false;
    }
} 