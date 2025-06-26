# 🌐 Network Troubleshooting Guide

Bu guide Monad testnet bağlantı problemlerini çözmek için hazırlanmıştır.

## 🚨 Common Issues

### 1. "Failed to fetch" Hatası

**Semptom**: Mint sayfasında "yetersiz bakiye" uyarısı alıyorsunuz ancak cüzdanınızda MON token var.

**Çözümler**:

#### A. Browser Cache Temizleme
```bash
1. Browser cache'i temizleyin (Ctrl+Shift+Delete)
2. MetaMask cache'i temizleyin:
   - MetaMask Settings > Advanced > Reset Account
3. Sayfayı yenileyin (F5)
```

#### B. Network Ayarlarını Kontrol Edin
```
Network Name: Monad Testnet
Chain ID: 10143
RPC URL: https://testnet-rpc.monad.xyz
Currency: MON
Block Explorer: https://testnet.monadexplorer.com
```

#### C. Alternative RPC Endpoints
Eğer ana RPC çalışmıyorsa, alternatif endpoint'leri deneyin:

1. **ThirdWeb RPC**: `https://monad-testnet.rpc.thirdweb.com`
2. **PublicNode RPC**: `https://monad-testnet-rpc.publicnode.com`

Manual olarak MetaMask'te RPC URL'i değiştirebilirsiniz:
1. MetaMask > Settings > Networks > Monad Testnet > Edit
2. RPC URL'i yukarıdaki alternatiflerden biriyle değiştirin
3. Save yapın ve yeniden deneyin

### 2. Balance Görünmüyor

**Çözümler**:
1. Debug panelinde "🔄 Refresh Balance Manually" butonuna tıklayın
2. MetaMask'te network'ü değiştirip tekrar Monad'a dönün
3. Wallet'ı disconnect edip yeniden connect edin

### 3. Transaction Fail Oluyor

**Çözümler**:
1. Gas limit'i artırın (2,000,000 gas)
2. Gas price'ı artırın (100+ Gwei)
3. Farklı RPC endpoint deneyin
4. Transaction'ı daha sonra tekrar deneyin

## 🔧 Advanced Troubleshooting

### Browser Extension Conflicts
Bazı browser extension'ları web3 bağlantıları ile conflict edebilir:

1. **Ad blockers**: uBlock Origin, AdBlock Plus
2. **VPN/Proxy**: ExpressVPN, NordVPN
3. **Privacy tools**: Ghostery, Privacy Badger

**Çözüm**: Extension'ları geçici olarak disable edin.

### CORS Issues
Eğer hala CORS hataları alıyorsanız:

1. Chrome'u CORS disable mode'da açın:
```bash
chrome.exe --user-data-dir=/tmp/chrome_dev_session --disable-web-security --disable-features=VizDisplayCompositor
```

2. Farklı browser deneyin (Firefox, Brave)

### Firewall/Antivirus
Firewall veya antivirus yazılımları RPC isteklerini block edebilir:

1. Windows Defender > Allow an app
2. Browser'ı whitelist'e ekleyin
3. Port 443 (HTTPS) açık olduğundan emin olun

## 📊 Debug Information

Debug panelinde şu bilgileri kontrol edin:

```
✅ İyi durumlar:
- Wallet Balance: > 0 MON
- Contract Ready: ✅ Yes
- Minting Active: ✅ Yes
- Contract Paused: ▶️ No

❌ Problem durumları:
- Balance Error: RPC connection failed
- Contract Ready: ❌ No
- Balance: 0 MON (ama gerçekte var)
```

## 🆘 Emergency Solutions

### 1. Manual RPC Test
Browser console'da (F12) şu kodu çalıştırın:

```javascript
// Test primary RPC
fetch('https://testnet-rpc.monad.xyz', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_blockNumber',
    params: [],
    id: 1
  })
}).then(r => r.json()).then(console.log);
```

### 2. Force Refresh All
```javascript
// Browser console'da çalıştırın
localStorage.clear();
sessionStorage.clear();
location.reload(true);
```

### 3. Network Status Check
[Monad Status Page](https://status.monad.xyz) - Network durumunu kontrol edin

## 📞 Support

Hala çözüm bulamıyorsanız:

1. **Discord**: [Monad Developer Discord](https://discord.gg/monad)
2. **GitHub Issues**: Repository'de issue açın
3. **Explorer**: [Monad Testnet Explorer](https://testnet.monadexplorer.com) ile transaction'ları kontrol edin

## 🔄 Auto-Recovery Features

MONARA uygulaması otomatik olarak:

- ✅ 3 farklı RPC endpoint'i dener
- ✅ Retry logic ile bağlantı problemlerini çözer
- ✅ Fallback balance check methodları kullanır
- ✅ Detaylı error reporting sağlar

Bu features sayesinde çoğu network problemi otomatik olarak çözülmelidir. 