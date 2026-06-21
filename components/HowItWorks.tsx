'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const steps = [
  { step:'1', emoji:'📋', title:'Tell Us Your Problem',  description:'Fill our simple form or WhatsApp us. Describe the issue and add photos.', color:'#C84B11', bg:'#FFF3E0', tip:'Takes only 2 minutes' },
  { step:'2', emoji:'📞', title:'We Call You Back',      description:'Our technician contacts you within 30 minutes to confirm details and cost.', color:'#1A3A5C', bg:'#EAF0F8', tip:'Within 30 minutes' },
  { step:'3', emoji:'🏠', title:'Technician Arrives',    description:'Our verified expert comes to your home at the agreed time — tools ready.', color:'#2D5A27', bg:'#E8F5E9', tip:'Punctual & professional' },
  { step:'4', emoji:'✅', title:'Problem Fixed!',        description:'Work done to your satisfaction. We clean up and you inspect before we leave.', color:'#C88A10', bg:'#FDF3DC', tip:'100% satisfaction' },
];

export function HowItWorks() {
  return (
    <section className="section-pad bg-card relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-72 h-72 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle,#C84B11,transparent)', transform: 'translateX(30%)' }} />
        <div className="absolute bottom-20 left-0 w-72 h-72 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle,#1A3A5C,transparent)', transform: 'translateX(-30%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-14">
          <span className="section-badge mb-4 inline-flex">🪜 Simple Process</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight">
            How It Works —{' '}
            <span className="gradient-text-primary">4 Easy Steps</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Getting your problem solved is simple. No technical knowledge needed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          <div className="hidden lg:block absolute top-12 left-[calc(12.5%+1.5rem)] right-[calc(12.5%+1.5rem)] h-0.5 z-0 opacity-15"
            style={{ background: 'linear-gradient(90deg,#C84B11,#1A3A5C,#2D5A27,#C88A10)' }} />

          {steps.map((s, i) => (
            <motion.div key={s.step}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              whileHover={{ y: -5 }}
              className="relative flex flex-col items-center text-center p-6 rounded-3xl bg-card z-10 transition-all border-2"
              style={{ borderColor: `${s.color}15`, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-md"
                style={{ background: `linear-gradient(135deg,${s.color},${s.color}BB)` }}>
                {s.emoji}
              </div>
              <span className="absolute -top-3.5 -right-3.5 w-9 h-9 rounded-full text-white text-sm font-black flex items-center justify-center shadow-lg border-2 border-card"
                style={{ background: s.color }}>
                {s.step}
              </span>
              <h3 className="text-lg font-black text-foreground mb-2 leading-tight">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{s.description}</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: s.bg, color: s.color }}>
                ⏱ {s.tip}
              </span>
              {i < steps.length - 1 && <div className="lg:hidden mt-4 text-muted-foreground text-2xl">↓</div>}
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.5 }}
          className="text-center mt-12">
          <Link href="/file-complaint" className="btn-terra text-lg inline-flex">
            📋 Start Your Request Now
          </Link>
          <p className="text-muted-foreground text-sm mt-3">Free to submit · No payment needed upfront</p>
        </motion.div>
      </div>
    </section>
  );
}
