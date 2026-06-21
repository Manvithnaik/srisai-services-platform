'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Phone, Zap, Droplet, Wrench, Waves, Hammer, Home, CheckCircle } from 'lucide-react';

const WA_ICON = (
  <svg className="w-6 h-6 fill-current flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" />
  </svg>
);

const serviceChips = [
  { icon: Zap, label: 'Electrical', color: '#FFF8E1', iconColor: '#F57C00' },
  { icon: Droplet, label: 'Plumbing', color: '#E3F2FD', iconColor: '#1565C0' },
  { icon: Wrench, label: 'Appliances', color: '#F3E5F5', iconColor: '#7B1FA2' },
  { icon: Waves, label: 'Water Tank', color: '#E0F7FA', iconColor: '#00838F' },
  { icon: Hammer, label: 'Handywork', color: '#FBE9E7', iconColor: '#BF360C' },
  { icon: Home, label: 'Maintenance', color: '#E8F5E9', iconColor: '#2E7D32' },
];

const trustBadges = [
  { emoji: '⚡', text: 'Same-Day Service' },
  { emoji: '✅', text: 'Verified Experts' },
  { emoji: '📞', text: '24/7 Support' },
  { emoji: '💯', text: 'Satisfaction Guaranteed' },
];

const stats = [
  { value: '2000+', label: 'Happy Families', color: '#1565C0' },
  { value: '5K+', label: 'Jobs Done', color: '#F57C00' },
  { value: '4.8★', label: 'Customer Rating', color: '#2E7D32' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: '#0D47A1' }}>
      {/* ── Background photo ── */}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.jpg"
          alt="Professional home maintenance service in Udupi"
          fill
          className="object-cover object-center"
          priority
          quality={85}
          sizes="100vw"
        />
        {/* Multi-layer gradient overlay for readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, rgba(13,71,161,0.90) 0%, rgba(21,101,192,0.82) 40%, rgba(25,118,210,0.78) 70%, rgba(30,58,95,0.92) 100%)',
          }}
        />
        {/* Bottom fade to match page bg */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, rgba(13,71,161,0.5))' }} />
      </div>

      {/* Decorative blobs on top of photo */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #F57C00 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #42A5F5 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />
      <div className="absolute inset-0 hero-pattern pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="flex flex-col items-center text-center gap-8">

          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.95)' }}>
              📍 Trusted in Udupi, Shankarpura & Nearby Areas
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
              Home Repairs Made{' '}
              <span className="relative inline-block">
                <span style={{
                  background: 'linear-gradient(135deg, #FFD54F, #FFB300)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Easy & Fast
                </span>
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-1 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #FFD54F, #FFB300)' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                />
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed font-medium">
              Electricians, Plumbers & Technicians at your door — same day. Just tap below to book or WhatsApp us.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto"
          >
            <Link
              href="/file-complaint"
              className="btn-primary flex-1 text-lg justify-center"
              style={{ background: 'linear-gradient(135deg, #F57C00, #FF9800)', boxShadow: '0 6px 24px rgba(245,124,0,0.45)' }}
            >
              📋 Book a Service
            </Link>
            <a
              href="https://wa.me/917337843016?text=Hello%20Shree%20Devi%20Services%2C%20I%20need%20help%20with%20a%20service."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp flex-1 text-lg justify-center"
            >
              {WA_ICON}
              WhatsApp Now
            </a>
          </motion.div>

          {/* Service Quick-Picks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-2xl"
          >
            <p className="text-blue-200 text-sm font-semibold mb-4 uppercase tracking-widest">What do you need?</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {serviceChips.map((chip, i) => (
                <motion.div
                  key={chip.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.94 }}
                >
                  <Link
                    href="/file-complaint"
                    className="flex flex-col items-center gap-2 px-3 py-3.5 rounded-2xl cursor-pointer transition-all"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: chip.color }}>
                      <chip.icon className="w-5 h-5" style={{ color: chip.iconColor }} strokeWidth={2.5} />
                    </div>
                    <span className="text-white text-xs font-semibold text-center leading-tight">{chip.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {trustBadges.map((badge) => (
              <span
                key={badge.text}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold text-white"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <span>{badge.emoji}</span>
                {badge.text}
              </span>
            ))}
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-3 gap-4 w-full max-w-xl pt-2"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-blue-200 text-xs font-semibold mt-1 leading-tight">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Phone CTA */}
          <motion.a
            href="tel:+917337843016"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors font-medium text-sm group"
          >
            <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Emergency? Call directly: <span className="font-bold text-white">+91 73378 43016</span>
          </motion.a>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#F8FAFF" />
        </svg>
      </div>
    </section>
  );
}
