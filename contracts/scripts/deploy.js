require("dotenv").config();
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 MONARA NFT Deployment Script v2.0");
  console.log("==========================================");

  // Configuration
  const NETWORK_NAME = hre.network.name;
  const EXPECTED_CHAIN_ID = 10143; // Monad Testnet
  
  // Get deployer
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  
  console.log(`📡 Network: ${NETWORK_NAME}`);
  console.log(`🔗 Chain ID: ${await deployer.provider.getNetwork().then(n => n.chainId)}`);
  console.log(`👤 Deployer: ${deployerAddress}`);
  console.log(`💰 Balance: ${ethers.formatEther(await deployer.provider.getBalance(deployerAddress))} MON`);
  
  // Verify network
  const chainId = await deployer.provider.getNetwork().then(n => Number(n.chainId));
  if (chainId !== EXPECTED_CHAIN_ID) {
    console.warn(`⚠️  Warning: Expected Chain ID ${EXPECTED_CHAIN_ID}, got ${chainId}`);
  }
  
  // Check balance
  const balance = await deployer.provider.getBalance(deployerAddress);
  const minBalance = ethers.parseEther("0.1");
  if (balance < minBalance) {
    throw new Error(`❌ Insufficient balance. Need at least 0.1 MON, got ${ethers.formatEther(balance)} MON`);
  }

  console.log("\n🔧 Deployment Configuration:");
  console.log("------------------------------");
  
  // Contract parameters
  const name = "MONARA";
  const symbol = "MNR";
  const initialOwner = deployerAddress;
  
  console.log(`📝 Name: ${name}`);
  console.log(`🔤 Symbol: ${symbol}`);
  console.log(`👑 Owner: ${initialOwner}`);

  // Deploy libraries first
  console.log("\n📚 Deploying Libraries...");
  console.log("==========================");

  // Deploy DataTypes library
  console.log("Deploying DataTypes library...");
  const DataTypes = await ethers.getContractFactory("DataTypes");
  const dataTypes = await DataTypes.deploy();
  await dataTypes.waitForDeployment();
  const dataTypesAddress = await dataTypes.getAddress();
  console.log(`✅ DataTypes deployed: ${dataTypesAddress}`);

  // Deploy ColorLib
  console.log("Deploying ColorLib library...");
  const ColorLib = await ethers.getContractFactory("ColorLib");
  const colorLib = await ColorLib.deploy();
  await colorLib.waitForDeployment();
  const colorLibAddress = await colorLib.getAddress();
  console.log(`✅ ColorLib deployed: ${colorLibAddress}`);

  // Deploy GeometryLib
  console.log("Deploying GeometryLib library...");
  const GeometryLib = await ethers.getContractFactory("GeometryLib");
  const geometryLib = await GeometryLib.deploy();
  await geometryLib.waitForDeployment();
  const geometryLibAddress = await geometryLib.getAddress();
  console.log(`✅ GeometryLib deployed: ${geometryLibAddress}`);

  // Deploy PathwayLib
  console.log("Deploying PathwayLib library...");
  const PathwayLib = await ethers.getContractFactory("PathwayLib");
  const pathwayLib = await PathwayLib.deploy();
  await pathwayLib.waitForDeployment();
  const pathwayLibAddress = await pathwayLib.getAddress();
  console.log(`✅ PathwayLib deployed: ${pathwayLibAddress}`);

  // Deploy NeuralRenderer with library links
  console.log("Deploying NeuralRenderer library...");
      const NeuralRenderer = await ethers.getContractFactory("NeuralRenderer", {
      libraries: {
        GeometryLib: geometryLibAddress,
        PathwayLib: pathwayLibAddress,
      },
    });
  const neuralRenderer = await NeuralRenderer.deploy();
  await neuralRenderer.waitForDeployment();
  const neuralRendererAddress = await neuralRenderer.getAddress();
  console.log(`✅ NeuralRenderer deployed: ${neuralRendererAddress}`);

  console.log("\n🎯 Deploying Main Contract...");
  console.log("==============================");

  // Deploy main MONARA contract
  const MONARA = await ethers.getContractFactory("MONARA", {
    libraries: {
      NeuralRenderer: neuralRendererAddress,
    },
  });

  console.log("⏳ Deploying MONARA contract...");
  const startTime = Date.now();
  
  const monara = await MONARA.deploy(name, symbol, initialOwner);
  await monara.waitForDeployment();
  
  const deployTime = Date.now() - startTime;
  const contractAddress = await monara.getAddress();

  console.log(`✅ MONARA deployed in ${deployTime}ms`);
  console.log(`📍 Contract address: ${contractAddress}`);

  // Get deployment transaction
  const deployTx = monara.deploymentTransaction();
  if (deployTx) {
    console.log(`🔗 Deploy tx hash: ${deployTx.hash}`);
    console.log(`⛽ Gas used: ${deployTx.gasLimit.toString()}`);
    console.log(`💰 Gas price: ${ethers.formatUnits(deployTx.gasPrice || 0, "gwei")} gwei`);
  }

  console.log("\n🔐 Security Setup...");
  console.log("====================");

  // Wait for contract to be mined
  await new Promise(resolve => setTimeout(resolve, 5000));

  try {
    // Verify initial security settings
    const mintingActive = await monara.mintingActive();
    const currentSupply = await monara.currentTokenId();
    const maxSupply = await monara.MAX_SUPPLY();
    
    console.log(`🏭 Minting active: ${mintingActive}`);
    console.log(`📊 Current supply: ${currentSupply.toString()}`);
    console.log(`📈 Max supply: ${maxSupply.toString()}`);
    
    // Check role setup
    const DEFAULT_ADMIN_ROLE = await monara.DEFAULT_ADMIN_ROLE();
    const hasAdminRole = await monara.hasRole(DEFAULT_ADMIN_ROLE, deployerAddress);
    console.log(`👑 Admin role set: ${hasAdminRole}`);
    
  } catch (error) {
    console.log(`⚠️  Could not verify security settings: ${error.message}`);
  }

  console.log("\n📋 Deployment Summary");
  console.log("=====================");
  console.log(`✅ Network: ${NETWORK_NAME} (Chain ID: ${chainId})`);
  console.log(`✅ DataTypes: ${dataTypesAddress}`);
  console.log(`✅ ColorLib: ${colorLibAddress}`);
  console.log(`✅ GeometryLib: ${geometryLibAddress}`);
  console.log(`✅ PathwayLib: ${pathwayLibAddress}`);
  console.log(`✅ NeuralRenderer: ${neuralRendererAddress}`);
  console.log(`✅ MONARA: ${contractAddress}`);
  console.log(`✅ Owner: ${initialOwner}`);

  console.log("\n🔗 Contract Interaction Examples:");
  console.log("=================================");
  console.log(`Neural Genesis (0.1 MON): await contract.neuralGenesis({value: ethers.parseEther("0.1")})`);
  console.log(`Quantum Genesis (0.25 MON): await contract.quantumGenesis({value: ethers.parseEther("0.25")})`);
  console.log(`Get Token SVG: await contract.generateSVG(tokenId)`);
  console.log(`Get Evolution Stage: await contract.getEvolutionStage(tokenId)`);

  console.log("\n🛡️  Security Features Enabled:");
  console.log("==============================");
  console.log("✅ Rate limiting (10 mints per hour)");
  console.log("✅ Pausable functionality");
  console.log("✅ Role-based access control");
  console.log("✅ Emergency withdrawal with delay");
  console.log("✅ Reentrancy protection");
  console.log("✅ Input validation");

  console.log("\n⚠️  Next Steps:");
  console.log("===============");
  console.log("1. Update frontend environment variables:");
  console.log(`   NEXT_PUBLIC_MONARA_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("2. Verify contract on explorer if available");
  console.log("3. Test minting functions");
  console.log("4. Set up monitoring for security events");
  console.log("5. Configure multisig for admin functions (recommended)");

  // Save deployment info
  const deploymentInfo = {
    network: NETWORK_NAME,
    chainId: chainId,
    timestamp: new Date().toISOString(),
    deployer: deployerAddress,
    contracts: {
      DataTypes: dataTypesAddress,
      ColorLib: colorLibAddress,
      GeometryLib: geometryLibAddress,
      PathwayLib: pathwayLibAddress,
      NeuralRenderer: neuralRendererAddress,
      MONARA: contractAddress,
    },
    configuration: {
      name,
      symbol,
      initialOwner,
      neuralPrice: "0.1",
      quantumPrice: "0.25",
      maxSupply: 10000,
    }
  };

  // Write to file
  const fs = require('fs');
  const path = require('path');
  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const filename = `deployment-${NETWORK_NAME}-${Date.now()}.json`;
  fs.writeFileSync(
    path.join(deploymentsDir, filename),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log(`\n💾 Deployment info saved to: deployments/${filename}`);
  console.log("\n🎉 Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  }); 