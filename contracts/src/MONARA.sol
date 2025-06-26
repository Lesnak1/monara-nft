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
        
        string memory svg = generateSVG(tokenId);
        string memory traits = _buildTraits(being, evolutionStage);
        
        return string(abi.encodePacked(
            '{"name": "MONARA #', tokenId.toString(),
            '", "description": "Digital beings that evolve through neural network visualizations on Monad Network. Each MONARA represents the mathematical beauty of parallel computation.",',
            '"image": "data:image/svg+xml;base64,', _base64Encode(bytes(svg)),
            '", "attributes": [', traits, ']}'
        ));
    }

    /**
     * @dev Build the traits array for metadata
     */
    function _buildTraits(DigitalBeing memory being, uint8 evolutionStage) private pure returns (string memory) {
        string memory coreNames = "CircleDiamondHexagonOctagonStar    TrianglePentagonCross   ";
        string memory pathwayNames = "LinearCurved SpiralFractalWave  ";
        string memory particleNames = "Dots  SquaresTringlesDiamondStars Hexagon";
        string memory densityNames = "SparsemediumDense Ultra ";
        string memory auraNames = "Pulse ShimmrWave  StaticBurst GradintNone  ";
        string memory envNames = "Void  MatrixCloudQuantmCyber ";
        string memory stageNames = "InitlzProcessLearnTranscd";
        
        return string(abi.encodePacked(
            '{"trait_type": "Core Geometry", "value": "', _extractName(coreNames, being.coreGeometry, 7), '"},',
            '{"trait_type": "Pathway Pattern", "value": "', _extractName(pathwayNames, being.pathwayPattern, 6), '"},',
            '{"trait_type": "Particle System", "value": "', _extractName(particleNames, being.particleSystem, 8), '"},',
            '{"trait_type": "Network Density", "value": "', _extractName(densityNames, being.networkDensity, 6), '"},',
            '{"trait_type": "Processing Aura", "value": "', _extractName(auraNames, being.processingAura, 7), '"},',
            '{"trait_type": "Environment", "value": "', _extractName(envNames, being.environment, 6), '"},',
            '{"trait_type": "Evolution Stage", "value": "', _extractName(stageNames, evolutionStage - 1, 6), '"},',
            '{"trait_type": "Genesis Type", "value": "', being.isQuantumGenesis ? "Quantum" : "Neural", '"},',
            being.mutation > 0 ? string(abi.encodePacked('{"trait_type": "Mutation", "value": "Type ', uint256(being.mutation).toString(), '"},')) : '',
            '{"trait_type": "Birth Timestamp", "value": ', uint256(being.birthTimestamp).toString(), '}'
        ));
    }

    /**
     * @dev Extract trait name from packed string
     */
    function _extractName(string memory packedNames, uint256 index, uint256 nameLength) private pure returns (string memory) {
        bytes memory names = bytes(packedNames);
        bytes memory result = new bytes(nameLength);
        
        uint256 start = index * nameLength;
        for (uint256 i = 0; i < nameLength; i++) {
            if (start + i < names.length) {
                result[i] = names[start + i];
            }
        }
        
        return string(result);
    }

    /**
     * @dev Base64 encode function
     */
    function _base64Encode(bytes memory data) private pure returns (string memory) {
        if (data.length == 0) return "";
        
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        uint256 encodedLen = 4 * ((data.length + 2) / 3);
        string memory result = new string(encodedLen + 32);
        
        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)
            
            for {
                let i := 0
            } lt(i, mload(data)) {
                i := add(i, 3)
            } {
                let input := and(mload(add(data, add(i, 32))), 0xffffff)
                
                let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(12, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(6, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(input, 0x3F))), 0xFF))
                out := shl(224, out)
                
                mstore(resultPtr, out)
                resultPtr := add(resultPtr, 4)
            }
            
            switch mod(mload(data), 3)
            case 1 { mstore(sub(resultPtr, 2), shl(240, 0x3d3d)) }
            case 2 { mstore(sub(resultPtr, 1), shl(248, 0x3d)) }
        }
        
        return result;
    }

    /**
     * @dev Override tokenURI to return fully on-chain metadata
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (_ownerOf(tokenId) == address(0)) revert TokenDoesNotExist();
        
        string memory metadata = generateMetadata(tokenId);
        return string(abi.encodePacked(
            "data:application/json;base64,",
            _base64Encode(bytes(metadata))
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