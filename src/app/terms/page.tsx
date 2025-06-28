'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Scale, 
  Shield, 
  AlertTriangle, 
  Clock, 
  Users,
  FileText,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export default function TermsPage() {
  const lastUpdated = '2024-01-01';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-teal-400 bg-clip-text text-transparent mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Please read these terms carefully before using MONARA services
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-white/50">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12 space-y-8">
          
          {/* 1. Agreement */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <CheckCircle2 className="w-6 h-6 text-green-400 mr-3" />
              1. Agreement to Terms
            </h2>
            <p className="text-white/80 leading-relaxed mb-4">
              By accessing and using the MONARA platform, you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p className="text-white/80 leading-relaxed">
              MONARA is a decentralized application (dApp) that allows users to mint, trade, and interact with 
              evolving digital beings (NFTs) on the Monad Network blockchain.
            </p>
          </section>

          {/* 2. Eligibility */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Users className="w-6 h-6 text-blue-400 mr-3" />
              2. Eligibility
            </h2>
            <div className="space-y-3 text-white/80">
              <p>You must be at least 18 years old to use MONARA services.</p>
              <p>You must have the legal capacity to enter into binding agreements.</p>
              <p>Your use of MONARA must comply with all applicable laws and regulations in your jurisdiction.</p>
              <p>You are prohibited from using MONARA if you are located in a jurisdiction where such use is illegal.</p>
            </div>
          </section>

          {/* 3. NFT Ownership and Rights */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Shield className="w-6 h-6 text-purple-400 mr-3" />
              3. NFT Ownership and Rights
            </h2>
            <div className="space-y-4 text-white/80">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Ownership Rights</h3>
                <p>When you purchase a MONARA NFT, you own the NFT token and the associated digital artwork. This ownership is recorded on the Monad blockchain and is subject to the smart contract terms.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">License Grant</h3>
                <p>You are granted a worldwide, non-exclusive, royalty-free license to use, copy, and display the digital artwork for personal, non-commercial purposes.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Evolution Rights</h3>
                <p>MONARA NFTs are designed to evolve through computational stages. You acknowledge that the visual appearance of your NFT may change over time as part of its intended evolutionary process.</p>
              </div>
            </div>
          </section>

          {/* 4. Platform Risks */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 text-yellow-400 mr-3" />
              4. Platform and Blockchain Risks
            </h2>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 space-y-3 text-white/80">
              <p><strong>Smart Contract Risk:</strong> MONARA operates through smart contracts on the Monad blockchain. These contracts are immutable and cannot be changed once deployed.</p>
              <p><strong>Network Risk:</strong> The Monad Network is a blockchain technology that may experience downtime, congestion, or other technical issues.</p>
              <p><strong>Regulatory Risk:</strong> The regulatory landscape for blockchain technology and NFTs is evolving and may impact the platform's operation.</p>
              <p><strong>Technical Risk:</strong> Bugs, vulnerabilities, or other technical issues may affect the platform's functionality.</p>
            </div>
          </section>

          {/* 5. User Conduct */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <FileText className="w-6 h-6 text-teal-400 mr-3" />
              5. User Conduct
            </h2>
            <div className="space-y-3 text-white/80">
              <p>You agree not to use MONARA for any unlawful or prohibited activities.</p>
              <p>You will not attempt to manipulate, exploit, or abuse the evolution mechanisms of MONARA NFTs.</p>
              <p>You will not engage in market manipulation or fraudulent trading activities.</p>
              <p>You will not attempt to reverse engineer, hack, or compromise the platform's security.</p>
            </div>
          </section>

          {/* 6. Disclaimers */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Disclaimers</h2>
            <div className="space-y-4 text-white/80">
              <p>
                MONARA is provided "as is" without warranties of any kind. We do not guarantee the platform's 
                availability, functionality, or security.
              </p>
              <p>
                The value of NFTs is highly speculative and may fluctuate significantly. We make no representations 
                about the future value or utility of MONARA NFTs.
              </p>
              <p>
                Evolution mechanisms are algorithmic and may not function as expected. We do not guarantee specific 
                evolutionary outcomes for your NFTs.
              </p>
            </div>
          </section>

          {/* 7. Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
            <p className="text-white/80 leading-relaxed">
              To the maximum extent permitted by law, MONARA and its creators shall not be liable for any direct, 
              indirect, incidental, special, or consequential damages arising from your use of the platform, 
              including but not limited to loss of funds, NFTs, or data.
            </p>
          </section>

          {/* 8. Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Changes to Terms</h2>
            <p className="text-white/80 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon 
              posting. Your continued use of MONARA after any changes constitutes acceptance of the new terms.
            </p>
          </section>

          {/* 9. Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Contact Information</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-white/5 rounded-xl p-4">
              <Link 
                href="/contact" 
                className="text-purple-400 hover:text-purple-300 transition-colors flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Contact Support
              </Link>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/60 text-sm">
              By using MONARA, you acknowledge that you have read, understood, and agreed to these Terms of Service.
            </p>
            <div className="flex justify-center space-x-6 mt-4">
              <Link href="/privacy" className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                Privacy Policy
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