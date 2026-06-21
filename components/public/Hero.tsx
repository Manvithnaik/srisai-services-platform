'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Phone, Zap, Droplet, Wrench, Waves, Hammer, Home } from 'lucide-react';

const WA_ICON = (
  <svg className="w-6 h-6 fill-current flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" />
  </svg>
);

const serviceChips = [
  { icon: Zap,    label: 'Electrical', bg: '#FFF3E0', color: '#E65100' },
  { icon: Droplet,label: 'Plumbing',   bg: '#E3F2FD', color: '#0D47A1' },
  { icon: Wrench, label: 'Appliances', bg: '#F3E5F5', color: '#6A1B9A' },
  { icon: Waves,  label: 'Water Tank', bg: '#E0F7FA', color: '#006064' },
  { icon: Hammer, label: 'Handywork',  bg: '#FBE9E7', color: '#BF360C' },
  { icon: Home,   label: 'Maintenance',bg: '#E8F5E9', color: '#1B5E20' },
];

const trustBadges = [
  { emoji: '⚡', text: 'Same-Day Service' },
  { emoji: '✅', text: 'Verified Experts' },
  { emoji: '📞', text: '24/7 Support' },
  { emoji: '🛡️', text: '90-Day Guarantee' },
];

const stats = [
  { value: '2000+', label: 'Happy Families' },
  { value: '5K+',   label: 'Jobs Done' },
  { value: '4.8★',  label: 'Rating' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center">

      {/* ── Background photo ── */}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.jpg"
          alt="Professional home maintenance service in Udupi"
          fill
          className="object-cover object-center"
          priority
          quality={90}
          sizes="100vw"
        />
        {/* 
          Light mode: light-left dark-right gradient so the photo shows on right
          Dark mode: deeper overlay
        */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              /* left column — readable text area */
              'linear-gradient(100deg,',
              '  rgba(13,34,64,0.88) 0%,',
              '  rgba(26,58,92,0.75) 38%,',
              '  rgba(26,58,92,0.45) 60%,',
              '  rgba(13,34,64,0.25) 100%)',
            ].join(''),
          }}
        />
        {/* subtle warm tint to pull out the terracotta tones */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(200,75,17,0.06) 0%, transparent 60%)' }} />
      </div>

      {/* Decorative light blooms */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, #C88A10 0%, transparent 70%)', transform: 'translate(-30%,-30%)' }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(circle, #C84B11 0%, transparent 70%)', transform: 'translate(30%,30%)' }} />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="max-w-2xl flex flex-col gap-7">

          {/* Top pill */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white"
              style={{ background: 'rgba(200,75,17,0.65)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}>
              📍 Udupi's Most Trusted Home Service
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight drop-shadow-lg">
            Home Repairs Made{' '}
            <span className="relative inline-block">
              <span style={{ background: 'linear-gradient(135deg,#F5A623,#E8702A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Easy & Fast
              </span>
              <motion.div className="absolute -bottom-1 left-0 right-0 h-1 rounded-full"
                style={{ background: 'linear-gradient(90deg,#F5A623,#E8702A)' }}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.9 }} />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/90 leading-relaxed font-medium drop-shadow max-w-xl">
            Electricians, Plumbers &amp; Technicians at your door — same day. Trusted by 2000+ families across Udupi district.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4">
            <Link href="/file-complaint" className="btn-terra flex-1 text-lg justify-center">
              📋 Book a Service
            </Link>
            <a href="https://wa.me/917337843016?text=Hello%20Shree%20Devi%20Services%2C%20I%20need%20help."
              target="_blank" rel="noopener noreferrer"
              className="btn-whatsapp flex-1 text-lg justify-center">
              {WA_ICON} WhatsApp Now
            </a>
          </motion.div>

          {/* Service quick-picks */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}>
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-3">What do you need?</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {serviceChips.map((chip, i) => (
                <motion.div key={chip.label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.94 }}>
                  <Link href="/file-complaint"
                    className="flex flex-col items-center gap-2 px-2 py-3 rounded-2xl cursor-pointer transition-all"
                    style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: chip.bg }}>
                      <chip.icon className="w-5 h-5" style={{ color: chip.color }} strokeWidth={2.5} />
                    </div>
                    <span className="text-white text-[11px] font-bold text-center leading-tight">{chip.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-2">
            {trustBadges.map(b => (
              <span key={b.text}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold text-white"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)' }}>
                {b.emoji} {b.text}
              </span>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="flex gap-5 pt-1">
            {stats.map(s => (
              <div key={s.label} className="text-center px-4 py-3 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}>
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-white/70 text-xs font-semibold mt-0.5 leading-tight">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Phone CTA */}
          <motion.a href="tel:+917337843016" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-medium text-sm group w-fit">
            <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Emergency? Call: <span className="font-black text-white">+91 73378 43016</span>
          </motion.a>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none" className="w-full h-12">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="var(--background)" />
        </svg>
      </div>
    </section>
  );
}
