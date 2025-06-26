// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MONARA.sol";

contract DeployMONARA is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy MONARA contract
        MONARA monara = new MONARA(
            "MONARA",           // name
            "MNRA",             // symbol  
            deployer            // initial owner
        );

        console.log("MONARA deployed to:", address(monara));
        console.log("Owner:", monara.owner());
        console.log("Max Supply:", monara.MAX_SUPPLY());
        console.log("Neural Genesis Price:", monara.NEURAL_GENESIS_PRICE());
        console.log("Quantum Genesis Price:", monara.QUANTUM_GENESIS_PRICE());

        vm.stopBroadcast();
    }
} 