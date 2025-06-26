# 🚀 MONARA Deployment & Security Guide

Bu guide MONARA NFT projesini Monad Testnet'e güvenli bir şekilde deploy etmek için gerekli adımları içerir.

## 📋 Prerequisites

### 1. Monad Testnet Faucet
- [Monad Testnet Faucet](https://faucet.monad.xyz) adresinden MON token alın
- Deploy için minimum 0.5 MON gerekli

### 2. Private Key Setup
```bash
# Wallet private key'inizi (0x olmadan) environment variable olarak set edin:
export PRIVATE_KEY="your_private_key_here"
export MONAD_TESTNET_RPC_URL="https://testnet-rpc.monad.xyz"
```

## 🔧 Step 1: Contract Deployment

### Local Test
```bash
cd monad-studio/contracts
npm test
npm run compile
```

### Monad Testnet Deploy
```bash
# Deploy all contracts
npm run deploy:testnet

# Or manually:
npx hardhat run scripts/deploy.js --network monadTestnet
```

### Expected Output
```
✅ DataTypes: 0x...
✅ ColorLib: 0x...
✅ GeometryLib: 0x...
✅ PathwayLib: 0x...
✅ NeuralRenderer: 0x...
✅ MONARA: 0x1234567890123456789012345678901234567890
```

## 🔐 Step 2: Security Configuration

### Contract Security Features
- ✅ Rate limiting (10 mints per hour)
- ✅ Pausable functionality
- ✅ Role-based access control
- ✅ Emergency withdrawal with 7-day delay
- ✅ Reentrancy protection
- ✅ Input validation

### Admin Commands
```javascript
// Pause contract
await contract.pause();

// Emergency functions
await contract.requestEmergencyWithdraw();
// Wait 7 days then:
await contract.executeEmergencyWithdraw();

// Rate limit management
await contract.resetRateLimit(userAddress);
```

## 🌐 Step 3: Frontend Configuration

### Environment Variables
Deployment sonrası frontend `.env.local` dosyasını güncelleyin:

```bash
# Contract address from deployment
NEXT_PUBLIC_MONARA_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_CHAIN_ID=10143
NEXT_PUBLIC_NETWORK_NAME="monadTestnet"

# RPC Configuration
NEXT_PUBLIC_MONAD_RPC_URL="https://testnet-rpc.monad.xyz"

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID="your_analytics_id"
```

### Frontend Deployment
```bash
cd ../frontend
npm run build
npm run start
```

## 🛡️ Step 4: Security Verification

### Contract Verification Checklist
- [ ] All libraries deployed correctly
- [ ] Main contract initialized with correct parameters
- [ ] Owner address set correctly
- [ ] Security features (pause, rate limiting) working
- [ ] Mint prices configured (0.1 MON Neural, 0.25 MON Quantum)

### Frontend Security Checklist
- [ ] CSP headers configured
- [ ] Input validation working
- [ ] Rate limiting enforced
- [ ] XSS protection enabled
- [ ] HTTPS enforced (production)

### Test Minting
```javascript
// Test neural genesis mint
await contract.neuralGenesis({ value: ethers.parseEther("0.1") });

// Test quantum genesis mint
await contract.quantumGenesis({ value: ethers.parseEther("0.25") });
```

## 📊 Step 5: Monitoring & Analytics

### Contract Events
Monitor these events for security:
- `DigitalBeingCreated` - Normal minting
- `RateLimitHit` - Rate limit violations
- `EmergencyWithdrawRequested` - Emergency actions
- `Paused/Unpaused` - Admin actions

### Monitoring Script
```javascript
// Monitor contract events
contract.on("RateLimitHit", (user, timestamp) => {
  console.warn(`Rate limit hit by ${user} at ${timestamp}`);
});

contract.on("DigitalBeingCreated", (tokenId, owner, isQuantum, mutation) => {
  console.log(`New NFT #${tokenId} minted by ${owner}`);
});
```

## 🚨 Step 6: Emergency Procedures

### Pause Protocol
```bash
# If security issue detected:
npx hardhat console --network monadTestnet
> const contract = await ethers.getContractAt("MONARA", "CONTRACT_ADDRESS");
> await contract.pause();
```

### Recovery Procedures
1. **Rate Limit Issues**: Use `resetRateLimit(address)`
2. **Contract Issues**: Use pause functionality
3. **Critical Issues**: Initiate emergency withdrawal
4. **Frontend Issues**: Update CSP headers, validate inputs

## 📈 Step 7: Production Optimizations

### Performance
- Enable gzip compression
- Use CDN for static assets
- Optimize image loading
- Implement service worker

### Security Hardening
```javascript
// Additional security headers
const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
```

## 🔍 Step 8: Testing Protocol

### Manual Testing
1. Connect wallet to Monad Testnet
2. Test neural mint (0.1 MON)
3. Test quantum mint (0.25 MON)
4. Verify NFT metadata generation
5. Test rate limiting (try 11 mints)
6. Test pause/unpause functionality

### Automated Testing
```bash
# Run comprehensive test suite
npm run test:full

# Test security features
npm run test:security

# Test gas optimization
npm run test:gas
```

## 💡 Key Security Features

### Smart Contract Level
- **Rate Limiting**: Max 10 mints per hour per address
- **Pausable**: Emergency stop functionality
- **Access Control**: Role-based permissions
- **Emergency Withdrawal**: 7-day delay protection
- **Input Validation**: Comprehensive parameter checking

### Frontend Level
- **CSP Headers**: Prevent XSS attacks
- **Input Sanitization**: DOMPurify integration
- **Rate Limiting**: Client-side protection
- **Network Validation**: Ensure correct chain
- **Error Handling**: Secure error messages

## 📞 Support & Troubleshooting

### Common Issues
1. **Gas Estimation Failed**: Check network connection
2. **Rate Limited**: Wait 1 hour or reset via admin
3. **Insufficient Funds**: Ensure wallet has enough MON
4. **Contract Not Ready**: Wait for deployment confirmation

### Debug Commands
```bash
# Check contract status
npx hardhat console --network monadTestnet
> const contract = await ethers.getContractAt("MONARA", "ADDRESS");
> await contract.mintingActive();
> await contract.paused();

# Check user rate limit
> await contract.getRateLimitInfo("USER_ADDRESS");
```

## 🎉 Deployment Complete!

Başarılı deployment sonrası:
1. Contract address'ini kaydedin
2. Frontend environment variables'ları güncelleyin
3. Test minting yapın
4. Security monitoring başlatın
5. Community'ye duyurun!

---

**⚠️ Güvenlik Uyarısı**: Private key'lerinizi asla paylaşmayın ve production'da multisig wallet kullanın.

**📧 Destek**: Sorunlar için GitHub Issues kullanın. 