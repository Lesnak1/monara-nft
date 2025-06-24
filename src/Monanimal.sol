// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./SVGRenderer.sol";

/**
 * @title Monanimal
 * @dev Evolving on-chain SVG NFTs inspired by Monad ecosystem
 * Features:
 * - Fully on-chain metadata and images
 * - Time-based evolution mechanics
 * - Customizable traits during minting
 * - Dynamic visual effects based on age
 */
contract Monanimal is ERC721, ERC721Enumerable, Ownable, ReentrancyGuard, Pausable {
    using Strings for uint256;

    // ============================
    // STATE VARIABLES
    // ============================

    SVGRenderer public immutable renderer;
    
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public mintPrice = 0.01 ether;
    uint256 private _currentTokenId = 0;
    
    // Token data storage
    mapping(uint256 => SVGRenderer.MonanimalTraits) public tokenTraits;
    mapping(uint256 => SVGRenderer.EvolutionData) public tokenEvolution;
    mapping(uint256 => string) public tokenNames;
    
    // Mint tracking
    mapping(address => uint256) public addressMintCount;
    uint256 public constant MAX_MINT_PER_ADDRESS = 5;

    // ============================
    // EVENTS
    // ============================

    event MonanimalMinted(
        uint256 indexed tokenId, 
        address indexed owner,
        SVGRenderer.MonanimalTraits traits,
        string name
    );
    
    event MonanimalEvolved(
        uint256 indexed tokenId,
        uint256 oldLevel,
        uint256 newLevel
    );

    event NameChanged(uint256 indexed tokenId, string newName);

    // ============================
    // ERRORS
    // ============================

    error MaxSupplyExceeded();
    error InsufficientPayment();
    error MaxMintPerAddressExceeded();
    error InvalidTraitValues();
    error TokenDoesNotExist();
    error NotTokenOwner();
    error NameTooLong();
    error EmptyName();

    // ============================
    // CONSTRUCTOR
    // ============================

    constructor(address _renderer) ERC721("Monanimal", "MONA") Ownable(msg.sender) {
        renderer = SVGRenderer(_renderer);
    }

    // ============================
    // MINTING FUNCTIONS
    // ============================

    /**
     * @dev Mint a new Monanimal with custom traits
     * @param traits The desired traits for the Monanimal
     * @param name The name for the Monanimal (max 32 chars)
     */
    function mintMonanimal(
        SVGRenderer.MonanimalTraits memory traits,
        string memory name
    ) external payable nonReentrant whenNotPaused {
        if (_currentTokenId >= MAX_SUPPLY) revert MaxSupplyExceeded();
        if (msg.value < mintPrice) revert InsufficientPayment();
        if (addressMintCount[msg.sender] >= MAX_MINT_PER_ADDRESS) revert MaxMintPerAddressExceeded();
        if (bytes(name).length == 0) revert EmptyName();
        if (bytes(name).length > 32) revert NameTooLong();
        
        // Validate trait values
        if (traits.body > 4 || traits.eyes > 4 || traits.mouth > 4 || 
            traits.accessory > 4 || traits.background > 4) {
            revert InvalidTraitValues();
        }

        uint256 tokenId = ++_currentTokenId;
        
        // Store traits and evolution data
        tokenTraits[tokenId] = traits;
        tokenEvolution[tokenId] = SVGRenderer.EvolutionData({
            birthTime: block.timestamp,
            lastUpdate: block.timestamp,
            level: 0
        });
        tokenNames[tokenId] = name;
        
        // Update mint tracking
        addressMintCount[msg.sender]++;
        
        // Mint the NFT
        _safeMint(msg.sender, tokenId);
        
        emit MonanimalMinted(tokenId, msg.sender, traits, name);
    }

    /**
     * @dev Mint a random Monanimal (cheaper option)
     * @param name The name for the Monanimal
     */
    function mintRandomMonanimal(string memory name) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        if (_currentTokenId >= MAX_SUPPLY) revert MaxSupplyExceeded();
        if (msg.value < mintPrice / 2) revert InsufficientPayment(); // 50% discount for random
        if (addressMintCount[msg.sender] >= MAX_MINT_PER_ADDRESS) revert MaxMintPerAddressExceeded();
        if (bytes(name).length == 0) revert EmptyName();
        if (bytes(name).length > 32) revert NameTooLong();

        uint256 tokenId = ++_currentTokenId;
        
        // Generate random traits
        uint256 seed = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.difficulty,
            msg.sender,
            tokenId
        )));
        
        SVGRenderer.MonanimalTraits memory traits = renderer.generateRandomTraits(seed);
        
        // Store data
        tokenTraits[tokenId] = traits;
        tokenEvolution[tokenId] = SVGRenderer.EvolutionData({
            birthTime: block.timestamp,
            lastUpdate: block.timestamp,
            level: 0
        });
        tokenNames[tokenId] = name;
        
        // Update tracking
        addressMintCount[msg.sender]++;
        
        // Mint
        _safeMint(msg.sender, tokenId);
        
        emit MonanimalMinted(tokenId, msg.sender, traits, name);
    }

    // ============================
    // TOKEN URI & METADATA
    // ============================

    /**
     * @dev Returns the token URI with fully on-chain metadata
     * @param tokenId The token ID to get metadata for
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) revert TokenDoesNotExist();
        
        SVGRenderer.MonanimalTraits memory traits = tokenTraits[tokenId];
        SVGRenderer.EvolutionData memory evolution = tokenEvolution[tokenId];
        string memory name = tokenNames[tokenId];
        
        return renderer.generateMetadata(tokenId, name, traits, evolution);
    }

    /**
     * @dev Get the current SVG for a token (useful for previews)
     * @param tokenId The token ID
     */
    function getTokenSVG(uint256 tokenId) external view returns (string memory) {
        if (!_exists(tokenId)) revert TokenDoesNotExist();
        
        SVGRenderer.MonanimalTraits memory traits = tokenTraits[tokenId];
        SVGRenderer.EvolutionData memory evolution = tokenEvolution[tokenId];
        
        return renderer.renderSVG(tokenId, traits, evolution);
    }

    // ============================
    // EVOLUTION FUNCTIONS
    // ============================

    /**
     * @dev Get current evolution level for a token
     * @param tokenId The token ID
     */
    function getEvolutionLevel(uint256 tokenId) external view returns (uint256) {
        if (!_exists(tokenId)) revert TokenDoesNotExist();
        return renderer.calculateEvolutionLevel(tokenEvolution[tokenId].birthTime);
    }

    /**
     * @dev Manually trigger evolution update (updates lastUpdate timestamp)
     * @param tokenId The token ID to update
     */
    function updateEvolution(uint256 tokenId) external {
        if (!_exists(tokenId)) revert TokenDoesNotExist();
        if (ownerOf(tokenId) != msg.sender) revert NotTokenOwner();
        
        uint256 oldLevel = tokenEvolution[tokenId].level;
        uint256 newLevel = renderer.calculateEvolutionLevel(tokenEvolution[tokenId].birthTime);
        
        tokenEvolution[tokenId].lastUpdate = block.timestamp;
        tokenEvolution[tokenId].level = newLevel;
        
        if (newLevel > oldLevel) {
            emit MonanimalEvolved(tokenId, oldLevel, newLevel);
        }
    }

    // ============================
    // NAME FUNCTIONS
    // ============================

    /**
     * @dev Change the name of your Monanimal
     * @param tokenId The token ID
     * @param newName The new name (max 32 chars)
     */
    function changeName(uint256 tokenId, string memory newName) external {
        if (!_exists(tokenId)) revert TokenDoesNotExist();
        if (ownerOf(tokenId) != msg.sender) revert NotTokenOwner();
        if (bytes(newName).length == 0) revert EmptyName();
        if (bytes(newName).length > 32) revert NameTooLong();
        
        tokenNames[tokenId] = newName;
        emit NameChanged(tokenId, newName);
    }

    // ============================
    // VIEW FUNCTIONS
    // ============================

    /**
     * @dev Get all data for a token
     */
    function getTokenData(uint256 tokenId) external view returns (
        SVGRenderer.MonanimalTraits memory traits,
        SVGRenderer.EvolutionData memory evolution,
        string memory name,
        uint256 currentEvolutionLevel
    ) {
        if (!_exists(tokenId)) revert TokenDoesNotExist();
        
        traits = tokenTraits[tokenId];
        evolution = tokenEvolution[tokenId];
        name = tokenNames[tokenId];
        currentEvolutionLevel = renderer.calculateEvolutionLevel(evolution.birthTime);
    }

    /**
     * @dev Get tokens owned by an address
     */
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        
        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        
        return tokenIds;
    }

    // ============================
    // ADMIN FUNCTIONS
    // ============================

    /**
     * @dev Set new mint price (only owner)
     */
    function setMintPrice(uint256 _newPrice) external onlyOwner {
        mintPrice = _newPrice;
    }

    /**
     * @dev Pause/unpause minting
     */
    function setPaused(bool _paused) external onlyOwner {
        if (_paused) {
            _pause();
        } else {
            _unpause();
        }
    }

    /**
     * @dev Emergency mint for team/partnerships (only owner)
     */
    function emergencyMint(
        address to,
        SVGRenderer.MonanimalTraits memory traits,
        string memory name
    ) external onlyOwner {
        if (_currentTokenId >= MAX_SUPPLY) revert MaxSupplyExceeded();
        
        uint256 tokenId = ++_currentTokenId;
        
        tokenTraits[tokenId] = traits;
        tokenEvolution[tokenId] = SVGRenderer.EvolutionData({
            birthTime: block.timestamp,
            lastUpdate: block.timestamp,
            level: 0
        });
        tokenNames[tokenId] = name;
        
        _safeMint(to, tokenId);
        emit MonanimalMinted(tokenId, to, traits, name);
    }

    /**
     * @dev Withdraw contract balance (only owner)
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // ============================
    // REQUIRED OVERRIDES
    // ============================

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return tokenId > 0 && tokenId <= _currentTokenId;
    }

    // ============================
    // UTILITY FUNCTIONS
    // ============================

    /**
     * @dev Get total number of minted tokens
     */
    function totalMinted() external view returns (uint256) {
        return _currentTokenId;
    }

    /**
     * @dev Check if an address can mint more tokens
     */
    function canMint(address account) external view returns (bool) {
        return addressMintCount[account] < MAX_MINT_PER_ADDRESS && _currentTokenId < MAX_SUPPLY;
    }

    /**
     * @dev Get remaining mintable tokens for an address
     */
    function remainingMints(address account) external view returns (uint256) {
        uint256 minted = addressMintCount[account];
        return minted >= MAX_MINT_PER_ADDRESS ? 0 : MAX_MINT_PER_ADDRESS - minted;
    }
} 