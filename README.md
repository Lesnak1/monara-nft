# 🔮 MONARA - Evolving Digital Beings

**Dynamic NFT Collection on Monad Network**

MONARA is a collection of evolving digital beings that leverages Monad blockchain's parallel processing power with a fully on-chain SVG rendering system.

## 🌐 Current Network Information

### Monad Testnet
- **Chain ID**: `10143` (0x279f)
- **RPC URL**: `https://testnet-rpc.monad.xyz`
- **Currency**: MON
- **Block Gas Limit**: 150,000,000
- **Explorer**: https://testnet.monadexplorer.com
- **Faucet**: https://faucet.monad.xyz

## ✨ Key Features

### 🧬 Dual Genesis System
- **Neural Genesis** (0.1 MON): Standard minting with mutation
- **Quantum Genesis** (0.25 MON): Enhanced traits with higher mutation rates

### 🔄 Evolution Stages
1. **Spark** → 2. **Pulse** → 3. **Flow** → 4. **Nexus**
- Time-based evolution every 7 days
- Increasing complexity and rarity

### 🎨 On-Chain Art Generation
- **8 Core Geometries**: Circle, Diamond, Hexagon, Octagon, Star, Triangle, Pentagon, Cross
- **5 Pathway Patterns**: Linear, Curved, Spiral, Fractal, Wave  
- **6 Particle Systems**: 120-frame animation cycles
- **Dynamic Coloring**: HSL-based color evolution

### 🛡️ Security Features (Latest Updates)
- **Rate Limiting**: 10 mints per hour per address
- **Balance Validation**: Smart contract and frontend balance verification
- **Input Sanitization**: XSS and injection protection
- **Transaction Security**: Nonce-based request validation
- **Reentrancy Protection**: OpenZeppelin security patterns
- **Access Control**: Role-based permissions system

### 🔧 Recent Improvements
- **Enhanced Balance Checking**: Fixed MON token balance verification system
- **Improved Error Handling**: Better user feedback for insufficient funds
- **Security Hardening**: Additional validation layers for mint operations
- **Network Compatibility**: Optimized for Monad Testnet (Chain ID: 10143)
- **Gas Optimization**: Reduced gas costs for mint operations

## 🚀 Quick Start

### MetaMask Setup

1. **Add Monad Testnet to MetaMask**:
   ```
   Network Name: Monad Testnet
   Chain ID: 10143
   RPC URL: https://testnet-rpc.monad.xyz
   Currency Symbol: MON
   Block Explorer: https://testnet.monadexplorer.com
   ```

2. **Get Testnet MON**: Visit [Monad Faucet](https://faucet.monad.xyz)

### Development Setup

```bash
# Clone repository
git clone <repo-url>
cd monad-studio

# Install dependencies
npm install

# Frontend development
cd frontend
npm install
npm run dev

# Smart contracts
cd ../contracts
npm install
```

### Environment Variables

Create `.env` in contracts folder:
```env
PRIVATE_KEY=your_private_key_here
MONAD_TESTNET_RPC_URL=https://testnet-rpc.monad.xyz
MONAD_API_KEY=your_api_key_here
```

## 🏗️ Architecture

### Smart Contracts
- **MONARA.sol**: Main NFT contract with evolution logic
- **NeuralRenderer.sol**: On-chain SVG generation engine
- **GeometryLib.sol**: Geometric shape rendering
- **ColorLib.sol**: HSL color manipulation
- **PathwayLib.sol**: Animation pathway generation

### Frontend Stack
- **Next.js 15.3.4**: React framework with App Router
- **TypeScript**: Full type safety implementation
- **TailwindCSS**: Utility-first styling
- **Wagmi v2**: Ethereum interactions with React hooks
- **RainbowKit**: Multi-wallet connection support
- **Viem**: Type-safe Ethereum client

## 🔧 Deployment

### Smart Contract Deployment
```bash
cd contracts

# Deploy to Monad Testnet
npm run deploy:testnet

# Verify contract
npm run verify:testnet
```

### Frontend Deployment
```bash
cd frontend

# Build for production
npm run build

# Deploy (update with your deployment method)
npm run deploy
```

## 📊 Network Statistics

The frontend includes real-time Monad network statistics:
- **TPS**: Current transactions per second
- **Block Height**: Current block number
- **Gas Price**: Current gas price in Gwei
- **Validators**: Active validator count
- **Network Health**: Real-time monitoring

## 🎮 Usage

1. **Connect Wallet**: Use built-in MetaMask connection
2. **Add Network**: Automatic Monad Testnet addition
3. **Get Testnet MON**: From the official faucet
4. **Mint MONARA**: Choose Neural or Quantum Genesis
5. **Watch Evolution**: Your NFT evolves every 7 days
6. **Gallery**: View all minted NFTs with metadata

## 🔍 Features Deep Dive

### Evolution System
- **Stage 1 (Spark)**: Basic geometric form
- **Stage 2 (Pulse)**: Added pathways and movement
- **Stage 3 (Flow)**: Complex particle systems
- **Stage 4 (Nexus)**: Full neural network visualization

### Mutation Mechanics
- **Neural Genesis**: 15% trait mutation chance
- **Quantum Genesis**: 35% trait mutation chance
- **Evolution Trigger**: Automatic every 7 days
- **Trait Inheritance**: Previous stage influences next

### On-Chain SVG Features
- **Gas Optimized**: Efficient string operations
- **Fully Deterministic**: Same seed = same output
- **Scalable**: Vector-based rendering
- **Animated**: 120-frame animation cycles

### Security Protocols
- **Multi-Layer Validation**: Contract + Frontend validation
- **Rate Limiting**: Prevents spam and abuse
- **Balance Verification**: Real-time MON token balance checking
- **Transaction Safety**: Secure nonce generation and validation
- **Emergency Controls**: Pause functionality for critical issues

## 🛠️ Development Commands

### Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
npm run type-check   # TypeScript check
```

### Smart Contracts
```bash
npm run compile     # Compile contracts
npm run test        # Run tests
npm run deploy:testnet    # Deploy to Monad Testnet
npm run verify:testnet    # Verify on explorer
```

## 🚨 Network Troubleshooting

### MetaMask Connection Issues
1. Ensure MetaMask is installed and updated
2. Add Monad Testnet manually if auto-add fails
3. Check RPC URL: `https://testnet-rpc.monad.xyz`
4. Verify Chain ID: `10143`

### Common Issues
- **Wrong Network**: Use the network switcher in the app
- **No MON Tokens**: Get from the faucet (ensure sufficient balance)
- **Transaction Failed**: Check gas limits and network status
- **MetaMask Errors**: Clear cache and restart browser
- **Balance Issues**: Wait for network sync, refresh page

### Balance Verification
- **Frontend Check**: Real-time balance display
- **Contract Validation**: Smart contract balance verification
- **Error Messages**: Clear feedback for insufficient funds
- **Automatic Refresh**: Balance updates on transaction completion

## 📁 Project Structure

```
monad-studio/
├── contracts/                  # Smart contracts
│   ├── src/
│   │   ├── MONARA.sol         # Main NFT contract
│   │   └── libraries/         # Supporting libraries
│   ├── test/                  # Contract tests
│   ├── scripts/               # Deployment scripts
│   └── hardhat.config.js      # Hardhat configuration
├── frontend/                   # Next.js application
│   ├── src/
│   │   ├── app/               # App router pages
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom hooks
│   │   └── lib/               # Utilities
│   └── package.json
└── README.md
```

## 🔒 Security Considerations

### Smart Contract Security
- **Access Control**: Role-based permissions
- **Reentrancy Protection**: OpenZeppelin guards
- **Input Validation**: Comprehensive parameter checking
- **Emergency Pause**: Circuit breaker pattern
- **Rate Limiting**: Built-in abuse prevention

### Frontend Security
- **XSS Protection**: Input sanitization
- **CSRF Prevention**: Secure state management
- **Content Security Policy**: Strict CSP headers
- **Balance Validation**: Multiple verification layers
- **Error Handling**: Secure error messages

## 🧪 Testing

### Smart Contract Tests
```bash
cd contracts
npm test                    # Run all tests
npm run test:coverage      # Coverage report
npm run test:gas          # Gas optimization tests
```

### Frontend Tests
```bash
cd frontend
npm test                   # Unit tests
npm run test:e2e          # End-to-end tests
npm run test:security     # Security tests
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow security protocols
- Test on Monad Testnet before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Frontend**: http://localhost:3000 (development)
- **Monad Testnet Explorer**: https://testnet.monadexplorer.com
- **Monad Faucet**: https://faucet.monad.xyz
- **Monad Documentation**: https://docs.monad.xyz

## 🆕 Latest Updates

### Version 2.1.0 (Current)
- **Fixed**: MON token balance verification system
- **Enhanced**: Error handling for insufficient funds
- **Added**: Multi-layer security validation
- **Improved**: Network compatibility checks
- **Optimized**: Gas costs for minting operations

### Previous Updates
- **Version 2.0.0**: Initial release with dual genesis system
- **Version 1.5.0**: On-chain SVG rendering implementation
- **Version 1.0.0**: Basic NFT collection launch

---

Built with ❤️ for the Monad Ecosystem