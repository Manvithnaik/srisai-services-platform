'use client';

import Link from 'next/link';
import { useAuthContext } from '@/lib/context/AuthContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Zap, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

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

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9 rounded-xl skeleton" />;

  const isDark = resolvedTheme === 'dark';
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all border"
      style={{
        background: isDark ? 'rgba(232,160,64,0.15)' : 'rgba(26,58,92,0.08)',
        borderColor: isDark ? 'rgba(232,160,64,0.3)' : 'rgba(26,58,92,0.15)',
      }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light Mode' : 'Dark Mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark
          ? <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Sun className="w-4 h-4" style={{ color: '#E8A040' }} />
            </motion.div>
          : <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Moon className="w-4 h-4" style={{ color: '#1A3A5C' }} />
            </motion.div>
        }
      </AnimatePresence>
    </motion.button>
  );
}

export function Header() {
  const { isAuthenticated, isAdmin, logout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isDark = mounted && resolvedTheme === 'dark';

  const headerBg = scrolled
    ? isDark
      ? 'rgba(11,26,43,0.97)'
      : 'rgba(251,246,238,0.97)'
    : isDark
      ? 'rgba(11,26,43,0.85)'
      : 'rgba(251,246,238,0.85)';

  const borderColor = scrolled
    ? isDark ? 'rgba(232,160,64,0.15)' : 'rgba(26,58,92,0.12)'
    : 'transparent';

  return (
    <>
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: headerBg,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${borderColor}`,
          boxShadow: scrolled
            ? isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(26,58,92,0.08)'
            : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-5 h-16 flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" onClick={() => setIsOpen(false)}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1A3A5C, #C84B11)' }}
            >
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="leading-tight">
              <span className="font-black text-lg block leading-none" style={{ color: '#1A3A5C' }}
                    data-dark-color="#E8A040">
                <span className="dark:text-[#E8A040] text-[#1A3A5C]">Shree Devi</span>
              </span>
              <span className="font-bold text-[11px] uppercase tracking-widest block leading-none text-[#C84B11]">
                Services
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3.5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 group
                           text-gray-600 dark:text-gray-300
                           hover:text-[#C84B11] dark:hover:text-[#E8A040]
                           hover:bg-[#C84B11]/8 dark:hover:bg-[#E8A040]/10"
              >
                {link.label}
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full group-hover:w-4 transition-all duration-200 bg-[#C84B11] dark:bg-[#E8A040]" />
              </Link>
            ))}
          </nav>

          {/* ── Desktop CTAs ── */}
          <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0">
            <ThemeToggle />
            <a
              href="tel:+917337843016"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors
                         text-[#1A3A5C] dark:text-[#E8A040]
                         bg-[#1A3A5C]/8 dark:bg-[#E8A040]/10
                         border border-[#1A3A5C]/15 dark:border-[#E8A040]/20
                         hover:bg-[#1A3A5C]/15 dark:hover:bg-[#E8A040]/20"
            >
              <Phone className="w-4 h-4" />
              +91 73378 43016
            </a>
            <a
              href="https://wa.me/917337843016?text=Hello%20Shree%20Devi%20Services%2C%20I%20need%20help%20with%20a%20service."
              target="_blank" rel="noopener noreferrer"
              className="btn-whatsapp !min-h-0 !py-2.5 !text-sm !px-4 !rounded-xl"
            >
              {WA_ICON} WhatsApp
            </a>
            {isAuthenticated && (
              <>
                {isAdmin && (
                  <Link href="/admin"
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                    style={{ background: 'linear-gradient(135deg, #1A3A5C, #2A5080)' }}>
                    Admin
                  </Link>
                )}
                <button onClick={() => logout()}
                  className="px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-[#C84B11] dark:hover:text-[#E8A040] text-sm font-medium transition-colors">
                  Logout
                </button>
              </>
            )}
          </div>

          {/* ── Mobile Right ── */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <a href="tel:+917337843016"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                         text-[#1A3A5C] dark:text-[#E8A040]
                         bg-[#1A3A5C]/8 dark:bg-[#E8A040]/10"
              aria-label="Call us">
              <Phone className="w-4 h-4" />
            </a>
            <a href="https://wa.me/917337843016?text=Hello%20Shree%20Devi%20Services."
              target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
              aria-label="WhatsApp">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" /></svg>
            </a>
            <button onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                         bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}>
              <AnimatePresence mode="wait" initial={false}>
                {isOpen
                  ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X className="w-5 h-5 text-gray-700 dark:text-gray-200" /></motion.div>
                  : <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" /></motion.div>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div key="overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)} />

            <motion.div key="drawer"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              className="fixed top-0 right-0 bottom-0 w-[80vw] max-w-sm z-50 flex flex-col lg:hidden shadow-2xl"
              style={{ background: isDark ? '#0B1A2B' : 'white' }}>

              {/* Drawer header */}
              <div className="flex items-center justify-between p-5 border-b"
                style={{ borderColor: isDark ? '#1E3250' : '#E2D9CC' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #1A3A5C, #C84B11)' }}>
                    <Zap className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="font-black" style={{ color: isDark ? '#E8A040' : '#1A3A5C' }}>
                    Shree Devi Services
                  </span>
                </div>
                <button onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: isDark ? '#1A2F45' : '#F0E8DC' }}>
                  <X className="w-5 h-5" style={{ color: isDark ? '#9BA8B5' : '#6B7280' }} />
                </button>
              </div>

              {/* Nav Links */}
              <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div key={link.href}
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}>
                    <Link href={link.href} onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-4 rounded-2xl font-semibold text-base transition-all active:scale-95"
                      style={{
                        color: isDark ? '#F0E8DC' : '#374151',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = isDark ? 'rgba(232,160,64,0.12)' : 'rgba(200,75,17,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span className="text-2xl w-8 text-center">{link.icon}</span>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                {isAuthenticated && (
                  <div className="pt-2 border-t mt-2" style={{ borderColor: isDark ? '#1E3250' : '#E2D9CC' }}>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-4 rounded-2xl font-semibold text-base"
                        style={{ color: isDark ? '#E8A040' : '#1A3A5C', background: isDark ? 'rgba(232,160,64,0.1)' : 'rgba(26,58,92,0.07)' }}>
                        <span className="text-2xl w-8 text-center">⚙️</span> Admin Panel
                      </Link>
                    )}
                    <button onClick={() => { logout(); setIsOpen(false); }}
                      className="flex items-center gap-3 px-4 py-4 rounded-2xl font-semibold text-base w-full text-left text-red-500">
                      <span className="text-2xl w-8 text-center">🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom CTAs */}
              <div className="p-4 space-y-3 border-t" style={{
                borderColor: isDark ? '#1E3250' : '#E2D9CC',
                paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))'
              }}>
                <a href="https://wa.me/917337843016?text=Hello%20Shree%20Devi%20Services%2C%20I%20need%20help."
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl text-white font-bold text-base active:scale-95 transition-transform"
                  style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}>
                  {WA_ICON} Chat on WhatsApp
                </a>
                <a href="tel:+917337843016"
                  className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-bold text-base active:scale-95 transition-transform border"
                  style={{
                    color: isDark ? '#E8A040' : '#1A3A5C',
                    background: isDark ? 'rgba(232,160,64,0.1)' : 'rgba(26,58,92,0.07)',
                    borderColor: isDark ? 'rgba(232,160,64,0.25)' : 'rgba(26,58,92,0.15)',
                  }}>
                  <Phone className="w-5 h-5" /> Call: +91 73378 43016
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
