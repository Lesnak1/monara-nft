'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            {/* Animated 404 */}
            <div className="mb-8">
              <h1 className="text-6xl font-bold gradient-text mb-4">
                404
              </h1>
              <h2 className="text-2xl font-semibold text-white/90 mb-4">
                Digital Being Not Found
              </h2>
              <p className="text-lg text-white/70 mb-8 max-w-md">
                This neural pathway doesn&apos;t exist in our network. Perhaps it&apos;s evolving elsewhere?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/"
                className="btn-primary text-lg px-8 py-4"
              >
                Return to Genesis
              </Link>
              
              <Link
                href="/gallery"
                className="btn-secondary text-lg px-8 py-4"
              >
                Explore Gallery
              </Link>
            </div>

            {/* Neural Network Animation */}
            <div className="mt-16 relative">
              <div className="flex justify-center space-x-8 opacity-30">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 bg-gradient-to-r from-purple-600 to-emerald-600 rounded-full neural-glow"
                    style={{
                      animationDelay: `${i * 200}ms`
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-center space-x-16 mt-4 opacity-20">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full neural-glow"
                    style={{
                      animationDelay: `${i * 300}ms`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 