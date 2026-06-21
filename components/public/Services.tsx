'use client';

import { motion } from 'framer-motion';
import { Zap, Droplet, Waves, Wrench, Hammer, Home, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const WA_LINK = 'https://wa.me/917337843016?text=Hello%20Shree%20Devi%20Services%2C%20I%20need%20help%20with%20a%20service.';

const services = [
  {
    icon: Zap,
    emoji: '⚡',
    title: 'Electrical',
    subtitle: 'Wiring & Repairs',
    description: 'Switches, sockets, fans, LED lights, circuit faults, power failures',
    color: '#F57C00',
    bgLight: '#FFF8E1',
    bgDark: '#E65100',
    gradient: 'linear-gradient(135deg, #F57C00, #FF9800)',
  },
  {
    icon: Droplet,
    emoji: '💧',
    title: 'Plumbing',
    subtitle: 'Leaks & Pipes',
    description: 'Taps, pipes, drainage, water heaters, bathroom fittings',
    color: '#1565C0',
    bgLight: '#E3F2FD',
    bgDark: '#0D47A1',
    gradient: 'linear-gradient(135deg, #1565C0, #42A5F5)',
  },
  {
    icon: Waves,
    emoji: '🌊',
    title: 'Water Tank',
    subtitle: 'Deep Cleaning',
    description: 'Tank cleaning, disinfection, bacterial removal, maintenance',
    color: '#00838F',
    bgLight: '#E0F7FA',
    bgDark: '#006064',
    gradient: 'linear-gradient(135deg, #00838F, #26C6DA)',
  },
  {
    icon: Wrench,
    emoji: '🔧',
    title: 'Appliance Repair',
    subtitle: 'Fix Any Device',
    description: 'AC, fridge, washing machine, geyser, TV, microwave',
    color: '#7B1FA2',
    bgLight: '#F3E5F5',
    bgDark: '#4A148C',
    gradient: 'linear-gradient(135deg, #7B1FA2, #CE93D8)',
  },
  {
    icon: Hammer,
    emoji: '🔨',
    title: 'Handywork',
    subtitle: 'General Fixing',
    description: 'Shelves, doors, locks, hinges, furniture assembly',
    color: '#BF360C',
    bgLight: '#FBE9E7',
    bgDark: '#870000',
    gradient: 'linear-gradient(135deg, #BF360C, #FF7043)',
  },
  {
    icon: Home,
    emoji: '🏠',
    title: 'Home Maintenance',
    subtitle: 'Regular Upkeep',
    description: 'Preventive checkups, emergency fixes, general repairs',
    color: '#2E7D32',
    bgLight: '#E8F5E9',
    bgDark: '#1B5E20',
    gradient: 'linear-gradient(135deg, #2E7D32, #66BB6A)',
  },
];

export function Services() {
  return (
    <section id="services" className="section-pad bg-[#F8FAFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-badge mb-4 inline-flex">🛠️ Our Services</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A2E] mb-4 leading-tight">
            Everything Your Home Needs,{' '}
            <span className="gradient-text-blue">All in One Place</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Expert technicians ready for any repair or maintenance job. Same-day service, fair pricing.
          </p>
        </motion.div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="service-card group relative overflow-hidden"
            >
              {/* Color accent top bar */}
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: svc.gradient }} />

              {/* Icon area */}
              <div className="flex items-start gap-4 mb-5">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.4 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-md"
                  style={{ background: svc.gradient }}
                >
                  <span className="text-2xl">{svc.emoji}</span>
                </motion.div>
                <div className="flex-1 min-w-0 pt-1">
                  <h3 className="text-xl font-black text-[#1A1A2E] leading-tight">{svc.title}</h3>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: svc.color }}>{svc.subtitle}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{svc.description}</p>

              {/* CTA */}
              <Link
                href="/file-complaint"
                className="flex items-center gap-2 text-sm font-bold transition-all group-hover:gap-3 w-fit"
                style={{ color: svc.color }}
              >
                Book This Service
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Emergency CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 relative overflow-hidden rounded-3xl p-8 md:p-12 text-center"
          style={{ background: 'linear-gradient(135deg, #0D47A1, #1565C0)' }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
            🚨 Need Emergency Help?
          </h3>
          <p className="text-blue-200 mb-7 text-base md:text-lg max-w-xl mx-auto">
            We're available <strong className="text-white">24/7</strong> for urgent repairs. Contact us directly on WhatsApp or call — we respond within 15 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp flex-1 text-base"
            >
              <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" /></svg>
              WhatsApp Now
            </a>
            <a
              href="tel:+917337843016"
              className="flex items-center justify-center gap-2 flex-1 min-h-[56px] rounded-full font-bold text-base text-[#1565C0] bg-white hover:bg-blue-50 transition-colors"
            >
              📞 Call Now
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
