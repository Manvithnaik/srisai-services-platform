'use client';

import { motion } from 'framer-motion';

const benefits = [
  { emoji:'⚡', title:'Same-Day Service',      desc:'Most jobs done the same day. No long waits.', color:'#C84B11', bg:'#FFF3E0' },
  { emoji:'✅', title:'Verified Technicians',  desc:'All our experts are background-checked and trained.', color:'#1A3A5C', bg:'#EAF0F8' },
  { emoji:'💰', title:'Fair & Clear Pricing',  desc:'No hidden charges. You get a quote before work starts.', color:'#2D5A27', bg:'#E8F5E9' },
  { emoji:'📍', title:'Locally Trusted',        desc:'2000+ families in Udupi district trust us. We know your area.', color:'#C88A10', bg:'#FDF3DC' },
  { emoji:'🛡️', title:'90-Day Guarantee',      desc:'All repairs guaranteed. Issues after? We come back free.', color:'#00696F', bg:'#E0F4F5' },
  { emoji:'🌙', title:'24/7 Emergency',         desc:'Broken down at midnight? Call us. We respond fast.', color:'#6A1B9A', bg:'#F3E5F5' },
];

export function WhyChooseUs() {
  return (
    <section className="section-pad bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-14">
          <span className="section-badge mb-4 inline-flex">💪 Why Choose Us</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight">
            We're Different. <span className="gradient-text-terra">Here's Why.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            We don't just fix things — we build trust. That's why thousands of families keep calling us back.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, i) => (
            <motion.div key={b.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.09 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex items-start gap-4 p-6 rounded-3xl transition-all cursor-default bg-card border-2 interactive-glow-card"
              style={{
                borderColor: `${b.color}15`,
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                '--glow-card-color': b.color,
                '--glow-card-shadow': `${b.color}40`,
                '--glow-card-shadow-subtle': `${b.color}20`,
              } as React.CSSProperties}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: b.bg }}>
                {b.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-black text-foreground mb-1">{b.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="mt-12 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left border-2"
          style={{ background: 'linear-gradient(135deg,rgba(26,58,92,0.06),rgba(200,75,17,0.06))', borderColor: 'rgba(200,75,17,0.15)' }}>
          <div className="text-6xl flex-shrink-0">🏆</div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-foreground mb-2">Udupi's Most Trusted Home Service</h3>
            <p className="text-muted-foreground text-base">
              Serving Shankarpura and surrounding areas since 2020. Over{' '}
              <strong className="text-[#1A3A5C] dark:text-[#E8A040]">2,000 happy families</strong>,{' '}
              <strong className="text-[#C84B11]">5,000+ completed jobs</strong>, and a{' '}
              <strong className="text-[#2D5A27] dark:text-[#4A9A40]">4.8★ average rating</strong>.
            </p>
          </div>
          <div className="flex gap-6 flex-shrink-0">
            {[{num:'2000+',label:'Families',c:'#1A3A5C'},{num:'4.8★',label:'Rating',c:'#C88A10'},{num:'5K+',label:'Jobs',c:'#C84B11'}].map(s=>(
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black" style={{ color: s.c }}>{s.num}</p>
                <p className="text-xs text-muted-foreground font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
