"use client";

import Link from "next/link";
import { useState } from "react";
import type { auth } from "~/server/utils/auth";

type SessionType = Awaited<ReturnType<typeof auth.api.getSession>>;

export default function Header({ session }: { session: SessionType }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="mt-4 flex w-full justify-center px-4 md:mt-6">
      <nav className="relative flex w-full max-w-6xl items-center justify-between rounded-full border border-gray-300 px-4 py-3 md:px-8">
        {/* Mobile Menu Button (kept for potential future items) */}
        <button
          className="flex flex-col gap-1 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`h-0.5 w-5 bg-black transition-all ${isMenuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
          <div className={`h-0.5 w-5 bg-black transition-all ${isMenuOpen ? "opacity-0" : ""}`} />
          <div className={`h-0.5 w-5 bg-black transition-all ${isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
        </button>

        {/* Desktop Nav Links - removed per request */}
        <div className="hidden md:flex" />

        {/* Logo / Title Center */}
        <div className="absolute left-1/2 -translate-x-1/2 transform">
          <h1 className="font-[Inter] text-xl md:text-2xl">Parallel</h1>
        </div>

        {/* Right Side */}
        {session?.user ? (
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/glow-up-protocol"
              className="rounded-full bg-black px-4 py-1.5 text-sm text-white md:px-6 md:text-base"
            >
              Glow Up Protocol
            </Link>
            <Link
              href="/analysis"
              className="rounded-full border border-gray-300 px-4 py-1.5 text-sm text-black hover:bg-gray-50 md:px-6 md:text-base"
            >
              Analysis
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3 md:gap-5">
            <Link href="/auth" className="hidden text-black hover:text-gray-600 sm:block md:text-base">
              Login
            </Link>
            <Link href="/auth" className="rounded-full bg-black px-4 py-1.5 text-sm text-white md:px-6 md:py-2 md:text-base">
              <span className="hidden sm:inline">Join Now →</span>
              <span className="sm:hidden">Join</span>
            </Link>
          </div>
        )}

        {/* Mobile Menu Overlay (links removed) */}
        {isMenuOpen && (
          <div className="absolute top-full right-0 left-0 mt-2 rounded-2xl border border-gray-300 bg-white p-4 shadow-lg md:hidden">
            <div className="flex flex-col gap-4">
              {session?.user ? (
                <>
                  <Link href="/glow-up-protocol" className="" onClick={() => setIsMenuOpen(false)}>
                    <span className="rounded-md bg-black px-4 py-1.5 text-white">Glow Up Protocol</span>
                  </Link>
                  <Link href="/analysis" className="" onClick={() => setIsMenuOpen(false)}>
                    <span className="rounded-md border border-gray-300 px-4 py-1.5 text-black">Analysis</span>
                  </Link>
                </>
              ) : (
                <Link href="/auth" className="text-black hover:text-gray-600 sm:hidden" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
