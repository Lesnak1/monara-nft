import React from 'react';
import Link from 'next/link';
import { 
  Twitter, 
  Github, 
  ExternalLink, 
  Heart,
  Sparkles,
  Zap,
  Globe,
  Mail,
  Shield,
  FileText,
  Info
} from 'lucide-react';

const FOOTER_LINKS = {
  product: [
    { name: 'Mint NFT', href: '/mint' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'About', href: '/about' },
  ],
  resources: [
    { name: 'Documentation', href: '/documentation' },
    { name: 'API Reference', href: '/api-reference' },
    { name: 'Smart Contract', href: '/smart-contract' },
  ],
  community: [
    { name: 'Twitter', href: 'https://twitter.com/monad_xyz', external: true, icon: Twitter },
    { name: 'GitHub', href: 'https://github.com/monad-xyz', external: true, icon: Github },
    { name: 'Discord', href: 'https://discord.gg/monad', external: true, icon: Globe },
  ],
  legal: [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Contact Us', href: '/contact' },
  ]
};

const SOCIAL_LINKS = [
  {
    name: 'Twitter',
    href: 'https://twitter.com/monad_xyz',
    icon: Twitter,
    color: 'hover:text-blue-400'
  },
  {
    name: 'GitHub', 
    href: 'https://github.com/monad-xyz',
    icon: Github,
    color: 'hover:text-gray-300'
  },
  {
    name: 'Monad Network',
    href: 'https://monad.xyz',
    icon: Globe,
    color: 'hover:text-purple-400'
  }
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative border-t border-white/10 bg-black/40 backdrop-blur-sm">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-teal-400 bg-clip-text text-transparent">
                  MONARA
                </h2>
                <p className="text-white/70 max-w-md leading-relaxed">
                  Evolving Digital Beings on Monad Network. Experience the future of NFTs with dynamic, 
                  neural-powered artworks that grow and adapt through blockchain computation.
                </p>
              </div>
              
              {/* Network Info */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-white">Powered by Monad</span>
                </div>
                <p className="text-xs text-white/60">
                  Ultra-fast, EVM-compatible blockchain with 10,000+ TPS
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 hover:scale-110 ${social.color}`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            
            {/* Product Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Product</h3>
              <ul className="space-y-3">
                {FOOTER_LINKS.product.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Resources Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Resources</h3>
              <ul className="space-y-3">
                {FOOTER_LINKS.resources.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Legal Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Legal</h3>
              <ul className="space-y-3">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-4 text-sm text-white/60">
              <span>© {currentYear} MONARA. All rights reserved.</span>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-400 fill-current" />
                <span>on Monad</span>
              </div>
            </div>
            
            {/* Built by Leknax */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-white/60">Built by</span>
              <a
                href="https://github.com/leknax"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-200 hover:scale-105"
              >
                <Github className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                <span className="font-medium text-purple-300 group-hover:text-purple-200">
                  Leknax
                </span>
                <ExternalLink className="w-3 h-3 text-purple-400/70 group-hover:text-purple-300" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-1/4 w-px h-12 bg-gradient-to-b from-purple-500/50 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-12 bg-gradient-to-b from-teal-500/50 to-transparent" />
      </div>
    </footer>
  );
} 