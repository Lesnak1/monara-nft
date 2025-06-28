'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Eye, 
  Database, 
  Lock, 
  Cookie,
  UserCheck,
  Clock,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

export default function PrivacyPage() {
  const lastUpdated = '2024-01-01';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-teal-400 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we protect your data.
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-white/50">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12 space-y-8">
          
          {/* 1. Overview */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Eye className="w-6 h-6 text-blue-400 mr-3" />
              1. Overview
            </h2>
            <p className="text-white/80 leading-relaxed mb-4">
              MONARA is committed to protecting your privacy and being transparent about the data we collect. 
              As a decentralized application, we minimize data collection and prioritize user privacy.
            </p>
            <p className="text-white/80 leading-relaxed">
              This Privacy Policy explains how we collect, use, and protect your information when you use 
              the MONARA platform to interact with evolving digital beings on the Monad Network.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Database className="w-6 h-6 text-purple-400 mr-3" />
              2. Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Blockchain Data</h3>
                <p className="text-white/80 leading-relaxed">
                  Your wallet address and transaction history on the Monad blockchain are publicly visible. 
                  This includes NFT minting, trading, and evolution activities.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Usage Analytics</h3>
                <p className="text-white/80 leading-relaxed mb-3">
                  We may collect anonymous usage data to improve the platform:
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-1 ml-4">
                  <li>Page views and user interactions</li>
                  <li>Browser type and device information</li>
                  <li>IP address (anonymized)</li>
                  <li>Time spent on the platform</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Cookies and Local Storage</h3>
                <p className="text-white/80 leading-relaxed">
                  We use essential cookies and local storage to remember your preferences and improve 
                  your experience. No tracking cookies are used for advertising purposes.
                </p>
              </div>
            </div>
          </section>

          {/* 3. How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <UserCheck className="w-6 h-6 text-green-400 mr-3" />
              3. How We Use Your Information
            </h2>
            <div className="space-y-3 text-white/80">
              <p>• <strong>Platform Operations:</strong> To provide and maintain MONARA services</p>
              <p>• <strong>NFT Evolution:</strong> To calculate and display evolution stages for your digital beings</p>
              <p>• <strong>User Experience:</strong> To personalize your experience and remember preferences</p>
              <p>• <strong>Analytics:</strong> To understand usage patterns and improve the platform</p>
              <p>• <strong>Security:</strong> To detect and prevent fraudulent or malicious activities</p>
              <p>• <strong>Communication:</strong> To respond to your inquiries and provide support</p>
            </div>
          </section>

          {/* 4. Data Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Lock className="w-6 h-6 text-orange-400 mr-3" />
              4. Data Sharing and Disclosure
            </h2>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 space-y-3 text-white/80">
              <p><strong>We do not sell your personal data.</strong></p>
              <p>We may share anonymized, aggregated data for research and analytics purposes.</p>
              <p>Blockchain data is inherently public and visible to anyone on the Monad Network.</p>
              <p>We may disclose information if required by law or to protect our rights and safety.</p>
            </div>
          </section>

          {/* 5. Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Third-Party Services</h2>
            <div className="space-y-4 text-white/80">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Wallet Providers</h3>
                <p>
                  We integrate with wallet providers like MetaMask, WalletConnect, and others. 
                  These services have their own privacy policies that govern your data.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Blockchain Infrastructure</h3>
                <p>
                  We use RPC providers and blockchain explorers to interact with the Monad Network. 
                  Your IP address may be visible to these services.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Analytics Services</h3>
                <p>
                  We may use privacy-focused analytics services to understand user behavior. 
                  No personal data is shared with these services.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Shield className="w-6 h-6 text-red-400 mr-3" />
              6. Data Security
            </h2>
            <div className="space-y-4 text-white/80">
              <p>
                We implement appropriate technical and organizational measures to protect your data:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-white/70">
                <li>HTTPS encryption for all data transmission</li>
                <li>Secure hosting infrastructure with regular security updates</li>
                <li>Access controls and monitoring for our systems</li>
                <li>Regular security audits and vulnerability assessments</li>
              </ul>
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mt-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    <strong>Important:</strong> No system is 100% secure. Blockchain transactions are irreversible, 
                    so please verify all actions before confirming.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Your Privacy Rights</h2>
            <div className="space-y-4 text-white/80">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Blockchain Data</h3>
                <p>
                  Blockchain data is immutable and cannot be deleted. You can stop using the platform 
                  to prevent further data collection.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Analytics Data</h3>
                <p>
                  You can opt out of analytics tracking by using browser settings or privacy tools.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Cookies</h3>
                <p>
                  You can disable cookies in your browser settings, though this may affect platform functionality.
                </p>
              </div>
            </div>
          </section>

          {/* 8. International Transfers */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. International Data Transfers</h2>
            <p className="text-white/80 leading-relaxed">
              As a decentralized platform, data may be processed in various jurisdictions. 
              We ensure appropriate safeguards are in place for international data transfers 
              in compliance with applicable privacy laws.
            </p>
          </section>

          {/* 9. Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
            <p className="text-white/80 leading-relaxed">
              MONARA is not intended for users under 18 years of age. We do not knowingly collect 
              personal information from children. If you believe a child has provided us with 
              personal information, please contact us immediately.
            </p>
          </section>

          {/* 10. Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Policy</h2>
            <p className="text-white/80 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify users of significant 
              changes through our platform or other appropriate means. Your continued use of MONARA 
              after any changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* 11. Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              If you have any questions or concerns about this Privacy Policy or our data practices:
            </p>
            <div className="bg-white/5 rounded-xl p-4">
              <Link 
                href="/contact" 
                className="text-purple-400 hover:text-purple-300 transition-colors flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Contact Privacy Team
              </Link>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/60 text-sm">
              Your privacy is important to us. This policy helps you understand how we protect your data.
            </p>
            <div className="flex justify-center space-x-6 mt-4">
              <Link href="/terms" className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                Contact Us
              </Link>
              <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 