'use client';

import { motion, Variants } from 'framer-motion';
import { Zap, Droplet, Wrench } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const features = [
    { icon: Zap, label: 'Electricians', color: 'text-blue-600' },
    { icon: Droplet, label: 'Plumbers', color: 'text-cyan-500' },
    { icon: Wrench, label: 'Technicians', color: 'text-orange-500' },
  ];

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/hero-plumber.png)', backgroundAttachment: 'fixed' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/60 via-blue-900/50 to-blue-950/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/40 to-blue-950/70" />

      {/* Animated blobs */}
      <motion.div
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 right-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 left-10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col justify-center min-h-[90vh]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white/90 rounded-full text-sm font-semibold border border-white/30">
              ✦ Udupi's Trusted Maintenance Experts
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.h1
              className="text-5xl md:text-7xl font-bold leading-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-blue-300 to-blue-200 bg-clip-text text-transparent drop-shadow-lg">
                Shree Devi
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent drop-shadow-lg">
                Services
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-lg"
            >
              Fast Electrical & Plumbing Support. Trusted by Udupi families. Same-day service. Emergency support 24/7.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <motion.a
              whileHover={{ scale: 1.08, boxShadow: '0 25px 50px rgba(6, 102, 255, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              href="/file-complaint"
              className="px-10 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white rounded-full font-bold text-lg hover:shadow-2xl transition-all border border-blue-400/30 backdrop-blur-sm"
            >
              Book Service Now
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.08, boxShadow: '0 25px 50px rgba(34, 197, 94, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/917337843016?text=Hello%20Shree%20Devi%20Services%2C%20I%20would%20like%20assistance%20with%20a%20maintenance%20issue."
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white rounded-full font-bold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2.5 border border-green-400/30 backdrop-blur-sm"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" />
              </svg>
              Emergency Support
            </motion.a>
          </motion.div>

          {/* Feature Icons */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-8 pt-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                whileHover={{ y: -10 }}
                className="flex flex-col items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20"
                >
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </motion.div>
                <p className="font-semibold text-white/90 drop-shadow-lg">{feature.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6 pt-10 text-center">
            {[
              { stat: '2000+', label: 'Happy Customers', color: 'from-blue-300 to-blue-200' },
              { stat: '5K+', label: 'Services Done', color: 'from-orange-300 to-amber-200' },
              { stat: '4.8★', label: 'Average Rating', color: 'from-amber-300 to-yellow-200' },
            ].map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ scale: 1.08, y: -5 }}
                className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:bg-white/15 transition-all"
              >
                <p className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent drop-shadow-lg`}>
                  {item.stat}
                </p>
                <p className="text-sm font-semibold text-white/80 mt-2 drop-shadow">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating WhatsApp Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-xl opacity-50"
        />
        <motion.a
          href="https://wa.me/917337843016?text=Hello%20Shree%20Devi%20Services%2C%20I%20would%20like%20assistance%20with%20a%20maintenance%20issue."
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.15, boxShadow: '0 20px 40px rgba(34, 197, 94, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          className="relative w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-green-500/60 transition-all border-2 border-green-400/30"
        >
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" />
          </svg>
        </motion.a>
      </motion.div>
    </section>
  );
}
