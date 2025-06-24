// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/SVGRenderer.sol";
import "../src/Monanimal.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy SVGRenderer first
        SVGRenderer renderer = new SVGRenderer();
        console.log("SVGRenderer deployed at:", address(renderer));
        
        // Deploy main Monanimal contract
        Monanimal monanimal = new Monanimal(address(renderer));
        console.log("Monanimal deployed at:", address(monanimal));
        
        vm.stopBroadcast();
    }
} 