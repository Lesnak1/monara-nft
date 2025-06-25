'use client';

import { Header } from '@/components/layout/Header';
import MintComponent from '@/components/mint/MintComponent';

export default function MintPage() {
  return (
    <>
      <Header />
      
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4 opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-emerald-400 bg-clip-text text-transparent">
                Neural Genesis
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Create your evolving digital being on Monad Network. Choose your genesis type and customize your neural pathways.
            </p>
          </div>
          
          {/* Mint Component */}
          <div className="opacity-0 animate-[slideUp_1s_ease-out_0.2s_forwards]">
            <MintComponent />
          </div>
        </div>
      </main>
    </>
  );
} 