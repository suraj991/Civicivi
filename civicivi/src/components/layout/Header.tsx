"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, User, Landmark } from "lucide-react";
import { loadProfile } from "@/lib/storage";
import type { CivicProfile } from "@/lib/types";

const navLinks = [
  { href: "/bills", label: "Explore Bills" },
  { href: "/profile", label: "My Profile" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState<CivicProfile | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/90 backdrop-blur-lg border-b border-slate-800/60 shadow-xl shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:bg-indigo-500 transition-colors">
            <Landmark className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            <span className="text-white">Civi</span>
            <span className="text-indigo-400">Civi</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                pathname.startsWith(link.href)
                  ? "bg-indigo-500/15 text-indigo-300"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {profile ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-sm font-medium hover:bg-indigo-500/25 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>{profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "Profile"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </Link>
          ) : (
            <Link
              href="/profile"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
            >
              Create Profile
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-lg border-b border-slate-800 px-4 pb-4 pt-2 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith(link.href)
                  ? "bg-indigo-500/15 text-indigo-300"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!profile && (
            <Link
              href="/profile"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-lg bg-indigo-600 text-white text-sm font-semibold text-center"
            >
              Create Your Civic Profile
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
