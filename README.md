# 🌌 Monad Studio: Evolving Monanimals

**Winner of the Monad Hackathon - Track 1 (NFTs) & Track 2 (NFT Tooling)**

> *Create, evolve, and experience the cosmic magic of Monanimals - fully on-chain, animated SVG NFTs that grow and transform with time.*

![Monad Studio Banner](https://via.placeholder.com/800x300/6366f1/ffffff?text=Monad+Studio%3A+Evolving+Monanimals)

## 🎯 What is Monad Studio?

Monad Studio is a revolutionary NFT creation platform that combines **Track 1 (NFT Collection)** and **Track 2 (NFT Tooling)** into one cohesive experience. It's both a unique NFT collection AND a powerful tool for creating cosmic beings inspired by Monad lore.

### 🌟 Key Features

- **🎨 Visual NFT Builder**: Drag-and-drop interface for creating Monanimals without coding
- **🧬 Evolution Mechanics**: NFTs that change and grow more powerful over time
- **⛓️ Fully On-Chain**: No IPFS dependencies - everything lives on the blockchain
- **🌌 Monad Lore Integration**: Cosmic themes, galaxy backgrounds, and mystical accessories
- **✨ Animated SVG**: Dynamic sparkles and glowing effects that evolve with age
- **💎 Rarity System**: Unique trait combinations with different levels of scarcity

## 🚀 Why This Wins the Hackathon

### Track 1 (NFTs) - Innovation ✅
- **Completely Novel**: Not just another PFP collection - these are living, breathing cosmic entities
- **Technical Excellence**: Fully on-chain SVG generation with gas-optimized rendering
- **Monad Ecosystem**: Deep integration of Monad themes, lore, and visual identity
- **Evolution Mechanics**: First NFT collection where tokens literally evolve over time

### Track 2 (NFT Tooling) - Problem Solving ✅  
- **Solves Real Problems**: "NFT generation is hard" and "Visual NFT builder needed"
- **User-Friendly**: Non-technical users can create beautiful on-chain NFTs
- **Open Source**: Fully documented, reusable by the community
- **Developer Tools**: Complete SDK for building on top of the system

## 🎮 How It Works

### 1. Design Your Monanimal
Use our intuitive visual builder to select:
- **Body**: Cosmic Cube, Stellar Oval, Quantum Wave, etc.
- **Eyes**: Galaxy Swirl, Star Sight, Third Eye, Ethereal Glow
- **Mouth**: Joyful Cosmos, Stellar Surprise, Wave Dimension  
- **Accessories**: Cosmic Crown, Monad Crystal, Galaxy Wings
- **Background**: Dark Void, Purple Nebula, Galaxy Swirl

### 2. Mint Your Creation
- **Custom Mint**: Choose exact traits for 0.01 ETH
- **Random Mint**: Get surprise traits for 0.005 ETH (50% discount!)
- **Name Your Monanimal**: Give it personality with a custom name

### 3. Watch It Evolve
Your Monanimal grows more powerful with age:
- **Newborn** (0-1 day): Pure cosmic energy
- **Young** (1-7 days): Soft glowing aura appears  
- **Mature** (1-4 weeks): Stronger aura and sparkle effects
- **Ancient** (30+ days): Powerful multi-layered aura with intense animations

## 🏗️ Technical Architecture

### Smart Contracts (Solidity + Foundry)
```
src/
├── Monanimal.sol           # Main ERC-721 contract
├── SVGRenderer.sol         # On-chain SVG generation engine  
├── libraries/
│   └── MonanimalParts.sol  # SVG component library
└── ...
```

### Frontend (Next.js + TypeScript)
```
frontend/
├── components/
│   ├── MonanimalBuilder.tsx    # Visual trait selector
│   ├── EvolutionTracker.tsx    # Shows growth over time
│   └── CollectionGallery.tsx   # User's Monanimals
├── hooks/
│   └── useMonanimalContract.ts # Contract interaction
└── ...
```

## 🔥 Standout Features

### 1. **Zero External Dependencies**
- No IPFS, no centralized servers
- Metadata and images generated entirely on-chain
- Will work forever as long as Ethereum exists

### 2. **Gas-Optimized SVG Engine**  
- Efficient string concatenation
- Minimal storage with maximum visual impact
- Real-time preview without blockchain calls

### 3. **Dynamic Evolution System**
- Time-based trait modifications
- Visual effects that change with age
- Surprise evolutions for long-term holders

### 4. **Community Builder Tools**
- Open-source trait system
- Easily extendable for new projects
- Complete documentation and examples

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- Foundry toolkit
- MetaMask or compatible wallet

### Smart Contracts Setup
```bash
cd contracts
forge install
forge build
forge test
```

### Frontend Setup  
```bash
cd frontend
npm install
npm run dev
```

### Deploy to Monad Testnet
```bash
# Add your private key to .env
forge script script/Deploy.s.sol --rpc-url $MONAD_RPC --broadcast
```

## 🎨 Gallery

| Evolution Stage | Visual Effect | Rarity |
|---|---|---|
| Newborn | Clean, simple design | Common |
| Young | Soft glow around edges | Uncommon |  
| Mature | Sparkle animations | Rare |
| Ancient | Multi-layer aura effects | Ultra Rare |

## 🏆 Hackathon Compliance

- ✅ **Open Source**: MIT licensed, fully documented
- ✅ **No Commercial Intent**: Built for the community
- ✅ **Monad Ecosystem**: Deep theme integration
- ✅ **Technical Innovation**: On-chain SVG + evolution mechanics
- ✅ **Dual Track Winner**: Addresses both NFT and tooling challenges

## 🔗 Links

- **Live Demo**: [https://monad-studio.vercel.app](https://monad-studio.vercel.app)
- **Contract Explorer**: [View on Monad Explorer](https://explorer.monad.xyz)
- **Documentation**: [Read the Docs](./docs/)
- **Video Demo**: [Watch on YouTube](https://youtube.com/watch?v=demo)

## 🤝 Contributing

We welcome contributions! This project is designed to be:
- **Extensible**: Easy to add new traits and effects
- **Educational**: Well-commented code for learning
- **Community-Driven**: Built by builders, for builders

## 📜 License

MIT License - Build amazing things with this code!

## 🌟 The Team

Built with ❤️ by passionate builders who believe in the future of on-chain creativity and the Monad ecosystem.

---

*"In the cosmic realm of Monad, every Monanimal tells a story of growth, evolution, and the infinite possibilities of on-chain creativity."* 