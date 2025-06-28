require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Environment variables with fallbacks - using hardhat test key for development
const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Hardhat account #0
const MONAD_RPC_URL = process.env.MONAD_TESTNET_RPC_URL || "https://testnet-rpc.monad.xyz";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true, // Enable via IR for better optimization
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    monadTestnet: {
      url: MONAD_RPC_URL,
      chainId: 10143, // Monad Testnet
      accounts: [PRIVATE_KEY],
      gas: 20000000, // 20M gas limit
      gasPrice: 50000000000, // 50 gwei (higher for Monad)
      timeout: 60000, // 60 seconds
      // Monad specific settings
      blockGasLimit: 30000000, // 30M block gas limit
      allowUnlimitedContractSize: false,
    },
    monadMainnet: {
      url: process.env.MONAD_MAINNET_RPC_URL || "https://mainnet-rpc.monad.xyz",
      accounts: [PRIVATE_KEY],
      chainId: 1, // Henüz belirlenmemiş, placeholder
      gasPrice: "auto",
      gas: "auto",
      blockGasLimit: 150000000,
    },
  },
  etherscan: {
    apiKey: {
      monadTestnet: process.env.MONAD_API_KEY || "dummy",
      monadMainnet: process.env.MONAD_API_KEY || "dummy",
    },
    customChains: [
      {
        network: "monadTestnet",
        chainId: 10143,
        urls: {
          apiURL: "https://testnet.monadexplorer.com/api",
          browserURL: "https://testnet.monadexplorer.com"
        }
      },
      {
        network: "monadMainnet", 
        chainId: 1, // Henüz belirlenmemiş
        urls: {
          apiURL: "https://explorer.monad.xyz/api",
          browserURL: "https://explorer.monad.xyz"
        }
      }
    ]
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    gasPrice: 1, // 1 gwei
    showTimeSpent: true,
    showMethodSig: true,
  },
  mocha: {
    timeout: 60000, // 60 seconds for tests
  },
  paths: {
    sources: "./src",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
}; 