'use client';

import { motion } from 'framer-motion';
import { Zap, Droplet, Waves, Wrench, Hammer, Home } from 'lucide-react';

const services = [
  {
    icon: Zap,
    title: 'Electrical',
    description: 'Wiring, switches, circuit breakers, LED installation, emergency repairs',
    color: 'from-blue-400 to-blue-600',
    emoji: '⚡',
  },
  {
    icon: Droplet,
    title: 'Plumbing',
    description: 'Leaks, pipes, taps, drainage, water heater issues, installations',
    color: 'from-cyan-400 to-cyan-600',
    emoji: '💧',
  },
  {
    icon: Waves,
    title: 'Water Tank Cleaning',
    description: 'Deep cleaning, disinfection, maintenance, bacterial removal',
    color: 'from-teal-400 to-teal-600',
    emoji: '🌊',
  },
  {
    icon: Wrench,
    title: 'Appliance Repair',
    description: 'Fridges, ACs, washing machines, microwave, TV repairs',
    color: 'from-orange-400 to-orange-600',
    emoji: '🔧',
  },
  {
    icon: Hammer,
    title: 'Handywork',
    description: 'Shelves, doors, locks, hinges, general fixing and assembly',
    color: 'from-amber-400 to-amber-600',
    emoji: '🔨',
  },
  {
    icon: Home,
    title: 'Home Maintenance',
    description: 'Regular checkups, preventive maintenance, emergency fixes',
    color: 'from-rose-400 to-rose-600',
    emoji: '🏠',
  },
];

export default function Services() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="services" className="py-32 bg-gradient-to-b from-white via-blue-50/20 to-gray-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-40 right-0 w-80 h-80 bg-orange-200/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute -bottom-40 left-0 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl pointer-events-none"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div 
            className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-orange-100 rounded-full mb-4 border border-blue-200/50"
          >
            <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent font-semibold text-sm">Our Complete Solution</span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-orange-500 bg-clip-text text-transparent leading-tight">
              Professional Home Services
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
            Expert technicians for every home maintenance need. Same-day service. Trusted by families across Udupi district.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              whileHover={{ y: -12, boxShadow: '0 30px 60px rgba(0,0,0,0.15)' }}
              className="relative bg-white rounded-3xl p-8 border border-gray-100 hover:border-blue-200/50 transition-all cursor-pointer group overflow-hidden"
            >
              {/* Background accent */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${service.color} opacity-5 rounded-full pointer-events-none group-hover:opacity-10 transition-opacity`} />
              
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.5 }}
                className={`relative w-20 h-20 rounded-3xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:shadow-2xl transition-all shadow-lg border border-white/30`}
              >
                <service.icon className="w-10 h-10 text-white" />
              </motion.div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-orange-500 group-hover:bg-clip-text transition-all">{service.title}</h3>
              <p className="text-gray-600 mb-7 leading-relaxed font-medium text-sm">{service.description}</p>

              <motion.a
                whileHover={{ x: 6 }}
                              href="https://wa.me/917337843016?text=Hello%20Shree%20Devi%20Services%2C%20I%20would%20like%20assistance%20with%20a%20maintenance%20issue."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold px-6 py-2.5 rounded-full hover:shadow-lg transition-all hover:to-blue-800"
              >
                Get Service
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </motion.a>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 relative overflow-hidden rounded-3xl"
        >
          {/* Gradient background with accent */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-orange-600" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-32 -right-32 w-64 h-64 bg-white/10 rounded-full pointer-events-none"
          />
          
          <div className="relative p-10 md:p-16 text-white text-center">
            <motion.h3 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Can't find your service?
            </motion.h3>
            <p className="text-blue-50 mb-8 text-xl font-medium max-w-2xl mx-auto">
              Contact us directly on WhatsApp. We handle custom requests and emergency cases <span className="font-bold">24/7</span>.
            </p>
            <motion.a
              whileHover={{ scale: 1.1, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
              whileTap={{ scale: 0.95 }}
                            href="https://wa.me/917337843016?text=Hello%20Shree%20Devi%20Services%2C%20I%20would%20like%20assistance%20with%20a%20maintenance%20issue."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 bg-white text-blue-700 font-bold rounded-full hover:shadow-2xl transition-all border-2 border-white/30 text-lg"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" />
              </svg>
              Chat with us on WhatsApp
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
