'use client';

import { motion } from 'framer-motion';
import { Zap, Droplet, Waves, Wrench, Hammer, Home, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const WA_LINK = 'https://wa.me/917337843016?text=Hello%20Shree%20Devi%20Services%2C%20I%20need%20help%20with%20a%20service.';

const services = [
  { icon: Zap,    emoji: '⚡', title: 'Electrical',       subtitle: 'Wiring & Repairs',    description: 'Switches, sockets, fans, LED lights, circuit faults, power failures', color: '#C84B11', bg: '#FFF3E0', gradient: 'linear-gradient(135deg,#C84B11,#E05A1A)' },
  { icon: Droplet,emoji: '💧', title: 'Plumbing',          subtitle: 'Leaks & Pipes',       description: 'Taps, pipes, drainage, water heaters, bathroom fittings', color: '#1A3A5C', bg: '#EAF0F8', gradient: 'linear-gradient(135deg,#1A3A5C,#2A5080)' },
  { icon: Waves,  emoji: '🌊', title: 'Water Tank',        subtitle: 'Deep Cleaning',       description: 'Tank cleaning, disinfection, bacterial removal, maintenance', color: '#00696F', bg: '#E0F4F5', gradient: 'linear-gradient(135deg,#00696F,#26BCC6)' },
  { icon: Wrench, emoji: '🔧', title: 'Appliance Repair',  subtitle: 'Fix Any Device',      description: 'AC, fridge, washing machine, geyser, TV, microwave', color: '#6A1B9A', bg: '#F3E5F5', gradient: 'linear-gradient(135deg,#6A1B9A,#9C27B0)' },
  { icon: Hammer, emoji: '🔨', title: 'Handywork',         subtitle: 'General Fixing',      description: 'Shelves, doors, locks, hinges, furniture assembly', color: '#C88A10', bg: '#FDF3DC', gradient: 'linear-gradient(135deg,#C88A10,#E8A020)' },
  { icon: Home,   emoji: '🏠', title: 'Home Maintenance',  subtitle: 'Regular Upkeep',      description: 'Preventive checkups, emergency fixes, general repairs', color: '#2D5A27', bg: '#E8F5E9', gradient: 'linear-gradient(135deg,#2D5A27,#3D7A35)' },
];

export function Services() {
  return (
    <section id="services" className="section-pad bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-14">
          <span className="section-badge mb-4 inline-flex">🛠️ Our Services</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight">
            Everything Your Home Needs,{' '}
            <span className="gradient-text-terra">All in One Place</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Expert technicians ready for any repair job. Same-day service, fair pricing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, i) => (
            <motion.div key={svc.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="service-card group relative overflow-hidden"
              style={{
                '--svc-color': svc.color,
                '--svc-glow': `${svc.color}40`,
                '--svc-glow-subtle': `${svc.color}20`
              } as React.CSSProperties}>
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: svc.gradient }} />
              <div className="flex items-start gap-4 mb-5">
                <motion.div whileHover={{ rotate: [0,-10,10,0] }} transition={{ duration: 0.4 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-md"
                  style={{ background: svc.gradient }}>
                  <span className="text-2xl">{svc.emoji}</span>
                </motion.div>
                <div className="flex-1 min-w-0 pt-1">
                  <h3 className="text-xl font-black text-foreground leading-tight">{svc.title}</h3>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: svc.color }}>{svc.subtitle}</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{svc.description}</p>
              <Link href="/file-complaint"
                className="flex items-center gap-2 text-sm font-bold transition-all group-hover:gap-3 w-fit"
                style={{ color: svc.color }}>
                Book This Service <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Emergency CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="mt-12 relative overflow-hidden rounded-3xl p-8 md:p-12 text-center"
          style={{ background: 'linear-gradient(135deg,#A03A0A,#C84B11)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle,white,transparent)', transform: 'translate(30%,-30%)' }} />
          <h3 className="text-2xl md:text-3xl font-black text-white mb-3">🚨 Need Emergency Help?</h3>
          <p className="text-orange-100 mb-7 text-base md:text-lg max-w-xl mx-auto">
            Available <strong className="text-white">24/7</strong> for urgent repairs. We respond within 15 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="btn-whatsapp flex-1 text-base">
              <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" /></svg>
              WhatsApp Now
            </a>
            <a href="tel:+917337843016"
              className="flex items-center justify-center gap-2 flex-1 min-h-[56px] rounded-full font-bold text-base bg-white hover:bg-orange-50 transition-colors"
              style={{ color: '#C84B11' }}>
              📞 Call Now
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
