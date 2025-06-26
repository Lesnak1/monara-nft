'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTheme } from 'next-themes';
import { 
  Bars3Icon, 
  XMarkIcon,
  SunIcon,
  MoonIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useNetwork } from '@/hooks/useNetwork';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Mint', href: '/mint' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'About', href: '/about' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  
  const { isConnected } = useAccount();
  const { isWrongNetwork, switchToMonad, getNetworkStatus, currentNetwork } = useNetwork();

  const networkStatus = getNetworkStatus();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group transition-transform hover:scale-105">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-purple-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <span className="text-white font-bold text-lg select-none">M</span>
            </div>
            <div className="hidden sm:block">
              <div className="flex flex-col">
                <span className="text-xl font-bold gradient-text leading-none">MONARA</span>
                <span className="text-xs text-slate-400 leading-none">Neural Beings</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  pathname === item.href
                    ? 'text-white bg-white/10 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.name}
                {pathname === item.href && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Network Status - Enhanced for Monad */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="flex items-center space-x-2">
                {isWrongNetwork ? (
                  <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" />
                ) : (
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                )}
                <span className={`text-xs font-medium ${networkStatus.color}`}>
                  {currentNetwork.name === 'Monad Testnet' ? 'Monad' : currentNetwork.name}
                </span>
              </div>
              {isWrongNetwork && (
                <button
                  onClick={switchToMonad}
                  className="text-xs bg-yellow-500 hover:bg-yellow-600 text-black px-2 py-1 rounded-md font-medium transition-colors"
                >
                  Switch
                </button>
              )}
            </div>

            {/* Theme Toggle - Always Visible */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200 flex-shrink-0"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <SunIcon className="w-5 h-5 text-slate-300 hover:text-yellow-400 transition-colors" />
              ) : (
                <MoonIcon className="w-5 h-5 text-slate-300 hover:text-blue-400 transition-colors" />
              )}
            </button>

            {/* Wallet Connection - RainbowKit */}
            <div className="flex items-center">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  mounted,
                }) => {
                  const ready = mounted;
                  const connected = ready && account && chain;

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        style: {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
              <button
                              onClick={openConnectModal}
                className="btn btn-primary text-sm px-3 sm:px-4 py-2 font-medium whitespace-nowrap"
              >
                <span className="hidden sm:inline">Connect Wallet</span>
                              <span className="sm:hidden">Connect</span>
                            </button>
                          );
                        }

                        if (chain.unsupported || isWrongNetwork) {
                          return (
                            <button
                              onClick={openChainModal}
                              className="btn bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-sm px-3 sm:px-4 py-2 font-medium whitespace-nowrap"
                            >
                              Wrong Network
                            </button>
                          );
                        }

                        return (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={openChainModal}
                              className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                            >
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                              <span className="text-sm font-medium text-white">
                                {chain.name}
                </span>
              </button>
                            
                            <button
                              onClick={openAccountModal}
                              className="flex items-center space-x-2 px-3 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                            >
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                              <span className="text-sm font-medium text-white">
                                <span className="hidden sm:inline">{account.displayName}</span>
                                <span className="sm:hidden">{account.displayName?.slice(0, 6)}</span>
                              </span>
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200 flex-shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-slate-300" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-slate-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 py-4 mt-4">
            <div className="space-y-2">
              {/* Mobile Network Status */}
              <div className="px-3 py-3 bg-white/5 backdrop-blur-sm rounded-lg mb-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {isWrongNetwork ? (
                      <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    )}
                    <span className={`text-sm font-medium ${networkStatus.color}`}>
                      {currentNetwork.name}
                    </span>
                  </div>
                  {isWrongNetwork && (
                    <button
                      onClick={() => {
                        switchToMonad();
                        setMobileMenuOpen(false);
                      }}
                      className="text-xs bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded-md font-medium transition-colors"
                    >
                      Switch Network
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Theme Toggle */}
              <div className="px-3 py-3 bg-white/5 backdrop-blur-sm rounded-lg mb-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">Theme</span>
                  <button
                    onClick={() => {
                      setTheme(theme === 'dark' ? 'light' : 'dark');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-md transition-colors"
                  >
                    {theme === 'dark' ? (
                      <>
                        <SunIcon className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-slate-300">Light</span>
                      </>
                    ) : (
                      <>
                        <MoonIcon className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-slate-300">Dark</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Mobile Navigation Links */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-lg transition-all duration-200 ${
                    pathname === item.href
                      ? 'text-white bg-white/10 border border-white/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Wallet Connection */}
              {isConnected ? (
                <div className="px-3 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-white">
                        Connected
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                      }}
                      className="text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded-md transition-colors"
                    >
                      Wallet Options
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                  }}
                  className="w-full btn btn-primary text-sm py-3 mt-4"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 