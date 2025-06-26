const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MONARA Deployment Test", function () {
  let monara;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    // Deploy libraries first
    console.log("Deploying libraries...");
    
    const GeometryLib = await ethers.getContractFactory("GeometryLib");
    const geometryLib = await GeometryLib.deploy();
    await geometryLib.waitForDeployment();

    const PathwayLib = await ethers.getContractFactory("PathwayLib");
    const pathwayLib = await PathwayLib.deploy();
    await pathwayLib.waitForDeployment();

    const NeuralRenderer = await ethers.getContractFactory("NeuralRenderer", {
      libraries: {
        GeometryLib: await geometryLib.getAddress(),
        PathwayLib: await pathwayLib.getAddress(),
      },
    });
    const neuralRenderer = await NeuralRenderer.deploy();
    await neuralRenderer.waitForDeployment();

    console.log("Libraries deployed successfully");

    // Deploy main contract
    const MONARA = await ethers.getContractFactory("MONARA", {
      libraries: {
        NeuralRenderer: await neuralRenderer.getAddress(),
      },
    });

    monara = await MONARA.deploy("MONARA", "MNR", owner.address);
    await monara.waitForDeployment();
    
    console.log("MONARA deployed successfully");
  });

  describe("Basic Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await monara.getAddress()).to.not.be.undefined;
    });

    it("Should set the right owner", async function () {
      expect(await monara.owner()).to.equal(owner.address);
    });

    it("Should set the correct name and symbol", async function () {
      expect(await monara.name()).to.equal("MONARA");
      expect(await monara.symbol()).to.equal("MNR");
    });

    it("Should have correct initial values", async function () {
      expect(await monara.currentTokenId()).to.equal(1);
      expect(await monara.mintingActive()).to.equal(true);
      expect(await monara.MAX_SUPPLY()).to.equal(10000);
    });

    it("Should have correct mint prices", async function () {
      expect(await monara.NEURAL_GENESIS_PRICE()).to.equal(ethers.parseEther("0.1"));
      expect(await monara.QUANTUM_GENESIS_PRICE()).to.equal(ethers.parseEther("0.25"));
    });

    it("Should have security features enabled", async function () {
      expect(await monara.MAX_MINTS_PER_WINDOW()).to.equal(10);
      expect(await monara.RATE_LIMIT_WINDOW()).to.equal(3600); // 1 hour
    });
  });

  describe("Security Features", function () {
    it("Should be pausable by admin", async function () {
      await monara.pause();
      expect(await monara.paused()).to.equal(true);
      
      await monara.unpause();
      expect(await monara.paused()).to.equal(false);
    });

    it("Should have emergency withdraw functionality", async function () {
      expect(await monara.emergencyWithdrawAddress()).to.equal(owner.address);
      expect(await monara.emergencyWithdrawDelay()).to.equal(7 * 24 * 3600); // 7 days
    });
  });

  describe("Basic Contract Interaction", function () {
    it("Should allow checking rate limit info", async function () {
      const [remaining, windowStart, lastMint, canMint] = await monara.getRateLimitInfo(owner.address);
      expect(remaining).to.equal(10); // Initial value
      expect(canMint).to.equal(true);
    });
  });
});

// Helper for testing any value
const anyValue = {
  asymmetricMatch: () => true,
  jasmineToString: () => "<Any Value>"
}; 