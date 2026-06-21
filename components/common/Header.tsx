'use client';

import Link from 'next/link';
import { useAuthContext } from '@/lib/context/AuthContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Zap } from 'lucide-react';

const WA_ICON = (
  <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" />
  </svg>
);

const navLinks = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/services', label: 'Services', icon: '🔧' },
  { href: '/gallery', label: 'Gallery', icon: '📷' },
  { href: '/file-complaint', label: 'Book Service', icon: '📋' },
  { href: '/feedback', label: 'Feedback', icon: '⭐' },
  { href: '/track-complaint', label: 'Track Request', icon: '🔍' },
];

export function Header() {
  const { isAuthenticated, isAdmin, logout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(255,255,255,0.95)'
            : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(21,101,192,0.1)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 24px rgba(21,101,192,0.08)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-5 h-16 flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" onClick={() => setIsOpen(false)}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1565C0] to-[#1E88E5] flex items-center justify-center shadow-md flex-shrink-0">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="leading-tight">
              <span className="font-black text-lg text-[#1565C0] block leading-none">Shree Devi</span>
              <span className="font-bold text-[11px] text-[#F57C00] uppercase tracking-widest block leading-none">Services</span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3.5 py-2 text-sm font-semibold text-gray-600 hover:text-[#1565C0] rounded-xl hover:bg-blue-50 transition-all duration-200 group"
              >
                {link.label}
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#1565C0] rounded-full group-hover:w-4 transition-all duration-200" />
              </Link>
            ))}
          </nav>

          {/* ── Desktop CTAs ── */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <a
              href="tel:+917337843016"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm text-[#1565C0] bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-100"
            >
              <Phone className="w-4 h-4" />
              +91 73378 43016
            </a>
            <a
              href="https://wa.me/917337843016?text=Hello%20Shree%20Devi%20Services%2C%20I%20need%20help%20with%20a%20service."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-md hover:shadow-lg active:scale-95"
              style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}
            >
              {WA_ICON}
              WhatsApp
            </a>
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 bg-[#1565C0] text-white rounded-xl text-sm font-semibold hover:bg-[#0D47A1] transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => logout()}
                  className="px-3 py-2 text-gray-500 hover:text-[#1565C0] text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* ── Mobile Right ── */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href="tel:+917337843016"
              className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1565C0] hover:bg-blue-100 transition-colors"
              aria-label="Call us"
            >
              <Phone className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/917337843016?text=Hello%20Shree%20Devi%20Services%2C%20I%20need%20help."
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-colors"
              style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}
              aria-label="WhatsApp"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" />
              </svg>
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen
                  ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X className="w-5 h-5 text-gray-700" /></motion.div>
                  : <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu className="w-5 h-5 text-gray-700" /></motion.div>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer Overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              className="fixed top-0 right-0 bottom-0 w-[80vw] max-w-sm z-50 bg-white shadow-2xl flex flex-col lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1565C0] to-[#1E88E5] flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="font-black text-[#1565C0]">Shree Devi Services</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Nav Links */}
              <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-4 rounded-2xl text-gray-700 hover:bg-blue-50 hover:text-[#1565C0] font-semibold text-base transition-all active:scale-95"
                    >
                      <span className="text-2xl w-8 text-center">{link.icon}</span>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {isAuthenticated && (
                  <div className="pt-2 border-t border-gray-100 mt-2">
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-4 rounded-2xl text-[#1565C0] bg-blue-50 font-semibold text-base"
                      >
                        <span className="text-2xl w-8 text-center">⚙️</span>
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="flex items-center gap-3 px-4 py-4 rounded-2xl text-red-500 font-semibold text-base w-full text-left"
                    >
                      <span className="text-2xl w-8 text-center">🚪</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom CTAs */}
              <div className="p-4 border-t border-gray-100 space-y-3" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
                <a
                  href="https://wa.me/917337843016?text=Hello%20Shree%20Devi%20Services%2C%20I%20need%20help%20with%20a%20service."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl text-white font-bold text-base active:scale-95 transition-transform"
                  style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}
                >
                  {WA_ICON}
                  Chat on WhatsApp
                </a>
                <a
                  href="tel:+917337843016"
                  className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl text-[#1565C0] font-bold text-base bg-blue-50 border border-blue-100 active:scale-95 transition-transform"
                >
                  <Phone className="w-5 h-5" />
                  Call: +91 73378 43016
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
