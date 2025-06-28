// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./libraries/NeuralRenderer.sol";
import "./libraries/GeometryLib.sol";
import "./libraries/ColorLib.sol";
import "./libraries/Base64.sol";

/**
 * @title MONARA - Evolving Digital Beings on Monad Network
 * @dev Neural Network NFTs that evolve over time with on-chain SVG generation
 * @author MONARA Team
 * @notice Secure implementation with rate limiting, pausable functionality, and access control
 */
contract MONARA is ERC721, ERC721Enumerable, Ownable, ReentrancyGuard, Pausable, AccessControl {
    using Strings for uint256;

    /*//////////////////////////////////////////////////////////////
                                ROLES
    //////////////////////////////////////////////////////////////*/

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /*//////////////////////////////////////////////////////////////
                                STRUCTS
    //////////////////////////////////////////////////////////////*/

    /**
     * @dev Structure representing a Digital Being's neural network configuration
     */
    struct DigitalBeing {
        uint8 coreGeometry;      // 0-7: Circle, Diamond, Hexagon, Octagon, Star, Triangle, Pentagon, Cross
        uint8 pathwayPattern;    // 0-4: Linear, Curved, Spiral, Fractal, Wave
        uint8 particleSystem;    // 0-5: Dots, Squares, Triangles, Diamonds, Stars, Hexagons
        uint8 networkDensity;    // 0-3: Sparse, Medium, Dense, Ultra-Dense
        uint8 processingAura;    // 0-6: Pulse, Shimmer, Wave, Static, Burst, Gradient, None
        uint8 environment;       // 0-4: Void, Matrix, Cloud, Quantum, Cyber
        uint8 mutation;          // 0-255: Special mutations (0 = no mutation)
        uint32 birthTimestamp;   // Birth time for evolution calculation
        bool isQuantumGenesis;   // Enhanced generation with mutation probability
    }

    /*//////////////////////////////////////////////////////////////
                                CONSTANTS
    //////////////////////////////////////////////////////////////*/

    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant NEURAL_GENESIS_PRICE = 0.1 ether; // 0.1 MON
    uint256 public constant QUANTUM_GENESIS_PRICE = 0.25 ether; // 0.25 MON
    
    // Evolution stages in seconds
    uint256 public constant STAGE_2_TIME = 1 weeks;
    uint256 public constant STAGE_3_TIME = 4 weeks;
    uint256 public constant STAGE_4_TIME = 12 weeks;

    // Mutation probabilities (out of 10000)
    uint256 public constant NEURAL_MUTATION_CHANCE = 300; // 3%
    uint256 public constant QUANTUM_MUTATION_CHANCE = 800; // 8%

    // Security constants
    uint256 public constant MAX_MINTS_PER_TX = 5;
    uint256 public constant RATE_LIMIT_WINDOW = 1 hours;
    uint256 public constant MAX_MINTS_PER_WINDOW = 10;

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/

    mapping(uint256 => DigitalBeing) public digitalBeings;
    uint256 public currentTokenId;
    bool public mintingActive = true;
    string private _baseTokenURI;

    // Rate limiting
    mapping(address => uint256) public lastMintTime;
    mapping(address => uint256) public mintsInWindow;
    mapping(address => uint256) public windowStartTime;

    // Emergency withdrawal
    address public emergencyWithdrawAddress;
    uint256 public emergencyWithdrawDelay = 7 days;
    uint256 public emergencyWithdrawRequestTime;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event DigitalBeingCreated(
        uint256 indexed tokenId,
        address indexed owner,
        bool isQuantumGenesis,
        uint8 mutation
    );

    event EvolutionStageReached(
        uint256 indexed tokenId,
        uint8 newStage
    );

    event EmergencyWithdrawRequested(address indexed to, uint256 timestamp);
    event EmergencyWithdrawExecuted(address indexed to, uint256 amount);
    event RateLimitHit(address indexed user, uint256 timestamp);

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    error MintingNotActive();
    error MaxSupplyExceeded();
    error InsufficientPayment();
    error WithdrawalFailed();
    error TokenDoesNotExist();
    error RateLimitExceeded();
    error MaxMintsPerTxExceeded();
    error EmergencyWithdrawNotReady();
    error Unauthorized();

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(
        string memory name,
        string memory symbol,
        address initialOwner
    ) ERC721(name, symbol) Ownable(initialOwner) {
        // Start token IDs from 1
        currentTokenId = 1;
        
        // Set up roles
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _grantRole(ADMIN_ROLE, initialOwner);
        _grantRole(MINTER_ROLE, initialOwner);
        _grantRole(PAUSER_ROLE, initialOwner);

        // Set emergency withdraw address
        emergencyWithdrawAddress = initialOwner;
    }

    /*//////////////////////////////////////////////////////////////
                             MODIFIERS
    //////////////////////////////////////////////////////////////*/

    /**
     * @dev Rate limiting modifier
     */
    modifier rateLimited() {
        address user = msg.sender;
        uint256 currentTime = block.timestamp;
        
        // Check if we're in a new window
        if (currentTime > windowStartTime[user] + RATE_LIMIT_WINDOW) {
            windowStartTime[user] = currentTime;
            mintsInWindow[user] = 0;
        }
        
        // Check rate limit
        if (mintsInWindow[user] >= MAX_MINTS_PER_WINDOW) {
            emit RateLimitHit(user, currentTime);
            revert RateLimitExceeded();
        }
        
        mintsInWindow[user]++;
        lastMintTime[user] = currentTime;
        _;
    }

    /*//////////////////////////////////////////////////////////////
                            MINTING FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @dev Mint a Digital Being with Neural Genesis (standard creation)
     */
    function neuralGenesis() external payable nonReentrant whenNotPaused rateLimited {
        if (!mintingActive) revert MintingNotActive();
        if (currentTokenId > MAX_SUPPLY) revert MaxSupplyExceeded();
        if (msg.value < NEURAL_GENESIS_PRICE) revert InsufficientPayment();

        uint256 tokenId = currentTokenId++;
        
        // Generate traits using pseudo-random number
        uint256 seed = _generateSeed(tokenId, false);
        DigitalBeing memory being = _generateBeing(seed, false);
        
        digitalBeings[tokenId] = being;
        _safeMint(msg.sender, tokenId);

        emit DigitalBeingCreated(tokenId, msg.sender, false, being.mutation);
    }

    /**
     * @dev Mint a Digital Being with Quantum Genesis (enhanced mutation probability)
     */
    function quantumGenesis() external payable nonReentrant whenNotPaused rateLimited {
        if (!mintingActive) revert MintingNotActive();
        if (currentTokenId > MAX_SUPPLY) revert MaxSupplyExceeded();
        if (msg.value < QUANTUM_GENESIS_PRICE) revert InsufficientPayment();

        uint256 tokenId = currentTokenId++;
        
        // Generate traits with enhanced mutation chance
        uint256 seed = _generateSeed(tokenId, true);
        DigitalBeing memory being = _generateBeing(seed, true);
        
        digitalBeings[tokenId] = being;
        _safeMint(msg.sender, tokenId);

        emit DigitalBeingCreated(tokenId, msg.sender, true, being.mutation);
    }

    /**
     * @dev Batch mint for admin (emergency/airdrop use)
     */
    function adminMint(address to, uint256 amount) external onlyRole(ADMIN_ROLE) {
        if (amount > MAX_MINTS_PER_TX) revert MaxMintsPerTxExceeded();
        if (currentTokenId + amount > MAX_SUPPLY) revert MaxSupplyExceeded();

        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = currentTokenId++;
            uint256 seed = _generateSeed(tokenId, false);
            DigitalBeing memory being = _generateBeing(seed, false);
            
            digitalBeings[tokenId] = being;
            _safeMint(to, tokenId);

            emit DigitalBeingCreated(tokenId, to, false, being.mutation);
        }
    }

    /*//////////////////////////////////////////////////////////////
                           GENERATION LOGIC
    //////////////////////////////////////////////////////////////*/

    /**
     * @dev Generate a pseudo-random seed for trait generation
     */
    function _generateSeed(uint256 tokenId, bool isQuantum) private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            tokenId,
            isQuantum,
            currentTokenId
        )));
    }

    /**
     * @dev Generate a Digital Being's traits from a seed
     */
    function _generateBeing(uint256 seed, bool isQuantumGenesis) private view returns (DigitalBeing memory) {
        DigitalBeing memory being;
        
        being.coreGeometry = uint8(seed % 8);
        being.pathwayPattern = uint8((seed >> 8) % 5);
        being.particleSystem = uint8((seed >> 16) % 6);
        being.networkDensity = uint8((seed >> 24) % 4);
        being.processingAura = uint8((seed >> 32) % 7);
        being.environment = uint8((seed >> 40) % 5);
        being.birthTimestamp = uint32(block.timestamp);
        being.isQuantumGenesis = isQuantumGenesis;
        
        // Determine mutation
        uint256 mutationRoll = (seed >> 48) % 10000;
        uint256 mutationChance = isQuantumGenesis ? QUANTUM_MUTATION_CHANCE : NEURAL_MUTATION_CHANCE;
        
        if (mutationRoll < mutationChance) {
            being.mutation = uint8((seed >> 56) % 255) + 1; // 1-255 for mutations
        } else {
            being.mutation = 0; // No mutation
        }
        
        return being;
    }

    /*//////////////////////////////////////////////////////////////
                           EVOLUTION LOGIC
    //////////////////////////////////////////////////////////////*/

    /**
     * @dev Get the current evolution stage of a Digital Being
     */
    function getEvolutionStage(uint256 tokenId) public view returns (uint8) {
        if (_ownerOf(tokenId) == address(0)) revert TokenDoesNotExist();
        
        DigitalBeing memory being = digitalBeings[tokenId];
        uint256 age = block.timestamp - being.birthTimestamp;
        
        if (age >= STAGE_4_TIME) return 4; // Transcendence
        if (age >= STAGE_3_TIME) return 3; // Learning
        if (age >= STAGE_2_TIME) return 2; // Processing
        return 1; // Initialization
    }

    /**
     * @dev Check if a Digital Being has reached a new evolution stage
     */
    function checkEvolution(uint256 tokenId) external {
        if (_ownerOf(tokenId) == address(0)) revert TokenDoesNotExist();
        
        uint8 currentStage = getEvolutionStage(tokenId);
        emit EvolutionStageReached(tokenId, currentStage);
    }

    /*//////////////////////////////////////////////////////////////
                            METADATA LOGIC
    //////////////////////////////////////////////////////////////*/

    /**
     * @dev Generate the complete SVG for a Digital Being
     */
    function generateSVG(uint256 tokenId) public view returns (string memory) {
        if (_ownerOf(tokenId) == address(0)) revert TokenDoesNotExist();
        
        DigitalBeing memory being = digitalBeings[tokenId];
        uint8 evolutionStage = getEvolutionStage(tokenId);
        
        return NeuralRenderer.generateNeuralNetwork(
            being.coreGeometry,
            being.pathwayPattern,
            being.particleSystem,
            being.networkDensity,
            being.processingAura,
            being.environment,
            being.mutation,
            evolutionStage
        );
    }

    /**
     * @dev Generate metadata JSON for a Digital Being
     */
    function generateMetadata(uint256 tokenId) public view returns (string memory) {
        if (_ownerOf(tokenId) == address(0)) revert TokenDoesNotExist();
        
        DigitalBeing memory being = digitalBeings[tokenId];
        uint8 evolutionStage = getEvolutionStage(tokenId);
        
        string memory traits = _buildTraits(being, evolutionStage, tokenId);
        uint256 rarityScore = _calculateRarityScore(being);
        
        // Generate SVG and encode it to Base64
        string memory svg = generateSVG(tokenId);
        string memory imageURI = string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(bytes(svg))));
        
        // Build metadata in parts to avoid stack overflow
        string memory part1 = string(abi.encodePacked(
            '{"name": "MONARA #', tokenId.toString(),
            '", "description": "Evolving Digital Being on Monad Network. Stage: ', _getStageString(evolutionStage),
            ' (', uint256(evolutionStage).toString(), '/4). Genesis Type: ', being.isQuantumGenesis ? 'Quantum Genesis' : 'Neural Genesis'
        ));
        
        string memory part2 = string(abi.encodePacked(
            '. Rarity Score: ', rarityScore.toString(),
            '. Each MONARA represents neural network visualizations.",',
            ' "image": "', imageURI, '",'
        ));
        
        string memory part3 = string(abi.encodePacked(
            ' "animation_url": "', _getBaseURI(), '/api/nft/', tokenId.toString(), '/animation",',
            ' "external_url": "', _getBaseURI(), '/nft/', tokenId.toString(), '",'
        ));
        
        string memory part4 = string(abi.encodePacked(
            ' "attributes": [', traits, '],',
            ' "background_color": "1a1a2e",',
            ' "properties": {"evolution_stage": ', uint256(evolutionStage).toString(),
            ', "rarity_score": ', rarityScore.toString(),
            ', "is_quantum": ', being.isQuantumGenesis ? 'true' : 'false',
            ', "birth_timestamp": ', uint256(being.birthTimestamp).toString(), '}}'
        ));
        
        return string(abi.encodePacked(part1, part2, part3, part4));
    }

    /**
     * @dev Build traits array for metadata
     */
    function _buildTraits(DigitalBeing memory being, uint8 evolutionStage, uint256 tokenId) internal pure returns (string memory) {
        string memory stageString = _getStageString(evolutionStage);
        string memory coreGeometry = _getCoreGeometry(being.coreGeometry);
        string memory environment = _getEnvironment(being.environment);
        
        // Build traits in parts to avoid stack overflow
        string memory traits1 = string(abi.encodePacked(
            '{"trait_type": "Evolution Stage", "value": "', stageString, '"},',
            '{"trait_type": "Core Geometry", "value": "', coreGeometry, '"},',
            '{"trait_type": "Genesis Type", "value": "', being.isQuantumGenesis ? 'Quantum' : 'Neural', '"},',
            '{"trait_type": "Environment", "value": "', environment, '"}'
        ));
        
        string memory traits2 = string(abi.encodePacked(
            ',{"trait_type": "Neural Density", "value": ', uint256(being.networkDensity % 100).toString(), '},',
            '{"trait_type": "Consciousness Level", "value": ', uint256(being.processingAura % 10).toString(), '},',
            '{"display_type": "boost_percentage", "trait_type": "Evolution Progress", "value": ', uint256(evolutionStage * 25).toString(), '}'
        ));
        
        string memory traits3 = string(abi.encodePacked(
            ',{"display_type": "number", "trait_type": "Rarity Score", "value": ', _calculateRarityScore(being).toString(), '},',
            '{"display_type": "date", "trait_type": "Birth Date", "value": ', uint256(being.birthTimestamp).toString(), '},',
            '{"display_type": "number", "trait_type": "Token ID", "value": ', tokenId.toString(), '}'
        ));
        
        return string(abi.encodePacked(traits1, traits2, traits3));
    }

    /**
     * @dev Calculate rarity score based on traits
     */
    function _calculateRarityScore(DigitalBeing memory being) internal pure returns (uint256) {
        uint256 score = 100; // Base score
        
        // Quantum Genesis bonus
        if (being.isQuantumGenesis) {
            score += 50;
        }
        
        // Neural density rarity
        uint256 densityMod = being.networkDensity % 100;
        if (densityMod > 90) score += 30;
        else if (densityMod > 75) score += 20;
        else if (densityMod > 50) score += 10;
        
        // Processing aura rarity
        uint256 auraMod = being.processingAura % 10;
        if (auraMod >= 8) score += 25;
        else if (auraMod >= 6) score += 15;
        else if (auraMod >= 4) score += 5;
        
        // Geometry rarity
        uint256 geometryRarity = being.coreGeometry % 4;
        if (geometryRarity == 3) score += 20; // Diamond (rarest)
        else if (geometryRarity == 2) score += 15; // Star
        else if (geometryRarity == 1) score += 10; // Hexagon
        // Circle is common (no bonus)
        
        return score;
    }

    /**
     * @dev Get stage string representation
     */
    function _getStageString(uint8 stage) internal pure returns (string memory) {
        if (stage == 0) return "Spark";
        if (stage == 1) return "Pulse";
        if (stage == 2) return "Flow";
        if (stage == 3) return "Nexus";
        return "Transcendent";
    }

    /**
     * @dev Get core geometry string
     */
    function _getCoreGeometry(uint256 geometry) internal pure returns (string memory) {
        uint256 geometryType = geometry % 4;
        if (geometryType == 0) return "Circle";
        if (geometryType == 1) return "Hexagon";
        if (geometryType == 2) return "Star";
        return "Diamond";
    }

    /**
     * @dev Get environment string
     */
    function _getEnvironment(uint256 environment) internal pure returns (string memory) {
        uint256 envType = environment % 4;
        if (envType == 0) return "Matrix";
        if (envType == 1) return "Quantum";
        if (envType == 2) return "Cyber";
        return "Void";
    }

    /**
     * @dev Get base URI for metadata links
     */
    function _getBaseURI() internal pure returns (string memory) {
        // Updated to point to deployed frontend domain
        return "https://monara-nft.vercel.app";
    }

    /**
     * @dev Returns the token URI for a given token ID
     * @param tokenId The token ID to get the URI for
     * @return The complete token URI with metadata
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (_ownerOf(tokenId) == address(0)) revert TokenDoesNotExist();
        
        string memory metadata = generateMetadata(tokenId);
        
        // Encode metadata as base64 data URI for MetaMask compatibility
        string memory json = Base64.encode(bytes(metadata));
        
        return string(abi.encodePacked(
            'data:application/json;base64,',
            json
        ));
    }

    /*//////////////////////////////////////////////////////////////
                            ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @dev Set base URI for metadata
     */
    function setBaseURI(string calldata baseURI) external onlyRole(ADMIN_ROLE) {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Toggle minting active state
     */
    function setMintingActive(bool active) external onlyRole(ADMIN_ROLE) {
        mintingActive = active;
    }

    /**
     * @dev Pause contract functions
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause contract functions
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev Set emergency withdraw address
     */
    function setEmergencyWithdrawAddress(address newAddress) external onlyRole(ADMIN_ROLE) {
        require(newAddress != address(0), "Invalid address");
        emergencyWithdrawAddress = newAddress;
    }

    /**
     * @dev Withdraw contract balance
     */
    function withdraw() external onlyRole(ADMIN_ROLE) {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(emergencyWithdrawAddress).call{value: balance}("");
        if (!success) revert WithdrawalFailed();
    }

    /**
     * @dev Emergency withdraw request
     */
    function requestEmergencyWithdraw() external onlyRole(ADMIN_ROLE) {
        emergencyWithdrawRequestTime = block.timestamp;
        emit EmergencyWithdrawRequested(emergencyWithdrawAddress, block.timestamp);
    }

    /**
     * @dev Emergency withdraw execution
     */
    function executeEmergencyWithdraw() external onlyRole(ADMIN_ROLE) {
        if (block.timestamp < emergencyWithdrawRequestTime + emergencyWithdrawDelay) revert EmergencyWithdrawNotReady();
        
        uint256 balance = address(this).balance;
        (bool success, ) = payable(emergencyWithdrawAddress).call{value: balance}("");
        if (!success) revert WithdrawalFailed();
        
        emit EmergencyWithdrawExecuted(emergencyWithdrawAddress, balance);
    }

    /*//////////////////////////////////////////////////////////////
                           SECURITY FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @dev Get rate limit info for an address
     */
    function getRateLimitInfo(address user) external view returns (
        uint256 mintsInCurrentWindow,
        uint256 windowStart,
        uint256 lastMint,
        bool canMint
    ) {
        mintsInCurrentWindow = mintsInWindow[user];
        windowStart = windowStartTime[user];
        lastMint = lastMintTime[user];
        
        // Check if we're in a new window
        if (block.timestamp > windowStart + RATE_LIMIT_WINDOW) {
            mintsInCurrentWindow = 0;
            canMint = true;
        } else {
            canMint = mintsInCurrentWindow < MAX_MINTS_PER_WINDOW;
        }
    }

    /**
     * @dev Reset rate limit for a user (admin only)
     */
    function resetRateLimit(address user) external onlyRole(ADMIN_ROLE) {
        mintsInWindow[user] = 0;
        windowStartTime[user] = block.timestamp;
        lastMintTime[user] = 0;
    }

    /*//////////////////////////////////////////////////////////////
                         REQUIRED OVERRIDES
    //////////////////////////////////////////////////////////////*/

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
} 