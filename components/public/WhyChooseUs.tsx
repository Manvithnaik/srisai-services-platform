'use client';

import { motion } from 'framer-motion';

const benefits = [
  { emoji: '⚡', title: 'Same-Day Service', desc: 'Most jobs done the same day you call. No long waits.', color: '#F57C00', bg: '#FFF8E1' },
  { emoji: '✅', title: 'Verified Technicians', desc: 'All our experts are background-checked and trained.', color: '#1565C0', bg: '#E3F2FD' },
  { emoji: '💰', title: 'Fair & Clear Pricing', desc: 'No hidden charges. You get a quote before work starts.', color: '#2E7D32', bg: '#E8F5E9' },
  { emoji: '📍', title: 'Locally Trusted', desc: '2000+ families in Udupi district trust us. We know your area.', color: '#7B1FA2', bg: '#F3E5F5' },
  { emoji: '🛡️', title: '90-Day Guarantee', desc: 'All repairs guaranteed. Issues after? We come back free.', color: '#00838F', bg: '#E0F7FA' },
  { emoji: '🌙', title: '24/7 Emergency', desc: 'Broken down at midnight? Call us. We respond fast.', color: '#BF360C', bg: '#FBE9E7' },
];

export function WhyChooseUs() {
  return (
    <section className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-badge mb-4 inline-flex">💪 Why Choose Us</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A2E] mb-4 leading-tight">
            We're Different. <span className="gradient-text-blue">Here's Why.</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            We don't just fix things — we build trust. That's why thousands of families keep calling us back.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex items-start gap-4 p-6 rounded-3xl transition-all cursor-default"
              style={{
                background: 'white',
                border: `2px solid ${b.color}15`,
                boxShadow: '0 2px 12px rgba(21,101,192,0.06)',
              }}
            >
              {/* Emoji icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: b.bg }}
              >
                {b.emoji}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-black text-[#1A1A2E] mb-1">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left"
          style={{ background: 'linear-gradient(135deg, #F8FAFF, #EEF2FF)', border: '2px solid #1565C020' }}
        >
          <div className="text-6xl flex-shrink-0">🏆</div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-[#1A1A2E] mb-2">Udupi's Most Trusted Home Service</h3>
            <p className="text-gray-500 text-base">
              Serving Shankarpura and surrounding areas since 2020. Over <strong className="text-[#1565C0]">2,000 happy families</strong>, <strong className="text-[#F57C00]">5,000+ completed jobs</strong>, and a <strong className="text-[#2E7D32]">4.8★ average rating</strong>.
            </p>
          </div>
          <div className="flex gap-6 flex-shrink-0">
            {[
              { num: '2000+', label: 'Families' },
              { num: '4.8★', label: 'Rating' },
              { num: '5K+', label: 'Jobs' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-black text-[#1565C0]">{stat.num}</p>
                <p className="text-xs text-gray-500 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
