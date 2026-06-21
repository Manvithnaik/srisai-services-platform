'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const steps = [
  {
    step: '1',
    emoji: '📋',
    title: 'Tell Us Your Problem',
    description: 'Fill our simple form or WhatsApp us. Describe the issue and add photos if you have them.',
    color: '#1565C0',
    bg: '#E3F2FD',
    tip: 'Takes only 2 minutes',
  },
  {
    step: '2',
    emoji: '📞',
    title: 'We Call You Back',
    description: 'Our technician contacts you within 30 minutes to confirm details, time, and cost estimate.',
    color: '#F57C00',
    bg: '#FFF8E1',
    tip: 'Within 30 minutes',
  },
  {
    step: '3',
    emoji: '🏠',
    title: 'Technician Arrives',
    description: 'Our verified expert comes to your home at the agreed time — with all tools ready.',
    color: '#2E7D32',
    bg: '#E8F5E9',
    tip: 'Punctual & professional',
  },
  {
    step: '4',
    emoji: '✅',
    title: 'Problem Fixed!',
    description: 'Work done to your satisfaction. We clean up and you inspect before we leave.',
    color: '#7B1FA2',
    bg: '#F3E5F5',
    tip: '100% satisfaction',
  },
];

export function HowItWorks() {
  return (
    <section className="section-pad bg-white relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-72 h-72 rounded-full opacity-5 pointer-events-none" style={{ background: 'radial-gradient(circle, #1565C0 0%, transparent 70%)' }} />
        <div className="absolute bottom-20 left-0 w-72 h-72 rounded-full opacity-5 pointer-events-none" style={{ background: 'radial-gradient(circle, #F57C00 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-badge mb-4 inline-flex">🪜 Simple Process</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A2E] mb-4 leading-tight">
            How It Works —{' '}
            <span className="gradient-text-orange">4 Easy Steps</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Getting your problem solved is simple. No technical knowledge needed — just tell us what's wrong.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {/* Connector line — desktop only */}
          <div className="hidden lg:block absolute top-12 left-[calc(12.5%+1.5rem)] right-[calc(12.5%+1.5rem)] h-0.5 z-0"
            style={{ background: 'linear-gradient(90deg, #1565C0 0%, #F57C00 33%, #2E7D32 66%, #7B1FA2 100%)', opacity: 0.2 }} />

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="relative flex flex-col items-center text-center p-6 rounded-3xl bg-white border-2 z-10 transition-all"
              style={{ borderColor: `${step.color}20`, boxShadow: '0 4px 20px rgba(21,101,192,0.07)' }}
            >
              {/* Step number bubble */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-md"
                style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}CC)` }}
              >
                {step.emoji}
              </div>

              {/* Step badge */}
              <span
                className="absolute -top-3.5 -right-3.5 w-9 h-9 rounded-full text-white text-sm font-black flex items-center justify-center shadow-lg border-2 border-white"
                style={{ background: step.color }}
              >
                {step.step}
              </span>

              <h3 className="text-lg font-black text-[#1A1A2E] mb-2 leading-tight">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{step.description}</p>

              {/* Tip pill */}
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: step.bg, color: step.color }}
              >
                ⏱ {step.tip}
              </span>

              {/* Arrow for mobile */}
              {i < steps.length - 1 && (
                <div className="lg:hidden mt-4 text-gray-300 text-2xl">↓</div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/file-complaint" className="btn-primary text-lg inline-flex">
            📋 Start Your Request Now
          </Link>
          <p className="text-gray-400 text-sm mt-3">Free to submit · No payment needed upfront</p>
        </motion.div>
      </div>
    </section>
  );
}
